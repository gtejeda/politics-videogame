'use client';

import { useState, useEffect } from 'react';
import { Collapse } from '@/components/animations/Collapse';

interface CollapseSequenceProps {
  reason: 'stability' | 'budget';
  onComplete?: () => void;
}

/**
 * CollapseSequence - Dramatic collapse animation sequence
 *
 * Wrapper around Collapse animation with proper sequencing
 */
export function CollapseSequence({ reason, onComplete }: CollapseSequenceProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Ensure animation plays on mount
    setIsPlaying(true);
  }, []);

  return (
    <Collapse
      isActive={isPlaying}
      reason={reason}
      duration={2500}
      onComplete={() => {
        setIsPlaying(false);
        onComplete?.();
      }}
    />
  );
}
