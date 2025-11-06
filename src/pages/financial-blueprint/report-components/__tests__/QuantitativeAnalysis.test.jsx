import React from 'react';
import { render, screen } from '@testing-library/react';
import QuantitativeAnalysis from '../QuantitativeAnalysis';

describe('QuantitativeAnalysis', () => {
  const sampleData = {
    income: {
      grossAnnual: 80000,
      netAnnual: 20000,
      grossMonthly: 6666.67,
      netMonthly: 1666.67,
    },
    cashflow: {
      monthlySurplus: 500,
      annualExpenses: 60000,
      monthlyExpenses: 5000,
      savingsRate: 0.25,
      emergencyFundCoverageMonths: 4.5,
    },
    debt: {
      totalLiabilities: 250000,
      debtToIncomeRatio: 0.5,
    },
    taxes: {
      region: 'england',
      incomeTaxBand: 'Basic rate (20%)',
      nationalInsuranceBand: 'Main rate band (10%)',
      personalAllowance: 12570,
      taxableIncomeAfterAllowance: 67430,
    },
    retirement: {
      projectedPensionPot: 400000,
      sustainableAnnualDrawdown: 16000,
      retirementShortfallAnnual: 44000,
      retirementShortfallMonthly: 3666.67,
    },
  };

  it('renders core metrics when data is provided', () => {
    render(<QuantitativeAnalysis data={sampleData} />);

    expect(screen.getByText('Gross Income (Annual)')).toBeInTheDocument();
    expect(screen.getByText('£80,000')).toBeInTheDocument();
    expect(screen.getByText('Net Income (Monthly)')).toBeInTheDocument();
    expect(screen.getByText('£1,667')).toBeInTheDocument();
    expect(screen.getByText('Savings Rate')).toBeInTheDocument();
    expect(screen.getByText('25.0%')).toBeInTheDocument();
    expect(screen.getByText('Tax band summary')).toBeInTheDocument();
    expect(screen.getByText('Projected retirement shortfall')).toBeInTheDocument();
  });

  it('handles missing data gracefully', () => {
    render(<QuantitativeAnalysis data={{}} />);

    expect(screen.getAllByText('Not provided').length).toBeGreaterThan(0);
  });

  it('renders fallback content when no data is supplied', () => {
    render(<QuantitativeAnalysis data={null} />);

    expect(
      screen.getByText('Quantitative insights will appear here once we have calculated your figures.'),
    ).toBeInTheDocument();
  });
});
