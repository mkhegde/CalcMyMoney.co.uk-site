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

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const createCalculatorEntry = (name, pageName, description) => ({
  name,
  pageName,
  description,
  icon: CalculatorIcon,
  status: 'active',
  tags: [],
  url: createPageUrl(pageName),
});

const rawCategories = [
  {
    name: 'Mortgages & Property',
    description: 'Planning tools for buyers, landlords, and homeowners managing property decisions.',
    icon: Home,
    calculators: [
      createCalculatorEntry(
        'Mortgage Repayment Calculator',
        'MortgageRepaymentCalculator',
        'Estimate monthly mortgage repayments and total interest costs over the term.'
      ),
      createCalculatorEntry(
        'Buy-to-Let Profit Calculator',
        'BuyToLetProfitCalculator',
        'Assess rental income, costs, and yields for prospective buy-to-let investments.'
      ),
      createCalculatorEntry(
        'Stamp Duty Land Tax Calculator',
        'StampDutyLandTaxCalculator',
        'Work out stamp duty obligations for first homes, second homes, and investment properties.'
      ),
      createCalculatorEntry(
        'Help to Buy Equity Loan Calculator',
        'HelpToBuyEquityLoanCalculator',
        'Project repayments and equity share changes for Help to Buy equity loans.'
      ),
      createCalculatorEntry(
        'Remortgage Savings Calculator',
        'RemortgageSavingsCalculator',
        'Compare remortgage deals and estimate potential monthly and lifetime savings.'
      ),
      createCalculatorEntry(
        'First-Time Buyer Affordability Calculator',
        'FirstTimeBuyerAffordabilityCalculator',
        'Check how much you can borrow and the deposit needed as a first-time buyer.'
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
        'Rent vs Buy Comparison Calculator',
        'RentVsBuyComparisonCalculator',
        'Compare the long-term cost of renting versus purchasing a property.'
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
    ],
  },
  {
    name: 'Tax & Income',
    description: 'Understand deductions, take-home pay, and tax liabilities on every type of income.',
    icon: Coins,
    calculators: [
      createCalculatorEntry(
        'UK Income Tax Calculator',
        'IncomeTaxCalculatorUK',
        'Calculate take-home pay after income tax and national insurance in the UK.'
      ),
      createCalculatorEntry(
        'National Insurance Contribution Calculator',
        'NationalInsuranceContributionCalculator',
        'Work out Class 1 and Class 4 national insurance based on earnings or profits.'
      ),
      createCalculatorEntry(
        'PAYE Net Pay Calculator',
        'PAYENetPayCalculator',
        'Estimate PAYE deductions and net pay for salaried employees.'
      ),
      createCalculatorEntry(
        'Dividend Tax Calculator',
        'DividendTaxCalculator',
        'Project dividend tax liabilities across different income bands and allowances.'
      ),
      createCalculatorEntry(
        'Capital Gains Tax Calculator',
        'CapitalGainsTaxCalculator',
        'Estimate capital gains tax due on property, shares, and other investments.'
      ),
      createCalculatorEntry(
        'Self Assessment Payment Planner',
        'SelfAssessmentPaymentPlanner',
        'Plan payments on account and balancing payments for the self assessment tax return.'
      ),
      createCalculatorEntry(
        'Student Loan Repayment Calculator',
        'StudentLoanRepaymentCalculator',
        'Forecast student loan repayments across different plan types and salary scenarios.'
      ),
      createCalculatorEntry(
        'Take-Home Pay Calculator',
        'TakeHomePayCalculator',
        'Understand the impact of pension, benefits, and salary sacrifice on take-home pay.'
      ),
      createCalculatorEntry(
        'Overtime Pay Calculator',
        'OvertimePayCalculator',
        'Calculate additional earnings from overtime hours at multiple pay rates.'
      ),
      createCalculatorEntry(
        'Bonus Tax Calculator',
        'BonusTaxCalculator',
        'Estimate tax on one-off bonuses and see the net amount paid to you.'
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
        'FIRE Number Calculator',
        'FIRENumberCalculator',
        'Estimate the portfolio size needed to reach financial independence.'
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
        'Loan Repayment Schedule Calculator',
        'LoanRepaymentScheduleCalculator',
        'Generate amortisation schedules for personal, car, or secured loans.'
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
        'Car Finance Payment Calculator',
        'CarFinancePaymentCalculator',
        'Estimate monthly payments for PCP, HP, or personal car finance agreements.'
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
        'Holiday Budget Calculator',
        'HolidayBudgetCalculator',
        'Plan holiday spending with savings targets and cost breakdowns.'
      ),
      createCalculatorEntry(
        'Wedding Budget Planner',
        'WeddingBudgetPlanner',
        'Create a wedding budget, track deposits, and monitor remaining balances.'
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
        'Subscription Clean-Up Calculator',
        'SubscriptionCleanUpCalculator',
        'Identify recurring subscriptions and quantify savings from cancelling unused ones.'
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
        'Net Worth Tracker',
        'NetWorthTracker',
        'Aggregate assets and liabilities to track net worth growth over time.'
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
        'Corporation Tax Estimator',
        'CorporationTaxEstimator',
        'Estimate corporation tax liabilities based on reported profits.'
      ),
      createCalculatorEntry(
        'VAT Registration Threshold Checker',
        'VATRegistrationThresholdChecker',
        'Check turnover against thresholds to know when VAT registration is required.'
      ),
      createCalculatorEntry(
        'VAT Reverse Charge Calculator',
        'VATReverseChargeCalculator',
        'Determine VAT amounts to report on domestic reverse charge transactions.'
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
        'Contractor Take-Home Pay Calculator',
        'ContractorTakeHomePayCalculator',
        'Compare umbrella and limited company take-home pay after all deductions.'
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
        'Electric Vehicle Charging Cost Calculator',
        'ElectricVehicleChargingCostCalculator',
        'Estimate the cost of charging an EV at home, work, or public stations.'
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
        'Commuter Travel Cost Calculator',
        'CommuterTravelCostCalculator',
        'Work out commuting costs across rail, bus, cycling, or driving options.'
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
        'Maternity Pay Calculator',
        'MaternityPayCalculator',
        'Work out statutory and enhanced maternity pay over the full leave period.'
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
  }));

export const calculatorCategories = rawCategories.map(({ name, description, icon, calculators }) => {
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
});

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
      calc.description.toLowerCase().includes(term)
  );
};
