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
  | 'reviewing'      // FR-019: Review Phase (before deliberation)
  | 'deliberating'   // FR-019: Negotiation Phase (renamed from proposing)
  | 'voting'
  | 'revealing'
  | 'resolving'
  | 'showingResults'; // FR-015: Turn Results display

// FR-019: Sub-phases for two-phase voting
export type SubPhase = 'reviewPhase' | 'negotiationPhase';

// FR-022: Player status for phase tracking
export type PlayerStatusType = 'ready' | 'waiting' | 'acting';

// FR-020: Deal types
export type DealScope = 'this_vote' | 'next_n_turns';
export type DealStatus = 'pending' | 'active' | 'fulfilled' | 'broken';

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

/** FR-019: Non-proposer marks ready to negotiate */
export interface ReadyToNegotiateMessage {
  type: 'readyToNegotiate';
  playerId: string;
}

/** FR-020: Player proposes a deal */
export interface ProposeDealMessage {
  type: 'proposeDeal';
  playerId: string;
  targetPlayerId: string;
  terms: {
    initiatorCommitment: DealCommitment;
    responderCommitment: DealCommitment;
  };
  scope: DealScope;
  scopeValue?: number;
}

/** FR-020: Player responds to a deal proposal */
export interface RespondToDealMessage {
  type: 'respondToDeal';
  playerId: string;
  dealId: string;
  accepted: boolean;
}

/** FR-015/FR-019: Player acknowledges turn results */
export interface AcknowledgeTurnResultsMessage {
  type: 'acknowledgeTurnResults';
  playerId: string;
  turnNumber: number;
}

/** FR-020: Deal commitment type */
export type DealCommitment =
  | { type: 'vote'; choice: 'yes' | 'no' }
  | { type: 'token'; action: 'give' | 'receive' };

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
  | ChatMessage
  | ReadyToNegotiateMessage
  | ProposeDealMessage
  | RespondToDealMessage
  | AcknowledgeTurnResultsMessage;

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

/** FR-019: Review phase started (after card drawn) */
export interface ReviewPhaseStartedMessage {
  type: 'reviewPhaseStarted';
  proposerId: string;
}

/** FR-019: Player marked ready to negotiate */
export interface PlayerReadyToNegotiateMessage {
  type: 'playerReadyToNegotiate';
  playerId: string;
  readyPlayers: string[]; // All players who are ready
  waitingPlayers: string[]; // Players still reviewing
}

/** FR-019: Negotiation phase started (all ready) */
export interface NegotiationPhaseStartedMessage {
  type: 'negotiationPhaseStarted';
  timerStartedAt: number;
  recommendedDuration: number; // 180 seconds
}

/** FR-018: Advancement revealed (after all votes cast) */
export interface AdvancementRevealedMessage {
  type: 'advancementRevealed';
  card: DecisionCardState;
}

/** FR-020: Deal proposed */
export interface DealProposedMessage {
  type: 'dealProposed';
  deal: DealState;
}

/** FR-020: Deal accepted/rejected */
export interface DealResponseMessage {
  type: 'dealResponse';
  dealId: string;
  accepted: boolean;
  deal?: DealState; // Full deal if accepted
}

/** FR-020: Deal breach detected */
export interface DealBreachMessage {
  type: 'dealBreach';
  dealId: string;
  breakerId: string;
  victimId: string;
  influenceLoss: number;
  influenceGain: number;
}

/** FR-022: Player status updated */
export interface PlayerStatusUpdateMessage {
  type: 'playerStatusUpdate';
  playerId: string;
  status: PlayerStatusType;
  phase: GamePhase;
  tooltip?: string; // e.g., "Waiting for [Player] to cast vote"
}

/** FR-021: Timer entered overtime */
export interface TimerOvertimeMessage {
  type: 'timerOvertime';
  phase: GamePhase;
  overtimeSeconds: number;
  waitingPlayers: string[];
}

/** FR-015: Turn results display */
export interface TurnResultsDisplayMessage {
  type: 'turnResultsDisplay';
  turnNumber: number;
  votePassed: boolean;
  voteResults: {
    yesVotes: number;
    noVotes: number;
    abstainCount: number;
    votes: Array<{
      playerId: string;
      playerName: string;
      choice: VoteChoice;
      weight: number;
    }>;
  };
  nationChanges: {
    budgetChange: number;
    stabilityChange: number;
    newBudget: number;
    newStability: number;
  };
  playerEffects: Array<{
    playerId: string;
    playerName: string;
    movementBreakdown: {
      diceRoll: number | null;
      ideologyBonus: number;
      ideologyPenalty: number;
      nationModifier: number;
      influenceModifier: number;
      total: number;
    };
    influenceChange: number;
    influenceReason: string | null;
    tokenEffects: Array<{
      tokenId: string;
      effect: 'honored' | 'broken';
      otherPlayerId: string;
    }>;
  }>;
  pendingAcknowledgments: string[];
  timeoutAt: number;
}

/** FR-015: Player acknowledged turn results */
export interface TurnResultsAcknowledgedMessage {
  type: 'turnResultsAcknowledged';
  playerId: string;
  pendingAcknowledgments: string[];
}

/** FR-015: All players acknowledged, advancing */
export interface TurnResultsCompleteMessage {
  type: 'turnResultsComplete';
  turnNumber: number;
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
  | ErrorMessage
  // New FR-018, FR-019, FR-020, FR-021, FR-022 messages
  | ReviewPhaseStartedMessage
  | PlayerReadyToNegotiateMessage
  | NegotiationPhaseStartedMessage
  | AdvancementRevealedMessage
  | DealProposedMessage
  | DealResponseMessage
  | DealBreachMessage
  | PlayerStatusUpdateMessage
  | TimerOvertimeMessage
  | TurnResultsDisplayMessage
  | TurnResultsAcknowledgedMessage
  | TurnResultsCompleteMessage;

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

/** FR-020: Deal state */
export interface DealState {
  id: string;
  initiatorId: string;
  responderId: string;
  terms: {
    initiatorCommitment: DealCommitment;
    responderCommitment: DealCommitment;
  };
  scope: DealScope;
  scopeValue?: number;
  status: DealStatus;
  createdAt: number;
  resolvedAt?: number;
}

/** FR-022: Player status state */
export interface PlayerStatusState {
  playerId: string;
  status: PlayerStatusType;
  phase: GamePhase;
  updatedAt: number;
}

export interface RoomState {
  id: string;
  status: RoomStatus;
  phase: GamePhase;
  subPhase: SubPhase | null;           // FR-019: Two-phase voting
  hostPlayerId: string;
  currentTurn: number;
  activePlayerId: string | null;
  currentCard: DecisionCardState | null;
  currentProposal: CardOptionId | null;
  diceRoll: number | null;
  timerStartedAt: number | null;       // FR-021: Guidance timer start
  recommendedDuration: number | null;  // FR-021: Recommended seconds
  showAdvancement: boolean;            // FR-018: Card advancement visible
  players: PlayerState[];
  tokens: TokenState[];
  nation: NationState;
  settings: GameSettings;
  // FR-019, FR-020, FR-022 additions
  readyToNegotiate: string[];          // FR-019: Player IDs ready in Review Phase
  activeDeals: DealState[];            // FR-020: Currently active deals
  playerStatuses: PlayerStatusState[]; // FR-022: Phase readiness per player
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
