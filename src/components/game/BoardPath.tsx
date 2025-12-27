'use client';

import { cn } from '@/lib/utils';
import type { PlayerStatePayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { BOARD_ZONES } from '@/lib/game/constants';

interface BoardPathProps {
  players: PlayerStatePayload[];
  pathLength: number;
  localPlayerId: string | null;
}

const SPACES_PER_ROW = 6;

export function BoardPath({ players, pathLength, localPlayerId }: BoardPathProps) {
  // Create array of spaces
  const spaces = Array.from({ length: pathLength + 1 }, (_, i) => i);

  // Split into rows for snake pattern
  const rows: number[][] = [];
  for (let i = 0; i < spaces.length; i += SPACES_PER_ROW) {
    const row = spaces.slice(i, i + SPACES_PER_ROW);
    rows.push(row);
  }

  // Get zone for a position
  const getZone = (position: number) => {
    if (position <= BOARD_ZONES.EARLY_TERM.end) return 'early';
    if (position <= BOARD_ZONES.MID_TERM.end) return 'mid';
    if (position <= BOARD_ZONES.CRISIS_ZONE.end) return 'crisis';
    return 'late';
  };

  // Get zone colors
  const getZoneColors = (zone: string) => {
    switch (zone) {
      case 'early':
        return { bg: 'bg-blue-100', border: 'border-blue-300', ring: 'ring-blue-400' };
      case 'mid':
        return { bg: 'bg-green-100', border: 'border-green-300', ring: 'ring-green-400' };
      case 'crisis':
        return { bg: 'bg-orange-100', border: 'border-orange-400', ring: 'ring-orange-500' };
      case 'late':
        return { bg: 'bg-purple-100', border: 'border-purple-300', ring: 'ring-purple-400' };
      default:
        return { bg: 'bg-gray-100', border: 'border-gray-300', ring: 'ring-gray-400' };
    }
  };

  // Get players at a specific position
  const getPlayersAtPosition = (position: number) => {
    return players.filter(p => p.position === position);
  };

  // Render a single space
  const renderSpace = (position: number, isReversed: boolean) => {
    const zone = getZone(position);
    const colors = getZoneColors(zone);
    const playersHere = getPlayersAtPosition(position);
    const isStart = position === 0;
    const isEnd = position === pathLength;

    return (
      <div
        key={position}
        className="relative flex flex-col items-center"
      >
        {/* The space tile */}
        <div
          className={cn(
            'relative flex h-12 w-12 items-center justify-center rounded-xl border-2 text-sm font-bold shadow-sm transition-all',
            colors.bg,
            colors.border,
            isStart && 'ring-2 ring-offset-1 ring-blue-500',
            isEnd && 'ring-2 ring-offset-1 ring-yellow-500',
            playersHere.length > 0 && `ring-2 ring-offset-1 ${colors.ring}`
          )}
        >
          {isStart ? (
            <span className="text-blue-600">GO</span>
          ) : isEnd ? (
            <span className="text-yellow-600">WIN</span>
          ) : (
            <span className="text-gray-600">{position}</span>
          )}

          {/* Players on this space */}
          {playersHere.length > 0 && (
            <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 gap-0.5">
              {playersHere.map((player) => {
                const ideologyDef = player.ideology
                  ? IDEOLOGY_DEFINITIONS[player.ideology]
                  : null;
                const isLocal = player.id === localPlayerId;

                return (
                  <div
                    key={player.id}
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs shadow-lg border-2 border-white',
                      isLocal && 'ring-2 ring-yellow-400'
                    )}
                    style={{
                      backgroundColor: ideologyDef?.color || '#888',
                    }}
                    title={`${player.name}${isLocal ? ' (You)' : ''} - Space ${position}`}
                  >
                    {ideologyDef?.icon || '?'}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-md bg-blue-200 border border-blue-300" />
          <span className="text-muted-foreground">Early Term</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-md bg-green-200 border border-green-300" />
          <span className="text-muted-foreground">Mid Term</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-md bg-orange-200 border border-orange-400" />
          <span className="text-muted-foreground">Crisis Zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-md bg-purple-200 border border-purple-300" />
          <span className="text-muted-foreground">Late Term</span>
        </div>
      </div>

      {/* Snake Board Path */}
      <div className="flex flex-col items-center gap-1 py-2">
        {rows.map((row, rowIndex) => {
          const isReversed = rowIndex % 2 === 1;
          const displayRow = isReversed ? [...row].reverse() : row;
          const isLastRow = rowIndex === rows.length - 1;

          return (
            <div key={rowIndex} className="flex flex-col items-center">
              {/* Row of spaces */}
              <div
                className={cn(
                  'flex gap-1',
                  isReversed && 'flex-row'
                )}
              >
                {displayRow.map((position) => renderSpace(position, isReversed))}

                {/* Padding for incomplete last row */}
                {row.length < SPACES_PER_ROW &&
                  Array.from({ length: SPACES_PER_ROW - row.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-12" />
                  ))
                }
              </div>

              {/* Connector to next row */}
              {!isLastRow && (
                <div className={cn(
                  'flex w-full py-0.5',
                  isReversed ? 'justify-start pl-6' : 'justify-end pr-6'
                )}>
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-0.5 bg-gray-300" />
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <div className="h-2 w-0.5 bg-gray-300" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Player positions summary */}
      <div className="flex flex-wrap justify-center gap-2 pt-2 border-t">
        {players.map((player) => {
          const ideologyDef = player.ideology
            ? IDEOLOGY_DEFINITIONS[player.ideology]
            : null;
          const isLocal = player.id === localPlayerId;

          return (
            <div
              key={player.id}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm shadow-sm',
                isLocal ? 'bg-yellow-50 border border-yellow-200' : 'bg-muted border'
              )}
            >
              <div
                className="h-5 w-5 rounded-full flex items-center justify-center text-xs border border-white shadow-sm"
                style={{ backgroundColor: ideologyDef?.color || '#888' }}
              >
                {ideologyDef?.icon || '?'}
              </div>
              <span className="font-medium">{player.name}</span>
              <span className="text-muted-foreground text-xs">
                #{player.position}
              </span>
              {isLocal && (
                <span className="text-yellow-600 text-xs">(You)</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
