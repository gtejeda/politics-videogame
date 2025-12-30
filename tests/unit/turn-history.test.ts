/**
 * Unit tests for turn history tracking
 * Tests turn history creation, validation, and utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  calculateVoteMargin,
  determineVoteOutcome,
  zoneToCategory,
  createTurnHistoryEntry,
  type TurnHistoryEntry,
  type VoteRecord,
  type PlayerMovementRecord,
} from '@/lib/game/turn-history';

describe('Vote Margin Calculation', () => {
  describe('calculateVoteMargin', () => {
    it('should format margin with higher count first', () => {
      expect(calculateVoteMargin(3, 2)).toBe('3-2');
      expect(calculateVoteMargin(2, 3)).toBe('3-2');
    });

    it('should handle unanimous votes', () => {
      expect(calculateVoteMargin(5, 0)).toBe('5-0');
      expect(calculateVoteMargin(0, 4)).toBe('4-0');
    });

    it('should handle tied votes', () => {
      expect(calculateVoteMargin(2, 2)).toBe('2-2');
      expect(calculateVoteMargin(0, 0)).toBe('0-0');
    });

    it('should handle close margins', () => {
      expect(calculateVoteMargin(3, 2)).toBe('3-2');
      expect(calculateVoteMargin(4, 3)).toBe('4-3');
    });
  });
});

describe('Vote Outcome Determination', () => {
  describe('determineVoteOutcome', () => {
    it('should return passed when yes votes exceed no votes', () => {
      expect(determineVoteOutcome(3, 2)).toBe('passed');
      expect(determineVoteOutcome(5, 0)).toBe('passed');
      expect(determineVoteOutcome(1, 0)).toBe('passed');
    });

    it('should return failed when no votes exceed yes votes', () => {
      expect(determineVoteOutcome(2, 3)).toBe('failed');
      expect(determineVoteOutcome(0, 5)).toBe('failed');
      expect(determineVoteOutcome(0, 1)).toBe('failed');
    });

    it('should return failed for tied votes', () => {
      // Ties fail - you need a majority to pass
      expect(determineVoteOutcome(2, 2)).toBe('failed');
      expect(determineVoteOutcome(0, 0)).toBe('failed');
    });
  });
});

describe('Zone to Category Mapping', () => {
  describe('zoneToCategory', () => {
    it('should map earlyTerm correctly', () => {
      expect(zoneToCategory('earlyTerm')).toBe('early-term');
    });

    it('should map midTerm correctly', () => {
      expect(zoneToCategory('midTerm')).toBe('mid-term');
    });

    it('should map crisisZone correctly', () => {
      expect(zoneToCategory('crisisZone')).toBe('crisis-zone');
    });

    it('should map lateTerm correctly', () => {
      expect(zoneToCategory('lateTerm')).toBe('late-term');
    });

    it('should default to early-term for unknown zones', () => {
      expect(zoneToCategory('unknown')).toBe('early-term');
      expect(zoneToCategory('')).toBe('early-term');
    });
  });
});

describe('Turn History Entry Creation', () => {
  const baseParams = {
    turnNumber: 1,
    activePlayer: {
      id: 'player1',
      name: 'Alice',
      ideology: 'progressive' as const,
    },
    card: {
      id: 'card1',
      title: 'Economic Policy',
      zone: 'earlyTerm',
    },
    selectedOption: {
      id: 'A',
      name: 'Option A',
      budgetChange: -2,
      stabilityChange: 1,
    },
    votes: [
      {
        playerId: 'player1',
        playerName: 'Alice',
        playerIdeology: 'progressive' as const,
        choice: 'yes' as const,
        influenceSpent: 0,
        alignedWithIdeology: true,
      },
      {
        playerId: 'player2',
        playerName: 'Bob',
        playerIdeology: 'conservative' as const,
        choice: 'no' as const,
        influenceSpent: 1,
        alignedWithIdeology: true,
      },
    ],
    nationBefore: { budget: 10, stability: 10 },
    nationAfter: { budget: 8, stability: 11 },
    movements: [
      {
        playerId: 'player1',
        playerName: 'Alice',
        diceRoll: 4,
        ideologyModifier: 1,
        nationModifier: 0,
        influenceBonus: 0,
        totalMovement: 5,
        positionBefore: 0,
        positionAfter: 5,
      },
    ],
  };

  describe('createTurnHistoryEntry', () => {
    it('should create a valid turn history entry', () => {
      const entry = createTurnHistoryEntry(baseParams);

      expect(entry.turnNumber).toBe(1);
      expect(entry.activePlayerId).toBe('player1');
      expect(entry.activePlayerName).toBe('Alice');
      expect(entry.activePlayerIdeology).toBe('progressive');
    });

    it('should correctly set proposal details', () => {
      const entry = createTurnHistoryEntry(baseParams);

      expect(entry.proposal.cardId).toBe('card1');
      expect(entry.proposal.cardTitle).toBe('Economic Policy');
      expect(entry.proposal.cardCategory).toBe('early-term');
      expect(entry.proposal.optionChosen).toBe('Option A');
      expect(entry.proposal.nationImpact.budgetEffect).toBe(-2);
      expect(entry.proposal.nationImpact.stabilityEffect).toBe(1);
    });

    it('should correctly calculate vote counts', () => {
      const entry = createTurnHistoryEntry(baseParams);

      // Player 1: 1 base + 0 influence = 1 yes weight
      // Player 2: 1 base + 1 influence = 2 no weight
      expect(entry.yesCount).toBe(1);
      expect(entry.noCount).toBe(2);
      expect(entry.abstainCount).toBe(0);
    });

    it('should correctly determine outcome', () => {
      const entry = createTurnHistoryEntry(baseParams);

      // 1 yes vs 2 no = failed
      expect(entry.outcome).toBe('failed');
    });

    it('should correctly calculate margin', () => {
      const entry = createTurnHistoryEntry(baseParams);

      expect(entry.margin).toBe('2-1');
    });

    it('should correctly set nation changes', () => {
      const entry = createTurnHistoryEntry(baseParams);

      expect(entry.nationChanges.budgetBefore).toBe(10);
      expect(entry.nationChanges.budgetAfter).toBe(8);
      expect(entry.nationChanges.budgetDelta).toBe(-2);
      expect(entry.nationChanges.stabilityBefore).toBe(10);
      expect(entry.nationChanges.stabilityAfter).toBe(11);
      expect(entry.nationChanges.stabilityDelta).toBe(1);
    });

    it('should include timestamp', () => {
      const before = Date.now();
      const entry = createTurnHistoryEntry(baseParams);
      const after = Date.now();

      expect(entry.timestamp).toBeGreaterThanOrEqual(before);
      expect(entry.timestamp).toBeLessThanOrEqual(after);
    });

    it('should correctly transform vote records', () => {
      const entry = createTurnHistoryEntry(baseParams);

      expect(entry.votes).toHaveLength(2);

      const aliceVote = entry.votes.find((v) => v.playerId === 'player1');
      expect(aliceVote).toBeDefined();
      expect(aliceVote?.vote).toBe('yes');
      expect(aliceVote?.voteWeight).toBe(1);
      expect(aliceVote?.alignedWithIdeology).toBe(true);

      const bobVote = entry.votes.find((v) => v.playerId === 'player2');
      expect(bobVote).toBeDefined();
      expect(bobVote?.vote).toBe('no');
      expect(bobVote?.voteWeight).toBe(2);
      expect(bobVote?.influenceSpent).toBe(1);
    });

    it('should include player movements', () => {
      const entry = createTurnHistoryEntry(baseParams);

      expect(entry.playerMovements).toHaveLength(1);
      expect(entry.playerMovements[0].playerId).toBe('player1');
      expect(entry.playerMovements[0].totalMovement).toBe(5);
    });

    it('should handle concepts triggered', () => {
      const entryWithConcepts = createTurnHistoryEntry({
        ...baseParams,
        conceptsTriggered: ['strategic-voting', 'horse-trading'],
      });

      expect(entryWithConcepts.conceptsTriggered).toEqual([
        'strategic-voting',
        'horse-trading',
      ]);
    });

    it('should default to empty concepts array', () => {
      const entry = createTurnHistoryEntry(baseParams);

      expect(entry.conceptsTriggered).toEqual([]);
    });

    it('should handle abstain votes', () => {
      const paramsWithAbstain = {
        ...baseParams,
        votes: [
          ...baseParams.votes,
          {
            playerId: 'player3',
            playerName: 'Charlie',
            playerIdeology: 'liberal' as const,
            choice: 'abstain' as const,
            influenceSpent: 0,
          },
        ],
      };

      const entry = createTurnHistoryEntry(paramsWithAbstain);

      expect(entry.abstainCount).toBe(1);
      // Abstains don't affect yes/no counts
      expect(entry.yesCount).toBe(1);
      expect(entry.noCount).toBe(2);
    });
  });
});

describe('Turn History Entry Structure', () => {
  it('should match the expected interface', () => {
    const entry: TurnHistoryEntry = {
      turnNumber: 1,
      timestamp: Date.now(),
      activePlayerId: 'player1',
      activePlayerName: 'Test',
      activePlayerIdeology: 'progressive',
      proposal: {
        cardId: 'card1',
        cardTitle: 'Test Card',
        cardCategory: 'early-term',
        optionChosen: 'Option A',
        nationImpact: {
          budgetEffect: 0,
          stabilityEffect: 0,
        },
      },
      votes: [],
      outcome: 'passed',
      yesCount: 3,
      noCount: 2,
      abstainCount: 0,
      margin: '3-2',
      nationChanges: {
        budgetBefore: 10,
        budgetAfter: 10,
        budgetDelta: 0,
        stabilityBefore: 10,
        stabilityAfter: 10,
        stabilityDelta: 0,
      },
      playerMovements: [],
      conceptsTriggered: [],
    };

    // Type check passes if this compiles
    expect(entry.turnNumber).toBe(1);
  });

  it('should have valid VoteRecord structure', () => {
    const vote: VoteRecord = {
      playerId: 'player1',
      playerName: 'Test',
      playerIdeology: 'progressive',
      vote: 'yes',
      influenceSpent: 0,
      voteWeight: 1,
      alignedWithIdeology: true,
    };

    expect(vote.voteWeight).toBe(1 + vote.influenceSpent);
  });

  it('should have valid PlayerMovementRecord structure', () => {
    const movement: PlayerMovementRecord = {
      playerId: 'player1',
      playerName: 'Test',
      diceRoll: 4,
      ideologyModifier: 1,
      nationModifier: 0,
      influenceBonus: 0,
      totalMovement: 5,
      positionBefore: 0,
      positionAfter: 5,
    };

    expect(movement.positionAfter).toBe(movement.positionBefore + movement.totalMovement);
  });
});

describe('Edge Cases', () => {
  it('should handle zero votes', () => {
    expect(calculateVoteMargin(0, 0)).toBe('0-0');
    expect(determineVoteOutcome(0, 0)).toBe('failed');
  });

  it('should handle large vote counts', () => {
    expect(calculateVoteMargin(100, 50)).toBe('100-50');
    expect(determineVoteOutcome(100, 50)).toBe('passed');
  });

  it('should handle weighted votes correctly', () => {
    const params = {
      turnNumber: 1,
      activePlayer: { id: 'p1', name: 'A', ideology: 'progressive' as const },
      card: { id: 'c1', title: 'C', zone: 'earlyTerm' },
      selectedOption: { id: 'A', name: 'O', budgetChange: 0, stabilityChange: 0 },
      votes: [
        {
          playerId: 'p1',
          playerName: 'A',
          playerIdeology: 'progressive' as const,
          choice: 'yes' as const,
          influenceSpent: 3, // Heavy influence spend
        },
        {
          playerId: 'p2',
          playerName: 'B',
          playerIdeology: 'conservative' as const,
          choice: 'no' as const,
          influenceSpent: 0,
        },
      ],
      nationBefore: { budget: 10, stability: 10 },
      nationAfter: { budget: 10, stability: 10 },
      movements: [],
    };

    const entry = createTurnHistoryEntry(params);

    // Player 1: 1 + 3 = 4 yes weight
    // Player 2: 1 + 0 = 1 no weight
    expect(entry.yesCount).toBe(4);
    expect(entry.noCount).toBe(1);
    expect(entry.outcome).toBe('passed');
  });
});
