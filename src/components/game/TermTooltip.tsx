'use client';

import { ReactNode } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { cn } from '@/lib/utils';
import { getTermDefinition } from '@/lib/game/help-content';

interface TermTooltipProps {
  term: string;
  children: ReactNode;
  className?: string;
}

/**
 * TermTooltip - Hover tooltip for game term explanations
 *
 * Wraps any content and shows a tooltip with the term definition on hover.
 * Uses Radix UI HoverCard for accessibility and consistent behavior.
 */
export function TermTooltip({ term, children, className }: TermTooltipProps) {
  const definition = getTermDefinition(term);

  if (!definition) {
    // If no definition found, just render children without tooltip
    return <>{children}</>;
  }

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <span
          className={cn(
            'cursor-help border-b border-dotted border-primary/50',
            'hover:border-primary hover:text-primary',
            'transition-colors',
            className
          )}
        >
          {children}
        </span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className={cn(
            'z-50 w-72 rounded-lg border bg-popover p-4 shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2'
          )}
          sideOffset={5}
          align="center"
        >
          <div className="space-y-2">
            <h4 className="font-semibold">{definition.displayName}</h4>
            <p className="text-sm text-muted-foreground">{definition.definition}</p>
            <div className="rounded bg-muted/50 p-2">
              <p className="text-xs font-medium text-muted-foreground">
                Why It Matters
              </p>
              <p className="text-xs">{definition.whyItMatters}</p>
            </div>
          </div>
          <HoverCard.Arrow className="fill-popover" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

/**
 * Inline variant that matches surrounding text better
 */
export function TermTooltipInline({ term, children, className }: TermTooltipProps) {
  const definition = getTermDefinition(term);

  if (!definition) {
    return <>{children}</>;
  }

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <span
          className={cn(
            'cursor-help underline decoration-dotted decoration-primary/50 underline-offset-2',
            'hover:decoration-primary',
            className
          )}
        >
          {children}
        </span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className={cn(
            'z-50 w-64 rounded-md border bg-popover p-3 shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
          sideOffset={5}
          align="center"
        >
          <p className="text-sm">{definition.definition}</p>
          <HoverCard.Arrow className="fill-popover" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
