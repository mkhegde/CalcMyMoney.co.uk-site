import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import Heading from '@/components/common/Heading';

const canonical = 'https://www.calcmymoney.co.uk/blog/why-small-calculations-matter';
const title = 'The Math Behind a Good Life: Why Small Money Calculations Change Big Outcomes';
const description = `We work hard for every pound. Here's how tiny money calculations-salary, tax, mortgage, budgeting-create calm, confident decisions.`;
const defaultOgImage = 'https://www.calcmymoney.co.uk/og-image.png';
const defaultRobots = 'index,follow,max-image-preview:large';
const defaultTwitterCard = 'summary_large_image';

export default function BlogWhyCalculationsMatter() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>Why Small Money Calculations Matter | CalcMyMoney</title>
        <meta name="description" content={description} />
        <meta name="robots" content={defaultRobots} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Why Small Money Calculations Matter | CalcMyMoney" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={defaultOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content={defaultTwitterCard} />
        <meta name="twitter:title" content="Why Small Money Calculations Matter | CalcMyMoney" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={defaultOgImage} />
      </Helmet>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description,
          author: { '@type': 'Organization', name: 'CalcMyMoney' },
          publisher: { '@type': 'Organization', name: 'CalcMyMoney' },
          datePublished: new Date().toISOString(),
          mainEntityOfPage: canonical,
        }}
      />

      {/* Hero (gradient + icon) */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-gray-700 p-3">
            <Calculator className="w-6 h-6 text-blue-700 dark:text-blue-300" role="img" aria-label="Calculator icon" />
          </div>
          <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </Heading>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            People don’t want spreadsheets; we want a good life. But a good life is often built from
            small, calm calculations done at the right time. The numbers won’t decide for you—yet
            they make your choices clearer, kinder and more confident.
          </p>
        </div>
      </div>

      {/* Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 text-gray-800 dark:text-gray-200">
          {/* Opening hook */}
          <section className="space-y-4 text-base md:text-lg">
            <p>
              In the UK, we work hard for every pound. We also make hundreds of tiny financial
              decisions each month—how much to save, what to pay off, which tariff to choose, whether
              a salary offer really stretches. When we skip these small sums, uncertainty grows and
              stress follows.
            </p>
            <p>
              The fix isn’t more jargon. It’s quick, practical calculations that respect both your
              feelings and your facts. A two‑minute check on salary, tax or mortgage payments can
              turn “I hope this is fine” into “I know this works for us.”
            </p>
          </section>

          {/* H2: Feelings vs numbers */}
          <section aria-labelledby="feelings-numbers" className="space-y-4">
            <h2 id="feelings-numbers" className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Feelings are real. Numbers are revealing.
            </h2>
            <p className="text-base md:text-lg">
              Money isn’t just maths; it’s meaning. That’s why a pay rise might feel underwhelming
              after tax, or a mortgage quote seems high until you see the total interest saved by a
              small overpayment. Numbers translate the fuzzy into the familiar. They don’t dismiss
              feelings—they give them context.
            </p>
            <p className="text-base md:text-lg">
              The best time to calculate is right before a decision: assessing a new role with a
              <a href="/salary-calculator-uk" className="text-blue-600 hover:underline"> Salary Calculator</a>, double‑checking take‑home with a
              <a href="/paye-calculator" className="text-blue-600 hover:underline"> PAYE Calculator</a>, or mapping repayments in a
              <a href="/mortgage-calculator-uk" className="text-blue-600 hover:underline"> Mortgage Calculator</a>. It’s not complicated; it’s caring for your future self.
            </p>
          </section>

          {/* H2: Small print */}
          <section aria-labelledby="small-print" className="space-y-4">
            <h2 id="small-print" className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              The small print is where your pay goes to hide
            </h2>
            <p className="text-base md:text-lg">
              Deductions are big in the UK: Income Tax, National Insurance, pensions, student loans.
              They’re sensible—but they’re also sneaky when you don’t quantify them. A quick PAYE
              run‑through shows the truth: that “£3,000 per month” might be £2,350 in your account,
              and a 1% pension tweak could nudge your net pay more gently than you expect.
            </p>
            <p className="text-base md:text-lg">
              The same goes for home ownership. Two quotes can look similar until you compare rates,
              fees and term side by side. A small rate difference compounds across decades, and a tiny
              overpayment can carve years off your term. The right time to check? Before you sign.
            </p>
          </section>

          {/* H2: Money Blueprint */}
          <section aria-labelledby="money-blueprint" className="space-y-4">
            <h2 id="money-blueprint" className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Your Money Blueprint (and why you need one)
            </h2>
            <p className="text-base md:text-lg">
              A blueprint is a simple, repeatable set of checks you run whenever money’s on the
              move—new job, new home, new plan. It’s not a spreadsheet marathon. It’s five minutes
              with the right tools:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-base">
              <li>
                Estimate take‑home from a salary or offer using the
                <a href="/salary-calculator-uk" className="text-blue-600 hover:underline"> Salary Calculator</a> and verify with the
                <a href="/paye-calculator" className="text-blue-600 hover:underline"> PAYE Calculator</a>.
              </li>
              <li>
                Stress‑test your home costs with the
                <a href="/mortgage-calculator-uk" className="text-blue-600 hover:underline"> Mortgage Calculator</a>—check interest changes, fees and terms.
              </li>
              <li>
                Give every pound a home with the
                <a href="/budget-calculator" className="text-blue-600 hover:underline"> Budget Calculator</a>—then let it flex as life changes.
              </li>
            </ul>
            <p className="text-base md:text-lg">
              When your blueprint lives in your head (and in a few bookmarked tools), financial
              admin stops being a burden and becomes a rhythm. The habit is the help.
            </p>
          </section>

          {/* H2: Three habits that compound */}
          <section aria-labelledby="habits" className="space-y-4">
            <h2 id="habits" className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Three habits that compound
            </h2>
            <ul className="list-disc pl-5 space-y-3 text-base">
              <li>
                <strong>Check the real number.</strong> What’s the net figure, the monthly
                repayment, the total cost over time? When you know the real number, you steer better.
              </li>
              <li>
                <strong>Decide with ranges, not guesses.</strong> “If rates move ±1%, are we still
                comfortable?” “If income shifts next year, what changes?” Ranges make plans resilient.
              </li>
              <li>
                <strong>Make the next pound deliberate.</strong> A tiny overpayment, an extra
                percentage into pension, or a small cut in a category—none feels dramatic, yet together
                they change the year’s story.
              </li>
            </ul>
          </section>

          {/* Closing CTA */}
          <section aria-labelledby="cta" className="space-y-4">
            <h2 id="cta" className="sr-only">Get started</h2>
            <p className="text-base md:text-lg">
              If you want calmer money decisions this year, try one quick calculation today. Estimate
              take‑home on a new salary, compare a mortgage scenario, or sketch a one‑page budget.
              You’ll feel the shift from “I’m not sure” to “I’ve got this.”
            </p>
            <p className="text-base md:text-lg">
              Start with our most‑used tools:
              <a href="/salary-calculator-uk" className="text-blue-600 hover:underline"> Salary Calculator</a>,
              <a href="/paye-calculator" className="text-blue-600 hover:underline"> PAYE Calculator</a>,
              <a href="/mortgage-calculator-uk" className="text-blue-600 hover:underline"> Mortgage Calculator</a>
              {' '}and the
              <a href="/budget-calculator" className="text-blue-600 hover:underline"> Budget Calculator</a>.
              Five minutes now can save five headaches later.
            </p>
          </section>

          {/* Optional: Related tools grid */}
          <section aria-labelledby="related-tools" className="mt-10">
            <h2 id="related-tools" className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Try these next
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {[
                {
                  name: 'Salary Calculator (UK)',
                  href: '/salary-calculator-uk',
                  desc: 'See take‑home pay after tax, NI, pension and student loans.',
                },
                {
                  name: 'PAYE Calculator',
                  href: '/paye-calculator',
                  desc: 'Break down your payslip clearly—no surprises on payday.',
                },
                {
                  name: 'Mortgage Calculator',
                  href: '/mortgage-calculator-uk',
                  desc: 'Estimate repayments and rate scenarios with fees and terms.',
                },
                {
                  name: 'Budget Calculator',
                  href: '/budget-calculator',
                  desc: 'Give every pound a job and reduce end‑of‑month stress.',
                },
              ].map((c) => (
                <a
                  key={c.name}
                  href={c.href}
                  className="block rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{c.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{c.desc}</div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
