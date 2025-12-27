'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimerProps {
  endAt: number;
  onExpire?: () => void;
}

export function Timer({ endAt, onExpire }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endAt - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isLow = timeLeft <= 30;
  const isCritical = timeLeft <= 10;

  return (
    <div
      className={cn(
        'rounded-lg px-4 py-2 text-center font-mono text-xl font-bold transition-colors',
        isCritical && 'animate-pulse bg-red-500 text-white',
        isLow && !isCritical && 'bg-amber-500 text-white',
        !isLow && 'bg-muted'
      )}
    >
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}
