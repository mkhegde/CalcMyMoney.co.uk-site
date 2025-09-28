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
          }, // Maternity Pay Calculator moved to Life & Events
          // Statutory Sick Pay Calculator moved to Life & Events
          // Redundancy Pay Calculator moved to Life & Events
          {
            name: 'Severance Pay Calculator',
            url: createPageUrl('SeverancePayCalculator'),
            icon: FileText,
            status: 'active',
            description: 'Calculate severance package amounts',
          },
          {
            name: 'Child Benefit Calculator',
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
            url: createPageUrl('IncomeTaxCalculator'),
            icon: User,
            status: 'active',
            description: 'Calculate UK income tax liability',
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
          }, // Inheritance Tax Calculator moved to Life & Events
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
            url: createPageUrl('BudgetCalculator'),
            icon: PiggyBank,
            status: 'active',
            description: 'Create and track your monthly budget',
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
            url: createPageUrl('MortgageCalculator'),
            icon: Building,
            status: 'active',
            description: 'Calculate mortgage payments and costs',
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
          // Wedding Budget Calculator moved to Life & Events
          {
            name: 'Travel Budget Calculator',
            url: createPageUrl('TravelBudgetCalculator'),
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
