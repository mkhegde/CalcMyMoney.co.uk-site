import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  buildMoneyBlueprintDataset,
  buildMoneyBlueprintCsvRows,
  generateMoneyBlueprintCsv,
  formatBlueprintReportId,
} from '../lib/moneyBlueprint/report.js';

const baseReport = {
  reportId: 'ABCD1234EFGH',
  status: 'completed',
  completedAt: '2024-04-15T08:30:00Z',
  basics: {
    planName: 'Sky High',
    householdSize: '4',
    netIncome: '£2,500.50',
    incomeFrequency: 'four-weekly',
    region: 'wales',
    focus: 'growth',
  },
  priorities: {
    goalAreas: ['clear-debt', 'upgrade-budgeting'],
    topGoal: 'Reduce credit card balances',
    savingsTarget: '1500',
    timeline: '6-12',
  },
  habits: {
    budgetingStyle: 'detailed',
    checkInFrequency: 'monthly',
    emergencyFundMonths: '1-3',
    confidenceLevel: 'steady',
    additionalNotes: 'Review new budgeting apps each quarter.',
  },
  summary: {
    shareEmail: 'team@example.com',
    consentToContact: true,
  },
};

const withReportClone = () => JSON.parse(JSON.stringify(baseReport));

const expectCloseTo = (actual, expected, tolerance = 0.0001) => {
  const difference = Math.abs(actual - expected);
  assert.ok(
    difference <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected} (difference ${difference})`
  );
};

describe('formatBlueprintReportId', () => {
  test('splits identifiers into blocks of four characters', () => {
    assert.equal(formatBlueprintReportId('ABCD123456'), 'ABCD 1234 56');
    assert.equal(formatBlueprintReportId(''), '');
    assert.equal(formatBlueprintReportId(null), '');
  });
});

describe('buildMoneyBlueprintDataset', () => {
  test('derives household metadata and income calculations', () => {
    const generatedAt = '2024-05-01T12:00:00Z';
    const dataset = buildMoneyBlueprintDataset(withReportClone(), { generatedAt });

    assert.equal(dataset.meta.reportId, 'ABCD1234EFGH');
    assert.equal(dataset.meta.formattedReportId, 'ABCD 1234 EFGH');
    assert.equal(dataset.meta.status, 'completed');
    assert.equal(dataset.basics.planName, 'Sky High');
    assert.equal(dataset.meta.householdSize, '4');
    assert.equal(dataset.meta.frequencyLabel, 'Every 4 weeks');
    assert.equal(dataset.meta.regionLabel, 'Wales');
    assert.equal(dataset.meta.focusLabel, 'Grow savings & investments');

    assert.equal(dataset.meta.goalCount, 2);
    assert.deepEqual(dataset.meta.goalLabels, [
      'Pay down expensive debt faster',
      'Improve budgeting habits',
    ]);

    assert.equal(dataset.meta.budgetingStyle, 'Detailed planner');
    assert.equal(
      dataset.meta.budgetingStyleDescription,
      'I use a spreadsheet or app to plan every pound.'
    );
    assert.equal(dataset.meta.shareEmail, 'team@example.com');
    assert.equal(dataset.meta.consent, true);

    assert.equal(dataset.priorities.topGoal, 'Reduce credit card balances');
    assert.equal(dataset.priorities.timeline, '6-12');
    assert.equal(dataset.habits.additionalNotes, 'Review new budgeting apps each quarter.');

    assert.equal(dataset.meta.netIncomeValue, 2500.5);
    assert.ok(Number.isFinite(dataset.meta.annualIncome));
    assert.ok(Number.isFinite(dataset.meta.monthlyIncome));
    expectCloseTo(dataset.meta.annualIncome, 2500.5 * 13);
    expectCloseTo(dataset.meta.monthlyIncome, (2500.5 * 13) / 12);

    assert.ok(dataset.meta.generatedAt instanceof Date);
    assert.ok(dataset.meta.generatedAtLabel.includes('2024'));
  });
});

describe('buildMoneyBlueprintCsvRows', () => {
  test('summarises the dataset into labelled rows', () => {
    const rows = buildMoneyBlueprintCsvRows(withReportClone(), {
      generatedAt: '2024-05-01T12:00:00Z',
    });

    assert.deepEqual(rows[0], ['Section', 'Field', 'Value']);

    const statusRow = rows.find((row) => row[1] === 'Status');
    assert.equal(statusRow[2], 'Completed');

    const goalRow = rows.find((row) => row[1] === 'Goal areas');
    assert.equal(goalRow[2], 'Pay down expensive debt faster; Improve budgeting habits');

    const consentRow = rows.find((row) => row[1] === 'Reminder consent');
    assert.equal(consentRow[2], 'Yes');
  });
});

describe('generateMoneyBlueprintCsv', () => {
  test('returns a CSV string, rows and browser-friendly blob', () => {
    const result = generateMoneyBlueprintCsv(withReportClone(), {
      generatedAt: '2024-05-01T12:00:00Z',
    });

    assert.ok(result.csv.startsWith('"Section","Field","Value"'));
    assert.ok(Array.isArray(result.rows));
    assert.ok(result.rows.length > 5);

    if (typeof Blob === 'undefined') {
      assert.equal(result.blob, null);
    } else {
      assert.ok(result.blob instanceof Blob);
      assert.ok(result.blob.size > 0);
    }
  });
});
