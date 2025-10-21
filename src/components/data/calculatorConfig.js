import { createPageUrl } from '../../utils/createPageUrl.js';
import {
  Calculator as CalculatorIcon,
  Home,
  Coins,
  PiggyBank,
  FileText,
  Briefcase,
  LineChart,
  Zap,
  Users,
  CreditCard,
  Wallet,
} from 'lucide-react';

const MAPPED_KEYWORDS = {
  'Loan Comparison Calculator': [
    'loan comparison calculator',
    'personal loan comparison calculator',
  ],
  'Loan Repayment Calculator': [
    'loan repayment calculator',
    'loan calculator',
    'personal loan calculator',
    'calculate loan payment',
    'loan payment calculator',
    'calculate loan',
    'loan',
    'loan payment',
    'loan payoff calculator',
    'loan payment schedule calculator',
    'loan calculator with extra payments',
    'loan repayment',
    'loan calculator monthly payments',
  ],
  'Mortgage Affordability Calculator': [
    'mortgage affordability calculator',
    'how much mortgage can i afford',
    'mortgage affordability',
  ],
  'Mortgage Calculator': [
    'mortgage calculator',
    'mortgage calculator uk',
    'mortgage loan calculator',
    'mortgage payment calculator',
    'home loan calculator',
    'home mortgage calculator',
    'mortgage',
    'mortgage calculator monthly payments',
    'mortgage interest calculator',
    'mortgage interest',
    'calculate mortgage payment',
    'home loan',
    'loan mortgage calculator',
  ],
  'Mortgage Comparison Calculator': ['mortgage comparison calculator', 'compare mortgage rates'],
  'Mortgage Repayment Calculator': [
    'mortgage repayment calculator',
    'home loan repayment calculator',
  ],
  'Net Income UK Calculator': ['net income uk calculator'],
  'Net Worth Calculator': ['net worth calculator', 'how to calculate net worth'],
  'NI Calculator': ['ni calculator', 'national insurance calculator'],
  'Overtime & Bonus Calculator': ['overtime and bonus calculator'],
  'Overtime Pay Calculator': ['overtime pay calculator'],
  'Overtime Rate Calculator': ['overtime rate calculator'],
  'PAYE Calculator': ['paye calculator'],
  'Pension Calculator': [
    'pension calculator',
    'uk pension calculator',
    'private pension calculator',
    'state pension calculator',
    'workplace pension calculator',
  ],
  'Pension Contribution Calculator': [
    'pension contribution calculator',
    'pension contributions calculator',
    'contribution calculator',
  ],
  'Personal Loan Calculator': ['personal loan calculator', 'best personal loan calculator'],
  'Pro Rata Salary Calculator': ['pro rata salary calculator'],
  'Property Flipping Calculator': [
    'property flipping calculator',
    'flip calculator',
    'property renovation calculator',
  ],
  'Property Tax Calculator': [
    'property tax calculator',
    'uk property tax calculator',
    'property tax rates uk',
  ],
  'Redundancy Pay Calculator': ['redundancy pay calculator'],
  'Remortgage Calculator': ['remortgage calculator'],
  'Rental Income Calculator': ['rental income calculator', 'rental income tax calculator'],
  'Rental Yield Calculator': ['rental yield calculator', 'rental yield'],
  'Rent to Buy Calculator': ['rent to buy calculator', 'rent to buy scheme calculator'],
  'Rent vs Buy Calculator': ['rent vs buy calculator', 'rent or buy calculator'],
  'Retirement Calculator': [
    'retirement calculator',
    'retirement income calculator',
    'retirement planning calculator',
  ],
  'Retirement Savings Calculator': ['retirement savings calculator'],
  'Reverse Mortgage Calculator': [
    'reverse mortgage calculator',
    'equity release calculator',
    'lifetime mortgage calculator',
  ],
  'ROI Calculator': [
    'roi calculator',
    'return on investment calculator',
    'investment roi calculator',
    'cagr calculator',
  ],
  'Rule of 72 Calculator': ['rule of 72 calculator'],
  'Salary Calculator': [
    'salary calculator',
    'gross salary calculator',
    'monthly salary calculator',
    'annual salary calculator',
    'yearly salary calculator',
    'hourly salary calculator',
    'weekly salary calculator',
    'daily salary calculator',
  ],
  'Salary Increase Calculator': ['salary increase calculator'],
  'Salary Sacrifice Calculator': ['salary sacrifice calculator'],
  'Savings Calculator': [
    'savings calculator',
    'savings interest calculator',
    'savings planner',
    'savings account calculator',
  ],
  'Savings Goal Calculator': [
    'savings goal calculator',
    'savings calculator',
    'savings planner',
    'savings',
  ],
  'Severance Pay Calculator': ['severance pay calculator'],
  'Self Assessment Calculator': [
    'self assessment calculator',
    'self assessment tax calculator',
    'hmrc self assessment calculator',
  ],
  'Simple Interest Calculator': ['simple interest calculator', 'simple interest'],
  'Stamp Duty Calculator': [
    'stamp duty calculator',
    'stamp duty rates',
    'stamp duty',
    'stamp duty land tax calculator',
    'sdlt calculator',
  ],
  'Statutory Maternity Pay Calculator': ['statutory maternity pay calculator', 'smp calculator'],
  'Statutory Sick Pay Calculator': ['statutory sick pay calculator', 'ssp calculator'],
  'Student Loan Calculator': ['student loan calculator'],
  'Student Loan Repayment Calculator': ['student loan repayment calculator'],
  'Subscription Cost Calculator': ['subscription cost calculator'],
  'Take-Home Pay Calculator': [
    'take home pay calculator',
    'salary take home pay calculator',
    'take home pay',
    'salary after tax calculator',
    'after tax income calculator',
    'take home pay calculator 2024',
    'salary take home',
    'calculate take home pay',
  ],
  'Tax After Tax Calculator': ['tax after tax calculator'],
  'Tax and NI Calculator': ['tax and ni calculator', 'tax and national insurance calculator'],
  'Travel Budget Calculator': ['travel budget calculator'],
  'VAT Calculator': ['vat calculator', 'vat reverse charge calculator'],
  'Wedding Budget Calculator': ['wedding budget calculator'],
};

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const createCalculatorEntry = (name, pageName, description, keywords = [], options = {}) => {
  const baseKeywords = [...(MAPPED_KEYWORDS[name] || []), ...keywords];
  const entry = {
    name,
    pageName,
    description,
    icon: options.icon || CalculatorIcon,
    status: options.status || 'active',
    tags: Array.isArray(options.tags) ? options.tags : [],
    keywords: baseKeywords,
    url: options.url || createPageUrl(pageName),
  };

  if (options.page) {
    entry.page = options.page;
  }

  return entry;
};

const rawCategories = [
  {
    name: 'Mortgages & Property',
    description:
      'Planning tools for buyers, landlords, and homeowners managing property decisions.',
    icon: Home,
    calculators: [
      createCalculatorEntry(
        'Mortgage Repayment Calculator',
        'MortgageRepaymentCalculator',
        'Use our UK mortgage repayment calculator to plan your mortgage allocation, test repayment scenarios, and understand how overpayments change the mortgage repayment schedule.',
        MAPPED_KEYWORDS['Mortgage Repayment Calculator']
      ),
      createCalculatorEntry(
        'Mortgage Comparison Calculator',
        'MortgageComparisonCalculator',
        'Use our UK mortgage comparison calculator to compare mortgage rates, view repayments side by side, and see the total cost of two mortgage deals before you decide.',
        MAPPED_KEYWORDS['Mortgage Comparison Calculator']
      ),
      createCalculatorEntry(
        'Mortgage Affordability Calculator',
        'MortgageAffordabilityCalculator',
        'Use our UK mortgage affordability calculator to see how much mortgage you can afford, balance mortgage affordability against debts, and plan your deposit strategy.',
        MAPPED_KEYWORDS['Mortgage Affordability Calculator']
      ),
      createCalculatorEntry(
        'Mortgage Calculator',
        'MortgageCalculator',
        'Use our UK mortgage calculator to estimate monthly repayments, total interest, and amortisation schedule. Plan your home loan with confidence.',
        MAPPED_KEYWORDS['Mortgage Calculator']
      ),
      createCalculatorEntry(
        'Remortgage Calculator',
        'RemortgageCalculator',
        'Compare remortgage deals and estimate potential monthly and lifetime savings.',
        MAPPED_KEYWORDS['Remortgage Calculator'],
        {
          url: '/calculators/remortgage-calculator',
          page: 'calculators/remortgage-calculator',
        }
      ),
      createCalculatorEntry(
        'Stamp Duty Calculator',
        'StampDutyCalculator',
        'Work out stamp duty obligations for first homes, second homes, and investment properties.',
        MAPPED_KEYWORDS['Stamp Duty Calculator'],
        {
          url: '/calculators/sdlt-calculator',
          page: 'calculators/sdlt-calculator',
        }
      ),
      createCalculatorEntry(
        'Rental Yield Calculator',
        'RentalYieldCalculator',
        'Calculate gross and net rental yields to benchmark investment properties.',
        MAPPED_KEYWORDS['Rental Yield Calculator'],
        {
          url: '/calculators/rental-yield-calculator',
          page: 'calculators/rental-yield-calculator',
        }
      ),
      createCalculatorEntry(
        'Property Flipping Calculator',
        'PropertyFlippingCalculator',
        'Forecast purchase costs, renovation spend, holding costs, and projected sale profit for UK property flips.',
        MAPPED_KEYWORDS['Property Flipping Calculator'],
        {
          url: '/calculators/property-flipping-calculator',
          page: 'calculators/property-flipping-calculator',
        }
      ),
      createCalculatorEntry(
        'Buy-to-Let Profit Calculator',
        'BuyToLetProfitCalculator',
        'Assess rental income, costs, and yields for prospective buy-to-let investments.'
      ),
      createCalculatorEntry(
        'Help to Buy Equity Loan Calculator',
        'HelpToBuyEquityLoanCalculator',
        'Project repayments and equity share changes for Help to Buy equity loans.'
      ),
      createCalculatorEntry(
        'First-Time Buyer Affordability Calculator',
        'FirstTimeBuyerAffordabilityCalculator',
        'Check how much you can borrow and the deposit needed as a first-time buyer.'
      ),
      createCalculatorEntry(
        'Down Payment Calculator',
        'DownPaymentCalculator',
        'Plan your house deposit by combining savings contributions, investment growth, and moving costs.'
      ),
      createCalculatorEntry(
        'Shared Ownership Rent Calculator',
        'SharedOwnershipRentCalculator',
        'Calculate rent, mortgage, and service charge costs for shared ownership homes.'
      ),
      createCalculatorEntry(
        'Mortgage Overpayment Impact Calculator',
        'MortgageOverpaymentImpactCalculator',
        'Evaluate how regular or one-off overpayments shorten your mortgage term.'
      ),
      createCalculatorEntry(
        'Rent to Buy Calculator',
        'RentToBuyCalculator',
        'Project rent credits, deposit growth, and completion affordability for UK rent to buy agreements.',
        MAPPED_KEYWORDS['Rent to Buy Calculator'],
        {
          url: '/calculators/rent-to-buy-calculator',
          page: 'calculators/rent-to-buy-calculator',
        }
      ),
      createCalculatorEntry(
        'Rent vs Buy Calculator',
        'RentVsBuyCalculator',
        'Compare lifetime renting versus owning costs including deposits, mortgages, and opportunity cost.',
        MAPPED_KEYWORDS['Rent vs Buy Calculator'],
        {
          url: '/calculators/rent-vs-buy-calculator',
          page: 'calculators/rent-vs-buy-calculator',
        }
      ),
      createCalculatorEntry(
        'House Price Growth Forecast Calculator',
        'HousePriceGrowthForecastCalculator',
        'Forecast potential property value changes using historic growth trends.'
      ),
      createCalculatorEntry(
        'Landlord Yield Calculator',
        'LandlordYieldCalculator',
        'Calculate gross and net rental yields to benchmark investment properties.'
      ),
      createCalculatorEntry(
        'BRRRR Calculator',
        'BrrrrCalculator',
        'Plan buy, refurbish, rent, refinance strategies with UK rental and refinance assumptions.'
      ),
      createCalculatorEntry(
        'Buy-to-Let Mortgage Calculator',
        'BuyToLetMortgageCalculator',
        'Check rent coverage, deposit requirements, and stress tests for buy-to-let mortgages.'
      ),
      createCalculatorEntry(
        'Equity Release Estimator',
        'EquityReleaseEstimator',
        'Estimate how much tax-free cash could be unlocked with equity release plans.'
      ),
      createCalculatorEntry(
        'Reverse Mortgage Calculator',
        'ReverseMortgageCalculator',
        'Estimate tax-free equity release, interest roll-up, and remaining property value under lifetime mortgage plans.',
        MAPPED_KEYWORDS['Reverse Mortgage Calculator'],
        {
          url: '/calculators/reverse-mortgage-calculator',
          page: 'calculators/reverse-mortgage-calculator',
        }
      ),
      createCalculatorEntry(
        'Home Equity Loan Calculator',
        'HomeEquityLoanCalculator',
        'Estimate how much equity you can release, net cash after fees, and repayment costs for a HELOC or further advance.'
      ),
    ],
  },
  {
    name: 'Tax & Income',
    description:
      'Understand deductions, take-home pay, and tax liabilities on every type of income.',
    icon: Coins,
    calculators: [
      createCalculatorEntry(
        'Net Income UK Calculator',
        'NetIncomeUKCalculator',
        'Use our UK net income calculator to reveal take-home pay, compare scenarios, and see how tax and NI deductions change your paycheque.',
        MAPPED_KEYWORDS['Net Income UK Calculator']
      ),
      createCalculatorEntry(
        'NI Calculator',
        'NationalInsuranceCalculator',
        'Use our UK National Insurance calculator to estimate NI contributions, understand NI rates, and see the impact on your take-home pay.',
        MAPPED_KEYWORDS['NI Calculator']
      ),
      createCalculatorEntry(
        'PAYE Calculator',
        'PAYECalculator',
        'Estimate PAYE deductions and net pay for salaried employees.',
        MAPPED_KEYWORDS['PAYE Calculator']
      ),
      createCalculatorEntry(
        'Salary Calculator',
        'SalaryCalculator',
        'Estimate your gross and net pay based on your annual salary.',
        MAPPED_KEYWORDS['Salary Calculator'],
        {
          url: '/calculators/salary-calculator',
          page: 'calculators/salary-calculator',
        }
      ),
      createCalculatorEntry(
        'Take-Home Pay Calculator',
        'TakeHomePayCalculator',
        'Understand the impact of pension, benefits, and salary sacrifice on take-home pay.',
        MAPPED_KEYWORDS['Take-Home Pay Calculator']
      ),
      createCalculatorEntry(
        'Tax and NI Calculator',
        'TaxAndNICalculator',
        'Calculate take-home pay after income tax and national insurance in the UK.',
        MAPPED_KEYWORDS['Tax and NI Calculator']
      ),
      createCalculatorEntry(
        'Tax After Tax Calculator',
        'TaxAfterTaxCalculator',
        'Calculate take-home pay after income tax and national insurance in the UK.',
        MAPPED_KEYWORDS['Tax After Tax Calculator']
      ),
      createCalculatorEntry(
        'Salary Sacrifice Calculator',
        'SalarySacrificeCalculator',
        'Model tax savings and employer contributions when using salary sacrifice for pensions.',
        MAPPED_KEYWORDS['Salary Sacrifice Calculator'],
        {
          url: '/calculators/salary-sacrifice-calculator',
          page: 'calculators/salary-sacrifice-calculator',
        }
      ),
      createCalculatorEntry(
        'Salary Increase Calculator',
        'SalaryIncreaseCalculator',
        'Calculate the impact of a salary increase on your take-home pay.',
        MAPPED_KEYWORDS['Salary Increase Calculator']
      ),
      createCalculatorEntry(
        'Pro Rata Salary Calculator',
        'ProRataSalaryCalculator',
        'Calculate a pro rata salary based on full-time equivalent earnings and working hours.',
        MAPPED_KEYWORDS['Pro Rata Salary Calculator']
      ),
      createCalculatorEntry(
        'Redundancy Pay Calculator',
        'RedundancyPayCalculator',
        'Estimate statutory redundancy pay based on age, length of service, and weekly pay.',
        MAPPED_KEYWORDS['Redundancy Pay Calculator'],
        {
          url: '/calculators/redundancy-pay-calculator',
          page: 'calculators/redundancy-pay-calculator',
        }
      ),
      createCalculatorEntry(
        'Severance Pay Calculator',
        'SeverancePayCalculator',
        'Estimate severance pay, including notice period, statutory redundancy, and other entitlements.',
        MAPPED_KEYWORDS['Severance Pay Calculator'],
        {
          url: '/calculators/severance-pay-calculator',
          page: 'calculators/severance-pay-calculator',
        }
      ),
      createCalculatorEntry(
        'Dividend Tax Calculator',
        'DividendTaxCalculator',
        'Project dividend tax liabilities across different income bands and allowances.'
      ),
      createCalculatorEntry(
        'Effective Tax Rate Calculator',
        'EffectiveTaxRateCalculator',
        'Combine income tax, National Insurance, and other payroll deductions to see your true average tax rate.'
      ),
      createCalculatorEntry(
        'Capital Gains Tax Calculator',
        'CapitalGainsTaxCalculator',
        'Estimate capital gains tax due on property, shares, and other investments.'
      ),
      createCalculatorEntry(
        'Inheritance Tax Calculator',
        'InheritanceTaxCalculator',
        'Project UK inheritance tax liability using nil-rate bands, residence allowances, and charitable gifts.'
      ),
      createCalculatorEntry(
        'Self Assessment Calculator',
        'SelfAssessmentCalculator',
        'Estimate self assessment tax bills, payments on account, and deadlines for UK taxpayers.',
        MAPPED_KEYWORDS['Self Assessment Calculator'],
        {
          url: '/calculators/self-assessment-calculator',
          page: 'calculators/self-assessment-calculator',
        }
      ),
      createCalculatorEntry(
        'Self Assessment Payment Planner',
        'SelfAssessmentPaymentPlanner',
        'Plan payments on account and balancing payments for the self assessment tax return.'
      ),
      createCalculatorEntry(
        'Student Loan Repayment Calculator',
        'StudentLoanRepaymentCalculator',
        'Forecast student loan repayments across different plan types and salary scenarios.',
        MAPPED_KEYWORDS['Student Loan Repayment Calculator'],
        {
          url: '/calculators/student-loan-repayment-calculator',
          page: 'calculators/student-loan-repayment-calculator',
        }
      ),
      createCalculatorEntry(
        'Income Tax Calculator',
        'IncomeTaxCalculator',
        'Estimate Income Tax, National Insurance, pension deductions, and Student Loan plan 2 repayments for UK taxpayers.'
      ),
      createCalculatorEntry(
        'Property Tax Calculator',
        'PropertyTaxCalculator',
        'Estimate UK property tax (SDLT) for home movers, second homes, and non-UK resident surcharges.',
        MAPPED_KEYWORDS['Property Tax Calculator'],
        {
          url: '/calculators/property-tax-calculator',
          page: 'calculators/property-tax-calculator',
        }
      ),
      createCalculatorEntry(
        'Gross to Net Calculator',
        'GrossToNetCalculator',
        'Convert gross salary into net pay after Income Tax, National Insurance, pension, and student loan deductions.'
      ),
      createCalculatorEntry(
        'Overtime Pay Calculator',
        'OvertimePayCalculator',
        'Calculate additional earnings from overtime hours at multiple pay rates.',
        MAPPED_KEYWORDS['Overtime Pay Calculator']
      ),
      createCalculatorEntry(
        'Overtime Rate Calculator',
        'OvertimeRateCalculator',
        'Calculate additional earnings from overtime hours at multiple pay rates.',
        MAPPED_KEYWORDS['Overtime Rate Calculator']
      ),
      createCalculatorEntry(
        'Overtime & Bonus Calculator',
        'OvertimeBonusCalculator',
        'Calculate additional earnings from overtime hours and bonuses.',
        MAPPED_KEYWORDS['Overtime & Bonus Calculator']
      ),
      createCalculatorEntry(
        'Holiday Pay Calculator',
        'HolidayPayCalculator',
        'Estimate statutory holiday pay for salaried and irregular-hours staff using average pay rules.'
      ),
      createCalculatorEntry(
        'Bonus Tax Calculator',
        'BonusTaxCalculator',
        'Estimate tax on one-off bonuses and see the net amount paid to you.'
      ),
      createCalculatorEntry(
        'Hourly to Annual Salary Calculator',
        'HourlyToAnnualSalaryCalculator',
        'Convert hourly pay into annual, monthly, weekly, and daily earnings including overtime.'
      ),
      createCalculatorEntry(
        'Off-Payroll IR35 Calculator',
        'OffPayrollIR35Calculator',
        'Compare inside vs outside IR35 take-home pay after tax and fees.'
      ),
      createCalculatorEntry(
        'Pension Salary Sacrifice Impact Calculator',
        'PensionSalarySacrificeImpactCalculator',
        'Model tax savings and employer contributions when using salary sacrifice for pensions.'
      ),
      createCalculatorEntry(
        'Tax Code Checker Calculator',
        'TaxCodeCheckerCalculator',
        'Decode tax codes and estimate whether you are paying the right amount of PAYE.'
      ),
    ],
  },
  {
    name: 'Retirement & Pensions',
    description: 'Plan retirement ages, pension withdrawals, and contribution strategies.',
    icon: FileText,
    calculators: [
      createCalculatorEntry(
        'Pension Calculator',
        'PensionCalculator',
        'Project future pension values using contribution levels and investment returns.',
        MAPPED_KEYWORDS['Pension Calculator']
      ),
      createCalculatorEntry(
        'Pension Contribution Calculator',
        'PensionContributionCalculator',
        'Find the contribution level that maximises employer match and tax relief.',
        MAPPED_KEYWORDS['Pension Contribution Calculator']
      ),
      createCalculatorEntry(
        'Retirement Calculator',
        'RetirementCalculator',
        'Work out the pension pot and investments needed to meet your desired retirement income in the UK.',
        MAPPED_KEYWORDS['Retirement Calculator'],
        {
          url: '/calculators/retirement-calculator',
          page: 'calculators/retirement-calculator',
        }
      ),
      createCalculatorEntry(
        'Retirement Savings Calculator',
        'RetirementSavingsCalculator',
        'Project pension contributions, employer match, and investment growth towards your retirement savings goal.',
        MAPPED_KEYWORDS['Retirement Savings Calculator'],
        {
          url: '/calculators/retirement-savings-calculator',
          page: 'calculators/retirement-savings-calculator',
        }
      ),
      createCalculatorEntry(
        'Pension Growth Forecast Calculator',
        'PensionGrowthForecastCalculator',
        'Project future pension values using contribution levels and investment returns.'
      ),
      createCalculatorEntry(
        'Retirement Age Planner',
        'RetirementAgePlanner',
        'Work out the age you can retire based on savings, pensions, and lifestyle costs.'
      ),
      createCalculatorEntry(
        'Pension Drawdown Simulator',
        'PensionDrawdownSimulator',
        'Model pension drawdown withdrawals against market performance assumptions.'
      ),
      createCalculatorEntry(
        'Lifetime Allowance Checker',
        'LifetimeAllowanceChecker',
        'Estimate how close you are to the pension lifetime allowance and potential tax.'
      ),
      createCalculatorEntry(
        'State Pension Forecast Calculator',
        'StatePensionForecastCalculator',
        'Forecast state pension income based on qualifying years and deferral choices.'
      ),
      createCalculatorEntry(
        'Pension Contribution Optimiser',
        'PensionContributionOptimiser',
        'Find the contribution level that maximises employer match and tax relief.'
      ),
      createCalculatorEntry(
        'Workplace Pension Auto-Enrolment Calculator',
        'WorkplacePensionAutoEnrolmentCalculator',
        'Review contributions and employer duties for auto-enrolment schemes.'
      ),
      createCalculatorEntry(
        'Early Retirement Gap Calculator',
        'EarlyRetirementGapCalculator',
        'Identify savings shortfalls when aiming for early retirement goals.'
      ),
      createCalculatorEntry(
        'Defined Benefit Pension Calculator',
        'DefinedBenefitPensionCalculator',
        'Estimate retirement income from defined benefit pension arrangements.'
      ),
      createCalculatorEntry(
        'Annuity Calculator',
        'AnnuityCalculator',
        'Compare level annuity payouts and total income using UK annuity rates.'
      ),
      createCalculatorEntry(
        'Annuity Income Estimator',
        'AnnuityIncomeEstimator',
        'Estimate guaranteed income levels available through lifetime annuities.'
      ),
      createCalculatorEntry(
        'Retirement Budget Planner',
        'RetirementBudgetPlanner',
        'Build a sustainable spending plan for retirement years.'
      ),
      createCalculatorEntry(
        'Pension Carry Forward Calculator',
        'PensionCarryForwardCalculator',
        'Calculate unused pension allowance you can carry forward from previous years.'
      ),
    ],
  },
  {
    name: 'Savings & Investments',
    description: 'Track growth, optimise allowances, and compare investment strategies.',
    icon: PiggyBank,
    calculators: [
      createCalculatorEntry(
        'Compound Interest Calculator',
        'CompoundInterestCalculator',
        'Visualise how regular contributions and compounding grow your savings.'
      ),
      createCalculatorEntry(
        'Savings Goal Calculator',
        'SavingsGoalCalculator',
        'Set savings goals and monitor progress against monthly contributions.',
        MAPPED_KEYWORDS['Savings Goal Calculator'],
        {
          url: '/calculators/savings-goal-calculator',
          page: 'calculators/savings-goal-calculator',
        }
      ),
      createCalculatorEntry(
        'Savings Calculator',
        'SavingsCalculator',
        'Plan savings growth with monthly contributions, compound interest, and inflation assumptions.',
        MAPPED_KEYWORDS['Savings Calculator'],
        {
          url: '/calculators/savings-calculator',
          page: 'calculators/savings-calculator',
        }
      ),
      createCalculatorEntry(
        'Simple Interest Calculator',
        'SimpleInterestCalculator',
        'Calculate simple interest earned on savings or charged on loans over a set period.',
        MAPPED_KEYWORDS['Simple Interest Calculator']
      ),
      createCalculatorEntry(
        'Rule of 72 Calculator',
        'RuleOf72Calculator',
        'Estimate how long it takes for an investment to double using the Rule of 72.',
        MAPPED_KEYWORDS['Rule of 72 Calculator'],
        {
          url: '/calculators/rule-of-72-calculator',
          page: 'calculators/rule-of-72-calculator',
        }
      ),
      createCalculatorEntry(
        'ROI Calculator',
        'RoiCalculator',
        'Analyse return on investment, annualised returns, and income yield for UK investments.',
        MAPPED_KEYWORDS['ROI Calculator'],
        {
          url: '/calculators/roi-calculator',
          page: 'calculators/roi-calculator',
        }
      ),
      createCalculatorEntry(
        'ISA Allowance Planner',
        'ISAAllowancePlanner',
        'Plan ISA deposits across cash, stocks and shares, and lifetime ISA allowances.'
      ),
      createCalculatorEntry(
        'Savings Goal Tracker',
        'SavingsGoalTracker',
        'Set savings goals and monitor progress against monthly contributions.'
      ),
      createCalculatorEntry(
        'Future Value Calculator',
        'FutureValueCalculator',
        'Project how lump sums and regular contributions grow with compound interest over time.'
      ),
      createCalculatorEntry(
        'Investment Calculator',
        'InvestmentCalculator',
        'Model investment growth with regular contributions, annual increases, and different compounding frequencies.'
      ),
      createCalculatorEntry(
        'Investment Portfolio Rebalancer',
        'InvestmentPortfolioRebalancer',
        'Check how to rebalance your portfolio to match target asset allocations.'
      ),
      createCalculatorEntry(
        'Lump Sum Growth Calculator',
        'LumpSumGrowthCalculator',
        'Project the future value of one-off investments under different returns.'
      ),
      createCalculatorEntry(
        'Regular Savings Growth Calculator',
        'RegularSavingsGrowthCalculator',
        'Forecast outcomes for ongoing savings plans with monthly contributions.'
      ),
      createCalculatorEntry(
        'Dividend Reinvestment Calculator',
        'DividendReinvestmentCalculator',
        'See how reinvesting dividends accelerates long-term portfolio growth.'
      ),
      createCalculatorEntry(
        'ISA Calculator',
        'IsaCalculator',
        'Track ISA contributions, project tax-free growth, and factor in Lifetime ISA bonuses.'
      ),
      createCalculatorEntry(
        'FIRE Calculator',
        'FireCalculator',
        'Map your financial independence number, projected portfolio growth, and retirement timeline.'
      ),
      createCalculatorEntry(
        'Investment Fee Impact Calculator',
        'InvestmentFeeImpactCalculator',
        'Measure how platform and fund fees reduce long-term investment returns.'
      ),
      createCalculatorEntry(
        'Savings vs Mortgage Overpayment Calculator',
        'SavingsVsMortgageOverpaymentCalculator',
        'Compare returns from saving cash versus overpaying a mortgage.'
      ),
      createCalculatorEntry(
        'Lifetime ISA Bonus Calculator',
        'LifetimeISABonusCalculator',
        'Estimate government bonuses and withdrawal scenarios for lifetime ISAs.'
      ),
      createCalculatorEntry(
        'High Interest Account Comparison Calculator',
        'HighInterestAccountComparisonCalculator',
        'Compare rates and projected returns across high-interest savings accounts.'
      ),
    ],
  },
  {
    name: 'Debt & Loans',
    description: 'Plan repayments, understand borrowing costs, and accelerate debt freedom.',
    icon: CreditCard,
    calculators: [
      createCalculatorEntry(
        'Loan Repayment Calculator',
        'LoanRepaymentCalculator',
        'Use the UK loan repayment calculator to model monthly payments, total interest, and payoff dates. Add extra payments to see how quickly you can clear personal, car, or consolidation loans.',
        MAPPED_KEYWORDS['Loan Repayment Calculator']
      ),
      createCalculatorEntry(
        'Loan Comparison Calculator',
        'LoanComparisonCalculator',
        'Use the loan comparison calculator to weigh two UK personal loans side-by-side. Compare monthly repayments, total interest, APR-style costs, and fees before you apply.',
        MAPPED_KEYWORDS['Loan Comparison Calculator']
      ),
      createCalculatorEntry(
        'Personal Loan Calculator',
        'PersonalLoanCalculator',
        'Estimate monthly payments, total interest, and payoff time for personal loans.',
        MAPPED_KEYWORDS['Personal Loan Calculator']
      ),
      createCalculatorEntry(
        'Student Loan Calculator',
        'StudentLoanCalculator',
        'Forecast student loan repayments across different plan types and salary scenarios.',
        MAPPED_KEYWORDS['Student Loan Calculator']
      ),
      createCalculatorEntry(
        'Loan Repayment Schedule Calculator',
        'LoanRepaymentScheduleCalculator',
        'Generate amortisation schedules for personal, car, or secured loans.'
      ),
      createCalculatorEntry(
        'Average Daily Balance Calculator',
        'AverageDailyBalanceCalculator',
        'Estimate credit card finance charges using the average daily balance method.'
      ),
      createCalculatorEntry(
        'Amortisation Calculator',
        'AmortizationCalculator',
        'Model monthly repayments and track interest versus principal across the loan term.'
      ),
      createCalculatorEntry(
        'Credit Card Payoff Planner',
        'CreditCardPayoffPlanner',
        'Build a plan to clear credit card balances faster with targeted payments.'
      ),
      createCalculatorEntry(
        'Credit Card Repayment Calculator',
        'CreditCardRepaymentCalculator',
        'Estimate payoff time, total interest, and monthly payments for credit card balances.'
      ),
      createCalculatorEntry(
        'Debt Snowball Calculator',
        'DebtSnowballCalculator',
        'Prioritise smaller balances first and track progress with the snowball method.'
      ),
      createCalculatorEntry(
        'Debt Avalanche Calculator',
        'DebtAvalancheCalculator',
        'Optimise repayment order by focusing on highest interest debts first.'
      ),
      createCalculatorEntry(
        'Debt Calculator',
        'DebtCalculator',
        'Build a personalised repayment plan showing payoff dates, total interest, and the impact of extra payments.'
      ),
      createCalculatorEntry(
        'Debt to Income Ratio Calculator',
        'DebtToIncomeRatioCalculator',
        'Measure how much of your monthly income is absorbed by repayments before applying for new credit.'
      ),
      createCalculatorEntry(
        'Personal Loan Eligibility Estimator',
        'PersonalLoanEligibilityEstimator',
        'Check potential borrowing amounts based on income, credit, and affordability.'
      ),
      createCalculatorEntry(
        'Debt Consolidation Savings Calculator',
        'DebtConsolidationSavingsCalculator',
        'Compare consolidation offers to estimate reduced payments and interest.'
      ),
      createCalculatorEntry(
        'Car Finance Calculator',
        'CarFinanceCalculator',
        'Plan PCP or HP repayments, balloons, and total car finance cost.'
      ),
      createCalculatorEntry(
        'Car Payment Calculator',
        'CarPaymentCalculator',
        'Estimate monthly car payments, total interest, and affordability before buying.'
      ),
      createCalculatorEntry(
        'Payday Loan Cost Calculator',
        'PaydayLoanCostCalculator',
        'Understand the real cost of short-term lending and alternative repayment options.'
      ),
      createCalculatorEntry(
        'Home Improvement Loan Calculator',
        'HomeImprovementLoanCalculator',
        'Plan borrowing for renovations with repayment and cost forecasts.'
      ),
      createCalculatorEntry(
        'Balance Transfer Savings Calculator',
        'BalanceTransferSavingsCalculator',
        'See how much interest you could save by switching to a 0% balance transfer card.'
      ),
      createCalculatorEntry(
        'Leasing vs Buying Car Calculator',
        'LeasingVsBuyingCarCalculator',
        'Compare total costs of leasing a vehicle against buying with cash or finance.'
      ),
      createCalculatorEntry(
        'Car Loan Calculator',
        'CarLoanCalculator',
        'Estimate monthly car finance payments, total interest, and payoff time with overpayments.'
      ),
      createCalculatorEntry(
        'Business Loan Calculator',
        'BusinessLoanCalculator',
        'Plan business loan repayments, total interest, and overpayments before borrowing.'
      ),
      createCalculatorEntry(
        'Student Loan Payoff Accelerator',
        'StudentLoanPayoffAccelerator',
        'Test strategies to repay student loans faster and reduce total interest.'
      ),
    ],
  },
  {
    name: 'Budgeting & Planning',
    description: 'Coordinate spending plans, short-term goals, and day-to-day money decisions.',
    icon: Wallet,
    calculators: [
      createCalculatorEntry(
        'Monthly Budget Planner',
        'MonthlyBudgetPlanner',
        'Allocate income across bills, savings, and lifestyle categories each month.'
      ),
      createCalculatorEntry(
        'Expense Splitter Calculator',
        'ExpenseSplitterCalculator',
        'Split shared expenses fairly across households, trips, or events.'
      ),
      createCalculatorEntry(
        'Discount Calculator',
        'DiscountCalculator',
        'Combine percentage and fixed discounts to calculate true savings before you buy.'
      ),
      createCalculatorEntry(
        'Holiday Budget Calculator',
        'HolidayBudgetCalculator',
        'Plan holiday spending with savings targets and cost breakdowns.'
      ),
      createCalculatorEntry(
        'Household Bills Splitter',
        'HouseholdBillsSplitter',
        'Split rent, utilities, and subscriptions fairly across housemates with customised percentages.'
      ),
      createCalculatorEntry(
        'Wedding Budget Calculator',
        'WeddingBudgetCalculator',
        'Create a wedding budget, track deposits, and monitor remaining balances.',
        MAPPED_KEYWORDS['Wedding Budget Calculator']
      ),
      createCalculatorEntry(
        'Emergency Fund Calculator',
        'EmergencyFundCalculator',
        'Work out how much to save for emergencies based on expenses and risk tolerance.'
      ),
      createCalculatorEntry(
        'Savings Rate Tracker',
        'SavingsRateTracker',
        'Track savings rate over time and see how it affects financial goals.'
      ),
      createCalculatorEntry(
        'Dream Lifestyle Calculator',
        'DreamLifestyleCalculator',
        'Price your dream lifestyle, set savings buffers, and define the income needed to sustain it.'
      ),
      createCalculatorEntry(
        'Subscription Cost Calculator',
        'SubscriptionCostCalculator',
        'Identify recurring subscriptions and quantify savings from cancelling unused ones.',
        MAPPED_KEYWORDS['Subscription Cost Calculator']
      ),
      createCalculatorEntry(
        'Cost of Living Calculator',
        'CostOfLivingCalculator',
        'Compare monthly spending across housing, utilities, transport, and lifestyle costs.'
      ),
      createCalculatorEntry(
        'Budget Calculator',
        'BudgetCalculator',
        'Balance income, expenses, savings, and debt payments in a monthly budget.'
      ),
      createCalculatorEntry(
        'Budget Planner',
        'BudgetPlanner',
        'Build a monthly budget that balances income, bills, and savings goals.'
      ),
      createCalculatorEntry(
        'Cost of Living Comparison Calculator',
        'CostOfLivingComparisonCalculator',
        'Compare the cost of living between cities or life events before moving.'
      ),
      createCalculatorEntry(
        'Inflation Impact Estimator',
        'InflationImpactEstimator',
        'Understand how inflation erodes purchasing power across spending categories.'
      ),
      createCalculatorEntry(
        'Inflation Calculator',
        'InflationCalculator',
        'Measure how prices change over time and estimate future purchasing power using a chosen inflation rate.'
      ),
      createCalculatorEntry(
        'Net Worth Calculator',
        'NetWorthCalculator',
        'Aggregate assets and liabilities to track net worth growth over time.',
        MAPPED_KEYWORDS['Net Worth Calculator']
      ),
      createCalculatorEntry(
        'Annual Expense Forecaster',
        'AnnualExpenseForecaster',
        'Forecast annual spending commitments and plan for large irregular bills.'
      ),
      createCalculatorEntry(
        'Spending Fast Planner',
        'SpendingFastPlanner',
        'Set a no-spend challenge and monitor progress toward short-term savings goals.'
      ),
      createCalculatorEntry(
        'Travel Budget Calculator',
        'TravelBudgetCalculator',
        'Plan holiday spending with savings targets and cost breakdowns.',
        MAPPED_KEYWORDS['Travel Budget Calculator']
      ),
    ],
  },
  {
    name: 'Business & Freelancing',
    description: 'Support sole traders, contractors, and directors with cash flow and taxes.',
    icon: Briefcase,
    calculators: [
      createCalculatorEntry(
        'Freelancer Day Rate Calculator',
        'FreelancerDayRateCalculator',
        'Set day rates that cover expenses, downtime, and desired profit margins.'
      ),
      createCalculatorEntry(
        'Corporation Tax Calculator',
        'CorporationTaxCalculator',
        'Estimate UK corporation tax, marginal relief, and post-tax profit for limited companies.'
      ),
      createCalculatorEntry(
        'VAT Registration Threshold Checker',
        'VATRegistrationThresholdChecker',
        'Check turnover against thresholds to know when VAT registration is required.'
      ),
      createCalculatorEntry(
        'VAT Calculator',
        'VATCalculator',
        'Determine VAT amounts to report on domestic reverse charge transactions.',
        MAPPED_KEYWORDS['VAT Calculator']
      ),
      createCalculatorEntry(
        'Profit & Loss Breakeven Calculator',
        'ProfitAndLossBreakevenCalculator',
        'Identify breakeven points by combining fixed and variable business costs.'
      ),
      createCalculatorEntry(
        'Limited Company vs Sole Trader Calculator',
        'LimitedCompanyVsSoleTraderCalculator',
        'Compare tax efficiency and take-home pay between company and sole trader setups.'
      ),
      createCalculatorEntry(
        'Retainer Pricing Calculator',
        'RetainerPricingCalculator',
        'Model retainer packages with utilisation assumptions and profit targets.'
      ),
      createCalculatorEntry(
        'Contractor Calculator',
        'ContractorCalculator',
        'Estimate UK contractor take-home pay from day rate, salary, dividends, and company costs.'
      ),
      createCalculatorEntry(
        'IR35 Risk Checker',
        'IR35RiskChecker',
        'Assess contract risk factors that could trigger an inside IR35 determination.'
      ),
      createCalculatorEntry(
        'Business Mileage Expense Calculator',
        'BusinessMileageExpenseCalculator',
        'Track mileage claims and calculate HMRC-approved reimbursement amounts.'
      ),
      createCalculatorEntry(
        'Break-Even Calculator',
        'BreakEvenCalculator',
        'Calculate contribution margin, break-even units, and sales needed for profit.'
      ),
      createCalculatorEntry(
        'Commission Calculator',
        'CommissionCalculator',
        'Model sales commission, accelerators, bonuses, and draws to forecast take-home pay.'
      ),
      createCalculatorEntry(
        'Quarterly Cash Flow Planner',
        'QuarterlyCashFlowPlanner',
        'Plan cash inflows and outflows to keep quarterly finances on track.'
      ),
    ],
  },
  {
    name: 'Utilities & Tools',
    description: 'Compare household bills, transport costs, and essential living expenses.',
    icon: Zap,
    calculators: [
      createCalculatorEntry(
        'Energy Tariff Comparison Calculator',
        'EnergyTariffComparisonCalculator',
        'Compare energy tariffs and estimate annual savings from switching provider.'
      ),
      createCalculatorEntry(
        'Energy Bill Calculator',
        'EnergyBillCalculator',
        'Estimate monthly and annual energy bills across electricity and gas, including VAT and standing charges.'
      ),
      createCalculatorEntry(
        'Electric Vehicle Charging Cost Calculator',
        'ElectricVehicleChargingCostCalculator',
        'Estimate the cost of charging an EV at home, work, or public stations.'
      ),
      createCalculatorEntry(
        'Currency Converter',
        'CurrencyConverter',
        'Convert GBP to popular currencies using mid-market reference rates.'
      ),
      createCalculatorEntry(
        'Car Cost Calculator',
        'CarCostCalculator',
        'Review the full monthly running cost of a car including fuel, insurance, and depreciation.'
      ),
      createCalculatorEntry(
        'Council Tax Band Checker',
        'CouncilTaxBandChecker',
        'Identify council tax bands and annual charges based on property value.'
      ),
      createCalculatorEntry(
        'Water Bill Estimator',
        'WaterBillEstimator',
        'Project water and sewerage bills using household size and usage patterns.'
      ),
      createCalculatorEntry(
        'Broadband Cost Calculator',
        'BroadbandCostCalculator',
        'Compare broadband packages and total contract costs including promotional rates.'
      ),
      createCalculatorEntry(
        'Commute Cost Calculator',
        'CommuteCostCalculator',
        'Compare daily, monthly, and annual commute costs across car, public transport, and cycling.'
      ),
      createCalculatorEntry(
        'Fuel Cost Splitter',
        'FuelCostSplitter',
        'Split fuel and toll costs evenly across passengers or business journeys.'
      ),
      createCalculatorEntry(
        'Home Insurance Premium Estimator',
        'HomeInsurancePremiumEstimator',
        'Estimate annual premiums for buildings and contents insurance cover.'
      ),
      createCalculatorEntry(
        'Life Insurance Coverage Estimator',
        'LifeInsuranceCoverageEstimator',
        'Determine the right level of life cover based on dependents and debts.'
      ),
      createCalculatorEntry(
        'Mobile Contract Comparison Calculator',
        'MobileContractComparisonCalculator',
        'Compare SIM-only, handset, and rolling contracts to find the best value.'
      ),
      createCalculatorEntry(
        'Utility Bill Smoothing Calculator',
        'UtilityBillSmoothingCalculator',
        'Create monthly payment plans to smooth out fluctuating utility bills.'
      ),
    ],
  },
  {
    name: 'Family & Lifestyle',
    description: 'Manage household finances, life events, and long-term family planning costs.',
    icon: Users,
    calculators: [
      createCalculatorEntry(
        'Childcare Cost Planner',
        'ChildcareCostPlanner',
        'Estimate childcare costs and government support across different providers.'
      ),
      createCalculatorEntry(
        'Childcare Cost Calculator',
        'ChildcareCostCalculator',
        'Project nursery, wraparound care, extras, and support to understand monthly childcare spend.'
      ),
      createCalculatorEntry(
        'Statutory Maternity Pay Calculator',
        'MaternityPayCalculator',
        'Work out statutory and enhanced maternity pay over the full leave period.',
        MAPPED_KEYWORDS['Statutory Maternity Pay Calculator']
      ),
      createCalculatorEntry(
        'Statutory Sick Pay Calculator',
        'StatutorySickPayCalculator',
        'Estimate statutory sick pay (SSP) entitlement and payment schedule.',
        MAPPED_KEYWORDS['Statutory Sick Pay Calculator']
      ),
      createCalculatorEntry(
        'Shared Parental Leave Planner',
        'SharedParentalLeavePlanner',
        'Plan shared parental leave patterns and associated statutory payments.'
      ),
      createCalculatorEntry(
        'School Fees Planner',
        'SchoolFeesPlanner',
        'Forecast independent school fees and savings needed for upcoming years.'
      ),
      createCalculatorEntry(
        'University Costs Forecaster',
        'UniversityCostsForecaster',
        'Estimate tuition, accommodation, and living costs for university study.'
      ),
      createCalculatorEntry(
        'Family Budget Planner',
        'FamilyBudgetPlanner',
        'Build a household budget that balances daily costs, debts, and savings.'
      ),
      createCalculatorEntry(
        'Cost of Raising a Child Calculator',
        'CostOfRaisingAChildCalculator',
        'Track lifetime costs of raising a child from birth through education milestones.'
      ),
      createCalculatorEntry(
        'Child Benefit Calculator',
        'ChildBenefitCalculator',
        'Estimate weekly Child Benefit payments and any High Income Child Benefit Charge.'
      ),
      createCalculatorEntry(
        'Home Move Cost Calculator',
        'HomeMoveCostCalculator',
        'Plan the full cost of moving home including removals, fees, and deposits.'
      ),
      createCalculatorEntry(
        'Life Event Savings Planner',
        'LifeEventSavingsPlanner',
        'Allocate savings for weddings, celebrations, and milestone life events.'
      ),
      createCalculatorEntry(
        'Pet Ownership Cost Calculator',
        'PetOwnershipCostCalculator',
        'Budget for pet insurance, food, and annual care commitments.'
      ),
      createCalculatorEntry(
        'Subscription Family Sharing Calculator',
        'SubscriptionFamilySharingCalculator',
        'Coordinate shared family subscriptions and split the monthly costs fairly.'
      ),
    ],
  },
];

const enrichCalculators = (items = []) =>
  items.map((calc) => ({
    ...calc,
    status: calc.status || 'active',
    tags: Array.isArray(calc.tags) ? calc.tags : [],
    keywords: Array.isArray(calc.keywords) ? calc.keywords : [],
  }));

export const calculatorCategories = rawCategories.map(
  ({ name, description, icon, calculators }) => {
    const categoryTag = toSlug(name);
    const calculatorsWithDefaults = enrichCalculators(calculators).map((calc) => ({
      ...calc,
      tags: Array.from(new Set([...(calc.tags || []), categoryTag])),
    }));
    return {
      name,
      slug: toSlug(name),
      description,
      icon,
      calculators: calculatorsWithDefaults,
      subCategories: [
        {
          name: `${name} Tools`,
          calculators: calculatorsWithDefaults,
        },
      ],
    };
  }
);

export const allCalculators = calculatorCategories.flatMap((category) =>
  (category.subCategories || []).flatMap((sub) => sub.calculators || [])
);

export const totalCalculatorCount = allCalculators.length;

export const getAllCalculators = () => calculatorCategories;

export const getCalculatorStats = () => {
  const total = allCalculators.length;
  const active = allCalculators.filter((calc) => calc.status === 'active').length;
  const pending = total - active;
  return { total, active, pending };
};

export const getCalculatorsByStatus = (status) =>
  allCalculators.filter((calc) => calc.status === status);

export const searchCalculators = (query) => {
  const term = String(query || '').toLowerCase();
  if (!term) return [];
  return allCalculators.filter(
    (calc) =>
      calc.name.toLowerCase().includes(term) ||
      calc.description.toLowerCase().includes(term) ||
      calc.keywords.some((keyword) => keyword.toLowerCase().includes(term))
  );
};
