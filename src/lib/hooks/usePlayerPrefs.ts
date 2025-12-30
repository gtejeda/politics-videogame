/**
 * Player Preferences Hook
 * Manages localStorage-persisted player preferences for tutorial and hints
 */

import { useState, useEffect, useCallback } from 'react';

export interface PlayerPreferences {
  tutorialCompleted: boolean;
  gamesPlayed: number;
  hintsEnabled: boolean;
  lastPlayedAt: number | null;
}

const STORAGE_KEY = 'playerPrefs';

const DEFAULT_PREFS: PlayerPreferences = {
  tutorialCompleted: false,
  gamesPlayed: 0,
  hintsEnabled: true,
  lastPlayedAt: null,
};

function getStoredPrefs(): PlayerPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new fields
      return { ...DEFAULT_PREFS, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to parse player preferences:', error);
  }

  return DEFAULT_PREFS;
}

function savePrefs(prefs: PlayerPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.warn('Failed to save player preferences:', error);
  }
}

export function usePlayerPrefs() {
  const [prefs, setPrefs] = useState<PlayerPreferences>(DEFAULT_PREFS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = getStoredPrefs();
    setPrefs(stored);
    setIsLoaded(true);
  }, []);

  // Update preferences and persist to localStorage
  const updatePrefs = useCallback((updates: Partial<PlayerPreferences>) => {
    setPrefs((current) => {
      const newPrefs = { ...current, ...updates };
      savePrefs(newPrefs);
      return newPrefs;
    });
  }, []);

  // Mark tutorial as completed
  const completeTutorial = useCallback(() => {
    updatePrefs({ tutorialCompleted: true });
  }, [updatePrefs]);

  // Increment games played counter
  const incrementGamesPlayed = useCallback(() => {
    setPrefs((current) => {
      const newPrefs = {
        ...current,
        gamesPlayed: current.gamesPlayed + 1,
        lastPlayedAt: Date.now(),
      };
      savePrefs(newPrefs);
      return newPrefs;
    });
  }, []);

  // Toggle hints enabled/disabled
  const toggleHints = useCallback(() => {
    setPrefs((current) => {
      const newPrefs = { ...current, hintsEnabled: !current.hintsEnabled };
      savePrefs(newPrefs);
      return newPrefs;
    });
  }, []);

  // Set hints enabled state directly
  const setHintsEnabled = useCallback((enabled: boolean) => {
    updatePrefs({ hintsEnabled: enabled });
  }, [updatePrefs]);

  // Reset all preferences to defaults
  const resetPrefs = useCallback(() => {
    setPrefs(DEFAULT_PREFS);
    savePrefs(DEFAULT_PREFS);
  }, []);

  return {
    prefs,
    isLoaded,
    updatePrefs,
    completeTutorial,
    incrementGamesPlayed,
    toggleHints,
    setHintsEnabled,
    resetPrefs,
  };
}
