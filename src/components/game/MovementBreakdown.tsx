'use client';

import { cn } from '@/lib/utils';

interface MovementBreakdownData {
  diceRoll: number | null;
  ideologyBonus: number;
  ideologyPenalty: number;
  nationModifier: number;
  influenceModifier: number;
  total: number;
}

interface MovementBreakdownProps {
  breakdown: MovementBreakdownData;
  showTotal?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * MovementBreakdown - Displays dice roll + modifiers breakdown
 *
 * Shows how the final movement was calculated from dice, ideology alignment,
 * nation state bonuses/penalties, and influence effects.
 */
export function MovementBreakdown({
  breakdown,
  showTotal = true,
  compact = false,
  className,
}: MovementBreakdownProps) {
  const {
    diceRoll,
    ideologyBonus,
    ideologyPenalty,
    nationModifier,
    influenceModifier,
    total,
  } = breakdown;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 text-xs', className)}>
        {diceRoll !== null && diceRoll > 0 && (
          <span className="text-muted-foreground">🎲 {diceRoll}</span>
        )}
        {ideologyBonus > 0 && <span className="text-green-600">+{ideologyBonus} aligned</span>}
        {ideologyPenalty < 0 && <span className="text-red-600">{ideologyPenalty} opposed</span>}
        {nationModifier !== 0 && (
          <span className={nationModifier > 0 ? 'text-green-600' : 'text-red-600'}>
            {nationModifier > 0 ? '+' : ''}{nationModifier} nation
          </span>
        )}
        {influenceModifier !== 0 && (
          <span className={influenceModifier > 0 ? 'text-green-600' : 'text-red-600'}>
            {influenceModifier > 0 ? '+' : ''}{influenceModifier} influence
          </span>
        )}
        {showTotal && (
          <span
            className={cn(
              'font-bold',
              total > 0 && 'text-green-600',
              total < 0 && 'text-red-600',
              total === 0 && 'text-muted-foreground'
            )}
          >
            = {total > 0 ? '+' : ''}{total}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1 text-sm', className)}>
      {/* Dice Roll */}
      {diceRoll !== null && diceRoll > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Dice roll</span>
          <span className="font-medium">+{diceRoll}</span>
        </div>
      )}

      {/* Ideology Bonus */}
      {ideologyBonus > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Ideology aligned</span>
          <span className="font-medium text-green-600">+{ideologyBonus}</span>
        </div>
      )}

      {/* Ideology Penalty */}
      {ideologyPenalty < 0 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Ideology opposed</span>
          <span className="font-medium text-red-600">{ideologyPenalty}</span>
        </div>
      )}

      {/* Nation Modifier */}
      {nationModifier !== 0 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Nation state</span>
          <span
            className={cn(
              'font-medium',
              nationModifier > 0 ? 'text-green-600' : 'text-red-600'
            )}
          >
            {nationModifier > 0 ? '+' : ''}{nationModifier}
          </span>
        </div>
      )}

      {/* Influence Modifier */}
      {influenceModifier !== 0 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Influence modifier</span>
          <span
            className={cn(
              'font-medium',
              influenceModifier > 0 ? 'text-green-600' : 'text-red-600'
            )}
          >
            {influenceModifier > 0 ? '+' : ''}{influenceModifier}
          </span>
        </div>
      )}

      {/* Total */}
      {showTotal && (
        <div className="flex items-center justify-between border-t pt-1">
          <span className="font-medium">Total movement</span>
          <span
            className={cn(
              'font-bold',
              total > 0 && 'text-green-600',
              total < 0 && 'text-red-600',
              total === 0 && 'text-muted-foreground'
            )}
          >
            {total > 0 ? '+' : ''}{total} spaces
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact movement summary for history entries
 */
export function MovementSummary({
  total,
  className,
}: {
  total: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-medium',
        total > 0 && 'text-green-600 dark:text-green-400',
        total < 0 && 'text-red-600 dark:text-red-400',
        total === 0 && 'text-muted-foreground',
        className
      )}
    >
      {total > 0 ? '+' : ''}{total}
    </span>
  );
}
