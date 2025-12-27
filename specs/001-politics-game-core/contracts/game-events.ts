/**
 * PartyKit Game Events Contract
 *
 * Defines all WebSocket messages between client and PartyKit server.
 * These types are shared between frontend and party server.
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
// Client → Server Messages
// ============================================

/** Join/create a room */
export interface JoinRoomMessage {
  type: 'join';
  playerId: string;
  playerName: string;
  roomId?: string; // If joining existing room
}

/** Select ideology in lobby */
export interface SelectIdeologyMessage {
  type: 'selectIdeology';
  playerId: string;
  ideology: Ideology;
}

/** Host starts the game */
export interface StartGameMessage {
  type: 'startGame';
  playerId: string; // Must be host
}

/** Active player rolls dice */
export interface RollDiceMessage {
  type: 'rollDice';
  playerId: string;
}

/** Active player proposes an option */
export interface ProposeOptionMessage {
  type: 'proposeOption';
  playerId: string;
  optionId: CardOptionId;
}

/** Player casts their vote */
export interface CastVoteMessage {
  type: 'castVote';
  playerId: string;
  choice: VoteChoice;
  influenceSpent: number;
}

/** Player gives a support token to another player */
export interface GiveTokenMessage {
  type: 'giveToken';
  playerId: string;
  targetPlayerId: string;
}

/** Player spends influence for extra movement */
export interface SpendInfluenceMessage {
  type: 'spendInfluence';
  playerId: string;
  action: 'extraMovement' | 'negateBackward' | 'forceRevote' | 'veto';
}

/** Player disconnects gracefully */
export interface LeaveRoomMessage {
  type: 'leave';
  playerId: string;
}

/** Player sends chat/negotiation message */
export interface ChatMessage {
  type: 'chat';
  playerId: string;
  text: string;
}

export type ClientMessage =
  | JoinRoomMessage
  | SelectIdeologyMessage
  | StartGameMessage
  | RollDiceMessage
  | ProposeOptionMessage
  | CastVoteMessage
  | GiveTokenMessage
  | SpendInfluenceMessage
  | LeaveRoomMessage
  | ChatMessage;

// ============================================
// Server → Client Messages
// ============================================

/** Full room state sync (on join or reconnect) */
export interface RoomStateSyncMessage {
  type: 'roomStateSync';
  room: RoomState;
}

/** Player joined the room */
export interface PlayerJoinedMessage {
  type: 'playerJoined';
  player: PlayerState;
}

/** Player left the room */
export interface PlayerLeftMessage {
  type: 'playerLeft';
  playerId: string;
}

/** Player selected ideology */
export interface IdeologySelectedMessage {
  type: 'ideologySelected';
  playerId: string;
  ideology: Ideology;
}

/** Game started */
export interface GameStartedMessage {
  type: 'gameStarted';
  firstPlayerId: string;
}

/** New turn began */
export interface TurnStartedMessage {
  type: 'turnStarted';
  turnNumber: number;
  activePlayerId: string;
}

/** Dice rolled */
export interface DiceRolledMessage {
  type: 'diceRolled';
  playerId: string;
  roll: number;
  modifiedRoll: number; // After nation state modifiers
}

/** Card drawn */
export interface CardDrawnMessage {
  type: 'cardDrawn';
  card: DecisionCardState;
}

/** Deliberation timer started */
export interface DeliberationStartedMessage {
  type: 'deliberationStarted';
  endsAt: number; // Unix timestamp
}

/** Option proposed */
export interface OptionProposedMessage {
  type: 'optionProposed';
  playerId: string;
  optionId: CardOptionId;
}

/** Voting phase started */
export interface VotingStartedMessage {
  type: 'votingStarted';
}

/** A player has voted (hidden until reveal) */
export interface PlayerVotedMessage {
  type: 'playerVoted';
  playerId: string;
  // Vote content hidden until reveal
}

/** All votes revealed */
export interface VotesRevealedMessage {
  type: 'votesRevealed';
  votes: Array<{
    playerId: string;
    choice: VoteChoice;
    influenceSpent: number;
    totalWeight: number;
  }>;
  totalYes: number;
  totalNo: number;
  passed: boolean;
}

/** Turn resolved with movements */
export interface TurnResolvedMessage {
  type: 'turnResolved';
  nationChanges: {
    budgetChange: number;
    stabilityChange: number;
    newBudget: number;
    newStability: number;
  };
  movements: Array<{
    playerId: string;
    oldPosition: number;
    newPosition: number;
    reason: string; // "dice roll" | "ideology aligned" | etc.
  }>;
  influenceChanges: Array<{
    playerId: string;
    change: number;
    reason: string;
  }>;
}

/** Support token given */
export interface TokenGivenMessage {
  type: 'tokenGiven';
  fromPlayerId: string;
  toPlayerId: string;
  tokenId: string;
}

/** Deal honored/broken */
export interface DealResolvedMessage {
  type: 'dealResolved';
  tokenId: string;
  status: 'honored' | 'broken';
  ownerId: string;
  holderId: string;
}

/** Game ended - victory */
export interface GameEndedVictoryMessage {
  type: 'gameEndedVictory';
  winnerId: string;
  winnerName: string;
  finalPositions: Array<{
    playerId: string;
    position: number;
    influence: number;
  }>;
  conceptsSummary: PoliticalConceptSummary[];
}

/** Game ended - collapse */
export interface GameEndedCollapseMessage {
  type: 'gameEndedCollapse';
  reason: 'stability' | 'budget';
  finalState: {
    stability: number;
    budget: number;
  };
  debrief: CollapseDebrief;
}

/** Chat message broadcast */
export interface ChatBroadcastMessage {
  type: 'chatBroadcast';
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
}

/** Error message */
export interface ErrorMessage {
  type: 'error';
  code: string;
  message: string;
}

export type ServerMessage =
  | RoomStateSyncMessage
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | IdeologySelectedMessage
  | GameStartedMessage
  | TurnStartedMessage
  | DiceRolledMessage
  | CardDrawnMessage
  | DeliberationStartedMessage
  | OptionProposedMessage
  | VotingStartedMessage
  | PlayerVotedMessage
  | VotesRevealedMessage
  | TurnResolvedMessage
  | TokenGivenMessage
  | DealResolvedMessage
  | GameEndedVictoryMessage
  | GameEndedCollapseMessage
  | ChatBroadcastMessage
  | ErrorMessage;

// ============================================
// State Shapes (for sync)
// ============================================

export interface PlayerState {
  id: string;
  name: string;
  ideology: Ideology | null;
  position: number;
  influence: number;
  ownTokens: number;
  isConnected: boolean;
  isHost: boolean;
}

export interface TokenState {
  id: string;
  ownerId: string;
  heldById: string;
  status: TokenStatus;
}

export interface NationState {
  stability: number;
  budget: number;
}

export interface DecisionCardState {
  id: string;
  zone: Zone;
  category: Category;
  title: string;
  description: string;
  options: CardOptionState[];
  historicalNote: string | null;
}

export interface CardOptionState {
  id: CardOptionId;
  name: string;
  budgetChange: number;
  stabilityChange: number;
  aligned: Array<{ ideology: Ideology; movement: number }>;
  opposed: Array<{ ideology: Ideology; movement: number }>;
}

export interface RoomState {
  id: string;
  status: RoomStatus;
  phase: GamePhase;
  hostPlayerId: string;
  currentTurn: number;
  activePlayerId: string | null;
  currentCard: DecisionCardState | null;
  currentProposal: CardOptionId | null;
  diceRoll: number | null;
  timerEndAt: number | null;
  players: PlayerState[];
  tokens: TokenState[];
  nation: NationState;
  settings: GameSettings;
}

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

// ============================================
// Post-Game Summary Types
// ============================================

export interface PoliticalConceptSummary {
  concept: string;
  description: string;
  example: string; // From this game
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
