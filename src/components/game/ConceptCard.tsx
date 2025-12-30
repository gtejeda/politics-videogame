'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface PoliticalConcept {
  id: string;
  name: string;
  description: string;
  category: 'coalition' | 'strategy' | 'governance' | 'negotiation';
  examples: string[];
  turnNumber?: number;
}

interface ConceptCardProps {
  concept: PoliticalConcept;
  isHighlighted?: boolean;
  className?: string;
}

const CATEGORY_COLORS: Record<PoliticalConcept['category'], string> = {
  coalition: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  strategy: 'bg-green-500/20 text-green-700 dark:text-green-300',
  governance: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
  negotiation: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
};

const CATEGORY_ICONS: Record<PoliticalConcept['category'], string> = {
  coalition: '🤝',
  strategy: '🎯',
  governance: '⚖️',
  negotiation: '🗣️',
};

/**
 * ConceptCard - Displays a single political concept with examples
 *
 * Used in GameDebrief and CollapseDebrief to show concepts demonstrated during gameplay
 */
export function ConceptCard({
  concept,
  isHighlighted = false,
  className,
}: ConceptCardProps) {
  return (
    <Card
      className={cn(
        'transition-all',
        isHighlighted && 'ring-2 ring-primary ring-offset-2',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <span>{CATEGORY_ICONS[concept.category]}</span>
            {concept.name}
          </CardTitle>
          <Badge variant="secondary" className={CATEGORY_COLORS[concept.category]}>
            {concept.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{concept.description}</p>

        {concept.examples.length > 0 && (
          <div>
            <h4 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
              Examples from this game
            </h4>
            <ul className="space-y-1">
              {concept.examples.map((example, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground" />
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}

        {concept.turnNumber !== undefined && (
          <p className="text-xs text-muted-foreground">
            Demonstrated on Turn {concept.turnNumber}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
