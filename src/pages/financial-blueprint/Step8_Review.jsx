import React, { useMemo } from 'react';
import { parseMoney, safeGBP } from '@/utils/number';

const Section = ({ title, children }) => (
  <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <dl className="mt-4 space-y-2 text-sm text-gray-700">{children}</dl>
  </section>
);

const LineItem = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-100 py-2">
    <dt className="font-medium text-gray-600">{label}</dt>
    <dd className="font-semibold text-gray-900 text-right">{value}</dd>
  </div>
);

const formatGBP = (value, opts = {}) =>
  `£${safeGBP(parseMoney(value), { minimumFractionDigits: 0, maximumFractionDigits: 0, ...opts })}`;

const formatPercent = (value) => {
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) {
    return '—';
  }
  return `${numeric.toFixed(2)}%`;
};

const friendlyText = {
  blueprintFor: { individual: 'Individual', family: 'Family / Joint' },
  housingStatus: { renting: 'Renting', mortgaged: 'Mortgaged', owned: 'Owned outright' },
  maritalStatus: { single: 'Single', married: 'Married', 'in-partnership': 'In a partnership' },
  healthStatus: { good: 'Good', fair: 'Fair', poor: 'Poor' },
  smoker: { yes: 'Yes', no: 'No' },
  earningHabit: {
    active: 'Actively growing income',
    stable: 'Content with current income',
    passive: 'Rarely review income',
  },
  savingHabit: {
    disciplined: 'Disciplined saver',
    opportunistic: 'Save when possible',
    struggling: 'Struggle to save',
  },
  investingHabit: {
    confident: 'Confident investor',
    cautious: 'Cautious / exploring',
    avoidant: 'Prefer cash savings',
  },
  emergencySavingsConfidence: {
    comfortable: 'Comfortable with current buffer',
    building: 'Actively building emergency savings',
    concerned: 'Concerned about emergency savings',
  },
  yesNo: { yes: 'Yes', no: 'No' },
};

const Step8_Review = ({ onBack, onConfirm, values, isLoading }) => {
  const summary = useMemo(() => {
    const mortgageBalance = parseMoney(values.mortgageBalance);
    const mortgageRatePercent = Number.parseFloat(values.mortgageInterestRatePercent ?? 0);
    const mortgageTermYears = Number.parseFloat(values.mortgageRemainingTermYears ?? 0);
    const mortgageTermMonths = Math.max(0, Math.round(mortgageTermYears * 12));
    const mortgageMonthlyRate = mortgageRatePercent > 0 ? mortgageRatePercent / 100 / 12 : 0;
    const estimatedMortgagePayment =
      values.housingStatus === 'mortgaged' && mortgageBalance > 0 && mortgageTermMonths > 0
        ? mortgageMonthlyRate > 0
          ? mortgageBalance * (mortgageMonthlyRate / (1 - Math.pow(1 + mortgageMonthlyRate, -mortgageTermMonths)))
          : mortgageBalance / mortgageTermMonths
        : 0;

    return {
      profile: [
        ['Blueprint for', friendlyText.blueprintFor[values.blueprintFor] || values.blueprintFor || '—'],
      ['Location', values.location || '—'],
      ['Housing', friendlyText.housingStatus[values.housingStatus] || values.housingStatus || '—'],
      ['Marital status', friendlyText.maritalStatus[values.maritalStatus] || values.maritalStatus || '—'],
      ["Your age", values.age || '—'],
      values.blueprintFor === 'family'
        ? ["Partner age", values.partnerAge || '—']
        : null,
      ['Profession', values.profession || '—'],
      values.blueprintFor === 'family'
        ? ["Partner profession", values.partnerProfession || '—']
        : null,
      ['Children', values.numberOfChildren || '0'],
      ['Children with additional needs', values.specialNeedsChildren || '0'],
      values.specialNeedsChildren > 0
        ? ['Support needs', values.specialNeedsSupport || '—']
        : null,
      ['Overall health', friendlyText.healthStatus[values.healthStatus] || values.healthStatus || '—'],
      ['Smoker', friendlyText.smoker[values.smoker] || values.smoker || '—'],
      ['Weekly alcohol units', values.alcoholUnitsWeekly || '0'],
      ['Weekly tobacco spend', formatGBP(values.tobaccoSpendWeekly, { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ].filter(Boolean),
    income: [
      ['Your annual salary', formatGBP(values.yourSalary)],
      values.blueprintFor === 'family'
        ? ["Partner annual salary", formatGBP(values.partnerSalary)]
        : null,
      ['Other income (monthly)', formatGBP(values.otherIncomeMonthly ?? values.otherIncome)],
      ['Benefits (monthly)', formatGBP(values.benefitsIncomeMonthly ?? values.benefitsIncome)],
    ].filter(Boolean),
    expenses: [
      ['Housing', formatGBP(values.expensesHousing)],
      ['Utilities & bills', formatGBP(values.expensesUtilities)],
      ['Groceries', formatGBP(values.expensesGroceries)],
      ['Transport', formatGBP(values.expensesTransport)],
      ['Lifestyle & entertainment', formatGBP(values.expensesLifestyle)],
      ['Childcare & education', formatGBP(values.expensesChildcare)],
      ['Special needs support', formatGBP(values.specialNeedsCostsMonthly)],
      ['Emergency savings contributions', formatGBP(values.emergencySavingsContributionMonthly)],
      ['Your pension contributions', formatGBP(values.pensionContributionMonthly)],
      values.blueprintFor === 'family'
        ? ["Partner pension contributions", formatGBP(values.partnerPensionContributionMonthly)]
        : null,
      ['Monthly ISA investing', formatGBP(values.isaContributionMonthly)],
      values.blueprintFor === 'family'
        ? ["Partner ISA investing", formatGBP(values.partnerIsaContributionMonthly)]
        : null,
      ['Childcare vouchers received', formatGBP(values.childcareVouchersMonthly)],
    ].filter(Boolean),
    assets: [
      ['Cash savings', formatGBP(values.cashSavings)],
      ['Emergency fund balance', formatGBP(values.emergencyFundBalance)],
      ['Pension value', formatGBP(values.pensionValue)],
      ['Property value', formatGBP(values.propertyValue)],
      ['Investments held in ISAs', formatGBP(values.isaInvestmentsValue)],
      ['Other investments', formatGBP(values.otherInvestments)],
      ['Other assets', formatGBP(values.otherAssets)],
    ],
      liabilities: [
        values.housingStatus === 'mortgaged'
          ? ['Mortgage balance', formatGBP(values.mortgageBalance)]
          : null,
        values.housingStatus === 'mortgaged'
          ? ['Mortgage interest rate', formatPercent(values.mortgageInterestRatePercent)]
          : null,
        values.housingStatus === 'mortgaged'
          ? ['Mortgage term remaining (years)', values.mortgageRemainingTermYears || '0']
          : null,
        values.housingStatus === 'mortgaged'
          ? [
              'Estimated mortgage payment',
              formatGBP(estimatedMortgagePayment, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
            ]
          : null,
        ['Credit card debt', formatGBP(values.creditCardDebt)],
        ['Other loans', formatGBP(values.otherLoans)],
        ['Student loan balance', formatGBP(values.studentLoanBalance)],
        ['Insurance premiums (monthly total)', formatGBP(values.insurancePremiumsTotalMonthly)],
      ].filter(Boolean),
    mindset: [
      ['Earning habit', friendlyText.earningHabit[values.earningHabit] || values.earningHabit || '—'],
      ['Saving habit', friendlyText.savingHabit[values.savingHabit] || values.savingHabit || '—'],
      ['Investing habit', friendlyText.investingHabit[values.investingHabit] || values.investingHabit || '—'],
      [
        'Emergency savings confidence',
        friendlyText.emergencySavingsConfidence[values.emergencySavingsConfidence] ||
          values.emergencySavingsConfidence ||
          '—',
      ],
    ],
    protection: [
      ['Will in place', friendlyText.yesNo[values.hasWill] || values.hasWill || '—'],
      ['Life insurance', friendlyText.yesNo[values.hasLifeInsurance] || values.hasLifeInsurance || '—'],
      [
        'Life insurance benefit',
        formatGBP(values.lifeInsuranceBenefitAmount, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
      ],
      ['Income protection', friendlyText.yesNo[values.hasIncomeProtection] || values.hasIncomeProtection || '—'],
      [
        'Income protection benefit',
        formatGBP(values.incomeProtectionBenefitAmount, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
      ],
      ['Lasting power of attorney', friendlyText.yesNo[values.hasLPA] || values.hasLPA || '—'],
      values.blueprintFor === 'family'
        ? [
            'Partner life insurance',
            friendlyText.yesNo[values.partnerHasLifeInsurance] ||
              values.partnerHasLifeInsurance ||
              '—',
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner life insurance benefit',
            formatGBP(values.partnerLifeInsuranceBenefitAmount, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }),
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner income protection',
            friendlyText.yesNo[values.partnerHasIncomeProtection] ||
              values.partnerHasIncomeProtection ||
              '—',
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner income protection benefit',
            formatGBP(values.partnerIncomeProtectionBenefitAmount, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }),
          ]
        : null,
    ].filter(Boolean),
    retirement: [
      ['Target retirement age', values.retirementTargetAge || '—'],
      values.blueprintFor === 'family'
        ? ["Partner target retirement age", values.partnerRetirementTargetAge || '—']
        : null,
      ['Desired retirement income (monthly)', formatGBP(values.retirementIncomeTargetMonthly)],
      values.blueprintFor === 'family'
        ? [
            "Partner retirement income target",
            formatGBP(values.partnerRetirementIncomeTargetMonthly),
          ]
        : null,
      ['Qualifying NI years', values.statePensionQualifyingYears || '0'],
      ['Last checked state pension', values.statePensionLastStatementYear || '—'],
      ['Estimated state pension (monthly)', formatGBP(values.statePensionForecastAmountMonthly)],
    ].filter(Boolean),
    protectionDetails: [
      [
        'Life insurance provider',
        values.lifeInsuranceProvider && values.lifeInsuranceProvider.trim().length > 0
          ? values.lifeInsuranceProvider
          : '—',
      ],
      ['Life insurance sum assured', formatGBP(values.lifeInsuranceSumAssured)],
      ['Life insurance premium (monthly)', formatGBP(values.lifeInsurancePremiumMonthlyDetail)],
      [
        'Life insurance beneficiary notes',
        values.lifeInsuranceBeneficiaryNotes && values.lifeInsuranceBeneficiaryNotes.trim().length > 0
          ? values.lifeInsuranceBeneficiaryNotes
          : '—',
      ],
      [
        'Income protection insurer',
        values.incomeProtectionProvider && values.incomeProtectionProvider.trim().length > 0
          ? values.incomeProtectionProvider
          : '—',
      ],
      ['Income protection monthly benefit', formatGBP(values.incomeProtectionBenefitMonthly)],
      [
        'Income protection premium (monthly)',
        formatGBP(values.incomeProtectionPremiumMonthlyDetail),
      ],
      [
        'Income protection notes',
        values.incomeProtectionBeneficiaryNotes &&
        values.incomeProtectionBeneficiaryNotes.trim().length > 0
          ? values.incomeProtectionBeneficiaryNotes
          : '—',
      ],
      values.blueprintFor === 'family'
        ? [
            'Partner life insurance provider',
            values.partnerLifeInsuranceProvider && values.partnerLifeInsuranceProvider.trim().length > 0
              ? values.partnerLifeInsuranceProvider
              : '—',
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner life insurance sum assured',
            formatGBP(values.partnerLifeInsuranceSumAssured),
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner life insurance premium (monthly)',
            formatGBP(values.partnerLifeInsurancePremiumMonthlyDetail),
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner life insurance notes',
            values.partnerLifeInsuranceBeneficiaryNotes &&
            values.partnerLifeInsuranceBeneficiaryNotes.trim().length > 0
              ? values.partnerLifeInsuranceBeneficiaryNotes
              : '—',
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner income protection insurer',
            values.partnerIncomeProtectionProvider &&
            values.partnerIncomeProtectionProvider.trim().length > 0
              ? values.partnerIncomeProtectionProvider
              : '—',
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner income protection monthly benefit',
            formatGBP(values.partnerIncomeProtectionBenefitMonthly),
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner income protection premium (monthly)',
            formatGBP(values.partnerIncomeProtectionPremiumMonthlyDetail),
          ]
        : null,
      values.blueprintFor === 'family'
        ? [
            'Partner income protection notes',
            values.partnerIncomeProtectionBeneficiaryNotes &&
            values.partnerIncomeProtectionBeneficiaryNotes.trim().length > 0
              ? values.partnerIncomeProtectionBeneficiaryNotes
              : '—',
          ]
        : null,
    ].filter(Boolean),
    };
  }, [values]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Review your answers</h2>
        <p className="mt-2 text-gray-600">
          Double-check your information before we generate your personalised money blueprint.
        </p>
      </div>

      <div className="grid gap-6">
        <Section title="Profile">
          {summary.profile.map(([label, value]) => (
            <LineItem key={label} label={label} value={value} />
          ))}
        </Section>
        <Section title="Income">
          {summary.income.map(([label, value]) => (
            <LineItem key={label} label={label} value={value} />
          ))}
        </Section>
        <Section title="Monthly expenses">
          {summary.expenses.map(([label, value]) => (
            <LineItem key={label} label={label} value={value} />
          ))}
        </Section>
        <Section title="Assets">
          {summary.assets.map(([label, value]) => (
            <LineItem key={label} label={label} value={value} />
          ))}
        </Section>
        <Section title="Liabilities">
          {summary.liabilities.map(([label, value]) => (
            <LineItem key={label} label={label} value={value} />
          ))}
        </Section>
      <Section title="Mindset & behaviours">
        {summary.mindset.map(([label, value]) => (
          <LineItem key={label} label={label} value={value} />
        ))}
      </Section>
      <Section title="Protection">
        {summary.protection.map(([label, value]) => (
          <LineItem key={label} label={label} value={value} />
        ))}
      </Section>
      <Section title="Retirement goals">
        {summary.retirement.map(([label, value]) => (
          <LineItem key={label} label={label} value={value} />
        ))}
      </Section>
      <Section title="Protection policy details">
        {summary.protectionDetails.map(([label, value]) => (
          <LineItem key={label} label={label} value={value} />
        ))}
      </Section>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back to edit
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating…' : 'Confirm & generate report'}
        </button>
      </div>
    </div>
  );
};

export default Step8_Review;
