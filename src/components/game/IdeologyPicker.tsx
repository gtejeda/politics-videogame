'use client';

import { cn } from '@/lib/utils';
import type { Ideology } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS, getAllIdeologies } from '@/lib/game/ideologies';

interface IdeologyPickerProps {
  selectedIdeology: Ideology | null;
  takenIdeologies: Set<Ideology>;
  onSelect: (ideology: Ideology) => void;
}

export function IdeologyPicker({
  selectedIdeology,
  takenIdeologies,
  onSelect,
}: IdeologyPickerProps) {
  const allIdeologies = getAllIdeologies();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allIdeologies.map((ideology) => {
        const def = IDEOLOGY_DEFINITIONS[ideology];
        const isSelected = selectedIdeology === ideology;
        const isTaken = takenIdeologies.has(ideology);
        const isDisabled = isTaken && !isSelected;

        return (
          <button
            key={ideology}
            onClick={() => !isDisabled && onSelect(ideology)}
            disabled={isDisabled}
            className={cn(
              'relative rounded-lg border-2 p-4 text-left transition-all',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              isSelected && 'border-primary ring-2 ring-primary',
              !isSelected && !isDisabled && 'border-muted hover:border-muted-foreground',
              isDisabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                style={{ backgroundColor: def.color }}
              >
                {def.icon}
              </div>
              <div>
                <div className="font-semibold">{def.name}</div>
                <div className="text-xs text-muted-foreground">
                  {def.coreConcern}
                </div>
              </div>
            </div>

            {isTaken && !isSelected && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
                <span className="text-sm text-muted-foreground">Taken</span>
              </div>
            )}

            {isSelected && (
              <div className="absolute right-2 top-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
