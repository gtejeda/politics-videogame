/**
 * Crisis Zone Decision Cards
 * Zone: Spaces 21-27 (High-stakes urgent challenges)
 */

import type { DecisionCard, IdeologyPerspective } from '../types';

export const CRISIS_ZONE_CARDS: DecisionCard[] = [
  {
    id: 'crisis_001',
    zone: 'crisisZone',
    category: 'economic',
    title: 'Economic Recession Emergency',
    description:
      'GDP has contracted for three consecutive quarters. Unemployment is surging, businesses are closing, and the treasury is depleted. Immediate action is required to prevent total economic collapse.',
    options: [
      {
        id: 'A',
        name: 'Massive Stimulus Package',
        budgetChange: -4,
        stabilityChange: 2,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Austerity and Structural Reform',
        budgetChange: 2,
        stabilityChange: -3,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
      },
      {
        id: 'C',
        name: 'Targeted Industry Bailouts',
        budgetChange: -2,
        stabilityChange: 0,
        aligned: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'The 2008 Global Financial Crisis saw nations choose between stimulus (Obama\'s Recovery Act) and austerity (European debt crisis measures), with dramatically different outcomes for recovery speed and social stability.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives prioritize protecting workers and families through government spending, viewing recessions as times when the state must act boldly to prevent suffering.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives favor fiscal discipline and structural reforms, believing that markets will self-correct faster without government intervention creating long-term debt.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Liberals support targeted interventions that maintain market stability while preserving individual economic freedom and avoiding excessive government control.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists prioritize protecting domestic industries and jobs, supporting bailouts for strategic sectors that preserve national economic sovereignty.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Populists demand relief for ordinary citizens over corporations, often opposing bailouts for banks and big business while supporting direct aid to workers.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'crisis_002',
    zone: 'crisisZone',
    category: 'crisis',
    title: 'Pandemic Response',
    description:
      'A deadly pathogen is spreading rapidly. Hospitals are overwhelmed, and the public is panicking. Every day of delay means more deaths, but heavy restrictions will devastate the economy.',
    options: [
      {
        id: 'A',
        name: 'Strict Nationwide Lockdown',
        budgetChange: -3,
        stabilityChange: -2,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Regional Response with Economic Protection',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Prioritize Herd Immunity Strategy',
        budgetChange: -1,
        stabilityChange: -4,
        aligned: [
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'COVID-19 exposed deep political divides over pandemic response, from Sweden\'s light-touch approach to China\'s strict lockdowns, with each nation\'s response reflecting its political culture.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives emphasize collective responsibility and scientific guidance, supporting strict public health measures even at economic cost to save lives.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives balance public health with economic concerns and personal liberty, often preferring voluntary compliance over mandates.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Liberals struggle between individual freedoms and collective welfare, typically supporting proportionate regional responses that minimize both health and economic damage.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists support strong border controls and domestic self-sufficiency in medical supplies, viewing the crisis through a national security lens.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Populists often distrust elite medical institutions and government mandates, emphasizing personal choice and skepticism of lockdown measures.', likelyVote: 'No' },
    ],
  },
  {
    id: 'crisis_003',
    zone: 'crisisZone',
    category: 'security',
    title: 'Terrorist Threat Alert',
    description:
      'Intelligence agencies have confirmed an imminent large-scale terrorist attack. The threat is credible but acting on incomplete information risks civil liberties and international relations.',
    options: [
      {
        id: 'A',
        name: 'Emergency Security Powers',
        budgetChange: -3,
        stabilityChange: 1,
        aligned: [
          { ideology: 'nationalist', movement: 3 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'progressive', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Targeted Intelligence Operations',
        budgetChange: -2,
        stabilityChange: 0,
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
        name: 'Community Engagement and De-escalation',
        budgetChange: -1,
        stabilityChange: -2,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'The aftermath of 9/11 saw the PATRIOT Act expand surveillance powers, while the UK\'s response to IRA threats showed how democracies balance security and civil liberties differently.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives prioritize civil liberties and due process, warning that emergency powers often become permanent and disproportionately affect minority communities.', likelyVote: 'No' },
      { ideology: 'conservative', typicalStance: 'Conservatives support strong security measures and law enforcement powers, viewing public safety as the primary government responsibility.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Liberals seek proportionate responses that preserve constitutional rights while addressing genuine threats through targeted intelligence operations.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists strongly support emergency security measures, viewing them as essential to protecting national sovereignty and the homeland.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Populists are divided, supporting strong security but distrusting government surveillance powers that could be turned against ordinary citizens.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'crisis_004',
    zone: 'crisisZone',
    category: 'institutional',
    title: 'Constitutional Crisis',
    description:
      'The Supreme Court has ruled against the executive, but the President refuses to comply. The military is seeking guidance, and protestors are gathering. The constitutional order hangs in the balance.',
    options: [
      {
        id: 'A',
        name: 'Enforce Court Ruling by Any Means',
        budgetChange: -2,
        stabilityChange: -3,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 3 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Negotiate Constitutional Amendment',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Call Snap Elections',
        budgetChange: -2,
        stabilityChange: -1,
        aligned: [
          { ideology: 'populist', movement: 3 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
        ],
      },
    ],
    historicalNote:
      'From Andrew Jackson\'s defiance of the Supreme Court to the Weimar Republic\'s collapse, constitutional crises reveal whether institutions or personalities ultimately govern nations.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives strongly defend institutional checks and balances, viewing judicial independence as essential to protecting minority rights and democratic norms.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives emphasize constitutional order and institutional stability, typically supporting negotiated solutions that preserve governmental continuity.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Liberals prioritize rule of law and constitutional compliance, strongly supporting enforcement of court rulings as foundational to democratic governance.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Nationalists may support executive action if framed as defending national interests, viewing courts as potentially obstructing necessary decisive leadership.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Populists often view such conflicts as elite power struggles, potentially supporting snap elections to let "the people" resolve the dispute directly.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'crisis_005',
    zone: 'crisisZone',
    category: 'crisis',
    title: 'Civil Unrest and Mass Protests',
    description:
      'Massive protests have erupted across major cities following a controversial incident. Some have turned violent, and police are demanding more authority while activists demand systemic reform.',
    options: [
      {
        id: 'A',
        name: 'Deploy National Guard',
        budgetChange: -2,
        stabilityChange: -2,
        aligned: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Announce Major Reform Commission',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
          { ideology: 'conservative', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Emergency Town Halls with Protest Leaders',
        budgetChange: 0,
        stabilityChange: 0,
        aligned: [
          { ideology: 'populist', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'The 2020 George Floyd protests and France\'s Yellow Vest movement show how civil unrest can force rapid policy changes or harden government resistance, depending on the political response.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives typically sympathize with protesters demanding systemic reform, viewing unrest as a symptom of unaddressed injustice requiring substantive change.', likelyVote: 'No' },
      { ideology: 'conservative', typicalStance: 'Conservatives prioritize law and order, supporting strong measures to restore peace while viewing reforms as separate from immediate security concerns.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Liberals seek balanced responses that address legitimate grievances through reform commissions while maintaining public safety and rule of law.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists strongly support deploying security forces to restore order, viewing unrest as a threat to national unity and stability.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Populists may support protesters as expressing popular discontent with elites, preferring direct engagement over both force and bureaucratic commissions.', likelyVote: 'No' },
    ],
  },
  {
    id: 'crisis_006',
    zone: 'crisisZone',
    category: 'crisis',
    title: 'Catastrophic Natural Disaster',
    description:
      'A devastating earthquake has struck the capital region. Thousands are dead, infrastructure is destroyed, and millions need immediate assistance. International aid is offered but with strings attached.',
    options: [
      {
        id: 'A',
        name: 'Accept All International Aid',
        budgetChange: 1,
        stabilityChange: 2,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'progressive', movement: 2 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Military-Led Domestic Response',
        budgetChange: -4,
        stabilityChange: 1,
        aligned: [
          { ideology: 'nationalist', movement: 3 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Public-Private Reconstruction Partnership',
        budgetChange: -2,
        stabilityChange: 0,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'Haiti\'s 2010 earthquake and Japan\'s 2011 tsunami showed how disaster response reveals governmental capacity and international relations, with recovery taking years or decades.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives support accepting international aid and cooperation, viewing disasters as opportunities for global solidarity and equitable reconstruction.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives prefer organized, disciplined responses through military and established institutions, emphasizing order and efficient resource allocation.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Liberals favor pragmatic solutions combining international aid with private sector partnerships to maximize reconstruction efficiency and speed.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Nationalists strongly prefer domestic self-reliance through military-led response, viewing foreign aid conditions as threats to sovereignty.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Populists demand immediate relief for affected citizens, often skeptical of both foreign influence and private sector profiteering from disaster.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'crisis_007',
    zone: 'crisisZone',
    category: 'security',
    title: 'Foreign Invasion Threat',
    description:
      'A hostile nation has massed troops on the border and issued an ultimatum. Diplomatic channels are strained, allies are cautious, and military advisors are presenting options with no good outcomes.',
    options: [
      {
        id: 'A',
        name: 'Full Military Mobilization',
        budgetChange: -4,
        stabilityChange: -1,
        aligned: [
          { ideology: 'nationalist', movement: 3 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Urgent Diplomatic Summit',
        budgetChange: -1,
        stabilityChange: -2,
        aligned: [
          { ideology: 'liberal', movement: 3 },
          { ideology: 'progressive', movement: 2 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
        ],
      },
      {
        id: 'C',
        name: 'Concessions to Avoid Conflict',
        budgetChange: 0,
        stabilityChange: -4,
        aligned: [
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
      },
    ],
    historicalNote:
      'The Cuban Missile Crisis, Ukraine 2022, and the lead-up to both World Wars show how nations respond to existential threats, with decisions made in days affecting generations.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives prioritize diplomatic solutions and international cooperation, warning that military escalation often leads to greater suffering and rarely achieves stated goals.', likelyVote: 'No' },
      { ideology: 'conservative', typicalStance: 'Conservatives support strong defense and military preparedness, viewing deterrence through strength as essential to national survival.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Liberals favor exhausting diplomatic options first while maintaining defensive readiness, seeking alliance coordination and international pressure.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists strongly support full military mobilization to defend the homeland, viewing any concessions as weakness inviting further aggression.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Populists are divided, with some supporting strong defense while others question whether ordinary citizens should bear the costs of elite-driven conflicts.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'crisis_008',
    zone: 'crisisZone',
    category: 'economic',
    title: 'Banking System Collapse',
    description:
      'Three major banks have failed simultaneously. ATMs are empty, businesses cannot make payroll, and a bank run is spreading. Without action, the entire financial system will collapse within days.',
    options: [
      {
        id: 'A',
        name: 'Full Government Takeover of Banks',
        budgetChange: -4,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Emergency Bailout with Strict Conditions',
        budgetChange: -3,
        stabilityChange: 0,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 2 },
        ],
      },
      {
        id: 'C',
        name: 'Let Banks Fail, Protect Depositors Only',
        budgetChange: -2,
        stabilityChange: -3,
        aligned: [
          { ideology: 'populist', movement: 3 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'The 2008 bank bailouts sparked the Tea Party and Occupy movements, while Iceland\'s decision to let banks fail and jail bankers offered an alternative path that remains debated.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives view bank failures as evidence of systemic problems requiring public control, supporting nationalization to prevent future crises and protect citizens.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives prefer market solutions and oppose government takeovers, though may reluctantly support conditional bailouts to prevent broader economic collapse.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Liberals support bailouts with strict conditions, reform requirements, and taxpayer protections, viewing them as necessary to maintain economic stability.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists focus on protecting domestic savers and strategic industries, potentially supporting intervention to prevent foreign takeover of financial sector.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Populists strongly oppose bailouts that reward wealthy bankers while ordinary people suffer, demanding depositor protection and banker accountability instead.', likelyVote: 'No' },
    ],
  },
  {
    id: 'crisis_009',
    zone: 'crisisZone',
    category: 'crisis',
    title: 'Critical Energy Shortage',
    description:
      'Pipeline sabotage and plant failures have created an energy emergency. Hospitals are on backup power, factories are shutting down, and winter is approaching. Rationing is inevitable.',
    options: [
      {
        id: 'A',
        name: 'Emergency Fossil Fuel Expansion',
        budgetChange: -2,
        stabilityChange: 2,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'nationalist', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Mandatory Rationing with Price Controls',
        budgetChange: -1,
        stabilityChange: -2,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Emergency Energy Imports at Premium Prices',
        budgetChange: -4,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'The 1973 Oil Crisis reshaped global politics, while Europe\'s 2022 energy crisis after the Ukraine invasion showed how energy dependence creates geopolitical vulnerability.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives oppose fossil fuel expansion even in crisis, advocating for fair rationing and viewing the emergency as reason to accelerate clean energy transition.', likelyVote: 'No' },
      { ideology: 'conservative', typicalStance: 'Conservatives support emergency fossil fuel production to ensure reliable energy supply, prioritizing immediate economic stability over environmental concerns.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Liberals favor market-based solutions like premium imports, avoiding both heavy government intervention and environmental damage from expanded extraction.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists strongly support domestic energy production for energy independence, viewing reliance on imports as an unacceptable security vulnerability.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Populists demand price controls and rationing to protect ordinary citizens from energy profiteering, opposing both corporate bailouts and expensive imports.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'crisis_010',
    zone: 'crisisZone',
    category: 'institutional',
    title: 'Impeachment and Political Scandal',
    description:
      'Evidence has emerged of serious presidential misconduct. The opposition demands impeachment, allies are wavering, and the nation is deeply divided. The government is paralyzed while the crisis rages.',
    options: [
      {
        id: 'A',
        name: 'Fast-Track Impeachment Proceedings',
        budgetChange: -1,
        stabilityChange: -3,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
          { ideology: 'nationalist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Independent Special Prosecutor',
        budgetChange: -1,
        stabilityChange: -1,
        aligned: [
          { ideology: 'liberal', movement: 3 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Negotiated Resignation with Immunity',
        budgetChange: 0,
        stabilityChange: 2,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'From Nixon\'s Watergate to Clinton\'s impeachment to Brazil\'s Dilma Rousseff removal, political scandals test whether accountability or stability takes precedence in democracies.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives demand full accountability and transparent proceedings, viewing presidential misconduct as an opportunity to strengthen democratic norms and institutions.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives often prioritize stability and proper process, supporting independent investigation over rushed impeachment that could destabilize governance.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Liberals strongly support rule of law through independent prosecution, ensuring thorough investigation while maintaining procedural integrity and due process.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists may view impeachment as weakening national leadership during critical times, preferring negotiated solutions that maintain strong executive authority.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Populists often frame the scandal through anti-elite lens, supporting whatever outcome punishes corrupt politicians while distrusting establishment-led processes.', likelyVote: 'Split' },
    ],
  },
];
