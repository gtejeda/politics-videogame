/**
 * Late Term Decision Cards
 * Zone: Spaces 28-35 (Final stretch before victory)
 * These are legacy-defining decisions that shape the end of a political term.
 */

import type { DecisionCard, IdeologyPerspective } from '../types';

export const LATE_TERM_CARDS: DecisionCard[] = [
  {
    id: 'late_001',
    zone: 'lateTerm',
    category: 'institutional',
    title: 'Succession Planning Initiative',
    description:
      'Your term is ending. How will you shape the transition of power and ensure your legacy endures beyond your administration?',
    options: [
      {
        id: 'A',
        name: 'Groom Party Successor',
        budgetChange: -1,
        stabilityChange: 2,
        aligned: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Open Primary Process',
        budgetChange: 0,
        stabilityChange: 1,
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
        name: 'Strengthen Institutional Handover',
        budgetChange: -1,
        stabilityChange: 3,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'The peaceful transfer of power is a cornerstone of democracy. From George Washington refusing a third term to modern transition protocols, how leaders leave office shapes future governance.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives favor open, democratic processes that give voters maximum choice rather than party elites selecting successors. They prefer institutional reforms that prevent consolidation of power.', likelyVote: 'Split' },
      { ideology: 'conservative', typicalStance: 'Conservatives value orderly succession that maintains stability and continuity of governance. They often support grooming experienced successors within established party structures.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Liberals prioritize transparent institutional processes and merit-based transitions. They support reforms that strengthen democratic norms regardless of partisan advantage.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists prefer strong succession planning that ensures continuity of national priorities and prevents foreign influence during transitions.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Populists distrust establishment succession planning, viewing it as elites protecting their power. They prefer letting the people decide without party interference.', likelyVote: 'No' },
    ],
  },
  {
    id: 'late_002',
    zone: 'lateTerm',
    category: 'security',
    title: 'Peace Treaty Negotiations',
    description:
      'A long-standing regional conflict may finally be resolved. Negotiators present three frameworks for a lasting peace agreement.',
    options: [
      {
        id: 'A',
        name: 'Comprehensive Peace Accord',
        budgetChange: -2,
        stabilityChange: 3,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Security-First Agreement',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Economic Partnership Treaty',
        budgetChange: 1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 3 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'End-of-term peace efforts have defined legacies, from Camp David Accords under Carter to the Oslo Accords. Leaders often pursue bold diplomatic moves when political constraints loosen.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives strongly support comprehensive peace agreements that address root causes of conflict including social justice and human rights. They prioritize diplomacy over military solutions.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives approach peace treaties cautiously, emphasizing security guarantees and verification mechanisms. They worry about giving away too much without enforceable commitments.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Liberals support multilateral frameworks and economic integration as paths to lasting peace. They believe trade ties and institutional cooperation reduce conflict incentives.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Nationalists are skeptical of peace treaties that compromise sovereignty or national interests. They prioritize security-first approaches and maintaining strategic advantages.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Populists support peace if it clearly benefits ordinary citizens through reduced military spending or economic opportunity. They oppose deals that seem to favor foreign interests.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'late_003',
    zone: 'lateTerm',
    category: 'institutional',
    title: 'Major Reform Consolidation',
    description:
      'Your signature reforms face opposition. How will you cement these changes before leaving office to prevent rollback?',
    options: [
      {
        id: 'A',
        name: 'Constitutional Entrenchment',
        budgetChange: -1,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'nationalist', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Bipartisan Compromise Bill',
        budgetChange: -1,
        stabilityChange: 2,
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
        name: 'Executive Implementation Rush',
        budgetChange: 0,
        stabilityChange: -2,
        aligned: [
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'Reform durability varies widely. Social Security became untouchable while many executive orders are reversed. The method of implementation often determines longevity more than popularity.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives strongly favor cementing reforms through constitutional or legislative means to prevent rollback. They see lasting structural change as essential to their agenda.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives oppose entrenchment of reforms they disagree with, viewing it as circumventing future democratic choice. They prefer reversible legislation over constitutional changes.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Liberals support bipartisan compromise to ensure reforms have broad legitimacy and durability. They worry about partisan overreach that could be reversed.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists support entrenching reforms that protect national sovereignty but oppose those that limit future policy flexibility on national priorities.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Populists favor executive action to deliver immediate results to the people over slow institutional processes. They distrust bipartisan deals as establishment compromises.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'late_004',
    zone: 'lateTerm',
    category: 'economic',
    title: 'National Debt Restructuring',
    description:
      'Years of spending have accumulated significant debt. A final reckoning is needed before the next administration inherits this burden.',
    options: [
      {
        id: 'A',
        name: 'Austerity Package',
        budgetChange: 3,
        stabilityChange: -2,
        aligned: [
          { ideology: 'conservative', movement: 3 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'populist', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Debt Monetization Strategy',
        budgetChange: 1,
        stabilityChange: -1,
        aligned: [
          { ideology: 'populist', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
        ],
      },
      {
        id: 'C',
        name: 'Growth-Based Repayment Plan',
        budgetChange: -1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'Debt crises have toppled governments from Greece to Argentina. How outgoing administrations handle fiscal legacy often determines their historical reputation and successor challenges.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives oppose austerity measures that cut social programs and prefer growth-oriented strategies. They argue debt concerns are often overstated and used to justify harmful cuts.', likelyVote: 'No' },
      { ideology: 'conservative', typicalStance: 'Conservatives prioritize fiscal responsibility and debt reduction through spending cuts. They view balanced budgets as essential to economic stability and future prosperity.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Liberals seek balanced approaches that address debt through both spending discipline and growth promotion. They support market-based solutions over inflationary monetization.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists worry about foreign debt holders having influence over domestic policy. They prefer strategies that reduce dependence on international creditors.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Populists oppose austerity that hurts working people and may support debt monetization if it avoids painful cuts. They are skeptical of solutions that benefit creditors over citizens.', likelyVote: 'No' },
    ],
  },
  {
    id: 'late_005',
    zone: 'lateTerm',
    category: 'security',
    title: 'International Alliance Formation',
    description:
      'Geopolitical shifts offer an opportunity to forge a new international alliance that could reshape global power dynamics for decades.',
    options: [
      {
        id: 'A',
        name: 'Multilateral Defense Pact',
        budgetChange: -2,
        stabilityChange: 2,
        aligned: [
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Economic Trade Bloc',
        budgetChange: 1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 3 },
          { ideology: 'progressive', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Values-Based Coalition',
        budgetChange: -1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'nationalist', movement: 2 },
        ],
      },
    ],
    historicalNote:
      'NATO, the EU, and ASEAN were all forged in specific historical moments. Late-term alliance decisions often outlast the leaders who made them, shaping international order for generations.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives prefer values-based coalitions focused on human rights and environmental cooperation over military alliances. They support international cooperation but are wary of defense pacts.', likelyVote: 'Split' },
      { ideology: 'conservative', typicalStance: 'Conservatives support strong defense alliances with like-minded nations to counter threats. They view military partnerships as essential to national security.', likelyVote: 'Yes' },
      { ideology: 'liberal', typicalStance: 'Liberals strongly favor economic trade blocs that promote free trade and mutual prosperity. They believe economic interdependence creates lasting peace.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Nationalists are skeptical of alliances that constrain sovereignty or require defending other nations. They prefer bilateral deals that clearly serve national interests.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Populists question international commitments that benefit elites while ordinary people bear costs. They support alliances only if they provide tangible benefits to citizens.', likelyVote: 'No' },
    ],
  },
  {
    id: 'late_006',
    zone: 'lateTerm',
    category: 'social',
    title: 'Amnesty and Clemency Decision',
    description:
      'Political prisoners, controversial convictions, and calls for mercy converge. Your final act of clemency will define your humanitarian legacy.',
    options: [
      {
        id: 'A',
        name: 'Broad Political Amnesty',
        budgetChange: 0,
        stabilityChange: -2,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Case-by-Case Review',
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
        name: 'Targeted Reconciliation Pardons',
        budgetChange: 0,
        stabilityChange: 0,
        aligned: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'nationalist', movement: 2 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'Presidential pardons range from Ford pardoning Nixon to mass amnesties after civil conflicts. These decisions often provoke immediate controversy but shape long-term reconciliation.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives support broad amnesty for political prisoners and those convicted under unjust laws. They see clemency as a tool for addressing systemic injustice and promoting reconciliation.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives prefer limited, case-by-case clemency that respects rule of law. They worry broad amnesty undermines justice and sends wrong signals about consequences.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Liberals support careful review processes that balance mercy with justice. They favor transparent criteria and oppose both blanket amnesty and purely political pardons.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists may support targeted pardons for those who acted in national interest but oppose amnesty for those seen as threatening national unity or security.', likelyVote: 'Split' },
      { ideology: 'populist', typicalStance: 'Populists support amnesty for ordinary people caught up in unjust systems but strongly oppose pardons for elites or political insiders. They want justice to apply equally.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'late_007',
    zone: 'lateTerm',
    category: 'institutional',
    title: 'Constitutional Amendment Push',
    description:
      'There is momentum to amend the constitution before the political window closes. Which fundamental change should be prioritized?',
    options: [
      {
        id: 'A',
        name: 'Rights Expansion Amendment',
        budgetChange: 0,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Fiscal Responsibility Amendment',
        budgetChange: 1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'conservative', movement: 3 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Sovereignty Protection Amendment',
        budgetChange: 0,
        stabilityChange: 1,
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
    historicalNote:
      'Constitutional amendments are rare but transformative. From the Bill of Rights to recent efforts at EU treaty changes, fundamental law changes require exceptional political alignment.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives favor constitutional amendments that expand civil rights, strengthen environmental protections, or address structural inequalities. They see the constitution as a living document.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives support amendments that enshrine fiscal discipline or protect traditional values. They generally prefer constitutional stability over frequent changes.', likelyVote: 'Split' },
      { ideology: 'liberal', typicalStance: 'Liberals support amendments that strengthen individual liberties and limit government overreach. They favor process-oriented reforms that ensure fair governance.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists strongly support sovereignty protection amendments that shield domestic policy from international influence. They oppose amendments seen as eroding national independence.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Populists support amendments that give more power directly to the people and oppose those that entrench elite control. They favor direct democracy mechanisms.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'late_008',
    zone: 'lateTerm',
    category: 'economic',
    title: 'Strategic Industry Decision',
    description:
      'A critical national industry faces a crossroads. The decision between privatization and nationalization will reshape the economy for decades.',
    options: [
      {
        id: 'A',
        name: 'Full Nationalization',
        budgetChange: -3,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 2 },
          { ideology: 'nationalist', movement: 2 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'conservative', movement: 2 },
        ],
      },
      {
        id: 'B',
        name: 'Market Privatization',
        budgetChange: 3,
        stabilityChange: -1,
        aligned: [
          { ideology: 'liberal', movement: 3 },
          { ideology: 'conservative', movement: 2 },
        ],
        opposed: [
          { ideology: 'populist', movement: 2 },
          { ideology: 'progressive', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Public-Private Partnership',
        budgetChange: 1,
        stabilityChange: 1,
        aligned: [
          { ideology: 'liberal', movement: 1 },
          { ideology: 'progressive', movement: 1 },
          { ideology: 'conservative', movement: 1 },
        ],
        opposed: [
          { ideology: 'populist', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'From British Rail privatization to Venezuela oil nationalization, ownership of strategic industries shapes economic trajectories. These decisions often become irreversible defining moments.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives favor nationalization of strategic industries to ensure public control over essential services and prevent corporate exploitation. They prioritize public benefit over profit.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives strongly support privatization to improve efficiency and reduce government involvement in the economy. They believe markets deliver better outcomes than state control.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Liberals prefer market-based solutions with appropriate regulation. They support privatization with strong oversight or public-private partnerships that combine efficiency with accountability.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists support keeping strategic industries under national control to prevent foreign ownership. They may favor nationalization if it protects national interests and jobs.', likelyVote: 'Yes' },
      { ideology: 'populist', typicalStance: 'Populists oppose privatization that benefits wealthy investors at public expense. They support public ownership of industries that provide essential services to ordinary citizens.', likelyVote: 'Yes' },
    ],
  },
  {
    id: 'late_009',
    zone: 'lateTerm',
    category: 'institutional',
    title: 'Electoral Reform Package',
    description:
      'The electoral system has shown weaknesses. Final-term political capital offers a chance to reform how future leaders are chosen.',
    options: [
      {
        id: 'A',
        name: 'Proportional Representation',
        budgetChange: -1,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'nationalist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Strengthen District System',
        budgetChange: 0,
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
        name: 'Ranked Choice Voting',
        budgetChange: -1,
        stabilityChange: 0,
        aligned: [
          { ideology: 'liberal', movement: 2 },
          { ideology: 'progressive', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'Electoral systems shape political landscapes. New Zealand switched to proportional representation in 1996, transforming its political culture. Such reforms often occur during rare windows of cross-party support.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives strongly support proportional representation and ranked choice voting to ensure diverse voices are represented. They believe current systems underrepresent minority viewpoints.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives prefer traditional district-based systems that maintain stable two-party governance. They worry proportional systems lead to fragmentation and unstable coalitions.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Liberals support electoral reforms that reduce polarization and encourage moderate candidates. They favor ranked choice voting as a pragmatic improvement.', likelyVote: 'Yes' },
      { ideology: 'nationalist', typicalStance: 'Nationalists support electoral systems that produce strong, decisive governments able to act on national priorities. They oppose reforms that fragment political power.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Populists may support electoral reforms that break establishment party control and give outsider candidates better chances. They favor systems that empower ordinary voters.', likelyVote: 'Split' },
    ],
  },
  {
    id: 'late_010',
    zone: 'lateTerm',
    category: 'social',
    title: 'Historical Reconciliation Initiative',
    description:
      'Past injustices demand acknowledgment. A truth and reconciliation process could heal old wounds or reopen divisive debates.',
    options: [
      {
        id: 'A',
        name: 'Full Truth Commission',
        budgetChange: -2,
        stabilityChange: -1,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'liberal', movement: 1 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'nationalist', movement: 1 },
        ],
      },
      {
        id: 'B',
        name: 'Symbolic Acknowledgment',
        budgetChange: 0,
        stabilityChange: 1,
        aligned: [
          { ideology: 'conservative', movement: 1 },
          { ideology: 'liberal', movement: 2 },
        ],
        opposed: [
          { ideology: 'progressive', movement: 1 },
          { ideology: 'populist', movement: 1 },
        ],
      },
      {
        id: 'C',
        name: 'Reparations Program',
        budgetChange: -3,
        stabilityChange: -2,
        aligned: [
          { ideology: 'progressive', movement: 3 },
          { ideology: 'populist', movement: 2 },
        ],
        opposed: [
          { ideology: 'conservative', movement: 2 },
          { ideology: 'liberal', movement: 1 },
        ],
      },
    ],
    historicalNote:
      'From South Africa Truth and Reconciliation Commission to Germany reparations, addressing historical wrongs is a defining act. These initiatives often define how nations remember entire eras.',
    ideologyPerspectives: [
      { ideology: 'progressive', typicalStance: 'Progressives strongly support comprehensive truth commissions and reparations programs to address systemic historical injustices. They see this as essential for genuine societal healing.', likelyVote: 'Yes' },
      { ideology: 'conservative', typicalStance: 'Conservatives prefer symbolic acknowledgment over extensive reparations programs. They worry that reopening historical wounds divides rather than unites society.', likelyVote: 'No' },
      { ideology: 'liberal', typicalStance: 'Liberals support balanced reconciliation processes that acknowledge wrongs while promoting forward-looking unity. They favor truth-telling over punitive measures.', likelyVote: 'Split' },
      { ideology: 'nationalist', typicalStance: 'Nationalists are cautious about initiatives that may be seen as attacking national heritage or identity. They prefer narratives that emphasize national unity and progress.', likelyVote: 'No' },
      { ideology: 'populist', typicalStance: 'Populists support justice for ordinary people who suffered historical wrongs but may oppose programs that seem to benefit specific groups over the general population.', likelyVote: 'Split' },
    ],
  },
];
