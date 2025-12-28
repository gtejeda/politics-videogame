/**
 * Mid-Term Decision Cards
 * Zone: Spaces 9-20 (Governance Challenges phase)
 * More complex challenges with meaningful tradeoffs
 */

import type { DecisionCard, IdeologyPerspective } from '../types';

export const MID_TERM_CARDS: DecisionCard[] = [
  {
    id: 'mid_001',
    zone: 'midTerm',
    category: 'social',
    title: 'Universal Healthcare Reform',
    description: 'Healthcare costs are spiraling. Advocacy groups demand universal coverage while industry lobbies for market-based solutions.',
    options: [
      {
        id: 'A',
        name: 'Single-Payer System',
        budgetChange: -3,
        stabilityChange: 2,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Public Option with Private Markets',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Deregulate Insurance Markets',
        budgetChange: 1,
        stabilityChange: -1,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Healthcare reform has defined political eras, from the UK\'s NHS creation in 1948 to the Affordable Care Act debates. Nations that achieved universal coverage often saw initial resistance followed by broad public support.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Healthcare is a fundamental human right that should be guaranteed by the state. Single-payer systems eliminate inefficiencies and ensure universal access.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Market-based healthcare encourages innovation and personal responsibility. Government-run systems lead to rationing and reduced quality of care.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'A mixed approach balancing market efficiency with access protections is optimal. Public options can coexist with private insurance to maximize choice.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Healthcare policy should prioritize citizens and national self-sufficiency. The specific approach matters less than ensuring the nation can care for its own people.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'The healthcare system is rigged to benefit insurance companies and pharmaceutical giants at the expense of ordinary people. Major reform is needed to put people first.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'mid_002',
    zone: 'midTerm',
    category: 'security',
    title: 'Foreign Policy Doctrine',
    description: 'A regional conflict threatens to escalate. Allies request intervention while domestic opinion is divided on international commitments.',
    options: [
      {
        id: 'A',
        name: 'Military Intervention with Allies',
        budgetChange: -3,
        stabilityChange: -1,
        aligned: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Diplomatic Sanctions Only',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Non-Intervention Policy',
        budgetChange: 1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'populist', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Foreign policy doctrines from the Monroe Doctrine to the Truman Doctrine have shaped global politics. The debate between interventionism and isolationism resurfaces in each generation.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Military intervention often causes more harm than good and should be a last resort. Diplomatic and humanitarian approaches are preferable to armed conflict.', likelyVote: 'No' },
      { ideology: 'conservative', typicalStance: 'A strong military posture and willingness to use force protects national interests and maintains global stability. Weakness invites aggression.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'International institutions and multilateral cooperation should guide foreign policy. Intervention may be justified when supported by allies and international law.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Military strength is essential to protect national sovereignty and interests abroad. The nation must be willing to act decisively when its interests are threatened.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Foreign wars benefit defense contractors and elites while ordinary citizens pay the price. Resources should be spent at home, not on foreign adventures.', likelyVote: 'No' },
    ],
  },
  {
    id: 'mid_003',
    zone: 'midTerm',
    category: 'economic',
    title: 'Environmental Regulation Package',
    description: 'Industry leaders warn of job losses from stricter environmental rules, while scientists report accelerating climate damage.',
    options: [
      {
        id: 'A',
        name: 'Comprehensive Carbon Tax',
        budgetChange: 2,
        stabilityChange: -2,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Cap-and-Trade System',
        budgetChange: 1,
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
        name: 'Voluntary Industry Standards',
        budgetChange: 0,
        stabilityChange: 1,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
        ],
      },
    ],
    historicalNote: 'From the Clean Air Act to the Paris Agreement, environmental policy has evolved from local pollution control to global climate governance. The economic impacts of regulation remain hotly debated.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Climate change is an existential threat requiring immediate, transformative action. The costs of inaction far outweigh the costs of aggressive regulation and carbon pricing.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Environmental regulations should be balanced against economic costs and job impacts. Market-based solutions and voluntary measures are preferable to heavy-handed mandates.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Cap-and-trade and other market mechanisms can achieve environmental goals efficiently. Properly designed incentives align business interests with environmental outcomes.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Environmental policy should not disadvantage domestic industries compared to foreign competitors. Any regulations must consider national competitiveness.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Working families should not bear the burden of environmental policies that raise energy costs while corporations continue polluting. Elites push green agendas that hurt ordinary people.', likelyVote: 'No' },
    ],
  },
  {
    id: 'mid_004',
    zone: 'midTerm',
    category: 'social',
    title: 'Labor Rights Expansion',
    description: 'Unions demand stronger protections and collective bargaining rights. Businesses argue for labor market flexibility.',
    options: [
      {
        id: 'A',
        name: 'Strengthen Union Rights',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Gig Economy Regulations',
        budgetChange: 0,
        stabilityChange: 0,
        aligned: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Right-to-Work Expansion',
        budgetChange: 0,
        stabilityChange: -1,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
      },
    ],
    historicalNote: 'Labor movements have shaped modern economies, from the Wagner Act enabling unionization to the decline of union membership since the 1980s. The gig economy presents new challenges to traditional labor frameworks.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Strong unions are essential for protecting workers and reducing inequality. Collective bargaining ensures fair wages and safe working conditions.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Labor market flexibility benefits both employers and workers. Excessive union power can reduce competitiveness and limit individual worker choice.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Workers should have the freedom to organize or not as they choose. Regulations should balance worker protections with economic flexibility.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Protecting domestic workers from unfair foreign competition is important. Strong labor standards can help maintain middle-class jobs at home.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Workers have been exploited by corporations and need stronger protections. Unions give ordinary people power against wealthy business interests.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'mid_005',
    zone: 'midTerm',
    category: 'economic',
    title: 'Housing Affordability Crisis',
    description: 'Housing costs have outpaced wages in major cities. Young voters demand action while property owners resist changes.',
    options: [
      {
        id: 'A',
        name: 'National Rent Control',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 3 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Public Housing Investment',
        budgetChange: -3,
        stabilityChange: 2,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Zoning Deregulation',
        budgetChange: 0,
        stabilityChange: -1,
        aligned: [
          { ideology: 'liberal', movement: 3 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Housing policy has ranged from post-war public housing projects to market-driven approaches. Cities like Vienna maintained public housing while others like London privatized council housing with varying results.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Housing is a human right and government must intervene to ensure affordability. Rent control and public housing protect vulnerable communities from displacement.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Property rights must be respected. Market-based solutions and reduced regulations will increase housing supply more effectively than government intervention.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Zoning reform and reducing regulatory barriers can increase housing supply through market mechanisms. Both NIMBY restrictions and rent control can distort markets.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Housing policy should prioritize citizens and families. Foreign investment in housing markets may need restrictions to keep homes affordable for nationals.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Housing has become unaffordable because wealthy investors and landlords have rigged the system. Direct intervention is needed to help ordinary families afford homes.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'mid_006',
    zone: 'midTerm',
    category: 'institutional',
    title: 'Tech Platform Regulation',
    description: 'Social media platforms face accusations of spreading misinformation and stifling competition. Industry warns of innovation costs.',
    options: [
      {
        id: 'A',
        name: 'Break Up Tech Monopolies',
        budgetChange: -1,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Content Moderation Standards',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Industry Self-Governance',
        budgetChange: 0,
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
    ],
    historicalNote: 'Tech regulation echoes earlier debates over railroad trusts and telecom monopolies. The EU\'s GDPR and Digital Markets Act represent emerging regulatory frameworks for the digital age.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Big Tech monopolies threaten democracy and worker rights. Breaking up concentrated power and regulating platforms protects users and competition.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Tech platforms have shown political bias in content moderation. Accountability measures may be needed, but heavy regulation could harm innovation.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Free markets generally work best, but monopoly power can distort competition. Light-touch regulation preserving innovation while ensuring competition is ideal.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Domestic tech industry should be protected from foreign competitors while ensuring platforms serve national interests. Data sovereignty is a key concern.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Tech billionaires have too much power over information and the economy. The platforms that ordinary people rely on should not be controlled by a handful of elites.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'mid_007',
    zone: 'midTerm',
    category: 'social',
    title: 'Press Freedom Standards',
    description: 'Media consolidation and accusations of bias have eroded trust in journalism. Some demand protections while others want accountability.',
    options: [
      {
        id: 'A',
        name: 'Media Ownership Limits',
        budgetChange: 0,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Public Broadcasting Expansion',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Deregulate Media Markets',
        budgetChange: 0,
        stabilityChange: -1,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Press freedom has been essential to democracy since the abolition of licensing acts. Models range from the American private media tradition to the BBC model of public service broadcasting.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Media consolidation threatens democracy by limiting diverse voices. Public broadcasting and ownership limits protect independent journalism.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Media bias is a real problem, but government intervention in media can be dangerous. Market solutions and viewer choice are preferable to regulation.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Press freedom is fundamental to democracy. While some ownership rules may be justified, the free market of ideas generally serves the public best.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Foreign ownership of media outlets threatens national discourse. Media should reflect and serve the national interest, not foreign agendas.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Mainstream media is controlled by elites who push their agenda on ordinary people. Breaking up media monopolies gives regular voices a chance to be heard.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'mid_008',
    zone: 'midTerm',
    category: 'institutional',
    title: 'Judicial System Reform',
    description: 'Court backlogs and accusations of judicial activism have sparked reform debates. Some want expansion, others want limits.',
    options: [
      {
        id: 'A',
        name: 'Expand Court System',
        budgetChange: -2,
        stabilityChange: 2,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Term Limits for Judges',
        budgetChange: 0,
        stabilityChange: -1,
        aligned: [
          { ideology: 'populist', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Limit Judicial Review Scope',
        budgetChange: 0,
        stabilityChange: -2,
        aligned: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Judicial reform debates have occurred from FDR\'s court-packing plan to modern debates over term limits. The balance between judicial independence and democratic accountability remains contested.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Courts should reflect society and expand access to justice. Structural reforms can address backlogs and ensure the judiciary serves all citizens equally.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Judicial independence must be protected from political interference. Courts should interpret law as written, not legislate from the bench.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'An independent judiciary is essential for protecting rights and checking government power. Reform should strengthen, not undermine, judicial independence.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Courts should apply national law and not defer to international bodies. Judicial sovereignty is part of national sovereignty.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Unelected judges should not override the will of the people. Term limits and accountability measures can make courts more responsive to ordinary citizens.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'mid_009',
    zone: 'midTerm',
    category: 'security',
    title: 'Military Spending Review',
    description: 'Defense contractors push for modernization spending while social programs compete for limited funds. Allies expect contributions.',
    options: [
      {
        id: 'A',
        name: 'Major Defense Expansion',
        budgetChange: -3,
        stabilityChange: 1,
        aligned: [
          { ideology: 'nationalist', movement: 3 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Modernize Existing Forces',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [],
      },
      {
        id: 'C',
        name: 'Peace Dividend Cuts',
        budgetChange: 2,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Military spending has been contentious from Eisenhower\'s military-industrial complex warning to post-Cold War peace dividend debates. Defense budgets often reflect broader ideological priorities.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Military spending is excessive and diverts resources from social needs. Defense cuts can fund education, healthcare, and infrastructure.', likelyVote: 'No' },
      { ideology: 'conservative', typicalStance: 'A strong military is essential for national security and global stability. Adequate defense spending is a core government responsibility.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Defense spending should be efficient and aligned with strategic priorities. Neither excessive militarism nor dangerous weakness serves national interests.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Military power is the foundation of national sovereignty and global influence. A strong defense ensures the nation can protect its interests.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Defense contractors get rich while veterans struggle and communities lack services. Military spending should benefit ordinary citizens, not corporate interests.', likelyVote: 'No' },
    ],
  },
  {
    id: 'mid_010',
    zone: 'midTerm',
    category: 'economic',
    title: 'Social Security Solvency',
    description: 'Demographic shifts threaten pension fund solvency. Current retirees expect benefits while workers fear future insecurity.',
    options: [
      {
        id: 'A',
        name: 'Raise Retirement Age',
        budgetChange: 2,
        stabilityChange: -2,
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
        id: 'B',
        name: 'Increase Payroll Taxes',
        budgetChange: 2,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Partial Privatization',
        budgetChange: 0,
        stabilityChange: -2,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
      },
    ],
    historicalNote: 'Social security systems face demographic challenges worldwide. Chile\'s privatization experiment and Sweden\'s hybrid reforms offer contrasting models for ensuring long-term solvency.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Social security is a sacred promise that must be preserved. Raising taxes on the wealthy can ensure benefits remain strong for all retirees.', likelyVote: 'Split' },
      { ideology: 'conservative', typicalStance: 'The current system is unsustainable and requires structural reform. Market-based options can give workers more control over their retirement.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Pragmatic reforms are needed to ensure long-term solvency. A mix of adjustments to benefits and revenues can sustain the system fairly.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Citizens who contributed to the system deserve their promised benefits. Reform should protect nationals while addressing demographic challenges.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Politicians have raided social security while Wall Street eyes privatization profits. Protect the benefits that working people earned and paid for.', likelyVote: 'No' },
    ],
  },
  {
    id: 'mid_011',
    zone: 'midTerm',
    category: 'economic',
    title: 'Trade Agreement Negotiations',
    description: 'A major trade deal is on the table. Free traders see growth opportunities while protectionists warn of job losses.',
    options: [
      {
        id: 'A',
        name: 'Comprehensive Free Trade Deal',
        budgetChange: 1,
        stabilityChange: -1,
        aligned: [
          { ideology: 'liberal', movement: 3 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Sector-Specific Agreements',
        budgetChange: 0,
        stabilityChange: 1,
        aligned: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'liberal', movement: 1 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Protectionist Tariffs',
        budgetChange: 1,
        stabilityChange: -1,
        aligned: [
          { ideology: 'nationalist', movement: 3 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Trade policy has swung between free trade and protectionism throughout history, from the Corn Laws to NAFTA debates. Trade deals often create concentrated losses and diffuse benefits, making them politically contentious.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Trade deals must include strong labor and environmental standards. Without protections, free trade can exploit workers and harm communities.', likelyVote: 'Split' },
      { ideology: 'conservative', typicalStance: 'Free trade expands markets and economic growth. While some disruption occurs, the overall benefits of trade outweigh the costs.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Free trade increases prosperity and strengthens international cooperation. Open markets benefit consumers and create economic opportunities.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Trade deals often benefit other countries at our expense. Protecting domestic industry and jobs should take priority over free trade ideology.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Trade deals are written by corporations and hurt working families. Manufacturing jobs have been shipped overseas while elites profit.', likelyVote: 'No' },
    ],
  },
  {
    id: 'mid_012',
    zone: 'midTerm',
    category: 'economic',
    title: 'Energy Independence Strategy',
    description: 'Energy prices are volatile and foreign dependence creates security risks. Multiple pathways to energy security are proposed.',
    options: [
      {
        id: 'A',
        name: 'Renewable Energy Transition',
        budgetChange: -3,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Domestic Fossil Fuel Expansion',
        budgetChange: 1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
        ],
      },
      {
        id: 'C',
        name: 'Nuclear Power Investment',
        budgetChange: -2,
        stabilityChange: 0,
        aligned: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'liberal', movement: 1 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Energy policy has been shaped by oil crises, nuclear accidents, and climate concerns. The German Energiewende and France\'s nuclear commitment represent contrasting national strategies.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Renewable energy is the only sustainable path forward. Investing in clean energy creates jobs while addressing climate change.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Energy independence requires all sources including domestic fossil fuels. Practical energy policy should not sacrifice reliability for ideology.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Market mechanisms can drive the energy transition efficiently. Carbon pricing and technology investment can balance environmental and economic goals.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Energy independence is a matter of national security. Reducing reliance on foreign energy sources protects sovereignty regardless of the source.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Energy companies have rigged the system to keep prices high. Ordinary families need affordable energy, not expensive experiments that raise bills.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'mid_013',
    zone: 'midTerm',
    category: 'social',
    title: 'Public Health Emergency Response',
    description: 'A disease outbreak threatens public health. Experts recommend aggressive measures while businesses worry about economic disruption.',
    options: [
      {
        id: 'A',
        name: 'Strict Lockdown Measures',
        budgetChange: -2,
        stabilityChange: -2,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Targeted Interventions',
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
        name: 'Voluntary Guidelines Only',
        budgetChange: 0,
        stabilityChange: -1,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
        ],
      },
    ],
    historicalNote: 'Public health responses have ranged from quarantines during cholera outbreaks to varied COVID-19 approaches. Sweden\'s light-touch strategy contrasted with New Zealand\'s elimination approach, sparking global debate.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Public health requires collective action and following scientific expertise. Strong measures protect vulnerable populations and save lives.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Individual liberty and economic impacts must be balanced against public health concerns. Government overreach during emergencies can become permanent.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Evidence-based policies that minimize both health risks and liberty restrictions are ideal. Targeted interventions can be effective without blanket mandates.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Protecting citizens from health threats is a core government responsibility. Border controls and national coordination may be necessary.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Ordinary people bear the burden of lockdowns while elites work from home. Any measures must fairly distribute costs and protect working families.', likelyVote: 'No' },
    ],
  },
  {
    id: 'mid_014',
    zone: 'midTerm',
    category: 'social',
    title: 'Arts and Culture Funding',
    description: 'Cultural institutions seek government support while critics question public funding for arts. National identity debates intensify.',
    options: [
      {
        id: 'A',
        name: 'Major Arts Investment',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Heritage Preservation Focus',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'nationalist', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Private Patronage Model',
        budgetChange: 1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Cultural policy reflects national values, from France\'s cultural exception to American philanthropic models. Public arts funding often generates debate about government\'s role in shaping cultural expression.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Arts and culture enrich society and should be accessible to all, not just the wealthy. Public funding ensures diverse artistic expression.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Arts funding should preserve cultural heritage and traditional values. Government should not subsidize controversial or avant-garde art.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'While arts have value, private patronage and market support are often more appropriate than government funding.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Cultural institutions preserve national identity and heritage. Supporting traditional arts and national culture strengthens social cohesion.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Taxpayers should not subsidize elite cultural institutions that serve the wealthy. Arts funding often benefits establishment tastes over popular culture.', likelyVote: 'No' },
    ],
  },
  {
    id: 'mid_015',
    zone: 'midTerm',
    category: 'economic',
    title: 'Transportation Infrastructure Overhaul',
    description: 'Aging transportation networks need investment. Urban and rural interests compete for limited infrastructure funding.',
    options: [
      {
        id: 'A',
        name: 'High-Speed Rail Network',
        budgetChange: -3,
        stabilityChange: 1,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Highway Expansion Program',
        budgetChange: -2,
        stabilityChange: 1,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'User Fee Privatization',
        budgetChange: 1,
        stabilityChange: -1,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
      },
    ],
    historicalNote: 'Transportation investment has shaped nations, from the Eisenhower Interstate System to Europe\'s high-speed rail networks. Infrastructure choices often lock in development patterns for generations.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Public transit and rail reduce emissions and provide equitable mobility. Infrastructure investment should prioritize sustainable transportation over car dependence.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Infrastructure spending should be fiscally responsible and meet practical needs. Highway investment supports the economy and personal mobility.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Efficient infrastructure supports economic growth. User fees and public-private partnerships can fund improvements without excessive government spending.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Modern infrastructure is a matter of national competitiveness and pride. The nation should have world-class transportation systems.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Infrastructure projects should serve working communities, not just wealthy urban areas. Rural roads and affordable transit matter for ordinary families.', likelyVote: 'Split' },
    ],
  },
];
