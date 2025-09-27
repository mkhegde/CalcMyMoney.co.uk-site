import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  PoundSterling,
  Percent,
  Calculator,
  Home,
  Wrench,
  Repeat,
  Banknote,
  TrendingUp,
  AlertCircle,
  Info,
} from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const brrrCalculatorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Property Investment Calculator - BRRRR & Flip Strategy 2025/26',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  description:
    'Free UK property investment calculator for BRRRR and flip strategies. Calculate rental yields, refinance returns, and property flip profits with accurate UK rates for 2025/26.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
  featureList: [
    'Property flip profit calculation',
    'BRRRR strategy analysis',
    'Rental yield calculation',
    '70% rule checking',
    'Cash-on-cash return analysis',
    'Capital efficiency tracking',
  ],
};

export default function BRRRRCalculator() {
  // Core Flip Inputs
  const [purchasePrice, setPurchasePrice] = useState('');
  const [closingCosts, setClosingCosts] = useState('');
  const [rehabCosts, setRehabCosts] = useState('');
  const [arv, setArv] = useState('');
  const [sellingCosts, setSellingCosts] = useState('');

  // Optional Rental/BRRRR inputs
  const [includeRental, setIncludeRental] = useState(false);
  const [monthlyRent, setMonthlyRent] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [refinanceLTV, setRefinanceLTV] = useState('75');
  const [refinanceRate, setRefinanceRate] = useState('');
  const [refinanceTerm, setRefinanceTerm] = useState('25');
  const [refinanceClosingCosts, setRefinanceClosingCosts] = useState('');

  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const pPrice = Number(purchasePrice) || 0;
    const cCosts = Number(closingCosts) || 0;
    const rCosts = Number(rehabCosts) || 0;
    const afterRepairValue = Number(arv) || 0;
    const sCosts = Number(sellingCosts) || 0;

    if (pPrice <= 0 || afterRepairValue <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // Core Flip Calculations
    const totalProjectCost = pPrice + cCosts + rCosts;
    const netSaleProceeds = afterRepairValue - sCosts;
    const flipProfit = netSaleProceeds - totalProjectCost;
    const flipROI = totalProjectCost > 0 ? (flipProfit / totalProjectCost) * 100 : 0;

    // 70% Rule Check
    const seventyPercentRuleMaxPrice = afterRepairValue * 0.7 - rCosts;

    let brrrResults = null;

    // Optional BRRRR Calculations
    if (includeRental) {
      const mRent = Number(monthlyRent) || 0;
      const mExpenses = Number(monthlyExpenses) || 0;
      const refiLTV = Number(refinanceLTV) / 100 || 0;
      const refiRate = Number(refinanceRate) / 100 || 0;
      const refiTerm = Number(refinanceTerm) || 0;
      const refiClosingCosts = Number(refinanceClosingCosts) || 0;

      // Refinance calculations
      const newLoanAmount = afterRepairValue * refiLTV;
      const cashOut = newLoanAmount - totalProjectCost - refiClosingCosts;
      const moneyLeftInDeal = Math.max(0, totalProjectCost - newLoanAmount + refiClosingCosts);

      // New mortgage payment (post-refinance)
      const monthlyRefiRate = refiRate / 12;
      const numPayments = refiTerm * 12;
      let newMonthlyMortgage = 0;
      if (monthlyRefiRate > 0 && numPayments > 0) {
        newMonthlyMortgage =
          (newLoanAmount * (monthlyRefiRate * Math.pow(1 + monthlyRefiRate, numPayments))) /
          (Math.pow(1 + monthlyRefiRate, numPayments) - 1);
      } else if (newLoanAmount > 0 && numPayments > 0) {
        // Handle 0 interest rate
        newMonthlyMortgage = newLoanAmount / numPayments;
      }

      // Cash Flow
      const monthlyCashFlow = mRent - mExpenses - newMonthlyMortgage;
      const annualCashFlow = monthlyCashFlow * 12;

      // ROI - Fix the infinite case
      let cashOnCashROI;
      if (moneyLeftInDeal <= 0) {
        cashOnCashROI = 'All Capital Returned';
      } else {
        cashOnCashROI = (annualCashFlow / moneyLeftInDeal) * 100;
      }

      brrrResults = {
        newLoanAmount,
        cashOut,
        moneyLeftInDeal,
        newMonthlyMortgage,
        monthlyCashFlow,
        annualCashFlow,
        cashOnCashROI,
      };
    }

    const newResults = {
      // Flip results
      totalProjectCost,
      netSaleProceeds,
      flipProfit,
      flipROI,
      seventyPercentRuleMaxPrice,
      isDealGoodBy70Rule: pPrice <= seventyPercentRuleMaxPrice,
      // BRRRR results (if applicable)
      brrrrResults: brrrResults,
    };

    setResults(newResults);
    setHasCalculated(true);

    // CSV data
    const csvExportData = [
      ['FLIP ANALYSIS', ''],
      ['Metric', 'Value'],
      ['Property Purchase Price', `£${pPrice.toFixed(2)}`],
      ['Purchase Closing Costs', `£${cCosts.toFixed(2)}`],
      ['Rehab/Repair Costs', `£${rCosts.toFixed(2)}`],
      ['Total Project Cost', `£${newResults.totalProjectCost.toFixed(2)}`],
      ['Property After Repair Value (ARV)', `£${afterRepairValue.toFixed(2)}`],
      ['Selling Costs', `£${sCosts.toFixed(2)}`],
      ['Net Sale Proceeds', `£${newResults.netSaleProceeds.toFixed(2)}`],
      ['Flip Profit', `£${newResults.flipProfit.toFixed(2)}`],
      ['Flip ROI', `${newResults.flipROI.toFixed(2)}%`],
      ['70% Rule Max Price', `£${newResults.seventyPercentRuleMaxPrice.toFixed(2)}`],
    ];

    if (includeRental && brrrResults) {
      csvExportData.push(
        ['', ''],
        ['BRRRR ANALYSIS', ''],
        ['Refinance Loan Amount', `£${brrrResults.newLoanAmount.toFixed(2)}`],
        ['Cash Back to You', `£${brrrResults.cashOut.toFixed(2)}`],
        ['Money Left in Deal', `£${brrrResults.moneyLeftInDeal.toFixed(2)}`],
        ['Monthly Cash Flow', `£${brrrResults.monthlyCashFlow.toFixed(2)}`],
        ['Annual Cash Flow', `£${brrrResults.annualCashFlow.toFixed(2)}`],
        [
          'Cash-on-Cash ROI',
          typeof brrrResults.cashOnCashROI === 'string'
            ? brrrResults.cashOnCashROI
            : `${brrrResults.cashOnCashROI.toFixed(2)}%`,
        ]
      );
    }

    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [
    purchasePrice,
    closingCosts,
    rehabCosts,
    arv,
    sellingCosts,
    includeRental,
    monthlyRent,
    monthlyExpenses,
    refinanceLTV,
    refinanceRate,
    refinanceTerm,
    refinanceClosingCosts,
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brrrCalculatorJsonLd) }}
      />

      <TooltipProvider>
        <div className="bg-white dark:bg-gray-900">
          <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  UK Property Investment Calculator
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Analyse your property deal: Calculate flip profits or full BRRRR strategy returns.
                  Perfect for UK property investors and developers.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="print-title hidden">Property Investment Analysis Results</div>

            <div className="grid lg:grid-cols-3 gap-8 printable-grid-cols-1">
              <div className="lg:col-span-1 space-y-6 non-printable">
                {/* Core Property Deal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" /> Property Deal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <InputGroup
                      label="Property Purchase Price"
                      value={purchasePrice}
                      onChange={setPurchasePrice}
                      placeholder="e.g. 150000"
                    />
                    <InputGroup
                      label="Purchase Closing Costs"
                      value={closingCosts}
                      onChange={setClosingCosts}
                      placeholder="e.g. 5000"
                    />
                    <InputGroup
                      label="Rehab / Repair Costs"
                      value={rehabCosts}
                      onChange={setRehabCosts}
                      placeholder="e.g. 20000"
                    />
                    <InputGroup
                      label="Property After Repair Value (ARV)"
                      value={arv}
                      onChange={setArv}
                      placeholder="e.g. 250000"
                    />
                    <InputGroup
                      label="Selling Costs"
                      value={sellingCosts}
                      onChange={setSellingCosts}
                      placeholder="e.g. 7500"
                      tooltip="Estate agent fees, solicitor costs, etc."
                    />
                  </CardContent>
                </Card>

                {/* Optional Rental Strategy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Repeat className="w-5 h-5" />
                      Also Analyse as Buy-to-Let?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-rental"
                        checked={includeRental}
                        onCheckedChange={setIncludeRental}
                      />
                      <Label htmlFor="include-rental">Include rental & refinance analysis</Label>
                    </div>

                    {includeRental && (
                      <>
                        <div className="pt-4 space-y-4">
                          <InputGroup
                            label="Monthly Rental Income"
                            value={monthlyRent}
                            onChange={setMonthlyRent}
                            placeholder="e.g. 1200"
                          />
                          <InputGroup
                            label="Monthly Property Expenses"
                            value={monthlyExpenses}
                            onChange={setMonthlyExpenses}
                            placeholder="e.g. 250"
                            tooltip="Excluding mortgage. Include insurance, maintenance, management fees, etc."
                          />

                          <div className="pt-2">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              Refinance Details
                            </h4>
                            <div className="space-y-4">
                              <InputGroup
                                label="Refinance LTV"
                                value={refinanceLTV}
                                onChange={setRefinanceLTV}
                                placeholder="e.g. 75"
                                isPercent
                              />
                              <InputGroup
                                label="New Interest Rate"
                                value={refinanceRate}
                                onChange={setRefinanceRate}
                                placeholder="e.g. 5.5"
                                isPercent
                              />
                              <InputGroup
                                label="New Mortgage Term (Years)"
                                value={refinanceTerm}
                                onChange={setRefinanceTerm}
                                placeholder="e.g. 25"
                              />
                              <InputGroup
                                label="Refinance Closing Costs"
                                value={refinanceClosingCosts}
                                onChange={setRefinanceClosingCosts}
                                placeholder="e.g. 3000"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Analyse Deal
                </Button>
              </div>

              <div className="lg:col-span-2 space-y-6 printable-area">
                {hasCalculated && results ? (
                  <>
                    <div className="flex justify-between items-center non-printable">
                      <h2 className="text-2xl font-bold text-gray-800">Property Deal Analysis</h2>
                      <ExportActions
                        csvData={csvData}
                        fileName="property-deal-analysis"
                        title="Property Deal Analysis"
                      />
                    </div>

                    {/* Flip Analysis - Primary Results */}
                    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" /> Flip Strategy Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <DetailRow
                              label="Total Project Cost"
                              value={results.totalProjectCost}
                              isCurrency
                            />
                            <DetailRow
                              label="Net Sale Proceeds"
                              value={results.netSaleProceeds}
                              isCurrency
                            />
                            <div className="border-t pt-2 mt-2">
                              <DetailRow
                                label="Flip Profit"
                                value={results.flipProfit}
                                isCurrency
                                isBold
                                isFinal
                              />
                            </div>
                          </div>
                          <div className="text-center p-6 bg-white rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                              Return on Investment
                            </p>
                            <p
                              className={`text-4xl font-bold mt-2 ${results.flipROI >= 0 ? 'text-green-700' : 'text-red-700'}`}
                            >
                              {results.flipROI.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Based on total project cost
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 70% Rule Analysis */}
                    <Card className={results.isDealGoodBy70Rule ? 'bg-green-50' : 'bg-amber-50'}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5" /> The 70% Rule Check
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">
                          A common rule of thumb for investors is to pay no more than 70% of the ARV
                          minus repair costs. This helps ensure profitability.
                        </p>
                        <div className="space-y-2">
                          <DetailRow
                            label="Max Offer Price by 70% Rule"
                            value={results.seventyPercentRuleMaxPrice}
                            isCurrency
                            isBold
                          />
                          <DetailRow
                            label="Your Purchase Price"
                            value={Number(purchasePrice)}
                            isCurrency
                            isBold
                          />
                          <div
                            className={`p-3 rounded-lg mt-4 ${results.isDealGoodBy70Rule ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                          >
                            <strong>Verdict:</strong>{' '}
                            {results.isDealGoodBy70Rule
                              ? 'This deal meets the 70% rule. Good sign!'
                              : 'This deal does not meet the 70% rule. Proceed with caution.'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* BRRRR Analysis - Only if rental option is enabled */}
                    {includeRental && results.brrrrResults && (
                      <>
                        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Repeat className="w-5 h-5" /> BRRRR Strategy Results
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                              <MetricCard
                                title="Cash Back to You"
                                value={Math.max(0, results.brrrrResults.cashOut)}
                                isCurrency
                                color="green"
                              />
                              <MetricCard
                                title="Money Left in Deal"
                                value={results.brrrrResults.moneyLeftInDeal}
                                isCurrency
                                color="purple"
                              />
                              <MetricCard
                                title="Monthly Cash Flow"
                                value={results.brrrrResults.monthlyCashFlow}
                                isCurrency
                                color="blue"
                              />
                            </div>

                            <div className="text-center p-6 bg-white rounded-lg">
                              <p className="text-lg font-medium text-gray-600">Cash-on-Cash ROI</p>
                              <p className="text-4xl font-bold text-purple-700 mt-2">
                                {typeof results.brrrrResults.cashOnCashROI === 'string'
                                  ? results.brrrrResults.cashOnCashROI
                                  : `${results.brrrrResults.cashOnCashROI.toFixed(1)}%`}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {typeof results.brrrrResults.cashOnCashROI === 'string'
                                  ? 'All your initial capital returned - any positive cash flow is pure profit!'
                                  : 'Based on annual cash flow vs money left in the deal'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Capital Investment Analysis */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Capital Investment Analysis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-3">
                                  Initial Capital Required
                                </h4>
                                <div className="space-y-2">
                                  <DetailRow
                                    label="Property Purchase Price"
                                    value={Number(purchasePrice)}
                                    isCurrency
                                  />
                                  <DetailRow
                                    label="Purchase Closing Costs"
                                    value={Number(closingCosts)}
                                    isCurrency
                                  />
                                  <DetailRow
                                    label="Rehab/Repair Costs"
                                    value={Number(rehabCosts)}
                                    isCurrency
                                  />
                                  <DetailRow
                                    label="Refinance Closing Costs"
                                    value={Number(refinanceClosingCosts)}
                                    isCurrency
                                  />
                                  <div className="border-t pt-2 mt-2">
                                    <DetailRow
                                      label="Total Initial Investment"
                                      value={
                                        results.totalProjectCost + Number(refinanceClosingCosts)
                                      }
                                      isCurrency
                                      isBold
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-gray-700 mb-3">
                                  Capital Recovery Through Refinance
                                </h4>
                                <div className="space-y-2">
                                  <DetailRow
                                    label="Property After Repair Value (ARV)"
                                    value={Number(arv)}
                                    isCurrency
                                  />
                                  <DetailRow
                                    label={`Refinance LTV (${refinanceLTV}%)`}
                                    value={results.brrrrResults.newLoanAmount}
                                    isCurrency
                                  />
                                  <DetailRow
                                    label="Less: Remaining Project Cost"
                                    value={-results.totalProjectCost}
                                    isCurrency
                                    isNegative
                                  />
                                  <DetailRow
                                    label="Less: Refinance Closing Costs"
                                    value={-Number(refinanceClosingCosts)}
                                    isCurrency
                                    isNegative
                                  />
                                  <div className="border-t pt-2 mt-2">
                                    <DetailRow
                                      label={
                                        results.brrrrResults.cashOut >= 0
                                          ? 'Cash Returned to You'
                                          : 'Additional Cash Needed'
                                      }
                                      value={Math.abs(results.brrrrResults.cashOut)}
                                      isCurrency
                                      isBold
                                      isFinal
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-purple-800 mb-2">
                                  Capital Efficiency Summary
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-purple-600">Money Left in Deal:</p>
                                    <p className="font-bold text-purple-800">
                                      £
                                      {results.brrrrResults.moneyLeftInDeal.toLocaleString(
                                        'en-GB',
                                        { maximumFractionDigits: 0 }
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-purple-600">Capital Efficiency:</p>
                                    <p className="font-bold text-purple-800">
                                      {results.totalProjectCost > 0
                                        ? `${(((results.totalProjectCost - results.brrrrResults.moneyLeftInDeal) / results.totalProjectCost) * 100).toFixed(1)}%`
                                        : '0%'}
                                    </p>
                                    <p className="text-xs text-purple-600">Capital recovered</p>
                                  </div>
                                </div>
                              </div>

                              {results.brrrrResults.cashOut > 0 && (
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <p className="text-sm text-green-800">
                                    🎉 <strong>Excellent!</strong> You'll receive £
                                    {results.brrrrResults.cashOut.toLocaleString('en-GB', {
                                      maximumFractionDigits: 0,
                                    })}{' '}
                                    back, which you can use for your next BRRRR deal while still
                                    owning this cash-flowing property!
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Strategy Comparison */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Strategy Comparison</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">Flip Strategy</h4>
                                <p className="text-2xl font-bold text-blue-900">
                                  £
                                  {results.flipProfit.toLocaleString('en-GB', {
                                    maximumFractionDigits: 0,
                                  })}
                                </p>
                                <p className="text-sm text-blue-700">
                                  One-time profit ({results.flipROI.toFixed(1)}% ROI)
                                </p>
                              </div>
                              <div className="p-4 bg-purple-50 rounded-lg">
                                <h4 className="font-semibold text-purple-800 mb-2">
                                  BRRRR Strategy
                                </h4>
                                <p className="text-2xl font-bold text-purple-900">
                                  £
                                  {results.brrrrResults.annualCashFlow.toLocaleString('en-GB', {
                                    maximumFractionDigits: 0,
                                  })}
                                  /year
                                </p>
                                <p className="text-sm text-purple-700">
                                  Recurring income +
                                  {typeof results.brrrrResults.cashOnCashROI === 'string'
                                    ? ' all capital back'
                                    : ` ${results.brrrrResults.cashOnCashROI.toFixed(1)}% annual ROI`}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </>
                ) : (
                  <Card className="lg:col-span-2 flex items-center justify-center h-[400px]">
                    <div className="text-center text-gray-500">
                      <Repeat className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold">Analyse your property deal</h3>
                      <p>Enter your deal numbers to see flip profits and optional BRRRR returns.</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <FAQSection
                faqs={propertyInvestmentFAQs}
                title="Property Investment - Frequently Asked Questions"
              />
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}

const InputGroup = ({ label, value, onChange, placeholder, isPercent = false, tooltip }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-1">
      <Label htmlFor={label}>{label}</Label>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3 h-3 text-gray-500 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <div className="relative">
      {!isPercent && (
        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      )}
      <Input
        id={label}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={isPercent ? 'pr-10' : 'pl-10'}
        placeholder={placeholder}
      />
      {isPercent && (
        <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      )}
    </div>
  </div>
);

const MetricCard = ({ title, value, isCurrency = false, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-900',
    green: 'bg-green-50 text-green-900',
    purple: 'bg-purple-50 text-purple-900',
  };
  return (
    <Card className={colors[color]}>
      <CardContent className="p-6">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">
          {isCurrency
            ? value.toLocaleString('en-GB', {
                style: 'currency',
                currency: 'GBP',
                maximumFractionDigits: 0,
              })
            : value}
        </p>
      </CardContent>
    </Card>
  );
};

const DetailRow = ({
  label,
  value,
  isCurrency = false,
  isBold = false,
  isFinal = false,
  isNegative = false,
}) => {
  const finalValue = isCurrency
    ? value.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0,
      })
    : value;
  const valueColor = isFinal
    ? value >= 0
      ? 'text-green-700'
      : 'text-red-700'
    : isNegative
      ? 'text-red-600'
      : 'text-gray-900';
  return (
    <div className="flex justify-between items-center">
      <span className={isBold ? 'font-semibold' : ''}>{label}:</span>
      <span className={`${isBold ? 'font-bold' : 'font-semibold'} ${valueColor}`}>
        {finalValue}
      </span>
    </div>
  );
};

const FAQSection = ({ faqs, title }) => (
  <div className="py-8">
    <h2 className="text-2xl md::text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
      {title}
    </h2>
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={`faq-${index}`} value={`item-${index}`}>
          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

const propertyInvestmentFAQs = [
  {
    question: "What's the difference between a flip and BRRRR strategy?",
    answer:
      'A flip involves buying a property, renovating it, and selling it quickly for a profit. BRRRR (Buy, Rehab, Rent, Refinance, Repeat) involves buying and renovating a property, but then renting it out, refinancing to recover your capital, and using that capital for the next deal. Flipping gives immediate profit but no ongoing income, while BRRRR builds a portfolio of income-producing assets.',
  },
  {
    question: 'What is the 70% Rule in property investment?',
    answer:
      "The 70% Rule is a quick screening tool used by property investors. It states that you should pay no more than 70% of the After Repair Value (ARV) minus repair costs. For example, if a property will be worth £200,000 after repairs and needs £20,000 in repairs, you shouldn't pay more than £120,000 (70% of £200,000 = £140,000 - £20,000 repairs = £120,000).",
  },
  {
    question: 'How do I calculate After Repair Value (ARV)?',
    answer:
      'ARV is the estimated market value of a property after renovations are complete. Calculate it by researching comparable sales (comps) of similar properties in the same area that have been recently sold. Look at properties with similar size, condition, and features. You can also get a professional appraisal or BPO (Broker Price Opinion).',
  },
  {
    question: 'What should I budget for selling costs when flipping?',
    answer:
      'Typical selling costs include estate agent fees (1-3% of sale price), solicitor fees (£500-£1,500), Energy Performance Certificate (£100-£300), and potential capital gains tax. Budget around 3-5% of the sale price for total selling costs.',
  },
  {
    question: 'What Loan-to-Value (LTV) can I expect for a refinance?',
    answer:
      'Most UK buy-to-let mortgage lenders offer 75-80% LTV for refinancing, though some specialist lenders may go up to 85%. The exact LTV depends on the property type, location, rental income coverage, and your financial profile. Higher LTV ratios typically come with higher interest rates.',
  },
  {
    question: 'How much should I budget for rehab costs?',
    answer:
      "Rehab costs vary widely depending on the property's condition and your renovation scope. Get quotes from contractors for major work, add 10-20% contingency for unexpected issues, and budget for: structural repairs, plumbing/electrical updates, kitchen and bathroom renovations, flooring, painting, and any necessary safety/compliance work.",
  },
  {
    question: 'What expenses should I include in monthly property expenses for BRRRR?',
    answer:
      'Include all operating expenses except the mortgage payment: property insurance, property management fees (typically 8-12% of rent), regular maintenance and repairs, vacancy allowance (typically 5-10% of rent), and any service charges or ground rent for leasehold properties.',
  },
  {
    question: 'Which strategy is better - flipping or BRRRR?',
    answer:
      'It depends on your goals and situation. Flipping provides immediate cash profits but requires finding new deals constantly and pays income tax on profits. BRRRR builds long-term wealth through cash flow and appreciation, offers better tax advantages, but ties up capital longer and requires active property management. Many investors use both strategies depending on the specific deal and market conditions.',
  },
  {
    question: 'Are there tax implications with property investment strategies?',
    answer:
      'Yes, significant tax considerations apply. Flipping profits are typically subject to income tax (or corporation tax if through a company). BRRRR involves rental income tax, but with many allowable expenses. Stamp duty applies on purchase, and capital gains tax may apply when selling. Consider professional tax advice as the optimal structure depends on your circumstances and investment scale.',
  },
];
