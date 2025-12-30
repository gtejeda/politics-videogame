/**
 * Help Content Data Structure
 * Static help content for contextual help, phase explanations, and term definitions
 */

import type { GamePhase } from './types';

/**
 * Phase-specific help content
 */
export interface PhaseHelp {
  phase: GamePhase;
  title: string;
  description: string;
  availableActions: string[];
  tips: string[];
}

/**
 * Term definition for tooltips
 */
export interface TermDefinition {
  term: string;
  displayName: string;
  definition: string;
  whyItMatters: string;
  relatedTerms?: string[];
}

/**
 * Deal system help content
 */
export interface DealHelp {
  overview: string;
  steps: string[];
  consequences: string;
  strategicValue: string;
}

/**
 * Full help content structure
 */
export interface HelpContentStore {
  phases: Partial<Record<GamePhase, PhaseHelp>>;
  terms: Record<string, TermDefinition>;
  deals: DealHelp;
}

/**
 * Phase-specific help content
 */
export const PHASE_HELP: Partial<Record<GamePhase, PhaseHelp>> = {
  waiting: {
    phase: 'waiting',
    title: 'Waiting for Turn',
    description:
      'The active player is about to roll the dice. When it\'s your turn, you\'ll draw a card and propose a policy for the nation.',
    availableActions: ['Wait for the active player to roll', 'Plan your strategy'],
    tips: [
      'Use this time to consider what kind of policies you might support',
      'Think about which players you might want to negotiate with',
      'Check your support tokens and influence level',
    ],
  },
  rolling: {
    phase: 'rolling',
    title: 'Rolling Dice',
    description:
      'The active player rolls dice to determine their movement. Higher rolls mean more spaces on the board!',
    availableActions: ['Roll the dice (if active player)'],
    tips: [
      'Your dice roll is modified by the nation\'s stability',
      'High stability gives bonus movement',
      'Low stability can reduce your movement',
    ],
  },
  drawing: {
    phase: 'drawing',
    title: 'Drawing Card',
    description: 'A policy card is being drawn from the deck. The card\'s zone depends on player positions.',
    availableActions: ['Wait for the card to be revealed'],
    tips: ['Cards become more impactful as players advance'],
  },
  reviewing: {
    phase: 'reviewing',
    title: 'Review Phase',
    description:
      'The active player reviews the policy options while other players study the topic. Use this time to understand what\'s at stake.',
    availableActions: [
      'Study the topic and ideology perspectives',
      'Mark yourself ready to negotiate (if not active player)',
      'Select an option to propose (if active player)',
    ],
    tips: [
      'Check how your ideology typically approaches this issue',
      'Consider the nation impact of each option',
      'Think about which players might support different options',
    ],
  },
  deliberating: {
    phase: 'deliberating',
    title: 'Negotiation Phase',
    description:
      'Time to negotiate! Make deals with other players using Support Tokens. The active player will eventually propose one option for voting.',
    availableActions: [
      'Negotiate with other players',
      'Give or receive Support Tokens',
      'Make informal agreements about voting',
      'Propose an option (active player)',
    ],
    tips: [
      'Support Tokens create binding commitments',
      'Giving someone your token means they must vote with you or face penalties',
      'Consider trading tokens for future cooperation',
      'The active player can propose whenever ready',
    ],
  },
  proposing: {
    phase: 'proposing',
    title: 'Proposal Selection',
    description: 'The active player is selecting which policy option to propose for the vote.',
    availableActions: ['Wait for the proposal'],
    tips: ['The active player is making their final decision'],
  },
  voting: {
    phase: 'voting',
    title: 'Voting Phase',
    description:
      'Cast your vote on the proposed policy. You can spend Influence to add weight to your vote.',
    availableActions: [
      'Vote Yes, No, or Abstain',
      'Spend Influence to boost your vote weight (optional)',
    ],
    tips: [
      'Each point of Influence spent adds 1 to your vote weight',
      'Abstaining neither supports nor opposes',
      'Remember any deals you made during negotiation!',
      'Breaking a deal (voting against someone whose token you hold) has consequences',
    ],
  },
  revealing: {
    phase: 'revealing',
    title: 'Revealing Votes',
    description: 'All votes are being revealed. Watch to see how each player voted!',
    availableActions: ['Watch the vote reveal'],
    tips: ['The vote reveal shows who kept their word and who didn\'t'],
  },
  resolving: {
    phase: 'resolving',
    title: 'Resolving Turn',
    description:
      'The results are being calculated. Nation changes and player movements are applied based on the vote outcome.',
    availableActions: ['Wait for results'],
    tips: ['Passed policies affect the nation and player positions'],
  },
  showingResults: {
    phase: 'showingResults',
    title: 'Turn Results',
    description:
      'Review the complete results of this turn, including vote breakdown, nation changes, and player movements.',
    availableActions: ['Review the results', 'Acknowledge to continue'],
    tips: [
      'Check how the vote affected the nation',
      'See how each player moved',
      'Note any broken or honored deals',
    ],
  },
  crisis: {
    phase: 'crisis',
    title: 'Crisis Event!',
    description:
      'A crisis threatens the nation! All players must work together to contribute Influence and prevent disaster.',
    availableActions: [
      'Contribute Influence to resolve the crisis',
      'Coordinate with other players',
    ],
    tips: [
      'Crisis resolution requires collective effort',
      'Some ideologies get bonuses for certain crisis types',
      'If the threshold isn\'t met, the nation suffers',
      'This is a test of cooperation!',
    ],
  },
};

/**
 * Term definitions for tooltips
 */
export const TERM_DEFINITIONS: Record<string, TermDefinition> = {
  influence: {
    term: 'influence',
    displayName: 'Influence',
    definition:
      'Your political capital. Spend it to boost votes, contribute to crises, or gain advantages. Reach the end with 3+ to win.',
    whyItMatters:
      'Influence is the currency of power. Managing it wisely is key to victory - spend too freely and you won\'t have enough to win.',
    relatedTerms: ['votes', 'victory'],
  },
  stability: {
    term: 'stability',
    displayName: 'Stability',
    definition:
      'The nation\'s social cohesion and institutional health. If it drops to 0 or below, the nation collapses and everyone loses.',
    whyItMatters:
      'Stability affects dice rolls and is a shared risk. Even if you\'re racing ahead, collapse means everyone loses.',
    relatedTerms: ['collapse', 'nationState', 'budget'],
  },
  budget: {
    term: 'budget',
    displayName: 'Budget',
    definition:
      'The nation\'s financial health. Policies cost budget, and if it drops to -5 or below, the nation collapses.',
    whyItMatters:
      'Budget constraints force hard choices. Popular spending is tempting, but fiscal irresponsibility leads to collapse.',
    relatedTerms: ['collapse', 'nationState', 'stability'],
  },
  supportTokens: {
    term: 'supportTokens',
    displayName: 'Support Tokens',
    definition:
      'Commitments you make to other players. Give someone your token to signal support. If you then vote against them, you lose influence.',
    whyItMatters:
      'Tokens create trust and accountability. Breaking a deal damages you and benefits your victim - think carefully before betraying.',
    relatedTerms: ['deals', 'influence', 'voting'],
  },
  deals: {
    term: 'deals',
    displayName: 'Deals',
    definition:
      'Agreements made during negotiation phase. Formal deals involve Support Tokens; breaking them has consequences.',
    whyItMatters:
      'Deals enable cooperation but require trust. Reputation matters - consistent behavior builds alliances.',
    relatedTerms: ['supportTokens', 'negotiation'],
  },
  collapse: {
    term: 'collapse',
    displayName: 'Collapse',
    definition:
      'Game-ending crisis where the nation fails due to Stability reaching 0 or Budget reaching -5. All players lose.',
    whyItMatters:
      'Collapse is the shared failure condition. Individual competition must balance against collective survival.',
    relatedTerms: ['stability', 'budget', 'nationState'],
  },
  nationState: {
    term: 'nationState',
    displayName: 'Nation State',
    definition:
      'The collective health of the nation, measured by Stability and Budget. All players share responsibility for maintaining it.',
    whyItMatters:
      'The nation state represents the common good. Your individual victory means nothing if the nation fails.',
    relatedTerms: ['stability', 'budget', 'collapse'],
  },
  voting: {
    term: 'voting',
    displayName: 'Voting',
    definition:
      'All players vote Yes, No, or Abstain on proposed policies. Spend Influence to add weight. Majority wins.',
    whyItMatters:
      'Votes determine policy outcomes. Strategic voting considers both immediate effects and long-term positioning.',
    relatedTerms: ['influence', 'deals', 'supportTokens'],
  },
  ideology: {
    term: 'ideology',
    displayName: 'Ideology',
    definition:
      'Your political faction. Each ideology has different strengths and typical stances. No ideology is objectively "best."',
    whyItMatters:
      'Ideology shapes your bonuses and natural allies. Understanding all ideologies helps you predict and negotiate.',
    relatedTerms: ['alignment', 'movement'],
  },
  victory: {
    term: 'victory',
    displayName: 'Victory',
    definition:
      'Win by reaching the end of the board with 3+ Influence. If multiple players qualify, highest Influence wins.',
    whyItMatters:
      'Victory requires both position advancement and Influence conservation. Balance progress with resource management.',
    relatedTerms: ['influence', 'movement'],
  },
};

/**
 * Deal system help content
 */
export const DEAL_HELP: DealHelp = {
  overview:
    'Deals are agreements between players made during the Negotiation Phase. They can be informal promises or formal commitments backed by Support Tokens.',
  steps: [
    'Identify a player whose support you want',
    'Negotiate terms - what will you do for them in return?',
    'Exchange Support Tokens to formalize the deal',
    'When voting, honor your commitments or face consequences',
  ],
  consequences:
    'Breaking a deal (voting No on a proposal from someone whose token you hold) causes you to lose 1 Influence while your victim gains 1 Influence. Your reputation is also damaged.',
  strategicValue:
    'Deals enable cooperation in a competitive game. They help pass beneficial policies, protect against betrayal, and build lasting alliances. Use them wisely!',
};

/**
 * Get help content for a specific phase
 */
export function getPhaseHelp(phase: GamePhase): PhaseHelp | null {
  return PHASE_HELP[phase] ?? null;
}

/**
 * Get definition for a specific term
 */
export function getTermDefinition(term: string): TermDefinition | null {
  return TERM_DEFINITIONS[term.toLowerCase()] ?? null;
}

/**
 * Get all term definitions
 */
export function getAllTermDefinitions(): TermDefinition[] {
  return Object.values(TERM_DEFINITIONS);
}

/**
 * Full help content store for export
 */
export const HELP_CONTENT: HelpContentStore = {
  phases: PHASE_HELP,
  terms: TERM_DEFINITIONS,
  deals: DEAL_HELP,
};
