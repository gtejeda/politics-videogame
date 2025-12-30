/**
 * Turn History Types and Utilities
 * Tracks detailed turn information for the History tab and post-game analysis
 */

import type { Ideology } from './types';

/**
 * Detailed vote record for a single player's vote
 */
export interface VoteRecord {
  playerId: string;
  playerName: string;
  playerIdeology: Ideology;
  vote: 'yes' | 'no' | 'abstain';
  influenceSpent: number;
  voteWeight: number; // 1 + influenceSpent
  alignedWithIdeology: boolean; // Did they vote as their ideology typically would?
}

/**
 * Detailed movement record for a single player's movement
 */
export interface PlayerMovementRecord {
  playerId: string;
  playerName: string;
  diceRoll: number | null; // Only for active player
  ideologyModifier: number;
  nationModifier: number;
  influenceBonus: number;
  totalMovement: number;
  positionBefore: number;
  positionAfter: number;
}

/**
 * Complete turn history entry with all details needed for display
 */
export interface TurnHistoryEntry {
  // Identity
  turnNumber: number;
  timestamp: number; // Unix timestamp

  // Active Player
  activePlayerId: string;
  activePlayerName: string;
  activePlayerIdeology: Ideology;

  // Proposal
  proposal: {
    cardId: string;
    cardTitle: string;
    cardCategory: 'early-term' | 'mid-term' | 'crisis-zone' | 'late-term';
    optionChosen: string;
    nationImpact: {
      budgetEffect: number;
      stabilityEffect: number;
    };
  };

  // Votes
  votes: VoteRecord[];
  outcome: 'passed' | 'failed';
  yesCount: number;
  noCount: number;
  abstainCount: number;
  margin: string; // e.g., "3-2", "4-1"

  // Results
  nationChanges: {
    budgetBefore: number;
    budgetAfter: number;
    budgetDelta: number;
    stabilityBefore: number;
    stabilityAfter: number;
    stabilityDelta: number;
  };

  playerMovements: PlayerMovementRecord[];

  // Concepts demonstrated this turn
  conceptsTriggered: string[]; // concept IDs
}

/**
 * Calculate vote margin string (e.g., "3-2", "4-1")
 */
export function calculateVoteMargin(yesCount: number, noCount: number): string {
  const higher = Math.max(yesCount, noCount);
  const lower = Math.min(yesCount, noCount);
  return `${higher}-${lower}`;
}

/**
 * Determine outcome from vote counts
 */
export function determineVoteOutcome(yesCount: number, noCount: number): 'passed' | 'failed' {
  return yesCount > noCount ? 'passed' : 'failed';
}

/**
 * Map zone to category string for display
 */
export function zoneToCategory(zone: string): 'early-term' | 'mid-term' | 'crisis-zone' | 'late-term' {
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
}

/**
 * Create a turn history entry from game state
 */
export function createTurnHistoryEntry(params: {
  turnNumber: number;
  activePlayer: {
    id: string;
    name: string;
    ideology: Ideology;
  };
  card: {
    id: string;
    title: string;
    zone: string;
  };
  selectedOption: {
    id: string;
    name: string;
    budgetChange: number;
    stabilityChange: number;
  };
  votes: Array<{
    playerId: string;
    playerName: string;
    playerIdeology: Ideology;
    choice: 'yes' | 'no' | 'abstain';
    influenceSpent: number;
    alignedWithIdeology?: boolean;
  }>;
  nationBefore: {
    budget: number;
    stability: number;
  };
  nationAfter: {
    budget: number;
    stability: number;
  };
  movements: PlayerMovementRecord[];
  conceptsTriggered?: string[];
}): TurnHistoryEntry {
  const yesVotes = params.votes.filter((v) => v.choice === 'yes');
  const noVotes = params.votes.filter((v) => v.choice === 'no');
  const abstainVotes = params.votes.filter((v) => v.choice === 'abstain');

  const yesCount = yesVotes.reduce((sum, v) => sum + 1 + v.influenceSpent, 0);
  const noCount = noVotes.reduce((sum, v) => sum + 1 + v.influenceSpent, 0);

  return {
    turnNumber: params.turnNumber,
    timestamp: Date.now(),
    activePlayerId: params.activePlayer.id,
    activePlayerName: params.activePlayer.name,
    activePlayerIdeology: params.activePlayer.ideology,
    proposal: {
      cardId: params.card.id,
      cardTitle: params.card.title,
      cardCategory: zoneToCategory(params.card.zone),
      optionChosen: params.selectedOption.name,
      nationImpact: {
        budgetEffect: params.selectedOption.budgetChange,
        stabilityEffect: params.selectedOption.stabilityChange,
      },
    },
    votes: params.votes.map((v) => ({
      playerId: v.playerId,
      playerName: v.playerName,
      playerIdeology: v.playerIdeology,
      vote: v.choice,
      influenceSpent: v.influenceSpent,
      voteWeight: 1 + v.influenceSpent,
      alignedWithIdeology: v.alignedWithIdeology ?? false,
    })),
    outcome: determineVoteOutcome(yesCount, noCount),
    yesCount,
    noCount,
    abstainCount: abstainVotes.length,
    margin: calculateVoteMargin(yesCount, noCount),
    nationChanges: {
      budgetBefore: params.nationBefore.budget,
      budgetAfter: params.nationAfter.budget,
      budgetDelta: params.nationAfter.budget - params.nationBefore.budget,
      stabilityBefore: params.nationBefore.stability,
      stabilityAfter: params.nationAfter.stability,
      stabilityDelta: params.nationAfter.stability - params.nationBefore.stability,
    },
    playerMovements: params.movements,
    conceptsTriggered: params.conceptsTriggered ?? [],
  };
}
