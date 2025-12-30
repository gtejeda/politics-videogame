/**
 * Unit tests for help content coverage
 * Ensures all game phases have help content and all terms are defined
 */

import { describe, it, expect } from 'vitest';
import {
  PHASE_HELP,
  TERM_DEFINITIONS,
  DEAL_HELP,
  HELP_CONTENT,
  getPhaseHelp,
  getTermDefinition,
  getAllTermDefinitions,
} from '@/lib/game/help-content';
import type { GamePhase } from '@/lib/game/types';

describe('Phase Help Content', () => {
  const expectedPhases: GamePhase[] = [
    'waiting',
    'rolling',
    'drawing',
    'reviewing',
    'deliberating',
    'proposing',
    'voting',
    'revealing',
    'resolving',
    'showingResults',
    'crisis',
  ];

  describe('Phase coverage', () => {
    it('should have help content for all game phases', () => {
      for (const phase of expectedPhases) {
        const help = PHASE_HELP[phase];
        expect(help, `Missing help for phase: ${phase}`).toBeDefined();
      }
    });

    it('should have correct phase property for each help entry', () => {
      for (const [phase, help] of Object.entries(PHASE_HELP)) {
        if (help) {
          expect(help.phase).toBe(phase);
        }
      }
    });
  });

  describe('Phase help structure', () => {
    it('should have all required fields for each phase', () => {
      for (const [phase, help] of Object.entries(PHASE_HELP)) {
        if (!help) continue;

        expect(help).toHaveProperty('title');
        expect(help).toHaveProperty('description');
        expect(help).toHaveProperty('availableActions');
        expect(help).toHaveProperty('tips');

        // Validate types
        expect(typeof help.title).toBe('string');
        expect(typeof help.description).toBe('string');
        expect(Array.isArray(help.availableActions)).toBe(true);
        expect(Array.isArray(help.tips)).toBe(true);
      }
    });

    it('should have non-empty content for each phase', () => {
      for (const [phase, help] of Object.entries(PHASE_HELP)) {
        if (!help) continue;

        expect(help.title.length, `${phase} title is empty`).toBeGreaterThan(0);
        expect(help.description.length, `${phase} description is empty`).toBeGreaterThan(10);
        expect(help.availableActions.length, `${phase} has no actions`).toBeGreaterThan(0);
        expect(help.tips.length, `${phase} has no tips`).toBeGreaterThan(0);
      }
    });

    it('should have meaningful action descriptions', () => {
      for (const [phase, help] of Object.entries(PHASE_HELP)) {
        if (!help) continue;

        for (const action of help.availableActions) {
          expect(action.length, `${phase} has empty action`).toBeGreaterThan(5);
        }
      }
    });

    it('should have meaningful tips', () => {
      for (const [phase, help] of Object.entries(PHASE_HELP)) {
        if (!help) continue;

        for (const tip of help.tips) {
          expect(tip.length, `${phase} has empty tip`).toBeGreaterThan(10);
        }
      }
    });
  });
});

describe('Term Definitions', () => {
  const expectedTerms = [
    'influence',
    'stability',
    'budget',
    'supportTokens',
    'deals',
    'collapse',
    'nationState',
    'voting',
    'ideology',
    'victory',
  ];

  describe('Term coverage', () => {
    it('should have definitions for all core game terms', () => {
      for (const term of expectedTerms) {
        expect(TERM_DEFINITIONS, `Missing term: ${term}`).toHaveProperty(term);
      }
    });

    it('should have at least 10 term definitions', () => {
      expect(Object.keys(TERM_DEFINITIONS).length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Term structure', () => {
    it('should have all required fields for each term', () => {
      for (const [termKey, term] of Object.entries(TERM_DEFINITIONS)) {
        expect(term).toHaveProperty('term');
        expect(term).toHaveProperty('displayName');
        expect(term).toHaveProperty('definition');
        expect(term).toHaveProperty('whyItMatters');

        // Optional field
        if (term.relatedTerms) {
          expect(Array.isArray(term.relatedTerms)).toBe(true);
        }
      }
    });

    it('should have matching term key and term property', () => {
      for (const [termKey, term] of Object.entries(TERM_DEFINITIONS)) {
        expect(term.term).toBe(termKey);
      }
    });

    it('should have non-empty content for each term', () => {
      for (const [termKey, term] of Object.entries(TERM_DEFINITIONS)) {
        expect(term.displayName.length, `${termKey} displayName is empty`).toBeGreaterThan(0);
        expect(term.definition.length, `${termKey} definition is empty`).toBeGreaterThan(20);
        expect(term.whyItMatters.length, `${termKey} whyItMatters is empty`).toBeGreaterThan(20);
      }
    });

    it('should have valid related terms references or known external references', () => {
      const allTermKeys = Object.keys(TERM_DEFINITIONS);
      // Some terms may reference concepts that aren't standalone definitions
      const allowedExternalRefs = ['votes', 'alignment', 'movement', 'negotiation'];

      for (const [termKey, term] of Object.entries(TERM_DEFINITIONS)) {
        if (term.relatedTerms) {
          for (const related of term.relatedTerms) {
            const isValidRef =
              allTermKeys.includes(related) || allowedExternalRefs.includes(related);
            expect(
              isValidRef,
              `${termKey} references unknown term: ${related}`
            ).toBe(true);
          }
        }
      }
    });
  });

  describe('Term accessibility', () => {
    it('should use simple language in definitions', () => {
      // Definitions should be accessible to new players
      for (const term of Object.values(TERM_DEFINITIONS)) {
        // No definition should be excessively long
        expect(term.definition.length).toBeLessThan(300);
      }
    });
  });
});

describe('Deal Help Content', () => {
  describe('Structure', () => {
    it('should have all required fields', () => {
      expect(DEAL_HELP).toHaveProperty('overview');
      expect(DEAL_HELP).toHaveProperty('steps');
      expect(DEAL_HELP).toHaveProperty('consequences');
      expect(DEAL_HELP).toHaveProperty('strategicValue');
    });

    it('should have non-empty content', () => {
      expect(DEAL_HELP.overview.length).toBeGreaterThan(20);
      expect(DEAL_HELP.steps.length).toBeGreaterThan(0);
      expect(DEAL_HELP.consequences.length).toBeGreaterThan(20);
      expect(DEAL_HELP.strategicValue.length).toBeGreaterThan(20);
    });

    it('should have ordered steps', () => {
      expect(DEAL_HELP.steps.length).toBeGreaterThanOrEqual(3);
      for (const step of DEAL_HELP.steps) {
        expect(step.length).toBeGreaterThan(10);
      }
    });
  });
});

describe('Helper Functions', () => {
  describe('getPhaseHelp', () => {
    it('should return help for valid phases', () => {
      const help = getPhaseHelp('voting');
      expect(help).not.toBeNull();
      expect(help?.phase).toBe('voting');
    });

    it('should return null for invalid phases', () => {
      // @ts-expect-error Testing invalid input
      const help = getPhaseHelp('nonexistent');
      expect(help).toBeNull();
    });
  });

  describe('getTermDefinition', () => {
    it('should return definition for valid terms', () => {
      const term = getTermDefinition('influence');
      expect(term).not.toBeNull();
      expect(term?.term).toBe('influence');
    });

    it('should be case-insensitive', () => {
      const term1 = getTermDefinition('Influence');
      const term2 = getTermDefinition('INFLUENCE');
      const term3 = getTermDefinition('influence');

      expect(term1).not.toBeNull();
      expect(term2).not.toBeNull();
      expect(term3).not.toBeNull();
      expect(term1?.term).toBe(term2?.term);
      expect(term2?.term).toBe(term3?.term);
    });

    it('should return null for invalid terms', () => {
      const term = getTermDefinition('nonexistent');
      expect(term).toBeNull();
    });
  });

  describe('getAllTermDefinitions', () => {
    it('should return all term definitions as array', () => {
      const terms = getAllTermDefinitions();
      expect(Array.isArray(terms)).toBe(true);
      expect(terms.length).toBe(Object.keys(TERM_DEFINITIONS).length);
    });

    it('should return complete term objects', () => {
      const terms = getAllTermDefinitions();
      for (const term of terms) {
        expect(term).toHaveProperty('term');
        expect(term).toHaveProperty('displayName');
        expect(term).toHaveProperty('definition');
        expect(term).toHaveProperty('whyItMatters');
      }
    });
  });
});

describe('HELP_CONTENT Store', () => {
  it('should have all content sections', () => {
    expect(HELP_CONTENT).toHaveProperty('phases');
    expect(HELP_CONTENT).toHaveProperty('terms');
    expect(HELP_CONTENT).toHaveProperty('deals');
  });

  it('should reference the same data as individual exports', () => {
    expect(HELP_CONTENT.phases).toBe(PHASE_HELP);
    expect(HELP_CONTENT.terms).toBe(TERM_DEFINITIONS);
    expect(HELP_CONTENT.deals).toBe(DEAL_HELP);
  });
});

describe('Educational Quality', () => {
  it('should explain concepts in educational terms', () => {
    // Check that help content teaches political concepts
    const votingHelp = getPhaseHelp('voting');
    expect(votingHelp?.description).toContain('vote');

    const dealHelp = DEAL_HELP;
    expect(dealHelp.overview).toContain('agreement');
    // Check for "Breaking" (case-insensitive) in consequences
    expect(dealHelp.consequences.toLowerCase()).toContain('break');
  });

  it('should provide strategic tips for gameplay', () => {
    for (const help of Object.values(PHASE_HELP)) {
      if (!help) continue;
      // Each phase should have at least one tip
      expect(help.tips.length).toBeGreaterThan(0);
    }
  });
});
