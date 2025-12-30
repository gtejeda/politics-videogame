'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { GamePhase } from '@/lib/game/types';
import {
  PHASE_HELP,
  TERM_DEFINITIONS,
  DEAL_HELP,
  type PhaseHelp,
  type TermDefinition,
} from '@/lib/game/help-content';

type HelpTab = 'phase' | 'terms' | 'deals';

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase?: GamePhase;
}

/**
 * HelpOverlay - Contextual help panel with phase-specific content
 *
 * Shows help content based on current game phase, term definitions,
 * and deal system explanation
 */
export function HelpOverlay({ isOpen, onClose, currentPhase }: HelpOverlayProps) {
  const [activeTab, setActiveTab] = useState<HelpTab>('phase');

  const phaseHelp = currentPhase ? PHASE_HELP[currentPhase] : null;
  const terms = Object.values(TERM_DEFINITIONS);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - semi-transparent to keep game visible */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Help panel */}
          <motion.div
            className={cn(
              'fixed right-0 top-0 z-50 h-full w-full max-w-md',
              'bg-background/95 shadow-2xl backdrop-blur-sm',
              'overflow-hidden border-l'
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-bold">Game Help</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close help"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b">
              <TabButton
                active={activeTab === 'phase'}
                onClick={() => setActiveTab('phase')}
              >
                Current Phase
              </TabButton>
              <TabButton
                active={activeTab === 'terms'}
                onClick={() => setActiveTab('terms')}
              >
                Game Terms
              </TabButton>
              <TabButton
                active={activeTab === 'deals'}
                onClick={() => setActiveTab('deals')}
              >
                Deals
              </TabButton>
            </div>

            {/* Tab content */}
            <div className="h-[calc(100%-8rem)] overflow-y-auto p-4">
              {activeTab === 'phase' && (
                <PhaseContent phaseHelp={phaseHelp ?? null} currentPhase={currentPhase} />
              )}
              {activeTab === 'terms' && <TermsContent terms={terms} />}
              {activeTab === 'deals' && <DealsContent />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={cn(
        'flex-1 px-4 py-3 text-sm font-medium transition-colors',
        active
          ? 'border-b-2 border-primary text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function PhaseContent({
  phaseHelp,
  currentPhase,
}: {
  phaseHelp: PhaseHelp | null;
  currentPhase?: GamePhase;
}) {
  if (!phaseHelp) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          {currentPhase
            ? `Help content for "${currentPhase}" phase is not available.`
            : 'Start a game to see phase-specific help.'}
        </p>
        <div className="rounded-lg border bg-muted/50 p-4">
          <h3 className="mb-2 font-medium">General Tips</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Work together to keep the nation stable</li>
            <li>Balance individual progress with collective health</li>
            <li>Use deals to build trust and cooperation</li>
            <li>Watch your Influence - you need 3+ to win!</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Phase title and description */}
      <div>
        <h3 className="mb-2 text-xl font-bold">{phaseHelp.title}</h3>
        <p className="text-muted-foreground">{phaseHelp.description}</p>
      </div>

      {/* Available actions */}
      <div>
        <h4 className="mb-2 font-medium">What You Can Do</h4>
        <ul className="space-y-2">
          {phaseHelp.availableActions.map((action, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-primary">•</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="mb-2 font-medium">Tips</h4>
        <ul className="space-y-2">
          {phaseHelp.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5">💡</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TermsContent({ terms }: { terms: TermDefinition[] }) {
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="mb-4 text-sm text-muted-foreground">
        Click on a term to learn more about it.
      </p>
      {terms.map((term) => (
        <motion.div
          key={term.term}
          className="rounded-lg border bg-card"
          layout
        >
          <button
            className="flex w-full items-center justify-between p-3 text-left"
            onClick={() =>
              setExpandedTerm(expandedTerm === term.term ? null : term.term)
            }
          >
            <span className="font-medium">{term.displayName}</span>
            <span className="text-muted-foreground">
              {expandedTerm === term.term ? '−' : '+'}
            </span>
          </button>
          <AnimatePresence>
            {expandedTerm === term.term && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 border-t px-3 pb-3 pt-3">
                  <p className="text-sm">{term.definition}</p>
                  <div className="rounded bg-muted/50 p-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Why It Matters
                    </p>
                    <p className="text-sm">{term.whyItMatters}</p>
                  </div>
                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground">
                        Related:
                      </span>
                      {term.relatedTerms.map((related) => {
                        const relatedDef = terms.find((t) => t.term === related);
                        return (
                          <button
                            key={related}
                            className="text-xs text-primary hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedTerm(related);
                            }}
                          >
                            {relatedDef?.displayName || related}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function DealsContent() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div>
        <h3 className="mb-2 text-xl font-bold">Making Deals</h3>
        <p className="text-muted-foreground">{DEAL_HELP.overview}</p>
      </div>

      {/* Steps */}
      <div>
        <h4 className="mb-2 font-medium">How to Make a Deal</h4>
        <ol className="space-y-2">
          {DEAL_HELP.steps.map((step, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Consequences */}
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <h4 className="mb-2 font-medium text-destructive">Breaking Deals</h4>
        <p className="text-sm">{DEAL_HELP.consequences}</p>
      </div>

      {/* Strategic value */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="mb-2 font-medium">Strategic Value</h4>
        <p className="text-sm text-muted-foreground">{DEAL_HELP.strategicValue}</p>
      </div>
    </div>
  );
}
