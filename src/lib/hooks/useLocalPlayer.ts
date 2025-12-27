'use client';

/**
 * useLocalPlayer Hook
 * Manages local player state in localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { generatePlayerId } from '../game/constants';

// ============================================
// Types
// ============================================

export interface LocalPlayerState {
  playerId: string;
  displayName: string;
  lastRoomId: string | null;
  preferences: {
    reducedMotion: boolean;
    soundEnabled: boolean;
  };
}

const STORAGE_KEY = 'political-path-player';

const DEFAULT_STATE: LocalPlayerState = {
  playerId: '',
  displayName: '',
  lastRoomId: null,
  preferences: {
    reducedMotion: false,
    soundEnabled: true,
  },
};

// ============================================
// Hook Implementation
// ============================================

export function useLocalPlayer() {
  const [state, setState] = useState<LocalPlayerState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LocalPlayerState;
        setState(parsed);
      } else {
        // Initialize with new player ID
        const newState: LocalPlayerState = {
          ...DEFAULT_STATE,
          playerId: generatePlayerId(),
        };
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }
    } catch (error) {
      console.error('Failed to load player state:', error);
      const newState: LocalPlayerState = {
        ...DEFAULT_STATE,
        playerId: generatePlayerId(),
      };
      setState(newState);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded || !state) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save player state:', error);
    }
  }, [state, isLoaded]);

  // ============================================
  // Actions
  // ============================================

  const setDisplayName = useCallback((name: string) => {
    setState(prev => prev ? { ...prev, displayName: name } : null);
  }, []);

  const setLastRoomId = useCallback((roomId: string | null) => {
    setState(prev => prev ? { ...prev, lastRoomId: roomId } : null);
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    setState(prev => prev ? {
      ...prev,
      preferences: { ...prev.preferences, reducedMotion: enabled },
    } : null);
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setState(prev => prev ? {
      ...prev,
      preferences: { ...prev.preferences, soundEnabled: enabled },
    } : null);
  }, []);

  const resetPlayer = useCallback(() => {
    const newState: LocalPlayerState = {
      ...DEFAULT_STATE,
      playerId: generatePlayerId(),
    };
    setState(newState);
  }, []);

  return {
    state,
    isLoaded,
    setDisplayName,
    setLastRoomId,
    setReducedMotion,
    setSoundEnabled,
    resetPlayer,
  };
}
