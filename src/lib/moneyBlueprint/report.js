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

const DEFAULT_PAGE_SIZE = [595.28, 841.89];
const DEFAULT_PAGE_MARGIN = 48;

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
    return `GBP ${amount.toFixed(Math.max(minimumFractionDigits, 0))}`;
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
      budgetingStyle:
        BUDGETING_STYLE_DETAILS[habits.budgetingStyle]?.title || habits.budgetingStyle || 'Not set',
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

function sanitizePdfText(value) {
  const replacements = {
    '£': 'GBP ',
    '€': 'EUR ',
    '–': '-',
    '—': '-',
    '“': '"',
    '”': '"',
    '„': '"',
    '‘': "'",
    '’': "'",
    '\u2026': '...',
  };

  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/\t/g, '  ')
    .replace(/[\u0080-\uFFFF]/g, (char) => replacements[char] ?? '?');
}

function escapePdfText(text) {
  return sanitizePdfText(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(content, maxWidth) {
  const text = sanitizePdfText(content);
  if (!text) {
    return [''];
  }

  const width = Math.max(Number(maxWidth) || 80, 20);
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > width && current) {
      lines.push(current);
      current = word.length > width ? word.slice(0, width) : word;
    } else if (next.length > width) {
      lines.push(next.slice(0, width));
      current = next.slice(width).trim();
    } else {
      current = next;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [''];
}

function appendWrappedLines(target, text, { indent = '', maxWidth = 88 } = {}) {
  const indentation = indent || '';
  const availableWidth = Math.max(maxWidth - indentation.length, 24);
  const wrappedLines = wrapText(text, availableWidth);

  if (wrappedLines.length === 0) {
    target.push(indentation.trim() ? indentation : '');
    return;
  }

  wrappedLines.forEach((line) => {
    target.push(`${indentation}${line}`.trimEnd());
  });
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

function addKeyValue(lines, label, value) {
  appendWrappedLines(lines, `${label}: ${value}`, { indent: '  ' });
}

function addParagraph(lines, text, options = {}) {
  appendWrappedLines(lines, text, { indent: '  ', ...options });
}

function addBulletList(lines, items) {
  if (!Array.isArray(items) || items.length === 0) {
    appendWrappedLines(lines, '- None', { indent: '    ' });
    return;
  }

  items.forEach((item) => {
    appendWrappedLines(lines, `- ${item}`, { indent: '    ' });
  });
}

function buildPdfLines(dataset, title) {
  const lines = [];
  lines.push(sanitizePdfText(title || 'My Money Blueprint'));
  lines.push('');
  appendWrappedLines(lines, 'Personalised summary of your Money Blueprint answers.', { indent: '' });
  lines.push('');

  addHeading(lines, 'Report details');
  addKeyValue('Report code', dataset.meta.formattedReportId || 'Not yet generated');
  addKeyValue('Generated on', dataset.meta.generatedAtLabel);
  addKeyValue('Status', dataset.meta.status === 'completed' ? 'Completed' : 'In progress');
  lines.push('');

  addHeading(lines, 'Household snapshot');
  addKeyValue('Plan nickname', dataset.basics.planName?.trim() || 'Not set');
  addKeyValue('Household size', dataset.meta.householdSize);
  addKeyValue('Net income', `${dataset.meta.netIncomeLabel} (${dataset.meta.frequencyLabel})`);
  addKeyValue('Monthly equivalent', dataset.meta.monthlyIncomeLabel);
  addKeyValue('Annual equivalent', dataset.meta.annualIncomeLabel);
  addKeyValue('Region', dataset.meta.regionLabel);
  addKeyValue('Primary focus', dataset.meta.focusLabel);
  lines.push('');

  addHeading(lines, 'Priorities & milestones');
  if (dataset.meta.goalLabels.length > 0) {
    appendWrappedLines(lines, 'Goal areas selected:', { indent: '  ' });
    addBulletList(lines, dataset.meta.goalLabels);
  } else {
    addParagraph(lines, 'Goal areas selected: None selected yet.');
  }
  addKeyValue('Headline goal', dataset.priorities.topGoal?.trim() || 'Not provided');
  addKeyValue(
    'Target amount',
    dataset.priorities.savingsTarget
      ? formatCurrency(dataset.priorities.savingsTarget)
      : 'Optional'
  );
  addKeyValue(
    'Ideal timeframe',
    TIMELINE_LABELS[dataset.priorities.timeline] || dataset.priorities.timeline || 'Not set'
  );
  lines.push('');

  addHeading(lines, 'Habits & resilience');
  addKeyValue('Budgeting style', dataset.meta.budgetingStyle);
  if (dataset.meta.budgetingStyleDescription) {
    addParagraph(lines, dataset.meta.budgetingStyleDescription);
  }
  addKeyValue('Confidence level', dataset.meta.confidenceLabel);
  addKeyValue('Check-in cadence', dataset.meta.checkInLabel);
  addKeyValue('Emergency fund cover', dataset.meta.emergencyFundLabel);
  addParagraph(
    lines,
    `Notes: ${
      dataset.habits.additionalNotes?.trim() ||
      'Use this space to record habits, triggers or wins you want to remember.'
    }`
  );
  lines.push('');

  addHeading(lines, 'Sharing preferences');
  addKeyValue('Reminder email', dataset.meta.shareEmail || 'Not provided');
  addKeyValue('Reminder consent', dataset.meta.consent ? 'Yes, send reminders' : 'No reminder consent');

  return lines;
}

function chunkLines(lines, perPage) {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [['']];
  }

  const chunkSize = Math.max(1, perPage);
  const chunks = [];
  for (let index = 0; index < lines.length; index += chunkSize) {
    chunks.push(lines.slice(index, index + chunkSize));
  }

  return chunks.length > 0 ? chunks : [['']];
}

function createPageContent(pageLines, layout) {
  const fontSize = layout.fontSize ?? 12;
  const lineHeight = layout.lineHeight ?? 16;
  const margin = layout.margin ?? DEFAULT_PAGE_MARGIN;
  const pageHeight = layout.pageHeight ?? DEFAULT_PAGE_SIZE[1];
  const startY = (layout.startY ?? pageHeight - margin).toFixed(2);

  let content = 'BT\n';
  content += `/F1 ${fontSize} Tf\n`;
  content += `${lineHeight.toFixed(2)} TL\n`;
  content += `1 0 0 1 ${margin.toFixed(2)} ${startY} Tm\n`;

  pageLines.forEach((line, index) => {
    const escaped = escapePdfText(line ?? '');
    if (index === 0) {
      content += `(${escaped}) Tj\n`;
    } else {
      content += `T*\n(${escaped}) Tj\n`;
    }
  });

  content += 'ET\n';
  return content;
}

function concatUint8Arrays(arrays) {
  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  arrays.forEach((array) => {
    result.set(array, offset);
    offset += array.length;
  });
  return result;
}

function createPdfDocument(lines, options = {}) {
  const pageSize = options.pageSize || DEFAULT_PAGE_SIZE;
  const pageWidth = Number.isFinite(pageSize?.[0]) ? pageSize[0] : DEFAULT_PAGE_SIZE[0];
  const pageHeight = Number.isFinite(pageSize?.[1]) ? pageSize[1] : DEFAULT_PAGE_SIZE[1];
  const margin = Number.isFinite(options.margin) ? options.margin : DEFAULT_PAGE_MARGIN;
  const lineHeight = Number.isFinite(options.lineHeight) ? options.lineHeight : 16;
  const fontSize = Number.isFinite(options.fontSize) ? options.fontSize : 12;
  const linesPerPage = Math.max(1, Math.floor((pageHeight - margin * 2) / lineHeight));
  const pages = chunkLines(lines, linesPerPage);

  const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
  const encode = (value) => {
    if (encoder) return encoder.encode(value);
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(value, 'utf8');
    }
    const arr = new Uint8Array(value.length);
    for (let i = 0; i < value.length; i += 1) {
      arr[i] = value.charCodeAt(i) & 0xff;
    }
    return arr;
  };

  const objects = [];
  const addObject = (body) => {
    const id = objects.length + 1;
    objects.push({ id, body });
    return id;
  };

  const fontObjectId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  const pageObjectIds = [];
  pages.forEach((pageLines) => {
    const pageContent = createPageContent(pageLines, {
      fontSize,
      lineHeight,
      margin,
      pageHeight,
    });
    const streamBody = `<< /Length ${pageContent.length} >>\nstream\n${pageContent}endstream`;
    const contentObjectId = addObject(streamBody);
    const pageObjectId = addObject(
      `<< /Type /Page /Parent PARENT_REF /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`
    );
    pageObjectIds.push(pageObjectId);
  });

  const kids = pageObjectIds.map((id) => `${id} 0 R`).join(' ');
  const pagesObjectId = addObject(`<< /Type /Pages /Kids [${kids}] /Count ${pageObjectIds.length} >>`);

  objects.forEach((object) => {
    if (object.body.includes('PARENT_REF')) {
      object.body = object.body.replace(/PARENT_REF/g, `${pagesObjectId} 0 R`);
    }
  });

  const catalogObjectId = addObject(`<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`);
  const infoObjectId = addObject(
    `<< /Producer (CalcMyMoney Blueprint Generator) /CreationDate (D:${new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')}) >>`
  );

  const headerBytes = encode('%PDF-1.4\n%âãÏÓ\n');
  const objectByteArrays = [];
  const xrefEntries = ['0000000000 65535 f \n'];

  let offset = headerBytes.length;
  objects.forEach(({ id, body }) => {
    const objectString = `${id} 0 obj\n${body}\nendobj\n`;
    const objectBytes = encode(objectString);
    objectByteArrays.push(objectBytes);
    const offsetString = String(offset).padStart(10, '0');
    xrefEntries.push(`${offsetString} 00000 n \n`);
    offset += objectBytes.length;
  });

  const xrefStart = offset;
  const trailerEntries = [`/Size ${objects.length + 1}`, `/Root ${catalogObjectId} 0 R`];
  if (infoObjectId) {
    trailerEntries.push(`/Info ${infoObjectId} 0 R`);
  }

  const xrefBytes = encode(`xref\n0 ${objects.length + 1}\n${xrefEntries.join('')}`);
  const trailerBytes = encode(
    `trailer\n<< ${trailerEntries.join(' ')} >>\nstartxref\n${xrefStart}\n%%EOF`
  );

  return concatUint8Arrays([headerBytes, ...objectByteArrays, xrefBytes, trailerBytes]);
}

export async function generateMoneyBlueprintPdf(report = {}, options = {}) {
  const dataset = buildMoneyBlueprintDataset(report, options);
  const title = options.title || 'My Money Blueprint';
  const lines = buildPdfLines(dataset, title);
  const pdfBytes = createPdfDocument(lines, options);
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
