/**
 * Early Term Decision Cards
 * Zone: Spaces 0-8 (Coalition Formation phase)
 */

import type { DecisionCard } from '../types';

export const SAMPLE_EARLY_TERM_CARDS: DecisionCard[] = [
  {
    id: 'early_001',
    zone: 'earlyTerm',
    category: 'economic',
    title: 'Infrastructure Investment Bill',
    description: 'A major infrastructure bill is proposed. It promises jobs and modernization but requires significant spending.',
    options: [
      {
        id: 'A',
        name: 'Full Investment Package',
        budgetChange: -3,
        stabilityChange: 2,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Private Partnership Model',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Delay for Study',
        budgetChange: 0,
        stabilityChange: -1,
        aligned: [],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Major infrastructure bills like the New Deal in the 1930s or the 2021 Infrastructure Act show how public investment can reshape economies and political fortunes.',
  },
  {
    id: 'early_002',
    zone: 'earlyTerm',
    category: 'social',
    title: 'Education Reform Initiative',
    description: 'Teachers unions are demanding higher wages and smaller class sizes. Parents want more school choice.',
    options: [
      {
        id: 'A',
        name: 'Increase Public School Funding',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
          { ideology: 'conservative', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Expand School Choice',
        budgetChange: -1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Maintain Current System',
        budgetChange: 0,
        stabilityChange: -1,
        aligned: [],
        opposed: [],
      },
    ],
    historicalNote: 'Education reform has been a contentious issue globally, from No Child Left Behind to charter school debates.',
  },
  {
    id: 'early_003',
    zone: 'earlyTerm',
    category: 'security',
    title: 'Border Security Proposal',
    description: 'A surge in border crossings has led to calls for action. Different factions have different solutions.',
    options: [
      {
        id: 'A',
        name: 'Strengthen Border Enforcement',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Reform Immigration Process',
        budgetChange: -1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Address Root Causes Abroad',
        budgetChange: -2,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Immigration policy has shaped nations from Ellis Island to the European migration crisis, often defining political eras.',
  },
  {
    id: 'early_004',
    zone: 'earlyTerm',
    category: 'economic',
    title: 'Tax Reform Package',
    description: 'The tax code needs updating. Business wants lower rates, progressives want more redistribution.',
    options: [
      {
        id: 'A',
        name: 'Cut Business Taxes',
        budgetChange: -2,
        stabilityChange: 0,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Progressive Tax Increase',
        budgetChange: 2,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
          { ideology: 'conservative', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Close Loopholes Only',
        budgetChange: 1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Tax policy debates, from Reagan\'s tax cuts to debates over wealth taxes, often define the economic philosophy of governments.',
  },
  {
    id: 'early_005',
    zone: 'earlyTerm',
    category: 'institutional',
    title: 'Government Ethics Reform',
    description: 'Recent scandals have eroded public trust. Various reforms are proposed to increase transparency.',
    options: [
      {
        id: 'A',
        name: 'Strict Ethics Overhaul',
        budgetChange: -1,
        stabilityChange: 2,
        aligned: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [],
      },
      {
        id: 'B',
        name: 'Industry Self-Regulation',
        budgetChange: 0,
        stabilityChange: 0,
        aligned: [
          { ideology: 'liberal', movement: 1 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Independent Watchdog Agency',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Ethics reforms often follow major scandals, from Watergate-era reforms to modern anti-corruption initiatives worldwide.',
  },
];
