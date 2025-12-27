'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DecisionCardPayload, CardOptionPayload } from '@/lib/game/events';
import type { Ideology, CardOptionId } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

interface DecisionCardProps {
  card: DecisionCardPayload;
  selectedOption: CardOptionId | null;
  canPropose: boolean;
  localPlayerIdeology: Ideology | null;
  onPropose: (optionId: CardOptionId) => void;
}

export function DecisionCard({
  card,
  selectedOption,
  canPropose,
  localPlayerIdeology,
  onPropose,
}: DecisionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription className="mt-1">
              {card.category.charAt(0).toUpperCase() + card.category.slice(1)} Issue
            </CardDescription>
          </div>
          <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
            {card.zone.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        </div>
        <p className="mt-2 text-sm">{card.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Options */}
        <div className="space-y-3">
          {card.options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
              canSelect={canPropose && !selectedOption}
              localPlayerIdeology={localPlayerIdeology}
              onSelect={() => onPropose(option.id)}
            />
          ))}
        </div>

        {/* Historical Note */}
        {card.historicalNote && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <p className="font-medium text-muted-foreground">Historical Context</p>
            <p className="mt-1">{card.historicalNote}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface OptionCardProps {
  option: CardOptionPayload;
  isSelected: boolean;
  canSelect: boolean;
  localPlayerIdeology: Ideology | null;
  onSelect: () => void;
}

function OptionCard({
  option,
  isSelected,
  canSelect,
  localPlayerIdeology,
  onSelect,
}: OptionCardProps) {
  // Check if this option aligns/opposes with local player's ideology
  const alignedEntry = localPlayerIdeology
    ? option.aligned.find(a => a.ideology === localPlayerIdeology)
    : null;
  const opposedEntry = localPlayerIdeology
    ? option.opposed.find(o => o.ideology === localPlayerIdeology)
    : null;

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-4 transition-all',
        isSelected && 'border-primary bg-primary/5',
        canSelect && !isSelected && 'cursor-pointer hover:border-muted-foreground',
        !canSelect && !isSelected && 'opacity-75'
      )}
      onClick={canSelect ? onSelect : undefined}
    >
      {/* Option Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {option.id}
            </span>
            <span className="font-medium">{option.name}</span>
          </div>
        </div>

        {canSelect && (
          <Button
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? 'Selected' : 'Propose'}
          </Button>
        )}

        {isSelected && !canSelect && (
          <span className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
            Proposed
          </span>
        )}
      </div>

      {/* Effects */}
      <div className="mt-3 grid grid-cols-2 gap-4">
        {/* Budget Change */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Budget:</span>
          <span className={cn(
            'font-medium',
            option.budgetChange > 0 && 'text-green-600',
            option.budgetChange < 0 && 'text-red-600',
          )}>
            {option.budgetChange > 0 ? '+' : ''}{option.budgetChange}
          </span>
        </div>

        {/* Stability Change */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Stability:</span>
          <span className={cn(
            'font-medium',
            option.stabilityChange > 0 && 'text-green-600',
            option.stabilityChange < 0 && 'text-red-600',
          )}>
            {option.stabilityChange > 0 ? '+' : ''}{option.stabilityChange}
          </span>
        </div>
      </div>

      {/* Ideology Effects */}
      <div className="mt-3 space-y-1">
        {/* Aligned */}
        {option.aligned.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-green-600">Favors:</span>
            {option.aligned.map((a) => {
              const def = IDEOLOGY_DEFINITIONS[a.ideology];
              const isLocal = a.ideology === localPlayerIdeology;
              return (
                <span
                  key={a.ideology}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                    isLocal ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-muted'
                  )}
                >
                  {def.icon} +{a.movement}
                  {isLocal && ' (You)'}
                </span>
              );
            })}
          </div>
        )}

        {/* Opposed */}
        {option.opposed.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-red-600">Hurts:</span>
            {option.opposed.map((o) => {
              const def = IDEOLOGY_DEFINITIONS[o.ideology];
              const isLocal = o.ideology === localPlayerIdeology;
              return (
                <span
                  key={o.ideology}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                    isLocal ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-muted'
                  )}
                >
                  {def.icon} -{o.movement}
                  {isLocal && ' (You)'}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Personal Impact Summary */}
      {localPlayerIdeology && (alignedEntry || opposedEntry) && (
        <div className={cn(
          'mt-3 rounded p-2 text-center text-sm',
          alignedEntry && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          opposedEntry && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        )}>
          {alignedEntry && `This option would move you +${alignedEntry.movement} spaces`}
          {opposedEntry && `This option would move you -${opposedEntry.movement} spaces`}
        </div>
      )}
    </div>
  );
}
