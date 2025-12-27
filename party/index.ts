/**
 * PartyKit Server Entry Point
 * Handles WebSocket connections and message routing
 */

import type { Party, Connection, Server } from 'partykit/server';
import type {
  ClientMessage,
  ServerMessage,
  RoomStateSyncMessage,
  PlayerJoinedMessage,
  PlayerLeftMessage,
  IdeologySelectedMessage,
  GameStartedMessage,
  DiceRolledMessage,
  CardDrawnMessage,
  DeliberationStartedMessage,
  OptionProposedMessage,
  VotingStartedMessage,
  PlayerVotedMessage,
  VotesRevealedMessage,
  TurnResolvedMessage,
  TokenGivenMessage,
  ChatBroadcastMessage,
  ErrorMessage,
  GameEndedVictoryMessage,
  GameEndedCollapseMessage,
} from '../src/lib/game/events';
import type { Vote, Ideology, CardOptionId, DecisionCard } from '../src/lib/game/types';
import {
  GameRoomState,
  createInitialRoomState,
  addPlayerToRoom,
  removePlayerFromRoom,
  selectIdeology,
  startGame,
  performDiceRoll,
  setCurrentCard,
  proposeOption,
  castVote,
  resolveVotes,
  advanceToNextTurn,
  giveToken,
  serializeRoomState,
} from '../src/lib/party/game-room';
import { getMostAdvancedZone } from '../src/lib/game/rules';

// Sample cards for early development
import { SAMPLE_EARLY_TERM_CARDS } from '../src/lib/game/cards/early-term';

export default class GameParty implements Server {
  readonly room: Party;
  state: GameRoomState | null = null;
  connections: Map<string, Connection> = new Map();
  playerConnections: Map<string, string> = new Map(); // playerId -> connectionId

  constructor(room: Party) {
    this.room = room;
  }

  // ============================================
  // Connection Lifecycle
  // ============================================

  onConnect(conn: Connection): void {
    this.connections.set(conn.id, conn);
    console.log(`Connection established: ${conn.id}`);
  }

  onClose(conn: Connection): void {
    this.connections.delete(conn.id);

    // Find player associated with this connection
    for (const [playerId, connId] of this.playerConnections) {
      if (connId === conn.id) {
        this.handlePlayerDisconnect(playerId);
        this.playerConnections.delete(playerId);
        break;
      }
    }

    console.log(`Connection closed: ${conn.id}`);
  }

  onError(conn: Connection, error: Error): void {
    console.error(`Connection error for ${conn.id}:`, error);
  }

  // ============================================
  // Message Handling
  // ============================================

  onMessage(message: string, sender: Connection): void {
    try {
      const data = JSON.parse(message) as ClientMessage;
      this.handleMessage(data, sender);
    } catch (error) {
      console.error('Failed to parse message:', error);
      this.sendError(sender, 'INVALID_MESSAGE', 'Failed to parse message');
    }
  }

  handleMessage(message: ClientMessage, sender: Connection): void {
    switch (message.type) {
      case 'join':
        this.handleJoin(message.playerId, message.playerName, sender);
        break;
      case 'selectIdeology':
        this.handleSelectIdeology(message.playerId, message.ideology);
        break;
      case 'startGame':
        this.handleStartGame(message.playerId);
        break;
      case 'rollDice':
        this.handleRollDice(message.playerId);
        break;
      case 'proposeOption':
        this.handleProposeOption(message.playerId, message.optionId);
        break;
      case 'castVote':
        this.handleCastVote(message.playerId, message.choice, message.influenceSpent);
        break;
      case 'giveToken':
        this.handleGiveToken(message.playerId, message.targetPlayerId);
        break;
      case 'leave':
        this.handleLeave(message.playerId);
        break;
      case 'chat':
        this.handleChat(message.playerId, message.text);
        break;
      default:
        console.warn('Unknown message type:', (message as any).type);
    }
  }

  // ============================================
  // Message Handlers
  // ============================================

  handleJoin(playerId: string, playerName: string, conn: Connection): void {
    // Initialize room state if needed
    if (!this.state) {
      this.state = createInitialRoomState(this.room.id, playerId);
    }

    // Add player to room
    const result = addPlayerToRoom(this.state, playerId, playerName);

    if ('error' in result) {
      this.sendError(conn, 'JOIN_FAILED', result.error);
      return;
    }

    this.state = result.state;
    this.playerConnections.set(playerId, conn.id);

    // Send full state to joining player
    const syncMessage: RoomStateSyncMessage = {
      type: 'roomStateSync',
      room: serializeRoomState(this.state),
    };
    this.send(conn, syncMessage);

    // Broadcast player joined to others
    const joinedMessage: PlayerJoinedMessage = {
      type: 'playerJoined',
      player: {
        id: result.player.id,
        name: result.player.name,
        ideology: result.player.ideology,
        position: result.player.position,
        influence: result.player.influence,
        ownTokens: result.player.ownTokens,
        isConnected: result.player.isConnected,
        isHost: result.player.isHost,
      },
    };
    this.broadcastExcept(conn.id, joinedMessage);
  }

  handleSelectIdeology(playerId: string, ideology: Ideology): void {
    if (!this.state) return;

    const result = selectIdeology(this.state, playerId, ideology);

    if ('error' in result) {
      const conn = this.getConnectionForPlayer(playerId);
      if (conn) this.sendError(conn, 'IDEOLOGY_FAILED', result.error);
      return;
    }

    this.state = result;

    // Broadcast ideology selection
    const message: IdeologySelectedMessage = {
      type: 'ideologySelected',
      playerId,
      ideology,
    };
    this.broadcast(message);
  }

  handleStartGame(playerId: string): void {
    if (!this.state) return;

    const result = startGame(this.state, playerId);

    if ('error' in result) {
      const conn = this.getConnectionForPlayer(playerId);
      if (conn) this.sendError(conn, 'START_FAILED', result.error);
      return;
    }

    this.state = result;

    // Broadcast game started
    const message: GameStartedMessage = {
      type: 'gameStarted',
      firstPlayerId: result.activePlayerId!,
    };
    this.broadcast(message);
  }

  handleRollDice(playerId: string): void {
    if (!this.state) return;

    const result = performDiceRoll(this.state, playerId);

    if ('error' in result) {
      const conn = this.getConnectionForPlayer(playerId);
      if (conn) this.sendError(conn, 'ROLL_FAILED', result.error);
      return;
    }

    this.state = result.state;

    // Broadcast dice roll
    const diceMessage: DiceRolledMessage = {
      type: 'diceRolled',
      playerId,
      roll: result.roll,
      modifiedRoll: result.modifiedRoll,
    };
    this.broadcast(diceMessage);

    // Draw a card
    this.drawCard();
  }

  drawCard(): void {
    if (!this.state) return;

    // Get zone based on player positions
    const players = Array.from(this.state.players.values());
    const zone = getMostAdvancedZone(players);

    // For now, just use sample cards (early term)
    const cards = SAMPLE_EARLY_TERM_CARDS;
    const randomIndex = Math.floor(Math.random() * cards.length);
    const card = cards[randomIndex];

    this.state = setCurrentCard(this.state, card);

    // Broadcast card drawn
    const cardMessage: CardDrawnMessage = {
      type: 'cardDrawn',
      card,
    };
    this.broadcast(cardMessage);

    // Broadcast deliberation started
    const deliberationMessage: DeliberationStartedMessage = {
      type: 'deliberationStarted',
      endsAt: this.state.timerEndAt!,
    };
    this.broadcast(deliberationMessage);
  }

  handleProposeOption(playerId: string, optionId: CardOptionId): void {
    if (!this.state) return;

    const result = proposeOption(this.state, playerId, optionId);

    if ('error' in result) {
      const conn = this.getConnectionForPlayer(playerId);
      if (conn) this.sendError(conn, 'PROPOSE_FAILED', result.error);
      return;
    }

    this.state = result;

    // Broadcast option proposed
    const proposeMessage: OptionProposedMessage = {
      type: 'optionProposed',
      playerId,
      optionId,
    };
    this.broadcast(proposeMessage);

    // Broadcast voting started
    const votingMessage: VotingStartedMessage = {
      type: 'votingStarted',
    };
    this.broadcast(votingMessage);
  }

  handleCastVote(playerId: string, choice: Vote['choice'], influenceSpent: number): void {
    if (!this.state) return;

    const vote: Vote = {
      playerId,
      choice,
      influenceSpent,
      timestamp: Date.now(),
    };

    const result = castVote(this.state, vote);

    if ('error' in result) {
      const conn = this.getConnectionForPlayer(playerId);
      if (conn) this.sendError(conn, 'VOTE_FAILED', result.error);
      return;
    }

    this.state = result.state;

    // Broadcast that player voted (but not their choice)
    const votedMessage: PlayerVotedMessage = {
      type: 'playerVoted',
      playerId,
    };
    this.broadcast(votedMessage);

    // If all votes cast, reveal and resolve
    if (result.allVoted) {
      this.revealAndResolveVotes();
    }
  }

  revealAndResolveVotes(): void {
    if (!this.state) return;

    const resolution = resolveVotes(this.state);
    this.state = resolution.state;

    // Broadcast vote reveal
    const revealMessage: VotesRevealedMessage = {
      type: 'votesRevealed',
      votes: resolution.voteResult.votes,
      totalYes: resolution.voteResult.totalYes,
      totalNo: resolution.voteResult.totalNo,
      passed: resolution.voteResult.passed,
    };
    this.broadcast(revealMessage);

    // Broadcast turn resolution
    const resolvedMessage: TurnResolvedMessage = {
      type: 'turnResolved',
      nationChanges: resolution.nationChanges,
      movements: resolution.movements,
      influenceChanges: [], // Simplified for now
    };
    this.broadcast(resolvedMessage);

    // Advance to next turn (after short delay for animations)
    setTimeout(() => this.handleNextTurn(), 2000);
  }

  handleNextTurn(): void {
    if (!this.state) return;

    const result = advanceToNextTurn(this.state);

    if ('collapsed' in result) {
      this.state = { ...this.state, status: 'collapsed' };
      const collapseMessage: GameEndedCollapseMessage = {
        type: 'gameEndedCollapse',
        reason: result.reason,
        finalState: this.state.nation,
        debrief: {
          whatHappened: `The nation collapsed due to ${result.reason === 'stability' ? 'political instability' : 'budget crisis'}.`,
          realWorldParallel: 'Similar situations have occurred in history when governments failed to maintain basic functions.',
          lesson: 'Effective governance requires balancing competing priorities while maintaining essential stability.',
          keyDecisions: [],
        },
      };
      this.broadcast(collapseMessage);
      return;
    }

    if ('winner' in result) {
      this.state = { ...this.state, status: 'finished' };
      const winner = this.state.players.get(result.winner)!;
      const victoryMessage: GameEndedVictoryMessage = {
        type: 'gameEndedVictory',
        winnerId: result.winner,
        winnerName: winner.name,
        finalPositions: Array.from(this.state.players.values()).map(p => ({
          playerId: p.id,
          position: p.position,
          influence: p.influence,
        })),
        conceptsSummary: [],
      };
      this.broadcast(victoryMessage);
      return;
    }

    this.state = result;

    // Broadcast turn started for next player
    const turnMessage = {
      type: 'turnStarted' as const,
      turnNumber: this.state.currentTurn,
      activePlayerId: this.state.activePlayerId!,
    };
    this.broadcast(turnMessage);
  }

  handleGiveToken(playerId: string, targetPlayerId: string): void {
    if (!this.state) return;

    const result = giveToken(this.state, playerId, targetPlayerId);

    if ('error' in result) {
      const conn = this.getConnectionForPlayer(playerId);
      if (conn) this.sendError(conn, 'TOKEN_FAILED', result.error);
      return;
    }

    this.state = result;

    // Find the token that was transferred
    const token = result.tokens.find(
      t => t.ownerId === playerId && t.heldById === targetPlayerId && t.status === 'active'
    );

    if (token) {
      const tokenMessage: TokenGivenMessage = {
        type: 'tokenGiven',
        fromPlayerId: playerId,
        toPlayerId: targetPlayerId,
        tokenId: token.id,
      };
      this.broadcast(tokenMessage);
    }
  }

  handleLeave(playerId: string): void {
    this.handlePlayerDisconnect(playerId);
  }

  handlePlayerDisconnect(playerId: string): void {
    if (!this.state) return;

    this.state = removePlayerFromRoom(this.state, playerId);

    const leftMessage: PlayerLeftMessage = {
      type: 'playerLeft',
      playerId,
    };
    this.broadcast(leftMessage);
  }

  handleChat(playerId: string, text: string): void {
    if (!this.state) return;

    const player = this.state.players.get(playerId);
    if (!player) return;

    const chatMessage: ChatBroadcastMessage = {
      type: 'chatBroadcast',
      playerId,
      playerName: player.name,
      text,
      timestamp: Date.now(),
    };
    this.broadcast(chatMessage);
  }

  // ============================================
  // Utility Methods
  // ============================================

  getConnectionForPlayer(playerId: string): Connection | undefined {
    const connId = this.playerConnections.get(playerId);
    if (!connId) return undefined;
    return this.connections.get(connId);
  }

  send(conn: Connection, message: ServerMessage): void {
    conn.send(JSON.stringify(message));
  }

  sendError(conn: Connection, code: string, message: string): void {
    const errorMessage: ErrorMessage = {
      type: 'error',
      code,
      message,
    };
    this.send(conn, errorMessage);
  }

  broadcast(message: ServerMessage): void {
    const data = JSON.stringify(message);
    for (const conn of this.connections.values()) {
      conn.send(data);
    }
  }

  broadcastExcept(excludeConnId: string, message: ServerMessage): void {
    const data = JSON.stringify(message);
    for (const [connId, conn] of this.connections) {
      if (connId !== excludeConnId) {
        conn.send(data);
      }
    }
  }
}
