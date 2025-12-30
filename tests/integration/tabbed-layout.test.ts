/**
 * Integration tests for tabbed layout
 * Tests tab navigation, state persistence, and UI store integration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore, type GameTab } from '@/lib/stores/ui-store';

// Reset store before each test
beforeEach(() => {
  useUIStore.getState().resetUIState();
});

describe('Tab Navigation', () => {
  describe('Initial state', () => {
    it('should start on action tab', () => {
      const { activeTab } = useUIStore.getState();
      expect(activeTab).toBe('action');
    });

    it('should have help closed by default', () => {
      const { helpOpen } = useUIStore.getState();
      expect(helpOpen).toBe(false);
    });

    it('should have tutorial closed by default', () => {
      const { tutorialOpen } = useUIStore.getState();
      expect(tutorialOpen).toBe(false);
    });
  });

  describe('Tab switching', () => {
    it('should switch to deals tab', () => {
      useUIStore.getState().setActiveTab('deals');
      expect(useUIStore.getState().activeTab).toBe('deals');
    });

    it('should switch to history tab', () => {
      useUIStore.getState().setActiveTab('history');
      expect(useUIStore.getState().activeTab).toBe('history');
    });

    it('should switch back to action tab', () => {
      useUIStore.getState().setActiveTab('deals');
      useUIStore.getState().setActiveTab('action');
      expect(useUIStore.getState().activeTab).toBe('action');
    });

    it('should handle rapid tab switches', () => {
      const tabs: GameTab[] = ['action', 'deals', 'history', 'action', 'history'];
      for (const tab of tabs) {
        useUIStore.getState().setActiveTab(tab);
      }
      expect(useUIStore.getState().activeTab).toBe('history');
    });
  });

  describe('Tab state persistence', () => {
    it('should maintain tab state between component renders', () => {
      useUIStore.getState().setActiveTab('deals');
      // Simulate re-reading state as would happen in re-render
      const state1 = useUIStore.getState().activeTab;
      const state2 = useUIStore.getState().activeTab;
      expect(state1).toBe(state2);
      expect(state1).toBe('deals');
    });
  });
});

describe('Help System', () => {
  describe('Help overlay control', () => {
    it('should open help overlay', () => {
      useUIStore.getState().setHelpOpen(true);
      expect(useUIStore.getState().helpOpen).toBe(true);
    });

    it('should close help overlay', () => {
      useUIStore.getState().setHelpOpen(true);
      useUIStore.getState().setHelpOpen(false);
      expect(useUIStore.getState().helpOpen).toBe(false);
    });

    it('should toggle help overlay', () => {
      expect(useUIStore.getState().helpOpen).toBe(false);
      useUIStore.getState().toggleHelp();
      expect(useUIStore.getState().helpOpen).toBe(true);
      useUIStore.getState().toggleHelp();
      expect(useUIStore.getState().helpOpen).toBe(false);
    });
  });

  describe('Help and tabs interaction', () => {
    it('should maintain help state when switching tabs', () => {
      useUIStore.getState().setHelpOpen(true);
      useUIStore.getState().setActiveTab('deals');
      expect(useUIStore.getState().helpOpen).toBe(true);
      expect(useUIStore.getState().activeTab).toBe('deals');
    });
  });
});

describe('Tutorial System', () => {
  describe('Tutorial control', () => {
    it('should open tutorial at step 0', () => {
      useUIStore.getState().setTutorialOpen(true);
      const { tutorialOpen, tutorialStep } = useUIStore.getState();
      expect(tutorialOpen).toBe(true);
      expect(tutorialStep).toBe(0);
    });

    it('should close tutorial', () => {
      useUIStore.getState().setTutorialOpen(true);
      useUIStore.getState().setTutorialOpen(false);
      expect(useUIStore.getState().tutorialOpen).toBe(false);
    });
  });

  describe('Tutorial navigation', () => {
    it('should advance to next step', () => {
      useUIStore.getState().setTutorialOpen(true);
      useUIStore.getState().nextTutorialStep();
      expect(useUIStore.getState().tutorialStep).toBe(1);
    });

    it('should go to previous step', () => {
      useUIStore.getState().setTutorialOpen(true);
      useUIStore.getState().setTutorialStep(3);
      useUIStore.getState().prevTutorialStep();
      expect(useUIStore.getState().tutorialStep).toBe(2);
    });

    it('should not go below step 0', () => {
      useUIStore.getState().setTutorialOpen(true);
      useUIStore.getState().prevTutorialStep();
      expect(useUIStore.getState().tutorialStep).toBe(0);
    });

    it('should allow setting specific step', () => {
      useUIStore.getState().setTutorialOpen(true);
      useUIStore.getState().setTutorialStep(5);
      expect(useUIStore.getState().tutorialStep).toBe(5);
    });
  });
});

describe('First-Game Hints', () => {
  describe('Hint display', () => {
    it('should show hint with ID', () => {
      useUIStore.getState().showHint('voting-hint');
      const { showingHint, currentHintId } = useUIStore.getState();
      expect(showingHint).toBe(true);
      expect(currentHintId).toBe('voting-hint');
    });

    it('should dismiss hint', () => {
      useUIStore.getState().showHint('voting-hint');
      useUIStore.getState().dismissHint();
      const { showingHint, currentHintId } = useUIStore.getState();
      expect(showingHint).toBe(false);
      expect(currentHintId).toBeNull();
    });

    it('should replace current hint with new one', () => {
      useUIStore.getState().showHint('hint-1');
      useUIStore.getState().showHint('hint-2');
      expect(useUIStore.getState().currentHintId).toBe('hint-2');
    });
  });

  describe('Hints and tabs interaction', () => {
    it('should maintain hint state when switching tabs', () => {
      useUIStore.getState().showHint('test-hint');
      useUIStore.getState().setActiveTab('history');
      expect(useUIStore.getState().showingHint).toBe(true);
      expect(useUIStore.getState().currentHintId).toBe('test-hint');
    });
  });
});

describe('State Reset', () => {
  it('should reset all state to initial values', () => {
    // Modify all state
    useUIStore.getState().setActiveTab('history');
    useUIStore.getState().setHelpOpen(true);
    useUIStore.getState().setTutorialOpen(true);
    useUIStore.getState().setTutorialStep(5);
    useUIStore.getState().showHint('test-hint');

    // Reset
    useUIStore.getState().resetUIState();

    // Verify reset
    const state = useUIStore.getState();
    expect(state.activeTab).toBe('action');
    expect(state.helpOpen).toBe(false);
    expect(state.tutorialOpen).toBe(false);
    expect(state.tutorialStep).toBe(0);
    expect(state.showingHint).toBe(false);
    expect(state.currentHintId).toBeNull();
  });
});

describe('Tab Accessibility', () => {
  it('should have valid tab values', () => {
    const validTabs: GameTab[] = ['action', 'deals', 'history'];
    for (const tab of validTabs) {
      useUIStore.getState().setActiveTab(tab);
      expect(useUIStore.getState().activeTab).toBe(tab);
    }
  });
});

describe('Complex Interactions', () => {
  it('should handle multiple overlays open simultaneously', () => {
    useUIStore.getState().setHelpOpen(true);
    useUIStore.getState().showHint('test-hint');

    expect(useUIStore.getState().helpOpen).toBe(true);
    expect(useUIStore.getState().showingHint).toBe(true);
  });

  it('should maintain state consistency during rapid interactions', () => {
    // Simulate rapid user interactions
    for (let i = 0; i < 10; i++) {
      useUIStore.getState().setActiveTab(i % 2 === 0 ? 'deals' : 'action');
      useUIStore.getState().toggleHelp();
    }

    // State should be consistent
    const state = useUIStore.getState();
    expect(['action', 'deals', 'history']).toContain(state.activeTab);
    expect(typeof state.helpOpen).toBe('boolean');
  });
});

describe('Tab Switching Performance', () => {
  it('should switch tabs with minimal overhead', () => {
    const start = performance.now();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      useUIStore.getState().setActiveTab('deals');
      useUIStore.getState().setActiveTab('history');
      useUIStore.getState().setActiveTab('action');
    }

    const end = performance.now();
    const timePerSwitch = (end - start) / (iterations * 3);

    // Each tab switch should be well under 1ms in Zustand
    expect(timePerSwitch).toBeLessThan(1);
  });
});
