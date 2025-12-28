/**
 * Game rules and calculations
 * Derived from specs/001-politics-game-core/data-model.md
 */

import type {
  Player,
  NationState,
  CardOption,
  Vote,
  VoteChoice,
  Ideology,
  VictoryResult,
  CollapseResult,
  VoteResult,
  GameSettings,
} from './types';
import {
  NATION_THRESHOLDS,
  INFLUENCE_THRESHOLDS,
  INFLUENCE_COSTS,
  DEFAULT_GAME_SETTINGS,
} from './constants';

// ============================================
// Dice Rolling
// ============================================

/**
 * Roll a standard d6 (1-6)
 */
export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Calculate dice roll modifier based on nation budget
 */
export function getDiceModifier(nation: NationState): number {
  if (nation.budget >= NATION_THRESHOLDS.BUDGET_HIGH) {
    return 1; // Budget surplus: +1 to roll
  }
  if (nation.budget <= NATION_THRESHOLDS.BUDGET_LOW) {
    return -1; // Budget deficit: -1 to roll
  }
  return 0;
}

/**
 * Get modified dice roll (with nation state modifiers)
 */
export function getModifiedDiceRoll(roll: number, nation: NationState): number {
  const modifier = getDiceModifier(nation);
  return Math.max(1, roll + modifier); // Minimum roll of 1
}

// ============================================
// Movement Calculation
// ============================================

export interface MovementCalculation {
  baseMovement: number;
  ideologyBonus: number;
  ideologyPenalty: number;
  influenceBonus: number;
  nationModifier: number;
  influenceSpent: number;
  total: number;
  reasons: string[];
}

/**
 * Calculate movement for a player based on vote outcome
 */
export function calculateMovement(
  player: Player,
  nation: NationState,
  option: CardOption | null,
  isActivePlayer: boolean,
  diceRoll: number,
  votesPassed: boolean,
  influenceSpentForMovement: number = 0,
  negatePenalty: boolean = false
): MovementCalculation {
  const reasons: string[] = [];
  let baseMovement = 0;
  let ideologyBonus = 0;
  let ideologyPenalty = 0;
  let influenceBonus = 0;
  let nationModifier = 0;
  let influenceSpent = 0;

  // Active player gets dice roll if vote passes
  if (isActivePlayer && votesPassed) {
    baseMovement = diceRoll;
    reasons.push(`Dice roll: +${diceRoll}`);
  }

  // Ideology alignment/opposition (only if vote passed and option exists)
  if (votesPassed && option && player.ideology) {
    // Check if aligned
    const alignedEntry = option.aligned.find(a => a.ideology === player.ideology);
    if (alignedEntry) {
      ideologyBonus = alignedEntry.movement;
      reasons.push(`Ideology aligned: +${ideologyBonus}`);
    }

    // Check if opposed
    const opposedEntry = option.opposed.find(o => o.ideology === player.ideology);
    if (opposedEntry) {
      if (negatePenalty) {
        reasons.push(`Penalty negated (spent influence)`);
      } else {
        ideologyPenalty = -opposedEntry.movement;
        reasons.push(`Ideology opposed: ${ideologyPenalty}`);
      }
    }
  }

  // Influence-based modifier
  if (player.influence >= INFLUENCE_THRESHOLDS.HIGH) {
    influenceBonus = 1;
    reasons.push(`High influence (${player.influence}): +1`);
  } else if (player.influence <= INFLUENCE_THRESHOLDS.LOW) {
    influenceBonus = -1;
    reasons.push(`Low influence (${player.influence}): -1`);
  }

  // Nation state modifier
  if (nation.stability >= NATION_THRESHOLDS.STABILITY_HIGH) {
    nationModifier = 1;
    reasons.push(`Nation stable: +1`);
  } else if (nation.stability <= NATION_THRESHOLDS.STABILITY_LOW) {
    nationModifier = -1;
    reasons.push(`Nation in crisis: -1`);
  }

  // Influence spending for extra movement
  if (influenceSpentForMovement > 0) {
    const extraMovement = Math.floor(influenceSpentForMovement / INFLUENCE_COSTS.EXTRA_MOVEMENT);
    influenceSpent = extraMovement;
    if (extraMovement > 0) {
      reasons.push(`Spent ${influenceSpentForMovement} influence: +${extraMovement}`);
    }
  }

  const total = Math.max(0, baseMovement + ideologyBonus + ideologyPenalty + influenceBonus + nationModifier + influenceSpent);

  return {
    baseMovement,
    ideologyBonus,
    ideologyPenalty,
    influenceBonus,
    nationModifier,
    influenceSpent,
    total,
    reasons,
  };
}

/**
 * Apply movement to a player's position
 */
export function applyMovement(
  currentPosition: number,
  movement: number,
  pathLength: number = DEFAULT_GAME_SETTINGS.pathLength
): number {
  const newPosition = currentPosition + movement;
  // Floor at 0, cap at pathLength
  return Math.max(0, Math.min(newPosition, pathLength));
}

// ============================================
// Vote Weight Calculation
// ============================================

/**
 * Calculate vote weight for a player
 */
export function calculateVoteWeight(vote: Vote): number {
  // Base weight of 1 + any influence spent
  return 1 + vote.influenceSpent;
}

/**
 * Calculate vote results from all votes
 */
export function calculateVoteResults(votes: Vote[]): VoteResult {
  let totalYes = 0;
  let totalNo = 0;

  const voteDetails = votes.map(vote => {
    const weight = calculateVoteWeight(vote);

    if (vote.choice === 'yes') {
      totalYes += weight;
    } else if (vote.choice === 'no') {
      totalNo += weight;
    }
    // Abstain doesn't count toward either

    return {
      playerId: vote.playerId,
      choice: vote.choice,
      influenceSpent: vote.influenceSpent,
      totalWeight: weight,
    };
  });

  return {
    totalYes,
    totalNo,
    passed: totalYes > totalNo, // Strict majority
    votes: voteDetails,
  };
}

// ============================================
// Collapse Check
// ============================================

/**
 * Check if the nation has collapsed
 */
export function checkCollapse(nation: NationState): CollapseResult {
  if (nation.stability <= NATION_THRESHOLDS.STABILITY_COLLAPSE) {
    return { collapsed: true, reason: 'stability' };
  }
  if (nation.budget <= NATION_THRESHOLDS.BUDGET_COLLAPSE) {
    return { collapsed: true, reason: 'budget' };
  }
  return { collapsed: false };
}

/**
 * Apply nation state changes (with bounds checking)
 */
export function applyNationChanges(
  nation: NationState,
  budgetChange: number,
  stabilityChange: number
): NationState {
  return {
    stability: Math.max(
      NATION_THRESHOLDS.STABILITY_MIN,
      Math.min(NATION_THRESHOLDS.STABILITY_MAX, nation.stability + stabilityChange)
    ),
    budget: Math.max(
      NATION_THRESHOLDS.BUDGET_MIN,
      Math.min(NATION_THRESHOLDS.BUDGET_MAX, nation.budget + budgetChange)
    ),
  };
}

// ============================================
// Victory Check
// ============================================

/**
 * Check if a player has won
 */
export function checkVictory(
  player: Player,
  settings: GameSettings = DEFAULT_GAME_SETTINGS
): VictoryResult {
  if (player.position >= settings.pathLength) {
    if (player.influence >= INFLUENCE_THRESHOLDS.VICTORY_REQUIRED) {
      return { type: 'win', playerId: player.id };
    } else {
      // Stop one space before end, must wait
      return { type: 'waiting' };
    }
  }
  return { type: 'ongoing' };
}

/**
 * Check victory for all players, handle tiebreaker
 */
export function checkAllVictories(
  players: Player[],
  settings: GameSettings = DEFAULT_GAME_SETTINGS
): VictoryResult {
  const winners = players.filter(p => {
    const result = checkVictory(p, settings);
    return result.type === 'win';
  });

  if (winners.length === 0) {
    return { type: 'ongoing' };
  }

  if (winners.length === 1) {
    return { type: 'win', playerId: winners[0].id };
  }

  // Tiebreaker: highest influence
  winners.sort((a, b) => b.influence - a.influence);
  return { type: 'win', playerId: winners[0].id };
}

// ============================================
// Board Zone Determination
// ============================================

import { BOARD_ZONES } from './constants';
import type { Zone } from './types';

/**
 * Determine which zone a position is in
 */
export function getZoneForPosition(position: number): Zone {
  if (position <= BOARD_ZONES.EARLY_TERM.end) {
    return 'earlyTerm';
  }
  if (position <= BOARD_ZONES.MID_TERM.end) {
    return 'midTerm';
  }
  if (position <= BOARD_ZONES.CRISIS_ZONE.end) {
    return 'crisisZone';
  }
  return 'lateTerm';
}

/**
 * Get the most advanced zone among all players
 */
export function getMostAdvancedZone(players: Player[]): Zone {
  const maxPosition = Math.max(...players.map(p => p.position));
  return getZoneForPosition(maxPosition);
}

// ============================================
// Influence Changes
// ============================================

/**
 * Apply influence change (with bounds checking)
 */
export function applyInfluenceChange(currentInfluence: number, change: number): number {
  return Math.max(
    INFLUENCE_THRESHOLDS.MIN,
    Math.min(INFLUENCE_THRESHOLDS.MAX, currentInfluence + change)
  );
}

/**
 * Calculate influence change based on ideology alignment with a passed option
 * When a vote passes:
 * - Players aligned with the option gain +1 influence (their values advanced)
 * - Players opposed to the option lose -1 influence (their values were compromised)
 *
 * Educational value: Teaches that political actors gain/lose standing based on outcomes
 */
export function calculateIdeologyInfluenceChange(
  playerIdeology: Ideology | null,
  option: CardOption
): number {
  if (!playerIdeology) return 0;

  // Check if aligned with this option
  const isAligned = option.aligned.some(a => a.ideology === playerIdeology);
  if (isAligned) {
    return 1; // Gain influence when your ideology's policies pass
  }

  // Check if opposed to this option
  const isOpposed = option.opposed.some(o => o.ideology === playerIdeology);
  if (isOpposed) {
    return -1; // Lose influence when opposed policies pass
  }

  return 0; // No alignment effect
}

/**
 * Check if player can spend influence for an action
 */
export function canSpendInfluence(player: Player, amount: number): boolean {
  return player.influence >= amount;
}

// ============================================
// Support Token Logic
// ============================================

/**
 * Calculate influence changes from a broken deal
 * When token owner votes against holder's proposal:
 * - Holder gains +1 Influence
 * - Owner loses -1 Influence
 */
export function calculateDealBreakInfluence(): { holderChange: number; ownerChange: number } {
  return {
    holderChange: 1,
    ownerChange: -1,
  };
}
