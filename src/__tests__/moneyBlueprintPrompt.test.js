import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  buildMoneyBlueprintPrompt,
  MONEY_BLUEPRINT_DISCLAIMER,
} from '../lib/moneyBlueprint/prompt.js';

const baseWizardData = {
  basics: {
    planName: '  Growth focus  ',
    householdSize: '3',
    netIncome: '2,500.00',
    incomeFrequency: 'four-weekly',
    region: 'scotland',
    focus: 'stability',
  },
  priorities: {
    goalAreas: ['clear-debt', 'emergency-fund', ''],
    topGoal: '  Clear the credit card balance  ',
    savingsTarget: '1200',
    timeline: '3-6',
  },
  habits: {
    budgetingStyle: 'guided',
    checkInFrequency: 'ad-hoc',
    emergencyFundMonths: 'less-1',
    confidenceLevel: 'finding-feet',
    additionalNotes: '  Keep encouraging monthly reviews.  ',
  },
  summary: {
    shareEmail: '',
    consentToContact: false,
  },
};

const cloneWizardData = () => JSON.parse(JSON.stringify(baseWizardData));

describe('buildMoneyBlueprintPrompt', () => {
  test('builds a full prompt with sanitised data and fingerprint', () => {
    const prompt = buildMoneyBlueprintPrompt({
      wizardData: cloneWizardData(),
      reportId: 'ABCD1234',
    });

    assert.equal(prompt.reportId, 'ABCD1234');
    assert.equal(prompt.disclaimer, MONEY_BLUEPRINT_DISCLAIMER);
    assert.equal(prompt.messages.length, 2);
    assert.equal(prompt.messages[0].role, 'system');
    assert.ok(prompt.messages[0].content.includes('supportive and practical'));
    assert.ok(prompt.messages[1].content.includes('Report reference: ABCD1234'));

    assert.deepEqual(prompt.sanitisedData, {
      basics: {
        planName: 'Growth focus',
        householdSize: '3',
        netIncome: '2,500.00',
        incomeFrequency: 'four-weekly',
        region: 'scotland',
        focus: 'stability',
      },
      priorities: {
        goalAreas: ['clear-debt', 'emergency-fund'],
        topGoal: 'Clear the credit card balance',
        savingsTarget: '1200',
        timeline: '3-6',
      },
      habits: {
        budgetingStyle: 'guided',
        checkInFrequency: 'ad-hoc',
        emergencyFundMonths: 'less-1',
        confidenceLevel: 'finding-feet',
        additionalNotes: 'Keep encouraging monthly reviews.',
      },
      summary: {
        consentToContact: false,
        providedEmail: false,
      },
    });

    const riskIds = prompt.riskFlags.map((flag) => flag.id);
    assert.deepEqual(riskIds, [
      'emergency-fund-critical',
      'infrequent-reviews',
      'low-confidence',
    ]);

    assert.ok(
      prompt.summaryBullets.some((bullet) =>
        bullet.includes('Household of 3 people in Scotland focusing on build stability.')
      )
    );
    assert.ok(
      prompt.summaryBullets.some((bullet) =>
        bullet.includes('Combined take-home pay is about £2,500 each four weeks')
      )
    );

    const fingerprint = JSON.parse(prompt.fingerprint);
    assert.deepEqual(fingerprint, {
      reportId: 'ABCD1234',
      data: prompt.sanitisedData,
      summaryBullets: prompt.summaryBullets,
      riskFlags: prompt.riskFlags.map(({ id, severity }) => ({ id, severity })),
    });
  });

  test('applies custom tone and additional system instructions', () => {
    const prompt = buildMoneyBlueprintPrompt({
      wizardData: cloneWizardData(),
      tone: 'calm and clear',
      systemInstructions: ['Include scenario planning ideas.'],
    });

    assert.ok(prompt.messages[0].content.includes('calm and clear'));
    assert.ok(prompt.messages[0].content.includes('Include scenario planning ideas.'));
  });
});
