'use client';

import { cn } from '@/lib/utils';
import type { NationStatePayload, PlayerStatePayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import { NATION_THRESHOLDS, INFLUENCE_THRESHOLDS } from '@/lib/game/constants';
import { TermTooltip } from './TermTooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PlayersBarProps {
  nation: NationStatePayload;
  players: PlayerStatePayload[];
  activePlayerId: string | null;
  localPlayerId: string | null;
  currentTurn: number;
  pathLength: number;
  afkPlayers?: Set<string>;
}

// Get influence level display for non-local players
function getInfluenceLevel(influence: number): { label: string; color: string } {
  if (influence >= INFLUENCE_THRESHOLDS.HIGH) {
    return { label: 'High', color: 'text-green-600 dark:text-green-400' };
  }
  if (influence <= INFLUENCE_THRESHOLDS.LOW) {
    return { label: 'Low', color: 'text-red-600 dark:text-red-400' };
  }
  return { label: 'Med', color: 'text-amber-600 dark:text-amber-400' };
}

// Compact nation status display
function NationStatusCompact({ nation }: { nation: NationStatePayload }) {
  const { stability, budget } = nation;

  const stabilityStatus =
    stability >= NATION_THRESHOLDS.STABILITY_HIGH
      ? 'high'
      : stability <= NATION_THRESHOLDS.STABILITY_COLLAPSE
        ? 'collapse'
        : stability <= NATION_THRESHOLDS.STABILITY_LOW
          ? 'low'
          : 'normal';

  const budgetStatus =
    budget >= NATION_THRESHOLDS.BUDGET_HIGH
      ? 'high'
      : budget <= NATION_THRESHOLDS.BUDGET_COLLAPSE
        ? 'collapse'
        : budget <= NATION_THRESHOLDS.BUDGET_LOW
          ? 'low'
          : 'normal';

  return (
    <div className="flex items-center gap-4">
      {/* Stability */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2 py-1',
                stabilityStatus === 'high' && 'bg-green-100 dark:bg-green-900/30',
                stabilityStatus === 'low' && 'bg-orange-100 dark:bg-orange-900/30',
                stabilityStatus === 'collapse' && 'bg-red-100 dark:bg-red-900/30 animate-pulse',
                stabilityStatus === 'normal' && 'bg-blue-100 dark:bg-blue-900/30'
              )}
            >
              <span className="text-sm">🏛️</span>
              <span
                className={cn(
                  'font-mono font-bold',
                  stabilityStatus === 'high' && 'text-green-700 dark:text-green-400',
                  stabilityStatus === 'low' && 'text-orange-700 dark:text-orange-400',
                  stabilityStatus === 'collapse' && 'text-red-700 dark:text-red-400',
                  stabilityStatus === 'normal' && 'text-blue-700 dark:text-blue-400'
                )}
              >
                {stability}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-medium">Stability: {stability}</p>
            <p className="text-xs text-muted-foreground">
              {stabilityStatus === 'high' && 'Flourishing (+1 movement)'}
              {stabilityStatus === 'low' && 'Crisis (-1 movement)'}
              {stabilityStatus === 'collapse' && 'COLLAPSE IMMINENT!'}
              {stabilityStatus === 'normal' && 'Stable'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Budget */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2 py-1',
                budgetStatus === 'high' && 'bg-green-100 dark:bg-green-900/30',
                budgetStatus === 'low' && 'bg-orange-100 dark:bg-orange-900/30',
                budgetStatus === 'collapse' && 'bg-red-100 dark:bg-red-900/30 animate-pulse',
                budgetStatus === 'normal' && 'bg-amber-100 dark:bg-amber-900/30'
              )}
            >
              <span className="text-sm">💰</span>
              <span
                className={cn(
                  'font-mono font-bold',
                  budgetStatus === 'high' && 'text-green-700 dark:text-green-400',
                  budgetStatus === 'low' && 'text-orange-700 dark:text-orange-400',
                  budgetStatus === 'collapse' && 'text-red-700 dark:text-red-400',
                  budgetStatus === 'normal' && 'text-amber-700 dark:text-amber-400'
                )}
              >
                {budget}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-medium">Budget: {budget}</p>
            <p className="text-xs text-muted-foreground">
              {budgetStatus === 'high' && 'Surplus (+1 dice roll)'}
              {budgetStatus === 'low' && 'Deficit (-1 dice roll)'}
              {budgetStatus === 'collapse' && 'BANKRUPTCY IMMINENT!'}
              {budgetStatus === 'normal' && 'Balanced'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

// Compact player card for the bar
function PlayerCard({
  player,
  isActive,
  isLocal,
  pathLength,
  isAfk,
}: {
  player: PlayerStatePayload;
  isActive: boolean;
  isLocal: boolean;
  pathLength: number;
  isAfk: boolean;
}) {
  const { name, ideology, position, influence, ownTokens, isConnected } = player;
  const ideologyDef = ideology ? IDEOLOGY_DEFINITIONS[ideology] : null;
  const progressPercent = (position / pathLength) * 100;
  const influenceLevel = getInfluenceLevel(influence);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex min-w-[120px] flex-col rounded-lg border p-2 transition-all',
              isActive && 'border-primary bg-primary/10 ring-1 ring-primary',
              isLocal && !isActive && 'border-primary/50',
              !isConnected && 'opacity-50'
            )}
          >
            {/* Player Header */}
            <div className="flex items-center gap-1.5">
              {/* Ideology Icon */}
              {ideologyDef && (
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
                  style={{ backgroundColor: ideologyDef.color }}
                >
                  {ideologyDef.icon}
                </div>
              )}
              {/* Name */}
              <span className={cn('truncate text-sm font-medium', isActive && 'text-primary')}>
                {name}
              </span>
              {isLocal && <span className="text-xs text-muted-foreground">(You)</span>}
            </div>

            {/* Status Badges */}
            <div className="mt-1 flex items-center gap-1">
              {isActive && (
                <span className="rounded bg-primary px-1 py-0.5 text-[10px] text-primary-foreground">
                  Active
                </span>
              )}
              {isAfk && (
                <span className="rounded bg-amber-500 px-1 py-0.5 text-[10px] text-white">
                  AFK
                </span>
              )}
              {!isConnected && (
                <span className="rounded bg-muted px-1 py-0.5 text-[10px]">Offline</span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: ideologyDef?.color || '#888',
                }}
              />
            </div>

            {/* Stats Row */}
            <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Pos: {position}</span>
              <span className={influenceLevel.color}>
                {isLocal ? `Inf: ${influence}` : `Inf: ${influenceLevel.label}`}
              </span>
              <span>🎫 {ownTokens}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">
              {name} {isLocal && '(You)'}
            </p>
            {ideologyDef && (
              <p className="text-xs">
                {ideologyDef.name} - {ideologyDef.coreConcern}
              </p>
            )}
            <div className="flex gap-3 text-xs">
              <span>Position: {position}/{pathLength}</span>
              <span>Influence: {isLocal ? influence : influenceLevel.label}</span>
              <span>Tokens: {ownTokens}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * PlayersBar - Always-visible header with nation status and player cards
 */
export function PlayersBar({
  nation,
  players,
  activePlayerId,
  localPlayerId,
  currentTurn,
  pathLength,
  afkPlayers = new Set(),
}: PlayersBarProps) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {/* Top Row: Turn counter and Nation Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Turn {currentTurn}</span>
          <NationStatusCompact nation={nation} />
        </div>

        {/* Collapse Warning */}
        {(nation.stability <= 2 || nation.budget <= -3) &&
          nation.stability > 0 &&
          nation.budget > -5 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <span>⚠️</span>
              <span>Collapse Warning!</span>
            </div>
          )}
      </div>

      {/* Player Cards Row */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isActive={player.id === activePlayerId}
            isLocal={player.id === localPlayerId}
            pathLength={pathLength}
            isAfk={afkPlayers.has(player.id)}
          />
        ))}
      </div>
    </div>
  );
}
