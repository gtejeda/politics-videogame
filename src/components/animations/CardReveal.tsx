'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DecisionCardPayload } from '@/lib/game/events';

interface CardRevealProps {
  card: DecisionCardPayload;
  onComplete?: () => void;
}

// Zone-specific styling
const zoneStyles = {
  earlyTerm: {
    gradient: 'from-blue-400 to-blue-600',
    label: 'Early Term',
    icon: '🏛️',
  },
  midTerm: {
    gradient: 'from-green-400 to-green-600',
    label: 'Mid Term',
    icon: '⚖️',
  },
  crisisZone: {
    gradient: 'from-orange-400 to-red-600',
    label: 'Crisis Zone',
    icon: '⚠️',
  },
  lateTerm: {
    gradient: 'from-purple-400 to-purple-600',
    label: 'Late Term',
    icon: '🏆',
  },
};

// Category styling
const categoryStyles = {
  economic: { icon: '💰', color: 'text-amber-600' },
  social: { icon: '👥', color: 'text-blue-600' },
  security: { icon: '🛡️', color: 'text-red-600' },
  institutional: { icon: '🏛️', color: 'text-purple-600' },
  crisis: { icon: '🚨', color: 'text-orange-600' },
};

export function CardReveal({ card, onComplete }: CardRevealProps) {
  const zone = zoneStyles[card.zone] || zoneStyles.earlyTerm;
  const category = categoryStyles[card.category] || categoryStyles.economic;

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        initial={{ rotateY: 180, scale: 0.5, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
        onAnimationComplete={onComplete}
        className="perspective-1000"
      >
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 bg-card shadow-2xl">
          {/* Zone Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              'flex items-center justify-between px-4 py-3 bg-gradient-to-r text-white',
              `bg-gradient-to-r ${zone.gradient}`
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{zone.icon}</span>
              <span className="font-medium">{zone.label}</span>
            </div>
            <div className={cn('flex items-center gap-1 rounded-full bg-white/20 px-2 py-1')}>
              <span>{category.icon}</span>
              <span className="text-xs capitalize">{card.category}</span>
            </div>
          </motion.div>

          {/* Card Content */}
          <div className="p-5">
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-3 text-xl font-bold"
            >
              {card.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-4 text-sm text-muted-foreground leading-relaxed"
            >
              {card.description}
            </motion.p>

            {/* Options Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Available Options
              </div>
              <div className="flex flex-wrap gap-2">
                {card.options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {option.id}
                    </span>
                    <span className="text-sm">{option.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Historical Note Preview */}
            {card.historicalNote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="mt-4 flex items-start gap-2 rounded-lg bg-muted/30 p-3"
              >
                <span className="text-lg">📚</span>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {card.historicalNote}
                </div>
              </motion.div>
            )}
          </div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary to-transparent blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-gradient-to-tr from-secondary to-transparent blur-3xl" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
