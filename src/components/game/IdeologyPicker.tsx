'use client';

import { cn } from '@/lib/utils';
import type { Ideology } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS, getAllIdeologies } from '@/lib/game/ideologies';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

/**
 * Strategic tips for each ideology
 */
function getStrategicTips(ideology: Ideology): string[] {
  const tips: Record<Ideology, string[]> = {
    progressive: [
      'Partner with Populists on anti-establishment measures',
      'Watch out for budget pressure from welfare expansion',
    ],
    conservative: [
      'Ally with Nationalists on security measures',
      'Protect stability to gain movement bonuses',
    ],
    liberal: [
      'Support trade and market policies for bonuses',
      'Balance deregulation with stability needs',
    ],
    nationalist: [
      'Security votes are your strong suit',
      'Crisis events often align with your strengths',
    ],
    populist: [
      'Challenge establishment positions for bonuses',
      'Rally support during crisis events',
    ],
  };
  return tips[ideology];
}

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
          <HoverCard key={ideology} openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <button
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
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="top" align="start">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                    style={{ backgroundColor: def.color }}
                  >
                    {def.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{def.name}</div>
                    <div className="text-sm text-muted-foreground">{def.coreConcern}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{def.description}</p>

                {/* Strengths */}
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                    Strengths
                  </h4>
                  <ul className="mt-1 space-y-1">
                    {def.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: def.color }}
                        />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strategic Tips */}
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                    Tips
                  </h4>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    {getStrategicTips(ideology).map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-0.5 text-xs">*</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
}
