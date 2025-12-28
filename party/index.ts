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
  TurnResultsDisplayMessage,
  TurnResultsAcknowledgedMessage,
  TurnResultsCompleteMessage,
  TokenGivenMessage,
  DealResolvedMessage,
  ChatBroadcastMessage,
  ErrorMessage,
  GameEndedVictoryMessage,
  GameEndedCollapseMessage,
  CrisisTriggeredMessage,
  CrisisContributionMessage,
  CrisisResolvedMessage,
  PlayerAfkMessage,
  PlayerActiveMessage,
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
  resolveDeals,
  advanceToNextTurn,
  giveToken,
  serializeRoomState,
  checkAndTriggerCrisis,
  contributeToCrisis,
  resolveCrisisEvent,
  advanceCrisisTurn,
  enterShowingResultsPhase,
  acknowledgeTurnResults,
  clearShowingResultsState,
  recordPlayerActivity,
  checkAfkPlayers,
  skipAfkPlayerTurn,
  isActivePlayerAfk,
} from '../src/lib/party/game-room';
import { AFK_SETTINGS } from '../src/lib/game/constants';
import { calculateTotalContribution } from '../src/lib/game/crises';
import { getMostAdvancedZone } from '../src/lib/game/rules';

// Card decks with zone-based selection
import { drawCardFromZone } from '../src/lib/game/cards';

export default class GameParty implements Server {
  readonly room: Party;
  state: GameRoomState | null = null;
  connections: Map<string, Connection> = new Map();
  playerConnections: Map<string, string> = new Map(); // playerId -> connectionId

  // Timers
  private resultsTimeout: ReturnType<typeof setTimeout> | null = null;
  private afkCheckInterval: ReturnType<typeof setInterval> | null = null;
  private roomCreatedAt: number = Date.now();
  private roomCleanupTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(room: Party) {
    this.room = room;
    // Start AFK check interval (runs every 10 seconds)
    this.startAfkCheckInterval();
    // Start room cleanup timer (2 hours)
    this.startRoomCleanupTimer();
  }

  private startRoomCleanupTimer(): void {
    // Room auto-cleanup after 2 hours (per TIMING.ROOM_CLEANUP_HOURS)
    const cleanupMs = 2 * 60 * 60 * 1000; // 2 hours in ms
    this.roomCleanupTimeout = setTimeout(() => {
      this.cleanupRoom();
    }, cleanupMs);
  }

  private cleanupRoom(): void {
    console.log(`Room ${this.room.id} cleaning up after 2 hours of inactivity`);

    // Notify all connected players
    const cleanupMessage = {
      type: 'error' as const,
      code: 'ROOM_EXPIRED',
      message: 'This room has expired due to inactivity. Please create a new game.',
    };

    for (const conn of this.connections.values()) {
      conn.send(JSON.stringify(cleanupMessage));
      conn.close();
    }

    // Clear all state
    this.state = null;
    this.connections.clear();
    this.playerConnections.clear();
    this.stopAfkCheckInterval();

    if (this.resultsTimeout) {
      clearTimeout(this.resultsTimeout);
      this.resultsTimeout = null;
    }
  }

  private startAfkCheckInterval(): void {
    if (this.afkCheckInterval) {
      clearInterval(this.afkCheckInterval);
    }
    this.afkCheckInterval = setInterval(() => this.checkForAfkPlayers(), 10000);
  }

  private stopAfkCheckInterval(): void {
    if (this.afkCheckInterval) {
      clearInterval(this.afkCheckInterval);
      this.afkCheckInterval = null;
    }
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
    // Record activity for most message types (player is active)
    if ('playerId' in message && message.type !== 'leave') {
      this.recordActivity(message.playerId);
    }

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
      case 'contributeToCrisis':
        this.handleContributeToCrisis(message.playerId, message.amount);
        break;
      case 'acknowledgeTurnResults':
        this.handleAcknowledgeTurnResults(message.playerId, message.turnNumber);
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

    // Draw a card from the appropriate zone deck
    const card = drawCardFromZone(zone);

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

    // Resolve deals (check for broken tokens)
    const activePlayerId = this.state.activePlayerId;
    let dealResolutions: Array<{ tokenId: string; ownerId: string; holderId: string; status: 'honored' | 'broken' }> = [];

    if (activePlayerId) {
      const dealsResult = resolveDeals(
        this.state,
        this.state.pendingVotes,
        activePlayerId,
        resolution.voteResult.passed
      );
      this.state = dealsResult.state;
      dealResolutions = dealsResult.resolutions;

      // Broadcast deal resolutions
      for (const deal of dealResolutions) {
        const dealMessage: DealResolvedMessage = {
          type: 'dealResolved',
          tokenId: deal.tokenId,
          status: deal.status,
          ownerId: deal.ownerId,
          holderId: deal.holderId,
        };
        this.broadcast(dealMessage);
      }
    }

    // Broadcast vote reveal
    const revealMessage: VotesRevealedMessage = {
      type: 'votesRevealed',
      votes: resolution.voteResult.votes,
      totalYes: resolution.voteResult.totalYes,
      totalNo: resolution.voteResult.totalNo,
      passed: resolution.voteResult.passed,
    };
    this.broadcast(revealMessage);

    // Calculate influence changes from deals
    const influenceChanges: Array<{ playerId: string; change: number; reason: string }> = [];
    for (const deal of dealResolutions) {
      if (deal.status === 'broken') {
        influenceChanges.push({
          playerId: deal.holderId,
          change: -1,
          reason: 'Broke deal with ' + (this.state.players.get(deal.ownerId)?.name || 'player'),
        });
        influenceChanges.push({
          playerId: deal.ownerId,
          change: 1,
          reason: 'Deal broken by ' + (this.state.players.get(deal.holderId)?.name || 'player'),
        });
      }
    }

    // Broadcast turn resolution
    const resolvedMessage: TurnResolvedMessage = {
      type: 'turnResolved',
      nationChanges: resolution.nationChanges,
      movements: resolution.movements,
      influenceChanges,
    };
    this.broadcast(resolvedMessage);

    // Enter showingResults phase
    this.state = enterShowingResultsPhase(this.state);

    // Build player effects for the Turn Results display
    const playerEffects = Array.from(this.state.players.values()).map(player => {
      const movement = resolution.movements.find(m => m.playerId === player.id);
      const isActive = player.id === activePlayerId;
      const vote = this.state!.pendingVotes.get(player.id);

      // Find token effects for this player
      const tokenEffects = dealResolutions
        .filter(d => d.ownerId === player.id || d.holderId === player.id)
        .map(d => ({
          tokenId: d.tokenId,
          effect: d.status,
          otherPlayerId: d.ownerId === player.id ? d.holderId : d.ownerId,
        }));

      // Calculate influence change from deals
      const influenceChange = influenceChanges
        .filter(ic => ic.playerId === player.id)
        .reduce((sum, ic) => sum + ic.change, 0);

      const influenceReason = influenceChanges
        .filter(ic => ic.playerId === player.id)
        .map(ic => ic.reason)
        .join(', ') || null;

      // Movement breakdown
      const option = this.state!.currentCard?.options.find(o => o.id === this.state!.currentProposal);
      let ideologyBonus = 0;
      let ideologyPenalty = 0;
      const nationModifier = 0;
      const influenceModifier = 0;

      if (option && resolution.voteResult.passed && player.ideology) {
        // Check aligned
        const aligned = option.aligned.find(a => a.ideology === player.ideology);
        if (aligned) ideologyBonus = aligned.movement;

        // Check opposed
        const opposed = option.opposed.find(o => o.ideology === player.ideology);
        if (opposed) ideologyPenalty = -opposed.movement;
      }

      return {
        playerId: player.id,
        playerName: player.name,
        movementBreakdown: {
          diceRoll: isActive ? (this.state!.modifiedDiceRoll || 0) : null,
          ideologyBonus,
          ideologyPenalty,
          nationModifier,
          influenceModifier,
          total: movement?.newPosition !== undefined
            ? movement.newPosition - (movement.oldPosition || 0)
            : 0,
        },
        influenceChange,
        influenceReason,
        tokenEffects,
      };
    });

    // Build vote results for display
    const voteResultsDisplay = {
      yesVotes: resolution.voteResult.totalYes,
      noVotes: resolution.voteResult.totalNo,
      abstainCount: resolution.voteResult.votes.filter(v => v.choice === 'abstain').length,
      votes: resolution.voteResult.votes.map(v => ({
        playerId: v.playerId,
        playerName: this.state!.players.get(v.playerId)?.name || 'Unknown',
        choice: v.choice,
        weight: v.totalWeight,
      })),
    };

    // Send Turn Results Display message
    const turnResultsMessage: TurnResultsDisplayMessage = {
      type: 'turnResultsDisplay',
      turnNumber: this.state.currentTurn,
      votePassed: resolution.voteResult.passed,
      voteResults: voteResultsDisplay,
      nationChanges: resolution.nationChanges,
      playerEffects,
      pendingAcknowledgments: Array.from(this.state.pendingAcknowledgments),
      timeoutAt: this.state.resultsTimeoutAt!,
    };
    this.broadcast(turnResultsMessage);

    // Set timeout for auto-acknowledge
    this.resultsTimeout = setTimeout(() => this.autoAcknowledgeAll(), 30000);
  }

  handleNextTurn(): void {
    if (!this.state) return;

    // First, check if there's an active crisis that needs to be advanced/resolved
    if (this.state.activeCrisis) {
      const crisisAdvance = advanceCrisisTurn(this.state);
      this.state = crisisAdvance.state;

      if (crisisAdvance.shouldResolve) {
        this.resolveCrisis();
        return;
      }
    }

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

    // Check if a crisis should trigger based on nation state
    const crisisCheck = checkAndTriggerCrisis(this.state);
    if (crisisCheck.triggered) {
      this.state = crisisCheck.state;

      // Broadcast crisis triggered
      const crisisMessage: CrisisTriggeredMessage = {
        type: 'crisisTriggered',
        crisis: {
          id: crisisCheck.triggered.id,
          name: crisisCheck.triggered.name,
          description: crisisCheck.triggered.description,
          severity: crisisCheck.triggered.severity,
          contributionThreshold: crisisCheck.triggered.contributionThreshold,
          maxContributionPerPlayer: crisisCheck.triggered.maxContributionPerPlayer,
          historicalNote: crisisCheck.triggered.historicalNote,
          ideologyBonuses: crisisCheck.triggered.ideologyBonuses,
        },
        turnsRemaining: 2,
      };
      this.broadcast(crisisMessage);
      return; // Stay in crisis phase
    }

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

  handleContributeToCrisis(playerId: string, amount: number): void {
    if (!this.state) return;

    const result = contributeToCrisis(this.state, playerId, amount);

    if ('error' in result) {
      const conn = this.getConnectionForPlayer(playerId);
      if (conn) this.sendError(conn, 'CRISIS_CONTRIBUTION_FAILED', result.error);
      return;
    }

    this.state = result;

    // Calculate total contribution
    const totalContribution = calculateTotalContribution(
      this.state.activeCrisis!.contributions,
      this.state.players,
      this.state.activeCrisis!.crisis
    );

    // Broadcast the contribution
    const contributionMessage: CrisisContributionMessage = {
      type: 'crisisContribution',
      playerId,
      amount,
      totalContribution,
      contributionThreshold: this.state.activeCrisis!.crisis.contributionThreshold,
    };
    this.broadcast(contributionMessage);

    // Check if threshold is met - auto-resolve if so
    if (totalContribution >= this.state.activeCrisis!.crisis.contributionThreshold) {
      // Short delay then resolve
      setTimeout(() => this.resolveCrisis(), 1000);
    }
  }

  resolveCrisis(): void {
    if (!this.state || !this.state.activeCrisis) return;

    const result = resolveCrisisEvent(this.state);

    if ('error' in result) {
      console.error('Crisis resolution failed:', result.error);
      return;
    }

    const { crisis, contributions } = this.state.activeCrisis;
    this.state = result.state;

    // Broadcast crisis resolved
    const resolvedMessage: CrisisResolvedMessage = {
      type: 'crisisResolved',
      crisisId: crisis.id,
      crisisName: crisis.name,
      outcome: result.outcome,
      message: result.outcome === 'success'
        ? crisis.successEffect.message
        : crisis.failureEffect.message,
      nationChanges: {
        budgetChange: result.nationChanges.budgetChange,
        stabilityChange: result.nationChanges.stabilityChange,
        newBudget: this.state.nation.budget,
        newStability: this.state.nation.stability,
      },
      contributions: Array.from(contributions.entries()).map(([playerId, amount]) => ({
        playerId,
        amount,
      })),
    };
    this.broadcast(resolvedMessage);

    // Check for collapse after crisis resolution
    if (this.state.nation.stability <= 0 || this.state.nation.budget <= -5) {
      const reason = this.state.nation.stability <= 0 ? 'stability' : 'budget';
      this.state = { ...this.state, status: 'collapsed' };
      const collapseMessage: GameEndedCollapseMessage = {
        type: 'gameEndedCollapse',
        reason,
        finalState: this.state.nation,
        debrief: {
          whatHappened: `The nation collapsed due to ${reason === 'stability' ? 'political instability' : 'budget crisis'} following an unresolved crisis.`,
          realWorldParallel: 'Similar situations have occurred in history when governments failed to manage crisis situations effectively.',
          lesson: 'Effective crisis management requires coordination and shared sacrifice.',
          keyDecisions: [],
        },
      };
      this.broadcast(collapseMessage);
      return;
    }

    // Continue to next turn
    setTimeout(() => {
      const turnMessage = {
        type: 'turnStarted' as const,
        turnNumber: this.state!.currentTurn,
        activePlayerId: this.state!.activePlayerId!,
      };
      this.broadcast(turnMessage);
    }, 2000);
  }

  // ============================================
  // Turn Results Acknowledgment
  // ============================================

  handleAcknowledgeTurnResults(playerId: string, turnNumber: number): void {
    if (!this.state) return;

    // Verify we're in the right phase and turn
    if (this.state.phase !== 'showingResults' || this.state.currentTurn !== turnNumber) {
      const conn = this.getConnectionForPlayer(playerId);
      if (conn) this.sendError(conn, 'ACK_FAILED', 'Invalid acknowledgment');
      return;
    }

    const result = acknowledgeTurnResults(this.state, playerId);

    if ('error' in result) {
      const conn = this.getConnectionForPlayer(playerId);
      if (conn) this.sendError(conn, 'ACK_FAILED', result.error);
      return;
    }

    this.state = result.state;

    // Broadcast acknowledgment status
    const ackMessage: TurnResultsAcknowledgedMessage = {
      type: 'turnResultsAcknowledged',
      playerId,
      pendingAcknowledgments: Array.from(this.state.pendingAcknowledgments),
    };
    this.broadcast(ackMessage);

    // If all have acknowledged, advance to next turn
    if (result.allAcknowledged) {
      this.completeTurnResults();
    }
  }

  autoAcknowledgeAll(): void {
    if (!this.state || this.state.phase !== 'showingResults') return;

    // Auto-acknowledge all remaining players
    for (const playerId of this.state.pendingAcknowledgments) {
      this.state.pendingAcknowledgments.delete(playerId);
    }

    this.completeTurnResults();
  }

  completeTurnResults(): void {
    if (!this.state) return;

    // Clear the timeout
    if (this.resultsTimeout) {
      clearTimeout(this.resultsTimeout);
      this.resultsTimeout = null;
    }

    const turnNumber = this.state.currentTurn;

    // Clear showing results state
    this.state = clearShowingResultsState(this.state);

    // Broadcast completion
    const completeMessage: TurnResultsCompleteMessage = {
      type: 'turnResultsComplete',
      turnNumber,
    };
    this.broadcast(completeMessage);

    // Advance to next turn
    this.handleNextTurn();
  }

  // ============================================
  // AFK Handling
  // ============================================

  /**
   * Periodic check for AFK players
   * Applies penalties and skips turns as needed
   */
  checkForAfkPlayers(): void {
    if (!this.state || this.state.status !== 'playing') return;

    // Only check during active game phases (not during showingResults)
    if (this.state.phase === 'showingResults') return;

    const afkResult = checkAfkPlayers(this.state);
    this.state = afkResult.state;

    // Broadcast AFK notifications
    for (const afkPlayer of afkResult.newAfkPlayers) {
      const afkMessage: PlayerAfkMessage = {
        type: 'playerAfk',
        playerId: afkPlayer.playerId,
        playerName: afkPlayer.playerName,
        influenceLost: afkPlayer.influenceLost,
        newInfluence: afkPlayer.newInfluence,
        turnSkipped: this.state.activePlayerId === afkPlayer.playerId,
      };
      this.broadcast(afkMessage);

      // Skip turn if the AFK player is the active player
      if (this.state.activePlayerId === afkPlayer.playerId) {
        this.skipActivePlayerTurn();
      }
    }
  }

  /**
   * Skip the active player's turn due to AFK
   */
  skipActivePlayerTurn(): void {
    if (!this.state || !this.state.activePlayerId) return;

    const skippedPlayerId = this.state.activePlayerId;
    this.state = skipAfkPlayerTurn(this.state);

    // Broadcast turn started for next player
    const turnMessage = {
      type: 'turnStarted' as const,
      turnNumber: this.state.currentTurn,
      activePlayerId: this.state.activePlayerId!,
    };
    this.broadcast(turnMessage);

    console.log(`Skipped turn for AFK player: ${skippedPlayerId}`);
  }

  /**
   * Record activity for a player (call this on any meaningful action)
   */
  recordActivity(playerId: string): void {
    if (!this.state) return;

    const wasAfk = this.state.afkPlayers.has(playerId);
    this.state = recordPlayerActivity(this.state, playerId);

    // If player was AFK and is now active, notify
    if (wasAfk) {
      const activeMessage: PlayerActiveMessage = {
        type: 'playerActive',
        playerId,
      };
      this.broadcast(activeMessage);
    }
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
