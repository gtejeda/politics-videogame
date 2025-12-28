'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import type { TurnResultsDisplayMessage, PlayerStatePayload } from '@/lib/game/events';
import type { VoteChoice, Ideology } from '@/lib/game/types';

interface TurnResultsProps {
  results: TurnResultsDisplayMessage;
  players: PlayerStatePayload[];
  localPlayerId: string | null;
  onAcknowledge: () => void;
  hasAcknowledged: boolean;
}

export function TurnResults({
  results,
  players,
  localPlayerId,
  onAcknowledge,
  hasAcknowledged,
}: TurnResultsProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(30);

  // Countdown timer
  useEffect(() => {
    const remaining = Math.max(0, Math.floor((results.timeoutAt - Date.now()) / 1000));
    setTimeRemaining(remaining);

    const interval = setInterval(() => {
      const newRemaining = Math.max(0, Math.floor((results.timeoutAt - Date.now()) / 1000));
      setTimeRemaining(newRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [results.timeoutAt]);

  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown';
  };

  const getPlayerIdeology = (playerId: string): Ideology | null => {
    return players.find(p => p.id === playerId)?.ideology || null;
  };

  const getVoteIcon = (choice: VoteChoice) => {
    switch (choice) {
      case 'yes': return '✓';
      case 'no': return '✗';
      case 'abstain': return '—';
    }
  };

  const getVoteColor = (choice: VoteChoice) => {
    switch (choice) {
      case 'yes': return 'text-green-600 dark:text-green-400';
      case 'no': return 'text-red-600 dark:text-red-400';
      case 'abstain': return 'text-gray-500';
    }
  };

  const acknowledgedPlayers = players.filter(
    p => !results.pendingAcknowledgments.includes(p.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-2">
          {/* Header */}
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">
              Turn {results.turnNumber} Results
            </CardTitle>
            <div className={cn(
              'text-3xl font-bold mt-2',
              results.votePassed ? 'text-green-600' : 'text-red-600'
            )}>
              {results.votePassed ? 'Vote Passed!' : 'Vote Failed!'}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Vote Tally */}
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold mb-3 text-center">Vote Results</h3>
              <div className="flex justify-center gap-8 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{results.voteResults.yesVotes}</div>
                  <div className="text-sm text-muted-foreground">Yes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{results.voteResults.noVotes}</div>
                  <div className="text-sm text-muted-foreground">No</div>
                </div>
                {results.voteResults.abstainCount > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-500">{results.voteResults.abstainCount}</div>
                    <div className="text-sm text-muted-foreground">Abstain</div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {results.voteResults.votes.map((vote) => {
                  const ideology = getPlayerIdeology(vote.playerId);
                  return (
                    <div
                      key={vote.playerId}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-full text-sm',
                        vote.playerId === localPlayerId && 'ring-2 ring-primary'
                      )}
                      style={{
                        backgroundColor: ideology ? `${IDEOLOGY_DEFINITIONS[ideology].color}20` : undefined
                      }}
                    >
                      {ideology && (
                        <span>{IDEOLOGY_DEFINITIONS[ideology].icon}</span>
                      )}
                      <span>{vote.playerName}</span>
                      <span className={cn('font-bold', getVoteColor(vote.choice))}>
                        {getVoteIcon(vote.choice)}
                        {vote.weight > 1 && <span className="text-xs ml-0.5">×{vote.weight}</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nation Changes */}
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold mb-3 text-center">Nation State</h3>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Stability</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className={cn(
                      'text-xl font-bold',
                      results.nationChanges.stabilityChange > 0 && 'text-green-600',
                      results.nationChanges.stabilityChange < 0 && 'text-red-600'
                    )}>
                      {results.nationChanges.stabilityChange > 0 ? '+' : ''}
                      {results.nationChanges.stabilityChange}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-xl font-bold">{results.nationChanges.newStability}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Budget</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className={cn(
                      'text-xl font-bold',
                      results.nationChanges.budgetChange > 0 && 'text-green-600',
                      results.nationChanges.budgetChange < 0 && 'text-red-600'
                    )}>
                      {results.nationChanges.budgetChange > 0 ? '+' : ''}
                      {results.nationChanges.budgetChange}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-xl font-bold">{results.nationChanges.newBudget}</span>
                  </div>
                </div>
              </div>
              {!results.votePassed && (
                <div className="mt-3 text-center text-sm text-red-600 dark:text-red-400">
                  Vote failed: Stability -1 (political gridlock)
                </div>
              )}
            </div>

            {/* Player Effects */}
            <div className="space-y-3">
              <h3 className="font-semibold text-center">Player Effects</h3>
              {results.playerEffects.map((effect) => {
                const ideology = getPlayerIdeology(effect.playerId);
                const isLocal = effect.playerId === localPlayerId;
                return (
                  <motion.div
                    key={effect.playerId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'rounded-lg border p-3',
                      isLocal && 'ring-2 ring-primary bg-primary/5'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {ideology && (
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                            style={{ backgroundColor: IDEOLOGY_DEFINITIONS[ideology].color }}
                          >
                            {IDEOLOGY_DEFINITIONS[ideology].icon}
                          </span>
                        )}
                        <span className="font-medium">
                          {effect.playerName}
                          {isLocal && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          'font-bold',
                          effect.movementBreakdown.total > 0 && 'text-green-600',
                          effect.movementBreakdown.total < 0 && 'text-red-600'
                        )}>
                          {effect.movementBreakdown.total > 0 ? '+' : ''}{effect.movementBreakdown.total} spaces
                        </div>
                      </div>
                    </div>

                    {/* Movement Breakdown */}
                    <div className="text-xs text-muted-foreground space-y-0.5 pl-8">
                      {effect.movementBreakdown.diceRoll !== null && effect.movementBreakdown.diceRoll > 0 && (
                        <div>Dice roll: +{effect.movementBreakdown.diceRoll}</div>
                      )}
                      {effect.movementBreakdown.ideologyBonus > 0 && (
                        <div className="text-green-600">Ideology aligned: +{effect.movementBreakdown.ideologyBonus}</div>
                      )}
                      {effect.movementBreakdown.ideologyPenalty < 0 && (
                        <div className="text-red-600">Ideology opposed: {effect.movementBreakdown.ideologyPenalty}</div>
                      )}
                      {effect.movementBreakdown.nationModifier !== 0 && (
                        <div className={effect.movementBreakdown.nationModifier > 0 ? 'text-green-600' : 'text-red-600'}>
                          Nation state: {effect.movementBreakdown.nationModifier > 0 ? '+' : ''}{effect.movementBreakdown.nationModifier}
                        </div>
                      )}
                      {effect.movementBreakdown.influenceModifier !== 0 && (
                        <div className={effect.movementBreakdown.influenceModifier > 0 ? 'text-green-600' : 'text-red-600'}>
                          Influence modifier: {effect.movementBreakdown.influenceModifier > 0 ? '+' : ''}{effect.movementBreakdown.influenceModifier}
                        </div>
                      )}
                    </div>

                    {/* Influence Change */}
                    {effect.influenceChange !== 0 && (
                      <div className={cn(
                        'mt-2 text-sm pl-8',
                        effect.influenceChange > 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        Influence {effect.influenceChange > 0 ? '+' : ''}{effect.influenceChange}
                        {effect.influenceReason && (
                          <span className="text-muted-foreground ml-1">({effect.influenceReason})</span>
                        )}
                      </div>
                    )}

                    {/* Token Effects */}
                    {effect.tokenEffects.length > 0 && (
                      <div className="mt-2 pl-8 space-y-1">
                        {effect.tokenEffects.map((token) => (
                          <div
                            key={token.tokenId}
                            className={cn(
                              'text-sm',
                              token.effect === 'honored' ? 'text-blue-600' : 'text-red-600'
                            )}
                          >
                            {token.effect === 'honored' ? '✓' : '💔'} Token {token.effect} with {getPlayerName(token.otherPlayerId)}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Acknowledgment Status */}
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold mb-3 text-center">Waiting for Players</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {players.map((player) => {
                  const hasAck = !results.pendingAcknowledgments.includes(player.id);
                  const ideology = player.ideology;
                  return (
                    <div
                      key={player.id}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
                        hasAck ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted-foreground/20',
                        player.id === localPlayerId && 'ring-2 ring-primary'
                      )}
                    >
                      {ideology && (
                        <span>{IDEOLOGY_DEFINITIONS[ideology].icon}</span>
                      )}
                      <span>{player.name}</span>
                      {hasAck ? (
                        <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                      ) : (
                        <span className="text-muted-foreground">...</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {timeRemaining > 0 && results.pendingAcknowledgments.length > 0 && (
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Auto-continue in {timeRemaining}s
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center pt-2">
              <Button
                size="lg"
                onClick={onAcknowledge}
                disabled={hasAcknowledged}
                className="min-w-[200px]"
              >
                {hasAcknowledged ? (
                  <span className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Waiting for others...
                  </span>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
