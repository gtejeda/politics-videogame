/**
 * Crisis Events
 * Shared challenges that require coordinated player response
 * Teaching cooperative-competitive dynamics from the spec
 */

import type { Ideology } from './types';

export type CrisisSeverity = 'minor' | 'moderate' | 'severe';

export interface CrisisEvent {
  id: string;
  name: string;
  description: string;
  severity: CrisisSeverity;

  // What triggers this crisis
  trigger: {
    type: 'stability_threshold' | 'budget_threshold' | 'random' | 'turn_count';
    value: number;
  };

  // Contribution mechanics
  contributionThreshold: number; // Total contribution needed to resolve
  maxContributionPerPlayer: number;

  // Consequences
  successEffect: {
    stabilityChange: number;
    budgetChange: number;
    message: string;
  };

  failureEffect: {
    stabilityChange: number;
    budgetChange: number;
    message: string;
  };

  // Educational/thematic
  historicalNote: string | null;

  // Ideology effects (some ideologies handle certain crises better)
  ideologyBonuses?: Array<{
    ideology: Ideology;
    contributionBonus: number; // Extra contribution value per point spent
  }>;
}

export interface ActiveCrisis {
  crisis: CrisisEvent;
  contributions: Map<string, number>; // playerId -> contribution amount
  turnsRemaining: number;
  isResolved: boolean;
  outcome?: 'success' | 'failure';
}

// ============================================
// Crisis Events Library
// ============================================

export const CRISIS_EVENTS: CrisisEvent[] = [
  {
    id: 'economic-crash',
    name: 'Economic Crisis',
    description: 'Markets are in freefall. Banks are failing and unemployment is skyrocketing. The nation needs an immediate coordinated response to stabilize the economy.',
    severity: 'severe',
    trigger: { type: 'budget_threshold', value: 4 },
    contributionThreshold: 8,
    maxContributionPerPlayer: 3,
    successEffect: {
      stabilityChange: 2,
      budgetChange: 1,
      message: 'Through coordinated action, the economic crisis was contained. Markets stabilize.',
    },
    failureEffect: {
      stabilityChange: -2,
      budgetChange: -2,
      message: 'Failure to coordinate worsened the crisis. The economy enters a deep recession.',
    },
    historicalNote: 'Similar to the 2008 global financial crisis, where international coordination was essential to prevent total collapse.',
    ideologyBonuses: [
      { ideology: 'liberal', contributionBonus: 1 },
    ],
  },
  {
    id: 'social-unrest',
    name: 'Civil Unrest',
    description: 'Protests have erupted across major cities. Citizens are demanding change. The government must respond before tensions escalate further.',
    severity: 'moderate',
    trigger: { type: 'stability_threshold', value: 4 },
    contributionThreshold: 6,
    maxContributionPerPlayer: 2,
    successEffect: {
      stabilityChange: 2,
      budgetChange: -1,
      message: 'The government listened to the people. Reforms were implemented peacefully.',
    },
    failureEffect: {
      stabilityChange: -3,
      budgetChange: 0,
      message: 'Unaddressed grievances led to escalating protests. Social order is threatened.',
    },
    historicalNote: 'Mass protests have shaped history from the Civil Rights movement to the Arab Spring.',
    ideologyBonuses: [
      { ideology: 'progressive', contributionBonus: 1 },
      { ideology: 'populist', contributionBonus: 1 },
    ],
  },
  {
    id: 'external-threat',
    name: 'External Threat',
    description: 'A neighboring power is making aggressive moves on the border. The nation must present a united front to deter aggression.',
    severity: 'severe',
    trigger: { type: 'random', value: 15 }, // 15% chance per turn after crisis zone
    contributionThreshold: 10,
    maxContributionPerPlayer: 3,
    successEffect: {
      stabilityChange: 1,
      budgetChange: -2,
      message: 'A united response deterred the external threat. The nation demonstrated resolve.',
    },
    failureEffect: {
      stabilityChange: -2,
      budgetChange: -1,
      message: 'Divided response emboldened external actors. National security is compromised.',
    },
    historicalNote: 'Throughout history, internal divisions have often invited external aggression.',
    ideologyBonuses: [
      { ideology: 'nationalist', contributionBonus: 2 },
      { ideology: 'conservative', contributionBonus: 1 },
    ],
  },
  {
    id: 'institutional-breakdown',
    name: 'Institutional Crisis',
    description: 'A major scandal has rocked the government. Public trust in institutions is collapsing. Immediate reforms are needed.',
    severity: 'moderate',
    trigger: { type: 'stability_threshold', value: 5 },
    contributionThreshold: 7,
    maxContributionPerPlayer: 2,
    successEffect: {
      stabilityChange: 3,
      budgetChange: 0,
      message: 'Transparency reforms restored public trust. Institutions emerge stronger.',
    },
    failureEffect: {
      stabilityChange: -2,
      budgetChange: 0,
      message: 'Failure to reform deepened public cynicism. Democratic norms are eroding.',
    },
    historicalNote: 'From Watergate to modern corruption scandals, institutional crises test democratic resilience.',
    ideologyBonuses: [
      { ideology: 'liberal', contributionBonus: 1 },
      { ideology: 'conservative', contributionBonus: 1 },
    ],
  },
  {
    id: 'resource-shortage',
    name: 'Resource Crisis',
    description: 'Critical resources are running dangerously low. Without immediate action, basic services will fail.',
    severity: 'minor',
    trigger: { type: 'budget_threshold', value: 3 },
    contributionThreshold: 5,
    maxContributionPerPlayer: 2,
    successEffect: {
      stabilityChange: 1,
      budgetChange: 2,
      message: 'Emergency measures secured necessary resources. Supply chains are stabilized.',
    },
    failureEffect: {
      stabilityChange: -1,
      budgetChange: -1,
      message: 'Resource shortages persist. Citizens are suffering from lack of basic necessities.',
    },
    historicalNote: 'Resource scarcity has driven conflict and cooperation throughout human history.',
    ideologyBonuses: [
      { ideology: 'populist', contributionBonus: 1 },
    ],
  },
];

// ============================================
// Crisis Functions
// ============================================

/**
 * Check if a crisis should trigger based on current nation state
 */
export function shouldTriggerCrisis(
  stability: number,
  budget: number,
  currentTurn: number,
  activeCrisisId: string | null
): CrisisEvent | null {
  // Don't trigger if there's already an active crisis
  if (activeCrisisId) return null;

  // Check stability-triggered crises
  for (const crisis of CRISIS_EVENTS) {
    if (crisis.trigger.type === 'stability_threshold' && stability <= crisis.trigger.value) {
      return crisis;
    }
    if (crisis.trigger.type === 'budget_threshold' && budget <= crisis.trigger.value) {
      return crisis;
    }
    if (crisis.trigger.type === 'random' && currentTurn >= 10) {
      // Random crises only after crisis zone (turn 10+)
      const roll = Math.random() * 100;
      if (roll <= crisis.trigger.value) {
        return crisis;
      }
    }
  }

  return null;
}

/**
 * Calculate total contributions with ideology bonuses
 */
export function calculateTotalContribution(
  contributions: Map<string, number>,
  players: Map<string, { ideology: Ideology | null }>,
  crisis: CrisisEvent
): number {
  let total = 0;

  for (const [playerId, amount] of contributions) {
    let contribution = amount;

    // Apply ideology bonuses
    if (crisis.ideologyBonuses) {
      const player = players.get(playerId);
      if (player?.ideology) {
        const bonus = crisis.ideologyBonuses.find(b => b.ideology === player.ideology);
        if (bonus) {
          contribution += bonus.contributionBonus * amount;
        }
      }
    }

    total += contribution;
  }

  return total;
}

/**
 * Resolve a crisis based on contributions
 */
export function resolveCrisis(
  crisis: CrisisEvent,
  totalContribution: number
): 'success' | 'failure' {
  return totalContribution >= crisis.contributionThreshold ? 'success' : 'failure';
}

/**
 * Get a random crisis for testing/variety
 */
export function getRandomCrisis(): CrisisEvent {
  const index = Math.floor(Math.random() * CRISIS_EVENTS.length);
  return CRISIS_EVENTS[index];
}
