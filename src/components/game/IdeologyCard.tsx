'use client';

import { cn } from '@/lib/utils';
import type { Ideology } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS, type IdeologyDefinition } from '@/lib/game/ideologies';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface IdeologyCardProps {
  ideology: Ideology;
  showExpanded?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Expanded ideology info content displayed in hover card
 */
function IdeologyExpandedContent({ def }: { def: IdeologyDefinition }) {
  return (
    <div className="space-y-3 p-1">
      {/* Header with icon and name */}
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
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: def.color }} />
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Strategic Tips */}
      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground">
          Strategic Tips
        </h4>
        <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
          {getStrategicTips(def.id).map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-0.5 text-xs">*</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Get strategic tips for each ideology
 */
function getStrategicTips(ideology: Ideology): string[] {
  const tips: Record<Ideology, string[]> = {
    progressive: [
      'Partner with Populists on anti-establishment measures',
      'Watch out for budget pressure from welfare expansion',
      'Use your coalition strength in tight votes',
    ],
    conservative: [
      'Ally with Nationalists on security measures',
      'Protect stability to gain movement bonuses',
      'Use fiscal responsibility as a bargaining chip',
    ],
    liberal: [
      'Support trade and market policies for bonuses',
      'Balance deregulation with stability needs',
      'Work across ideologies on economic issues',
    ],
    nationalist: [
      'Security votes are your strong suit',
      'Protect national interests in negotiations',
      'Crisis events often align with your strengths',
    ],
    populist: [
      'Challenge establishment positions for bonuses',
      'Lead anti-corruption initiatives',
      'Rally support during crisis events',
    ],
  };
  return tips[ideology];
}

/**
 * IdeologyCard - Expanded ideology explanation with hover/tap popover
 *
 * Can be used standalone or as a wrapper around other content
 */
export function IdeologyCard({
  ideology,
  showExpanded = false,
  className,
  children,
}: IdeologyCardProps) {
  const def = IDEOLOGY_DEFINITIONS[ideology];

  // If always showing expanded, render inline
  if (showExpanded) {
    return (
      <div className={cn('rounded-lg border p-4', className)}>
        <IdeologyExpandedContent def={def} />
      </div>
    );
  }

  // Otherwise, render as hover card
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children || (
          <button
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors hover:bg-muted',
              className
            )}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-sm"
              style={{ backgroundColor: def.color }}
            >
              {def.icon}
            </div>
            <span className="font-medium">{def.name}</span>
          </button>
        )}
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="top" align="start">
        <IdeologyExpandedContent def={def} />
      </HoverCardContent>
    </HoverCard>
  );
}
