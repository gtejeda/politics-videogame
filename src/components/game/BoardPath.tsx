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

export function BoardPath({ players, pathLength, localPlayerId }: BoardPathProps) {
  // Create array of spaces
  const spaces = Array.from({ length: pathLength + 1 }, (_, i) => i);

  // Get zone for a position
  const getZone = (position: number) => {
    if (position <= BOARD_ZONES.EARLY_TERM.end) return 'early';
    if (position <= BOARD_ZONES.MID_TERM.end) return 'mid';
    if (position <= BOARD_ZONES.CRISIS_ZONE.end) return 'crisis';
    return 'late';
  };

  // Get players at a specific position
  const getPlayersAtPosition = (position: number) => {
    return players.filter(p => p.position === position);
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-blue-200" />
          <span>Early Term (0-8)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-green-200" />
          <span>Mid Term (9-20)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-orange-200" />
          <span>Crisis Zone (21-27)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-purple-200" />
          <span>Late Term (28-35)</span>
        </div>
      </div>

      {/* Board Path */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          {spaces.map((position) => {
            const zone = getZone(position);
            const playersHere = getPlayersAtPosition(position);
            const isStart = position === 0;
            const isEnd = position === pathLength;

            return (
              <div
                key={position}
                className={cn(
                  'relative flex flex-col items-center',
                  'w-10 min-w-[40px]'
                )}
              >
                {/* Space */}
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xs font-medium transition-all',
                    zone === 'early' && 'border-blue-300 bg-blue-50',
                    zone === 'mid' && 'border-green-300 bg-green-50',
                    zone === 'crisis' && 'border-orange-300 bg-orange-50',
                    zone === 'late' && 'border-purple-300 bg-purple-50',
                    isStart && 'ring-2 ring-blue-500',
                    isEnd && 'ring-2 ring-yellow-500',
                    playersHere.length > 0 && 'ring-2 ring-primary'
                  )}
                >
                  {isStart ? 'S' : isEnd ? 'E' : position}
                </div>

                {/* Players on this space */}
                {playersHere.length > 0 && (
                  <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-0.5">
                    {playersHere.map((player) => {
                      const ideologyDef = player.ideology
                        ? IDEOLOGY_DEFINITIONS[player.ideology]
                        : null;
                      const isLocal = player.id === localPlayerId;

                      return (
                        <div
                          key={player.id}
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full text-[10px] shadow-md',
                            isLocal && 'ring-2 ring-white'
                          )}
                          style={{
                            backgroundColor: ideologyDef?.color || '#888',
                          }}
                          title={`${player.name}${isLocal ? ' (You)' : ''}`}
                        >
                          {ideologyDef?.icon || '?'}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Zone markers */}
                {position === 0 && (
                  <span className="mt-1 text-[8px] text-muted-foreground">START</span>
                )}
                {position === pathLength && (
                  <span className="mt-1 text-[8px] text-muted-foreground">END</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Player positions summary */}
      <div className="flex flex-wrap gap-2">
        {players.map((player) => {
          const ideologyDef = player.ideology
            ? IDEOLOGY_DEFINITIONS[player.ideology]
            : null;
          const isLocal = player.id === localPlayerId;

          return (
            <div
              key={player.id}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1 text-sm',
                isLocal ? 'bg-primary/10' : 'bg-muted'
              )}
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: ideologyDef?.color || '#888' }}
              />
              <span className="font-medium">{player.name}</span>
              <span className="text-muted-foreground">
                Space {player.position}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
