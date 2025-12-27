'use client';

/**
 * useVoting Hook
 * Handles vote submission and state tracking
 */

import { useState, useCallback, useMemo } from 'react';
import type { VoteChoice } from '../game/types';
import type { GameState, GameActions } from './useGameState';

export interface VotingState {
  hasVoted: boolean;
  pendingChoice: VoteChoice | null;
  influenceToSpend: number;
  maxInfluence: number;
  votingPhase: boolean;
  revealPhase: boolean;
}

export interface VotingActions {
  setInfluenceToSpend: (amount: number) => void;
  submitVote: (choice: VoteChoice) => void;
  resetVotingState: () => void;
}

export function useVoting(
  gameState: GameState,
  gameActions: GameActions,
  localPlayerId: string | null
): [VotingState, VotingActions] {
  const [pendingChoice, setPendingChoice] = useState<VoteChoice | null>(null);
  const [influenceToSpend, setInfluenceToSpend] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  // Get current player's influence
  const localPlayer = useMemo(() => {
    if (!gameState.roomState || !localPlayerId) return null;
    return gameState.roomState.players.find(p => p.id === localPlayerId);
  }, [gameState.roomState, localPlayerId]);

  const maxInfluence = localPlayer?.influence || 0;

  // Determine if we're in voting or reveal phase
  const votingPhase = gameState.roomState?.phase === 'voting';
  const revealPhase = gameState.roomState?.phase === 'revealing';

  // Reset voting state when phase changes
  const resetVotingState = useCallback(() => {
    setPendingChoice(null);
    setInfluenceToSpend(0);
    setHasVoted(false);
  }, []);

  // Submit vote
  const submitVote = useCallback((choice: VoteChoice) => {
    if (hasVoted || !votingPhase) return;

    setPendingChoice(choice);
    setHasVoted(true);
    gameActions.castVote(choice, influenceToSpend);
  }, [hasVoted, votingPhase, influenceToSpend, gameActions]);

  // Set influence to spend (with bounds checking)
  const handleSetInfluence = useCallback((amount: number) => {
    const bounded = Math.max(0, Math.min(amount, maxInfluence));
    setInfluenceToSpend(bounded);
  }, [maxInfluence]);

  const state: VotingState = {
    hasVoted,
    pendingChoice,
    influenceToSpend,
    maxInfluence,
    votingPhase,
    revealPhase,
  };

  const actions: VotingActions = {
    setInfluenceToSpend: handleSetInfluence,
    submitVote,
    resetVotingState,
  };

  return [state, actions];
}
