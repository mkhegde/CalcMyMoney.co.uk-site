import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { calculatorCategories } from '../components/data/calculatorConfig';
import { jobTitles, ukCities, createSlug } from '../components/data/seo-data';

const staticPages = [
  { url: createPageUrl('Home'), title: 'Home' },
  { url: createPageUrl('Resources'), title: 'Resources' },
  { url: createPageUrl('Blog'), title: 'Blog' },
  { url: createPageUrl('Contact'), title: 'Contact' },
  { url: createPageUrl('JobSalaries'), title: 'Job Salaries' },
  { url: createPageUrl('CostOfLiving'), title: 'Cost of Living' },
  { url: createPageUrl('UKGovernmentBudget'), title: 'UK Budget Analysis' },
  { url: createPageUrl('UKFinancialStats'), title: 'UK Financial Statistics' },
  // Added Hub + Child Salary pages
  { url: createPageUrl('SalaryCalculatorUK'), title: 'Salary Calculator (Hub)' },
  { url: createPageUrl('SalaryCalculatorTakeHomePay'), title: 'Take-Home Pay Calculator' },
  { url: createPageUrl('SalaryCalculatorPaycheck'), title: 'Paycheck Calculator' },
  { url: createPageUrl('GrossToNetCalculator'), title: 'Gross to Net Calculator' },
  { url: createPageUrl('ProRataSalaryCalculator'), title: 'Pro-Rata Salary Calculator' },
];

const legalPages = [
  { url: createPageUrl('PrivacyPolicy'), title: 'Privacy Policy' },
  { url: createPageUrl('CookiePolicy'), title: 'Cookie Policy' },
  { url: createPageUrl('TermsOfService'), title: 'Terms of Service' },
  { url: createPageUrl('Disclaimer'), title: 'Disclaimer' },
];

const blogPosts = [
  {
    url: createPageUrl('BlogSmartMoneySavingTips'),
    title: 'Smart Money-Saving Tips for Everyday Life',
  },
  {
    url: createPageUrl('BlogDebtRepaymentStrategies'),
    title: 'Effective Debt Repayment Strategies',
  },
  { url: createPageUrl('BlogFinancialPsychology'), title: 'The Psychology of Money' },
];

const SitemapSection = ({ title, links, columns = 1 }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">
      {title}
    </h2>
    <ul className={`space-y-2 list-disc list-inside columns-${columns}`}>
      {links.map((link, index) => (
        <li key={index} className="break-inside-avoid">
          <Link to={link.url} className="text-blue-600 hover:underline">
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Sitemap() {
  const calculatorLinks = calculatorCategories
    .flatMap((category) =>
      category.subCategories.flatMap((sub) =>
        sub.calculators.map((calc) => ({
          url: calc.url,
          title: calc.name,
        }))
      )
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const jobLinks = jobTitles.map((job) => ({
    url: `/job-salaries/${createSlug(job.title)}`,
    title: `${job.title} Salary`,
  }));

  const costOfLivingBase = createPageUrl('CostOfLiving');
  const cityLinks = ukCities.map((city) => ({
    url: `${costOfLivingBase}/${createSlug(city.name)}`,
    title: `Cost of Living in ${city.name}`,
  }));

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Sitemap</h1>
          <p className="mt-2 text-lg text-gray-600">
            A complete list of all pages on CalcMyMoney.co.uk
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          <div className="lg:col-span-1">
            <SitemapSection title="Main Pages" links={staticPages} />
            <SitemapSection title="Blog Articles" links={blogPosts} />
            <SitemapSection title="Legal" links={legalPages} />
          </div>

          <div className="lg:col-span-2">
            <SitemapSection title="Financial Calculators" links={calculatorLinks} columns={2} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <SitemapSection title="Job Salaries" links={jobLinks} columns={4} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <SitemapSection title="Cost of Living by City" links={cityLinks} columns={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
