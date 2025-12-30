/**
 * WebSocket Event Contracts: Game Refinement
 *
 * New and modified event types for the game refinement feature.
 * These extend the existing event system in src/lib/game/events.ts
 */

import type { Ideology, GamePhase } from '@/lib/game/types';

// =============================================================================
// Turn History Events
// =============================================================================

/**
 * Emitted by server after each turn completes.
 * Clients append to local turn history array.
 */
export interface TurnCompletedMessage {
  type: 'turnCompleted';
  entry: TurnHistoryEntry;
}

export interface TurnHistoryEntry {
  turnNumber: number;
  timestamp: number;
  activePlayerId: string;
  activePlayerName: string;
  activePlayerIdeology: Ideology;

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

  votes: VoteRecord[];
  outcome: 'passed' | 'failed';
  yesCount: number;
  noCount: number;
  abstainCount: number;
  margin: string;

  nationChanges: {
    budgetBefore: number;
    budgetAfter: number;
    budgetDelta: number;
    stabilityBefore: number;
    stabilityAfter: number;
    stabilityDelta: number;
  };

  playerMovements: PlayerMovement[];
  conceptsTriggered: string[];
}

export interface VoteRecord {
  playerId: string;
  playerName: string;
  playerIdeology: Ideology;
  vote: 'yes' | 'no' | 'abstain';
  influenceSpent: number;
  voteWeight: number;
  alignedWithIdeology: boolean;
}

export interface PlayerMovement {
  playerId: string;
  playerName: string;
  diceRoll: number;
  ideologyModifier: number;
  nationModifier: number;
  influenceBonus: number;
  totalMovement: number;
  positionBefore: number;
  positionAfter: number;
}

// =============================================================================
// Concept Tracking Events
// =============================================================================

/**
 * Emitted when a political concept is demonstrated during gameplay.
 * Clients accumulate for post-game debrief.
 */
export interface ConceptDemonstratedMessage {
  type: 'conceptDemonstrated';
  instance: ConceptInstance;
}

export interface ConceptInstance {
  conceptId: string;
  turnNumber: number;
  timestamp: number;
  description: string;
  playerIds: string[];
  playerNames: string[];
  triggerEvent: ConceptTriggerEvent;
  cardId?: string;
  cardTitle?: string;
}

export type ConceptTriggerEvent =
  | 'deal_made'
  | 'deal_broken'
  | 'vote_passed'
  | 'vote_failed'
  | 'crisis_contributed'
  | 'crisis_ignored'
  | 'cross_ideology_vote'
  | 'influence_spent'
  | 'nation_crisis'
  | 'narrow_margin_vote';

// =============================================================================
// Game End Events (Modified)
// =============================================================================

/**
 * Extended game ended message with full debrief data.
 * Replaces simple victory/collapse notification.
 */
export interface GameEndedWithDebriefMessage {
  type: 'gameEndedWithDebrief';
  debrief: GameDebrief;
}

export interface GameDebrief {
  gameId: string;
  duration: number;
  totalTurns: number;

  outcome: 'victory' | 'collapse' | 'stalemate';
  winnerId?: string;
  winnerName?: string;
  winnerIdeology?: Ideology;

  collapseReason?: 'budget' | 'stability';
  collapseParallel?: HistoricalParallel;

  conceptsDemo: ConceptSummary[];
  playerAnalyses: PlayerAnalysis[];
  keyMoments: KeyMoment[];
}

export interface HistoricalParallel {
  name: string;
  period: string;
  summary: string;
  lesson: string;
  parallels: string[];
}

export interface ConceptSummary {
  conceptId: string;
  conceptName: string;
  explanation: string;
  instances: ConceptInstance[];
  primaryExample: string;
}

export interface PlayerAnalysis {
  playerId: string;
  playerName: string;
  ideology: Ideology;
  finalPosition: number;
  finalInfluence: number;
  votesTotal: number;
  votesWithIdeology: number;
  ideologyAlignmentPercent: number;
  dealsMade: number;
  dealsBroken: number;
  mostImpactfulVote?: {
    turnNumber: number;
    cardTitle: string;
    impact: string;
  };
}

export interface KeyMoment {
  turnNumber: number;
  type: 'swing_vote' | 'deal_breach' | 'crisis_resolution' | 'near_collapse' | 'winning_move';
  description: string;
  playersInvolved: string[];
}

// =============================================================================
// Role-Based View Events
// =============================================================================

/**
 * Sent to non-active players during review phase.
 * Contains limited information (no proposal options).
 */
export interface ReviewPhaseObserverMessage {
  type: 'reviewPhaseObserver';
  topic: {
    cardId: string;
    title: string;
    description: string;
    category: string;
  };
  ideologyComparison: IdeologyStance[];
  nationImpactPreview: {
    budgetRange: { min: number; max: number };
    stabilityRange: { min: number; max: number };
  };
}

export interface IdeologyStance {
  ideology: Ideology;
  ideologyName: string;
  typicalStance: string;
  likelyVote: 'yes' | 'no' | 'split';
}

/**
 * Sent only to active player during review phase.
 * Contains full proposal options.
 */
export interface ReviewPhaseProposerMessage {
  type: 'reviewPhaseProposer';
  topic: {
    cardId: string;
    title: string;
    description: string;
    category: string;
  };
  ideologyComparison: IdeologyStance[];
  options: ProposalOption[];
}

export interface ProposalOption {
  id: string;
  title: string;
  description: string;
  nationImpact: {
    budgetEffect: number;
    stabilityEffect: number;
  };
  // Advancement effects are NOT included here - hidden until after vote
}

// =============================================================================
// Advancement Reveal Event
// =============================================================================

/**
 * Sent after all votes are cast, before results processing.
 * Reveals advancement effects that were hidden during voting.
 */
export interface AdvancementRevealMessage {
  type: 'advancementReveal';
  cardId: string;
  advancementEffects: AdvancementEffect[];
}

export interface AdvancementEffect {
  ideology: Ideology;
  movementModifier: number;
  condition?: string;
}

// =============================================================================
// Animation Trigger Events
// =============================================================================

/**
 * Triggers victory celebration animation.
 */
export interface VictoryCelebrationMessage {
  type: 'victoryCelebration';
  winnerId: string;
  winnerName: string;
  winnerIdeology: Ideology;
  finalStandings: Array<{
    playerId: string;
    playerName: string;
    position: number;
    influence: number;
  }>;
}

/**
 * Triggers nation collapse sequence.
 */
export interface CollapseSequenceMessage {
  type: 'collapseSequence';
  reason: 'budget' | 'stability';
  finalValue: number;
  triggeringEvent?: string;
}

/**
 * Triggers deal breach effect.
 */
export interface DealBreachEffectMessage {
  type: 'dealBreachEffect';
  breakerId: string;
  breakerName: string;
  victimId: string;
  victimName: string;
  dealTerms: string;
  penaltyApplied: {
    breakerInfluenceLost: number;
    victimInfluenceGained: number;
  };
}

// =============================================================================
// Union Type for All New Events
// =============================================================================

export type RefinementServerMessage =
  | TurnCompletedMessage
  | ConceptDemonstratedMessage
  | GameEndedWithDebriefMessage
  | ReviewPhaseObserverMessage
  | ReviewPhaseProposerMessage
  | AdvancementRevealMessage
  | VictoryCelebrationMessage
  | CollapseSequenceMessage
  | DealBreachEffectMessage;

// =============================================================================
// Client Messages (No new client-to-server messages for this feature)
// =============================================================================

// All new functionality uses existing client messages:
// - 'selectProposal' (existing)
// - 'castVote' (existing)
// - 'acknowledgeTurnResults' (existing)
//
// UI state (active tab, help open) is client-side only.
