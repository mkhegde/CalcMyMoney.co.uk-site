let cachedPdfLib;

async function loadPdfLib() {
  if (cachedPdfLib) {
    return cachedPdfLib;
  }

  const module = await import('pdf-lib');
  cachedPdfLib = {
    PDFDocument: module.PDFDocument,
    StandardFonts: module.StandardFonts,
    rgb: module.rgb,
  };

  return cachedPdfLib;
}

const INCOME_FREQUENCY_LABELS = {
  monthly: 'Monthly',
  'four-weekly': 'Every 4 weeks',
  fortnightly: 'Fortnightly',
  weekly: 'Weekly',
};

const INCOME_FREQUENCY_MULTIPLIERS = {
  monthly: 12,
  'four-weekly': 13,
  fortnightly: 26,
  weekly: 52,
};

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

const PRIORITY_LABELS = {
  'emergency-fund': 'Build or top up my emergency fund',
  'clear-debt': 'Pay down expensive debt faster',
  'home-purchase': 'Save for a home or renovation',
  retirement: 'Boost retirement contributions',
  'family-milestones': 'Prepare for family milestones',
  'upgrade-budgeting': 'Improve budgeting habits',
};

const TIMELINE_LABELS = {
  '0-3': '0 - 3 months',
  '3-6': '3 - 6 months',
  '6-12': '6 - 12 months',
  '12+': '12 months or longer',
};

const BUDGETING_STYLE_DETAILS = {
  detailed: {
    title: 'Detailed planner',
    description: 'I use a spreadsheet or app to plan every pound.',
  },
  guided: {
    title: 'Guided tracker',
    description: 'I track key categories but allow some flexibility.',
  },
  reactive: {
    title: 'Reactive responder',
    description: 'I review after spending and adjust when needed.',
  },
};

const CONFIDENCE_LABELS = {
  'finding-feet': 'Still finding my feet',
  steady: 'Steady most months',
  confident: 'Confident and consistent',
};

const CHECK_IN_LABELS = {
  weekly: 'Weekly check-ins',
  fortnightly: 'Every couple of weeks',
  monthly: 'Once a month',
  'ad-hoc': 'Only when something changes',
};

const EMERGENCY_FUND_LABELS = {
  'less-1': 'Less than 1 month',
  '1-3': '1 - 3 months',
  '3-6': '3 - 6 months',
  '6+': 'More than 6 months',
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

const BASE_PAGE_SIZE = [595.28, 841.89];
const PAGE_MARGIN = 48;

function parseNumber(value) {
  if (value == null) return null;
  const raw = String(value).replace(/[^0-9.,-]/g, '').replace(/,/g, '');
  if (!raw) return null;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value, options = {}) {
  const amount = typeof value === 'number' ? value : parseNumber(value);
  if (!Number.isFinite(amount)) return 'Not set';

  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;

  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch (error) {
    return `£${amount.toFixed(Math.max(minimumFractionDigits, 0))}`;
  }
}

function formatDate(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  try {
    return date.toLocaleString('en-GB', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  } catch (error) {
    return date.toISOString();
  }
}

export function formatBlueprintReportId(value) {
  if (!value) return '';
  return value.match(/.{1,4}/g)?.join(' ') ?? value;
}

function normaliseStep(step = {}, defaults = {}) {
  return { ...defaults, ...(step ?? {}) };
}

export function buildMoneyBlueprintDataset(report = {}, options = {}) {
  const defaults = options.defaults || DEFAULT_DATA;
  const basics = normaliseStep(report.basics, defaults.basics);
  const priorities = normaliseStep(report.priorities, defaults.priorities);
  const habits = normaliseStep(report.habits, defaults.habits);
  const summary = normaliseStep(report.summary, defaults.summary);

  const netIncomeValue = parseNumber(basics.netIncome);
  const frequency = basics.incomeFrequency;
  const multiplier = INCOME_FREQUENCY_MULTIPLIERS[frequency] ?? null;
  const annualIncome =
    netIncomeValue != null && multiplier != null ? netIncomeValue * multiplier : null;
  const monthlyIncome = annualIncome != null ? annualIncome / 12 : null;

  const generatedAt = options.generatedAt
    ? new Date(options.generatedAt)
    : report.completedAt
    ? new Date(report.completedAt)
    : new Date();

  const goalAreas = Array.isArray(priorities.goalAreas) ? priorities.goalAreas : [];
  const goalLabels = goalAreas
    .map((goal) => PRIORITY_LABELS[goal] || goal)
    .filter(Boolean);

  return {
    basics,
    priorities,
    habits,
    summary,
    meta: {
      status: report.status || 'collecting',
      reportId: report.reportId || '',
      formattedReportId: formatBlueprintReportId(report.reportId || ''),
      generatedAt,
      generatedAtLabel: formatDate(generatedAt),
      householdSize: basics.householdSize || 'Not set',
      frequencyLabel: INCOME_FREQUENCY_LABELS[frequency] || frequency || 'Not set',
      regionLabel: REGION_LABELS[basics.region] || basics.region || 'Not set',
      focusLabel: FOCUS_LABELS[basics.focus] || basics.focus || 'Not set',
      netIncomeValue,
      netIncomeLabel: netIncomeValue != null ? formatCurrency(netIncomeValue) : 'Not set',
      annualIncome,
      annualIncomeLabel:
        annualIncome != null ? formatCurrency(annualIncome, { maximumFractionDigits: 0 }) : 'Not available',
      monthlyIncome,
      monthlyIncomeLabel:
        monthlyIncome != null
          ? formatCurrency(monthlyIncome, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
          : 'Not available',
      goalAreas,
      goalLabels,
      goalCount: goalAreas.length,
      budgetingStyle: BUDGETING_STYLE_DETAILS[habits.budgetingStyle]?.title || habits.budgetingStyle || 'Not set',
      budgetingStyleDescription:
        BUDGETING_STYLE_DETAILS[habits.budgetingStyle]?.description || '',
      confidenceLabel:
        CONFIDENCE_LABELS[habits.confidenceLevel] || habits.confidenceLevel || 'Not set',
      checkInLabel:
        CHECK_IN_LABELS[habits.checkInFrequency] || habits.checkInFrequency || 'Not set',
      emergencyFundLabel:
        EMERGENCY_FUND_LABELS[habits.emergencyFundMonths] || habits.emergencyFundMonths || 'Not set',
      shareEmail: summary.shareEmail || '',
      consent: !!summary.consentToContact,
    },
  };
}

function wrapLines(text, font, fontSize, maxWidth) {
  const content = String(text ?? '');
  const paragraphs = content.split(/\r?\n/);
  const lines = [];

  paragraphs.forEach((paragraph, index) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      if (index < paragraphs.length - 1) {
        lines.push('');
      }
      return;
    }

    let current = '';
    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    });

    if (current) {
      lines.push(current);
    }

    if (index < paragraphs.length - 1) {
      lines.push('');
    }
  });

  return lines;
}

function createPageContext(pdfDoc, pageSize = BASE_PAGE_SIZE) {
  let page = pdfDoc.addPage(pageSize);
  const { height } = page.getSize();
  let y = height - PAGE_MARGIN;

  const ensureSpace = (amount) => {
    if (y - amount < PAGE_MARGIN) {
      page = pdfDoc.addPage(pageSize);
      y = page.getSize().height - PAGE_MARGIN;
    }
  };

  return {
    get page() {
      return page;
    },
    get cursor() {
      return y;
    },
    set cursor(value) {
      y = value;
    },
    ensureSpace,
  };
}

export async function generateMoneyBlueprintPdf(report = {}, options = {}) {
  const dataset = buildMoneyBlueprintDataset(report, options);
  const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const title = options.title || 'My Money Blueprint';

  const pageContext = createPageContext(pdfDoc, options.pageSize || BASE_PAGE_SIZE);
  const lineHeight = 16;
  const sectionSpacing = 28;
  const contentWidth = pageContext.page.getSize().width - PAGE_MARGIN * 2;

  const drawHeading = (text, size = 20) => {
    pageContext.ensureSpace(size + 6);
    pageContext.page.drawText(text, {
      x: PAGE_MARGIN,
      y: pageContext.cursor,
      size,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    pageContext.cursor -= size + 6;
  };

  const drawSubheading = (text, size = 14) => {
    pageContext.ensureSpace(size + 4);
    pageContext.page.drawText(text, {
      x: PAGE_MARGIN,
      y: pageContext.cursor,
      size,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    pageContext.cursor -= size + 6;
  };

  const drawParagraph = (text, size = 11, color = rgb(0.25, 0.25, 0.25)) => {
    const lines = wrapLines(text, regularFont, size, contentWidth);
    lines.forEach((line) => {
      const spacing = line ? lineHeight : lineHeight / 2;
      pageContext.ensureSpace(spacing);
      if (line) {
        pageContext.page.drawText(line, {
          x: PAGE_MARGIN,
          y: pageContext.cursor,
          size,
          font: regularFont,
          color,
        });
      }
      pageContext.cursor -= spacing;
    });
  };

  const drawKeyValue = (label, value) => {
    pageContext.ensureSpace(lineHeight * 2);
    pageContext.page.drawText(label, {
      x: PAGE_MARGIN,
      y: pageContext.cursor,
      size: 12,
      font: boldFont,
      color: rgb(0.15, 0.15, 0.15),
    });
    pageContext.cursor -= lineHeight;
    drawParagraph(value, 11);
    pageContext.cursor -= 4;
  };

  const drawList = (items) => {
    items.forEach((item) => {
      const lines = wrapLines(item, regularFont, 11, contentWidth - 16);
      lines.forEach((line, index) => {
        pageContext.ensureSpace(lineHeight);
        const text = index === 0 ? `• ${line}` : `  ${line}`;
        pageContext.page.drawText(text, {
          x: PAGE_MARGIN,
          y: pageContext.cursor,
          size: 11,
          font: regularFont,
          color: rgb(0.25, 0.25, 0.25),
        });
        pageContext.cursor -= lineHeight;
      });
    });
    pageContext.cursor -= 6;
  };

  drawHeading(title);
  drawParagraph('Personalised summary of your Money Blueprint answers.');
  pageContext.cursor -= 8;

  drawSubheading('Report details');
  drawKeyValue('Report code', dataset.meta.formattedReportId || 'Not yet generated');
  drawKeyValue('Generated on', dataset.meta.generatedAtLabel);
  drawKeyValue('Status', dataset.meta.status === 'completed' ? 'Completed' : 'In progress');

  pageContext.cursor -= sectionSpacing;
  drawSubheading('Household snapshot');
  drawKeyValue('Plan nickname', dataset.basics.planName?.trim() || 'Not set');
  drawKeyValue('Household size', dataset.meta.householdSize);
  drawKeyValue('Net income', `${dataset.meta.netIncomeLabel} (${dataset.meta.frequencyLabel})`);
  drawKeyValue('Monthly equivalent', dataset.meta.monthlyIncomeLabel);
  drawKeyValue('Annual equivalent', dataset.meta.annualIncomeLabel);
  drawKeyValue('Region', dataset.meta.regionLabel);
  drawKeyValue('Primary focus', dataset.meta.focusLabel);

  pageContext.cursor -= sectionSpacing;
  drawSubheading('Priorities & milestones');
  if (dataset.meta.goalLabels.length > 0) {
    drawParagraph('Goal areas selected:');
    drawList(dataset.meta.goalLabels);
  } else {
    drawParagraph('No goal areas selected yet.');
  }
  drawKeyValue('Headline goal', dataset.priorities.topGoal?.trim() || 'Not provided');
  drawKeyValue(
    'Target amount',
    dataset.priorities.savingsTarget
      ? formatCurrency(dataset.priorities.savingsTarget)
      : 'Optional'
  );
  drawKeyValue(
    'Ideal timeframe',
    TIMELINE_LABELS[dataset.priorities.timeline] || dataset.priorities.timeline || 'Not set'
  );

  pageContext.cursor -= sectionSpacing;
  drawSubheading('Habits & resilience');
  drawKeyValue('Budgeting style', dataset.meta.budgetingStyle);
  if (dataset.meta.budgetingStyleDescription) {
    drawParagraph(dataset.meta.budgetingStyleDescription, 10, rgb(0.35, 0.35, 0.35));
  }
  drawKeyValue('Confidence level', dataset.meta.confidenceLabel);
  drawKeyValue('Check-in cadence', dataset.meta.checkInLabel);
  drawKeyValue('Emergency fund cover', dataset.meta.emergencyFundLabel);
  drawKeyValue(
    'Notes',
    dataset.habits.additionalNotes?.trim() || 'Use this space to record habits, triggers or wins you want to remember.'
  );

  pageContext.cursor -= sectionSpacing;
  drawSubheading('Sharing preferences');
  drawKeyValue('Reminder email', dataset.meta.shareEmail || 'Not provided');
  drawKeyValue('Reminder consent', dataset.meta.consent ? 'Yes, send reminders' : 'No reminder consent');

  const pdfBytes = await pdfDoc.save();
  const blob = typeof Blob !== 'undefined' ? new Blob([pdfBytes], { type: 'application/pdf' }) : null;

  return {
    blob,
    bytes: pdfBytes,
    dataset,
  };
}

export function buildMoneyBlueprintCsvRows(report = {}, options = {}) {
  const dataset = buildMoneyBlueprintDataset(report, options);
  const rows = [
    ['Section', 'Field', 'Value'],
    ['Report', 'Report code', dataset.meta.formattedReportId || 'Not yet generated'],
    ['Report', 'Generated on', dataset.meta.generatedAtLabel],
    ['Report', 'Status', dataset.meta.status === 'completed' ? 'Completed' : 'In progress'],
    ['Basics', 'Plan nickname', dataset.basics.planName?.trim() || 'Not set'],
    ['Basics', 'Household size', dataset.meta.householdSize],
    ['Basics', 'Net income', `${dataset.meta.netIncomeLabel} (${dataset.meta.frequencyLabel})`],
    ['Basics', 'Monthly equivalent', dataset.meta.monthlyIncomeLabel],
    ['Basics', 'Annual equivalent', dataset.meta.annualIncomeLabel],
    ['Basics', 'Region', dataset.meta.regionLabel],
    ['Basics', 'Primary focus', dataset.meta.focusLabel],
    [
      'Priorities',
      'Goal areas',
      dataset.meta.goalLabels.length > 0 ? dataset.meta.goalLabels.join('; ') : 'None selected',
    ],
    ['Priorities', 'Number of goals', String(dataset.meta.goalCount)],
    ['Priorities', 'Headline goal', dataset.priorities.topGoal?.trim() || 'Not provided'],
    [
      'Priorities',
      'Target amount',
      dataset.priorities.savingsTarget
        ? formatCurrency(dataset.priorities.savingsTarget)
        : 'Optional',
    ],
    [
      'Priorities',
      'Ideal timeframe',
      TIMELINE_LABELS[dataset.priorities.timeline] || dataset.priorities.timeline || 'Not set',
    ],
    ['Habits', 'Budgeting style', dataset.meta.budgetingStyle],
    [
      'Habits',
      'Budgeting style notes',
      dataset.meta.budgetingStyleDescription || 'Not provided',
    ],
    ['Habits', 'Confidence level', dataset.meta.confidenceLabel],
    ['Habits', 'Check-in cadence', dataset.meta.checkInLabel],
    ['Habits', 'Emergency fund cover', dataset.meta.emergencyFundLabel],
    [
      'Habits',
      'Notes',
      dataset.habits.additionalNotes?.trim() || 'Use this space to record habits, triggers or wins you want to remember.',
    ],
    ['Sharing', 'Reminder email', dataset.meta.shareEmail || 'Not provided'],
    ['Sharing', 'Reminder consent', dataset.meta.consent ? 'Yes' : 'No'],
  ];

  return rows;
}

export function generateMoneyBlueprintCsv(report = {}, options = {}) {
  const rows = buildMoneyBlueprintCsvRows(report, options);
  const csvString = rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const withBom = `\uFEFF${csvString}`;
  const blob = typeof Blob !== 'undefined' ? new Blob([withBom], { type: 'text/csv;charset=utf-8;' }) : null;

  return {
    rows,
    csv: csvString,
    blob,
  };
}
