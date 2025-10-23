const REGION_LABELS = {
  england: 'England',
  scotland: 'Scotland',
  wales: 'Wales',
  'northern-ireland': 'Northern Ireland',
};

const FOCUS_LABELS = {
  stability: 'Build stability',
  debt: 'Reduce debt',
  home: 'Save for a home move',
  growth: 'Grow savings & investments',
  'future-proof': 'Prepare for life changes',
};

const INCOME_FREQUENCY_LABELS = {
  monthly: 'month',
  'four-weekly': 'four weeks',
  fortnightly: 'fortnight',
  weekly: 'week',
};

const INCOME_FREQUENCY_TO_MONTHLY = {
  monthly: 1,
  'four-weekly': 13 / 12,
  fortnightly: 26 / 12,
  weekly: 52 / 12,
};

const GOAL_AREA_LABELS = {
  'emergency-fund': 'Build or top up my emergency fund',
  'clear-debt': 'Pay down expensive debt faster',
  'home-purchase': 'Save for a home or renovation',
  retirement: 'Boost retirement contributions',
  'family-milestones': 'Prepare for family milestones',
  'upgrade-budgeting': 'Improve budgeting habits',
};

const TIMELINE_LABELS = {
  '0-3': '0 – 3 months',
  '3-6': '3 – 6 months',
  '6-12': '6 – 12 months',
  '12+': '12 months or longer',
};

const BUDGETING_STYLE_LABELS = {
  detailed: 'Detailed planner',
  guided: 'Guided tracker',
  reactive: 'Reactive responder',
};

const CHECK_IN_LABELS = {
  weekly: 'Weekly check-ins',
  fortnightly: 'Every couple of weeks',
  monthly: 'Once a month',
  'ad-hoc': 'Only when something changes',
};

const EMERGENCY_FUND_LABELS = {
  'less-1': 'Less than 1 month',
  '1-3': '1 – 3 months',
  '3-6': '3 – 6 months',
  '6+': 'More than 6 months',
};

const CONFIDENCE_LABELS = {
  'finding-feet': 'Still finding my feet',
  steady: 'Steady most months',
  confident: 'Confident and consistent',
};

const DEFAULT_DATA = {
  basics: {
    planName: '',
    householdSize: '',
    netIncome: '',
    incomeFrequency: 'monthly',
    region: '',
    focus: '',
  },
  priorities: {
    goalAreas: [],
    topGoal: '',
    savingsTarget: '',
    timeline: '',
  },
  habits: {
    budgetingStyle: '',
    checkInFrequency: '',
    emergencyFundMonths: '',
    confidenceLevel: '',
    additionalNotes: '',
  },
  summary: {
    shareEmail: '',
    consentToContact: false,
  },
};

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

const clampNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim()) {
    const numeric = Number.parseFloat(value.replace(/,/g, ''));
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
};

const formatCurrency = (value) => {
  const numeric = clampNumber(value);
  if (!Number.isFinite(numeric)) return null;
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: numeric >= 1000 ? 0 : 2,
    }).format(numeric);
  } catch (error) {
    return `£${numeric.toFixed(numeric >= 1000 ? 0 : 2)}`;
  }
};

const normaliseArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
};

const toTitleCase = (value) => {
  if (typeof value !== 'string' || !value) return '';
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export function normaliseMoneyBlueprintData(raw = {}) {
  const base = JSON.parse(JSON.stringify(DEFAULT_DATA));
  const safe = typeof raw === 'object' && raw ? raw : {};

  return {
    basics: { ...base.basics, ...(safe.basics ?? {}) },
    priorities: {
      ...base.priorities,
      ...(safe.priorities ?? {}),
      goalAreas: normaliseArray(safe?.priorities?.goalAreas),
    },
    habits: { ...base.habits, ...(safe.habits ?? {}) },
    summary: { ...base.summary, ...(safe.summary ?? {}) },
  };
}

const listFormatter =
  typeof Intl !== 'undefined' && typeof Intl.ListFormat === 'function'
    ? new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' })
    : null;

const joinList = (items) => {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return '';
  if (filtered.length === 1) return filtered[0];
  if (listFormatter) {
    try {
      return listFormatter.format(filtered);
    } catch (error) {
      // ignore and fall through to manual join
    }
  }

  const rest = filtered.slice(0, -1);
  const last = filtered[filtered.length - 1];
  return `${rest.join(', ')} and ${last}`;
};

const computeMonthlyIncome = (netIncome, frequency) => {
  const numeric = clampNumber(netIncome);
  if (!Number.isFinite(numeric)) return null;
  const multiplier = INCOME_FREQUENCY_TO_MONTHLY[frequency] ?? 1;
  return numeric * multiplier;
};

const buildHouseholdSummary = (basics) => {
  const focusLabel = FOCUS_LABELS[basics.focus] ?? (basics.focus ? toTitleCase(basics.focus) : 'Not specified');
  const regionLabel = REGION_LABELS[basics.region] ?? (basics.region ? toTitleCase(basics.region) : 'Unknown region');
  const householdSize = clampNumber(basics.householdSize);
  const householdLabel = householdSize
    ? `${householdSize} ${householdSize === 1 ? 'person' : 'people'}`
    : 'an unspecified number of people';

  return `Household of ${householdLabel} in ${regionLabel} focusing on ${focusLabel.toLowerCase()}.`;
};

const buildIncomeSummary = (basics) => {
  const netIncome = clampNumber(basics.netIncome);
  if (!Number.isFinite(netIncome)) return 'Combined take-home pay was not provided.';

  const rawIncome = formatCurrency(netIncome) ?? `${netIncome}`;
  const frequencyLabel = INCOME_FREQUENCY_LABELS[basics.incomeFrequency] ?? 'month';
  const monthlyIncome = computeMonthlyIncome(netIncome, basics.incomeFrequency);
  const monthlyLabel = monthlyIncome ? formatCurrency(monthlyIncome) : null;

  if (monthlyLabel && frequencyLabel !== 'month') {
    return `Combined take-home pay is about ${rawIncome} each ${frequencyLabel}, which is roughly ${monthlyLabel} per month.`;
  }

  return `Combined take-home pay is about ${rawIncome} each ${frequencyLabel}.`;
};

const buildPrioritiesSummary = (priorities) => {
  const goalLabels = priorities.goalAreas
    .map((goal) => GOAL_AREA_LABELS[goal] ?? toTitleCase(goal))
    .filter(Boolean);
  const headlineGoal = priorities.topGoal?.trim();
  const timelineLabel = TIMELINE_LABELS[priorities.timeline] ?? '';
  const savingsTargetLabel = formatCurrency(clampNumber(priorities.savingsTarget));

  const parts = [];
  if (goalLabels.length) {
    parts.push(`Key priorities: ${joinList(goalLabels)}.`);
  }
  if (headlineGoal) {
    parts.push(
      `Headline outcome: ${headlineGoal}${timelineLabel ? ` (${timelineLabel} timeline)` : ''}${
        savingsTargetLabel ? ` with a savings target of ${savingsTargetLabel}` : ''
      }.`
    );
  } else if (savingsTargetLabel) {
    parts.push(`Savings target: ${savingsTargetLabel}${timelineLabel ? ` over ${timelineLabel}` : ''}.`);
  } else if (timelineLabel) {
    parts.push(`Preferred timeline: ${timelineLabel}.`);
  }

  return parts.join(' ');
};

const buildHabitsSummary = (habits) => {
  const styleLabel = BUDGETING_STYLE_LABELS[habits.budgetingStyle] ?? (habits.budgetingStyle ? toTitleCase(habits.budgetingStyle) : '');
  const checkInLabel =
    CHECK_IN_LABELS[habits.checkInFrequency] ??
    (habits.checkInFrequency ? toTitleCase(habits.checkInFrequency) : '');
  const emergencyLabel =
    EMERGENCY_FUND_LABELS[habits.emergencyFundMonths] ??
    (habits.emergencyFundMonths ? toTitleCase(habits.emergencyFundMonths) : '');
  const confidenceLabel =
    CONFIDENCE_LABELS[habits.confidenceLevel] ??
    (habits.confidenceLevel ? toTitleCase(habits.confidenceLevel) : '');

  const parts = [];
  if (styleLabel) parts.push(`Budgeting style: ${styleLabel.toLowerCase()}.`);
  if (checkInLabel) parts.push(`Money reviews: ${checkInLabel.toLowerCase()}.`);
  if (emergencyLabel) parts.push(`Emergency fund covers ${emergencyLabel.toLowerCase()}.`);
  if (confidenceLabel) parts.push(`Confidence level: ${confidenceLabel.toLowerCase()}.`);

  return parts.join(' ');
};

const buildNotesSummary = (habits) => {
  const notes = habits.additionalNotes?.trim();
  if (!notes) return '';
  return `Personal notes: ${notes}`;
};

const createRiskFlag = (id, severity, title, description, evidence) => ({
  id,
  severity,
  title,
  description,
  evidence,
});

const buildRiskFlags = (data) => {
  const flags = [];
  const { basics, priorities, habits } = data;

  if (habits.emergencyFundMonths === 'less-1') {
    flags.push(
      createRiskFlag(
        'emergency-fund-critical',
        'high',
        'Emergency fund covers less than one month',
        'Build a cash buffer that covers at least one month of essential bills to reduce vulnerability to income shocks.',
        EMERGENCY_FUND_LABELS[habits.emergencyFundMonths] ?? habits.emergencyFundMonths
      )
    );
  } else if (habits.emergencyFundMonths === '1-3') {
    flags.push(
      createRiskFlag(
        'emergency-fund-low',
        'medium',
        'Emergency savings below the recommended 3 months',
        'Increase cash reserves toward the 3–6 month range so the household can absorb unexpected costs.',
        EMERGENCY_FUND_LABELS[habits.emergencyFundMonths] ?? habits.emergencyFundMonths
      )
    );
  }

  if (habits.checkInFrequency === 'ad-hoc') {
    flags.push(
      createRiskFlag(
        'infrequent-reviews',
        'medium',
        'Money reviews only happen when something changes',
        'Introduce a regular cadence for reviewing the plan to catch overspending early and stay aligned with goals.',
        CHECK_IN_LABELS[habits.checkInFrequency] ?? habits.checkInFrequency
      )
    );
  }

  if (habits.confidenceLevel === 'finding-feet') {
    flags.push(
      createRiskFlag(
        'low-confidence',
        'medium',
        'Confidence about money is low',
        'Focus on quick wins and accountability routines to build financial confidence.',
        CONFIDENCE_LABELS[habits.confidenceLevel] ?? habits.confidenceLevel
      )
    );
  }

  const netIncome = clampNumber(basics.netIncome);
  if (!Number.isFinite(netIncome)) {
    flags.push(
      createRiskFlag(
        'missing-income',
        'low',
        'Household income was not provided',
        'Capture the combined take-home pay to benchmark savings rates and debt affordability.',
        null
      )
    );
  }

  if (priorities.goalAreas.includes('clear-debt') && !priorities.savingsTarget?.trim()) {
    flags.push(
      createRiskFlag(
        'debt-without-target',
        'low',
        'Debt reduction goal lacks a repayment target',
        'Estimate the total balance or a repayment milestone so progress can be measured.',
        'Goal area: clear debt'
      )
    );
  }

  return flags.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
};

export function createMoneyBlueprintInsights(rawData) {
  const data = normaliseMoneyBlueprintData(rawData);

  const summaryBullets = [];
  summaryBullets.push(buildHouseholdSummary(data.basics));
  summaryBullets.push(buildIncomeSummary(data.basics));

  const prioritiesSummary = buildPrioritiesSummary(data.priorities);
  if (prioritiesSummary) {
    summaryBullets.push(prioritiesSummary);
  }

  const habitsSummary = buildHabitsSummary(data.habits);
  if (habitsSummary) {
    summaryBullets.push(habitsSummary);
  }

  const notesSummary = buildNotesSummary(data.habits);
  if (notesSummary) {
    summaryBullets.push(notesSummary);
  }

  const riskFlags = buildRiskFlags(data);

  return {
    summaryBullets,
    riskFlags,
    metadata: {
      focus: FOCUS_LABELS[data.basics.focus] ?? data.basics.focus ?? '',
      region: REGION_LABELS[data.basics.region] ?? data.basics.region ?? '',
      householdSize: clampNumber(data.basics.householdSize),
      monthlyNetIncome: computeMonthlyIncome(data.basics.netIncome, data.basics.incomeFrequency),
      goalAreas: data.priorities.goalAreas,
    },
    raw: data,
  };
}

export function createMoneyBlueprintRiskSummary(rawData) {
  const { riskFlags } = createMoneyBlueprintInsights(rawData);
  return riskFlags;
}

export function createMoneyBlueprintSummary(rawData) {
  const { summaryBullets } = createMoneyBlueprintInsights(rawData);
  return summaryBullets;
}

