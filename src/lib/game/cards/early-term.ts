/**
 * Early Term Decision Cards
 * Zone: Spaces 0-8 (Coalition Formation phase)
 */

import type { DecisionCard, IdeologyPerspective } from '../types';

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
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Support public investment in infrastructure as economic stimulus and job creation, preferring direct government funding.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Cautious about large government spending, prefer private-sector solutions and worry about debt.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Support infrastructure but prefer market-based approaches like public-private partnerships.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Support domestic infrastructure that strengthens national capacity and reduces foreign dependence.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Support projects that benefit working people and rural areas, skeptical of elite-favoring projects.', likelyVote: 'Yes' },
    ],
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
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Prioritize public school funding and teacher support, viewing education as a public good requiring equal access for all.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Support school choice and local control, believing competition improves outcomes and parents should decide.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Favor market-based education reforms including charter schools and vouchers to promote innovation.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Emphasize civic education and national curriculum standards to strengthen cultural identity.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Support whatever helps working families access quality education, skeptical of elite private school advantages.', likelyVote: 'Yes' },
    ],
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
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Favor humanitarian approaches, expanded legal pathways, and addressing root causes of migration over enforcement.', likelyVote: 'No' },
      { ideology: 'conservative', typicalStance: 'Prioritize border security and rule of law, supporting enforcement measures while favoring legal immigration.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Balance security with economic benefits of immigration, supporting orderly processes and labor market needs.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Strongly support border enforcement to protect national sovereignty, culture, and domestic workers.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Concerned about labor competition and wage suppression, may support enforcement while criticizing corporate exploitation.', likelyVote: 'Split' },
    ],
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
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Support progressive taxation to reduce inequality and fund social programs, often advocating wealth taxes.', likelyVote: 'No' },
      { ideology: 'conservative', typicalStance: 'Favor lower taxes to promote economic growth, believing individuals spend money more efficiently than government.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Support business-friendly tax policies to encourage investment and economic dynamism.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Focus on tax policies that benefit domestic industries and workers over multinational corporations.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Oppose tax breaks for wealthy elites and corporations, demanding fairness for working families.', likelyVote: 'No' },
    ],
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
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Strongly support ethics reforms to reduce corporate influence and increase government accountability to citizens.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Support transparency but prefer limited government intervention, wary of bureaucratic overreach in enforcement.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Favor transparency and disclosure requirements but prefer industry self-regulation over heavy-handed mandates.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Support reforms that reduce foreign influence in government and strengthen national institutions.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Strongly support anti-corruption measures to drain the swamp and hold elites accountable.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'early_006',
    zone: 'earlyTerm',
    category: 'social',
    title: 'Healthcare Access Debate',
    description: 'Rural hospitals are closing while urban centers have excess capacity. How should the administration address this healthcare gap?',
    options: [
      {
        id: 'A',
        name: 'Rural Healthcare Subsidies',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Telemedicine Expansion',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [],
      },
      {
        id: 'C',
        name: 'Market Consolidation Approach',
        budgetChange: 0,
        stabilityChange: -1,
        aligned: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Rural-urban healthcare disparities have been a constant challenge. The Hill-Burton Act of 1946 built rural hospitals, while modern closures reflect changing economics.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Support universal healthcare access as a right, favoring public subsidies and expansion of coverage programs.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Prefer market-based solutions and telemedicine innovation over government subsidies and intervention.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Support technology-driven solutions and public-private partnerships to expand access efficiently.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Prioritize domestic healthcare capacity and reduced dependence on foreign medical supply chains.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Strongly support rural healthcare access, viewing hospital closures as abandonment of working communities.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'early_007',
    zone: 'earlyTerm',
    category: 'economic',
    title: 'Minimum Wage Proposal',
    description: 'Labor advocates push for a wage increase while businesses warn of job losses. The current minimum has not kept pace with inflation.',
    options: [
      {
        id: 'A',
        name: 'Significant Increase (50%+)',
        budgetChange: -1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Modest Indexed Increase',
        budgetChange: 0,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 1 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Regional Variation Framework',
        budgetChange: 0,
        stabilityChange: 0,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Minimum wage debates date back to 1938 in the US. Research on the 1994 New Jersey increase challenged assumptions about employment effects.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Strongly support significant minimum wage increases to address inequality and ensure living wages for workers.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Oppose mandated wage increases, believing market forces should determine wages and that increases cause job losses.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Support modest, indexed increases that balance worker welfare with business flexibility and regional variation.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Support higher wages for domestic workers while ensuring policies do not encourage outsourcing or illegal labor.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Strongly support wage increases that help working families, viewing low wages as exploitation by corporations.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'early_008',
    zone: 'earlyTerm',
    category: 'security',
    title: 'Cybersecurity Framework',
    description: 'A wave of cyberattacks has exposed vulnerabilities in critical infrastructure. Tech companies and civil liberties groups have competing proposals.',
    options: [
      {
        id: 'A',
        name: 'Mandatory Security Standards',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Public-Private Partnership',
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
        name: 'Information Sharing Network',
        budgetChange: -1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'liberal', movement: 1 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Cybersecurity policy evolved rapidly after events like the 2007 Estonia attacks and the 2020 SolarWinds breach, reshaping national security priorities.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Support strong regulations but with privacy protections, wary of surveillance overreach in cybersecurity measures.', likelyVote: 'Split' },
      { ideology: 'conservative', typicalStance: 'Support national security measures but prefer voluntary compliance and minimal regulatory burden on businesses.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Favor public-private partnerships and market-driven solutions, trusting tech industry expertise over mandates.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Strongly support mandatory security standards to protect critical infrastructure from foreign adversaries.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Skeptical of both big tech and big government solutions, want protection without elite control of information.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'early_009',
    zone: 'earlyTerm',
    category: 'institutional',
    title: 'Cabinet Diversity Initiative',
    description: 'The new administration must staff key positions. Should diversity be prioritized alongside expertise, and how explicit should such goals be?',
    options: [
      {
        id: 'A',
        name: 'Explicit Representation Targets',
        budgetChange: 0,
        stabilityChange: 0,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Merit with Outreach',
        budgetChange: 0,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [],
      },
      {
        id: 'C',
        name: 'Traditional Appointment Process',
        budgetChange: 0,
        stabilityChange: 0,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Cabinet composition has evolved significantly, from the all-white-male norm to modern diverse cabinets. Representation in leadership affects both policy and public trust.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Strongly support explicit diversity goals to address historical underrepresentation and bring diverse perspectives to governance.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Oppose explicit quotas or targets, believing appointments should be based purely on qualifications and merit.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Support diversity through expanded outreach and pipeline development rather than explicit numeric targets.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Focus on loyalty and alignment with national priorities rather than demographic representation.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Support representation of working-class and non-elite backgrounds, wary of diversity as elite virtue signaling.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'early_010',
    zone: 'earlyTerm',
    category: 'economic',
    title: 'Small Business Support Package',
    description: 'Small businesses face increasing pressure from large corporations and online retailers. Various support mechanisms are proposed.',
    options: [
      {
        id: 'A',
        name: 'Direct Subsidies and Tax Breaks',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'populist', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Anti-Monopoly Enforcement',
        budgetChange: -1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
        ],
      },
      {
        id: 'C',
        name: 'Regulatory Relief Package',
        budgetChange: 0,
        stabilityChange: 0,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Small business advocacy has shaped policy from the Robinson-Patman Act to modern antitrust debates. Main Street vs. Wall Street remains a potent political divide.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Support antitrust enforcement against monopolies and predatory practices that harm small businesses and communities.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Favor regulatory relief and tax breaks to help small businesses compete, skeptical of direct subsidies.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Support free market competition but wary of regulations that might reduce economic efficiency or innovation.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Support local businesses as the backbone of communities, opposing policies that favor foreign or multinational corporations.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Strongly support Main Street over Wall Street, viewing small business protection as essential for working communities.', likelyVote: 'Yes' },
    ],
  },
];
