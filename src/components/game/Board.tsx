'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NationTrack } from './NationTrack';
import { PlayerTrack } from './PlayerTrack';
import { BoardPath } from './BoardPath';
import { DecisionCard } from './DecisionCard';
import { VotingPanel } from './VotingPanel';
import { DiceRoll } from './DiceRoll';
import { Timer } from './Timer';
import { TurnResults } from './TurnResults';
import { ReviewPhase } from './ReviewPhase';
import { ProposerView } from './ProposerView';
import { DeliberationTimer } from './DeliberationTimer';
import type { RoomStatePayload, TurnResultsDisplayMessage } from '@/lib/game/events';
import type { GameActions } from '@/lib/hooks/useGameState';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface BoardProps {
  roomState: RoomStatePayload;
  localPlayerId: string | null;
  gameActions: GameActions;
  turnResultsData: TurnResultsDisplayMessage | null;
  hasAcknowledgedResults: boolean;
  afkPlayers?: Set<string>;
}

export function Board({
  roomState,
  localPlayerId,
  gameActions,
  turnResultsData,
  hasAcknowledgedResults,
  afkPlayers = new Set(),
}: BoardProps) {
  const {
    phase,
    currentTurn,
    activePlayerId,
    currentCard,
    currentProposal,
    diceRoll,
    timerEndAt,
    players,
    nation,
    settings,
  } = roomState;

  const isMyTurn = activePlayerId === localPlayerId;
  const activePlayer = players.find(p => p.id === activePlayerId);
  const localPlayer = players.find(p => p.id === localPlayerId);

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

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Turn {currentTurn}</h1>
            <p className="text-sm text-muted-foreground">{phaseText}</p>
          </div>
          {/* FR-021: Show timer during deliberation phase */}
          {timerEndAt && phase === 'deliberating' && !roomState.timerStartedAt && (
            <Timer endAt={timerEndAt} />
          )}
        </div>

        {/* FR-021: Full Deliberation Timer during Negotiation Phase */}
        {phase === 'deliberating' && roomState.timerStartedAt && roomState.recommendedDuration && (
          <DeliberationTimer
            timerStartedAt={roomState.timerStartedAt}
            recommendedDuration={roomState.recommendedDuration}
            canPropose={isMyTurn && !currentProposal}
            hasProposed={!!currentProposal}
          />
        )}

        {/* Nation State */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Nation Status</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <NationTrack nation={nation} />
          </CardContent>
        </Card>

        {/* Board Path - Main Game Board */}
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

        {/* Main Game Area */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left: Player Tracks */}
          <Card className="lg:col-span-1">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Players</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {players.map(player => (
                <PlayerTrack
                  key={player.id}
                  player={player}
                  isActive={player.id === activePlayerId}
                  isLocal={player.id === localPlayerId}
                  pathLength={settings.pathLength}
                  isAfk={afkPlayers.has(player.id)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Center/Right: Game Actions */}
          <div className="space-y-4 lg:col-span-2">
            {/* Dice Roll (waiting phase) */}
            {phase === 'waiting' && isMyTurn && (
              <DiceRoll onRoll={gameActions.rollDice} />
            )}

            {/* Dice Result (after roll) */}
            {diceRoll && phase !== 'waiting' && (
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

            {/* FR-019: Review Phase - Non-proposer View */}
            {phase === 'reviewing' && currentCard && !isMyTurn && (
              <ReviewPhase
                card={currentCard}
                localPlayerIdeology={localPlayer?.ideology || null}
                proposerName={activePlayer?.name || 'Player'}
                isReady={isLocalPlayerReady}
                onMarkReady={gameActions.markReadyToNegotiate}
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

            {/* Waiting message for non-active player */}
            {phase === 'waiting' && !isMyTurn && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Waiting for{' '}
                    <span className="font-medium text-foreground">
                      {activePlayer?.name}
                    </span>{' '}
                    to roll...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Turn Results Full-Screen Overlay */}
      <AnimatePresence>
        {turnResultsData && (
          <TurnResults
            results={turnResultsData}
            players={players}
            localPlayerId={localPlayerId}
            onAcknowledge={gameActions.acknowledgeTurnResults}
            hasAcknowledged={hasAcknowledgedResults}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
