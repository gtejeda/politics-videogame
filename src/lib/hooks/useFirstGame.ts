/**
 * First Game Detection Hook
 * Detects if this is a player's first game and provides hint state management
 */

import { useMemo, useCallback } from 'react';
import { usePlayerPrefs } from './usePlayerPrefs';
import type { GamePhase } from '@/lib/game/types';

export interface FirstGameHint {
  id: string;
  phase: GamePhase;
  content: string;
  showOnTurns: number[]; // Which turns to show this hint (e.g., [1, 2] for first 2 turns)
}

/**
 * Phase-specific hints for first-time players
 */
const FIRST_GAME_HINTS: FirstGameHint[] = [
  {
    id: 'waiting-intro',
    phase: 'waiting',
    content: "When it's your turn, click 'Roll Dice' to begin. Your roll determines how far you can move!",
    showOnTurns: [1, 2],
  },
  {
    id: 'rolling-hint',
    phase: 'rolling',
    content: 'Click the dice to roll! Your movement depends on the roll plus any bonuses from nation state.',
    showOnTurns: [1, 2],
  },
  {
    id: 'reviewing-observer',
    phase: 'reviewing',
    content: "Review the proposal. Check how each ideology typically approaches this issue - it'll help you decide how to vote.",
    showOnTurns: [1, 2],
  },
  {
    id: 'deliberating-intro',
    phase: 'deliberating',
    content: 'Negotiate with other players! You can give Support Tokens to signal cooperation - but breaking deals has consequences.',
    showOnTurns: [1, 2],
  },
  {
    id: 'voting-intro',
    phase: 'voting',
    content: 'Cast your vote: Yes, No, or Abstain. You can spend Influence to add weight to your vote, but conserve enough to win!',
    showOnTurns: [1, 2],
  },
  {
    id: 'crisis-intro',
    phase: 'crisis',
    content: 'A crisis threatens the nation! Work together to contribute Influence and prevent disaster. Some ideologies get bonuses here.',
    showOnTurns: [1, 2, 3],
  },
];

export interface UseFirstGameReturn {
  /** Whether this is a first-time player (no games completed) */
  isFirstGame: boolean;
  /** Whether hints are enabled (first game + user hasn't disabled) */
  hintsEnabled: boolean;
  /** Number of games played */
  gamesPlayed: number;
  /** Get hint for current phase and turn, if applicable */
  getHintForPhase: (phase: GamePhase, currentTurn: number, isMyTurn: boolean) => FirstGameHint | null;
  /** Mark that player has seen a hint */
  dismissHint: (hintId: string) => void;
  /** Toggle hints on/off */
  toggleHints: () => void;
  /** Set of dismissed hint IDs */
  dismissedHints: Set<string>;
}

export function useFirstGame(): UseFirstGameReturn {
  const { prefs, isLoaded, toggleHints: togglePrefsHints } = usePlayerPrefs();

  // Track dismissed hints in session (not persisted)
  const dismissedHints = useMemo(() => new Set<string>(), []);

  const isFirstGame = useMemo(() => {
    if (!isLoaded) return false;
    return prefs.gamesPlayed === 0;
  }, [isLoaded, prefs.gamesPlayed]);

  const hintsEnabled = useMemo(() => {
    if (!isLoaded) return false;
    return prefs.hintsEnabled && (isFirstGame || prefs.gamesPlayed <= 2);
  }, [isLoaded, prefs.hintsEnabled, isFirstGame, prefs.gamesPlayed]);

  const getHintForPhase = useCallback(
    (phase: GamePhase, currentTurn: number, isMyTurn: boolean): FirstGameHint | null => {
      if (!hintsEnabled) return null;

      // Find matching hint
      const hint = FIRST_GAME_HINTS.find((h) => {
        // Check phase match
        if (h.phase !== phase) return false;

        // Check turn eligibility
        if (!h.showOnTurns.includes(currentTurn)) return false;

        // Don't show observer hints if it's my turn
        if (h.id === 'reviewing-observer' && isMyTurn) return false;

        // Don't show dismissed hints
        if (dismissedHints.has(h.id)) return false;

        return true;
      });

      return hint || null;
    },
    [hintsEnabled, dismissedHints]
  );

  const dismissHint = useCallback(
    (hintId: string) => {
      dismissedHints.add(hintId);
    },
    [dismissedHints]
  );

  return {
    isFirstGame,
    hintsEnabled,
    gamesPlayed: prefs.gamesPlayed,
    getHintForPhase,
    dismissHint,
    toggleHints: togglePrefsHints,
    dismissedHints,
  };
}
