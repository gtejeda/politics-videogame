'use client';

import { cn } from '@/lib/utils';
import type { NationStatePayload } from '@/lib/game/events';
import { NATION_THRESHOLDS } from '@/lib/game/constants';

interface NationTrackProps {
  nation: NationStatePayload;
}

export function NationTrack({ nation }: NationTrackProps) {
  const { stability, budget } = nation;

  // Calculate percentage for bar display (0-100)
  const stabilityPercent = Math.max(0, Math.min(100,
    ((stability - NATION_THRESHOLDS.STABILITY_MIN) /
    (NATION_THRESHOLDS.STABILITY_MAX - NATION_THRESHOLDS.STABILITY_MIN)) * 100
  ));

  const budgetPercent = Math.max(0, Math.min(100,
    ((budget - NATION_THRESHOLDS.BUDGET_MIN) /
    (NATION_THRESHOLDS.BUDGET_MAX - NATION_THRESHOLDS.BUDGET_MIN)) * 100
  ));

  // Determine status colors
  const stabilityStatus = stability >= NATION_THRESHOLDS.STABILITY_HIGH
    ? 'high'
    : stability <= NATION_THRESHOLDS.STABILITY_LOW
      ? 'low'
      : 'normal';

  const budgetStatus = budget >= NATION_THRESHOLDS.BUDGET_HIGH
    ? 'high'
    : budget <= NATION_THRESHOLDS.BUDGET_LOW
      ? 'low'
      : 'normal';

  return (
    <div className="space-y-3">
      {/* Stability Track */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Stability</span>
          <span className={cn(
            'font-mono',
            stabilityStatus === 'high' && 'text-green-600',
            stabilityStatus === 'low' && 'text-red-600',
          )}>
            {stability}
          </span>
        </div>
        <div className="nation-track">
          <div
            className={cn(
              'nation-track-fill',
              stabilityStatus === 'high' && 'bg-green-500',
              stabilityStatus === 'low' && 'bg-red-500',
              stabilityStatus === 'normal' && 'bg-blue-500',
            )}
            style={{ width: `${stabilityPercent}%` }}
          />
        </div>
        {stabilityStatus !== 'normal' && (
          <p className="text-xs text-muted-foreground">
            {stabilityStatus === 'high'
              ? 'Stable: All players +1 movement'
              : 'Crisis: All players -1 movement'}
          </p>
        )}
      </div>

      {/* Budget Track */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Budget</span>
          <span className={cn(
            'font-mono',
            budgetStatus === 'high' && 'text-green-600',
            budgetStatus === 'low' && 'text-red-600',
          )}>
            {budget}
          </span>
        </div>
        <div className="nation-track">
          <div
            className={cn(
              'nation-track-fill',
              budgetStatus === 'high' && 'bg-green-500',
              budgetStatus === 'low' && 'bg-red-500',
              budgetStatus === 'normal' && 'bg-amber-500',
            )}
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
        {budgetStatus !== 'normal' && (
          <p className="text-xs text-muted-foreground">
            {budgetStatus === 'high'
              ? 'Surplus: Active player +1 to roll'
              : 'Deficit: Active player -1 to roll'}
          </p>
        )}
      </div>

      {/* Collapse Warning */}
      {(stability <= 2 || budget <= -3) && (
        <div className="rounded-md bg-red-100 p-2 text-center text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          Warning: Nation approaching collapse!
        </div>
      )}
    </div>
  );
}
