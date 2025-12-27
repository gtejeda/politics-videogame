/**
 * Core game types - shared between client and server
 * Derived from specs/001-politics-game-core/contracts/game-events.ts
 */

// ============================================
// Enums & Constants
// ============================================

export type Ideology =
  | 'progressive'
  | 'conservative'
  | 'liberal'
  | 'nationalist'
  | 'populist';

export type RoomStatus = 'lobby' | 'playing' | 'collapsed' | 'finished';

export type GamePhase =
  | 'waiting'
  | 'rolling'
  | 'drawing'
  | 'deliberating'
  | 'proposing'
  | 'voting'
  | 'revealing'
  | 'resolving';

export type VoteChoice = 'yes' | 'no' | 'abstain';

export type CardOptionId = 'A' | 'B' | 'C';

export type Zone = 'earlyTerm' | 'midTerm' | 'crisisZone' | 'lateTerm';

export type Category = 'economic' | 'social' | 'security' | 'institutional' | 'crisis';

export type TokenStatus = 'active' | 'honored' | 'broken';

// ============================================
// Core Entity Types
// ============================================

export interface GameSettings {
  minPlayers: number;
  maxPlayers: number;
  deliberationSeconds: number;
  pathLength: number;
  startingInfluence: number;
  startingTokens: number;
  startingStability: number;
  startingBudget: number;
}

export interface Player {
  id: string;
  name: string;
  ideology: Ideology | null;
  position: number;
  influence: number;
  ownTokens: number;
  isConnected: boolean;
  isHost: boolean;
}

export interface SupportToken {
  id: string;
  ownerId: string;
  heldById: string;
  status: TokenStatus;
  givenAt?: number;
}

export interface NationState {
  stability: number;
  budget: number;
}

export interface IdeologyBonus {
  ideology: Ideology;
  movement: number;
}

export interface IdeologyPenalty {
  ideology: Ideology;
  movement: number;
}

export interface CardOption {
  id: CardOptionId;
  name: string;
  budgetChange: number;
  stabilityChange: number;
  aligned: IdeologyBonus[];
  opposed: IdeologyPenalty[];
}

export interface DecisionCard {
  id: string;
  zone: Zone;
  category: Category;
  title: string;
  description: string;
  options: CardOption[];
  historicalNote: string | null;
}

export interface Vote {
  playerId: string;
  choice: VoteChoice;
  influenceSpent: number;
  timestamp: number;
}

export interface GameRoom {
  id: string;
  status: RoomStatus;
  phase: GamePhase;
  hostPlayerId: string;
  currentTurn: number;
  activePlayerId: string | null;
  currentCard: DecisionCard | null;
  currentProposal: CardOptionId | null;
  diceRoll: number | null;
  timerEndAt: number | null;
  settings: GameSettings;
}

// ============================================
// Game State (Full room state for sync)
// ============================================

export interface RoomState {
  room: GameRoom;
  players: Map<string, Player>;
  tokens: SupportToken[];
  nation: NationState;
  pendingVotes: Map<string, Vote>;
  history: TurnHistory[];
}

export interface TurnHistory {
  turnNumber: number;
  activePlayerId: string;
  card: DecisionCard;
  proposedOption: CardOptionId;
  votes: Vote[];
  passed: boolean;
  nationChanges: {
    budgetChange: number;
    stabilityChange: number;
  };
  movements: PlayerMovement[];
}

export interface PlayerMovement {
  playerId: string;
  oldPosition: number;
  newPosition: number;
  reason: string;
}

// ============================================
// Result Types
// ============================================

export interface VictoryResult {
  type: 'win' | 'waiting' | 'ongoing';
  playerId?: string;
}

export interface CollapseResult {
  collapsed: boolean;
  reason?: 'stability' | 'budget';
}

export interface VoteResult {
  totalYes: number;
  totalNo: number;
  passed: boolean;
  votes: Array<{
    playerId: string;
    choice: VoteChoice;
    influenceSpent: number;
    totalWeight: number;
  }>;
}

// ============================================
// Political Concepts (for education)
// ============================================

export interface PoliticalConceptSummary {
  concept: string;
  description: string;
  example: string;
}

export interface CollapseDebrief {
  whatHappened: string;
  realWorldParallel: string;
  lesson: string;
  keyDecisions: Array<{
    turn: number;
    decision: string;
    impact: string;
  }>;
}
