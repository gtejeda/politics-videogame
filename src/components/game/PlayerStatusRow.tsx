'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { GamePhase } from '@/lib/game/types';
import type { PlayerStatePayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PlayerStatusRowProps {
  players: PlayerStatePayload[];
  phase: GamePhase;
  activePlayerId: string | null;
  readyToNegotiate: string[];
  votedPlayers?: string[];
  acknowledgedPlayers?: string[];
  localPlayerId: string | null;
  isOvertime?: boolean;
}

type PlayerStatus = 'ready' | 'waiting' | 'acting';

/**
 * FR-022: Player status row showing avatars with status icons.
 */
export function PlayerStatusRow({
  players,
  phase,
  activePlayerId,
  readyToNegotiate,
  votedPlayers = [],
  acknowledgedPlayers = [],
  localPlayerId,
  isOvertime = false,
}: PlayerStatusRowProps) {
  const getPlayerStatus = (playerId: string): PlayerStatus => {
    // During reviewing phase, check readiness
    if (phase === 'reviewing') {
      if (playerId === activePlayerId) {
        return 'acting'; // Proposer is reviewing options
      }
      return readyToNegotiate.includes(playerId) ? 'ready' : 'waiting';
    }

    // During voting, check if voted
    if (phase === 'voting') {
      return votedPlayers.includes(playerId) ? 'ready' : 'waiting';
    }

    // During results, check acknowledgment
    if (phase === 'showingResults') {
      return acknowledgedPlayers.includes(playerId) ? 'ready' : 'waiting';
    }

    // During waiting, the active player is acting
    if (phase === 'waiting') {
      return playerId === activePlayerId ? 'acting' : 'ready';
    }

    // During deliberation, everyone is acting (negotiating)
    if (phase === 'deliberating') {
      return 'acting';
    }

    return 'ready';
  };

  const getTooltipText = (player: PlayerStatePayload): string => {
    const status = getPlayerStatus(player.id);
    const isLocal = player.id === localPlayerId;
    const isActive = player.id === activePlayerId;

    if (phase === 'reviewing') {
      if (isActive) {
        return isLocal
          ? 'You are selecting an option'
          : `${player.name} is selecting an option`;
      }
      if (status === 'ready') {
        return isLocal
          ? 'You are ready to negotiate'
          : `${player.name} is ready`;
      }
      return isLocal
        ? 'Click "Ready to Negotiate" when done reviewing'
        : `Waiting for ${player.name} to review`;
    }

    if (phase === 'voting') {
      if (status === 'ready') {
        return isLocal
          ? 'You have voted'
          : `${player.name} has voted`;
      }
      return isLocal
        ? 'Cast your vote'
        : `Waiting for ${player.name} to vote`;
    }

    if (phase === 'showingResults') {
      if (status === 'ready') {
        return isLocal
          ? 'You acknowledged the results'
          : `${player.name} is ready to continue`;
      }
      return isLocal
        ? 'Click Continue to proceed'
        : `Waiting for ${player.name}`;
    }

    if (phase === 'waiting') {
      if (isActive) {
        return isLocal
          ? 'Your turn - roll the dice!'
          : `${player.name}'s turn`;
      }
      return `Waiting for ${player.name}'s turn`;
    }

    if (phase === 'deliberating') {
      return isLocal
        ? 'Negotiating...'
        : `${player.name} is negotiating`;
    }

    return player.name;
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-2 py-2">
        {players.map((player) => {
          const status = getPlayerStatus(player.id);
          const isLocal = player.id === localPlayerId;
          const ideologyDef = player.ideology ? IDEOLOGY_DEFINITIONS[player.ideology] : null;
          const shouldPulse = isOvertime && status === 'waiting';

          return (
            <Tooltip key={player.id}>
              <TooltipTrigger asChild>
                <motion.div
                  className={cn(
                    'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                    isLocal && 'ring-2 ring-primary ring-offset-2',
                    status === 'ready' && 'border-green-500 bg-green-100 dark:bg-green-900/30',
                    status === 'waiting' && 'border-amber-500 bg-amber-100 dark:bg-amber-900/30',
                    status === 'acting' && 'border-blue-500 bg-blue-100 dark:bg-blue-900/30',
                    shouldPulse && 'animate-pulse'
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {/* Player avatar/icon */}
                  <span className="text-lg">
                    {ideologyDef?.icon || player.name.charAt(0).toUpperCase()}
                  </span>

                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background shadow-sm">
                    {status === 'ready' && (
                      <svg
                        className="h-3 w-3 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {status === 'waiting' && (
                      <svg
                        className="h-3 w-3 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {status === 'acting' && (
                      <motion.span
                        className="text-xs"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        ...
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{player.name}</p>
                <p className="text-xs text-muted-foreground">
                  {getTooltipText(player)}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
