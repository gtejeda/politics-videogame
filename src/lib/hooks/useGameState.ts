'use client';

/**
 * useGameState Hook
 * Subscribes to PartyKit game state via WebSocket
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import usePartySocket from 'partysocket/react';
import type {
  ClientMessage,
  ServerMessage,
  RoomStatePayload,
  PlayerStatePayload,
  TurnResultsDisplayMessage,
  CrisisPayload,
} from '../game/events';
import type { Ideology, CardOptionId, VoteChoice } from '../game/types';

// ============================================
// Hook State Types
// ============================================

export interface DealBreachData {
  breakerId: string;
  breakerName: string;
  victimId: string;
  victimName: string;
  influenceLoss: number;
  influenceGain: number;
}

// T044b: Crisis resolution data for animation
export interface CrisisResolutionData {
  crisis: CrisisPayload;
  outcome: 'success' | 'failure';
  contributions: Array<{ playerId: string; amount: number }>;
  nationChanges: {
    budgetChange: number;
    stabilityChange: number;
  };
  totalContribution: number;
}

export interface GameState {
  connected: boolean;
  roomState: RoomStatePayload | null;
  error: string | null;
  localPlayerId: string | null;
  turnResultsData: TurnResultsDisplayMessage | null;
  hasAcknowledgedResults: boolean;
  afkPlayers: Set<string>; // Player IDs currently AFK
  dealBreachData: DealBreachData | null; // T043: Active deal breach for animation
  crisisResolutionData: CrisisResolutionData | null; // T044b: Crisis resolution for animation
}

export interface GameActions {
  joinRoom: (playerId: string, playerName: string) => void;
  selectIdeology: (ideology: Ideology) => void;
  startGame: () => void;
  rollDice: () => void;
  proposeOption: (optionId: CardOptionId) => void;
  castVote: (choice: VoteChoice, influenceSpent?: number) => void;
  giveToken: (targetPlayerId: string) => void;
  sendChat: (text: string) => void;
  leaveRoom: () => void;
  acknowledgeTurnResults: () => void;
  markReadyToNegotiate: () => void; // FR-019
  clearDealBreach: () => void; // T043: Clear deal breach after animation
  clearCrisisResolution: () => void; // T044b: Clear crisis resolution after animation
}

// ============================================
// Hook Implementation
// ============================================

export function useGameState(roomId: string): [GameState, GameActions] {
  const [state, setState] = useState<GameState>({
    connected: false,
    roomState: null,
    error: null,
    localPlayerId: null,
    turnResultsData: null,
    hasAcknowledgedResults: false,
    afkPlayers: new Set(),
    dealBreachData: null,
    crisisResolutionData: null,
  });

  const localPlayerIdRef = useRef<string | null>(null);

  // PartyKit WebSocket connection
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'localhost:1999',
    room: roomId,
    onOpen: () => {
      setState(prev => ({ ...prev, connected: true, error: null }));
    },
    onClose: () => {
      setState(prev => ({ ...prev, connected: false }));
    },
    onError: () => {
      setState(prev => ({ ...prev, error: 'Connection error' }));
    },
    onMessage: (event) => {
      try {
        const message = JSON.parse(event.data) as ServerMessage;
        handleServerMessage(message);
      } catch (error) {
        console.error('Failed to parse server message:', error);
      }
    },
  });

  // ============================================
  // Message Handlers
  // ============================================

  const handleServerMessage = useCallback((message: ServerMessage) => {
    switch (message.type) {
      case 'roomStateSync':
        setState(prev => ({
          ...prev,
          roomState: message.room,
        }));
        break;

      case 'playerJoined':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              players: [...prev.roomState.players, message.player],
            },
          };
        });
        break;

      case 'playerLeft':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              players: prev.roomState.players.filter(p => p.id !== message.playerId),
            },
          };
        });
        break;

      case 'ideologySelected':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              players: prev.roomState.players.map(p =>
                p.id === message.playerId
                  ? { ...p, ideology: message.ideology }
                  : p
              ),
            },
          };
        });
        break;

      case 'gameStarted':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              status: 'playing',
              phase: 'waiting',
              currentTurn: 1,
              activePlayerId: message.firstPlayerId,
            },
          };
        });
        break;

      case 'turnStarted':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'waiting',
              currentTurn: message.turnNumber,
              activePlayerId: message.activePlayerId,
              currentCard: null,
              currentProposal: null,
              diceRoll: null,
            },
          };
        });
        break;

      case 'diceRolled':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'drawing',
              diceRoll: message.modifiedRoll,
            },
          };
        });
        break;

      case 'cardDrawn':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'reviewing', // FR-019: Start in Review Phase
              subPhase: 'reviewPhase',
              currentCard: message.card,
              readyToNegotiate: [], // Reset ready set
            },
          };
        });
        break;

      // FR-019: Player marked ready to negotiate
      case 'playerReadyToNegotiate':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              readyToNegotiate: message.readyPlayers,
            },
          };
        });
        break;

      // FR-019: Negotiation phase started
      case 'negotiationPhaseStarted':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'deliberating',
              subPhase: 'negotiationPhase',
              timerStartedAt: message.timerStartedAt,
              recommendedDuration: message.recommendedDuration,
              timerEndAt: message.timerStartedAt + (message.recommendedDuration * 1000),
            },
          };
        });
        break;

      // FR-019: Review phase started
      case 'reviewPhaseStarted':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'reviewing',
              subPhase: 'reviewPhase',
              readyToNegotiate: [],
            },
          };
        });
        break;

      case 'deliberationStarted':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              timerEndAt: message.endsAt,
            },
          };
        });
        break;

      case 'optionProposed':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'voting',
              currentProposal: message.optionId,
            },
          };
        });
        break;

      case 'votingStarted':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'voting',
            },
          };
        });
        break;

      case 'votesRevealed':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'revealing',
            },
          };
        });
        break;

      case 'turnResolved':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'resolving',
              nation: {
                stability: message.nationChanges.newStability,
                budget: message.nationChanges.newBudget,
              },
              players: prev.roomState.players.map(p => {
                const movement = message.movements.find(m => m.playerId === p.id);
                if (movement) {
                  return { ...p, position: movement.newPosition };
                }
                return p;
              }),
            },
          };
        });
        break;

      case 'tokenGiven':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              tokens: prev.roomState.tokens.map(t =>
                t.id === message.tokenId
                  ? { ...t, heldById: message.toPlayerId }
                  : t
              ),
            },
          };
        });
        break;

      case 'gameEndedVictory':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              status: 'finished',
            },
          };
        });
        break;

      case 'gameEndedCollapse':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              status: 'collapsed',
            },
          };
        });
        break;

      case 'error':
        setState(prev => ({
          ...prev,
          error: message.message,
        }));
        break;

      case 'turnResultsDisplay':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              phase: 'showingResults',
              pendingAcknowledgments: message.pendingAcknowledgments,
              resultsTimeoutAt: message.timeoutAt,
            },
            turnResultsData: message,
            hasAcknowledgedResults: false,
          };
        });
        break;

      case 'turnResultsAcknowledged':
        setState(prev => {
          if (!prev.roomState) return prev;
          const isLocalAck = message.playerId === prev.localPlayerId;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              pendingAcknowledgments: message.pendingAcknowledgments,
            },
            turnResultsData: prev.turnResultsData
              ? { ...prev.turnResultsData, pendingAcknowledgments: message.pendingAcknowledgments }
              : null,
            hasAcknowledgedResults: isLocalAck ? true : prev.hasAcknowledgedResults,
          };
        });
        break;

      case 'turnResultsComplete':
        setState(prev => {
          if (!prev.roomState) return prev;
          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              pendingAcknowledgments: [],
              resultsTimeoutAt: null,
            },
            turnResultsData: null,
            hasAcknowledgedResults: false,
          };
        });
        break;

      case 'playerAfk':
        setState(prev => {
          if (!prev.roomState) return prev;
          const newAfkPlayers = new Set(prev.afkPlayers);
          newAfkPlayers.add(message.playerId);

          // Update player influence
          const updatedPlayers = prev.roomState.players.map(p =>
            p.id === message.playerId
              ? { ...p, influence: message.newInfluence }
              : p
          );

          return {
            ...prev,
            roomState: {
              ...prev.roomState,
              players: updatedPlayers,
            },
            afkPlayers: newAfkPlayers,
          };
        });
        break;

      case 'playerActive':
        setState(prev => {
          const newAfkPlayers = new Set(prev.afkPlayers);
          newAfkPlayers.delete(message.playerId);
          return {
            ...prev,
            afkPlayers: newAfkPlayers,
          };
        });
        break;

      // T043: Handle deal breach events for animation
      case 'dealBreach':
        setState(prev => {
          if (!prev.roomState) return prev;
          const breaker = prev.roomState.players.find(p => p.id === message.breakerId);
          const victim = prev.roomState.players.find(p => p.id === message.victimId);
          return {
            ...prev,
            dealBreachData: {
              breakerId: message.breakerId,
              breakerName: breaker?.name || 'Unknown',
              victimId: message.victimId,
              victimName: victim?.name || 'Unknown',
              influenceLoss: message.influenceLoss,
              influenceGain: message.influenceGain,
            },
          };
        });
        break;

      // T044b: Handle crisis resolution events for animation
      case 'crisisResolved':
        setState(prev => {
          if (!prev.roomState?.activeCrisis) return prev;
          const totalContribution = message.contributions.reduce((sum, c) => sum + c.amount, 0);
          return {
            ...prev,
            crisisResolutionData: {
              crisis: prev.roomState.activeCrisis.crisis,
              outcome: message.outcome,
              contributions: message.contributions,
              nationChanges: {
                budgetChange: message.nationChanges.budgetChange,
                stabilityChange: message.nationChanges.stabilityChange,
              },
              totalContribution,
            },
          };
        });
        break;
    }
  }, []);

  // ============================================
  // Actions
  // ============================================

  const sendMessage = useCallback((message: ClientMessage) => {
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  const actions: GameActions = {
    joinRoom: useCallback((playerId: string, playerName: string) => {
      localPlayerIdRef.current = playerId;
      setState(prev => ({ ...prev, localPlayerId: playerId }));
      sendMessage({
        type: 'join',
        playerId,
        playerName,
        roomId,
      });
    }, [roomId, sendMessage]),

    selectIdeology: useCallback((ideology: Ideology) => {
      if (!localPlayerIdRef.current) return;
      sendMessage({
        type: 'selectIdeology',
        playerId: localPlayerIdRef.current,
        ideology,
      });
    }, [sendMessage]),

    startGame: useCallback(() => {
      if (!localPlayerIdRef.current) return;
      sendMessage({
        type: 'startGame',
        playerId: localPlayerIdRef.current,
      });
    }, [sendMessage]),

    rollDice: useCallback(() => {
      if (!localPlayerIdRef.current) return;
      sendMessage({
        type: 'rollDice',
        playerId: localPlayerIdRef.current,
      });
    }, [sendMessage]),

    proposeOption: useCallback((optionId: CardOptionId) => {
      if (!localPlayerIdRef.current) return;
      sendMessage({
        type: 'proposeOption',
        playerId: localPlayerIdRef.current,
        optionId,
      });
    }, [sendMessage]),

    castVote: useCallback((choice: VoteChoice, influenceSpent: number = 0) => {
      if (!localPlayerIdRef.current) return;
      sendMessage({
        type: 'castVote',
        playerId: localPlayerIdRef.current,
        choice,
        influenceSpent,
      });
    }, [sendMessage]),

    giveToken: useCallback((targetPlayerId: string) => {
      if (!localPlayerIdRef.current) return;
      sendMessage({
        type: 'giveToken',
        playerId: localPlayerIdRef.current,
        targetPlayerId,
      });
    }, [sendMessage]),

    sendChat: useCallback((text: string) => {
      if (!localPlayerIdRef.current) return;
      sendMessage({
        type: 'chat',
        playerId: localPlayerIdRef.current,
        text,
      });
    }, [sendMessage]),

    leaveRoom: useCallback(() => {
      if (!localPlayerIdRef.current) return;
      sendMessage({
        type: 'leave',
        playerId: localPlayerIdRef.current,
      });
    }, [sendMessage]),

    acknowledgeTurnResults: useCallback(() => {
      if (!localPlayerIdRef.current) return;
      // Get current turn from state
      const currentTurn = state.roomState?.currentTurn || 0;
      sendMessage({
        type: 'acknowledgeTurnResults',
        playerId: localPlayerIdRef.current,
        turnNumber: currentTurn,
      });
      // Optimistically mark as acknowledged
      setState(prev => ({ ...prev, hasAcknowledgedResults: true }));
    }, [sendMessage, state.roomState?.currentTurn]),

    markReadyToNegotiate: useCallback(() => {
      if (!localPlayerIdRef.current) return;
      sendMessage({
        type: 'readyToNegotiate',
        playerId: localPlayerIdRef.current,
      });
    }, [sendMessage]),

    // T043: Clear deal breach data after animation completes
    clearDealBreach: useCallback(() => {
      setState(prev => ({ ...prev, dealBreachData: null }));
    }, []),

    // T044b: Clear crisis resolution data after animation completes
    clearCrisisResolution: useCallback(() => {
      setState(prev => ({ ...prev, crisisResolutionData: null }));
    }, []),
  };

  return [state, actions];
}

// ============================================
// Derived State Helpers
// ============================================

export function getLocalPlayer(
  state: GameState
): PlayerStatePayload | null {
  if (!state.roomState || !state.localPlayerId) return null;
  return state.roomState.players.find(p => p.id === state.localPlayerId) || null;
}

export function isLocalPlayerTurn(state: GameState): boolean {
  if (!state.roomState || !state.localPlayerId) return false;
  return state.roomState.activePlayerId === state.localPlayerId;
}

export function isLocalPlayerHost(state: GameState): boolean {
  if (!state.roomState || !state.localPlayerId) return false;
  return state.roomState.hostPlayerId === state.localPlayerId;
}
