'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { VoteChoice } from '@/lib/game/types';
import type { PlayerStatePayload } from '@/lib/game/events';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface VoteData {
  playerId: string;
  choice: VoteChoice;
  influenceSpent: number;
  totalWeight: number;
}

interface VoteRevealProps {
  votes: VoteData[];
  players: PlayerStatePayload[];
  totalYes: number;
  totalNo: number;
  passed: boolean;
  onComplete?: () => void;
}

const voteColors = {
  yes: {
    bg: 'bg-green-500',
    text: 'text-green-600',
    label: 'Yes',
    icon: '✓',
  },
  no: {
    bg: 'bg-red-500',
    text: 'text-red-600',
    label: 'No',
    icon: '✗',
  },
  abstain: {
    bg: 'bg-gray-400',
    text: 'text-gray-500',
    label: 'Abstain',
    icon: '—',
  },
};

function VoteCard({
  vote,
  player,
  index,
}: {
  vote: VoteData;
  player: PlayerStatePayload | undefined;
  index: number;
}) {
  const colors = voteColors[vote.choice];
  const ideologyDef = player?.ideology
    ? IDEOLOGY_DEFINITIONS[player.ideology]
    : null;

  return (
    <motion.div
      initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.3,
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      className="perspective-1000"
    >
      <div
        className={cn(
          'relative flex flex-col items-center rounded-xl border-2 p-4 shadow-lg',
          'transform transition-shadow hover:shadow-xl',
          vote.choice === 'yes' && 'border-green-400 bg-green-50',
          vote.choice === 'no' && 'border-red-400 bg-red-50',
          vote.choice === 'abstain' && 'border-gray-300 bg-gray-50'
        )}
      >
        {/* Player Avatar */}
        <div
          className="mb-2 flex h-10 w-10 items-center justify-center rounded-full text-lg shadow-md"
          style={{ backgroundColor: ideologyDef?.color || '#888' }}
        >
          {ideologyDef?.icon || '?'}
        </div>

        {/* Player Name */}
        <div className="mb-2 text-sm font-medium text-gray-700">
          {player?.name || 'Unknown'}
        </div>

        {/* Vote Result */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: index * 0.3 + 0.3,
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white',
            colors.bg
          )}
        >
          {colors.icon}
        </motion.div>

        {/* Vote Label */}
        <div className={cn('mt-2 text-sm font-bold', colors.text)}>
          {colors.label}
        </div>

        {/* Vote Weight */}
        {vote.totalWeight > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3 + 0.5 }}
            className="mt-1 text-xs text-muted-foreground"
          >
            Weight: {vote.totalWeight}
            {vote.influenceSpent > 0 && (
              <span className="text-purple-500"> (+{vote.influenceSpent})</span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function VoteReveal({
  votes,
  players,
  totalYes,
  totalNo,
  passed,
  onComplete,
}: VoteRevealProps) {
  const totalDelay = votes.length * 0.3 + 0.8;

  return (
    <div className="space-y-6">
      {/* Vote Cards */}
      <div className="flex flex-wrap justify-center gap-4">
        <AnimatePresence>
          {votes.map((vote, index) => {
            const player = players.find((p) => p.id === vote.playerId);
            return (
              <VoteCard key={vote.playerId} vote={vote} player={player} index={index} />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Tally and Result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: totalDelay, duration: 0.5 }}
        className="text-center"
      >
        {/* Vote Tally */}
        <div className="mb-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
              ✓
            </div>
            <span className="text-2xl font-bold text-green-600">{totalYes}</span>
          </div>
          <div className="text-2xl text-muted-foreground">vs</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-600">{totalNo}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
              ✗
            </div>
          </div>
        </div>

        {/* Final Result */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: totalDelay + 0.3,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          onAnimationComplete={onComplete}
          className={cn(
            'inline-block rounded-lg px-6 py-3 text-xl font-bold shadow-lg',
            passed
              ? 'bg-green-100 text-green-700 ring-2 ring-green-400'
              : 'bg-red-100 text-red-700 ring-2 ring-red-400'
          )}
        >
          {passed ? 'MOTION PASSED' : 'MOTION REJECTED'}
        </motion.div>
      </motion.div>
    </div>
  );
}
