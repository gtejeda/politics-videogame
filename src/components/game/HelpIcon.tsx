'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HelpIconProps {
  onClick: () => void;
  className?: string;
}

/**
 * HelpIcon - Persistent help button visible in all game tabs
 *
 * Floating button that opens the help overlay
 */
export function HelpIcon({ onClick, className }: HelpIconProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={cn(
        'fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg',
        'bg-background/95 backdrop-blur-sm',
        'border-2 border-primary/50 hover:border-primary',
        'transition-all hover:scale-110',
        className
      )}
      aria-label="Open help"
    >
      <span className="text-xl">❓</span>
    </Button>
  );
}
