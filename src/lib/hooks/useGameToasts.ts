'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/toast';
import type { GameState } from './useGameState';

/**
 * Hook that shows toast notifications for game events
 */
export function useGameToasts(state: GameState) {
  const { addToast } = useToast();
  const prevStateRef = useRef<GameState | null>(null);

  useEffect(() => {
    const prevState = prevStateRef.current;
    prevStateRef.current = state;

    if (!prevState || !state.roomState) return;

    // Check for new players
    if (prevState.roomState && state.roomState.players.length > prevState.roomState.players.length) {
      const newPlayers = state.roomState.players.filter(
        p => !prevState.roomState!.players.find(pp => pp.id === p.id)
      );
      for (const player of newPlayers) {
        if (player.id !== state.localPlayerId) {
          addToast(`${player.name} joined the game`, 'info', 3000);
        }
      }
    }

    // Check for players leaving
    if (prevState.roomState && state.roomState.players.length < prevState.roomState.players.length) {
      const leftPlayers = prevState.roomState.players.filter(
        p => !state.roomState!.players.find(pp => pp.id === p.id)
      );
      for (const player of leftPlayers) {
        if (player.id !== state.localPlayerId) {
          addToast(`${player.name} left the game`, 'warning', 3000);
        }
      }
    }

    // Game started
    if (
      prevState.roomState?.status === 'lobby' &&
      state.roomState.status === 'playing'
    ) {
      addToast('Game started!', 'success', 3000);
    }

    // Turn changed
    if (
      prevState.roomState?.currentTurn !== state.roomState.currentTurn &&
      state.roomState.currentTurn > 0
    ) {
      const activePlayer = state.roomState.players.find(
        p => p.id === state.roomState?.activePlayerId
      );
      if (state.roomState.activePlayerId === state.localPlayerId) {
        addToast("It's your turn!", 'info', 4000);
      } else if (activePlayer) {
        addToast(`${activePlayer.name}'s turn`, 'info', 2500);
      }
    }

    // Phase changes
    if (prevState.roomState?.phase !== state.roomState.phase) {
      switch (state.roomState.phase) {
        case 'deliberating':
          addToast('Deliberation phase - discuss the options!', 'info', 3000);
          break;
        case 'voting':
          addToast('Voting has begun!', 'info', 3000);
          break;
        case 'crisis':
          addToast('Crisis event triggered!', 'error', 4000);
          break;
      }
    }

    // AFK players
    for (const playerId of state.afkPlayers) {
      if (!prevState.afkPlayers.has(playerId)) {
        const player = state.roomState.players.find(p => p.id === playerId);
        if (player && player.id !== state.localPlayerId) {
          addToast(`${player.name} is AFK`, 'warning', 3000);
        }
      }
    }

    // Error notification
    if (state.error && state.error !== prevState.error) {
      addToast(state.error, 'error', 5000);
    }

  }, [state, addToast]);
}
