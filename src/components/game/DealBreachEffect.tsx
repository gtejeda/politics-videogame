'use client';

import { TrustBroken } from '@/components/animations/TrustBroken';

interface DealBreachEffectProps {
  isActive: boolean;
  breakerName?: string;
  victimName?: string;
  onComplete?: () => void;
}

/**
 * DealBreachEffect - Wrapper for trust broken animation
 *
 * Shows dramatic effect when a deal is broken during voting
 */
export function DealBreachEffect({
  isActive,
  breakerName,
  victimName,
  onComplete,
}: DealBreachEffectProps) {
  return (
    <TrustBroken
      isActive={isActive}
      breakerName={breakerName}
      victimName={victimName}
      duration={2500}
      onComplete={onComplete}
    />
  );
}
