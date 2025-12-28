'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';
import type { IdeologyPerspectivePayload } from '@/lib/game/events';
import type { Ideology, LikelyVote } from '@/lib/game/types';

interface MoreInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  cardTitle: string;
  cardDescription: string;
  perspectives: IdeologyPerspectivePayload[];
  historicalNote: string | null;
}

/**
 * More Information popup for Decision Cards (FR-017).
 * Shows a comparison table of how each ideology typically approaches this type of decision,
 * plus historical context when available.
 */
export function MoreInfoPopup({
  isOpen,
  onClose,
  cardTitle,
  cardDescription,
  perspectives,
  historicalNote,
}: MoreInfoPopupProps) {
  // Sort perspectives by ideology order for consistent display
  const sortedPerspectives = [...perspectives].sort((a, b) => {
    const order: Ideology[] = ['progressive', 'conservative', 'liberal', 'nationalist', 'populist'];
    return order.indexOf(a.ideology) - order.indexOf(b.ideology);
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">Understanding: {cardTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            {cardDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 space-y-4">
          {/* Ideology Perspectives Table */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              How Different Ideologies Approach This Issue
            </h3>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Ideology</th>
                    <th className="px-3 py-2 text-left font-medium">Typical Stance</th>
                    <th className="px-3 py-2 text-center font-medium w-20">Likely Vote</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPerspectives.map((perspective, index) => {
                    const def = IDEOLOGY_DEFINITIONS[perspective.ideology];
                    return (
                      <tr
                        key={perspective.ideology}
                        className={cn(
                          'border-t',
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        )}
                      >
                        {/* Ideology Column */}
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-full text-sm"
                              style={{ backgroundColor: def.color + '20', color: def.color }}
                            >
                              {def.icon}
                            </span>
                            <span className="font-medium capitalize">{perspective.ideology}</span>
                          </div>
                        </td>

                        {/* Typical Stance Column */}
                        <td className="px-3 py-2 text-muted-foreground">
                          {perspective.typicalStance}
                        </td>

                        {/* Likely Vote Column */}
                        <td className="px-3 py-2 text-center">
                          <LikelyVoteBadge vote={perspective.likelyVote} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Context */}
          {historicalNote && (
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                Historical Context
              </h3>
              <p className="text-sm">{historicalNote}</p>
            </div>
          )}

          {/* Educational Note */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> These are generalized perspectives for educational purposes.
              Real-world political positions vary widely within each ideology, and individual
              politicians often hold nuanced views that don&apos;t fit neatly into categories.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Badge showing the likely vote (Yes/No/Split) with appropriate styling.
 */
function LikelyVoteBadge({ vote }: { vote: LikelyVote }) {
  const styles: Record<LikelyVote, string> = {
    Yes: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    No: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    Split: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  };

  return (
    <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-medium', styles[vote])}>
      {vote}
    </span>
  );
}
