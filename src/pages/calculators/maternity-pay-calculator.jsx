import React, { useMemo, useState, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { Calculator, Baby, CalendarRange, Heart, Quote, BookOpen } from 'lucide-react';

const pagePath = '/calculators/maternity-pay-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/maternity-pay-calculator';
const pageTitle = 'Maternity Pay Calculator UK | SMP Entitlement Planner';
const metaDescription =
  'Estimate Statutory Maternity Pay (SMP) for UK employees. Calculate maternity allowance, confirm eligibility, and plan your finances during maternity leave.';
const keywords = getMappedKeywords('Statutory Maternity Pay Calculator');

const faqItems = [
  {
    question: 'Who qualifies for Statutory Maternity Pay (SMP)?',
    answer:
      'You must have been employed continuously for at least 26 weeks up to the 15th week before the week the baby is due and earn on average at least the lower earnings limit (LEL).',
  },
  {
    question: 'How is SMP paid?',
    answer:
      'SMP is paid for up to 39 weeks. The first six weeks are 90% of average weekly earnings, followed by 33 weeks at the lower of 90% AWE or the standard SMP rate.',
  },
  {
    question: 'What if I am not eligible for SMP?',
    answer:
      'You may qualify for Maternity Allowance from Jobcentre Plus. Eligibility depends on your work history and earnings over the previous 66 weeks.',
  },
];

const emotionalMessage =
  'Planning for a new arrival is exciting, and understanding your maternity pay helps ensure financial peace of mind. Use this calculator to confidently map out your income during this special time.';
const emotionalQuote = {
  text: 'The most important thing a father can do for his children is to love their mother.',
  author: 'Theodore Hesburgh',
};

const directoryLinks = [
  {
    url: '/#family-planning',
    label: 'Explore all family planning calculators',
    description: "From childcare costs to savings goals, plan for your family's financial future.",
  },
  {
    url: '/childcare-cost-calculator',
    label: 'Estimate childcare costs',
    description: 'Understand the financial impact of childcare on your household budget.',
  },
  {
    url: '/take-home-pay-calculator',
    label: 'Check your take-home pay',
    description: 'See how your income changes after tax and National Insurance.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const SMP_STANDARD_RATE = 184.03; // 2025/26 example rate - always check current government rates
const SMP_DURATION_WEEKS = 39;
const SMP_HIGH_RATE_WEEKS = 6;

export default function MaternityPayCalculatorPage() {
  const [inputs, setInputs] = useState({
    averageWeeklyEarnings: '520',
    qualifyingWeekDate: '',
    additionalEmployersTopUp: '0',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Maternity Pay Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Family Planning Calculators', url: '/calculators#family-planning' },
      { name: 'Maternity Pay Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const parseNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const cleaned = String(value).replace(/,/g, '').trim();
    const numeric = Number.parseFloat(cleaned);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const calculateSMP = useCallback(() => {
    const awe = parseNumber(inputs.averageWeeklyEarnings);
    const employerTopUp = parseNumber(inputs.additionalEmployersTopUp);

    const firstSixWeeksPay = SMP_HIGH_RATE_WEEKS * (Math.min(awe * 0.9, awe) + employerTopUp);

    const remainingWeeks = SMP_DURATION_WEEKS - SMP_HIGH_RATE_WEEKS;
    const standardWeeklyPay = Math.min(awe * 0.9, SMP_STANDARD_RATE) + employerTopUp;
    const remainingPay = remainingWeeks * standardWeeklyPay;

    const totalSMP = firstSixWeeksPay + remainingPay;
    const totalWeeks = SMP_DURATION_WEEKS;
    const averageWeeklySMP = totalSMP / totalWeeks;
    const monthlyEquivalent = (totalSMP / SMP_DURATION_WEEKS) * (365.25 / 12 / 7); // Average days in month / 7

    return {
      awe,
      employerTopUp,
      firstSixWeeksPay,
      standardWeeklyPay,
      remainingPay,
      totalSMP,
      averageWeeklySMP,
      monthlyEquivalent,
      totalWeeks,
    };
  }, [inputs]);

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computedResults = calculateSMP();
      setResults(computedResults);
      setHasCalculated(true);

      const csvRows = [
        ['Metric', 'Value'],
        ['Average Weekly Earnings (£)', currencyFormatter.format(computedResults.awe)],
        ['Employer Top-up per week (£)', currencyFormatter.format(computedResults.employerTopUp)],
        ['First 6 weeks total (£)', currencyFormatter.format(computedResults.firstSixWeeksPay)],
        ['Weeks 7-39 total (£)', currencyFormatter.format(computedResults.remainingPay)],
        ['Average weekly SMP (£)', currencyFormatter.format(computedResults.averageWeeklySMP)],
        ['Monthly equivalent (£)', currencyFormatter.format(computedResults.monthlyEquivalent)],
        ['Total SMP (39 weeks) (£)', currencyFormatter.format(computedResults.totalSMP)],
        ['Weeks covered', computedResults.totalWeeks],
      ];
      setCsvData(csvRows);
    },
    [calculateSMP, currencyFormatter]
  );

  const handleReset = useCallback(() => {
    setInputs({
      averageWeeklyEarnings: '520',
      qualifyingWeekDate: '',
      additionalEmployersTopUp: '0',
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-600/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Maternity Pay Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate your Statutory Maternity Pay (SMP) and plan your finances during maternity
              leave. Enter your average weekly earnings and any employer top-up to see your pay
              schedule.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Heart className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-rose-600 dark:text-rose-300"
            borderColor="border-rose-200 dark:border-rose-800/60"
            bgColor="bg-rose-50/70 dark:bg-rose-950/40"
            textColor="text-rose-900 dark:text-rose-100"
            footerColor="text-rose-700 dark:text-rose-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Baby className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                  Maternity Pay Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="averageWeeklyEarnings">Average weekly earnings (£)</Label>
                      <Input
                        id="averageWeeklyEarnings"
                        inputMode="decimal"
                        value={inputs.averageWeeklyEarnings}
                        onChange={handleInputChange('averageWeeklyEarnings')}
                        placeholder="e.g. 520"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualifyingWeekDate">Qualifying week (optional)</Label>
                      <Input
                        id="qualifyingWeekDate"
                        type="date"
                        value={inputs.qualifyingWeekDate}
                        onChange={handleInputChange('qualifyingWeekDate')}
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Used to discuss timelines with HR; not required for calculations.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalEmployersTopUp">Employer top-up per week (£)</Label>
                      <Input
                        id="additionalEmployersTopUp"
                        inputMode="decimal"
                        value={inputs.additionalEmployersTopUp}
                        onChange={handleInputChange('additionalEmployersTopUp')}
                        placeholder="e.g. 0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Maternity Pay
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
                    Enter your earnings and any employer top-up, then press{' '}
                    <span className="font-semibold">Calculate Maternity Pay</span> to see your SMP
                    entitlement and payment schedule.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-rose-200 bg-white shadow-sm dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CalendarRange
                          className="h-5 w-5 text-rose-600 dark:text-rose-200"
                          aria-hidden="true"
                        />
                        Maternity Pay Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">
                          First 6 weeks total
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.firstSixWeeksPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Weeks 7-39 total</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.remainingPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">
                          Total SMP (39 weeks)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalSMP)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">
                          Monthly equivalent
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyEquivalent)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="maternity-pay-projection"
                          title="Maternity Pay Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen
                          className="h-5 w-5 text-rose-600 dark:text-rose-300"
                          aria-hidden="true"
                        />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        The standard SMP rate used in this calculator (£{SMP_STANDARD_RATE}) is an
                        example for 2025/26. Always check the{' '}
                        <a
                          href="https://www.gov.uk/maternity-pay-leave/what-you-can-get"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-600 hover:underline dark:text-rose-400"
                        >
                          official UK government website
                        </a>{' '}
                        for the most current rates and eligibility criteria.
                      </p>
                      <p>
                        This calculator provides an estimate. Your actual pay may vary based on your
                        employer's policies and any additional benefits.
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
