'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConceptCard, type PoliticalConcept } from './ConceptCard';
import { ImpactAnalysis, type VoteImpact, type AlignmentData } from './ImpactAnalysis';

export interface GameDebriefData {
  /** Concepts demonstrated during gameplay */
  concepts: PoliticalConcept[];
  /** Number of turns played */
  turnsPlayed: number;
  /** Vote impact analysis for most impactful decisions */
  impactfulVotes?: VoteImpact[];
  /** Ideology alignment data */
  alignmentData?: AlignmentData;
}

interface GameDebriefProps {
  data: GameDebriefData;
  winnerName?: string;
  isCollapse?: boolean;
  className?: string;
}

/**
 * GameDebrief - Post-game summary showing concepts, impact analysis, and statistics
 *
 * Shows different content based on game length:
 * - 5+ turns: Full debrief with minimum 3 concepts
 * - <5 turns: Available concepts with "more concepts in longer games" message
 */
export function GameDebrief({
  data,
  winnerName,
  isCollapse = false,
  className,
}: GameDebriefProps) {
  const { concepts, turnsPlayed, impactfulVotes, alignmentData } = data;
  const shortGame = turnsPlayed < 5;

  return (
    <div className={className}>
      {/* Game Summary Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{isCollapse ? '📊' : '🏆'}</span>
            {isCollapse ? 'Game Analysis' : `${winnerName} Wins!`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold">{turnsPlayed}</p>
              <p className="text-xs text-muted-foreground">Turns Played</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{concepts.length}</p>
              <p className="text-xs text-muted-foreground">Concepts Shown</p>
            </div>
            {alignmentData && (
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(alignmentData.alignmentPercentage)}%
                </p>
                <p className="text-xs text-muted-foreground">Ideology Alignment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Political Concepts Section */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold">Political Concepts Demonstrated</h3>
        {shortGame && concepts.length < 3 && (
          <p className="mb-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            More concepts emerge in longer games. Play 5+ turns to see the full political
            landscape unfold!
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {concepts.map((concept) => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              isHighlighted={concept.examples.length >= 2}
            />
          ))}
        </div>
      </div>

      {/* Impact Analysis Section */}
      {(impactfulVotes || alignmentData) && (
        <ImpactAnalysis
          impactfulVotes={impactfulVotes}
          alignmentData={alignmentData}
        />
      )}
    </div>
  );
}
