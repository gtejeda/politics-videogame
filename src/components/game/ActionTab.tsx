'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoardPath } from './BoardPath';
import { DecisionCard } from './DecisionCard';
import { VotingPanel } from './VotingPanel';
import { DiceRoll } from './DiceRoll';
import { Timer } from './Timer';
import { ProposerView } from './ProposerView';
import { ObserverView } from './ObserverView';
import { DeliberationTimer } from './DeliberationTimer';
import { DealTracker } from './DealTracker';
import { FirstGameHints } from './FirstGameHints';
import type { RoomStatePayload } from '@/lib/game/events';
import type { GameActions } from '@/lib/hooks/useGameState';

interface ActionTabProps {
  roomState: RoomStatePayload;
  localPlayerId: string | null;
  gameActions: GameActions;
  afkPlayers?: Set<string>;
}

/**
 * ActionTab - Main gameplay content (dice, cards, voting, deliberation)
 *
 * Extracted from Board.tsx for the tabbed layout
 */
export function ActionTab({
  roomState,
  localPlayerId,
  gameActions,
  afkPlayers: _afkPlayers = new Set(),
}: ActionTabProps) {
  const {
    phase,
    currentTurn,
    activePlayerId,
    currentCard,
    currentProposal,
    diceRoll,
    timerEndAt,
    players,
    tokens,
    nation,
    settings,
    activeCrisis,
  } = roomState;

  const isMyTurn = activePlayerId === localPlayerId;
  const activePlayer = players.find((p) => p.id === activePlayerId);
  const localPlayer = players.find((p) => p.id === localPlayerId);

  // FR-019: Get ready/waiting counts for two-phase voting
  const readyToNegotiate = roomState.readyToNegotiate || [];
  const readyPlayerCount = readyToNegotiate.length;
  const totalPlayerCount = players.length;
  const isLocalPlayerReady = localPlayerId ? readyToNegotiate.includes(localPlayerId) : false;

  // Get phase display text
  const phaseText = useMemo(() => {
    switch (phase) {
      case 'waiting':
        return isMyTurn ? 'Your Turn - Roll the Dice' : `${activePlayer?.name}'s Turn`;
      case 'rolling':
        return 'Rolling...';
      case 'drawing':
        return 'Drawing Card...';
      case 'reviewing':
        return isMyTurn ? 'Review & Select Option' : 'Review Phase';
      case 'deliberating':
        return 'Negotiation Phase';
      case 'proposing':
        return 'Choosing Proposal...';
      case 'voting':
        return 'Voting Phase';
      case 'revealing':
        return 'Revealing Votes...';
      case 'resolving':
        return 'Resolving Turn...';
      case 'showingResults':
        return 'Turn Results';
      case 'crisis':
        return 'Crisis Event!';
      default:
        return '';
    }
  }, [phase, isMyTurn, activePlayer]);

  // Can give tokens during deliberation phase
  const canGiveToken =
    phase === 'deliberating' || phase === 'reviewing' || phase === 'proposing';

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Phase Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{phaseText}</h2>
          {phase === 'deliberating' && (
            <p className="text-sm text-muted-foreground">
              Negotiate with other players and make deals
            </p>
          )}
        </div>

        {/* Timer display during deliberation (legacy) */}
        {timerEndAt && phase === 'deliberating' && !roomState.timerStartedAt && (
          <Timer endAt={timerEndAt} />
        )}
      </div>

      {/* First-game contextual hints */}
      <FirstGameHints
        phase={phase}
        currentTurn={currentTurn}
        isMyTurn={isMyTurn}
      />

      {/* FR-021: Full Deliberation Timer during Negotiation Phase */}
      {phase === 'deliberating' && roomState.timerStartedAt && roomState.recommendedDuration && (
        <DeliberationTimer
          timerStartedAt={roomState.timerStartedAt}
          recommendedDuration={roomState.recommendedDuration}
          canPropose={isMyTurn && !currentProposal}
          hasProposed={!!currentProposal}
        />
      )}

      {/* Board Path - Visual game board */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Government Term Path</CardTitle>
        </CardHeader>
        <CardContent>
          <BoardPath
            players={players}
            pathLength={settings.pathLength}
            localPlayerId={localPlayerId}
          />
        </CardContent>
      </Card>

      {/* Main Game Actions */}
      <div className="space-y-4">
        {/* Crisis Placeholder - Crisis panel not currently integrated */}
        {phase === 'crisis' && activeCrisis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🚨</span>
                Crisis Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A crisis is affecting the nation. Work together to resolve it!
              </p>
              <p className="mt-2 text-sm">
                <strong>{activeCrisis.crisis.name}</strong>: {activeCrisis.crisis.description}
              </p>
              <p className="mt-1 text-xs text-amber-600">
                {activeCrisis.turnsRemaining} turns remaining
              </p>
            </CardContent>
          </Card>
        )}

        {/* Dice Roll (waiting phase) */}
        {phase === 'waiting' && isMyTurn && <DiceRoll onRoll={gameActions.rollDice} />}

        {/* Dice Result (after roll) */}
        {diceRoll && phase !== 'waiting' && phase !== 'crisis' && (
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Dice Roll: </span>
            <span className="text-2xl font-bold">{diceRoll}</span>
          </div>
        )}

        {/* FR-019: Review Phase - Proposer View */}
        {phase === 'reviewing' && currentCard && isMyTurn && (
          <ProposerView
            card={currentCard}
            localPlayerIdeology={localPlayer?.ideology || null}
            selectedOption={currentProposal}
            onPropose={gameActions.proposeOption}
            readyPlayerCount={readyPlayerCount}
            totalPlayerCount={totalPlayerCount}
          />
        )}

        {/* FR-032/FR-033/FR-034: Review Phase - Observer View (non-proposer) */}
        {phase === 'reviewing' && currentCard && !isMyTurn && (
          <ObserverView
            card={currentCard}
            localPlayerIdeology={localPlayer?.ideology || null}
            nationState={nation}
            activePlayerName={activePlayer?.name || 'Player'}
            isReady={isLocalPlayerReady}
            onReady={gameActions.markReadyToNegotiate}
          />
        )}

        {/* Decision Card (Deliberating/Negotiation phase) */}
        {(phase === 'deliberating' || phase === 'proposing') && currentCard && (
          <DecisionCard
            card={currentCard}
            selectedOption={currentProposal}
            canPropose={isMyTurn && !currentProposal}
            localPlayerIdeology={localPlayer?.ideology || null}
            onPropose={gameActions.proposeOption}
            gamePhase={phase}
          />
        )}

        {/* Voting Panel */}
        {(phase === 'voting' || phase === 'revealing') && currentProposal && (
          <VotingPanel
            phase={phase}
            currentProposal={currentProposal}
            card={currentCard}
            localPlayer={localPlayer}
            onVote={gameActions.castVote}
          />
        )}

        {/* Deal Tracker - Show during negotiation phases */}
        {(phase === 'deliberating' || phase === 'reviewing' || phase === 'proposing') && (
          <DealTracker
            localPlayerId={localPlayerId ?? undefined}
            players={players}
            tokens={tokens}
            canGiveToken={canGiveToken}
            onGiveToken={gameActions.giveToken}
          />
        )}

        {/* Waiting message for non-active player */}
        {phase === 'waiting' && !isMyTurn && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Waiting for{' '}
                <span className="font-medium text-foreground">{activePlayer?.name}</span> to
                roll...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
