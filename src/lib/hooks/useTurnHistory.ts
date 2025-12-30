/**
 * Turn History Hook
 * Manages turn history state from server events
 */

import { useState, useCallback, useEffect } from 'react';
import type { TurnHistoryEntry } from '@/lib/game/turn-history';

export interface UseTurnHistoryReturn {
  turnHistory: TurnHistoryEntry[];
  addTurnEntry: (entry: TurnHistoryEntry) => void;
  clearHistory: () => void;
  getTurnEntry: (turnNumber: number) => TurnHistoryEntry | undefined;
}

/**
 * Hook for managing turn history
 *
 * Usage:
 * ```tsx
 * const { turnHistory, addTurnEntry } = useTurnHistory();
 *
 * // Add entry after turn results
 * useEffect(() => {
 *   if (turnResultsData) {
 *     addTurnEntry(createTurnHistoryEntry(...));
 *   }
 * }, [turnResultsData, addTurnEntry]);
 *
 * // Render in HistoryTab
 * <HistoryTab turnHistory={turnHistory} />
 * ```
 */
export function useTurnHistory(): UseTurnHistoryReturn {
  const [turnHistory, setTurnHistory] = useState<TurnHistoryEntry[]>([]);

  const addTurnEntry = useCallback((entry: TurnHistoryEntry) => {
    setTurnHistory((prev) => {
      // Check if entry already exists (avoid duplicates)
      const exists = prev.some((e) => e.turnNumber === entry.turnNumber);
      if (exists) {
        // Update existing entry
        return prev.map((e) => (e.turnNumber === entry.turnNumber ? entry : e));
      }
      // Add new entry
      return [...prev, entry];
    });
  }, []);

  const clearHistory = useCallback(() => {
    setTurnHistory([]);
  }, []);

  const getTurnEntry = useCallback(
    (turnNumber: number): TurnHistoryEntry | undefined => {
      return turnHistory.find((e) => e.turnNumber === turnNumber);
    },
    [turnHistory]
  );

  return {
    turnHistory,
    addTurnEntry,
    clearHistory,
    getTurnEntry,
  };
}

/**
 * Helper to create turn history entry from turn results data
 */
export function createTurnHistoryFromResults(
  turnNumber: number,
  turnResultsData: {
    votePassed: boolean;
    voteResults: {
      yesVotes: number;
      noVotes: number;
      abstainCount: number;
      votes: Array<{
        playerId: string;
        playerName: string;
        choice: 'yes' | 'no' | 'abstain';
        weight: number;
      }>;
    };
    nationChanges: {
      budgetChange: number;
      stabilityChange: number;
      newBudget: number;
      newStability: number;
    };
    playerEffects: Array<{
      playerId: string;
      playerName: string;
      movementBreakdown: {
        diceRoll: number | null;
        ideologyBonus: number;
        ideologyPenalty: number;
        nationModifier: number;
        influenceModifier: number;
        total: number;
      };
    }>;
  },
  activePlayer: {
    id: string;
    name: string;
    ideology: 'progressive' | 'conservative' | 'liberal' | 'nationalist' | 'populist';
  },
  card: {
    id: string;
    title: string;
    zone: string;
  },
  selectedOption: {
    id: string;
    name: string;
    budgetChange: number;
    stabilityChange: number;
  },
  nationBefore: {
    budget: number;
    stability: number;
  },
  players: Map<string, { ideology: 'progressive' | 'conservative' | 'liberal' | 'nationalist' | 'populist' }>
): TurnHistoryEntry {
  const zoneToCategory = (zone: string): 'early-term' | 'mid-term' | 'crisis-zone' | 'late-term' => {
    switch (zone) {
      case 'earlyTerm':
        return 'early-term';
      case 'midTerm':
        return 'mid-term';
      case 'crisisZone':
        return 'crisis-zone';
      case 'lateTerm':
        return 'late-term';
      default:
        return 'early-term';
    }
  };

  return {
    turnNumber,
    timestamp: Date.now(),
    activePlayerId: activePlayer.id,
    activePlayerName: activePlayer.name,
    activePlayerIdeology: activePlayer.ideology,
    proposal: {
      cardId: card.id,
      cardTitle: card.title,
      cardCategory: zoneToCategory(card.zone),
      optionChosen: selectedOption.name,
      nationImpact: {
        budgetEffect: selectedOption.budgetChange,
        stabilityEffect: selectedOption.stabilityChange,
      },
    },
    votes: turnResultsData.voteResults.votes.map((v) => {
      const playerIdeology = players.get(v.playerId)?.ideology || 'progressive';
      return {
        playerId: v.playerId,
        playerName: v.playerName,
        playerIdeology,
        vote: v.choice,
        influenceSpent: v.weight - 1,
        voteWeight: v.weight,
        alignedWithIdeology: false, // Would need ideology alignment logic
      };
    }),
    outcome: turnResultsData.votePassed ? 'passed' : 'failed',
    yesCount: turnResultsData.voteResults.yesVotes,
    noCount: turnResultsData.voteResults.noVotes,
    abstainCount: turnResultsData.voteResults.abstainCount,
    margin: `${Math.max(turnResultsData.voteResults.yesVotes, turnResultsData.voteResults.noVotes)}-${Math.min(turnResultsData.voteResults.yesVotes, turnResultsData.voteResults.noVotes)}`,
    nationChanges: {
      budgetBefore: nationBefore.budget,
      budgetAfter: turnResultsData.nationChanges.newBudget,
      budgetDelta: turnResultsData.nationChanges.budgetChange,
      stabilityBefore: nationBefore.stability,
      stabilityAfter: turnResultsData.nationChanges.newStability,
      stabilityDelta: turnResultsData.nationChanges.stabilityChange,
    },
    playerMovements: turnResultsData.playerEffects.map((pe) => ({
      playerId: pe.playerId,
      playerName: pe.playerName,
      diceRoll: pe.movementBreakdown.diceRoll,
      ideologyModifier: pe.movementBreakdown.ideologyBonus + pe.movementBreakdown.ideologyPenalty,
      nationModifier: pe.movementBreakdown.nationModifier,
      influenceBonus: pe.movementBreakdown.influenceModifier,
      totalMovement: pe.movementBreakdown.total,
      positionBefore: 0, // Would need to be calculated from prior state
      positionAfter: 0, // Would need to be calculated
    })),
    conceptsTriggered: [],
  };
}
