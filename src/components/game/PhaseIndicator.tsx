'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { GamePhase, SubPhase } from '@/lib/game/types';

interface PhaseIndicatorProps {
  phase: GamePhase;
  subPhase?: SubPhase | null;
  activePlayerName?: string;
  isMyTurn: boolean;
  timerEndAt?: number | null;
  isOvertime?: boolean;
}

interface PhaseInfo {
  name: string;
  description: string;
  color: string;
  icon: string;
}

const PHASE_INFO: Record<GamePhase, PhaseInfo> = {
  waiting: {
    name: 'Waiting',
    description: 'Waiting for active player to roll',
    color: 'bg-gray-500',
    icon: '🎲',
  },
  rolling: {
    name: 'Rolling',
    description: 'Rolling the dice...',
    color: 'bg-blue-500',
    icon: '🎲',
  },
  drawing: {
    name: 'Drawing',
    description: 'Drawing decision card...',
    color: 'bg-purple-500',
    icon: '🃏',
  },
  reviewing: {
    name: 'Review Phase',
    description: 'Review the card and mark ready',
    color: 'bg-amber-500',
    icon: '📋',
  },
  deliberating: {
    name: 'Negotiation',
    description: 'Discuss and negotiate with other players',
    color: 'bg-green-500',
    icon: '🤝',
  },
  proposing: {
    name: 'Proposing',
    description: 'Active player is selecting an option',
    color: 'bg-orange-500',
    icon: '✋',
  },
  voting: {
    name: 'Voting',
    description: 'Cast your vote',
    color: 'bg-indigo-500',
    icon: '🗳️',
  },
  revealing: {
    name: 'Revealing',
    description: 'Revealing votes...',
    color: 'bg-pink-500',
    icon: '👁️',
  },
  resolving: {
    name: 'Resolving',
    description: 'Applying effects...',
    color: 'bg-red-500',
    icon: '⚡',
  },
  showingResults: {
    name: 'Results',
    description: 'Review the turn results',
    color: 'bg-cyan-500',
    icon: '📊',
  },
  crisis: {
    name: 'Crisis!',
    description: 'Handle the crisis event',
    color: 'bg-red-600',
    icon: '🚨',
  },
};

/**
 * FR-022: Phase indicator component showing current phase name, description, and status.
 */
export function PhaseIndicator({
  phase,
  subPhase,
  activePlayerName,
  isMyTurn,
  timerEndAt,
  isOvertime,
}: PhaseIndicatorProps) {
  const phaseInfo = PHASE_INFO[phase] || PHASE_INFO.waiting;

  // Customize description based on context
  const displayDescription = useMemo(() => {
    if (phase === 'waiting') {
      return isMyTurn ? 'Your turn - roll the dice!' : `Waiting for ${activePlayerName}`;
    }
    if (phase === 'reviewing') {
      return isMyTurn
        ? 'Select an option to propose'
        : 'Review the card and mark "Ready to Negotiate"';
    }
    if (phase === 'deliberating' && isOvertime) {
      return 'Overtime - take time to finish negotiations';
    }
    if (phase === 'voting') {
      return 'Cast your vote: Yes, No, or Abstain';
    }
    return phaseInfo.description;
  }, [phase, isMyTurn, activePlayerName, isOvertime, phaseInfo.description]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'sticky top-0 z-30 mb-4 rounded-lg px-4 py-2 shadow-lg',
        phaseInfo.color,
        isOvertime && 'animate-pulse'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{phaseInfo.icon}</span>
          <div>
            <h2 className="font-bold text-white">
              {phaseInfo.name}
              {subPhase === 'reviewPhase' && ' (Review)'}
              {subPhase === 'negotiationPhase' && ' (Negotiations)'}
            </h2>
            <p className="text-sm text-white/80">{displayDescription}</p>
          </div>
        </div>

        {/* Status badge */}
        {isMyTurn && phase !== 'showingResults' && phase !== 'revealing' && phase !== 'resolving' && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white"
          >
            Your Turn
          </motion.div>
        )}

        {isOvertime && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900"
          >
            OVERTIME
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
