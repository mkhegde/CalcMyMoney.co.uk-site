const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;
const NI_PRIMARY_THRESHOLD = 12570;
const NI_UPPER_EARNINGS_LIMIT = 50270;
const NI_MAIN_RATE = 0.08;
const NI_UPPER_RATE = 0.02;

const normalise = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const cleaned = String(value).replace(/[,\s£]/g, '');
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateIncomeTax = (grossIncome) => {
  let personalAllowance = PERSONAL_ALLOWANCE;

  if (grossIncome > 100000) {
    const reduction = Math.floor((grossIncome - 100000) / 2);
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - reduction);
  }

  const taxable = Math.max(0, grossIncome - personalAllowance);
  let tax = 0;

  const basicBand = Math.min(taxable, Math.max(0, BASIC_RATE_LIMIT - personalAllowance));
  tax += basicBand * 0.2;

  const higherBand = Math.min(
    Math.max(0, taxable - basicBand),
    Math.max(0, HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT)
  );
  tax += higherBand * 0.4;

  const additionalBand = Math.max(0, taxable - basicBand - higherBand);
  tax += additionalBand * 0.45;

  return { tax, personalAllowanceUsed: personalAllowance, taxableIncome: taxable };
};

const calculateNationalInsurance = (annualPay) => {
  const niBand1 = Math.max(0, Math.min(annualPay, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD);
  const niBand2 = Math.max(0, annualPay - NI_UPPER_EARNINGS_LIMIT);
  return niBand1 * NI_MAIN_RATE + niBand2 * NI_UPPER_RATE;
};

export const buildSalaryBreakdown = ({
  yourSalary,
  partnerSalary,
  otherIncomeMonthly,
  benefitsIncomeMonthly,
} = {}) => {
  const salary = Math.max(normalise(yourSalary), 0);
  const partner = Math.max(normalise(partnerSalary), 0);
  const other = Math.max(normalise(otherIncomeMonthly), 0) * 12;
  const benefits = Math.max(normalise(benefitsIncomeMonthly), 0) * 12;

  const grossAnnualIncome = salary + partner + other + benefits;
  const { tax, personalAllowanceUsed, taxableIncome } = calculateIncomeTax(grossAnnualIncome);
  const nationalInsurance = calculateNationalInsurance(grossAnnualIncome);
  const totalDeductions = tax + nationalInsurance;
  const netAnnualIncome = Math.max(grossAnnualIncome - totalDeductions, 0);
  const netMonthlyIncome = netAnnualIncome / 12;

  return {
    calculatedGrossAnnualIncome: grossAnnualIncome,
    calculatedTaxableIncome: taxableIncome,
    personalAllowanceUsed,
    calculatedIncomeTaxAnnual: tax,
    calculatedNationalInsuranceAnnual: nationalInsurance,
    totalDeductions,
    calculatedNetAnnualIncome: netAnnualIncome,
    calculatedNetMonthlyIncome: netMonthlyIncome,
  };
};
