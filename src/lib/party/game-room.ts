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
  TIMING,
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
import {
  CrisisEvent,
  ActiveCrisis,
  shouldTriggerCrisis,
  calculateTotalContribution,
  resolveCrisis,
} from '../game/crises';

// ============================================
// Room State Interface
// ============================================

export interface GameRoomState {
  id: string;
  status: 'lobby' | 'playing' | 'collapsed' | 'finished';
  phase: 'waiting' | 'rolling' | 'drawing' | 'deliberating' | 'proposing' | 'voting' | 'revealing' | 'resolving' | 'showingResults' | 'crisis';
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

  // Turn Results acknowledgment state
  pendingAcknowledgments: Set<string>; // Player IDs who haven't acknowledged yet
  resultsTimeoutAt: number | null; // When auto-acknowledge will trigger

  // AFK tracking state
  playerLastActivity: Map<string, number>; // playerId -> last activity timestamp
  afkPlayers: Set<string>; // Player IDs currently marked as AFK

  // Crisis state
  activeCrisis: {
    crisis: CrisisEvent;
    contributions: Map<string, number>; // playerId -> contribution amount
    turnsRemaining: number;
  } | null;

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
    pendingAcknowledgments: new Set(),
    resultsTimeoutAt: null,
    playerLastActivity: new Map(),
    afkPlayers: new Set(),
    activeCrisis: null,
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
    return { error: `Room is full (max ${state.settings.maxPlayers} players)` };
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
      const firstKey = newPlayers.keys().next().value;
      if (firstKey) {
        newHostId = firstKey;
        const newHost = newPlayers.get(newHostId);
        if (newHost) {
          newPlayers.set(newHostId, { ...newHost, isHost: true });
        }
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
    return { error: `Need at least ${state.settings.minPlayers} players to begin` };
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
// Deal Resolution
// ============================================

export interface DealResolution {
  tokenId: string;
  ownerId: string;
  holderId: string;
  status: 'honored' | 'broken';
}

/**
 * Resolves all active deals after a vote.
 * A deal is "broken" if the holder voted against the owner's proposal.
 * A deal is "honored" if the holder voted in favor (or abstained).
 *
 * When a deal is broken:
 * - Holder loses 1 influence (betrayer penalty)
 * - Owner gains 1 influence (victim compensation)
 */
export function resolveDeals(
  state: GameRoomState,
  votes: Map<string, Vote>,
  proposingPlayerId: string,
  votePassed: boolean
): { state: GameRoomState; resolutions: DealResolution[] } {
  const resolutions: DealResolution[] = [];
  const newTokens = [...state.tokens];
  const newPlayers = new Map(state.players);

  // Find all active tokens where the owner is the proposing player
  for (let i = 0; i < newTokens.length; i++) {
    const token = newTokens[i];

    // Only process active tokens owned by the proposing player
    if (token.ownerId !== proposingPlayerId || token.status !== 'active') {
      continue;
    }

    // Skip if the owner is holding their own token
    if (token.heldById === token.ownerId) {
      continue;
    }

    // Get the holder's vote
    const holderVote = votes.get(token.heldById);
    if (!holderVote) continue;

    // Determine if the deal was honored or broken
    // Deal is broken if holder voted "no" on the owner's proposal
    const isBroken = holderVote.choice === 'no';

    const resolution: DealResolution = {
      tokenId: token.id,
      ownerId: token.ownerId,
      holderId: token.heldById,
      status: isBroken ? 'broken' : 'honored',
    };
    resolutions.push(resolution);

    // Update token status
    newTokens[i] = {
      ...token,
      status: isBroken ? 'broken' : 'honored',
    };

    // Apply influence changes for broken deals
    if (isBroken) {
      const holder = newPlayers.get(token.heldById);
      const owner = newPlayers.get(token.ownerId);

      if (holder) {
        newPlayers.set(token.heldById, {
          ...holder,
          influence: Math.max(0, holder.influence - 1), // Betrayer loses 1
        });
      }

      if (owner) {
        newPlayers.set(token.ownerId, {
          ...owner,
          influence: owner.influence + 1, // Victim gains 1
        });
      }
    }
  }

  return {
    state: {
      ...state,
      tokens: newTokens,
      players: newPlayers,
    },
    resolutions,
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
    activeCrisis: state.activeCrisis ? {
      crisis: state.activeCrisis.crisis,
      contributions: Object.fromEntries(state.activeCrisis.contributions),
      turnsRemaining: state.activeCrisis.turnsRemaining,
    } : null,
    // Turn Results acknowledgment state
    pendingAcknowledgments: Array.from(state.pendingAcknowledgments),
    resultsTimeoutAt: state.resultsTimeoutAt,
  };
}

// ============================================
// Turn Results Acknowledgment
// ============================================

/**
 * Enter the showingResults phase after vote resolution
 * Sets up pending acknowledgments for all connected players
 */
export function enterShowingResultsPhase(state: GameRoomState): GameRoomState {
  const connectedPlayerIds = Array.from(state.players.entries())
    .filter(([_, p]) => p.isConnected)
    .map(([id]) => id);

  return {
    ...state,
    phase: 'showingResults',
    pendingAcknowledgments: new Set(connectedPlayerIds),
    resultsTimeoutAt: Date.now() + TIMING.TURN_RESULTS_TIMEOUT_MS,
  };
}

/**
 * Record a player's acknowledgment of turn results
 * Returns true if all players have now acknowledged
 */
export function acknowledgeTurnResults(
  state: GameRoomState,
  playerId: string
): { state: GameRoomState; allAcknowledged: boolean } | { error: string } {
  if (state.phase !== 'showingResults') {
    return { error: 'Not in showingResults phase' };
  }

  if (!state.pendingAcknowledgments.has(playerId)) {
    // Player already acknowledged or not in pending list
    return { state, allAcknowledged: state.pendingAcknowledgments.size === 0 };
  }

  const newPendingAcks = new Set(state.pendingAcknowledgments);
  newPendingAcks.delete(playerId);

  const allAcknowledged = newPendingAcks.size === 0;

  return {
    state: {
      ...state,
      pendingAcknowledgments: newPendingAcks,
    },
    allAcknowledged,
  };
}

/**
 * Clear the showingResults state and prepare for next turn
 */
export function clearShowingResultsState(state: GameRoomState): GameRoomState {
  return {
    ...state,
    pendingAcknowledgments: new Set(),
    resultsTimeoutAt: null,
  };
}

// ============================================
// Crisis Management
// ============================================

/**
 * Check if a crisis should trigger based on nation state
 * Called at the end of each turn resolution
 */
export function checkAndTriggerCrisis(
  state: GameRoomState
): { state: GameRoomState; triggered: CrisisEvent | null } {
  // Don't trigger if already in crisis
  if (state.activeCrisis) {
    return { state, triggered: null };
  }

  const crisis = shouldTriggerCrisis(
    state.nation.stability,
    state.nation.budget,
    state.currentTurn,
    null // No active crisis
  );

  if (!crisis) {
    return { state, triggered: null };
  }

  // Activate the crisis
  const newState: GameRoomState = {
    ...state,
    phase: 'crisis',
    activeCrisis: {
      crisis,
      contributions: new Map(),
      turnsRemaining: 2, // Crises last 2 turns
    },
  };

  return { state: newState, triggered: crisis };
}

/**
 * Contribute influence to resolve an active crisis
 */
export function contributeToCrisis(
  state: GameRoomState,
  playerId: string,
  amount: number
): GameRoomState | { error: string } {
  if (!state.activeCrisis) {
    return { error: 'No active crisis' };
  }

  const player = state.players.get(playerId);
  if (!player) {
    return { error: 'Player not found' };
  }

  if (amount <= 0) {
    return { error: 'Must contribute at least 1 influence' };
  }

  if (amount > player.influence) {
    return { error: 'Not enough influence' };
  }

  const currentContribution = state.activeCrisis.contributions.get(playerId) || 0;
  const newContribution = currentContribution + amount;

  if (newContribution > state.activeCrisis.crisis.maxContributionPerPlayer) {
    return { error: `Maximum contribution is ${state.activeCrisis.crisis.maxContributionPerPlayer}` };
  }

  // Update contributions
  const newContributions = new Map(state.activeCrisis.contributions);
  newContributions.set(playerId, newContribution);

  // Deduct influence from player
  const newPlayers = new Map(state.players);
  newPlayers.set(playerId, {
    ...player,
    influence: player.influence - amount,
  });

  return {
    ...state,
    players: newPlayers,
    activeCrisis: {
      ...state.activeCrisis,
      contributions: newContributions,
    },
  };
}

/**
 * Resolve the active crisis and apply effects
 */
export function resolveCrisisEvent(
  state: GameRoomState
): {
  state: GameRoomState;
  outcome: 'success' | 'failure';
  nationChanges: { budgetChange: number; stabilityChange: number };
} | { error: string } {
  if (!state.activeCrisis) {
    return { error: 'No active crisis' };
  }

  const { crisis, contributions } = state.activeCrisis;

  // Calculate total contribution with ideology bonuses
  const totalContribution = calculateTotalContribution(
    contributions,
    state.players,
    crisis
  );

  // Determine outcome
  const outcome = resolveCrisis(crisis, totalContribution);
  const effect = outcome === 'success' ? crisis.successEffect : crisis.failureEffect;

  // Apply nation changes
  const newNation = {
    stability: Math.max(-5, Math.min(15, state.nation.stability + effect.stabilityChange)),
    budget: Math.max(-5, Math.min(15, state.nation.budget + effect.budgetChange)),
  };

  return {
    state: {
      ...state,
      nation: newNation,
      activeCrisis: null, // Clear the crisis
      phase: 'waiting', // Return to normal turn flow
    },
    outcome,
    nationChanges: {
      budgetChange: effect.budgetChange,
      stabilityChange: effect.stabilityChange,
    },
  };
}

/**
 * Advance crisis turn counter (called at end of each turn)
 */
export function advanceCrisisTurn(
  state: GameRoomState
): { state: GameRoomState; shouldResolve: boolean } {
  if (!state.activeCrisis) {
    return { state, shouldResolve: false };
  }

  const newTurnsRemaining = state.activeCrisis.turnsRemaining - 1;

  if (newTurnsRemaining <= 0) {
    // Crisis will be resolved
    return { state, shouldResolve: true };
  }

  return {
    state: {
      ...state,
      activeCrisis: {
        ...state.activeCrisis,
        turnsRemaining: newTurnsRemaining,
      },
    },
    shouldResolve: false,
  };
}

// ============================================
// AFK Tracking
// ============================================

import { AFK_SETTINGS } from '../game/constants';

/**
 * Update a player's last activity timestamp
 */
export function recordPlayerActivity(
  state: GameRoomState,
  playerId: string
): GameRoomState {
  const newLastActivity = new Map(state.playerLastActivity);
  newLastActivity.set(playerId, Date.now());

  // Remove from AFK set if they were AFK
  const newAfkPlayers = new Set(state.afkPlayers);
  newAfkPlayers.delete(playerId);

  return {
    ...state,
    playerLastActivity: newLastActivity,
    afkPlayers: newAfkPlayers,
  };
}

/**
 * Check for AFK players and apply penalties
 * Returns the updated state and any players who became AFK
 */
export function checkAfkPlayers(
  state: GameRoomState
): { state: GameRoomState; newAfkPlayers: Array<{ playerId: string; playerName: string; influenceLost: number; newInfluence: number }> } {
  const now = Date.now();
  const newAfkPlayers: Array<{ playerId: string; playerName: string; influenceLost: number; newInfluence: number }> = [];
  const newPlayers = new Map(state.players);
  const afkSet = new Set(state.afkPlayers);

  for (const [playerId, player] of state.players) {
    // Skip if not connected or already AFK
    if (!player.isConnected || afkSet.has(playerId)) continue;

    const lastActivity = state.playerLastActivity.get(playerId);
    if (!lastActivity) continue;

    const timeSinceActivity = now - lastActivity;

    if (timeSinceActivity >= AFK_SETTINGS.TIMEOUT_MS) {
      // Mark as AFK and apply penalty
      afkSet.add(playerId);

      const influenceLost = Math.min(player.influence, AFK_SETTINGS.INFLUENCE_PENALTY);
      const newInfluence = Math.max(0, player.influence - influenceLost);

      newPlayers.set(playerId, {
        ...player,
        influence: newInfluence,
      });

      newAfkPlayers.push({
        playerId,
        playerName: player.name,
        influenceLost,
        newInfluence,
      });
    }
  }

  return {
    state: {
      ...state,
      players: newPlayers,
      afkPlayers: afkSet,
    },
    newAfkPlayers,
  };
}

/**
 * Skip an AFK player's turn and advance to the next player
 */
export function skipAfkPlayerTurn(
  state: GameRoomState
): GameRoomState {
  if (!state.activePlayerId) return state;

  // Get next player
  const playerIds = Array.from(state.players.keys());
  const currentIndex = playerIds.indexOf(state.activePlayerId);
  const nextIndex = (currentIndex + 1) % playerIds.length;
  const nextPlayerId = playerIds[nextIndex];

  return {
    ...state,
    activePlayerId: nextPlayerId,
    phase: 'waiting',
    diceRoll: null,
    modifiedDiceRoll: null,
    currentCard: null,
    currentProposal: null,
    timerEndAt: null,
  };
}

/**
 * Check if the active player is AFK
 */
export function isActivePlayerAfk(state: GameRoomState): boolean {
  if (!state.activePlayerId) return false;
  return state.afkPlayers.has(state.activePlayerId);
}
