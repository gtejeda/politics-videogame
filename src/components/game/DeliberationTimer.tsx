'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DeliberationTimerProps {
  timerStartedAt: number;
  recommendedDuration: number; // in seconds
  onPropose?: () => void;
  canPropose: boolean;
  hasProposed: boolean;
}

/**
 * FR-021: Guidance timer for Deliberation/Negotiation Phase.
 * Shows a 3-minute countdown timer with overtime mode when it expires.
 */
export function DeliberationTimer({
  timerStartedAt,
  recommendedDuration,
  onPropose,
  canPropose,
  hasProposed,
}: DeliberationTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(recommendedDuration);
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
      const remaining = recommendedDuration - elapsed;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsOvertime(true);
        setOvertimeSeconds(Math.abs(remaining));
      } else {
        setTimeRemaining(remaining);
        setIsOvertime(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timerStartedAt, recommendedDuration]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isLow = timeRemaining <= 60 && timeRemaining > 0;
  const isCritical = timeRemaining <= 30 && timeRemaining > 0;

  // Calculate progress for visual indicator
  const progress = (timeRemaining / recommendedDuration) * 100;

  return (
    <div className="space-y-2">
      {/* Timer Display */}
      <div
        className={cn(
          'relative overflow-hidden rounded-lg p-4 text-center transition-all',
          isOvertime && 'bg-amber-500/20 animate-pulse',
          isCritical && !isOvertime && 'bg-red-500/20 animate-pulse',
          isLow && !isCritical && !isOvertime && 'bg-amber-500/10',
          !isLow && !isOvertime && 'bg-muted'
        )}
      >
        {/* Progress Bar Background */}
        <div
          className={cn(
            'absolute inset-y-0 left-0 transition-all duration-1000',
            isOvertime && 'bg-amber-500/30',
            isCritical && !isOvertime && 'bg-red-500/30',
            isLow && !isCritical && !isOvertime && 'bg-amber-500/20',
            !isLow && !isOvertime && 'bg-primary/20'
          )}
          style={{ width: `${progress}%` }}
        />

        {/* Timer Content */}
        <div className="relative z-10">
          {isOvertime ? (
            <div className="space-y-1">
              <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
                OVERTIME
              </div>
              <div className="font-mono text-3xl font-bold text-amber-600 dark:text-amber-400">
                +{Math.floor(overtimeSeconds / 60)}:{(overtimeSeconds % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-amber-600/80 dark:text-amber-400/80">
                No penalty - take time to negotiate!
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                Negotiation Time
              </div>
              <div
                className={cn(
                  'font-mono text-4xl font-bold',
                  isCritical && 'text-red-600 dark:text-red-400',
                  isLow && !isCritical && 'text-amber-600 dark:text-amber-400',
                  !isLow && 'text-foreground'
                )}
              >
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
              {isLow && (
                <div className="text-xs text-muted-foreground">
                  {isCritical ? 'Final seconds!' : 'Time running low'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Prompt */}
      <AnimatePresence>
        {canPropose && !hasProposed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'rounded-lg border-2 border-dashed p-3 text-center transition-colors',
              isOvertime
                ? 'border-amber-500/50 bg-amber-500/10'
                : 'border-primary/50 bg-primary/5'
            )}
          >
            <p className="text-sm font-medium">
              {isOvertime
                ? 'Negotiations have gone overtime!'
                : 'Ready to propose?'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOvertime
                ? 'When you\'re ready, submit your proposal to proceed to voting.'
                : 'Select an option and propose it when negotiations conclude.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Already Proposed Indicator */}
      {hasProposed && (
        <div className="rounded-lg bg-green-500/10 p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Proposal submitted</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Waiting for negotiations to conclude...
          </p>
        </div>
      )}
    </div>
  );
}
