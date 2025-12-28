'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PlayerStatePayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface MovementData {
  playerId: string;
  oldPosition: number;
  newPosition: number;
  reason: string;
}

interface BoardMovementProps {
  movements: MovementData[];
  players: PlayerStatePayload[];
  pathLength: number;
  onComplete?: () => void;
}

function MovementIndicator({
  movement,
  player,
  index,
}: {
  movement: MovementData;
  player: PlayerStatePayload | undefined;
  index: number;
}) {
  const ideologyDef = player?.ideology
    ? IDEOLOGY_DEFINITIONS[player.ideology]
    : null;

  const delta = movement.newPosition - movement.oldPosition;
  const isForward = delta > 0;
  const isBackward = delta < 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isForward ? -20 : 20, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        delay: index * 0.4,
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      className={cn(
        'flex items-center gap-3 rounded-lg border-2 p-3 shadow-md',
        isForward && 'border-green-300 bg-green-50',
        isBackward && 'border-red-300 bg-red-50',
        !isForward && !isBackward && 'border-gray-300 bg-gray-50'
      )}
    >
      {/* Player Avatar */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg shadow-sm"
        style={{ backgroundColor: ideologyDef?.color || '#888' }}
      >
        {ideologyDef?.icon || '?'}
      </div>

      {/* Movement Details */}
      <div className="flex-1">
        <div className="text-sm font-medium">{player?.name || 'Unknown'}</div>
        <div className="text-xs text-muted-foreground">{movement.reason}</div>
      </div>

      {/* Movement Arrow */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: index * 0.4 + 0.2,
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        className="flex items-center gap-2"
      >
        {/* Old Position */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-sm font-bold">
          {movement.oldPosition}
        </div>

        {/* Arrow */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: index * 0.4 + 0.3, duration: 0.3 }}
          className={cn(
            'flex items-center',
            isForward && 'text-green-500',
            isBackward && 'text-red-500'
          )}
        >
          {isForward ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          ) : isBackward ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
          ) : (
            <span className="px-2 text-gray-400">=</span>
          )}
        </motion.div>

        {/* New Position */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: index * 0.4 + 0.4,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white',
            isForward && 'bg-green-500',
            isBackward && 'bg-red-500',
            !isForward && !isBackward && 'bg-gray-400'
          )}
        >
          {movement.newPosition}
        </motion.div>

        {/* Delta Badge */}
        {delta !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.4 + 0.5 }}
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-bold',
              isForward && 'bg-green-200 text-green-700',
              isBackward && 'bg-red-200 text-red-700'
            )}
          >
            {delta > 0 ? `+${delta}` : delta}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function BoardMovement({
  movements,
  players,
  pathLength,
  onComplete,
}: BoardMovementProps) {
  const [showSummary, setShowSummary] = useState(false);

  // Calculate total delay for all animations
  const totalDelay = movements.length * 0.4 + 0.8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSummary(true);
    }, totalDelay * 1000);

    return () => clearTimeout(timer);
  }, [totalDelay]);

  useEffect(() => {
    if (showSummary && onComplete) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSummary, onComplete]);

  if (movements.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-4 text-center text-muted-foreground"
      >
        No movement this turn
      </motion.div>
    );
  }

  // Sort movements by most significant first (largest absolute delta)
  const sortedMovements = [...movements].sort(
    (a, b) =>
      Math.abs(b.newPosition - b.oldPosition) -
      Math.abs(a.newPosition - a.oldPosition)
  );

  // Calculate leader and victory proximity
  const getLeader = () => {
    const sorted = [...players].sort((a, b) => b.position - a.position);
    return sorted[0];
  };

  const leader = getLeader();
  const leaderProgress = leader ? Math.round((leader.position / pathLength) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Movement Animations */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedMovements.map((movement, index) => {
            const player = players.find((p) => p.id === movement.playerId);
            return (
              <MovementIndicator
                key={movement.playerId}
                movement={movement}
                player={player}
                index={index}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border bg-muted/50 p-4 text-center"
          >
            <div className="text-sm text-muted-foreground">Current Leader</div>
            {leader && (
              <div className="mt-2 flex items-center justify-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-sm"
                  style={{
                    backgroundColor: leader.ideology
                      ? IDEOLOGY_DEFINITIONS[leader.ideology].color
                      : '#888',
                  }}
                >
                  {leader.ideology
                    ? IDEOLOGY_DEFINITIONS[leader.ideology].icon
                    : '?'}
                </div>
                <span className="font-medium">{leader.name}</span>
                <span className="text-muted-foreground">at space {leader.position}</span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-1">
                Race Progress: {leaderProgress}%
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${leaderProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
