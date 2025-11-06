import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normaliseNumericFields,
  computeQuantitativeMetrics,
  determineTaxBand,
  determineNIBand,
} from '../generate-report.js';

const sampleUserData = {
  yourSalary: 50000,
  partnerSalary: 30000,
  otherIncome: 500,
  benefitsIncome: 250,
  cashSavings: 12000,
  pensionValue: 40000,
  propertyValue: 250000,
  otherInvestments: 10000,
  otherAssets: 5000,
  mortgageBalance: 180000,
  creditCardDebt: 2000,
  otherLoans: 4000,
  studentLoanBalance: 3000,
  expensesHousing: 1200,
  expensesUtilities: 300,
  expensesGroceries: 450,
  expensesTransport: 200,
  expensesLifestyle: 250,
  expensesChildcare: 0,
  specialNeedsCostsMonthly: 0,
  tobaccoSpendWeekly: 10,
  age: 40,
  partnerAge: 38,
  housingStatus: 'mortgaged',
  mortgageInterestRatePercent: 3,
  mortgageRemainingTermYears: 20,
  location: 'england',
};

test('computeQuantitativeMetrics produces consistent income and cashflow summaries', () => {
  const normalised = normaliseNumericFields(sampleUserData);
  const { calculatedMetrics, quantitativeAnalysis } = computeQuantitativeMetrics(normalised, sampleUserData);

  assert.ok(Math.abs(calculatedMetrics.incomes.grossAnnualIncome - (50000 + 30000 + 500 * 12 + 250 * 12)) < 0.01);
  assert.ok(
    Math.abs(
      quantitativeAnalysis.income.grossMonthly -
        Number((quantitativeAnalysis.income.grossAnnual / 12).toFixed(2)),
    ) < 0.01,
  );
  assert.ok(
    Math.abs(
      quantitativeAnalysis.cashflow.annualExpenses -
        Number((quantitativeAnalysis.cashflow.monthlyExpenses * 12).toFixed(2)),
    ) < 0.1,
  );
  assert.ok(quantitativeAnalysis.cashflow.savingsRate >= 0 && quantitativeAnalysis.cashflow.savingsRate <= 1);
  assert.equal(
    quantitativeAnalysis.taxes.incomeTaxBand,
    determineTaxBand(calculatedMetrics.incomes.grossAnnualIncome, sampleUserData.location),
  );
  assert.equal(
    quantitativeAnalysis.taxes.nationalInsuranceBand,
    determineNIBand(calculatedMetrics.incomes.grossAnnualIncome),
  );
});

test('computeQuantitativeMetrics handles sparse inputs without NaN values', () => {
  const minimalData = {
    yourSalary: '0',
    expensesHousing: 0,
    expensesUtilities: 0,
    expensesGroceries: 0,
    expensesTransport: 0,
    expensesLifestyle: 0,
  };
  const normalised = normaliseNumericFields(minimalData);
  const { quantitativeAnalysis } = computeQuantitativeMetrics(normalised, minimalData);

  assert.equal(quantitativeAnalysis.income.grossAnnual, 0);
  assert.equal(quantitativeAnalysis.cashflow.monthlySurplus, 0);
  assert.equal(quantitativeAnalysis.debt.totalLiabilities, 0);
  assert.equal(quantitativeAnalysis.debt.debtToIncomeRatio, null);
});

test('determineTaxBand respects regional thresholds', () => {
  assert.equal(determineTaxBand(20000, 'england'), 'Basic rate (20%)');
  assert.equal(determineTaxBand(60000, 'england'), 'Higher rate (40%)');
  assert.equal(determineTaxBand(80000, 'scotland'), 'Advanced rate (45%)');
});
