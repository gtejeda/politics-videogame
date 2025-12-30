'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameLayout } from './GameLayout';
import { PlayersBar } from './PlayersBar';
import { ActionTab } from './ActionTab';
import { DealsTab } from './DealsTab';
import { HistoryTab } from './HistoryTab';
import { TurnResults } from './TurnResults';
import { DealBreachEffect } from './DealBreachEffect';
import { CrisisResolution } from './CrisisResolution';
import { useTurnHistory } from '@/lib/hooks/useTurnHistory';
import type { RoomStatePayload, TurnResultsDisplayMessage } from '@/lib/game/events';
import type { GameActions, DealBreachData, CrisisResolutionData } from '@/lib/hooks/useGameState';
import type { TurnHistoryEntry } from '@/lib/game/turn-history';
import type { Ideology } from '@/lib/game/types';

interface BoardProps {
  roomState: RoomStatePayload;
  localPlayerId: string | null;
  gameActions: GameActions;
  turnResultsData: TurnResultsDisplayMessage | null;
  hasAcknowledgedResults: boolean;
  afkPlayers?: Set<string>;
  dealBreachData?: DealBreachData | null; // T043: Deal breach animation data
  crisisResolutionData?: CrisisResolutionData | null; // T044b: Crisis resolution animation data
}

/**
 * Board - Main game component with tabbed layout
 *
 * Structure:
 * - PlayersBar (always visible)
 * - Tabs: Action | Deals | History
 * - TurnResults overlay when showing results
 */
export function Board({
  roomState,
  localPlayerId,
  gameActions,
  turnResultsData,
  hasAcknowledgedResults,
  afkPlayers = new Set(),
  dealBreachData,
  crisisResolutionData,
}: BoardProps) {
  const {
    phase,
    currentTurn,
    activePlayerId,
    currentCard,
    currentProposal,
    players,
    tokens,
    nation,
    settings,
    activeDeals,
  } = roomState;

  // Turn history management
  const { turnHistory, addTurnEntry } = useTurnHistory();

  // Track nation state before turn for history
  const [nationBeforeTurn, setNationBeforeTurn] = useState(nation);

  // Update nation state tracker at turn start
  useEffect(() => {
    if (phase === 'waiting') {
      setNationBeforeTurn(nation);
    }
  }, [phase, nation]);

  // Create turn history entry when results are shown
  useEffect(() => {
    if (turnResultsData && currentCard) {
      const activePlayer = players.find((p) => p.id === activePlayerId);
      const selectedOption = currentCard?.options.find((o) => o.id === currentProposal);

      if (activePlayer && selectedOption) {
        // Create player ideology map
        const playerIdeologyMap = new Map<string, { ideology: Ideology }>();
        players.forEach((p) => {
          if (p.ideology) {
            playerIdeologyMap.set(p.id, { ideology: p.ideology });
          }
        });

        // Calculate player positions before/after
        const playerPositionsBefore = new Map<string, number>();
        turnResultsData.playerEffects.forEach((pe) => {
          const movement = pe.movementBreakdown.total;
          const currentPlayer = players.find((p) => p.id === pe.playerId);
          if (currentPlayer) {
            playerPositionsBefore.set(pe.playerId, currentPlayer.position - movement);
          }
        });

        const yesVotes = turnResultsData.voteResults.yesVotes;
        const noVotes = turnResultsData.voteResults.noVotes;
        const higher = yesVotes > noVotes ? yesVotes : noVotes;
        const lower = yesVotes > noVotes ? noVotes : yesVotes;

        const entry: TurnHistoryEntry = {
          turnNumber: turnResultsData.turnNumber,
          timestamp: Date.now(),
          activePlayerId: activePlayer.id,
          activePlayerName: activePlayer.name,
          activePlayerIdeology: activePlayer.ideology || 'progressive',
          proposal: {
            cardId: currentCard.id,
            cardTitle: currentCard.title,
            cardCategory:
              currentCard.zone === 'earlyTerm'
                ? 'early-term'
                : currentCard.zone === 'midTerm'
                  ? 'mid-term'
                  : currentCard.zone === 'crisisZone'
                    ? 'crisis-zone'
                    : 'late-term',
            optionChosen: selectedOption.name,
            nationImpact: {
              budgetEffect: selectedOption.budgetChange,
              stabilityEffect: selectedOption.stabilityChange,
            },
          },
          votes: turnResultsData.voteResults.votes.map((v) => {
            const playerData = playerIdeologyMap.get(v.playerId);
            return {
              playerId: v.playerId,
              playerName: v.playerName,
              playerIdeology: playerData?.ideology || 'progressive',
              vote: v.choice,
              influenceSpent: v.weight - 1,
              voteWeight: v.weight,
              alignedWithIdeology: false,
            };
          }),
          outcome: turnResultsData.votePassed ? 'passed' : 'failed',
          yesCount: yesVotes,
          noCount: noVotes,
          abstainCount: turnResultsData.voteResults.abstainCount,
          margin: `${higher}-${lower}`,
          nationChanges: {
            budgetBefore: nationBeforeTurn.budget,
            budgetAfter: turnResultsData.nationChanges.newBudget,
            budgetDelta: turnResultsData.nationChanges.budgetChange,
            stabilityBefore: nationBeforeTurn.stability,
            stabilityAfter: turnResultsData.nationChanges.newStability,
            stabilityDelta: turnResultsData.nationChanges.stabilityChange,
          },
          playerMovements: turnResultsData.playerEffects.map((pe) => {
            const posBefore = playerPositionsBefore.get(pe.playerId) || 0;
            const currentPlayer = players.find((p) => p.id === pe.playerId);
            return {
              playerId: pe.playerId,
              playerName: pe.playerName,
              diceRoll: pe.movementBreakdown.diceRoll,
              ideologyModifier:
                pe.movementBreakdown.ideologyBonus + pe.movementBreakdown.ideologyPenalty,
              nationModifier: pe.movementBreakdown.nationModifier,
              influenceBonus: pe.movementBreakdown.influenceModifier,
              totalMovement: pe.movementBreakdown.total,
              positionBefore: posBefore,
              positionAfter: currentPlayer?.position || 0,
            };
          }),
          conceptsTriggered: [],
        };

        addTurnEntry(entry);
      }
    }
  }, [
    turnResultsData,
    currentCard,
    activePlayerId,
    currentProposal,
    players,
    nationBeforeTurn,
    addTurnEntry,
  ]);

  return (
    <>
      <GameLayout
        playersBar={
          <PlayersBar
            nation={nation}
            players={players}
            activePlayerId={activePlayerId}
            localPlayerId={localPlayerId}
            currentTurn={currentTurn}
            pathLength={settings.pathLength}
            afkPlayers={afkPlayers}
          />
        }
        actionContent={
          <ActionTab
            roomState={roomState}
            localPlayerId={localPlayerId}
            gameActions={gameActions}
            afkPlayers={afkPlayers}
          />
        }
        dealsContent={
          <DealsTab
            localPlayerId={localPlayerId}
            players={players}
            tokens={tokens}
            activeDeals={activeDeals}
          />
        }
        historyContent={<HistoryTab turnHistory={turnHistory} currentTurn={currentTurn} />}
        currentPhase={phase}
      />

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

      {/* T043: Deal Breach Animation Overlay */}
      {dealBreachData && (
        <DealBreachEffect
          isActive={!!dealBreachData}
          breakerName={dealBreachData.breakerName}
          victimName={dealBreachData.victimName}
          onComplete={gameActions.clearDealBreach}
        />
      )}

      {/* T044b: Crisis Resolution Animation Overlay */}
      {crisisResolutionData && (
        <CrisisResolution
          crisis={crisisResolutionData.crisis}
          contributions={crisisResolutionData.contributions}
          players={players}
          outcome={crisisResolutionData.outcome}
          totalContribution={crisisResolutionData.totalContribution}
          nationChanges={crisisResolutionData.nationChanges}
          onComplete={gameActions.clearCrisisResolution}
        />
      )}
    </>
  );
}
