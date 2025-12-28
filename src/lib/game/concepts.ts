/**
 * Political Concepts Library
 * Educational content that can be demonstrated during gameplay
 */

import type { Ideology } from './types';

export interface PoliticalConcept {
  id: string;
  name: string;
  description: string;
  example: string;
  demonstratedBy: ConceptTrigger[];
}

export type ConceptTrigger =
  | { type: 'vote_outcome'; passed: boolean }
  | { type: 'coalition_formed'; ideologies: Ideology[] }
  | { type: 'token_given' }
  | { type: 'token_broken' }
  | { type: 'crisis_resolved'; outcome: 'success' | 'failure' }
  | { type: 'influence_spent'; action: string }
  | { type: 'nation_change'; metric: 'stability' | 'budget'; direction: 'increase' | 'decrease' }
  | { type: 'card_zone'; zone: 'earlyTerm' | 'midTerm' | 'crisisZone' | 'lateTerm' };

/**
 * Core political concepts demonstrated through gameplay
 */
export const POLITICAL_CONCEPTS: PoliticalConcept[] = [
  {
    id: 'coalition-building',
    name: 'Coalition Building',
    description:
      'In multi-party systems, governing often requires forming alliances between parties with different ideologies. ' +
      'Successful coalitions balance competing interests while maintaining enough agreement to pass legislation.',
    example:
      'When you gave support tokens to other players or coordinated votes across different ideologies, ' +
      'you were engaging in coalition building - a fundamental skill in democratic governance.',
    demonstratedBy: [
      { type: 'token_given' },
      { type: 'vote_outcome', passed: true },
    ],
  },
  {
    id: 'fiscal-responsibility',
    name: 'Fiscal Responsibility',
    description:
      'Governments must balance spending on popular programs with the need to maintain sustainable finances. ' +
      'Running persistent deficits can lead to debt crises, inflation, or loss of public services.',
    example:
      'When the budget decreased from policy decisions, you experienced the tension between ' +
      'popular spending and fiscal sustainability that real governments face every day.',
    demonstratedBy: [
      { type: 'nation_change', metric: 'budget', direction: 'decrease' },
    ],
  },
  {
    id: 'political-capital',
    name: 'Political Capital',
    description:
      'Influence is a limited resource in politics. Leaders must decide when to spend political capital ' +
      'on priorities versus when to save it for future battles. Spending too freely leaves nothing for crises.',
    example:
      'When you spent influence to boost your vote weight or use special abilities, you were ' +
      'managing political capital - deciding what fights are worth the cost.',
    demonstratedBy: [
      { type: 'influence_spent', action: 'vote' },
      { type: 'influence_spent', action: 'ability' },
    ],
  },
  {
    id: 'collective-action',
    name: 'Collective Action Problems',
    description:
      'Sometimes individual incentives conflict with group welfare. Each player might benefit from free-riding ' +
      'on others\' contributions, but if everyone does this, collective goals fail.',
    example:
      'Crisis events demonstrated collective action problems - each player could contribute less hoping ' +
      'others would compensate, but insufficient total contributions led to failure for everyone.',
    demonstratedBy: [
      { type: 'crisis_resolved', outcome: 'failure' },
      { type: 'crisis_resolved', outcome: 'success' },
    ],
  },
  {
    id: 'trust-and-commitment',
    name: 'Trust and Commitment',
    description:
      'Political agreements require trust. When parties break commitments, it damages future cooperation. ' +
      'Reputation matters - consistent behavior builds trust, while betrayal makes future deals harder.',
    example:
      'The support token system showed how trust works in politics. Breaking a deal (voting against ' +
      'someone whose token you hold) had real consequences, just like broken promises in government.',
    demonstratedBy: [
      { type: 'token_given' },
      { type: 'token_broken' },
    ],
  },
  {
    id: 'crisis-management',
    name: 'Crisis Management',
    description:
      'Crises test governance systems. Effective responses require quick coordination, shared sacrifice, ' +
      'and putting collective welfare above individual gain - at least temporarily.',
    example:
      'When crisis events occurred, you saw how external pressures can force cooperation. ' +
      'Real governments face similar tests during pandemics, financial crises, and natural disasters.',
    demonstratedBy: [
      { type: 'crisis_resolved', outcome: 'success' },
    ],
  },
  {
    id: 'ideological-compromise',
    name: 'Ideological Compromise',
    description:
      'Governing requires compromise between different ideological positions. Pure ideological consistency ' +
      'rarely survives contact with the need to build majorities and solve real problems.',
    example:
      'Players with opposed ideologies sometimes had to support each other\'s proposals to keep ' +
      'the nation from collapsing - just as real politicians often cross ideological lines.',
    demonstratedBy: [
      { type: 'vote_outcome', passed: true },
      { type: 'coalition_formed', ideologies: ['progressive', 'conservative'] },
    ],
  },
  {
    id: 'institutional-stability',
    name: 'Institutional Stability',
    description:
      'Democratic institutions provide the framework for peaceful conflict resolution. When stability ' +
      'erodes, normal political processes break down and extremism can flourish.',
    example:
      'The stability meter showed how policy decisions affect institutional health. Even popular ' +
      'policies can destabilize institutions if implemented too aggressively.',
    demonstratedBy: [
      { type: 'nation_change', metric: 'stability', direction: 'decrease' },
    ],
  },
  {
    id: 'zero-sum-vs-positive-sum',
    name: 'Zero-Sum vs. Positive-Sum Thinking',
    description:
      'Some political situations are zero-sum (one side gains what another loses), while others can ' +
      'create positive-sum outcomes (everyone gains). Recognizing the difference is crucial.',
    example:
      'The race to the finish was competitive (zero-sum), but keeping the nation stable was ' +
      'cooperative (positive-sum). Successful players navigated both dynamics.',
    demonstratedBy: [
      { type: 'crisis_resolved', outcome: 'success' },
      { type: 'token_given' },
    ],
  },
  {
    id: 'strategic-voting',
    name: 'Strategic Voting',
    description:
      'Voters and legislators don\'t always vote their true preferences. Sometimes supporting a ' +
      'less-preferred option is strategically better than risking a worse outcome.',
    example:
      'When you voted for an option that wasn\'t your first choice because the alternative was worse, ' +
      'you engaged in strategic voting - a common real-world phenomenon.',
    demonstratedBy: [
      { type: 'vote_outcome', passed: true },
    ],
  },
];

/**
 * Track which concepts have been demonstrated during a game
 */
export interface ConceptTracker {
  demonstratedConcepts: Set<string>;
  conceptExamples: Map<string, string[]>; // conceptId -> specific examples from this game
}

export function createConceptTracker(): ConceptTracker {
  return {
    demonstratedConcepts: new Set(),
    conceptExamples: new Map(),
  };
}

/**
 * Record that an event occurred that might demonstrate a concept
 */
export function recordEvent(
  tracker: ConceptTracker,
  trigger: ConceptTrigger,
  example: string
): ConceptTracker {
  const newDemonstrated = new Set(tracker.demonstratedConcepts);
  const newExamples = new Map(tracker.conceptExamples);

  for (const concept of POLITICAL_CONCEPTS) {
    for (const conceptTrigger of concept.demonstratedBy) {
      if (matchesTrigger(trigger, conceptTrigger)) {
        newDemonstrated.add(concept.id);

        const examples = newExamples.get(concept.id) || [];
        if (!examples.includes(example)) {
          examples.push(example);
          newExamples.set(concept.id, examples);
        }
      }
    }
  }

  return {
    demonstratedConcepts: newDemonstrated,
    conceptExamples: newExamples,
  };
}

/**
 * Check if a game event matches a concept trigger
 */
function matchesTrigger(event: ConceptTrigger, conceptTrigger: ConceptTrigger): boolean {
  if (event.type !== conceptTrigger.type) return false;

  // Type-specific matching
  switch (event.type) {
    case 'vote_outcome':
      return (conceptTrigger as { type: 'vote_outcome'; passed: boolean }).passed === event.passed;
    case 'crisis_resolved':
      return (
        (conceptTrigger as { type: 'crisis_resolved'; outcome: 'success' | 'failure' }).outcome ===
        event.outcome
      );
    case 'nation_change': {
      const trigger = conceptTrigger as {
        type: 'nation_change';
        metric: 'stability' | 'budget';
        direction: 'increase' | 'decrease';
      };
      return trigger.metric === event.metric && trigger.direction === event.direction;
    }
    case 'coalition_formed':
    case 'token_given':
    case 'token_broken':
    case 'influence_spent':
    case 'card_zone':
      return true; // These just need type match
    default:
      return false;
  }
}

/**
 * Get the list of demonstrated concepts with their game-specific examples
 */
export function getDemonstratedConcepts(
  tracker: ConceptTracker
): Array<{
  concept: PoliticalConcept;
  gameExamples: string[];
}> {
  return POLITICAL_CONCEPTS.filter((c) => tracker.demonstratedConcepts.has(c.id)).map(
    (concept) => ({
      concept,
      gameExamples: tracker.conceptExamples.get(concept.id) || [],
    })
  );
}
