'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirstGame, type FirstGameHint } from '@/lib/hooks/useFirstGame';
import type { GamePhase } from '@/lib/game/types';

interface FirstGameHintsProps {
  phase: GamePhase;
  currentTurn: number;
  isMyTurn: boolean;
  className?: string;
}

/**
 * FirstGameHints - Contextual tips for first-time players
 *
 * Shows phase-specific hints during the first 2 turns to help new players learn.
 * Automatically dismisses when clicked or after phase changes.
 */
export function FirstGameHints({
  phase,
  currentTurn,
  isMyTurn,
  className,
}: FirstGameHintsProps) {
  const { hintsEnabled, getHintForPhase, dismissHint } = useFirstGame();
  const [currentHint, setCurrentHint] = useState<FirstGameHint | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Update hint when phase/turn changes
  useEffect(() => {
    if (!hintsEnabled) {
      setCurrentHint(null);
      setIsVisible(false);
      return;
    }

    const hint = getHintForPhase(phase, currentTurn, isMyTurn);

    if (hint && hint.id !== currentHint?.id) {
      setCurrentHint(hint);
      setIsVisible(true);
    } else if (!hint) {
      setIsVisible(false);
    }
  }, [phase, currentTurn, isMyTurn, hintsEnabled, getHintForPhase, currentHint?.id]);

  const handleDismiss = () => {
    if (currentHint) {
      dismissHint(currentHint.id);
    }
    setIsVisible(false);
  };

  if (!hintsEnabled || !currentHint) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'relative rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/50',
            className
          )}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              <Lightbulb className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {currentHint.content}
              </p>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                Tip {currentTurn <= 2 ? currentTurn : ''} of 2
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300"
              aria-label="Dismiss hint"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
