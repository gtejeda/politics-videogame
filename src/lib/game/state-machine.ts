/**
 * XState Game State Machine
 * Defines all game phases and transitions
 */

import { createMachine, assign } from 'xstate';
import type {
  Player,
  NationState,
  DecisionCard,
  Vote,
  CardOptionId,
  GameSettings,
  SupportToken,
  TurnHistory,
} from './types';
import {
  rollDice,
  getModifiedDiceRoll,
  calculateVoteResults,
  checkCollapse,
  checkAllVictories,
  applyNationChanges,
  applyMovement,
  calculateMovement,
} from './rules';
import { DEFAULT_GAME_SETTINGS } from './constants';

// ============================================
// Context Type
// ============================================

export interface GameContext {
  roomId: string;
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

  // Game end state
  winnerId: string | null;
  collapseReason: 'stability' | 'budget' | null;
}

// ============================================
// Event Types
// ============================================

export type GameEvent =
  | { type: 'PLAYER_JOINED'; player: Player }
  | { type: 'PLAYER_LEFT'; playerId: string }
  | { type: 'IDEOLOGY_SELECTED'; playerId: string; ideology: string }
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE' }
  | { type: 'CARD_DRAWN'; card: DecisionCard }
  | { type: 'TIMER_EXPIRED' }
  | { type: 'PROPOSE_OPTION'; optionId: CardOptionId }
  | { type: 'CAST_VOTE'; playerId: string; vote: Vote }
  | { type: 'ALL_VOTES_CAST' }
  | { type: 'REVEAL_VOTES' }
  | { type: 'RESOLVE_TURN' }
  | { type: 'NEXT_TURN' }
  | { type: 'GAME_COLLAPSED'; reason: 'stability' | 'budget' }
  | { type: 'PLAYER_WON'; playerId: string };

// ============================================
// Guards
// ============================================

const guards = {
  canStartGame: ({ context }: { context: GameContext }) => {
    const playerCount = context.players.size;
    const allHaveIdeology = Array.from(context.players.values()).every(p => p.ideology !== null);
    return (
      playerCount >= context.settings.minPlayers &&
      playerCount <= context.settings.maxPlayers &&
      allHaveIdeology
    );
  },

  canRoll: ({ context }: { context: GameContext }) => {
    return context.activePlayerId !== null && context.diceRoll === null;
  },

  canPropose: ({ context }: { context: GameContext }) => {
    return (
      context.currentCard !== null &&
      context.currentProposal === null
    );
  },

  canVote: ({ context, event }: { context: GameContext; event: GameEvent }) => {
    if (event.type !== 'CAST_VOTE') return false;
    const hasNotVoted = !context.pendingVotes.has(event.playerId);
    const isPlayer = context.players.has(event.playerId);
    return hasNotVoted && isPlayer;
  },

  allVotesCast: ({ context }: { context: GameContext }) => {
    return context.pendingVotes.size === context.players.size;
  },

  hasCollapsed: ({ context }: { context: GameContext }) => {
    const result = checkCollapse(context.nation);
    return result.collapsed;
  },

  hasWinner: ({ context }: { context: GameContext }) => {
    const players = Array.from(context.players.values());
    const result = checkAllVictories(players, context.settings);
    return result.type === 'win';
  },
};

// ============================================
// Actions
// ============================================

const actions = {
  addPlayer: assign({
    players: ({ context, event }) => {
      if (event.type !== 'PLAYER_JOINED') return context.players;
      const newPlayers = new Map(context.players);
      newPlayers.set(event.player.id, event.player);
      return newPlayers;
    },
  }),

  removePlayer: assign({
    players: ({ context, event }) => {
      if (event.type !== 'PLAYER_LEFT') return context.players;
      const newPlayers = new Map(context.players);
      newPlayers.delete(event.playerId);
      return newPlayers;
    },
  }),

  setIdeology: assign({
    players: ({ context, event }) => {
      if (event.type !== 'IDEOLOGY_SELECTED') return context.players;
      const newPlayers = new Map(context.players);
      const player = newPlayers.get(event.playerId);
      if (player) {
        newPlayers.set(event.playerId, {
          ...player,
          ideology: event.ideology as Player['ideology'],
        });
      }
      return newPlayers;
    },
  }),

  initializeGame: assign({
    currentTurn: 1,
    activePlayerId: ({ context }) => {
      // First player becomes active
      const players = Array.from(context.players.values());
      return players[0]?.id || null;
    },
  }),

  performDiceRoll: assign({
    diceRoll: () => rollDice(),
    modifiedDiceRoll: ({ context }) => {
      const roll = rollDice();
      return getModifiedDiceRoll(roll, context.nation);
    },
  }),

  setCurrentCard: assign({
    currentCard: ({ event }) => {
      if (event.type !== 'CARD_DRAWN') return null;
      return event.card;
    },
  }),

  startDeliberationTimer: assign({
    timerEndAt: ({ context }) => Date.now() + (context.settings.deliberationSeconds * 1000),
  }),

  setProposal: assign({
    currentProposal: ({ event }) => {
      if (event.type !== 'PROPOSE_OPTION') return null;
      return event.optionId;
    },
  }),

  recordVote: assign({
    pendingVotes: ({ context, event }) => {
      if (event.type !== 'CAST_VOTE') return context.pendingVotes;
      const newVotes = new Map(context.pendingVotes);
      newVotes.set(event.playerId, event.vote);
      return newVotes;
    },
  }),

  resolveTurn: assign({
    nation: ({ context }) => {
      if (!context.currentCard || !context.currentProposal) return context.nation;

      const votes = Array.from(context.pendingVotes.values());
      const voteResult = calculateVoteResults(votes);

      if (!voteResult.passed) return context.nation;

      const option = context.currentCard.options.find(o => o.id === context.currentProposal);
      if (!option) return context.nation;

      return applyNationChanges(context.nation, option.budgetChange, option.stabilityChange);
    },
    players: ({ context }) => {
      if (!context.currentCard || !context.currentProposal) return context.players;

      const votes = Array.from(context.pendingVotes.values());
      const voteResult = calculateVoteResults(votes);
      const option = context.currentCard.options.find(o => o.id === context.currentProposal);

      const newPlayers = new Map(context.players);

      for (const [playerId, player] of newPlayers) {
        const isActive = playerId === context.activePlayerId;
        const movement = calculateMovement(
          player,
          context.nation,
          voteResult.passed ? option || null : null,
          isActive,
          context.modifiedDiceRoll || 0,
          voteResult.passed
        );

        const newPosition = applyMovement(player.position, movement.total, context.settings.pathLength);

        newPlayers.set(playerId, {
          ...player,
          position: newPosition,
        });
      }

      return newPlayers;
    },
    history: ({ context }) => {
      if (!context.currentCard || !context.currentProposal) return context.history;

      const votes = Array.from(context.pendingVotes.values());
      const voteResult = calculateVoteResults(votes);
      const option = context.currentCard.options.find(o => o.id === context.currentProposal);

      const turnHistory: TurnHistory = {
        turnNumber: context.currentTurn,
        activePlayerId: context.activePlayerId || '',
        card: context.currentCard,
        proposedOption: context.currentProposal,
        votes,
        passed: voteResult.passed,
        nationChanges: {
          budgetChange: voteResult.passed && option ? option.budgetChange : 0,
          stabilityChange: voteResult.passed && option ? option.stabilityChange : 0,
        },
        movements: [], // Would be populated with actual movements
      };

      return [...context.history, turnHistory];
    },
  }),

  advanceToNextPlayer: assign({
    currentTurn: ({ context }) => context.currentTurn + 1,
    activePlayerId: ({ context }) => {
      const playerIds = Array.from(context.players.keys());
      const currentIndex = playerIds.indexOf(context.activePlayerId || '');
      const nextIndex = (currentIndex + 1) % playerIds.length;
      return playerIds[nextIndex];
    },
    currentCard: null,
    currentProposal: null,
    diceRoll: null,
    modifiedDiceRoll: null,
    pendingVotes: () => new Map(),
    timerEndAt: null,
  }),

  clearTurnState: assign({
    currentCard: null,
    currentProposal: null,
    diceRoll: null,
    modifiedDiceRoll: null,
    pendingVotes: () => new Map(),
    timerEndAt: null,
  }),

  setCollapse: assign({
    collapseReason: ({ context }) => {
      const result = checkCollapse(context.nation);
      return result.reason || null;
    },
  }),

  setWinner: assign({
    winnerId: ({ context }) => {
      const players = Array.from(context.players.values());
      const result = checkAllVictories(players, context.settings);
      return result.playerId || null;
    },
  }),
};

// ============================================
// State Machine Definition
// ============================================

export const gameMachine = createMachine({
  id: 'game',
  initial: 'lobby',
  context: {
    roomId: '',
    hostPlayerId: '',
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
    winnerId: null,
    collapseReason: null,
  } as GameContext,
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  states: {
    lobby: {
      on: {
        PLAYER_JOINED: {
          actions: 'addPlayer',
        },
        PLAYER_LEFT: {
          actions: 'removePlayer',
        },
        IDEOLOGY_SELECTED: {
          actions: 'setIdeology',
        },
        START_GAME: {
          target: 'playing',
          guard: 'canStartGame',
          actions: 'initializeGame',
        },
      },
    },

    playing: {
      initial: 'waiting',
      states: {
        waiting: {
          on: {
            ROLL_DICE: {
              target: 'rolling',
              guard: 'canRoll',
            },
          },
        },

        rolling: {
          entry: 'performDiceRoll',
          on: {
            CARD_DRAWN: {
              target: 'deliberating',
              actions: 'setCurrentCard',
            },
          },
        },

        deliberating: {
          entry: 'startDeliberationTimer',
          on: {
            PROPOSE_OPTION: {
              target: 'voting',
              guard: 'canPropose',
              actions: 'setProposal',
            },
            TIMER_EXPIRED: {
              target: 'voting',
              // Auto-select first option if timer expires
              actions: assign({
                currentProposal: ({ context }) => context.currentCard?.options[0]?.id || 'A',
              }),
            },
          },
        },

        voting: {
          on: {
            CAST_VOTE: {
              guard: 'canVote',
              actions: 'recordVote',
            },
            ALL_VOTES_CAST: {
              target: 'revealing',
              guard: 'allVotesCast',
            },
          },
          always: {
            target: 'revealing',
            guard: 'allVotesCast',
          },
        },

        revealing: {
          on: {
            REVEAL_VOTES: {
              target: 'resolving',
            },
          },
        },

        resolving: {
          entry: 'resolveTurn',
          always: [
            {
              target: '#game.collapsed',
              guard: 'hasCollapsed',
              actions: 'setCollapse',
            },
            {
              target: '#game.finished',
              guard: 'hasWinner',
              actions: 'setWinner',
            },
            {
              target: 'waiting',
              actions: 'advanceToNextPlayer',
            },
          ],
        },
      },
    },

    collapsed: {
      type: 'final',
    },

    finished: {
      type: 'final',
    },
  },
}, {
  guards,
  actions,
});

export type GameMachine = typeof gameMachine;
