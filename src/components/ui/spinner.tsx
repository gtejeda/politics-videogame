'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-solid border-primary border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', submessage, size = 'md' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner size={size} />
      <div className="text-center">
        <p className="text-muted-foreground">{message}</p>
        {submessage && (
          <p className="mt-1 text-sm text-muted-foreground/70">{submessage}</p>
        )}
      </div>
    </div>
  );
}
