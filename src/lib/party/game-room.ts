/**
 * PartyKit Game Room Handler
 * Manages room state, message routing, and broadcasts
 */

import type {
  Player,
  NationState,
  DecisionCard,
  Vote,
  SupportToken,
  GameSettings,
  CardOptionId,
  Ideology,
  TurnHistory,
} from '../game/types';
import type {
  ClientMessage,
  ServerMessage,
  RoomStatePayload,
  PlayerStatePayload,
  TokenStatePayload,
} from '../game/events';
import {
  DEFAULT_GAME_SETTINGS,
  generateRoomCode,
  generatePlayerId,
  generateTokenId,
} from '../game/constants';
import {
  rollDice,
  getModifiedDiceRoll,
  calculateVoteResults,
  checkCollapse,
  checkAllVictories,
  applyNationChanges,
  applyMovement,
  calculateMovement,
  getMostAdvancedZone,
} from '../game/rules';

// ============================================
// Room State Interface
// ============================================

export interface GameRoomState {
  id: string;
  status: 'lobby' | 'playing' | 'collapsed' | 'finished';
  phase: 'waiting' | 'rolling' | 'drawing' | 'deliberating' | 'proposing' | 'voting' | 'revealing' | 'resolving';
  hostPlayerId: string;
  players: Map<string, Player>;
  nation: NationState;
  tokens: SupportToken[];
  settings: GameSettings;

  // Turn state
  currentTurn: number;
  activePlayerId: string | null;
  currentCard: DecisionCard | null;
  currentProposal: CardOptionId | null;
  diceRoll: number | null;
  modifiedDiceRoll: number | null;
  pendingVotes: Map<string, Vote>;
  timerEndAt: number | null;

  // History
  history: TurnHistory[];
}

// ============================================
// Room State Initialization
// ============================================

export function createInitialRoomState(roomId: string, hostPlayerId: string): GameRoomState {
  return {
    id: roomId,
    status: 'lobby',
    phase: 'waiting',
    hostPlayerId,
    players: new Map(),
    nation: {
      stability: DEFAULT_GAME_SETTINGS.startingStability,
      budget: DEFAULT_GAME_SETTINGS.startingBudget,
    },
    tokens: [],
    settings: DEFAULT_GAME_SETTINGS,
    currentTurn: 0,
    activePlayerId: null,
    currentCard: null,
    currentProposal: null,
    diceRoll: null,
    modifiedDiceRoll: null,
    pendingVotes: new Map(),
    timerEndAt: null,
    history: [],
  };
}

// ============================================
// Player Management
// ============================================

export function createPlayer(
  id: string,
  name: string,
  isHost: boolean,
  settings: GameSettings
): Player {
  return {
    id,
    name,
    ideology: null,
    position: 0,
    influence: settings.startingInfluence,
    ownTokens: settings.startingTokens,
    isConnected: true,
    isHost,
  };
}

export function addPlayerToRoom(
  state: GameRoomState,
  playerId: string,
  playerName: string
): { state: GameRoomState; player: Player } | { error: string } {
  // Check if room is joinable
  if (state.status !== 'lobby') {
    return { error: 'Game has already started' };
  }

  if (state.players.size >= state.settings.maxPlayers) {
    return { error: 'Room is full' };
  }

  // Check if player already exists (reconnection)
  const existingPlayer = state.players.get(playerId);
  if (existingPlayer) {
    // Reconnection
    const updatedPlayer = { ...existingPlayer, isConnected: true };
    const newPlayers = new Map(state.players);
    newPlayers.set(playerId, updatedPlayer);
    return {
      state: { ...state, players: newPlayers },
      player: updatedPlayer,
    };
  }

  // Create new player
  const isHost = state.players.size === 0;
  const player = createPlayer(playerId, playerName, isHost, state.settings);

  const newPlayers = new Map(state.players);
  newPlayers.set(playerId, player);

  // Initialize support tokens for the player
  const newTokens = [...state.tokens];
  for (let i = 0; i < state.settings.startingTokens; i++) {
    newTokens.push({
      id: generateTokenId(),
      ownerId: playerId,
      heldById: playerId,
      status: 'active',
    });
  }

  return {
    state: {
      ...state,
      players: newPlayers,
      tokens: newTokens,
      hostPlayerId: isHost ? playerId : state.hostPlayerId,
    },
    player,
  };
}

export function removePlayerFromRoom(
  state: GameRoomState,
  playerId: string
): GameRoomState {
  const newPlayers = new Map(state.players);
  const player = newPlayers.get(playerId);

  if (!player) return state;

  // Mark as disconnected during game, remove in lobby
  if (state.status === 'lobby') {
    newPlayers.delete(playerId);

    // Remove player's tokens
    const newTokens = state.tokens.filter(t => t.ownerId !== playerId);

    // Reassign host if needed
    let newHostId = state.hostPlayerId;
    if (state.hostPlayerId === playerId && newPlayers.size > 0) {
      newHostId = newPlayers.keys().next().value;
      const newHost = newPlayers.get(newHostId);
      if (newHost) {
        newPlayers.set(newHostId, { ...newHost, isHost: true });
      }
    }

    return {
      ...state,
      players: newPlayers,
      tokens: newTokens,
      hostPlayerId: newHostId,
    };
  } else {
    // Mark as disconnected during game
    newPlayers.set(playerId, { ...player, isConnected: false });
    return { ...state, players: newPlayers };
  }
}

// ============================================
// Ideology Selection
// ============================================

export function selectIdeology(
  state: GameRoomState,
  playerId: string,
  ideology: Ideology
): GameRoomState | { error: string } {
  if (state.status !== 'lobby') {
    return { error: 'Cannot change ideology after game starts' };
  }

  const player = state.players.get(playerId);
  if (!player) {
    return { error: 'Player not found' };
  }

  // Check if ideology is already taken
  for (const [id, p] of state.players) {
    if (id !== playerId && p.ideology === ideology) {
      return { error: 'Ideology already taken' };
    }
  }

  const newPlayers = new Map(state.players);
  newPlayers.set(playerId, { ...player, ideology });

  return { ...state, players: newPlayers };
}

// ============================================
// Game Start
// ============================================

export function startGame(
  state: GameRoomState,
  playerId: string
): GameRoomState | { error: string } {
  if (state.hostPlayerId !== playerId) {
    return { error: 'Only host can start the game' };
  }

  if (state.players.size < state.settings.minPlayers) {
    return { error: `Need at least ${state.settings.minPlayers} players` };
  }

  if (state.players.size > state.settings.maxPlayers) {
    return { error: `Maximum ${state.settings.maxPlayers} players allowed` };
  }

  // Check all players have ideology
  for (const player of state.players.values()) {
    if (!player.ideology) {
      return { error: 'All players must select an ideology' };
    }
  }

  // Get first player
  const playerIds = Array.from(state.players.keys());
  const firstPlayerId = playerIds[0];

  return {
    ...state,
    status: 'playing',
    phase: 'waiting',
    currentTurn: 1,
    activePlayerId: firstPlayerId,
  };
}

// ============================================
// Dice Rolling
// ============================================

export function performDiceRoll(
  state: GameRoomState,
  playerId: string
): { state: GameRoomState; roll: number; modifiedRoll: number } | { error: string } {
  if (state.phase !== 'waiting') {
    return { error: 'Not in rolling phase' };
  }

  if (state.activePlayerId !== playerId) {
    return { error: 'Not your turn' };
  }

  const roll = rollDice();
  const modifiedRoll = getModifiedDiceRoll(roll, state.nation);

  return {
    state: {
      ...state,
      phase: 'drawing',
      diceRoll: roll,
      modifiedDiceRoll: modifiedRoll,
    },
    roll,
    modifiedRoll,
  };
}

// ============================================
// Card Drawing
// ============================================

export function setCurrentCard(
  state: GameRoomState,
  card: DecisionCard
): GameRoomState {
  return {
    ...state,
    phase: 'deliberating',
    currentCard: card,
    timerEndAt: Date.now() + (state.settings.deliberationSeconds * 1000),
  };
}

// ============================================
// Option Proposal
// ============================================

export function proposeOption(
  state: GameRoomState,
  playerId: string,
  optionId: CardOptionId
): GameRoomState | { error: string } {
  if (state.phase !== 'deliberating' && state.phase !== 'proposing') {
    return { error: 'Not in proposal phase' };
  }

  if (state.activePlayerId !== playerId) {
    return { error: 'Only active player can propose' };
  }

  if (!state.currentCard) {
    return { error: 'No card to propose on' };
  }

  const validOption = state.currentCard.options.find(o => o.id === optionId);
  if (!validOption) {
    return { error: 'Invalid option' };
  }

  return {
    ...state,
    phase: 'voting',
    currentProposal: optionId,
    timerEndAt: null,
  };
}

// ============================================
// Voting
// ============================================

export function castVote(
  state: GameRoomState,
  vote: Vote
): { state: GameRoomState; allVoted: boolean } | { error: string } {
  if (state.phase !== 'voting') {
    return { error: 'Not in voting phase' };
  }

  if (!state.players.has(vote.playerId)) {
    return { error: 'Player not in game' };
  }

  if (state.pendingVotes.has(vote.playerId)) {
    return { error: 'Already voted' };
  }

  const player = state.players.get(vote.playerId)!;
  if (vote.influenceSpent > player.influence) {
    return { error: 'Not enough influence' };
  }

  const newVotes = new Map(state.pendingVotes);
  newVotes.set(vote.playerId, vote);

  // Deduct influence spent
  const newPlayers = new Map(state.players);
  newPlayers.set(vote.playerId, {
    ...player,
    influence: player.influence - vote.influenceSpent,
  });

  const allVoted = newVotes.size === state.players.size;

  return {
    state: {
      ...state,
      pendingVotes: newVotes,
      players: newPlayers,
      phase: allVoted ? 'revealing' : 'voting',
    },
    allVoted,
  };
}

// ============================================
// Vote Resolution
// ============================================

export function resolveVotes(state: GameRoomState): {
  state: GameRoomState;
  voteResult: ReturnType<typeof calculateVoteResults>;
  nationChanges: { budgetChange: number; stabilityChange: number; newBudget: number; newStability: number };
  movements: Array<{ playerId: string; oldPosition: number; newPosition: number; reason: string }>;
} {
  const votes = Array.from(state.pendingVotes.values());
  const voteResult = calculateVoteResults(votes);

  let newNation = state.nation;
  let nationChanges = { budgetChange: 0, stabilityChange: 0, newBudget: state.nation.budget, newStability: state.nation.stability };

  const option = state.currentCard?.options.find(o => o.id === state.currentProposal);

  if (voteResult.passed && option) {
    newNation = applyNationChanges(state.nation, option.budgetChange, option.stabilityChange);
    nationChanges = {
      budgetChange: option.budgetChange,
      stabilityChange: option.stabilityChange,
      newBudget: newNation.budget,
      newStability: newNation.stability,
    };
  }

  // Calculate movements
  const movements: Array<{ playerId: string; oldPosition: number; newPosition: number; reason: string }> = [];
  const newPlayers = new Map(state.players);

  for (const [playerId, player] of state.players) {
    const isActive = playerId === state.activePlayerId;
    const movement = calculateMovement(
      player,
      state.nation,
      voteResult.passed ? option || null : null,
      isActive,
      state.modifiedDiceRoll || 0,
      voteResult.passed
    );

    const oldPosition = player.position;
    const newPosition = applyMovement(oldPosition, movement.total, state.settings.pathLength);

    if (newPosition !== oldPosition) {
      movements.push({
        playerId,
        oldPosition,
        newPosition,
        reason: movement.reasons.join(', '),
      });

      newPlayers.set(playerId, {
        ...player,
        position: newPosition,
      });
    }
  }

  return {
    state: {
      ...state,
      phase: 'resolving',
      nation: newNation,
      players: newPlayers,
    },
    voteResult,
    nationChanges,
    movements,
  };
}

// ============================================
// Turn Advancement
// ============================================

export function advanceToNextTurn(state: GameRoomState): GameRoomState | { collapsed: true; reason: 'stability' | 'budget' } | { winner: string } {
  // Check for collapse
  const collapseResult = checkCollapse(state.nation);
  if (collapseResult.collapsed) {
    return {
      collapsed: true,
      reason: collapseResult.reason!,
    };
  }

  // Check for winner
  const players = Array.from(state.players.values());
  const victoryResult = checkAllVictories(players, state.settings);
  if (victoryResult.type === 'win' && victoryResult.playerId) {
    return { winner: victoryResult.playerId };
  }

  // Advance to next player
  const playerIds = Array.from(state.players.keys());
  const currentIndex = playerIds.indexOf(state.activePlayerId || '');
  const nextIndex = (currentIndex + 1) % playerIds.length;
  const nextPlayerId = playerIds[nextIndex];

  return {
    ...state,
    currentTurn: state.currentTurn + 1,
    activePlayerId: nextPlayerId,
    phase: 'waiting',
    currentCard: null,
    currentProposal: null,
    diceRoll: null,
    modifiedDiceRoll: null,
    pendingVotes: new Map(),
    timerEndAt: null,
  };
}

// ============================================
// Support Token Transfer
// ============================================

export function giveToken(
  state: GameRoomState,
  fromPlayerId: string,
  toPlayerId: string
): GameRoomState | { error: string } {
  const fromPlayer = state.players.get(fromPlayerId);
  const toPlayer = state.players.get(toPlayerId);

  if (!fromPlayer || !toPlayer) {
    return { error: 'Player not found' };
  }

  // Find an available token
  const availableToken = state.tokens.find(
    t => t.ownerId === fromPlayerId && t.heldById === fromPlayerId && t.status === 'active'
  );

  if (!availableToken) {
    return { error: 'No available tokens' };
  }

  // Transfer the token
  const newTokens = state.tokens.map(t =>
    t.id === availableToken.id
      ? { ...t, heldById: toPlayerId, givenAt: Date.now() }
      : t
  );

  // Update player token counts
  const newPlayers = new Map(state.players);
  newPlayers.set(fromPlayerId, { ...fromPlayer, ownTokens: fromPlayer.ownTokens - 1 });

  return {
    ...state,
    tokens: newTokens,
    players: newPlayers,
  };
}

// ============================================
// State Serialization
// ============================================

export function serializeRoomState(state: GameRoomState): RoomStatePayload {
  const players: PlayerStatePayload[] = Array.from(state.players.values()).map(p => ({
    id: p.id,
    name: p.name,
    ideology: p.ideology,
    position: p.position,
    influence: p.influence,
    ownTokens: p.ownTokens,
    isConnected: p.isConnected,
    isHost: p.isHost,
  }));

  const tokens: TokenStatePayload[] = state.tokens.map(t => ({
    id: t.id,
    ownerId: t.ownerId,
    heldById: t.heldById,
    status: t.status,
  }));

  return {
    id: state.id,
    status: state.status,
    phase: state.phase,
    hostPlayerId: state.hostPlayerId,
    currentTurn: state.currentTurn,
    activePlayerId: state.activePlayerId,
    currentCard: state.currentCard,
    currentProposal: state.currentProposal,
    diceRoll: state.diceRoll,
    timerEndAt: state.timerEndAt,
    players,
    tokens,
    nation: state.nation,
    settings: state.settings,
  };
}
