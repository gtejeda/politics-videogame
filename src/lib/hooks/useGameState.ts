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
} from '../game/events';
import type { Ideology, CardOptionId, VoteChoice } from '../game/types';

// ============================================
// Hook State Types
// ============================================

export interface GameState {
  connected: boolean;
  roomState: RoomStatePayload | null;
  error: string | null;
  localPlayerId: string | null;
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
              phase: 'deliberating',
              currentCard: message.card,
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
