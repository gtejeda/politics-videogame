'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RoomStatePayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { cn } from '@/lib/utils';

interface ResultsProps {
  roomState: RoomStatePayload;
  localPlayerId: string | null;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function Results({ roomState, localPlayerId, onPlayAgain, onHome }: ResultsProps) {
  const isCollapsed = roomState.status === 'collapsed';

  // Sort players by position (descending)
  const sortedPlayers = [...roomState.players].sort((a, b) => b.position - a.position);

  // Find winner (only for victory, not collapse)
  const winner = !isCollapsed ? sortedPlayers[0] : null;
  const isLocalWinner = winner?.id === localPlayerId;

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Result Header */}
        <Card className={cn(
          'text-center',
          isCollapsed && 'border-red-500',
          !isCollapsed && isLocalWinner && 'border-green-500'
        )}>
          <CardHeader>
            <CardTitle className="text-3xl">
              {isCollapsed ? 'Nation Collapsed!' : 'Game Over!'}
            </CardTitle>
            <CardDescription className="text-lg">
              {isCollapsed
                ? 'The government has failed and the nation has collapsed.'
                : isLocalWinner
                  ? 'Congratulations! You have won!'
                  : `${winner?.name} has won the game!`}
            </CardDescription>
          </CardHeader>

          {!isCollapsed && winner && (
            <CardContent>
              <div className="flex flex-col items-center">
                {winner.ideology && (
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
                    style={{ backgroundColor: IDEOLOGY_DEFINITIONS[winner.ideology].color }}
                  >
                    {IDEOLOGY_DEFINITIONS[winner.ideology].icon}
                  </div>
                )}
                <p className="mt-4 text-xl font-medium">{winner.name}</p>
                {winner.ideology && (
                  <p className="text-muted-foreground">
                    {IDEOLOGY_DEFINITIONS[winner.ideology].name}
                  </p>
                )}
              </div>
            </CardContent>
          )}

          {isCollapsed && (
            <CardContent>
              <div className="space-y-2 text-left">
                <div className="rounded bg-red-100 p-4 dark:bg-red-950">
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Final Nation State:
                  </p>
                  <ul className="mt-2 space-y-1 text-red-700 dark:text-red-300">
                    <li>Stability: {roomState.nation.stability}</li>
                    <li>Budget: {roomState.nation.budget}</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  When governments fail to maintain basic stability or fiscal
                  responsibility, collapse becomes inevitable. This mirrors real-world
                  situations where political gridlock or economic mismanagement has led
                  to government failures.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Final Standings */}
        <Card>
          <CardHeader>
            <CardTitle>Final Standings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => {
                const isLocal = player.id === localPlayerId;
                const ideologyDef = player.ideology
                  ? IDEOLOGY_DEFINITIONS[player.ideology]
                  : null;

                return (
                  <div
                    key={player.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3',
                      index === 0 && !isCollapsed && 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
                      isLocal && 'ring-2 ring-primary ring-offset-2'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold">
                        {index + 1}
                      </span>
                      {ideologyDef && (
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
                          style={{ backgroundColor: ideologyDef.color }}
                        >
                          {ideologyDef.icon}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{player.name}</span>
                        {isLocal && (
                          <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div>Position: {player.position}</div>
                      <div className="text-muted-foreground">
                        Influence: {player.influence}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Game Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Game Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Total Turns</dt>
                <dd className="text-2xl font-bold">{roomState.currentTurn}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Players</dt>
                <dd className="text-2xl font-bold">{roomState.players.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Final Stability</dt>
                <dd className={cn(
                  'text-2xl font-bold',
                  roomState.nation.stability <= 0 && 'text-red-600'
                )}>
                  {roomState.nation.stability}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Final Budget</dt>
                <dd className={cn(
                  'text-2xl font-bold',
                  roomState.nation.budget <= -5 && 'text-red-600'
                )}>
                  {roomState.nation.budget}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            className="flex-1"
            onClick={onPlayAgain}
          >
            Play Again
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onHome}
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
