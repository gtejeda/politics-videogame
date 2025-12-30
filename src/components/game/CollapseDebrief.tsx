'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConceptCard, type PoliticalConcept } from './ConceptCard';

export interface HistoricalParallel {
  id: string;
  title: string;
  period: string;
  country: string;
  description: string;
  outcome: string;
  relevanceNote: string;
}

export interface CollapseDebriefData {
  /** Reason for collapse */
  collapseReason: 'stability' | 'budget';
  /** Final stability value */
  finalStability: number;
  /** Final budget value */
  finalBudget: number;
  /** Number of turns before collapse */
  turnsBeforeCollapse: number;
  /** Political concepts demonstrated */
  concepts: PoliticalConcept[];
  /** Historical parallel event */
  historicalParallel?: HistoricalParallel;
  /** Key decisions that contributed to collapse */
  criticalDecisions?: Array<{
    turn: number;
    description: string;
    impact: string;
  }>;
}

interface CollapseDebriefProps {
  data: CollapseDebriefData;
  className?: string;
}

const COLLAPSE_REASONS = {
  stability: {
    icon: '⚠️',
    title: 'Government Collapsed - Instability',
    color: 'text-red-600 dark:text-red-400',
    description:
      'The government has fallen due to extreme political instability. Public confidence has eroded beyond recovery.',
  },
  budget: {
    icon: '💸',
    title: 'Government Collapsed - Financial Crisis',
    color: 'text-amber-600 dark:text-amber-400',
    description:
      'The treasury is empty. The government can no longer function and must step down.',
  },
};

/**
 * CollapseDebrief - Post-game summary for collapsed government scenarios
 *
 * Shows historical parallels, critical decisions, and political concepts
 */
export function CollapseDebrief({ data, className }: CollapseDebriefProps) {
  const {
    collapseReason,
    finalStability,
    finalBudget,
    turnsBeforeCollapse,
    concepts,
    historicalParallel,
    criticalDecisions,
  } = data;

  const reasonInfo = COLLAPSE_REASONS[collapseReason];

  return (
    <div className={className}>
      {/* Collapse Header */}
      <Card className="mb-6 border-red-500/50">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${reasonInfo.color}`}>
            <span className="text-2xl">{reasonInfo.icon}</span>
            {reasonInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{reasonInfo.description}</p>

          {/* Final State Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-500">{finalStability}</p>
              <p className="text-xs text-muted-foreground">Final Stability</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-500">{finalBudget}</p>
              <p className="text-xs text-muted-foreground">Final Budget</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{turnsBeforeCollapse}</p>
              <p className="text-xs text-muted-foreground">Turns Played</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Parallel */}
      {historicalParallel && (
        <Card className="mb-6 bg-muted/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <span>📜</span>
                Historical Parallel
              </CardTitle>
              <Badge variant="outline">
                {historicalParallel.country}, {historicalParallel.period}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <h4 className="font-semibold">{historicalParallel.title}</h4>
            <p className="text-sm text-muted-foreground">
              {historicalParallel.description}
            </p>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <p className="text-sm font-medium">Outcome</p>
              <p className="text-sm text-muted-foreground">
                {historicalParallel.outcome}
              </p>
            </div>
            <p className="text-xs italic text-muted-foreground">
              {historicalParallel.relevanceNote}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Critical Decisions */}
      {criticalDecisions && criticalDecisions.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">Critical Decisions</h3>
          <div className="space-y-2">
            {criticalDecisions.map((decision, idx) => (
              <Card key={idx} className="p-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary">Turn {decision.turn}</Badge>
                  <div>
                    <p className="text-sm font-medium">{decision.description}</p>
                    <p className="text-xs text-muted-foreground">{decision.impact}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Political Concepts */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Political Concepts Observed</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {concepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </div>
    </div>
  );
}
