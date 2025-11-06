// Filename: /api/generate-report.js
// ** FINAL PRODUCTION VERSION: Pre-calculates metrics in JS for accuracy **

const MONEY_FIELDS = [
  'yourSalary',
  "partnerSalary",
  'otherIncome',
  'otherIncomeMonthly',
  'benefitsIncome',
  'benefitsIncomeMonthly',
  'cashSavings',
  'pensionValue',
  'propertyValue',
  'otherInvestments',
  'otherAssets',
  'mortgageBalance',
  'housingPaymentMonthly',
  'creditCardDebt',
  'otherLoans',
  'studentLoanBalance',
  'expensesHousing',
  'expensesUtilities',
  'expensesGroceries',
  'expensesTransport',
  'expensesLifestyle',
  'expensesChildcare',
  'specialNeedsCostsMonthly',
  'tobaccoSpendWeekly',
];

const NUMBER_FIELDS = [
  'age',
  'partnerAge',
  'numberOfChildren',
  'specialNeedsChildren',
  'mortgageRemainingTermYears',
  'mortgageInterestRatePercent',
  'alcoholUnitsWeekly',
];

const PERSONAL_ALLOWANCE = 12570;
const DEFAULT_RETIREMENT_AGE = 67;
const RETIREMENT_GROWTH_RATE = 0.03;
const SUSTAINABLE_WITHDRAWAL_RATE = 0.04;

const parseMoney = (value) => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const numericValue = Number.parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const normaliseNumericFields = (data) => {
  const normalised = { ...data };

  MONEY_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      normalised[field] = parseMoney(data[field]);
    } else {
      normalised[field] = 0;
    }
  });

  NUMBER_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      normalised[field] = parseNumber(data[field]);
    }
  });

  return normalised;
};

const roundToTwo = (value) => Number.parseFloat(Number(value || 0).toFixed(2));

const determineTaxBand = (income, region = 'england') => {
  const incomeValue = Number.isFinite(income) ? income : 0;
  const regionKey = region?.toLowerCase();

  const bandsByRegion = {
    england: [
      { threshold: 125140, label: 'Additional rate (45%)' },
      { threshold: 50270, label: 'Higher rate (40%)' },
      { threshold: 12570, label: 'Basic rate (20%)' },
      { threshold: 0, label: 'Within personal allowance (0%)' },
    ],
    wales: [
      { threshold: 125140, label: 'Additional rate (45%)' },
      { threshold: 50270, label: 'Higher rate (40%)' },
      { threshold: 12570, label: 'Basic rate (20%)' },
      { threshold: 0, label: 'Within personal allowance (0%)' },
    ],
    'northern-ireland': [
      { threshold: 125140, label: 'Additional rate (45%)' },
      { threshold: 50270, label: 'Higher rate (40%)' },
      { threshold: 12570, label: 'Basic rate (20%)' },
      { threshold: 0, label: 'Within personal allowance (0%)' },
    ],
    scotland: [
      { threshold: 125140, label: 'Top rate (48%)' },
      { threshold: 75000, label: 'Advanced rate (45%)' },
      { threshold: 43663, label: 'Higher rate (42%)' },
      { threshold: 26562, label: 'Intermediate rate (21%)' },
      { threshold: 14877, label: 'Basic rate (20%)' },
      { threshold: 12570, label: 'Starter rate (19%)' },
      { threshold: 0, label: 'Within personal allowance (0%)' },
    ],
  };

  const applicableBands = bandsByRegion[regionKey] || bandsByRegion.england;
  const matchingBand = applicableBands.find((band) => incomeValue > band.threshold);
  return matchingBand ? matchingBand.label : applicableBands[applicableBands.length - 1].label;
};

const determineNIBand = (income) => {
  const value = Number.isFinite(income) ? income : 0;
  if (value <= 12570) {
    return 'Below primary threshold';
  }
  if (value <= 50270) {
    return 'Main rate band (10%)';
  }
  return 'Upper earnings band (2%)';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const userData = req.body;

    if (!userData || parseMoney(userData.yourSalary) <= 0) {
      return res.status(400).json({ error: 'Incomplete user data provided. Salary is required.' });
    }

    // --- STEP 1: PERFORM CALCULATIONS IN JAVASCRIPT ---
    const normalised = normaliseNumericFields(userData);

    const annualOtherIncome = normalised.otherIncome * 12;
    const annualBenefitsIncome = normalised.benefitsIncome * 12;

    const grossAnnualIncome =
      normalised.yourSalary +
      normalised.partnerSalary +
      annualOtherIncome +
      annualBenefitsIncome;
    const grossMonthlyIncome = grossAnnualIncome / 12;

    const totalAssets =
      normalised.cashSavings +
      normalised.pensionValue +
      normalised.propertyValue +
      normalised.otherInvestments +
      normalised.otherAssets;

    const totalLiabilities =
      normalised.mortgageBalance +
      normalised.creditCardDebt +
      normalised.otherLoans +
      normalised.studentLoanBalance;

    const netWorth = totalAssets - totalLiabilities;

    const mortgageInterestRatePercent = Number.isFinite(normalised.mortgageInterestRatePercent)
      ? normalised.mortgageInterestRatePercent
      : 0;
    const mortgageRemainingTermYears = Math.max(0, normalised.mortgageRemainingTermYears || 0);
    const mortgageRemainingTermMonths = Math.round(mortgageRemainingTermYears * 12);
    const mortgageMonthlyRate = mortgageInterestRatePercent > 0 ? mortgageInterestRatePercent / 100 / 12 : 0;
    const estimatedMortgagePayment =
      userData.housingStatus === 'mortgaged' && normalised.mortgageBalance > 0 && mortgageRemainingTermMonths > 0
        ? mortgageMonthlyRate > 0
          ? normalised.mortgageBalance *
            (mortgageMonthlyRate / (1 - Math.pow(1 + mortgageMonthlyRate, -mortgageRemainingTermMonths)))
          : normalised.mortgageBalance / mortgageRemainingTermMonths
        : 0;

    const housingPaymentMonthly = (() => {
      if (normalised.housingPaymentMonthly > 0) {
        return normalised.housingPaymentMonthly;
      }
      if (normalised.expensesHousing > 0) {
        return normalised.expensesHousing;
      }
      if (userData.housingStatus === 'mortgaged') {
        return estimatedMortgagePayment;
      }
      return 0;
    })();

    const baseLivingCostsMonthly =
      normalised.expensesUtilities +
      normalised.expensesGroceries +
      normalised.expensesTransport +
      normalised.expensesLifestyle +
      normalised.expensesChildcare +
      normalised.specialNeedsCostsMonthly;

    const discretionarySpendingMonthly = (normalised.tobaccoSpendWeekly * 52) / 12;

    const totalMonthlyExpenses =
      housingPaymentMonthly + baseLivingCostsMonthly + discretionarySpendingMonthly;
    const totalAnnualExpenses = totalMonthlyExpenses * 12;

    const disposableIncomeMonthly = grossMonthlyIncome - totalMonthlyExpenses;
    const disposableIncomeAnnual = disposableIncomeMonthly * 12;
    const savingsRate = grossAnnualIncome > 0 ? disposableIncomeAnnual / grossAnnualIncome : 0;
    const emergencyFundCoverageMonths =
      totalMonthlyExpenses > 0 ? normalised.cashSavings / totalMonthlyExpenses : 0;

    const yearsToRetirement = Math.max(0, DEFAULT_RETIREMENT_AGE - normalised.age);
    const projectedPensionPot =
      normalised.pensionValue * Math.pow(1 + RETIREMENT_GROWTH_RATE, yearsToRetirement);
    const sustainableAnnualDrawdown = projectedPensionPot * SUSTAINABLE_WITHDRAWAL_RATE;

    const partnerProjection =
      normalised.partnerAge > 0
        ? {
            yearsToRetirement: Math.max(0, DEFAULT_RETIREMENT_AGE - normalised.partnerAge),
          }
        : undefined;

    const taxableIncomeAfterAllowance = Math.max(0, grossAnnualIncome - PERSONAL_ALLOWANCE);

    // Create an object with our reliable calculations
    const calculatedMetrics = {
      currency: 'GBP',
      incomes: {
        grossAnnualIncome: roundToTwo(grossAnnualIncome),
        grossMonthlyIncome: roundToTwo(grossMonthlyIncome),
        annualBreakdown: {
          yourSalary: roundToTwo(normalised.yourSalary),
          partnerSalary: roundToTwo(normalised.partnerSalary),
          otherIncomeAnnual: roundToTwo(annualOtherIncome),
          benefitsIncomeAnnual: roundToTwo(annualBenefitsIncome),
        },
        monthlyBreakdown: {
          yourSalary: roundToTwo(normalised.yourSalary / 12),
          partnerSalary: roundToTwo(normalised.partnerSalary / 12),
          otherIncomeMonthly: roundToTwo(normalised.otherIncome),
          benefitsIncomeMonthly: roundToTwo(normalised.benefitsIncome),
        },
      },
      assets: {
        total: roundToTwo(totalAssets),
        cashSavings: roundToTwo(normalised.cashSavings),
        pensionValue: roundToTwo(normalised.pensionValue),
        propertyValue: roundToTwo(normalised.propertyValue),
        otherInvestments: roundToTwo(normalised.otherInvestments),
        otherAssets: roundToTwo(normalised.otherAssets),
      },
      liabilities: {
        total: roundToTwo(totalLiabilities),
        mortgageBalance: roundToTwo(normalised.mortgageBalance),
        creditCardDebt: roundToTwo(normalised.creditCardDebt),
        otherLoans: roundToTwo(normalised.otherLoans),
        studentLoanBalance: roundToTwo(normalised.studentLoanBalance),
        ...(userData.housingStatus === 'mortgaged'
          ? {
              mortgageDetails: {
                interestRateAnnualPercent: roundToTwo(mortgageInterestRatePercent),
                remainingTermYears: roundToTwo(mortgageRemainingTermYears),
                remainingTermMonths: mortgageRemainingTermMonths,
                amortizationHorizonMonths: mortgageRemainingTermMonths,
                amortizationHorizonYears: roundToTwo(mortgageRemainingTermMonths / 12),
                estimatedMonthlyDebtService: roundToTwo(estimatedMortgagePayment),
              },
            }
          : {}),
      },
      netWorth: roundToTwo(netWorth),
      expenses: {
        monthlyTotal: roundToTwo(totalMonthlyExpenses),
        annualTotal: roundToTwo(totalAnnualExpenses),
        housingPaymentMonthly: roundToTwo(housingPaymentMonthly),
        baseLivingCostsMonthly: roundToTwo(baseLivingCostsMonthly),
        discretionarySpendingMonthly: roundToTwo(discretionarySpendingMonthly),
        ...(userData.housingStatus === 'mortgaged'
          ? { mortgageDebtServiceMonthly: roundToTwo(estimatedMortgagePayment) }
          : {}),
      },
      cashFlow: {
        disposableIncomeMonthly: roundToTwo(disposableIncomeMonthly),
        disposableIncomeAnnual: roundToTwo(disposableIncomeAnnual),
        savingsRate: roundToTwo(savingsRate),
        emergencyFundCoverageMonths: roundToTwo(emergencyFundCoverageMonths),
      },
      retirement: {
        targetRetirementAge: DEFAULT_RETIREMENT_AGE,
        yearsToRetirement,
        assumedGrowthRate: RETIREMENT_GROWTH_RATE,
        projectedPensionPot: roundToTwo(projectedPensionPot),
        sustainableAnnualDrawdown: roundToTwo(sustainableAnnualDrawdown),
        ...(partnerProjection ? { partner: partnerProjection } : {}),
      },
      tax: {
        region: userData.location || 'england',
        incomeTaxBand: determineTaxBand(grossAnnualIncome, userData.location),
        nationalInsuranceBand: determineNIBand(grossAnnualIncome),
        personalAllowance: PERSONAL_ALLOWANCE,
        taxableIncomeAfterAllowance: roundToTwo(taxableIncomeAfterAllowance),
      },
    };

    // --- STEP 2: SEND PRE-CALCULATED DATA TO THE AI ---
    const prompt = buildProductionPrompt(userData, calculatedMetrics);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const requestBody = {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API Error Body:', errorBody);
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }

    const llmResult = await response.json();
    const reportJsonText = llmResult.choices[0].message.content;
    const reportObject = JSON.parse(reportJsonText);

    const netAnnualIncome = grossAnnualIncome - totalAnnualExpenses;
    const netMonthlyIncome = netAnnualIncome / 12;
    const monthlySurplus = disposableIncomeMonthly;
    const monthlyDeficit = monthlySurplus < 0 ? Math.abs(monthlySurplus) : 0;
    const debtToIncomeRatio = grossAnnualIncome > 0 ? totalLiabilities / grossAnnualIncome : null;
    const retirementShortfallAnnual = Math.max(0, totalAnnualExpenses - sustainableAnnualDrawdown);
    const retirementShortfallMonthly = retirementShortfallAnnual / 12;

    const quantitativeAnalysis = {
      income: {
        grossAnnual: roundToTwo(grossAnnualIncome),
        grossMonthly: roundToTwo(grossMonthlyIncome),
        netAnnual: roundToTwo(netAnnualIncome),
        netMonthly: roundToTwo(netMonthlyIncome),
      },
      cashflow: {
        monthlySurplus: roundToTwo(monthlySurplus),
        monthlyDeficit: roundToTwo(monthlyDeficit),
        annualExpenses: roundToTwo(totalAnnualExpenses),
        monthlyExpenses: roundToTwo(totalMonthlyExpenses),
        savingsRate: roundToTwo(savingsRate),
        emergencyFundCoverageMonths: roundToTwo(emergencyFundCoverageMonths),
      },
      debt: {
        totalLiabilities: roundToTwo(totalLiabilities),
        debtToIncomeRatio: debtToIncomeRatio !== null ? roundToTwo(debtToIncomeRatio) : null,
      },
      taxes: {
        region: calculatedMetrics.tax.region,
        incomeTaxBand: calculatedMetrics.tax.incomeTaxBand,
        nationalInsuranceBand: calculatedMetrics.tax.nationalInsuranceBand,
        personalAllowance: calculatedMetrics.tax.personalAllowance,
        taxableIncomeAfterAllowance: calculatedMetrics.tax.taxableIncomeAfterAllowance,
      },
      retirement: {
        projectedPensionPot: roundToTwo(projectedPensionPot),
        sustainableAnnualDrawdown: roundToTwo(sustainableAnnualDrawdown),
        retirementShortfallAnnual: roundToTwo(retirementShortfallAnnual),
        retirementShortfallMonthly: roundToTwo(retirementShortfallMonthly),
      },
    };

    return res.status(200).json({
      ...reportObject,
      quantitativeAnalysis,
    });
  } catch (error) {
    console.error('Error in generateReport handler:', error);
    return res.status(500).json({ error: 'Failed to generate financial report.' });
  }
}

// --- UPDATED PRODUCTION PROMPT ---
function buildProductionPrompt(userData, calculatedMetrics) {
  return `
    **Role:** You are an expert UK financial analyst AI preparing a comprehensive household blueprint.

    **Source Data:**
    • \'User Data\' contains the raw survey responses.
    • \'Calculated Metrics\' contains pre-calculated income, asset, liability, cash-flow, tax, and retirement figures.

    **CRITICAL INSTRUCTION:**
    • Every numeric value referenced in the report MUST be echoed exactly from \'Calculated Metrics\'. Do **not** recalculate, round, or infer new amounts.
    • When providing commentary, explicitly restate the relevant figures (e.g., "Net worth is £X" using the provided number).

    **Output:** Return a single valid JSON object with the following top-level keys in order:
    1. \'profileSummary\'
    2. \'financialOverview\'
    3. \'cashFlowAnalysis\'
    4. \'taxAnalysis\'
    5. \'retirementSnapshot\'
    6. \'protectionReview\'
    7. \'swotAnalysis\'
    8. \'actionPlan\'

    **Detailed Requirements:**
    • \'profileSummary\': Object with keys { userCode, headline, household, dependants, employment, location, incomeOverview, priorities }. userCode must follow the format "CMMFB" + 6 digits. Reference incomes from calculatedMetrics.incomes.

    • \'financialOverview\': Object with structure {
        netWorth: { value, insight },
        assets: { total, commentary, breakdown },
        liabilities: { total, commentary, breakdown }
      }.
      breakdown objects must echo calculatedMetrics.assets and calculatedMetrics.liabilities fields (cashSavings, pensionValue, propertyValue, otherInvestments, otherAssets, mortgageBalance, creditCardDebt, otherLoans, studentLoanBalance).

    • \'cashFlowAnalysis\': Object with {
        incomeSummary: { grossAnnualIncome, grossMonthlyIncome, annualBreakdown, monthlyBreakdown, commentary }, where annualBreakdown must include yourSalary, partnerSalary, otherIncomeAnnual, benefitsIncomeAnnual and monthlyBreakdown must include yourSalary, partnerSalary, otherIncomeMonthly, benefitsIncomeMonthly from calculatedMetrics.incomes,
        expenseSummary: { monthlyTotal, annualTotal, detail, commentary }, where detail must include housingPaymentMonthly, baseLivingCostsMonthly, discretionarySpendingMonthly values from calculatedMetrics.expenses,
        disposableIncome: { monthly, annual, savingsRate, emergencyFundCoverageMonths, commentary }
      }.
      Use the corresponding figures from calculatedMetrics.incomes, calculatedMetrics.expenses, and calculatedMetrics.cashFlow.

    • \'taxAnalysis\': Object with { summary, taxBand, nationalInsuranceBand, figures, recommendations } where figures includes { region, personalAllowance, taxableIncomeAfterAllowance, incomeTaxBand, nationalInsuranceBand } from calculatedMetrics.tax.

    • \'retirementSnapshot\': Object with { readinessSummary, yearsToRetirement, projectedPensionPot, sustainableAnnualDrawdown, assumptions, nextSteps }. Use calculatedMetrics.retirement exactly, and include a partner object with yearsToRetirement if calculatedMetrics.retirement.partner exists.

    • \'protectionReview\': Object with { coverageOverview, existingCover, gaps, priorities }. existingCover must mirror the yes/no protection answers from User Data (hasWill, hasLifeInsurance, hasIncomeProtection, hasLPA). Gaps and priorities must align with those answers and the emergency fund coverage from calculatedMetrics.cashFlow.emergencyFundCoverageMonths.

    • \'swotAnalysis\': Object with arrays { strengths, weaknesses, opportunities, threats }. Each array requires at least four concise, insight-driven points referencing both survey context and calculated metrics.

    • \'actionPlan\': Array of 5-7 objects with keys { priority, action, explanation, potentialSaving }. Priorities must align with the SWOT analysis and the quantitative metrics (e.g., emergency fund months, liabilities, tax band). Use GBP figures from calculated metrics when quoting potentialSaving.

    **Tone & Style:** Professional, actionable, and specific. Always cite the exact numeric values when relevant.

    **User Data:**
    ${JSON.stringify(userData, null, 2)}

    **Calculated Metrics:**
    ${JSON.stringify(calculatedMetrics, null, 2)}
  `;
}
