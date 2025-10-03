/*
 * This file contains the complete, nested configuration for all calculators
 * and exports necessary helper functions for site navigation and statistics.
 * The primary export is 'calculatorCategories'.
 */

// Import necessary utility and icons
import { createPageUrl } from '../../utils/createPageUrl';
import {
  HandCoins,
  PoundSterling,
  Calculator,
  Percent,
  Briefcase,
  TrendingUp,
  Calendar,
  FileText,
  Baby,
  PiggyBank,
  User,
  Shield,
  Building2,
  Receipt,
  Target,
  MapPin,
  Home as HomeIcon,
  Car,
  Repeat,
  CreditCard,
  TrendingDown,
  BookOpen,
  Banknote,
  FileSpreadsheet,
  Building,
  Sparkles,
  Heart,
  Zap,
} from 'lucide-react';

// --- CALCULATOR METADATA (FAQs, etc.) ---

export const calculatorFaqs = {
  BudgetCalculator: [
    {
      question: 'How often should I review my budget?',
      answer:
        'Review your budget at least once a month so you can compare planned spending with what actually happened. Adjust sooner if your income or expenses change.',
    },
    {
      question: 'What percentage of income should go to savings?',
      answer:
        'A common rule of thumb is the 50/30/20 framework—50% needs, 30% wants, 20% savings or debt repayments. Use it as a starting point and tweak the percentages to suit your goals.',
    },
    {
      question: 'How can I reduce non-essential spending?',
      answer:
        'Start by categorising expenses, identify discretionary items such as subscriptions or dining out, then set caps or pause services you rarely use. Small changes across several categories add up quickly.',
    },
  ],
  MortgageCalculator: [
    {
      question: 'How much can I borrow for a mortgage?',
      answer:
        'UK lenders typically offer around 4 to 4.5 times your annual income, but affordability assessments also look at monthly expenses, credit score, and existing debts. Some lenders may stretch to 5–6 times income in special cases.',
    },
    {
      question: 'What is Loan-to-Value (LTV) and why does it matter?',
      answer:
        "LTV is the percentage of the property value you are borrowing. A lower LTV (meaning a higher deposit) usually unlocks better interest rates. For example, 90% LTV means a 10% deposit, while 75% LTV means a 25% deposit.",
    },
    {
      question: 'What is stamp duty and how much will I pay?',
      answer:
        'Stamp Duty Land Tax is paid on property purchases in England and Wales. For 2025/26 you pay 5% on the portion between £250k and £925k, 10% between £925k and £1.5m, and 12% above £1.5m. First-time buyers get relief on homes up to £425k.',
    },
    {
      question: 'Should I choose a fixed or variable rate mortgage?',
      answer:
        'Fixed rates provide payment certainty for a set term, while variable rates can fall—or rise— with the market. Consider how long you plan to stay in the property and how much payment fluctuation you can handle.',
    },
    {
      question: "What is the difference between repayment and interest-only mortgages?",
      answer:
        'Repayment mortgages pay down both the loan and interest, so you own the property outright at the end of the term. Interest-only mortgages have lower monthly payments but the original balance must be cleared separately when the term ends.',
    },
    {
      question: 'What extra costs should I budget for when buying a home?',
      answer:
        'Allow for legal fees, surveys, mortgage arrangement fees, moving costs, and insurance. A 3–5% buffer on top of your deposit is a sensible contingency for upfront costs.',
    },
  ],
  IncomeTaxCalculator: [
    {
      question: 'What is the Personal Allowance?',
      answer:
        'It is the amount of income you can earn before paying Income Tax. For the 2025/26 tax year the standard Personal Allowance is £12,570, although it tapers once your income exceeds £100,000.',
    },
    {
      question: 'How do the tax bands work?',
      answer:
        'After the Personal Allowance, income is taxed in bands—20% Basic Rate, 40% Higher Rate, and 45% Additional Rate for England, Wales, and Northern Ireland. You only pay the higher rate on the portion of income within that band.',
    },
    {
      question: 'Does the calculator include National Insurance?',
      answer:
        'No, it focuses purely on Income Tax so you can see that deduction clearly. For a combined view including NI, pension, and student loan deductions, use the main Salary Calculator.',
    },
    {
      question: 'Is the calculator suitable for Scotland?',
      answer:
        'Scottish income tax rates differ from the rest of the UK, so use the Salary Calculator and select the Scotland option for accurate figures.',
    },
  ],
};

// --- MAIN CONFIGURATION ARRAY ---

export const calculatorCategories = [
  {
    name: 'Income & Employment',
    slug: 'income-employment',
    icon: HandCoins,
    description: 'Calculate your take-home pay, overtime, and employment-related earnings.',
    subCategories: [
      {
        name: 'Salary & Wages',
        calculators: [
          {
            name: 'Salary Calculator',
            url: createPageUrl('SalaryCalculatorUK'),
            icon: PoundSterling,
            status: 'active',
            description: 'Calculate take-home pay from gross salary',
          },
          {
            name: 'PAYE Calculator',
            page: 'PAYECalculator',
            url: createPageUrl('paye-calculator'),
            icon: Calculator,
            status: 'active',
            description: 'UK PAYE tax and NI calculator',
          },
          {
            name: 'Pro Rata Salary Calculator',
            url: createPageUrl('ProRataSalaryCalculator'),
            icon: Percent,
            status: 'active',
            description: 'Calculate part-time or pro-rata salary',
          },
          {
            name: 'Hourly to Annual Salary Calculator',
            url: createPageUrl('HourlyToAnnualSalaryCalculator'),
            icon: Calculator,
            status: 'active',
            description: 'Convert hourly rates to annual salary',
          },
          {
            name: 'Minimum Wage Calculator',
            url: createPageUrl('MinimumWageCalculator'),
            icon: PoundSterling,
            status: 'active',
            description: 'Check UK minimum wage rates and calculations',
          },
          {
            name: 'Freelancer Day Rate Calculator',
            url: createPageUrl('FreelancerDayRateCalculator'),
            icon: Briefcase,
            status: 'active',
            description: 'Calculate optimal day rates for freelancers',
          },
          {
            name: 'Salary Increase Calculator',
            url: createPageUrl('SalaryIncreaseCalculator'),
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate your new salary after a pay rise',
          },
          {
            name: 'Commission Calculator',
            url: createPageUrl('CommissionCalculator'),
            icon: Percent,
            status: 'active',
            description: 'Calculate earnings based on commission rates',
          },
        ],
      },
      {
        name: 'Overtime & Bonuses',
        calculators: [
          {
            name: 'Overtime & Bonus Calculator',
            url: createPageUrl('OvertimeBonusCalculator'),
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate overtime pay and bonus amounts',
          },
          {
            name: 'Overtime Pay Calculator',
            url: createPageUrl('OvertimePayCalculator'),
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate overtime earnings',
          },
          {
            name: 'Overtime Rate Calculator',
            page: 'OvertimeRateCalculator',
            url: createPageUrl('OvertimeRateCalculator'),
            icon: Percent,
            status: 'active',
            description: 'Determine overtime hourly rates',
          },
        ],
      },
      {
        name: 'Statutory Pay & Benefits',
        calculators: [
          {
            name: 'Holiday Pay Calculator',
            url: createPageUrl('HolidayPayCalculator'),
            icon: Calendar,
            status: 'active',
            description: 'Calculate UK statutory holiday pay',
          },
          {
            name: 'Severance Pay Calculator',
            page: 'SeverancePayCalculator',
            url: createPageUrl('SeverancePayCalculator'),
            icon: FileText,
            status: 'active',
            description: 'Calculate severance package amounts',
          },
          {
            name: 'Child Benefit Calculator',
            page: 'ChildBenefitCalculator',
            url: createPageUrl('ChildBenefitCalculator'),
            icon: Baby,
            status: 'active',
            description: 'Calculate UK Child Benefit entitlement',
          },
        ],
      },
      {
        name: 'Specialist Employment',
        calculators: [
          {
            name: 'Contractor (IR35) Calculator',
            url: createPageUrl('ContractorCalculator'),
            icon: Briefcase,
            status: 'active',
            description: 'IR35 and contractor tax calculations',
          },
          {
            name: 'Salary Sacrifice Calculator',
            url: createPageUrl('SalarySacrificeCalculator'),
            icon: PiggyBank,
            status: 'active',
            description: 'Calculate salary sacrifice benefits',
          },
          {
            name: 'Payroll Calculator',
            url: createPageUrl('PayrollCalculator'),
            icon: Calculator,
            status: 'active',
            description: 'Employer NI and pension calculations',
          },
        ],
      },
    ],
  },

  {
    name: 'Tax Calculators',
    slug: 'tax-calculators',
    icon: PoundSterling,
    description: 'UK tax calculations for individuals and businesses.',
    subCategories: [
      {
        name: 'Income Tax & National Insurance',
        calculators: [
          {
            name: 'Income Tax Calculator',
            page: 'IncomeTaxCalculator',
            url: createPageUrl('IncomeTaxCalculator'),
            icon: User,
            status: 'active',
            description: 'Calculate UK income tax liability',
            faq: calculatorFaqs.IncomeTaxCalculator,
          },
          {
            name: 'National Insurance Calculator',
            url: createPageUrl('NationalInsuranceCalculator'),
            icon: Shield,
            status: 'active',
            description: 'Calculate National Insurance contributions',
          },
          {
            name: 'Effective Tax Rate Calculator',
            url: createPageUrl('EffectiveTaxRateCalculator'),
            icon: Percent,
            status: 'active',
            description: 'Find your average tax rate',
          },
        ],
      },
      {
        name: 'Investment & Capital Taxes',
        calculators: [
          {
            name: 'Capital Gains Tax Calculator',
            url: createPageUrl('CapitalGainsTaxCalculator'),
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate CGT on investments and assets',
          },
          {
            name: 'Dividend Tax Calculator',
            url: createPageUrl('DividendTaxCalculator'),
            icon: PoundSterling,
            status: 'active',
            description: 'Calculate tax on dividend income',
          },
        ],
      },
      {
        name: 'Business & VAT',
        calculators: [
          {
            name: 'VAT Calculator',
            url: createPageUrl('VATCalculator'),
            icon: Percent,
            status: 'active',
            description: 'Calculate UK VAT amounts and rates',
          },
          {
            name: 'Corporation Tax Calculator',
            url: createPageUrl('CorporationTaxCalculator'),
            icon: Building2,
            status: 'active',
            description: 'Calculate UK corporation tax',
          },
        ],
      },
    ],
  },

  {
    name: 'Personal Finance & Budgeting',
    slug: 'personal-finance-budgeting',
    icon: PiggyBank,
    description: 'Budget planning, savings goals, and personal financial management.',
    subCategories: [
      {
        name: 'Budgeting & Planning',
        calculators: [
          {
            name: 'Budget Planner',
            page: 'BudgetCalculator',
            url: createPageUrl('BudgetCalculator'),
            icon: PiggyBank,
            status: 'active',
            description: 'Create and track your monthly budget',
            faq: calculatorFaqs.BudgetCalculator,
          },
          {
            name: 'Emergency Fund Calculator',
            url: createPageUrl('EmergencyFundCalculator'),
            icon: Shield,
            status: 'active',
            description: 'Calculate ideal emergency fund size',
          },
          {
            name: 'Household Bills Splitter',
            url: createPageUrl('HouseholdBillsSplitter'),
            icon: Receipt,
            status: 'active',
            description: 'Split household bills between flatmates',
          },
        ],
      },
      {
        name: 'Savings & Goals',
        calculators: [
          {
            name: 'Savings Goal Calculator',
            url: createPageUrl('SavingsGoalCalculator'),
            icon: Target,
            status: 'active',
            description: 'Plan and track savings goals',
          },
          {
            name: 'ISA Calculator',
            url: createPageUrl('ISACalculator'),
            icon: PiggyBank,
            status: 'active',
            description: 'Calculate ISA contributions and growth',
          },
          {
            name: 'Rule of 72 Calculator',
            url: createPageUrl('RuleOf72Calculator'),
            icon: Calculator,
            status: 'active',
            description: 'Calculate investment doubling time',
          },
          {
            name: 'Net Worth Calculator',
            url: createPageUrl('NetWorthCalculator'),
            icon: Calculator,
            status: 'active',
            description: 'Calculate and track net worth',
          },
          {
            name: 'Future Value Calculator',
            url: createPageUrl('FutureValueCalculator'),
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate the future value of an investment or savings',
          },
        ],
      },
      {
        name: 'Cost Analysis',
        calculators: [
          {
            name: 'Cost of Living Explorer',
            url: createPageUrl('CostOfLiving'),
            icon: MapPin,
            status: 'active',
            description: 'Compare living costs across UK cities',
          },
          {
            name: 'Inflation Calculator',
            url: createPageUrl('InflationCalculator'),
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate inflation impact over time',
          },
          {
            name: 'Council Tax Calculator',
            url: createPageUrl('CouncilTaxCalculator'),
            icon: HomeIcon,
            status: 'active',
            description: 'Calculate council tax bands and rates',
          },
          {
            name: 'Commute Cost Calculator',
            url: createPageUrl('CommuteCostCalculator'),
            icon: Car,
            status: 'active',
            description: 'Calculate total commuting costs',
          },
          {
            name: 'Subscription Cost Calculator',
            url: createPageUrl('SubscriptionCostCalculator'),
            icon: Repeat,
            status: 'active',
            description: 'Track and manage subscription expenses',
          },
          {
            name: 'Car Cost Calculator',
            url: createPageUrl('CarCostCalculator'),
            icon: Car,
            status: 'active',
            description: 'Total cost of car ownership',
          },
          {
            name: 'Energy Bill Calculator',
            url: createPageUrl('EnergyBillCalculator'),
            icon: Zap,
            status: 'active',
            description: 'Calculate and compare energy costs',
          },
        ],
      },
    ],
  },

  {
    name: 'Debt & Loans',
    slug: 'debt-loans',
    icon: CreditCard,
    description: 'Debt repayment strategies, loan calculations, and credit management.',
    subCategories: [
      {
        name: 'Debt Repayment',
        calculators: [
          {
            name: 'Debt Repayment Calculator',
            url: createPageUrl('DebtCalculator'),
            icon: CreditCard,
            status: 'active',
            description: 'Plan debt payoff strategies',
          },
          {
            name: 'Credit Card Repayment Calculator',
            url: createPageUrl('CreditCardRepaymentCalculator'),
            icon: CreditCard,
            status: 'active',
            description: 'Calculate credit card payoff times',
          },
          {
            name: 'Debt-to-Income Ratio Calculator',
            url: createPageUrl('DebtToIncomeRatioCalculator'),
            icon: TrendingDown,
            status: 'active',
            description: 'Calculate debt-to-income ratio',
          },
        ],
      },
      {
        name: 'Student Finance',
        calculators: [
          {
            name: 'Student Loan Calculator',
            url: createPageUrl('StudentLoanCalculator'),
            icon: BookOpen,
            status: 'active',
            description: 'Calculate student loan repayments',
          },
          {
            name: 'Student Loan Repayment Calculator',
            url: createPageUrl('StudentLoanRepaymentCalculator'),
            icon: BookOpen,
            status: 'active',
            description: 'Detailed student loan repayment planning',
          },
        ],
      },
      {
        name: 'Personal & Other Loans',
        calculators: [
          {
            name: 'Personal Loan Calculator',
            url: createPageUrl('PersonalLoanCalculator'),
            icon: Banknote,
            status: 'active',
            description: 'Calculate personal loan repayments',
          },
          {
            name: 'Loan Repayment Calculator',
            url: createPageUrl('LoanRepaymentCalculator'),
            icon: Banknote,
            status: 'active',
            description: 'Simple loan repayment calculator',
          },
          {
            name: 'Car Loan Calculator',
            url: createPageUrl('CarLoanCalculator'),
            icon: Car,
            status: 'active',
            description: 'HP & PCP car finance payment calculator',
          },
          {
            name: 'Amortization Calculator',
            url: createPageUrl('AmortizationCalculator'),
            icon: FileSpreadsheet,
            status: 'active',
            description: 'Generate a full loan repayment schedule',
          },
          {
            name: 'Loan Comparison Calculator',
            url: createPageUrl('LoanComparisonCalculator'),
            icon: Repeat,
            status: 'active',
            description: 'Compare different loan offers side-by-side',
          },
        ],
      },
    ],
  },

  {
    name: 'Property & Mortgages',
    slug: 'property-mortgages',
    icon: HomeIcon,
    description: 'Mortgage calculations, property investment, and real estate planning.',
    subCategories: [
      {
        name: 'Mortgages & Affordability',
        calculators: [
          {
            name: 'Mortgage Calculator',
            page: 'MortgageCalculator',
            url: createPageUrl('MortgageCalculator'),
            icon: Building,
            status: 'active',
            description: 'Calculate mortgage payments and costs',
            faq: calculatorFaqs.MortgageCalculator,
          },
          {
            name: 'Mortgage Affordability Calculator',
            url: createPageUrl('MortgageAffordabilityCalculator'),
            icon: Building,
            status: 'active',
            description: 'Determine how much you can borrow',
          },
          {
            name: 'Remortgage Calculator',
            url: createPageUrl('RemortgageCalculator'),
            icon: Repeat,
            status: 'active',
            description: 'Calculate savings from switching deals',
          },
          {
            name: 'Home Equity Loan Calculator',
            url: createPageUrl('HomeEquityLoanCalculator'),
            icon: HomeIcon,
            status: 'active',
            description: 'Calculate how much equity you can borrow',
          },
          {
            name: 'Mortgage Repayment Calculator',
            url: createPageUrl('MortgageRepaymentCalculator'),
            icon: Calculator,
            status: 'active',
            description: 'Calculate mortgage repayment schedules',
          },
          {
            name: 'First-Time Buyer Calculator',
            url: createPageUrl('FirstTimeBuyerCalculator'),
            icon: HomeIcon,
            status: 'active',
            description: 'First-time buyer affordability and costs',
          },
        ],
      },
      {
        name: 'Property Investment',
        calculators: [
          {
            name: 'Rental Income Calculator',
            url: createPageUrl('RentalIncomeCalculator'),
            icon: Building,
            status: 'active',
            description: 'Calculate buy-to-let rental yields',
          },
          {
            name: 'Property Investment Calculator',
            url: createPageUrl('BRRRRCalculator'),
            icon: Repeat,
            status: 'active',
            description: 'BRRRR property investment strategy',
          },
          {
            name: 'Buy-to-Let Mortgage Calculator',
            url: createPageUrl('BuyToLetMortgageCalculator'),
            icon: Building,
            status: 'active',
            description: 'Analyse BTL mortgage costs & profit',
          },
          {
            name: 'Rental Yield Calculator',
            url: createPageUrl('RentalYieldCalculator'),
            icon: Building,
            status: 'active',
            description: 'Calculate the rental yield of a property investment',
          },
        ],
      },
      {
        name: 'Property Costs & Taxes',
        calculators: [
          {
            name: 'Stamp Duty Calculator',
            url: createPageUrl('StampDutyCalculator'),
            icon: Receipt,
            status: 'active',
            description: 'Calculate UK stamp duty costs',
          },
          {
            name: 'Rent vs Buy Calculator',
            url: createPageUrl('RentVsBuyCalculator'),
            icon: HomeIcon,
            status: 'active',
            description: 'Compare renting vs buying costs',
          },
        ],
      },
    ],
  },

  {
    name: 'Savings & Investments',
    slug: 'savings-investments',
    icon: TrendingUp,
    description: 'Investment planning, retirement savings, and wealth building calculators.',
    subCategories: [
      {
        name: 'Investment Growth',
        calculators: [
          {
            name: 'Investment Growth Calculator',
            url: createPageUrl('InvestmentCalculator'),
            icon: Briefcase,
            status: 'active',
            description: 'Project the future value of your portfolio',
          },
          {
            name: 'Compound Interest Calculator',
            url: createPageUrl('CompoundInterestCalculator'),
            icon: Percent,
            status: 'active',
            description: 'Calculate compound investment growth',
          },
          {
            name: 'Simple Interest Calculator',
            url: createPageUrl('SimpleInterestCalculator'),
            icon: Calculator,
            status: 'active',
            description: 'Calculate interest without compounding',
          },
          {
            name: 'Net Worth Calculator',
            url: createPageUrl('NetWorthCalculator'),
            icon: Calculator,
            status: 'active',
            description: 'Calculate and track net worth',
          },
          {
            name: 'Future Value Calculator',
            url: createPageUrl('FutureValueCalculator'),
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate the future value of an investment or savings',
          },
        ],
      },
      {
        name: 'Retirement Planning',
        calculators: [
          {
            name: 'Pension Calculator',
            url: createPageUrl('PensionCalculator'),
            icon: Shield,
            status: 'active',
            description: 'Calculate pension contributions and growth',
          },
          {
            name: 'Pension Contribution Calculator',
            url: createPageUrl('PensionContributionCalculator'),
            icon: PiggyBank,
            status: 'active',
            description: 'Optimize pension contributions',
          },
          {
            name: 'Retirement Savings Calculator',
            url: createPageUrl('RetirementSavingsCalculator'),
            icon: Target,
            status: 'active',
            description: 'Plan retirement savings needs',
          },
          {
            name: 'Annuity Calculator',
            url: createPageUrl('AnnuityCalculator'),
            icon: Banknote,
            status: 'active',
            description: 'Estimate income from an annuity',
          },
          {
            name: 'FIRE Calculator',
            url: createPageUrl('FIRECalculator'),
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate Financial Independence Retire Early',
          },
          // New calculator added here
          {
            name: 'Coast FIRE Calculator',
            url: createPageUrl('CoastFIRECalculator'),
            icon: Target,
            status: 'pending',
            description:
              'Calculate the minimum savings needed to stop contributing and still hit your retirement goal.',
          },
        ],
      },
    ],
  },

  {
    name: 'Business & Self-Employment',
    slug: 'business-self-employment',
    icon: Briefcase,
    description: 'Business planning, self-employment, and entrepreneurship calculators.',
    subCategories: [
      {
        name: 'Business Planning',
        calculators: [
          {
            name: 'Business Loan Calculator',
            url: createPageUrl('BusinessLoanCalculator'),
            icon: Banknote,
            status: 'active',
            description: 'Calculate business loan repayments',
          },
          {
            name: 'Break-Even Calculator',
            url: createPageUrl('BreakEvenCalculator'),
            icon: Target,
            status: 'active',
            description: 'Calculate business break-even point',
          },
        ],
      },
    ],
  },

  {
    name: 'Lifestyle & Planning',
    slug: 'lifestyle-planning',
    icon: Sparkles,
    description: 'Life event planning and lifestyle cost calculators.',
    subCategories: [
      {
        name: 'Life Events',
        calculators: [
          {
            name: 'Travel Budget Calculator',
            url: createPageUrl('TravelBudgetCalculator'),
            icon: MapPin,
            status: 'active',
            description: 'Plan holiday and travel costs',
          },
        ],
      },
      {
        name: 'Dreams & Goals',
        calculators: [
          {
            name: 'Dream Lifestyle Calculator',
            url: createPageUrl('DreamLifestyleCalculator'),
            icon: Sparkles,
            status: 'active',
            description: 'Calculate costs of your dream lifestyle',
          },
        ],
      },
    ],
  },

  {
    name: 'Utilities & Tools',
    slug: 'utilities-tools',
    icon: Calculator,
    description: 'Helpful financial utilities and conversion tools.',
    subCategories: [
      {
        name: 'Conversion Tools',
        calculators: [
          {
            name: 'Currency Converter',
            url: createPageUrl('CurrencyConverter'),
            icon: PoundSterling,
            status: 'active',
            description: 'Information hub for currency exchange rates',
          },
        ],
      },
      {
        name: 'Quick Tools',
        calculators: [
          {
            name: 'Tip Calculator',
            url: createPageUrl('TipCalculator'),
            icon: Calculator,
            status: 'active',
            description: 'UK-style tip calculator',
          },
        ],
      },
    ],
  },

  {
    name: 'Life & Events',
    slug: 'life-events',
    icon: Heart,
    description: 'Key financial calculations for major life milestones and changes.',
    subCategories: [
      {
        name: 'Major Life Events',
        calculators: [
          {
            name: 'Wedding Budget Calculator',
            url: createPageUrl('WeddingBudgetCalculator'),
            icon: Sparkles,
            status: 'active',
            description: 'Plan wedding costs and budget',
          },
          {
            name: 'Maternity Pay Calculator',
            url: createPageUrl('MaternityPayCalculator'),
            icon: Baby,
            status: 'active',
            description: 'Calculate statutory maternity pay',
          },
          {
            name: 'Childcare Cost Calculator',
            url: createPageUrl('ChildcareCostCalculator'),
            icon: Baby,
            status: 'active',
            description: 'Calculate childcare expenses',
          },
          {
            name: 'Statutory Sick Pay Calculator',
            url: createPageUrl('StatutorySickPayCalculator'),
            icon: Shield,
            status: 'active',
            description: 'Calculate UK statutory sick pay',
          },
          {
            name: 'Redundancy Pay Calculator',
            url: createPageUrl('RedundancyPayCalculator'),
            icon: Briefcase,
            status: 'active',
            description: 'Calculate statutory redundancy payments',
          },
          {
            name: 'Inheritance Tax Calculator',
            url: createPageUrl('InheritanceTaxCalculator'),
            icon: Shield,
            status: 'active',
            description: 'Calculate UK inheritance tax liability',
          },
        ],
      },
    ],
  },
];

// --- HELPER FUNCTIONS FOR EXPORT ---

/**
 * A flat list of all calculators, extracted from the nested categories.
 * This is used internally by the other helper functions.
 */
export const allCalculators = calculatorCategories.flatMap((category) =>
  category.subCategories.flatMap((subCategory) => subCategory.calculators)
);

/**
 * Returns the total number of calculators available on the site.
 * This is the function that was missing and causing the build error in Home.jsx.
 */
export const getCalculatorStats = () => {
  const total = allCalculators.length;
  const active = allCalculators.filter((c) => c.status === 'active').length;
  const pending = allCalculators.filter((c) => c.status !== 'active').length;
  return { total, active, pending };
};

/**
 * Returns all calculators grouped by their status (e.g., 'active', 'pending').
 */
export const getCalculatorsByStatus = (status) => {
  return allCalculators.filter((calc) => calc.status === status);
};

/**
 * Returns the full nested structure of calculators, useful for site navigation.
 */
export const getAllCalculators = () => {
  return calculatorCategories;
};

/**
 * Simple utility to search all calculators by name or description.
 */
export const searchCalculators = (query) => {
  const lowerQuery = query.toLowerCase();
  return allCalculators.filter(
    (calc) =>
      calc.name.toLowerCase().includes(lowerQuery) ||
      calc.description.toLowerCase().includes(lowerQuery)
  );
};
// DEV validation – logs any problems once at startup
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const problems = [];

  const checkCalc = (calc, path) => {
    if (!calc) return;
    if (typeof calc.name !== 'string' || !calc.name.trim()) {
      problems.push(`${path}: missing/invalid name`);
    }
    if (typeof calc.url !== 'string' || !calc.url.startsWith('/')) {
      problems.push(`${path}: missing/invalid url -> ${String(calc.url)}`);
    }
    if (typeof calc.description !== 'string') {
      problems.push(`${path}: missing/invalid description`);
    }
  };

  calculatorCategories.forEach((cat, iCat) => {
    (cat?.subCategories || []).forEach((sub, iSub) => {
      (sub?.calculators || []).forEach((calc, iCalc) => {
        checkCalc(
          calc,
          `categories[${iCat}].subCategories[${iSub}].calculators[${iCalc}] (${calc?.name || '?'})`
        );
      });
    });
  });

  if (problems.length) {
    console.group('%cCalculator config issues', 'color:crimson;font-weight:bold;');
    problems.forEach((p) => console.error(p));
    console.groupEnd();
  }
}
