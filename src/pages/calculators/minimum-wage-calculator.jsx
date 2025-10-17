// src/pages/calculators/minimum-wage-calculator.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Users, Landmark, ClipboardList } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
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

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/minimum-wage-calculator';

const schemaKeywords = [
  'National Living Wage',
  'Age Brackets',
  'Hourly Pay',
  'Annual Earnings',
  'UK Minimum',
];

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

const wageRates = {
  '21+ (National Living Wage)': 11.44,
  '18-20': 8.60,
  'Under 18': 6.40,
  Apprentice: 6.40,
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function MinimumWageCalculator() {
  const [inputs, setInputs] = useState({
    ageBand: '21+ (National Living Wage)',
    weeklyHours: '37.5',
    weeksPerYear: '52',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const hourlyRate = wageRates[inputs.ageBand] || 0;
    const weeklyHours = Number(inputs.weeklyHours) || 0;
    const weeksPerYear = Number(inputs.weeksPerYear) || 0;

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

  const reset = useCallback(() => {
    setInputs({
      ageBand: '21+ (National Living Wage)',
      weeklyHours: '37.5',
      weeksPerYear: '52',
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Minimum Wage & Living Wage Calculator</title>
        <meta
          name="description"
          content="Check UK minimum wage and National Living Wage rates across age brackets and project hourly, weekly, monthly, and annual earnings."
        />
        <meta name="keywords" content="Minimum Wage Rates, NLW, UK Pay" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'GovernmentService',
              name: 'Minimum Wage Calculator',
              description:
                'Minimum wage and National Living Wage calculator covering UK legislation, youth rates, and employment standards.',
              url: canonicalUrl,
              keywords: schemaKeywords,
              areaServed: 'GB',
              serviceType: 'Wage compliance checker',
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Minimum Wage Calculator
          </Heading>
          <p className="text-lg md:text-xl text-amber-100">
            Calculate minimum wage, verify NLW compliance, and keep pace with UK employment standards.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-amber-200 dark:border-amber-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-amber-500" />
                Wage Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Age band</Label>
                <Select
                  value={inputs.ageBand}
                  onValueChange={(value) => handleChange('ageBand', value)}
                >
                  <SelectTrigger>
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
              <div>
                <Label htmlFor="weeklyHours" className="text-sm font-medium">
                  Weekly hours
                </Label>
                <Input
                  id="weeklyHours"
                  inputMode="decimal"
                  value={inputs.weeklyHours}
                  onChange={(event) => handleChange('weeklyHours', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="weeksPerYear" className="text-sm font-medium">
                  Weeks per year
                </Label>
                <Input
                  id="weeksPerYear"
                  inputMode="decimal"
                  value={inputs.weeksPerYear}
                  onChange={(event) => handleChange('weeksPerYear', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
                <Card className="border border-amber-200 dark:border-amber-900 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Users className="h-5 w-5 text-amber-500" />
                      NLW Checker Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground">Hourly pay</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {currencyFormatter.format(results.hourlyRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weekly pay</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {currencyFormatter.format(results.weeklyPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly pay</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {currencyFormatter.format(results.monthlyPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Annual earnings</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {currencyFormatter.format(results.annualPay)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-amber-200 dark:border-amber-900 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Landmark className="h-5 w-5 text-amber-500" />
                      UK Legislation Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>• Review UK legislation every April when new minimum wage rates launch.</p>
                    <p>• Youth rates move with birthdays—update employment contracts promptly.</p>
                    <p>• Keep payroll records for at least six years to evidence compliance.</p>
                  </CardContent>
                </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Minimum Wage with Confidence
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Use this NLW checker to monitor hourly pay, confirm employment standards, and maintain
            compliance with UK legislation. Regular reviews protect both employers and employees.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Youth Rates &amp; Employment Standards
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Minimum wage depends on age brackets, apprenticeship status, and agreed weekly hours.
            Keep rotas and payslips aligned so young workers progress smoothly through the pay scale.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            NLW Checker for Employers and Workers
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Whether you are an employer auditing payroll or an employee verifying your payslip, this
            tool helps you understand total compensation—hourly, weekly, monthly, or annually.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
