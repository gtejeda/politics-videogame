'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DiceRollProps {
  onRoll: () => void;
}

export function DiceRoll({ onRoll }: DiceRollProps) {
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);
    // Brief animation delay before sending the roll
    setTimeout(() => {
      onRoll();
      setIsRolling(false);
    }, 500);
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center py-8">
        <div
          className={cn(
            'mb-4 flex h-20 w-20 items-center justify-center rounded-lg border-2 text-4xl font-bold transition-all',
            isRolling && 'animate-dice-roll'
          )}
        >
          {isRolling ? '?' : '🎲'}
        </div>

        <Button
          size="lg"
          onClick={handleRoll}
          disabled={isRolling}
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </Button>

        <p className="mt-2 text-sm text-muted-foreground">
          Click to roll and draw a Decision Card
        </p>
      </CardContent>
    </Card>
  );
}
