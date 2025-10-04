import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building, Calculator, PiggyBank, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';

import Heading from '@/components/common/Heading';
const rentalYieldCalculatorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialProduct',
  name: 'UK Rental Yield Calculator',
  description:
    'Free UK rental yield calculator to measure gross and net yield, cash flow and cash-on-cash return for buy-to-let properties.',
  applicationCategory: 'RealEstateApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
  url: 'https://www.calcMyMoney.co.uk/rental-yield-calculator',
  keywords: [
    'rental yield calculator',
    'buy-to-let yield',
    'property investment calculator',
    'cash on cash return',
  ],
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);

const formatPercent = (value) => `${value.toFixed(2)}%`;

export default function RentalYieldCalculator() {
  const [propertyValue, setPropertyValue] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [monthlyMortgage, setMonthlyMortgage] = useState('');
  const [monthlyMaintenance, setMonthlyMaintenance] = useState('');
  const [otherMonthlyCosts, setOtherMonthlyCosts] = useState('');
  const [annualInsurance, setAnnualInsurance] = useState('');
  const [annualGroundRent, setAnnualGroundRent] = useState('');
  const [managementFeePercent, setManagementFeePercent] = useState('10');
  const [voidMonths, setVoidMonths] = useState('1');
  const [cashInvested, setCashInvested] = useState('');

  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const value = Number(propertyValue) || 0;
    const rent = Number(monthlyRent) || 0;
    const mortgage = Number(monthlyMortgage) || 0;
    const maintenance = Number(monthlyMaintenance) || 0;
    const otherCosts = Number(otherMonthlyCosts) || 0;
    const insurance = Number(annualInsurance) || 0;
    const groundRent = Number(annualGroundRent) || 0;
    const managementRate = Number(managementFeePercent) || 0;
    const voids = Math.min(Math.max(Number(voidMonths) || 0, 0), 12);
    const investedCash = Number(cashInvested) || 0;

    if (value <= 0 || rent <= 0) {
      setResults(null);
      setHasCalculated(true);
      setCsvData(null);
      return;
    }

    const annualRent = rent * 12;
    const effectiveMonths = 12 - voids;
    const rentAfterVoids = rent * effectiveMonths;
    const managementFees = rentAfterVoids * (managementRate / 100);
    const annualMortgage = mortgage * 12;
    const annualMaintenance = maintenance * 12;
    const annualOtherCosts = otherCosts * 12;

    const totalAnnualCosts =
      annualMortgage + annualMaintenance + annualOtherCosts + insurance + groundRent + managementFees;

    const netAnnualIncome = rentAfterVoids - totalAnnualCosts;
    const grossYield = (annualRent / value) * 100;
    const netYield = (netAnnualIncome / value) * 100;
    const cashOnCashReturn = investedCash > 0 ? (netAnnualIncome / investedCash) * 100 : 0;
    const occupancyRate = (effectiveMonths / 12) * 100;
    const breakEvenMonthlyRent = effectiveMonths > 0 ? totalAnnualCosts / effectiveMonths : 0;
    const paybackPeriodYears = netAnnualIncome > 0 && investedCash > 0 ? investedCash / netAnnualIncome : null;

    const newResults = {
      value,
      annualRent,
      rentAfterVoids,
      totalAnnualCosts,
      netAnnualIncome,
      monthlyNetIncome: netAnnualIncome / 12,
      grossYield,
      netYield,
      occupancyRate,
      cashOnCashReturn,
      breakEvenMonthlyRent,
      managementFees,
      voids: effectiveMonths,
      paybackPeriodYears,
      investedCash,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExport = [
      ['Metric', 'Value'],
      ['Property Value', formatCurrency(value)],
      ['Monthly Rent (before voids)', formatCurrency(rent)],
      ['Annual Rent (before voids)', formatCurrency(annualRent)],
      ['Void Months Per Year', `${voids}`],
      ['Effective Occupied Months', `${effectiveMonths}`],
      ['Rent Received After Voids', formatCurrency(rentAfterVoids)],
      ['Total Annual Costs', formatCurrency(totalAnnualCosts)],
      ['Net Annual Income', formatCurrency(netAnnualIncome)],
      ['Monthly Net Income', formatCurrency(netAnnualIncome / 12)],
      ['Gross Yield', formatPercent(grossYield)],
      ['Net Yield', formatPercent(netYield)],
      ['Cash-on-Cash Return', investedCash > 0 ? formatPercent(cashOnCashReturn) : 'n/a'],
      ['Break-even Monthly Rent', formatCurrency(breakEvenMonthlyRent)],
      [
        'Payback Period (years)',
        paybackPeriodYears ? paybackPeriodYears.toFixed(1) : netAnnualIncome <= 0 ? 'Not reached' : 'n/a',
      ],
    ];

    setCsvData(csvExport);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, [
    propertyValue,
    monthlyRent,
    monthlyMortgage,
    monthlyMaintenance,
    otherMonthlyCosts,
    annualInsurance,
    annualGroundRent,
    managementFeePercent,
    voidMonths,
    cashInvested,
  ]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 mb-4">
              <Percent className="w-4 h-4 mr-1" /> Rental Investment Tool
            </span>
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">Rental Yield Calculator</Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Work out gross and net rental yields, monthly cash flow and the cash-on-cash return for your buy-to-let property.
              Enter your rent, costs and investment details to see whether the numbers stack up.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="propertyValue">Property Purchase Price</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    placeholder="e.g. 275000"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Monthly Rent</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    placeholder="e.g. 1350"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voidMonths">Expected Void Months Per Year</Label>
                  <Input
                    id="voidMonths"
                    type="number"
                    value={voidMonths}
                    onChange={(e) => setVoidMonths(e.target.value)}
                    placeholder="e.g. 1"
                    min="0"
                    max="12"
                    step="0.5"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annual Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyMortgage">Monthly Mortgage Payment</Label>
                    <Input
                      id="monthlyMortgage"
                      type="number"
                      value={monthlyMortgage}
                      onChange={(e) => setMonthlyMortgage(e.target.value)}
                      placeholder="e.g. 650"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyMaintenance">Monthly Maintenance Budget</Label>
                    <Input
                      id="monthlyMaintenance"
                      type="number"
                      value={monthlyMaintenance}
                      onChange={(e) => setMonthlyMaintenance(e.target.value)}
                      placeholder="e.g. 120"
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="otherMonthlyCosts">Other Monthly Costs</Label>
                    <Input
                      id="otherMonthlyCosts"
                      type="number"
                      value={otherMonthlyCosts}
                      onChange={(e) => setOtherMonthlyCosts(e.target.value)}
                      placeholder="e.g. 80"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualInsurance">Annual Insurance & Compliance</Label>
                    <Input
                      id="annualInsurance"
                      type="number"
                      value={annualInsurance}
                      onChange={(e) => setAnnualInsurance(e.target.value)}
                      placeholder="e.g. 450"
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annualGroundRent">Annual Ground Rent / Service Charges</Label>
                    <Input
                      id="annualGroundRent"
                      type="number"
                      value={annualGroundRent}
                      onChange={(e) => setAnnualGroundRent(e.target.value)}
                      placeholder="e.g. 320"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managementFeePercent">Management Fee (% of collected rent)</Label>
                    <Input
                      id="managementFeePercent"
                      type="number"
                      value={managementFeePercent}
                      onChange={(e) => setManagementFeePercent(e.target.value)}
                      placeholder="e.g. 12"
                      min="0"
                      max="100"
                      step="0.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Invested</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm text-gray-600">
                  Include your deposit, refurbishment costs and purchase fees to measure cash-on-cash return and the payback
                  period.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="cashInvested">Total Cash Invested</Label>
                  <Input
                    id="cashInvested"
                    type="number"
                    value={cashInvested}
                    onChange={(e) => setCashInvested(e.target.value)}
                    placeholder="e.g. 75000"
                    min="0"
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleCalculate} className="w-full text-lg">
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Rental Yield
            </Button>
          </div>

          <div className="space-y-6">
            {hasCalculated ? (
              results ? (
                <>
                  <div className="flex items-center justify-between non-printable">
                    <Heading as="h2" size="h2" weight="bold" className="text-gray-800">Investment Summary</Heading>
                    {csvData ? (
                      <ExportActions csvData={csvData} fileName="rental-yield-results" title="Rental Yield Summary" />
                    ) : null}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Yield & Profitability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                          <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                          <p className="text-sm text-gray-600">Gross Yield</p>
                          <p className="text-3xl font-bold text-green-700">{formatPercent(results.grossYield)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                          <TrendingDown className="w-6 h-6 text-blue-600 mb-2" />
                          <p className="text-sm text-gray-600">Net Yield</p>
                          <p className="text-3xl font-bold text-blue-700">{formatPercent(results.netYield)}</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                          <PiggyBank className="w-6 h-6 text-amber-600 mb-2" />
                          <p className="text-sm text-gray-600">Net Annual Income</p>
                          <p className="text-2xl font-semibold text-amber-700">
                            {formatCurrency(results.netAnnualIncome)}
                          </p>
                          <p className="text-sm text-amber-700 mt-1">
                            Monthly: {formatCurrency(results.monthlyNetIncome)}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                          <Building className="w-6 h-6 text-purple-600 mb-2" />
                          <p className="text-sm text-gray-600">Occupancy Rate</p>
                          <p className="text-2xl font-semibold text-purple-700">{formatPercent(results.occupancyRate)}</p>
                          <p className="text-sm text-purple-700 mt-1">
                            Break-even rent: {formatCurrency(results.breakEvenMonthlyRent)} / month
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Annual rent (before voids)</span>
                        <span className="font-semibold">{formatCurrency(results.annualRent)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Rent received after voids</span>
                        <span className="font-semibold">{formatCurrency(results.rentAfterVoids)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Management fees</span>
                        <span className="font-semibold">{formatCurrency(results.managementFees)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Total annual costs</span>
                        <span className="font-semibold">{formatCurrency(results.totalAnnualCosts)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Cash invested</span>
                        <span className="font-semibold">
                          {results.investedCash ? formatCurrency(results.investedCash) : 'Not provided'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Cash-on-cash return</span>
                        <span className="font-semibold">
                          {results.investedCash > 0 ? formatPercent(results.cashOnCashReturn) : 'Add cash invested to see'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Payback period</span>
                        <span className="font-semibold">
                          {results.paybackPeriodYears
                            ? `${results.paybackPeriodYears.toFixed(1)} years`
                            : results.investedCash > 0 && results.netAnnualIncome <= 0
                            ? 'Not reached'
                            : 'Add cash invested to see'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center text-gray-600">
                    Enter your property value and monthly rent to see the rental yield breakdown.
                  </CardContent>
                </Card>
              )
            ) : (
              <Card>
                <CardContent className="py-10 text-center text-gray-600">
                  Fill in the details and click calculate to evaluate your property investment.
                </CardContent>
              </Card>
            )}

            <Card className="non-printable">
              <CardHeader>
                <CardTitle>How to Use This Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-600">
                <p>
                  Gross yield helps compare properties quickly, while net yield and cash-on-cash return show the true earnings
                  after costs. Adjust the void months and management fee to reflect your local market.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Include maintenance and compliance costs to avoid overstating returns.</li>
                  <li>Management fee is applied only to rent actually collected after voids.</li>
                  <li>Enter your cash invested to reveal the payback period and cash-on-cash return.</li>
                </ul>
                <p className="text-sm text-gray-500">
                  Figures exclude income tax and mortgage interest relief caps. Always seek professional advice before making
                  investment decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <script type="application/ld+json">{JSON.stringify(rentalYieldCalculatorJsonLd)}</script>
    </div>
  );
}
