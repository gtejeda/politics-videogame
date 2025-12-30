'use client';

import { cn } from '@/lib/utils';
import type { PlayerStatePayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { INFLUENCE_THRESHOLDS } from '@/lib/game/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PlayerTrackProps {
  player: PlayerStatePayload;
  isActive: boolean;
  isLocal: boolean;
  pathLength: number;
  isAfk?: boolean;
}

// Get influence level display for non-local players (partial visibility)
function getInfluenceLevel(influence: number): { label: string; color: string } {
  if (influence >= INFLUENCE_THRESHOLDS.HIGH) {
    return { label: 'High', color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400' };
  }
  if (influence <= INFLUENCE_THRESHOLDS.LOW) {
    return { label: 'Low', color: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400' };
  }
  return { label: 'Med', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-400' };
}

export function PlayerTrack({ player, isActive, isLocal, pathLength, isAfk = false }: PlayerTrackProps) {
  const { name, ideology, position, influence, ownTokens, isConnected } = player;

  // Calculate progress percentage
  const progressPercent = (position / pathLength) * 100;

  // Get ideology color
  const ideologyDef = ideology ? IDEOLOGY_DEFINITIONS[ideology] : null;

  return (
    <TooltipProvider>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex h-6 w-6 cursor-help items-center justify-center rounded-full text-xs"
                    style={{ backgroundColor: ideologyDef.color }}
                  >
                    {ideologyDef.icon}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{ideologyDef.name}</p>
                  <p className="text-xs text-muted-foreground">{ideologyDef.coreConcern}</p>
                </TooltipContent>
              </Tooltip>
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
        {isConnected && isAfk && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            AFK
          </span>
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
          {isLocal ? (
            // Local player sees exact influence value
            <span className={cn(
              'font-bold rounded px-1.5',
              influence >= INFLUENCE_THRESHOLDS.HIGH && 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400',
              influence <= INFLUENCE_THRESHOLDS.LOW && 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400',
              influence > INFLUENCE_THRESHOLDS.LOW && influence < INFLUENCE_THRESHOLDS.HIGH && 'text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-400',
            )}>
              {influence}
            </span>
          ) : (
            // Other players see influence level (partial information)
            <span className={cn(
              'rounded px-1.5 py-0.5 text-xs font-medium',
              getInfluenceLevel(influence).color
            )}>
              {getInfluenceLevel(influence).label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Tokens:</span>
          <span className="font-medium">{ownTokens}</span>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
