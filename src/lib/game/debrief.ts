/**
 * Collapse Debrief Generation
 * Provides educational context for game endings
 */

import type { CollapseDebrief, TurnHistory, NationState } from './types';

/**
 * Historical parallels for stability collapse
 */
const STABILITY_PARALLELS = [
  {
    event: 'Weimar Republic (1919-1933)',
    description: 'Political instability, hyperinflation, and extremism led to the collapse of German democracy.',
    lesson: 'Without broad political consensus and stable institutions, democracies can fall to extremism.',
  },
  {
    event: 'Fall of the Roman Republic (133-27 BC)',
    description: 'Political violence, civil wars, and the breakdown of republican norms ended centuries of democratic governance.',
    lesson: 'When political actors prioritize power over institutions, republics can become autocracies.',
  },
  {
    event: 'French Fourth Republic (1946-1958)',
    description: 'Government instability with 21 different governments in 12 years led to constitutional crisis.',
    lesson: 'Excessive fragmentation and inability to form stable coalitions can paralyze government.',
  },
  {
    event: 'Chilean Democracy (1970-1973)',
    description: 'Political polarization and economic chaos created conditions for military intervention.',
    lesson: 'Extreme polarization can undermine democratic legitimacy and invite authoritarian solutions.',
  },
];

/**
 * Historical parallels for budget/fiscal collapse
 */
const BUDGET_PARALLELS = [
  {
    event: 'Greek Debt Crisis (2009-2018)',
    description: 'Unsustainable debt, austerity measures, and economic contraction led to political upheaval.',
    lesson: 'Fiscal irresponsibility can force painful choices that destabilize governments.',
  },
  {
    event: 'Argentine Economic Crisis (2001-2002)',
    description: 'Currency collapse, debt default, and bank runs led to rapid government turnover.',
    lesson: 'Economic crises can quickly become political crises when citizens lose faith in institutions.',
  },
  {
    event: 'Zimbabwean Hyperinflation (2007-2009)',
    description: 'Monetary policy failures led to hyperinflation exceeding 79 billion percent, destroying the economy.',
    lesson: 'Fiscal mismanagement can spiral beyond control, making recovery extremely difficult.',
  },
  {
    event: 'Soviet Economic Collapse (1989-1991)',
    description: 'Central planning failures and resource misallocation contributed to the dissolution of the USSR.',
    lesson: 'Even superpowers can fall when economic foundations crumble.',
  },
];

/**
 * Get a random historical parallel for the collapse type
 */
function getHistoricalParallel(reason: 'stability' | 'budget') {
  const parallels = reason === 'stability' ? STABILITY_PARALLELS : BUDGET_PARALLELS;
  const randomIndex = Math.floor(Math.random() * parallels.length);
  return parallels[randomIndex];
}

/**
 * Analyze turn history to find key decisions that contributed to collapse
 */
function analyzeKeyDecisions(
  history: TurnHistory[],
  reason: 'stability' | 'budget'
): CollapseDebrief['keyDecisions'] {
  const keyDecisions: CollapseDebrief['keyDecisions'] = [];

  // Find the worst decisions for the collapse metric
  const relevantTurns = history
    .filter(turn => turn.passed && turn.nationChanges) // Only passed votes with changes
    .map(turn => ({
      turn: turn.turnNumber,
      card: turn.card,
      option: turn.proposedOption,
      impact: reason === 'stability'
        ? turn.nationChanges.stabilityChange
        : turn.nationChanges.budgetChange,
    }))
    .filter(turn => turn.impact < 0) // Only negative impacts
    .sort((a, b) => a.impact - b.impact); // Sort by most negative

  // Take up to 3 worst decisions
  relevantTurns.slice(0, 3).forEach(turn => {
    keyDecisions.push({
      turn: turn.turn,
      decision: turn.card?.title || 'Unknown decision',
      impact: reason === 'stability'
        ? `Reduced stability by ${Math.abs(turn.impact)}`
        : `Reduced budget by ${Math.abs(turn.impact)}`,
    });
  });

  // If we don't have enough bad decisions, add context about cumulative damage
  if (keyDecisions.length === 0) {
    keyDecisions.push({
      turn: history.length,
      decision: 'Cumulative policy effects',
      impact: `The nation's ${reason} was gradually eroded over multiple turns.`,
    });
  }

  return keyDecisions;
}

/**
 * Generate a collapse debrief based on reason and game history
 */
export function generateCollapseDebrief(
  reason: 'stability' | 'budget',
  finalNation: NationState,
  history: TurnHistory[]
): CollapseDebrief {
  const parallel = getHistoricalParallel(reason);
  const keyDecisions = analyzeKeyDecisions(history, reason);

  const whatHappened =
    reason === 'stability'
      ? `The nation's political stability collapsed to ${finalNation.stability}. ` +
        `Without sufficient stability, the government could no longer function effectively, ` +
        `leading to a breakdown of law and order.`
      : `The nation's budget collapsed to ${finalNation.budget}. ` +
        `Unable to meet financial obligations, the government defaulted on its debts, ` +
        `triggering an economic crisis that toppled the administration.`;

  return {
    whatHappened,
    realWorldParallel: `${parallel.event}: ${parallel.description}`,
    lesson: parallel.lesson,
    keyDecisions,
  };
}

/**
 * Get educational content for specific collapse types
 */
export function getCollapseEducation(reason: 'stability' | 'budget'): {
  title: string;
  explanation: string;
  prevention: string;
} {
  if (reason === 'stability') {
    return {
      title: 'Political Instability Collapse',
      explanation:
        'Political stability represents the government\'s ability to maintain order, ' +
        'enforce laws, and retain public legitimacy. When stability falls too low, ' +
        'the government loses its capacity to govern effectively.',
      prevention:
        'To prevent stability collapse, players should balance reforms with maintaining ' +
        'social order, avoid extreme policies that alienate large portions of the population, ' +
        'and build coalitions that can weather political storms.',
    };
  }

  return {
    title: 'Fiscal Collapse',
    explanation:
      'Budget represents the government\'s fiscal health and ability to fund essential services. ' +
      'When the budget falls too low, the government cannot pay debts, fund programs, ' +
      'or maintain basic functions.',
    prevention:
      'To prevent fiscal collapse, players should balance spending with revenue, ' +
      'avoid unsustainable promises, and make difficult trade-offs between popular ' +
      'programs and fiscal responsibility.',
  };
}
