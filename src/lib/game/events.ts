/**
 * PartyKit Game Events
 * Defines all WebSocket messages between client and PartyKit server.
 * Adapted from specs/001-politics-game-core/contracts/game-events.ts
 */

import type {
  Ideology,
  RoomStatus,
  GamePhase,
  VoteChoice,
  CardOptionId,
  Zone,
  Category,
  TokenStatus,
  GameSettings,
  PoliticalConceptSummary,
  CollapseDebrief,
} from './types';

// ============================================
// Client → Server Messages
// ============================================

export interface JoinRoomMessage {
  type: 'join';
  playerId: string;
  playerName: string;
  roomId?: string;
}

export interface SelectIdeologyMessage {
  type: 'selectIdeology';
  playerId: string;
  ideology: Ideology;
}

export interface StartGameMessage {
  type: 'startGame';
  playerId: string;
}

export interface RollDiceMessage {
  type: 'rollDice';
  playerId: string;
}

export interface ProposeOptionMessage {
  type: 'proposeOption';
  playerId: string;
  optionId: CardOptionId;
}

export interface CastVoteMessage {
  type: 'castVote';
  playerId: string;
  choice: VoteChoice;
  influenceSpent: number;
}

export interface GiveTokenMessage {
  type: 'giveToken';
  playerId: string;
  targetPlayerId: string;
}

export interface SpendInfluenceMessage {
  type: 'spendInfluence';
  playerId: string;
  action: 'extraMovement' | 'negateBackward' | 'forceRevote' | 'veto';
}

export interface LeaveRoomMessage {
  type: 'leave';
  playerId: string;
}

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

export interface RoomStateSyncMessage {
  type: 'roomStateSync';
  room: RoomStatePayload;
}

export interface PlayerJoinedMessage {
  type: 'playerJoined';
  player: PlayerStatePayload;
}

export interface PlayerLeftMessage {
  type: 'playerLeft';
  playerId: string;
}

export interface IdeologySelectedMessage {
  type: 'ideologySelected';
  playerId: string;
  ideology: Ideology;
}

export interface GameStartedMessage {
  type: 'gameStarted';
  firstPlayerId: string;
}

export interface TurnStartedMessage {
  type: 'turnStarted';
  turnNumber: number;
  activePlayerId: string;
}

export interface DiceRolledMessage {
  type: 'diceRolled';
  playerId: string;
  roll: number;
  modifiedRoll: number;
}

export interface CardDrawnMessage {
  type: 'cardDrawn';
  card: DecisionCardPayload;
}

export interface DeliberationStartedMessage {
  type: 'deliberationStarted';
  endsAt: number;
}

export interface OptionProposedMessage {
  type: 'optionProposed';
  playerId: string;
  optionId: CardOptionId;
}

export interface VotingStartedMessage {
  type: 'votingStarted';
}

export interface PlayerVotedMessage {
  type: 'playerVoted';
  playerId: string;
}

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
    reason: string;
  }>;
  influenceChanges: Array<{
    playerId: string;
    change: number;
    reason: string;
  }>;
}

export interface TokenGivenMessage {
  type: 'tokenGiven';
  fromPlayerId: string;
  toPlayerId: string;
  tokenId: string;
}

export interface DealResolvedMessage {
  type: 'dealResolved';
  tokenId: string;
  status: 'honored' | 'broken';
  ownerId: string;
  holderId: string;
}

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

export interface GameEndedCollapseMessage {
  type: 'gameEndedCollapse';
  reason: 'stability' | 'budget';
  finalState: {
    stability: number;
    budget: number;
  };
  debrief: CollapseDebrief;
}

export interface ChatBroadcastMessage {
  type: 'chatBroadcast';
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
}

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
// Payload Types (for sync)
// ============================================

export interface PlayerStatePayload {
  id: string;
  name: string;
  ideology: Ideology | null;
  position: number;
  influence: number;
  ownTokens: number;
  isConnected: boolean;
  isHost: boolean;
}

export interface TokenStatePayload {
  id: string;
  ownerId: string;
  heldById: string;
  status: TokenStatus;
}

export interface NationStatePayload {
  stability: number;
  budget: number;
}

export interface DecisionCardPayload {
  id: string;
  zone: Zone;
  category: Category;
  title: string;
  description: string;
  options: CardOptionPayload[];
  historicalNote: string | null;
}

export interface CardOptionPayload {
  id: CardOptionId;
  name: string;
  budgetChange: number;
  stabilityChange: number;
  aligned: Array<{ ideology: Ideology; movement: number }>;
  opposed: Array<{ ideology: Ideology; movement: number }>;
}

export interface RoomStatePayload {
  id: string;
  status: RoomStatus;
  phase: GamePhase;
  hostPlayerId: string;
  currentTurn: number;
  activePlayerId: string | null;
  currentCard: DecisionCardPayload | null;
  currentProposal: CardOptionId | null;
  diceRoll: number | null;
  timerEndAt: number | null;
  players: PlayerStatePayload[];
  tokens: TokenStatePayload[];
  nation: NationStatePayload;
  settings: GameSettings;
}
