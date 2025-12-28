'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RoomStatePayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { getCollapseEducation } from '@/lib/game/debrief';
import { POLITICAL_CONCEPTS } from '@/lib/game/concepts';
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
                  <>
                    <p className="text-muted-foreground">
                      {IDEOLOGY_DEFINITIONS[winner.ideology].name}
                    </p>
                    <div className="mt-4 w-full max-w-md rounded-lg border p-4 text-left">
                      <h4 className="font-medium text-center mb-2">Winning Strategy</h4>
                      <p className="text-sm text-muted-foreground">
                        {IDEOLOGY_DEFINITIONS[winner.ideology].description}
                      </p>
                      <p className="mt-2 text-sm">
                        As a <span className="font-medium">{IDEOLOGY_DEFINITIONS[winner.ideology].name}</span>,
                        the winner benefited from policies aligned with their values. Cards that promoted{' '}
                        {winner.ideology === 'progressive' && 'social reform and redistribution gave movement bonuses.'}
                        {winner.ideology === 'conservative' && 'tradition and stability gave movement bonuses.'}
                        {winner.ideology === 'liberal' && 'market freedom and individual rights gave movement bonuses.'}
                        {winner.ideology === 'nationalist' && 'national interests and sovereignty gave movement bonuses.'}
                        {winner.ideology === 'populist' && 'popular will and anti-establishment policies gave movement bonuses.'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          )}

          {isCollapsed && (
            <CardContent>
              <div className="space-y-4 text-left">
                {/* Collapse Type */}
                {roomState.collapseReason && (
                  <div className="rounded bg-red-100 p-4 dark:bg-red-950">
                    <p className="font-medium text-red-800 dark:text-red-200">
                      {getCollapseEducation(roomState.collapseReason).title}
                    </p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                      {getCollapseEducation(roomState.collapseReason).explanation}
                    </p>
                  </div>
                )}

                {/* Final Nation State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn(
                    'rounded border p-3 text-center',
                    roomState.nation.stability <= 0 && 'border-red-500 bg-red-50 dark:bg-red-950'
                  )}>
                    <p className="text-sm text-muted-foreground">Stability</p>
                    <p className={cn(
                      'text-2xl font-bold',
                      roomState.nation.stability <= 0 && 'text-red-600'
                    )}>
                      {roomState.nation.stability}
                    </p>
                  </div>
                  <div className={cn(
                    'rounded border p-3 text-center',
                    roomState.nation.budget <= -5 && 'border-red-500 bg-red-50 dark:bg-red-950'
                  )}>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className={cn(
                      'text-2xl font-bold',
                      roomState.nation.budget <= -5 && 'text-red-600'
                    )}>
                      {roomState.nation.budget}
                    </p>
                  </div>
                </div>

                {/* Debrief Details */}
                {roomState.debrief && (
                  <>
                    {/* What Happened */}
                    <div className="rounded border p-4">
                      <h4 className="font-medium">What Happened</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {roomState.debrief.whatHappened}
                      </p>
                    </div>

                    {/* Key Decisions */}
                    {roomState.debrief.keyDecisions.length > 0 && (
                      <div className="rounded border p-4">
                        <h4 className="font-medium">Key Decisions That Contributed</h4>
                        <ul className="mt-2 space-y-2">
                          {roomState.debrief.keyDecisions.map((decision, index) => (
                            <li key={index} className="text-sm">
                              <span className="font-medium">Turn {decision.turn}:</span>{' '}
                              <span className="text-muted-foreground">{decision.decision}</span>
                              <br />
                              <span className="text-xs text-red-600 dark:text-red-400">
                                {decision.impact}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Historical Parallel */}
                    <div className="rounded border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                      <h4 className="flex items-center gap-2 font-medium text-blue-800 dark:text-blue-200">
                        <span>📚</span> Real-World Parallel
                      </h4>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                        {roomState.debrief.realWorldParallel}
                      </p>
                    </div>

                    {/* Lesson Learned */}
                    <div className="rounded border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                      <h4 className="flex items-center gap-2 font-medium text-amber-800 dark:text-amber-200">
                        <span>💡</span> Lesson
                      </h4>
                      <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                        {roomState.debrief.lesson}
                      </p>
                    </div>

                    {/* Prevention Tips */}
                    {roomState.collapseReason && (
                      <div className="rounded border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                        <h4 className="flex items-center gap-2 font-medium text-green-800 dark:text-green-200">
                          <span>🛡️</span> How to Prevent This
                        </h4>
                        <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                          {getCollapseEducation(roomState.collapseReason).prevention}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Fallback if no debrief data */}
                {!roomState.debrief && (
                  <p className="text-sm text-muted-foreground">
                    When governments fail to maintain basic stability or fiscal
                    responsibility, collapse becomes inevitable. This mirrors real-world
                    situations where political gridlock or economic mismanagement has led
                    to government failures.
                  </p>
                )}
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

        {/* Political Concepts Learned */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📚</span>
              Political Concepts Demonstrated
            </CardTitle>
            <CardDescription>
              Through this game, you experienced real political dynamics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Show relevant concepts based on game events */}
              {POLITICAL_CONCEPTS.slice(0, 4).map((concept) => (
                <div
                  key={concept.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <h4 className="font-medium text-primary">{concept.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {concept.description}
                  </p>
                  <div className="text-sm bg-muted/50 rounded p-2 italic">
                    <span className="font-medium not-italic">In this game: </span>
                    {concept.example}
                  </div>
                </div>
              ))}

              {/* Expand to see more */}
              {POLITICAL_CONCEPTS.length > 4 && (
                <details className="group">
                  <summary className="cursor-pointer text-sm text-primary hover:underline list-none flex items-center gap-1">
                    <span className="group-open:rotate-90 transition-transform">▶</span>
                    Show {POLITICAL_CONCEPTS.length - 4} more concepts
                  </summary>
                  <div className="mt-4 space-y-4">
                    {POLITICAL_CONCEPTS.slice(4).map((concept) => (
                      <div
                        key={concept.id}
                        className="rounded-lg border p-4 space-y-2"
                      >
                        <h4 className="font-medium text-primary">{concept.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {concept.description}
                        </p>
                        <div className="text-sm bg-muted/50 rounded p-2 italic">
                          <span className="font-medium not-italic">In this game: </span>
                          {concept.example}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
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
