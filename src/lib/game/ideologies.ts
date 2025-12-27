/**
 * Ideology definitions with colors, icons, and core concerns
 * Derived from specs/001-politics-game-core/data-model.md
 */

import type { Ideology } from './types';

export interface IdeologyDefinition {
  id: Ideology;
  name: string;
  color: string;
  colorClass: string;
  icon: string;
  coreConcern: string;
  description: string;
  strengths: string[];
  alignedCategories: string[];
}

export const IDEOLOGY_DEFINITIONS: Record<Ideology, IdeologyDefinition> = {
  progressive: {
    id: 'progressive',
    name: 'Progressive',
    color: '#3B82F6',
    colorClass: 'bg-ideology-progressive',
    icon: '🔷',
    coreConcern: 'Social reform, equality',
    description: 'Advocates for social change, equality, and progressive reforms. Values collective welfare and institutional transformation.',
    strengths: ['Social policy', 'Equality measures', 'Reform initiatives'],
    alignedCategories: ['social', 'institutional'],
  },
  conservative: {
    id: 'conservative',
    name: 'Conservative',
    color: '#EF4444',
    colorClass: 'bg-ideology-conservative',
    icon: '🔶',
    coreConcern: 'Stability, tradition',
    description: 'Values stability, tradition, and proven institutions. Prefers gradual change and fiscal responsibility.',
    strengths: ['Fiscal policy', 'Traditional institutions', 'Stability measures'],
    alignedCategories: ['economic', 'institutional'],
  },
  liberal: {
    id: 'liberal',
    name: 'Liberal',
    color: '#F59E0B',
    colorClass: 'bg-ideology-liberal',
    icon: '🟡',
    coreConcern: 'Markets, liberty',
    description: 'Champions free markets, individual liberty, and limited government intervention. Believes in economic freedom.',
    strengths: ['Market policy', 'Deregulation', 'Trade agreements'],
    alignedCategories: ['economic'],
  },
  nationalist: {
    id: 'nationalist',
    name: 'Nationalist',
    color: '#10B981',
    colorClass: 'bg-ideology-nationalist',
    icon: '🟢',
    coreConcern: 'Sovereignty, security',
    description: 'Prioritizes national sovereignty, security, and domestic interests. Focuses on protecting borders and national identity.',
    strengths: ['Security policy', 'Border control', 'National industries'],
    alignedCategories: ['security'],
  },
  populist: {
    id: 'populist',
    name: 'Populist',
    color: '#8B5CF6',
    colorClass: 'bg-ideology-populist',
    icon: '🟣',
    coreConcern: 'Anti-establishment',
    description: 'Represents "the people" against perceived elites. Values direct action and challenging established power structures.',
    strengths: ['Popular measures', 'Anti-corruption', 'Direct democracy'],
    alignedCategories: ['crisis', 'social'],
  },
};

/**
 * Get ideology definition by ID
 */
export function getIdeology(ideology: Ideology): IdeologyDefinition {
  return IDEOLOGY_DEFINITIONS[ideology];
}

/**
 * Get ideology color
 */
export function getIdeologyColor(ideology: Ideology): string {
  return IDEOLOGY_DEFINITIONS[ideology].color;
}

/**
 * Get ideology icon
 */
export function getIdeologyIcon(ideology: Ideology): string {
  return IDEOLOGY_DEFINITIONS[ideology].icon;
}

/**
 * Check if an ideology is aligned with a category
 */
export function isIdeologyAlignedWithCategory(ideology: Ideology, category: string): boolean {
  return IDEOLOGY_DEFINITIONS[ideology].alignedCategories.includes(category);
}

/**
 * Get all ideology IDs
 */
export function getAllIdeologies(): Ideology[] {
  return Object.keys(IDEOLOGY_DEFINITIONS) as Ideology[];
}
