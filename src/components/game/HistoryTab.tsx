'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TurnHistoryEntry } from './TurnHistoryEntry';
import type { TurnHistoryEntry as TurnHistoryEntryType } from '@/lib/game/turn-history';

interface HistoryTabProps {
  turnHistory: TurnHistoryEntryType[];
  currentTurn: number;
}

/**
 * HistoryTab - Chronological turn list
 *
 * FR-029: Display turn history with vote breakdown
 * Individual turn content rendered by TurnHistoryEntry component
 */
export function HistoryTab({ turnHistory, currentTurn }: HistoryTabProps) {
  // Sort by turn number descending (most recent first)
  const sortedHistory = [...turnHistory].sort((a, b) => b.turnNumber - a.turnNumber);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Turn History</h2>
        <Badge variant="secondary">
          {turnHistory.length} {turnHistory.length === 1 ? 'Turn' : 'Turns'} Completed
        </Badge>
      </div>

      {/* Turn List */}
      {sortedHistory.length > 0 ? (
        <div className="space-y-4">
          {sortedHistory.map((entry) => (
            <TurnHistoryEntry key={entry.turnNumber} entry={entry} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-lg">📜</p>
            <p className="mt-2 font-medium">No history yet</p>
            <p className="text-sm text-muted-foreground">
              Turn history will appear here after each turn completes
            </p>
            {currentTurn > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Currently on Turn {currentTurn}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {sortedHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Passed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Failed</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👍</span>
                <span className="text-muted-foreground">Yes Vote</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👎</span>
                <span className="text-muted-foreground">No Vote</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🤷</span>
                <span className="text-muted-foreground">Abstain</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
