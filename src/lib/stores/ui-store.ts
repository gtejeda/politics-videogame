/**
 * UI State Store
 * Manages active tab, help open state, tutorial state, and first-game hints
 */

import { create } from 'zustand';

export type GameTab = 'action' | 'deals' | 'history';

export interface UIState {
  // Tab navigation
  activeTab: GameTab;
  setActiveTab: (tab: GameTab) => void;

  // Help system
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  toggleHelp: () => void;

  // Tutorial
  tutorialOpen: boolean;
  tutorialStep: number;
  setTutorialOpen: (open: boolean) => void;
  setTutorialStep: (step: number) => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;

  // First-game hints
  showingHint: boolean;
  currentHintId: string | null;
  showHint: (hintId: string) => void;
  dismissHint: () => void;

  // Reset all UI state
  resetUIState: () => void;
}

const initialState = {
  activeTab: 'action' as GameTab,
  helpOpen: false,
  tutorialOpen: false,
  tutorialStep: 0,
  showingHint: false,
  currentHintId: null,
};

export const useUIStore = create<UIState>((set) => ({
  ...initialState,

  // Tab navigation
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Help system
  setHelpOpen: (open) => set({ helpOpen: open }),
  toggleHelp: () => set((state) => ({ helpOpen: !state.helpOpen })),

  // Tutorial
  setTutorialOpen: (open) => set({ tutorialOpen: open, tutorialStep: open ? 0 : 0 }),
  setTutorialStep: (step) => set({ tutorialStep: step }),
  nextTutorialStep: () => set((state) => ({ tutorialStep: state.tutorialStep + 1 })),
  prevTutorialStep: () => set((state) => ({ tutorialStep: Math.max(0, state.tutorialStep - 1) })),

  // First-game hints
  showHint: (hintId) => set({ showingHint: true, currentHintId: hintId }),
  dismissHint: () => set({ showingHint: false, currentHintId: null }),

  // Reset
  resetUIState: () => set(initialState),
}));
