'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NationTrack } from './NationTrack';
import { PlayerTrack } from './PlayerTrack';
import { BoardPath } from './BoardPath';
import { DecisionCard } from './DecisionCard';
import { VotingPanel } from './VotingPanel';
import { DiceRoll } from './DiceRoll';
import { Timer } from './Timer';
import type { RoomStatePayload } from '@/lib/game/events';
import type { GameActions } from '@/lib/hooks/useGameState';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface BoardProps {
  roomState: RoomStatePayload;
  localPlayerId: string | null;
  gameActions: GameActions;
}

export function Board({ roomState, localPlayerId, gameActions }: BoardProps) {
  const {
    phase,
    currentTurn,
    activePlayerId,
    currentCard,
    currentProposal,
    diceRoll,
    timerEndAt,
    players,
    nation,
    settings,
  } = roomState;

  const isMyTurn = activePlayerId === localPlayerId;
  const activePlayer = players.find(p => p.id === activePlayerId);
  const localPlayer = players.find(p => p.id === localPlayerId);

  // Get phase display text
  const phaseText = useMemo(() => {
    switch (phase) {
      case 'waiting':
        return isMyTurn ? 'Your Turn - Roll the Dice' : `${activePlayer?.name}'s Turn`;
      case 'rolling':
        return 'Rolling...';
      case 'drawing':
        return 'Drawing Card...';
      case 'deliberating':
        return 'Deliberation Phase';
      case 'proposing':
        return 'Choosing Proposal...';
      case 'voting':
        return 'Voting Phase';
      case 'revealing':
        return 'Revealing Votes...';
      case 'resolving':
        return 'Resolving Turn...';
      default:
        return '';
    }
  }, [phase, isMyTurn, activePlayer]);

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Turn {currentTurn}</h1>
            <p className="text-sm text-muted-foreground">{phaseText}</p>
          </div>
          {timerEndAt && phase === 'deliberating' && (
            <Timer endAt={timerEndAt} />
          )}
        </div>

        {/* Nation State */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Nation Status</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <NationTrack nation={nation} />
          </CardContent>
        </Card>

        {/* Board Path - Main Game Board */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Government Term Path</CardTitle>
          </CardHeader>
          <CardContent>
            <BoardPath
              players={players}
              pathLength={settings.pathLength}
              localPlayerId={localPlayerId}
            />
          </CardContent>
        </Card>

        {/* Main Game Area */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left: Player Tracks */}
          <Card className="lg:col-span-1">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Players</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {players.map(player => (
                <PlayerTrack
                  key={player.id}
                  player={player}
                  isActive={player.id === activePlayerId}
                  isLocal={player.id === localPlayerId}
                  pathLength={settings.pathLength}
                />
              ))}
            </CardContent>
          </Card>

          {/* Center/Right: Game Actions */}
          <div className="space-y-4 lg:col-span-2">
            {/* Dice Roll (waiting phase) */}
            {phase === 'waiting' && isMyTurn && (
              <DiceRoll onRoll={gameActions.rollDice} />
            )}

            {/* Dice Result (after roll) */}
            {diceRoll && phase !== 'waiting' && (
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Dice Roll: </span>
                <span className="text-2xl font-bold">{diceRoll}</span>
              </div>
            )}

            {/* Decision Card */}
            {currentCard && (
              <DecisionCard
                card={currentCard}
                selectedOption={currentProposal}
                canPropose={isMyTurn && (phase === 'deliberating' || phase === 'proposing')}
                localPlayerIdeology={localPlayer?.ideology || null}
                onPropose={gameActions.proposeOption}
              />
            )}

            {/* Voting Panel */}
            {(phase === 'voting' || phase === 'revealing') && currentProposal && (
              <VotingPanel
                phase={phase}
                currentProposal={currentProposal}
                card={currentCard}
                localPlayer={localPlayer}
                onVote={gameActions.castVote}
              />
            )}

            {/* Waiting message for non-active player */}
            {phase === 'waiting' && !isMyTurn && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Waiting for{' '}
                    <span className="font-medium text-foreground">
                      {activePlayer?.name}
                    </span>{' '}
                    to roll...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
