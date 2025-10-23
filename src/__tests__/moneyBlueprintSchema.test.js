import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  validateMoneyBlueprintStep,
  validateMoneyBlueprint,
} from '../lib/moneyBlueprint/schema.js';

const validBasics = {
  planName: 'Spring refresh',
  householdSize: '3',
  netIncome: '2500.50',
  incomeFrequency: 'monthly',
  region: 'england',
  focus: 'growth',
};

const validPriorities = {
  goalAreas: ['clear-debt', 'emergency-fund'],
  topGoal: 'Pay off the credit card in full',
  savingsTarget: '1500',
  timeline: '6-12',
};

const validHabits = {
  budgetingStyle: 'guided',
  checkInFrequency: 'monthly',
  emergencyFundMonths: '3-6',
  confidenceLevel: 'steady',
  additionalNotes: 'Focus on meal planning to lower food costs.',
};

const validSummary = {
  shareEmail: 'user@example.com',
  consentToContact: true,
};

describe('validateMoneyBlueprintStep', () => {
  test('returns success for valid basics data', () => {
    const result = validateMoneyBlueprintStep('basics', validBasics);
    assert.equal(result.success, true);
    assert.deepEqual(result.errors, {});
  });

  test('collects validation errors for invalid numeric values', () => {
    const result = validateMoneyBlueprintStep('basics', {
      ...validBasics,
      netIncome: 'abc',
    });

    assert.equal(result.success, false);
    assert.equal(
      result.errors.netIncome,
      'Use numbers only, you can include up to 2 decimal places.'
    );
    assert.ok(Array.isArray(result.issues));
    assert.ok(result.issues.length > 0);
  });

  test('requires an email when consent is granted', () => {
    const result = validateMoneyBlueprintStep('summary', {
      shareEmail: '',
      consentToContact: true,
    });

    assert.equal(result.success, false);
    assert.equal(result.errors.shareEmail, 'Add your email so we can send the reminder.');
  });

  test('treats unknown steps as already valid', () => {
    const result = validateMoneyBlueprintStep('unknown-step', { foo: 'bar' });

    assert.equal(result.success, true);
    assert.deepEqual(result.errors, {});
    assert.deepEqual(result.issues, []);
  });
});

describe('validateMoneyBlueprint', () => {
  test('accepts a complete and valid submission', () => {
    const result = validateMoneyBlueprint({
      basics: validBasics,
      priorities: validPriorities,
      habits: validHabits,
      summary: validSummary,
    });

    assert.equal(result.success, true);
    assert.deepEqual(result.data.basics, validBasics);
    assert.deepEqual(result.data.summary, validSummary);
  });
});
