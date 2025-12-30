'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Ideology } from '@/lib/game/types';
import { IDEOLOGY_DEFINITIONS } from '@/lib/game/ideologies';

export interface VoteImpact {
  turnNumber: number;
  cardTitle: string;
  optionChosen: string;
  nationChange: {
    stability: number;
    budget: number;
  };
  voteMargin: number; // Positive = passed, negative = failed margin
  impactScore: number; // Calculated significance score
  wasDecisive: boolean; // Was this vote the closest?
}

export interface AlignmentData {
  ideology: Ideology;
  totalVotes: number;
  alignedVotes: number;
  opposedVotes: number;
  alignmentPercentage: number;
}

interface ImpactAnalysisProps {
  impactfulVotes?: VoteImpact[];
  alignmentData?: AlignmentData;
  className?: string;
}

/**
 * ImpactAnalysis - Shows vote impact and ideology alignment statistics
 *
 * Used in GameDebrief to highlight most significant decisions
 */
export function ImpactAnalysis({
  impactfulVotes,
  alignmentData,
  className,
}: ImpactAnalysisProps) {
  // Get top 3 most impactful votes
  const topVotes = impactfulVotes
    ?.sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 3);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Ideology Alignment */}
      {alignmentData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-sm"
                style={{
                  backgroundColor: IDEOLOGY_DEFINITIONS[alignmentData.ideology].color,
                }}
              >
                {IDEOLOGY_DEFINITIONS[alignmentData.ideology].icon}
              </span>
              Ideology Alignment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Alignment Bar */}
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Voting Alignment</span>
                <span className="font-medium">
                  {Math.round(alignmentData.alignmentPercentage)}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${alignmentData.alignmentPercentage}%`,
                    backgroundColor: IDEOLOGY_DEFINITIONS[alignmentData.ideology].color,
                  }}
                />
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-green-600">
                  {alignmentData.alignedVotes}
                </p>
                <p className="text-xs text-muted-foreground">Aligned</p>
              </div>
              <div>
                <p className="text-xl font-bold text-red-600">
                  {alignmentData.opposedVotes}
                </p>
                <p className="text-xs text-muted-foreground">Opposed</p>
              </div>
              <div>
                <p className="text-xl font-bold">{alignmentData.totalVotes}</p>
                <p className="text-xs text-muted-foreground">Total Votes</p>
              </div>
            </div>

            {/* Alignment Message */}
            <p className="text-sm text-muted-foreground">
              {alignmentData.alignmentPercentage >= 80 && (
                <>
                  You were a true champion of {IDEOLOGY_DEFINITIONS[alignmentData.ideology].name}{' '}
                  values, voting consistently with your ideology.
                </>
              )}
              {alignmentData.alignmentPercentage >= 50 &&
                alignmentData.alignmentPercentage < 80 && (
                  <>
                    You balanced ideology with pragmatism, sometimes compromising for the
                    greater good.
                  </>
                )}
              {alignmentData.alignmentPercentage < 50 && (
                <>
                  You frequently voted against your ideology - perhaps coalition building or
                  strategic deals influenced your decisions.
                </>
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Most Impactful Votes */}
      {topVotes && topVotes.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold">Most Impactful Decisions</h3>
          <div className="space-y-3">
            {topVotes.map((vote, idx) => (
              <Card key={vote.turnNumber}>
                <CardContent className="flex items-center gap-4 py-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold',
                      idx === 0
                        ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{vote.cardTitle}</p>
                      {vote.wasDecisive && (
                        <Badge variant="outline" className="text-xs">
                          Decisive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Turn {vote.turnNumber}: {vote.optionChosen}
                    </p>
                    <div className="mt-1 flex gap-2 text-xs">
                      <span
                        className={cn(
                          vote.nationChange.stability > 0
                            ? 'text-green-600'
                            : vote.nationChange.stability < 0
                            ? 'text-red-600'
                            : 'text-muted-foreground'
                        )}
                      >
                        Stability: {vote.nationChange.stability > 0 ? '+' : ''}
                        {vote.nationChange.stability}
                      </span>
                      <span
                        className={cn(
                          vote.nationChange.budget > 0
                            ? 'text-green-600'
                            : vote.nationChange.budget < 0
                            ? 'text-red-600'
                            : 'text-muted-foreground'
                        )}
                      >
                        Budget: {vote.nationChange.budget > 0 ? '+' : ''}
                        {vote.nationChange.budget}
                      </span>
                      <span className="text-muted-foreground">
                        Margin: {vote.voteMargin > 0 ? '+' : ''}
                        {vote.voteMargin}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
