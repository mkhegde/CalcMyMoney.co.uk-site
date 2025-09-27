import { createPageUrl } from '@/utils';
import {
  HandCoins,
  Briefcase,
  PiggyBank,
  TrendingUp,
  Home as HomeIcon,
  Sparkles,
  CreditCard,
  Building,
  Calculator,
  Percent,
  User,
  Shield,
  PoundSterling,
  FileText,
  MapPin,
  Car,
  Baby,
  Repeat,
  Zap,
  Receipt,
  Calendar,
  Target,
  BookOpen,
  Banknote,
  Building2,
  TrendingDown,
  FileSpreadsheet, // Added for Amortization Calculator
  Heart, // Added for Life & Events category
} from 'lucide-react';

// Comprehensive calculator configuration for the UK Financial Calculator Hub
// Organized following the calculators.net model: Major Categories > Sub-Categories > Individual Calculators

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
            url: createPageUrl('salary-calculator-uk'), // Changed from 'SalaryCalculatorUK'
            icon: PoundSterling,
            status: 'active',
            description: 'Calculate take-home pay from gross salary',
          },
          {
            name: 'PAYE Calculator',
            url: createPageUrl('paye-calculator'), // Confirmed working
            icon: Calculator,
            status: 'active',
            description: 'UK PAYE tax and NI calculator',
          },
          {
            name: 'Pro Rata Salary Calculator',
            url: createPageUrl('pro-rata-salary-calculator'), // Changed from 'ProRataSalaryCalculator'
            icon: Percent,
            status: 'active',
            description: 'Calculate part-time or pro-rata salary',
          },
          {
            name: 'Hourly to Annual Salary Calculator',
            url: createPageUrl('hourly-to-annual-salary-calculator'), // Changed from 'HourlyToAnnualSalaryCalculator'
            icon: Calculator,
            status: 'active',
            description: 'Convert hourly rates to annual salary',
          },
          {
            name: 'Minimum Wage Calculator',
            url: createPageUrl('minimum-wage-calculator'), // Changed from 'MinimumWageCalculator'
            icon: PoundSterling,
            status: 'active',
            description: 'Check UK minimum wage rates and calculations',
          },
          {
            name: 'Freelancer Day Rate Calculator',
            url: createPageUrl('freelancer-day-rate-calculator'), // Changed from 'FreelancerDayRateCalculator'
            icon: Briefcase,
            status: 'active',
            description: 'Calculate optimal day rates for freelancers',
          },
          {
            name: 'Salary Increase Calculator',
            url: createPageUrl('salary-increase-calculator'), // Changed from 'SalaryIncreaseCalculator'
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate your new salary after a pay rise',
          },
          {
            name: 'Commission Calculator',
            url: createPageUrl('commission-calculator'), // Changed from 'CommissionCalculator'
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
            url: createPageUrl('overtime-bonus-calculator'), // Changed from 'OvertimeBonusCalculator'
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate overtime pay and bonus amounts',
          },
          {
            name: 'Overtime Pay Calculator',
            url: createPageUrl('overtime-pay-calculator'), // Changed from 'OvertimePayCalculator'
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate overtime earnings',
          },
          {
            name: 'Overtime Rate Calculator',
            url: createPageUrl('overtime-rate-calculator'), // Changed from 'OvertimeRateCalculator'
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
            url: createPageUrl('holiday-pay-calculator'), // Changed from 'HolidayPayCalculator'
            icon: Calendar,
            status: 'active',
            description: 'Calculate UK statutory holiday pay',
          }, // Maternity Pay Calculator moved to Life & Events
          // Statutory Sick Pay Calculator moved to Life & Events
          // Redundancy Pay Calculator moved to Life & Events
          {
            name: 'Severance Pay Calculator',
            url: createPageUrl('severance-pay-calculator'), // Changed from 'SeverancePayCalculator'
            icon: FileText,
            status: 'active',
            description: 'Calculate severance package amounts',
          },
          {
            name: 'Child Benefit Calculator',
            url: createPageUrl('child-benefit-calculator'), // Changed from 'ChildBenefitCalculator'
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
            url: createPageUrl('contractor-calculator'), // Changed from 'ContractorCalculator'
            icon: Briefcase,
            status: 'active',
            description: 'IR35 and contractor tax calculations',
          },
          {
            name: 'Salary Sacrifice Calculator',
            url: createPageUrl('salary-sacrifice-calculator'), // Changed from 'SalarySacrificeCalculator'
            icon: PiggyBank,
            status: 'active',
            description: 'Calculate salary sacrifice benefits',
          },
          {
            name: 'Payroll Calculator',
            url: createPageUrl('payroll-calculator'), // Changed from 'PayrollCalculator'
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
            url: createPageUrl('income-tax-calculator'), // Changed from 'IncomeTaxCalculator'
            icon: User,
            status: 'active',
            description: 'Calculate UK income tax liability',
          },
          {
            name: 'National Insurance Calculator',
            url: createPageUrl('national-insurance-calculator'), // Changed from 'NationalInsuranceCalculator'
            icon: Shield,
            status: 'active',
            description: 'Calculate National Insurance contributions',
          },
          {
            name: 'Effective Tax Rate Calculator',
            url: createPageUrl('effective-tax-rate-calculator'), // Changed from 'EffectiveTaxRateCalculator'
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
            url: createPageUrl('capital-gains-tax-calculator'), // Changed from 'CapitalGainsTaxCalculator'
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate CGT on investments and assets',
          },
          {
            name: 'Dividend Tax Calculator',
            url: createPageUrl('dividend-tax-calculator'), // Changed from 'DividendTaxCalculator'
            icon: PoundSterling,
            status: 'active',
            description: 'Calculate tax on dividend income',
          }, // Inheritance Tax Calculator moved to Life & Events
        ],
      },
      {
        name: 'Business & VAT',
        calculators: [
          {
            name: 'VAT Calculator',
            url: createPageUrl('vat-calculator'), // Changed from 'VATCalculator'
            icon: Percent,
            status: 'active',
            description: 'Calculate UK VAT amounts and rates',
          },
          {
            name: 'Corporation Tax Calculator',
            url: createPageUrl('corporation-tax-calculator'), // Changed from 'CorporationTaxCalculator'
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
            url: createPageUrl('budget-planner'), // Changed from 'BudgetCalculator'
            icon: PiggyBank,
            status: 'active',
            description: 'Create and track your monthly budget',
          },
          {
            name: 'Emergency Fund Calculator',
            url: createPageUrl('emergency-fund-calculator'), // Changed from 'EmergencyFundCalculator'
            icon: Shield,
            status: 'active',
            description: 'Calculate ideal emergency fund size',
          },
          {
            name: 'Household Bills Splitter',
            url: createPageUrl('household-bills-splitter'), // Changed from 'HouseholdBillsSplitter'
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
            url: createPageUrl('savings-goal-calculator'), // Changed from 'SavingsGoalCalculator'
            icon: Target,
            status: 'active',
            description: 'Plan and track savings goals',
          },
          {
            name: 'ISA Calculator',
            url: createPageUrl('isa-calculator'), // Changed from 'ISACalculator'
            icon: PiggyBank,
            status: 'active',
            description: 'Calculate ISA contributions and growth',
          },
          {
            name: 'Rule of 72 Calculator',
            url: createPageUrl('rule-of-72-calculator'), // Changed from 'RuleOf72Calculator'
            icon: Calculator,
            status: 'active',
            description: 'Calculate investment doubling time',
          },
        ],
      },
      {
        name: 'Cost Analysis',
        calculators: [
          {
            name: 'Cost of Living Explorer',
            url: createPageUrl('cost-of-living'), // Changed from 'CostOfLiving'
            icon: MapPin,
            status: 'active',
            description: 'Compare living costs across UK cities',
          },
          {
            name: 'Inflation Calculator',
            url: createPageUrl('inflation-calculator'), // Changed from 'InflationCalculator'
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate inflation impact over time',
          },
          {
            name: 'Council Tax Calculator',
            url: createPageUrl('council-tax-calculator'), // Changed from 'CouncilTaxCalculator'
            icon: HomeIcon,
            status: 'active',
            description: 'Calculate council tax bands and rates',
          },
          {
            name: 'Commute Cost Calculator',
            url: createPageUrl('commute-cost-calculator'), // Changed from 'CommuteCostCalculator'
            icon: Car,
            status: 'active',
            description: 'Calculate total commuting costs',
          },
          {
            name: 'Subscription Cost Calculator',
            url: createPageUrl('subscription-cost-calculator'), // Changed from 'SubscriptionCostCalculator'
            icon: Repeat,
            status: 'active',
            description: 'Track and manage subscription expenses',
          },
          {
            name: 'Car Cost Calculator',
            url: createPageUrl('car-cost-calculator'), // Changed from 'CarCostCalculator'
            icon: Car,
            status: 'active',
            description: 'Total cost of car ownership',
          },
          {
            name: 'Energy Bill Calculator',
            url: createPageUrl('energy-bill-calculator'), // Changed from 'EnergyBillCalculator'
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
            url: createPageUrl('debt-repayment-calculator'), // Changed from 'DebtCalculator'
            icon: CreditCard,
            status: 'active',
            description: 'Plan debt payoff strategies',
          },
          {
            name: 'Credit Card Repayment Calculator',
            url: createPageUrl('credit-card-repayment-calculator'), // Changed from 'CreditCardRepaymentCalculator'
            icon: CreditCard,
            status: 'active',
            description: 'Calculate credit card payoff times',
          },
          {
            name: 'Debt-to-Income Ratio Calculator',
            url: createPageUrl('debt-to-income-ratio-calculator'), // Changed from 'DebtToIncomeRatioCalculator'
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
            url: createPageUrl('student-loan-calculator'), // Changed from 'StudentLoanCalculator'
            icon: BookOpen,
            status: 'active',
            description: 'Calculate student loan repayments',
          },
          {
            name: 'Student Loan Repayment Calculator',
            url: createPageUrl('student-loan-repayment-calculator'), // Changed from 'StudentLoanRepaymentCalculator'
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
            url: createPageUrl('personal-loan-calculator'), // Changed from 'PersonalLoanCalculator'
            icon: Banknote,
            status: 'active',
            description: 'Calculate personal loan repayments',
          },
          {
            name: 'Loan Repayment Calculator',
            url: createPageUrl('loan-repayment-calculator'), // Changed from 'LoanRepaymentCalculator'
            icon: Banknote,
            status: 'active',
            description: 'Simple loan repayment calculator',
          },
          {
            name: 'Car Loan Calculator',
            url: createPageUrl('car-loan-calculator'), // Changed from 'CarLoanCalculator'
            icon: Car,
            status: 'active',
            description: 'HP & PCP car finance payment calculator',
          },
          {
            name: 'Amortization Calculator',
            url: createPageUrl('amortization-calculator'), // Changed from 'AmortizationCalculator'
            icon: FileSpreadsheet,
            status: 'active',
            description: 'Generate a full loan repayment schedule',
          },
          {
            name: 'Loan Comparison Calculator',
            url: createPageUrl('loan-comparison-calculator'), // Changed from 'LoanComparisonCalculator'
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
            url: createPageUrl('mortgage-calculator'), // Changed from 'MortgageCalculator'
            icon: Building,
            status: 'active',
            description: 'Calculate mortgage payments and costs',
          },
          {
            name: 'Mortgage Affordability Calculator',
            url: createPageUrl('mortgage-affordability-calculator'), // Changed from 'MortgageAffordabilityCalculator'
            icon: Building,
            status: 'active',
            description: 'Determine how much you can borrow',
          },
          {
            name: 'Remortgage Calculator',
            url: createPageUrl('remortgage-calculator'), // Changed from 'RemortgageCalculator'
            icon: Repeat,
            status: 'active',
            description: 'Calculate savings from switching deals',
          },
          {
            name: 'Home Equity Loan Calculator',
            url: createPageUrl('home-equity-loan-calculator'), // Changed from 'HomeEquityLoanCalculator'
            icon: HomeIcon,
            status: 'active',
            description: 'Calculate how much equity you can borrow',
          },
          {
            name: 'Mortgage Repayment Calculator',
            url: createPageUrl('mortgage-repayment-calculator'), // Changed from 'MortgageRepaymentCalculator'
            icon: Calculator,
            status: 'active',
            description: 'Calculate mortgage repayment schedules',
          },
          {
            name: 'First-Time Buyer Calculator',
            url: createPageUrl('first-time-buyer-calculator'), // Changed from 'FirstTimeBuyerCalculator'
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
            url: createPageUrl('rental-income-calculator'), // Changed from 'RentalIncomeCalculator'
            icon: Building,
            status: 'active',
            description: 'Calculate buy-to-let rental yields',
          },
          {
            name: 'Property Investment Calculator',
            url: createPageUrl('brrrr-calculator'), // Changed from 'BRRRRCalculator'
            icon: Repeat,
            status: 'active',
            description: 'BRRRR property investment strategy',
          },
          {
            name: 'Buy-to-Let Mortgage Calculator',
            url: createPageUrl('buy-to-let-mortgage-calculator'), // Changed from 'BuyToLetMortgageCalculator'
            icon: Building,
            status: 'active',
            description: 'Analyse BTL mortgage costs & profit',
          },
          {
            name: 'Rental Yield Calculator',
            url: createPageUrl('rental-income-calculator'), // Changed from 'RentalYieldCalculator'
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
            url: createPageUrl('stamp-duty-calculator'), // Changed from 'StampDutyCalculator'
            icon: Receipt,
            status: 'active',
            description: 'Calculate UK stamp duty costs',
          },
          {
            name: 'Rent vs Buy Calculator',
            url: createPageUrl('rent-vs-buy-calculator'), // Changed from 'RentVsBuyCalculator'
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
            url: createPageUrl('investment-calculator'), // Changed from 'InvestmentCalculator'
            icon: Briefcase,
            status: 'active',
            description: 'Project the future value of your portfolio',
          },
          {
            name: 'Compound Interest Calculator',
            url: createPageUrl('compound-interest-calculator'), // Changed from 'CompoundInterestCalculator'
            icon: Percent,
            status: 'active',
            description: 'Calculate compound investment growth',
          },
          {
            name: 'Simple Interest Calculator',
            url: createPageUrl('simple-interest-calculator'), // Changed from 'SimpleInterestCalculator'
            icon: Calculator,
            status: 'active',
            description: 'Calculate interest without compounding',
          },
          {
            name: 'Net Worth Calculator',
            url: createPageUrl('net-worth-calculator'), // Changed from 'NetWorthCalculator'
            icon: Calculator,
            status: 'active',
            description: 'Calculate and track net worth',
          },
          {
            name: 'Future Value Calculator',
            url: createPageUrl('future-value-calculator'), // Changed from 'FutureValueCalculator'
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
            url: createPageUrl('pension-calculator'), // Changed from 'PensionCalculator'
            icon: Shield,
            status: 'active',
            description: 'Calculate pension contributions and growth',
          },
          {
            name: 'Pension Contribution Calculator',
            url: createPageUrl('pension-contribution-calculator'), // Changed from 'PensionContributionCalculator'
            icon: PiggyBank,
            status: 'active',
            description: 'Optimize pension contributions',
          },
          {
            name: 'Retirement Savings Calculator',
            url: createPageUrl('retirement-savings-calculator'), // Changed from 'RetirementSavingsCalculator'
            icon: Target,
            status: 'active',
            description: 'Plan retirement savings needs',
          },
          {
            name: 'Annuity Calculator',
            url: createPageUrl('annuity-calculator'), // Changed from 'AnnuityCalculator'
            icon: Banknote,
            status: 'active',
            description: 'Estimate income from an annuity',
          },
          {
            name: 'FIRE Calculator',
            url: createPageUrl('fire-calculator'), // Changed from 'FIRECalculator'
            icon: TrendingUp,
            status: 'active',
            description: 'Calculate Financial Independence Retire Early',
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
            url: createPageUrl('business-loan-calculator'), // Changed from 'BusinessLoanCalculator'
            icon: Banknote,
            status: 'active',
            description: 'Calculate business loan repayments',
          },
          {
            name: 'Break-Even Calculator',
            url: createPageUrl('break-even-calculator'), // Changed from 'BreakEvenCalculator'
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
          // Wedding Budget Calculator moved to Life & Events
          {
            name: 'Travel Budget Calculator',
            url: createPageUrl('travel-budget-calculator'), // Changed from 'TravelBudgetCalculator'
            icon: MapPin,
            status: 'active',
            description: 'Plan holiday and travel costs',
          }, // Childcare Cost Calculator moved to Life & Events
        ],
      },
      {
        name: 'Dreams & Goals',
        calculators: [
          {
            name: 'Dream Lifestyle Calculator',
            url: createPageUrl('dream-lifestyle-calculator'), // Changed from 'DreamLifestyleCalculator'
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
            url: createPageUrl('currency-converter'), // Changed from 'CurrencyConverter'
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
            url: createPageUrl('tip-calculator'), // Changed from 'TipCalculator'
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
            url: createPageUrl('wedding-budget-calculator'), // Changed from 'WeddingBudgetCalculator'
            icon: Sparkles,
            status: 'active',
            description: 'Plan wedding costs and budget',
          },
          {
            name: 'Maternity Pay Calculator',
            url: createPageUrl('maternity-pay-calculator'), // Changed from 'MaternityPayCalculator'
            icon: Baby,
            status: 'active',
            description: 'Calculate statutory maternity pay',
          },
          {
            name: 'Childcare Cost Calculator',
            url: createPageUrl('childcare-cost-calculator'), // Changed from 'ChildcareCostCalculator'
            icon: Baby,
            status: 'active',
            description: 'Calculate childcare expenses',
          },
          {
            name: 'Statutory Sick Pay Calculator',
            url: createPageUrl('statutory-sick-pay-calculator'), // Changed from 'StatutorySickPayCalculator'
            icon: Shield,
            status: 'active',
            description: 'Calculate UK statutory sick pay',
          },
          {
            name: 'Redundancy Pay Calculator',
            url: createPageUrl('redundancy-pay-calculator'), // Changed from 'RedundancyPayCalculator'
            icon: Briefcase,
            status: 'active',
            description: 'Calculate statutory redundancy payments',
          },
          {
            name: 'Inheritance Tax Calculator',
            url: createPageUrl('inheritance-tax-calculator'), // Changed from 'InheritanceTaxCalculator'
            icon: Shield,
            status: 'active',
            description: 'Calculate UK inheritance tax liability',
          },
        ],
      },
    ],
  },
];
// Helper functions for working with calculator data
export const getAllCalculators = () => {
  const allCalculators = [];
  calculatorCategories.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
      subCategory.calculators.forEach((calculator) => {
        allCalculators.push({
          ...calculator,
          category: category.name,
          subCategory: subCategory.name,
          categorySlug: category.slug,
        });
      });
    });
  });
  return allCalculators;
};

export const getCalculatorsByStatus = (status) => {
  return getAllCalculators().filter((calc) => calc.status === status);
};

export const getCalculatorsByCategory = (categorySlug) => {
  const category = calculatorCategories.find((cat) => cat.slug === categorySlug);
  return category ? category : null;
};

export const searchCalculators = (query) => {
  const allCalculators = getAllCalculators();
  const searchTerm = query.toLowerCase();
  return allCalculators.filter(
    (calc) =>
      calc.name.toLowerCase().includes(searchTerm) ||
      calc.description.toLowerCase().includes(searchTerm) ||
      calc.category.toLowerCase().includes(searchTerm) ||
      calc.subCategory.toLowerCase().includes(searchTerm)
  );
};

// Statistics for the platform
export const getCalculatorStats = () => {
  const all = getAllCalculators();
  return {
    total: all.length,
    active: all.filter((calc) => calc.status === 'active').length,
    planned: all.filter((calc) => calc.status === 'planned').length,
    categories: calculatorCategories.length,
    subCategories: calculatorCategories.reduce((sum, cat) => sum + cat.subCategories.length, 0),
  };
};
