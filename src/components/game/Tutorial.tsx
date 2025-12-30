'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  TUTORIAL_STEPS,
  getTutorialStepCount,
  hasNextStep,
  hasPreviousStep,
} from '@/lib/game/tutorial-steps';
import { usePlayerPrefs } from '@/lib/hooks/usePlayerPrefs';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface TutorialProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Tutorial - "How to Play" modal with step navigation
 *
 * Displays the tutorial steps defined in tutorial-steps.ts
 * Allows navigation between steps and marks tutorial complete when finished
 */
export function Tutorial({ open, onOpenChange }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeTutorial } = usePlayerPrefs();
  const totalSteps = getTutorialStepCount();

  const step = TUTORIAL_STEPS[currentStep];

  const handleNext = useCallback(() => {
    if (hasNextStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finished tutorial
      completeTutorial();
      onOpenChange(false);
      setCurrentStep(0); // Reset for next time
    }
  }, [currentStep, completeTutorial, onOpenChange]);

  const handlePrev = useCallback(() => {
    if (hasPreviousStep(currentStep)) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setCurrentStep(0);
  }, [onOpenChange]);

  const handleSkip = useCallback(() => {
    completeTutorial();
    onOpenChange(false);
    setCurrentStep(0);
  }, [completeTutorial, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span>📖</span>
              How to Play
            </DialogTitle>
            <button
              onClick={handleClose}
              className="rounded-full p-1 hover:bg-muted"
              aria-label="Close tutorial"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <DialogDescription>
            Step {currentStep + 1} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[200px] space-y-4 py-4"
          >
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="text-muted-foreground">{step.content}</p>

            {step.bullets && step.bullets.length > 0 && (
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {step.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            )}

            {/* Visual hint - placeholder for images/highlights */}
            {step.visualType !== 'none' && step.visualRef && (
              <div className="rounded-lg border-2 border-dashed border-muted p-4 text-center text-sm text-muted-foreground">
                [Visual: {step.visualRef}]
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="flex gap-1">
          {TUTORIAL_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-colors ${
                idx <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={!hasPreviousStep(currentStep)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="flex gap-2">
            {hasNextStep(currentStep) && (
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Skip Tutorial
              </Button>
            )}
            <Button onClick={handleNext}>
              {hasNextStep(currentStep) ? (
                <>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                "Let's Play!"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
