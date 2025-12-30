/**
 * Concept Tracking Hook
 * Tracks political concepts demonstrated during gameplay
 */

import { useMemo, useCallback } from 'react';
import type { PoliticalConcept } from '@/components/game/ConceptCard';
import type { RoomStatePayload, DealPayload } from '@/lib/game/events';

/** Predefined political concepts that can be demonstrated in game */
export const POLITICAL_CONCEPTS: Record<string, Omit<PoliticalConcept, 'examples' | 'turnNumber'>> = {
  'coalition-building': {
    id: 'coalition-building',
    name: 'Coalition Building',
    description:
      'Working with other ideologies to achieve shared goals. In real politics, coalition governments are common when no single party has a majority.',
    category: 'coalition',
  },
  'logrolling': {
    id: 'logrolling',
    name: 'Logrolling',
    description:
      'Trading votes on different issues. "I\'ll support your bill if you support mine." A common legislative practice.',
    category: 'negotiation',
  },
  'horse-trading': {
    id: 'horse-trading',
    name: 'Horse Trading',
    description:
      'Direct negotiation and deal-making between politicians. Named after bargaining practices at horse markets.',
    category: 'negotiation',
  },
  'strategic-voting': {
    id: 'strategic-voting',
    name: 'Strategic Voting',
    description:
      'Voting against your preferences to achieve a better outcome. Sometimes called "tactical voting" in elections.',
    category: 'strategy',
  },
  'fiscal-responsibility': {
    id: 'fiscal-responsibility',
    name: 'Fiscal Responsibility',
    description:
      'Balancing budget concerns with policy goals. Governments must maintain financial stability while serving citizens.',
    category: 'governance',
  },
  'stability-over-ideology': {
    id: 'stability-over-ideology',
    name: 'Stability Over Ideology',
    description:
      'Prioritizing government stability over ideological purity. Sometimes compromise is necessary to keep the ship afloat.',
    category: 'governance',
  },
  'trust-and-reputation': {
    id: 'trust-and-reputation',
    name: 'Trust and Reputation',
    description:
      'Building or losing trust through honoring or breaking deals. In politics, reputation is a crucial currency.',
    category: 'negotiation',
  },
  'collective-action': {
    id: 'collective-action',
    name: 'Collective Action',
    description:
      'Working together to solve shared problems. Crisis response often requires setting aside differences.',
    category: 'coalition',
  },
  'ideological-alignment': {
    id: 'ideological-alignment',
    name: 'Ideological Alignment',
    description:
      'Voting consistently with your political beliefs. Parties maintain identity through consistent positions.',
    category: 'strategy',
  },
  'compromise-legislation': {
    id: 'compromise-legislation',
    name: 'Compromise Legislation',
    description:
      'Finding middle-ground policies that different factions can accept. Most real legislation involves compromise.',
    category: 'governance',
  },
};

export interface ConceptEvent {
  conceptId: string;
  turnNumber: number;
  example: string;
}

interface UseConceptTrackingReturn {
  /** Get concepts demonstrated based on game events */
  getTrackedConcepts: (
    roomState: RoomStatePayload,
    gameEvents: GameEvent[]
  ) => PoliticalConcept[];
  /** Check if a specific concept was demonstrated */
  wasConceptDemonstrated: (conceptId: string, events: ConceptEvent[]) => boolean;
  /** Get all available concept definitions */
  allConcepts: typeof POLITICAL_CONCEPTS;
}

/** Types of game events that can trigger concept tracking */
export interface GameEvent {
  type: 'vote' | 'deal' | 'crisis' | 'movement';
  turnNumber: number;
  data: VoteEvent | DealEvent | CrisisEvent | MovementEvent;
}

export interface VoteEvent {
  voterId: string;
  voterIdeology: string;
  cardCategory: string;
  voteChoice: 'yes' | 'no' | 'abstain';
  wasAligned: boolean;
  passed: boolean;
  margin: number;
}

export interface DealEvent {
  initiatorId: string;
  responderId: string;
  dealStatus: 'honored' | 'broken' | 'active';
}

export interface CrisisEvent {
  contributors: string[];
  totalContributions: number;
  threshold: number;
  resolved: boolean;
}

export interface MovementEvent {
  playerId: string;
  positionChange: number;
  reason: string;
}

/**
 * Hook for tracking political concepts demonstrated during gameplay
 */
export function useConceptTracking(): UseConceptTrackingReturn {
  const getTrackedConcepts = useCallback(
    (roomState: RoomStatePayload, gameEvents: GameEvent[]): PoliticalConcept[] => {
      const conceptEvents: Map<string, ConceptEvent[]> = new Map();

      // Analyze each game event
      for (const event of gameEvents) {
        const detectedConcepts = analyzeEvent(event, roomState);
        for (const conceptEvent of detectedConcepts) {
          const existing = conceptEvents.get(conceptEvent.conceptId) || [];
          existing.push(conceptEvent);
          conceptEvents.set(conceptEvent.conceptId, existing);
        }
      }

      // Convert to PoliticalConcept objects
      const concepts: PoliticalConcept[] = [];
      for (const [conceptId, events] of conceptEvents.entries()) {
        const baseConcept = POLITICAL_CONCEPTS[conceptId];
        if (baseConcept) {
          concepts.push({
            ...baseConcept,
            examples: events.map((e) => e.example),
            turnNumber: events[0]?.turnNumber,
          });
        }
      }

      return concepts;
    },
    []
  );

  const wasConceptDemonstrated = useCallback(
    (conceptId: string, events: ConceptEvent[]): boolean => {
      return events.some((e) => e.conceptId === conceptId);
    },
    []
  );

  return {
    getTrackedConcepts,
    wasConceptDemonstrated,
    allConcepts: POLITICAL_CONCEPTS,
  };
}

/**
 * Analyze a game event and detect demonstrated concepts
 */
function analyzeEvent(event: GameEvent, roomState: RoomStatePayload): ConceptEvent[] {
  const detected: ConceptEvent[] = [];

  switch (event.type) {
    case 'vote': {
      const vote = event.data as VoteEvent;

      // Strategic voting: voting against ideology
      if (!vote.wasAligned && vote.voteChoice !== 'abstain') {
        detected.push({
          conceptId: 'strategic-voting',
          turnNumber: event.turnNumber,
          example: `A player voted ${vote.voteChoice} against their ideological preference on Turn ${event.turnNumber}`,
        });
      }

      // Ideological alignment: voting with ideology
      if (vote.wasAligned) {
        detected.push({
          conceptId: 'ideological-alignment',
          turnNumber: event.turnNumber,
          example: `Player voted consistently with their ideology on Turn ${event.turnNumber}`,
        });
      }

      // Close margin votes
      if (Math.abs(vote.margin) <= 1 && vote.passed) {
        detected.push({
          conceptId: 'compromise-legislation',
          turnNumber: event.turnNumber,
          example: `A closely contested vote passed with a margin of ${vote.margin} on Turn ${event.turnNumber}`,
        });
      }
      break;
    }

    case 'deal': {
      const deal = event.data as DealEvent;

      // Deal making
      detected.push({
        conceptId: 'horse-trading',
        turnNumber: event.turnNumber,
        example: `A deal was made between players on Turn ${event.turnNumber}`,
      });

      // Trust dynamics
      if (deal.dealStatus === 'honored') {
        detected.push({
          conceptId: 'trust-and-reputation',
          turnNumber: event.turnNumber,
          example: `A deal was honored, building trust between players`,
        });
      } else if (deal.dealStatus === 'broken') {
        detected.push({
          conceptId: 'trust-and-reputation',
          turnNumber: event.turnNumber,
          example: `A deal was broken, damaging political reputation`,
        });
      }
      break;
    }

    case 'crisis': {
      const crisis = event.data as CrisisEvent;

      // Collective action
      if (crisis.contributors.length > 1) {
        detected.push({
          conceptId: 'collective-action',
          turnNumber: event.turnNumber,
          example: `${crisis.contributors.length} players worked together during a crisis`,
        });
      }

      // Coalition building during crisis
      if (crisis.resolved && crisis.contributors.length >= 3) {
        detected.push({
          conceptId: 'coalition-building',
          turnNumber: event.turnNumber,
          example: `Players formed a coalition to resolve the crisis on Turn ${event.turnNumber}`,
        });
      }
      break;
    }
  }

  return detected;
}
