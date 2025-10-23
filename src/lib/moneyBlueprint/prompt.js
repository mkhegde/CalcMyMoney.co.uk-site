import { createMoneyBlueprintInsights, normaliseMoneyBlueprintData } from './insights';

export const MONEY_BLUEPRINT_DISCLAIMER =
  'This summary is educational and not financial advice. Speak to a regulated financial adviser for personalised guidance.';

const DEFAULT_TONE = 'supportive and practical';

const buildSystemPrompt = (tone = DEFAULT_TONE, extraInstructions = []) => {
  const lines = [
    'You are the Money Blueprint assistant for Calculate My Money.',
    `Your tone should remain ${tone}, using UK English and positive, action-focused language.`,
    'Do not provide regulated financial advice, make product recommendations, or mention specific providers.',
    'Base all observations on the supplied household information, summary bullet points, and risk flags.',
    `Always finish with the exact disclaimer: "${MONEY_BLUEPRINT_DISCLAIMER}"`,
    'Use concise paragraphs and bullet points so the reader can skim key actions quickly.',
  ];

  if (Array.isArray(extraInstructions) && extraInstructions.length) {
    lines.push(...extraInstructions);
  }

  return lines.join('\n');
};

const sanitiseData = (rawData) => {
  const data = normaliseMoneyBlueprintData(rawData);
  return {
    basics: {
      planName: data.basics.planName?.trim() ?? '',
      householdSize: data.basics.householdSize ?? '',
      netIncome: data.basics.netIncome ?? '',
      incomeFrequency: data.basics.incomeFrequency ?? '',
      region: data.basics.region ?? '',
      focus: data.basics.focus ?? '',
    },
    priorities: {
      goalAreas: data.priorities.goalAreas ?? [],
      topGoal: data.priorities.topGoal?.trim() ?? '',
      savingsTarget: data.priorities.savingsTarget ?? '',
      timeline: data.priorities.timeline ?? '',
    },
    habits: {
      budgetingStyle: data.habits.budgetingStyle ?? '',
      checkInFrequency: data.habits.checkInFrequency ?? '',
      emergencyFundMonths: data.habits.emergencyFundMonths ?? '',
      confidenceLevel: data.habits.confidenceLevel ?? '',
      additionalNotes: data.habits.additionalNotes?.trim() ?? '',
    },
    summary: {
      consentToContact: Boolean(data.summary.consentToContact),
      providedEmail: Boolean(data.summary.shareEmail),
    },
  };
};

const formatSummaryBullets = (bullets) => {
  if (!Array.isArray(bullets) || bullets.length === 0) return '- None available';
  return bullets.map((bullet) => `- ${bullet}`).join('\n');
};

const formatRiskFlags = (flags) => {
  if (!Array.isArray(flags) || flags.length === 0) return '- No specific risks detected in the answers.';

  return flags
    .map((flag) => {
      const evidence = flag.evidence ? ` (Evidence: ${flag.evidence})` : '';
      return `- [${flag.severity.toUpperCase()}] ${flag.title}: ${flag.description}${evidence}`;
    })
    .join('\n');
};

const buildUserPrompt = ({ reportId, summaryBullets, riskFlags, data }) => {
  const sections = [
    `Report reference: ${reportId ?? 'Not assigned'}`,
    'Wizard responses (PII removed):',
    JSON.stringify(data, null, 2),
    'Derived summary bullet points:',
    formatSummaryBullets(summaryBullets),
    'Risk considerations highlighted by the formatter:',
    formatRiskFlags(riskFlags),
    'Please craft a Money Blueprint report that includes the following sections in order: \n1. Snapshot \n2. Opportunities \n3. Watch-outs \n4. Suggested next moves \n5. Disclaimer',
    'In the Watch-outs section, address each risk flag if any are provided. If there are no risks, reassure the user to continue routine reviews.',
    'Refer to the report by the anonymised ID when it helps reinforce accountability.',
  ];

  return sections.join('\n\n');
};

const createFingerprint = (reportId, data, summaryBullets, riskFlags) =>
  JSON.stringify({
    reportId: reportId ?? null,
    data,
    summaryBullets,
    riskFlags: Array.isArray(riskFlags)
      ? riskFlags.map((flag) => ({ id: flag.id, severity: flag.severity }))
      : [],
  });

export function buildMoneyBlueprintPrompt(options = {}) {
  const { wizardData, reportId, tone = DEFAULT_TONE, systemInstructions } = options ?? {};

  const insights = createMoneyBlueprintInsights(wizardData);
  const sanitisedData = sanitiseData(insights.raw);
  const summaryBullets = insights.summaryBullets ?? [];
  const riskFlags = insights.riskFlags ?? [];
  const fingerprint = createFingerprint(reportId, sanitisedData, summaryBullets, riskFlags);

  const systemMessage = buildSystemPrompt(tone, systemInstructions);
  const userMessage = buildUserPrompt({ reportId, summaryBullets, riskFlags, data: sanitisedData });

  return {
    reportId: reportId ?? null,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage },
    ],
    summaryBullets,
    riskFlags,
    sanitisedData,
    disclaimer: MONEY_BLUEPRINT_DISCLAIMER,
    fingerprint,
  };
}

