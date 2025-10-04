import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseBankRateCsv,
  parseOnsResponse,
  parseHousePriceResponse,
  parseOfgemResponse,
} from '../uk-financial-stats.js';

describe('uk-financial-stats normalisers', () => {
  it('parses Bank of England CSV payload', () => {
    const csv = `Series Name: Bank Rate\nDate,Value\n2024-07-01,5.00\n2024-08-01,5.25`;
    const parsed = parseBankRateCsv(csv);
    assert.equal(parsed.value, 5.25);
    assert.equal(parsed.period.start, '2024-08-01');
    assert.equal(parsed.change.value, 0.25);
    assert.equal(parsed.change.direction, 'up');
  });

  it('parses ONS CPIH response and compares with previous year', () => {
    const json = {
      observations: {
        '0:0': { observation: '3.8', metadata: { time: '2024 MAY' } },
        '0:1': { observation: '7.9', metadata: { time: '2023 MAY' } },
      },
    };
    const parsed = parseOnsResponse(json);
    assert.equal(parsed.value, 3.8);
    assert.equal(parsed.period.label, 'May 2024');
    assert.equal(parsed.change.value, -4.1);
    assert.equal(parsed.change.direction, 'down');
  });

  it('parses UK HPI payload', () => {
    const payload = {
      data: [
        { date: '2024-07', averagePrice: 280000, percentageAnnualChange: 1.2 },
        { date: '2024-08', averagePrice: 281000, percentageAnnualChange: -0.3 },
      ],
    };
    const parsed = parseHousePriceResponse(payload);
    assert.equal(parsed.value, 281000);
    assert.equal(parsed.period.label, 'August 2024');
    assert.equal(parsed.change.value, -0.3);
    assert.equal(parsed.change.direction, 'down');
  });

  it('parses Ofgem price cap payload', () => {
    const payload = [
      { capLevel: 1600, effectiveFrom: '2024-04-01', effectiveTo: '2024-06-30' },
      { capLevel: 1568, effectiveFrom: '2024-07-01', effectiveTo: '2024-09-30' },
    ];
    const parsed = parseOfgemResponse(payload);
    assert.equal(parsed.value, 1568);
    assert.equal(parsed.period.start, '2024-07-01');
    assert.equal(parsed.period.end, '2024-09-30');
  });
});
