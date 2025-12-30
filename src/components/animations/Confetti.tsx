'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  pieceCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

const DEFAULT_COLORS = [
  '#3B82F6', // Blue (Progressive)
  '#EF4444', // Red (Conservative)
  '#F59E0B', // Orange (Liberal)
  '#10B981', // Green (Nationalist)
  '#8B5CF6', // Purple (Populist)
  '#FFD700', // Gold
  '#FF69B4', // Pink
];

/**
 * Confetti - Celebratory particle animation for victory moments
 *
 * Creates falling confetti pieces that cascade down the screen
 */
export function Confetti({
  isActive,
  duration = 3000,
  pieceCount = 100,
  colors = DEFAULT_COLORS,
  onComplete,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const generatePieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < pieceCount; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
      });
    }
    return newPieces;
  }, [pieceCount, colors]);

  useEffect(() => {
    if (isActive) {
      setPieces(generatePieces());
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [isActive, duration, generatePieces, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: `${piece.y}vh`,
                rotate: piece.rotation,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
