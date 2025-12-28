'use client';

import { cn } from '@/lib/utils';
import type { NationStatePayload } from '@/lib/game/events';
import { NATION_THRESHOLDS } from '@/lib/game/constants';

interface NationTrackProps {
  nation: NationStatePayload;
}

// Calculate percentage position on track
function valueToPercent(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

// Get threshold marker positions
function getThresholdMarkers(type: 'stability' | 'budget') {
  const min = type === 'stability' ? NATION_THRESHOLDS.STABILITY_MIN : NATION_THRESHOLDS.BUDGET_MIN;
  const max = type === 'stability' ? NATION_THRESHOLDS.STABILITY_MAX : NATION_THRESHOLDS.BUDGET_MAX;

  if (type === 'stability') {
    return {
      collapse: valueToPercent(NATION_THRESHOLDS.STABILITY_COLLAPSE, min, max),
      low: valueToPercent(NATION_THRESHOLDS.STABILITY_LOW, min, max),
      high: valueToPercent(NATION_THRESHOLDS.STABILITY_HIGH, min, max),
    };
  }
  return {
    collapse: valueToPercent(NATION_THRESHOLDS.BUDGET_COLLAPSE, min, max),
    low: valueToPercent(NATION_THRESHOLDS.BUDGET_LOW, min, max),
    high: valueToPercent(NATION_THRESHOLDS.BUDGET_HIGH, min, max),
  };
}

export function NationTrack({ nation }: NationTrackProps) {
  const { stability, budget } = nation;

  // Calculate percentage for bar display (0-100)
  const stabilityPercent = valueToPercent(
    stability,
    NATION_THRESHOLDS.STABILITY_MIN,
    NATION_THRESHOLDS.STABILITY_MAX
  );

  const budgetPercent = valueToPercent(
    budget,
    NATION_THRESHOLDS.BUDGET_MIN,
    NATION_THRESHOLDS.BUDGET_MAX
  );

  // Get threshold markers
  const stabilityMarkers = getThresholdMarkers('stability');
  const budgetMarkers = getThresholdMarkers('budget');

  // Determine status colors
  const stabilityStatus = stability >= NATION_THRESHOLDS.STABILITY_HIGH
    ? 'high'
    : stability <= NATION_THRESHOLDS.STABILITY_LOW
      ? 'low'
      : stability <= NATION_THRESHOLDS.STABILITY_COLLAPSE
        ? 'collapse'
        : 'normal';

  const budgetStatus = budget >= NATION_THRESHOLDS.BUDGET_HIGH
    ? 'high'
    : budget <= NATION_THRESHOLDS.BUDGET_LOW
      ? 'low'
      : budget <= NATION_THRESHOLDS.BUDGET_COLLAPSE
        ? 'collapse'
        : 'normal';

  return (
    <div className="space-y-4">
      {/* Stability Track */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏛️</span>
            <span className="font-medium">Stability</span>
            {stabilityStatus === 'high' && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                Flourishing
              </span>
            )}
            {stabilityStatus === 'low' && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                Crisis
              </span>
            )}
            {stabilityStatus === 'collapse' && (
              <span className="animate-pulse rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">
                COLLAPSE
              </span>
            )}
          </div>
          <span className={cn(
            'rounded-lg px-2 py-0.5 font-mono text-lg font-bold',
            stabilityStatus === 'high' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
            stabilityStatus === 'low' && 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
            stabilityStatus === 'collapse' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
            stabilityStatus === 'normal' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
          )}>
            {stability}
          </span>
        </div>

        {/* Track with threshold markers */}
        <div className="relative">
          <div className="nation-track h-3">
            <div
              className={cn(
                'nation-track-fill h-full transition-all duration-500',
                stabilityStatus === 'high' && 'bg-gradient-to-r from-green-400 to-green-500',
                stabilityStatus === 'low' && 'bg-gradient-to-r from-orange-400 to-orange-500',
                stabilityStatus === 'collapse' && 'bg-gradient-to-r from-red-500 to-red-600',
                stabilityStatus === 'normal' && 'bg-gradient-to-r from-blue-400 to-blue-500',
              )}
              style={{ width: `${stabilityPercent}%` }}
            />
          </div>
          {/* Threshold markers */}
          <div
            className="absolute top-0 h-3 w-0.5 bg-red-600"
            style={{ left: `${stabilityMarkers.collapse}%` }}
            title="Collapse threshold"
          />
          <div
            className="absolute top-0 h-3 w-0.5 bg-orange-400"
            style={{ left: `${stabilityMarkers.low}%` }}
            title="Crisis threshold"
          />
          <div
            className="absolute top-0 h-3 w-0.5 bg-green-400"
            style={{ left: `${stabilityMarkers.high}%` }}
            title="Flourishing threshold"
          />
        </div>

        {stabilityStatus !== 'normal' && (
          <p className={cn(
            'text-xs',
            stabilityStatus === 'high' && 'text-green-600',
            stabilityStatus === 'low' && 'text-orange-600',
            stabilityStatus === 'collapse' && 'text-red-600 font-medium',
          )}>
            {stabilityStatus === 'high' && '✓ All players +1 movement'}
            {stabilityStatus === 'low' && '⚠ All players -1 movement'}
            {stabilityStatus === 'collapse' && '✗ Nation has collapsed!'}
          </p>
        )}
      </div>

      {/* Budget Track */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span className="font-medium">Budget</span>
            {budgetStatus === 'high' && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                Surplus
              </span>
            )}
            {budgetStatus === 'low' && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                Deficit
              </span>
            )}
            {budgetStatus === 'collapse' && (
              <span className="animate-pulse rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">
                BANKRUPTCY
              </span>
            )}
          </div>
          <span className={cn(
            'rounded-lg px-2 py-0.5 font-mono text-lg font-bold',
            budgetStatus === 'high' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
            budgetStatus === 'low' && 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
            budgetStatus === 'collapse' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
            budgetStatus === 'normal' && 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
          )}>
            {budget}
          </span>
        </div>

        {/* Track with threshold markers */}
        <div className="relative">
          <div className="nation-track h-3">
            <div
              className={cn(
                'nation-track-fill h-full transition-all duration-500',
                budgetStatus === 'high' && 'bg-gradient-to-r from-green-400 to-green-500',
                budgetStatus === 'low' && 'bg-gradient-to-r from-orange-400 to-orange-500',
                budgetStatus === 'collapse' && 'bg-gradient-to-r from-red-500 to-red-600',
                budgetStatus === 'normal' && 'bg-gradient-to-r from-amber-400 to-amber-500',
              )}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
          {/* Threshold markers */}
          <div
            className="absolute top-0 h-3 w-0.5 bg-red-600"
            style={{ left: `${budgetMarkers.collapse}%` }}
            title="Bankruptcy threshold"
          />
          <div
            className="absolute top-0 h-3 w-0.5 bg-orange-400"
            style={{ left: `${budgetMarkers.low}%` }}
            title="Deficit threshold"
          />
          <div
            className="absolute top-0 h-3 w-0.5 bg-green-400"
            style={{ left: `${budgetMarkers.high}%` }}
            title="Surplus threshold"
          />
        </div>

        {budgetStatus !== 'normal' && (
          <p className={cn(
            'text-xs',
            budgetStatus === 'high' && 'text-green-600',
            budgetStatus === 'low' && 'text-orange-600',
            budgetStatus === 'collapse' && 'text-red-600 font-medium',
          )}>
            {budgetStatus === 'high' && '✓ Active player +1 to dice roll'}
            {budgetStatus === 'low' && '⚠ Active player -1 to dice roll'}
            {budgetStatus === 'collapse' && '✗ Nation has gone bankrupt!'}
          </p>
        )}
      </div>

      {/* Collapse Warning */}
      {(stability <= 2 || budget <= -3) && stability > 0 && budget > -5 && (
        <div className="flex items-center gap-2 rounded-lg border-2 border-red-300 bg-red-50 p-3 dark:border-red-700 dark:bg-red-950">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-medium text-red-800 dark:text-red-200">
              Warning: Nation approaching collapse!
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              {stability <= 2 && `Stability at ${stability} (collapses at 0)`}
              {stability <= 2 && budget <= -3 && ' • '}
              {budget <= -3 && `Budget at ${budget} (collapses at -5)`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
