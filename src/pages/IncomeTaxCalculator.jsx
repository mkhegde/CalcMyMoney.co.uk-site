
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PoundSterling, Calculator, HelpCircle } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";
import FAQSection from "../components/calculators/FAQSection";
import CalculatorWrapper from "../components/calculators/CalculatorWrapper";
import RelatedCalculators from "../components/calculators/RelatedCalculators";
import Breadcrumbs from "../components/general/Breadcrumbs"; // Added import for Breadcrumbs
import { createPageUrl } from '@/utils';

// Site-wide SEO (JSON-LD) definition for the page
const incomeTaxJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "UK Income Tax Calculator 2025/26",
    "description": "Calculate your UK Income Tax for the 2025/26 financial year. Understand how your income is taxed across different bands including Personal Allowance, Basic, Higher, and Additional Rates.",
    "url": "https://www.yourdomain.com/income-tax-calculator", // Replace with actual URL
    "mainEntity": {
        "@type": "Calculator",
        "name": "UK Income Tax Calculator",
        "description": "Calculates UK Income Tax for the 2025/26 tax year based on gross annual income.",
        "applicationCategory": "Financial",
        "accessMode": ["visual", "textual"],
        "accessModeSufficient": ["visual"],
        "operatingSystem": "Any",
        "softwareRequirements": "Web browser",
        "url": "https://www.yourdomain.com/income-tax-calculator", // Replace with actual URL
        "citation": [
            {
                "@type": "WebSite",
                "name": "GOV.UK - Income Tax rates and allowances",
                "url": "https://www.gov.uk/guidance/rates-and-allowances-for-income-tax-on-employment-income" // Link to official source
            }
        ]
    },
    "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": createPageUrl("Home")
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Tax Calculators",
                "item": `${createPageUrl("Home")}#tax-calculators`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Income Tax Calculator"
            }
        ]
    },
    "about": [
        {
            "@type": "Thing",
            "name": "Income Tax",
            "description": "A tax levied directly on personal income."
        },
        {
            "@type": "Thing",
            "name": "Tax Brackets",
            "description": "Ranges of income that are taxed at a specific rate."
        }
    ],
    "keywords": "UK Income Tax, Income Tax Calculator, 2025/26 Tax Year, Personal Allowance, Basic Rate, Higher Rate, Additional Rate, Tax Bands, UK Tax, HMRC Tax"
};


const taxBrackets = [
  { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
  { min: 12571, max: 50270, rate: 0.20, name: "Basic Rate" },
  { min: 50271, max: 125140, rate: 0.40, name: "Higher Rate" },
  { min: 125141, max: Infinity, rate: 0.45, name: "Additional Rate" }
];

const incomeTaxFAQs = [
    {
        question: "What is the Personal Allowance?",
        answer: "The Personal Allowance is the amount of income you can earn each year before you have to pay any Income Tax. For the 2025/26 tax year, the standard Personal Allowance is £12,570. This allowance is reduced by £1 for every £2 you earn over £100,000."
    },
    {
        question: "How do tax bands work?",
        answer: "Tax bands are the different levels of income on which you pay tax. In England, Wales, and Northern Ireland, once your income exceeds the Personal Allowance, you start paying the Basic Rate (20%). If your income is high enough, you'll move into the Higher Rate (40%) and then the Additional Rate (45%) bands. You only pay the higher rate on the portion of your income that falls within that specific band."
    },
    {
        question: "Is this calculator suitable for Scotland?",
        answer: "This calculator uses the tax bands for England, Wales, and Northern Ireland. Scotland has its own set of income tax bands and rates which are different. For precise calculations for Scotland, please use our main Salary Calculator and select 'Scotland' in the advanced options."
    },
    {
        question: "Does this include National Insurance?",
        answer: "No, this calculator focuses exclusively on Income Tax to give you a clear understanding of that specific deduction. To see a full breakdown including National Insurance, pension, and student loan, please use our comprehensive Salary Calculator."
    }
];

export default function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  // Breadcrumb path definition
  const breadcrumbPath = [
      { name: "Home", url: createPageUrl("Home") },
      { name: "Tax Calculators", url: `${createPageUrl("Home")}#tax-calculators` },
      { name: "Income Tax Calculator" }
  ];

  const handleCalculate = () => {
    const income = Number(grossIncome) || 0;
    if (income <= 0) {
        setResults(null);
        setHasCalculated(true);
        return;
    }
    
    let totalTax = 0;
    let taxBreakdown = [];
    let personalAllowance = 12570;

    // Personal allowance reduction for high earners
    if (income > 100000) {
      personalAllowance = Math.max(0, personalAllowance - (income - 100000) / 2);
    }
    
    // Re-calculating tax breakdown for accuracy, simpler logic:
    let tempTotalTax = 0;
    let tempTaxBreakdown = [];
    let incomeRemainingForTax = income - personalAllowance;
    
    for (const bracket of taxBrackets) {
      if (bracket.rate === 0) continue; // Skip personal allowance band

      const lowerBound = bracket.min;
      const upperBound = bracket.max;

      // Calculate the portion of taxable income that falls within this bracket
      // This assumes tax brackets are for gross income, not adjusted by PA.
      // We need to find the taxable portion of `incomeRemainingForTax` that falls into this bracket's range.

      // Amount of the *gross income* that is above the lower bound of the bracket
      const grossAboveLowerBound = Math.max(0, income - lowerBound + 1); // +1 because bracket.min is inclusive
      // Amount of the *gross income* that is below the upper bound of the bracket
      const grossBelowUpperBound = Math.max(0, upperBound - income + 1); // +1 because bracket.max is inclusive

      // The actual range for the current bracket considering gross income
      const effectiveBracketStart = Math.max(lowerBound, personalAllowance + 1); // Taxable income starts after PA
      const effectiveBracketEnd = upperBound;

      let amountInThisBracket = 0;
      if (income > effectiveBracketStart -1 ) { // if income crosses into this effective bracket
          amountInThisBracket = Math.min(income, effectiveBracketEnd) - Math.max(personalAllowance, effectiveBracketStart -1);
          amountInThisBracket = Math.max(0, amountInThisBracket); // Ensure it's not negative
      }

      // Simpler and more common approach: calculate based on remaining taxable income
      // The amount of current `incomeRemainingForTax` that falls into this bracket's range
      const taxableAmountInBracket = Math.min(
        incomeRemainingForTax,
        Math.max(0, (upperBound === Infinity ? Infinity : upperBound) - Math.max(lowerBound, personalAllowance)) // Adjusted to handle Infinity correctly and for potential off-by-one, original logic was `upperBound - Math.max(lowerBound, personalAllowance)`
      );
      
      if (taxableAmountInBracket > 0) {
          const taxOnThisBand = taxableAmountInBracket * bracket.rate;
          tempTotalTax += taxOnThisBand;
          tempTaxBreakdown.push({
              name: bracket.name,
              amount: taxOnThisBand,
              rate: bracket.rate * 100,
              taxableAmount: taxableAmountInBracket
          });
          incomeRemainingForTax -= taxableAmountInBracket; // Deduct this amount from what's left to tax
      }
    }


    const newResults = {
        totalTax: tempTotalTax,
        taxBreakdown: tempTaxBreakdown,
        grossIncome: income,
        personalAllowance: personalAllowance
    };
    setResults(newResults);
    setHasCalculated(true);

     const csvExportData = [
      ["Band", "Taxable Amount", "Tax Rate", "Tax Paid"],
      ...newResults.taxBreakdown.map(item => [item.name, `£${item.taxableAmount.toFixed(2)}`, `${item.rate}%`, `£${item.amount.toFixed(2)}`]),
       ["", "", "", ""],
       ["Gross Income", `£${newResults.grossIncome.toFixed(2)}`, "", ""],
       ["Personal Allowance", `£${newResults.personalAllowance.toFixed(2)}`, "", ""],
       ["Total Tax", `£${newResults.totalTax.toFixed(2)}`, "", ""],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [grossIncome]);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(incomeTaxJsonLd)}
      </script>
      <div className="bg-white dark:bg-gray-900">
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumbs added here */}
            <Breadcrumbs path={breadcrumbPath} />
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                UK Income Tax Calculator 2025/26
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Demystify your tax bill. See exactly how your income is taxed across the different UK tax bands for the 2025/26 financial year.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="print-title hidden">Income Tax Breakdown 2025/26</div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="non-printable">
              <Card>
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="grossIncome">Annual Gross Income</Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="grossIncome"
                        type="number"
                        value={grossIncome}
                        onChange={(e) => setGrossIncome(e.target.value)}
                        className="pl-10"
                        placeholder="e.g. 50000"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCalculate} className="w-full text-lg">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Tax
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6 printable-area">
              {hasCalculated && results ? (
                <>
                  <div className="non-printable">
                    <h2 className="text-2xl font-bold text-gray-800">Your Tax Breakdown</h2>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                          <div className="flex justify-between items-center text-lg">
                              <span>Gross Income:</span>
                              <span className="font-semibold">£{results.grossIncome.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between items-center text-lg">
                              <span>Personal Allowance:</span>
                              <span className="font-semibold">£{results.personalAllowance.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg text-xl">
                              <span className="font-bold">Total Estimated Tax:</span>
                              <span className="font-bold text-red-700">-£{results.totalTax.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Breakdown by Tax Band</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {results.taxBreakdown.map((bracket, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">
                          <div>
                            <span className="font-medium">{bracket.name} ({bracket.rate}%)</span>
                            <p className="text-sm text-gray-600">
                              Taxable amount: £{bracket.taxableAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <span className="font-semibold text-blue-800">
                            -£{bracket.amount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <div className="non-printable pt-6">
                    <ExportActions csvData={csvData} fileName="income-tax-breakdown" title="Income Tax Breakdown" />
                  </div>
                </>
              ) : (
                <Card className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="text-center text-gray-500">
                    <Calculator className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Ready for your results?</h3>
                    <p>Enter your income and click "Calculate Tax".</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <CalculatorWrapper>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Understanding UK Income Tax</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Income Tax is the UK government's primary source of revenue, levied on most forms of income including employment earnings, profits from self-employment, rental income, and some state benefits. This calculator is designed to provide a clear and focused breakdown of your potential Income Tax liability based on your annual gross income. It isolates this single, significant deduction to help you understand exactly how it's calculated using the UK's progressive tax band system. By entering your income, you can see how it is divided across the different tax bands—from the tax-free Personal Allowance to the Basic, Higher, and Additional rates.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Why Use a Dedicated Income Tax Calculator?</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><b>Clarity and Focus:</b> Unlike a full salary calculator, this tool strips away other deductions like National Insurance, focusing solely on the Income Tax calculation.</li>
              <li><b>Educational Tool:</b> It's perfect for students, those new to the UK tax system, or anyone wanting to understand the mechanics of the tax bands.</li>
              <li><b>Financial Scenarios:</b> Quickly model how a change in income (like a bonus or a new job) will affect your tax liability without the noise of other deductions.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Example Use Case</h3>
            <p className="text-gray-700 dark:text-gray-300">
              An individual earns £60,000 annually. They use this calculator to understand their tax. The tool shows that the first £12,570 is tax-free (Personal Allowance). The next portion of their income, from £12,571 to £50,270, is taxed at the Basic Rate of 20%. The remaining income, from £50,271 to £60,000, is taxed at the Higher Rate of 40%. The calculator clearly displays the tax paid within each band and provides a total tax figure, giving the user a precise understanding of where their money goes.
            </p>
          </div>
        </CalculatorWrapper>

        <div id="faq-section" className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={incomeTaxFAQs} />
          </div>
        </div>
        
        <RelatedCalculators
          calculators={[
            { name: "Salary Calculator", url: createPageUrl("SalaryCalculator"), description: "Get a full breakdown of your take-home pay, including NI." },
            { name: "Capital Gains Tax Calculator", url: createPageUrl("CapitalGainsTaxCalculator"), description: "Calculate tax on profits from selling assets." },
            { name: "Dividend Tax Calculator", url: createPageUrl("DividendTaxCalculator"), description: "Understand tax on income from company shares." }
          ]}
        />
      </div>
    </>
  );
}
