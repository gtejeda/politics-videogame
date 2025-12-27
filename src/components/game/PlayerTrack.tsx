'use client';

import { cn } from '@/lib/utils';
import type { PlayerStatePayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface PlayerTrackProps {
  player: PlayerStatePayload;
  isActive: boolean;
  isLocal: boolean;
  pathLength: number;
}

export function PlayerTrack({ player, isActive, isLocal, pathLength }: PlayerTrackProps) {
  const { name, ideology, position, influence, ownTokens, isConnected } = player;

  // Calculate progress percentage
  const progressPercent = (position / pathLength) * 100;

  // Get ideology color
  const ideologyDef = ideology ? IDEOLOGY_DEFINITIONS[ideology] : null;

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-all',
        isActive && 'border-primary bg-primary/5',
        isLocal && 'ring-2 ring-primary ring-offset-2',
        !isConnected && 'opacity-50'
      )}
    >
      {/* Header: Name and Ideology */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {ideologyDef && (
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
              style={{ backgroundColor: ideologyDef.color }}
            >
              {ideologyDef.icon}
            </div>
          )}
          <span className={cn('font-medium', isActive && 'text-primary')}>
            {name}
          </span>
          {isActive && (
            <span className="rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              Active
            </span>
          )}
          {isLocal && (
            <span className="text-xs text-muted-foreground">(You)</span>
          )}
        </div>

        {!isConnected && (
          <span className="text-xs text-muted-foreground">Disconnected</span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-2">
        <div className="relative h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute left-0 top-0 h-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: ideologyDef?.color || '#888',
            }}
          />
          {/* Position marker */}
          <div
            className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-foreground"
            style={{ left: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Start</span>
          <span>Space {position}</span>
          <span>End</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-2 flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Influence:</span>
          <span className="font-medium">{influence}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Tokens:</span>
          <span className="font-medium">{ownTokens}</span>
        </div>
      </div>
    </div>
  );
}
