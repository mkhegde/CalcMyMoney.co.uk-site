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

const formatGBP = (value, opts = {}) => `£${safeGBP(parseMoney(value), { minimumFractionDigits: 0, maximumFractionDigits: 0, ...opts })}`;

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
  yesNo: { yes: 'Yes', no: 'No' },
};

const Step8_Review = ({ onBack, onConfirm, values, isLoading }) => {
  const summary = useMemo(() => ({
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
    ],
    assets: [
      ['Cash savings', formatGBP(values.cashSavings)],
      ['Pension value', formatGBP(values.pensionValue)],
      ['Property value', formatGBP(values.propertyValue)],
      ['Other investments', formatGBP(values.otherInvestments)],
      ['Other assets', formatGBP(values.otherAssets)],
    ],
    liabilities: [
      ['Monthly rent', formatGBP(values.monthlyRent)],
      ['Mortgage balance', formatGBP(values.mortgageBalance)],
      ['Mortgage payment (monthly)', formatGBP(values.mortgageMonthlyPayment)],
      ['Mortgage term remaining (years)', values.mortgageRemainingTermYears || '0'],
      ['Credit card debt', formatGBP(values.creditCardDebt)],
      ['Other loans', formatGBP(values.otherLoans)],
      ['Student loan balance', formatGBP(values.studentLoanBalance)],
    ],
    mindset: [
      ['Earning habit', friendlyText.earningHabit[values.earningHabit] || values.earningHabit || '—'],
      ['Saving habit', friendlyText.savingHabit[values.savingHabit] || values.savingHabit || '—'],
      ['Investing habit', friendlyText.investingHabit[values.investingHabit] || values.investingHabit || '—'],
    ],
    protection: [
      ['Will in place', friendlyText.yesNo[values.hasWill] || values.hasWill || '—'],
      ['Life insurance', friendlyText.yesNo[values.hasLifeInsurance] || values.hasLifeInsurance || '—'],
      ['Income protection', friendlyText.yesNo[values.hasIncomeProtection] || values.hasIncomeProtection || '—'],
      ['Lasting power of attorney', friendlyText.yesNo[values.hasLPA] || values.hasLPA || '—'],
    ],
  }), [values]);

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
