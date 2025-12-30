/**
 * Tutorial Step Definitions
 * Linear step sequence for the "How to Play" tutorial
 */

/**
 * Single step in the How to Play tutorial
 */
export interface TutorialStep {
  id: string;
  order: number;
  title: string;
  content: string; // Main explanation text
  bullets?: string[]; // Optional bullet points
  visualType: 'none' | 'image' | 'animation' | 'highlight';
  visualRef?: string; // Image path or component name
  highlightSelector?: string; // CSS selector for UI highlight
}

/**
 * Tutorial steps for the "How to Play" guide
 */
export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    order: 0,
    title: 'Welcome to the Political Game',
    content:
      'In this game, you\'ll take on the role of a political faction navigating a term in government. ' +
      'You\'ll need to balance advancing your own position while keeping the nation stable.',
    bullets: [
      'Compete with other players to reach the end first',
      'Cooperate to prevent national collapse',
      'Learn real political concepts through gameplay',
    ],
    visualType: 'none',
  },
  {
    id: 'goal',
    order: 1,
    title: 'Goal: Win the Race',
    content:
      'Race along the government term path. The first player to reach the end with 3 or more Influence wins. ' +
      'If multiple players qualify at the same time, highest Influence wins.',
    bullets: [
      'Advance by rolling dice and through policy bonuses',
      'Conserve enough Influence to win (need 3+)',
      'Don\'t let the nation collapse - everyone loses!',
    ],
    visualType: 'highlight',
    highlightSelector: '[data-tutorial="board-path"]',
  },
  {
    id: 'turn-structure',
    order: 2,
    title: 'Turn Structure',
    content:
      'Each turn follows a clear sequence. The active player leads, but everyone participates in voting and negotiation.',
    bullets: [
      'Roll Dice - Determines base movement',
      'Draw Card - A policy decision appears',
      'Review - Study the options and perspectives',
      'Negotiate - Make deals with other players',
      'Vote - All players vote on the proposal',
      'Move - Players advance based on results',
    ],
    visualType: 'none',
  },
  {
    id: 'voting',
    order: 3,
    title: 'Voting on Policies',
    content:
      'All players vote on proposed policies: Yes, No, or Abstain. You can spend Influence to boost your vote weight.',
    bullets: [
      'Base vote weight is 1',
      'Each Influence spent adds +1 to your vote',
      'Majority wins (Yes vs No)',
      'Abstaining neither helps nor hurts',
    ],
    visualType: 'highlight',
    highlightSelector: '[data-tutorial="voting-panel"]',
  },
  {
    id: 'deals',
    order: 4,
    title: 'Making Deals',
    content:
      'During Negotiation Phase, you can make deals with other players using Support Tokens. ' +
      'Tokens create binding commitments - breaking them has consequences.',
    bullets: [
      'Give your token to signal support',
      'If you hold someone\'s token, voting against them is betrayal',
      'Betrayers lose 1 Influence, victims gain 1',
      'Reputation matters for future deals!',
    ],
    visualType: 'highlight',
    highlightSelector: '[data-tutorial="deal-tracker"]',
  },
  {
    id: 'nation-health',
    order: 5,
    title: 'Nation Health',
    content:
      'The nation has two critical metrics: Stability and Budget. If either falls too low, the nation collapses and everyone loses.',
    bullets: [
      'Stability at 0 or below = Collapse',
      'Budget at -5 or below = Collapse',
      'Policy decisions affect both metrics',
      'Crisis events can threaten nation health',
    ],
    visualType: 'highlight',
    highlightSelector: '[data-tutorial="nation-track"]',
  },
  {
    id: 'ideologies',
    order: 6,
    title: 'Ideologies',
    content:
      'Each player chooses an ideology at game start. Ideologies have different strengths and typical stances, but none is "best" - they represent different political approaches.',
    bullets: [
      'Progressive - Social reform, equality',
      'Conservative - Stability, tradition',
      'Liberal - Markets, liberty',
      'Nationalist - Sovereignty, security',
      'Populist - Anti-establishment',
    ],
    visualType: 'none',
  },
  {
    id: 'winning',
    order: 7,
    title: 'Winning the Game',
    content:
      'The first player to reach the end of the path with 3 or more Influence wins. Plan your strategy carefully!',
    bullets: [
      'Balance advancement with Influence conservation',
      'Make strategic deals to get policy bonuses',
      'Don\'t sacrifice the nation for personal gain',
      'Learn from political concepts as you play',
    ],
    visualType: 'none',
  },
];

/**
 * Get total number of tutorial steps
 */
export function getTutorialStepCount(): number {
  return TUTORIAL_STEPS.length;
}

/**
 * Get a specific tutorial step by index
 */
export function getTutorialStep(index: number): TutorialStep | null {
  if (index < 0 || index >= TUTORIAL_STEPS.length) {
    return null;
  }
  return TUTORIAL_STEPS[index];
}

/**
 * Get a tutorial step by ID
 */
export function getTutorialStepById(id: string): TutorialStep | null {
  return TUTORIAL_STEPS.find((step) => step.id === id) ?? null;
}

/**
 * Check if there's a next step
 */
export function hasNextStep(currentIndex: number): boolean {
  return currentIndex < TUTORIAL_STEPS.length - 1;
}

/**
 * Check if there's a previous step
 */
export function hasPreviousStep(currentIndex: number): boolean {
  return currentIndex > 0;
}
