// src/pages/calculators/minimum-wage-calculator.jsx
import React, { useState, useMemo, useCallback } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator, Users, Landmark, ClipboardList, Quote, BookOpen } from 'lucide-react';

const pagePath = '/calculators/minimum-wage-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/minimum-wage-calculator';
const pageTitle = 'Minimum Wage Calculator UK | National Living Wage Checker';
const metaDescription =
  'Check UK minimum wage and National Living Wage rates across age brackets. Project hourly, weekly, monthly, and annual earnings to ensure compliance.';
const keywords = getMappedKeywords('Minimum Wage Calculator');

const faqItems = [
  {
    question: 'What is the UK National Living Wage?',
    answer:
      'From April 2025 the National Living Wage applies to workers aged 21 and over. Younger age brackets have lower minimum wage rates. All bands are reset each April by the UK government.',
  },
  {
    question: 'How does the apprentice minimum wage work?',
    answer:
      'Apprentices under 19, or those 19 and over in their first apprenticeship year, receive the apprentice rate. After the first year, or once they turn 19, they move onto the age-appropriate minimum wage band.',
  },
  {
    question: 'How can employers stay compliant with UK legislation?',
    answer:
      'Review payroll every time rates change and whenever an employee joins a new age bracket. Keep records for at least six years, and perform regular NLW checker reviews to protect employees and avoid HMRC penalties.',
  },
];

const emotionalMessage =
  'Knowing your worth is the first step to financial empowerment. Use this calculator to ensure your earnings align with UK minimum wage standards and plan for a secure future.';
const emotionalQuote = {
  text: 'The best way to predict the future is to create it.',
  author: 'Peter Drucker',
};

const directoryLinks = [
  {
    url: '/#employment-income',
    label: 'Explore all employment & income calculators',
    description: 'From salary to tax, understand your earnings and financial obligations.',
  },
  {
    url: '/salary-calculator',
    label: 'Calculate your salary',
    description: 'Estimate your gross and net pay based on your annual salary.',
  },
  {
    url: '/take-home-pay-calculator',
    label: 'Check your take-home pay',
    description: 'See how your income changes after tax and National Insurance.',
  },
];

const wageRates = {
  '21+ (National Living Wage)': 11.44,
  '18-20': 8.6,
  'Under 18': 6.4,
  Apprentice: 6.4,
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function MinimumWageCalculatorPage() {
  const [inputs, setInputs] = useState({
    ageBand: '21+ (National Living Wage)',
    weeklyHours: '37.5',
    weeksPerYear: '52',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Minimum Wage Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Employment & Income Calculators', url: '/calculators#employment-income' },
      { name: 'Minimum Wage Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const parseNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const cleaned = String(value).replace(/,/g, '').trim();
    const numeric = Number.parseFloat(cleaned);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const calculateWage = useCallback(() => {
    const hourlyRate = wageRates[inputs.ageBand] || 0;
    const weeklyHours = parseNumber(inputs.weeklyHours);
    const weeksPerYear = parseNumber(inputs.weeksPerYear);

    const weeklyPay = hourlyRate * weeklyHours;
    const annualPay = weeklyPay * weeksPerYear;
    const monthlyPay = annualPay / 12;

    return {
      hourlyRate,
      weeklyPay,
      monthlyPay,
      annualPay,
    };
  }, [inputs]);

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSelectChange = useCallback((value) => {
    setInputs((prev) => ({ ...prev, ageBand: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computedResults = calculateWage();
      setResults(computedResults);
      setHasCalculated(true);

      const csvRows = [
        ['Metric', 'Value'],
        ['Age Band', inputs.ageBand],
        ['Weekly Hours', inputs.weeklyHours],
        ['Weeks Per Year', inputs.weeksPerYear],
        ['Hourly Pay (£)', currencyFormatter.format(computedResults.hourlyRate)],
        ['Weekly Pay (£)', currencyFormatter.format(computedResults.weeklyPay)],
        ['Monthly Pay (£)', currencyFormatter.format(computedResults.monthlyPay)],
        ['Annual Earnings (£)', currencyFormatter.format(computedResults.annualPay)],
      ];
      setCsvData(csvRows);
    },
    [calculateWage, currencyFormatter, inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      ageBand: '21+ (National Living Wage)',
      weeklyHours: '37.5',
      weeksPerYear: '52',
    });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        jsonLd={schema}
        keywords={keywords}
        articleTags={keywords}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Minimum Wage Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Check UK minimum wage and National Living Wage rates across age brackets. Project
              hourly, weekly, monthly, and annual earnings to ensure compliance.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Users className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-amber-600 dark:text-amber-300"
            borderColor="border-amber-200 dark:border-amber-800/60"
            bgColor="bg-amber-50/70 dark:bg-amber-950/40"
            textColor="text-amber-900 dark:text-amber-100"
            footerColor="text-amber-700 dark:text-amber-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator
                    className="h-5 w-5 text-amber-600 dark:text-amber-300"
                    aria-hidden="true"
                  />
                  Wage Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="ageBand">Age band</Label>
                      <Select value={inputs.ageBand} onValueChange={handleSelectChange}>
                        <SelectTrigger id="ageBand">
                          <SelectValue placeholder="Select band" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(wageRates).map((band) => (
                            <SelectItem key={band} value={band}>
                              {band}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weeklyHours">Weekly hours</Label>
                      <Input
                        id="weeklyHours"
                        inputMode="decimal"
                        value={inputs.weeklyHours}
                        onChange={handleInputChange('weeklyHours')}
                        placeholder="e.g. 37.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weeksPerYear">Weeks per year</Label>
                      <Input
                        id="weeksPerYear"
                        inputMode="decimal"
                        value={inputs.weeksPerYear}
                        onChange={handleInputChange('weeksPerYear')}
                        placeholder="e.g. 52"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Wage
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Select an age band and enter working hours, then press{' '}
                    <span className="font-semibold">Calculate Wage</span> to see estimated earnings
                    based on UK minimum wage rates.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-amber-200 bg-white shadow-sm dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users
                          className="h-5 w-5 text-amber-600 dark:text-amber-200"
                          aria-hidden="true"
                        />
                        Earnings Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Hourly pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.hourlyRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Weekly pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Monthly pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">
                          Annual earnings
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualPay)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="minimum-wage-earnings"
                          title="Minimum Wage Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ClipboardList
                          className="h-5 w-5 text-amber-600 dark:text-amber-300"
                          aria-hidden="true"
                        />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        The wage rates used in this calculator are examples. Always check the{' '}
                        <a
                          href="https://www.gov.uk/national-minimum-wage-rates"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:underline dark:text-amber-400"
                        >
                          official UK government website
                        </a>{' '}
                        for the most current National Living Wage and National Minimum Wage rates.
                      </p>
                      <p>
                        This calculator provides an estimate. Your actual pay may vary based on your
                        specific employment contract and any additional benefits.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
