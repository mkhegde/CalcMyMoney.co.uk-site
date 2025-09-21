import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoundSterling, Calculator, TrendingUp, User } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";
import FAQSection from "../components/calculators/FAQSection";

const CGT_ANNUAL_EXEMPTION = 3000; // For 2024/25 tax year

const cgtFAQs = [
  {
    question: "What is Capital Gains Tax (CGT)?",
    answer: "Capital Gains Tax is a tax on the profit (or 'gain') you make when you sell or dispose of an asset that has increased in value. It's the gain you make that is taxed, not the total amount of money you receive."
  },
  {
    question: "What is the CGT annual exemption?",
    answer: `For the 2024/25 tax year, the annual exemption is £3,000. This means you can make gains up to this amount in a tax year without having to pay any Capital Gains Tax.`
  },
  {
    question: "How does my income tax band affect my CGT rate?",
    answer: "The rate of CGT you pay depends on your income tax band. Basic-rate taxpayers pay a lower rate of CGT than higher or additional-rate taxpayers. If your capital gain, when added to your income, pushes you into a higher tax band, part of the gain will be taxed at the higher rate."
  }
];

export default function CapitalGainsTaxCalculator() {
  const [sellingPrice, setSellingPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [costs, setCosts] = useState('');
  const [assetType, setAssetType] = useState('property');
  const [income, setIncome] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const salePrice = Number(sellingPrice) || 0;
    const buyPrice = Number(purchasePrice) || 0;
    const totalCosts = Number(costs) || 0;
    const annualIncome = Number(income) || 0;

    if (salePrice <= 0 || buyPrice <= 0 || annualIncome <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const totalGain = salePrice - buyPrice - totalCosts;
    if (totalGain <= 0) {
        setResults({ totalGain, taxableGain: 0, cgtPayable: 0, breakdown: [] });
        setHasCalculated(true);
        return;
    }

    const taxableGain = Math.max(0, totalGain - CGT_ANNUAL_EXEMPTION);
    
    const basicRateLimit = 50270;
    const unusedBasicRateBand = Math.max(0, basicRateLimit - annualIncome);
    
    let cgtPayable = 0;
    let breakdown = [];
    let gainRemaining = taxableGain;

    const rates = assetType === 'property' 
      ? { basic: 0.18, higher: 0.24 }
      : { basic: 0.10, higher: 0.20 };
      
    // Tax gain in basic rate band
    if (unusedBasicRateBand > 0 && gainRemaining > 0) {
        const gainInBasicBand = Math.min(gainRemaining, unusedBasicRateBand);
        const taxInBasic = gainInBasicBand * rates.basic;
        cgtPayable += taxInBasic;
        breakdown.push({ rate: rates.basic * 100, amount: gainInBasicBand, tax: taxInBasic });
        gainRemaining -= gainInBasicBand;
    }
    
    // Tax remaining gain in higher rate band
    if (gainRemaining > 0) {
        const taxInHigher = gainRemaining * rates.higher;
        cgtPayable += taxInHigher;
        breakdown.push({ rate: rates.higher * 100, amount: gainRemaining, tax: taxInHigher });
    }

    const newResults = {
      totalGain,
      taxableGain,
      cgtPayable,
      breakdown
    };
    
    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ["Metric", "Value"],
      ["Total Gain", `£${newResults.totalGain.toFixed(2)}`],
      ["Taxable Gain (after exemption)", `£${newResults.taxableGain.toFixed(2)}`],
      ["Total CGT Payable", `£${newResults.cgtPayable.toFixed(2)}`],
      ...newResults.breakdown.map(b => [`Taxed at ${b.rate}%`, `on £${b.amount.toFixed(2)}`])
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [sellingPrice, purchasePrice, costs, assetType, income]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Capital Gains Tax Calculator (UK)
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Estimate your Capital Gains Tax (CGT) bill when selling assets like property, shares, or cryptocurrency.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Capital Gains Tax Calculation</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Asset & Income Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Asset Type</Label>
                  <Select value={assetType} onValueChange={setAssetType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property">Residential Property</SelectItem>
                      <SelectItem value="other">Shares & Other Assets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="sellingPrice" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="pl-10" placeholder="e.g. 300000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="purchasePrice" type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="pl-10" placeholder="e.g. 200000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costs">Purchase & Selling Costs</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="costs" type="number" value={costs} onChange={(e) => setCosts(e.target.value)} className="pl-10" placeholder="e.g. 8000" />
                  </div>
                  <p className="text-xs text-gray-500">e.g., stamp duty, legal fees, broker fees.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">Your Taxable Annual Income</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="income" type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="pl-10" placeholder="e.g. 45000" />
                  </div>
                  <p className="text-xs text-gray-500">This determines your CGT rate.</p>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate CGT
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your CGT Estimate</h2>
                  <ExportActions csvData={csvData} fileName="cgt-estimate" title="Capital Gains Tax Estimate" />
                </div>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-red-800 mb-2">Estimated CGT Payable</h3>
                    <div className="text-4xl font-bold text-red-900">
                      £{results.cgtPayable.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Calculation Breakdown</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between p-3 bg-gray-50 rounded"><span>Total Gain:</span><span className="font-medium">£{results.totalGain.toLocaleString()}</span></div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded"><span>Annual Exemption (2024/25):</span><span className="font-medium text-green-600">-£{CGT_ANNUAL_EXEMPTION.toLocaleString()}</span></div>
                    <div className="flex justify-between p-3 bg-gray-100 rounded font-bold"><span>Taxable Gain:</span><span>£{results.taxableGain.toLocaleString()}</span></div>
                    <div className="space-y-2 pt-4 border-t">
                        <h4 className="font-medium">Tax on Gain:</h4>
                        {results.breakdown.length > 0 ? results.breakdown.map((b, i) => (
                           <div key={i} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                               <span>{`£${b.amount.toLocaleString()} @ ${b.rate}%`}</span>
                               <span className="font-semibold">£{b.tax.toLocaleString()}</span>
                           </div>
                        )) : (
                            <p className="text-gray-600 text-sm">No tax to pay on the gain.</p>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to calculate your CGT?</h3>
                  <p>Enter the details to estimate your potential tax bill.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={cgtFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}