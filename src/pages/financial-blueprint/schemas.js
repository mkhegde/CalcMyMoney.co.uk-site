import { z } from 'zod';

const moneyField = (label) =>
  z.coerce
    .number({ required_error: `${label} is required.` })
    .min(0, { message: `${label} must be zero or greater.` });

const integerField = (label) =>
  z.coerce
    .number({ required_error: `${label} is required.` })
    .int({ message: `${label} must be a whole number.` })
    .min(0, { message: `${label} cannot be negative.` });

const optionalize = (schema) =>
  z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : val),
      schema.nullable()
    )
    .transform((val) => (val === null ? undefined : val));

export const step1Schema = z
  .object({
    blueprintFor: z.enum(['individual', 'family'], {
      required_error: 'Please select who this blueprint is for.',
    }),
    location: z.enum(['england', 'scotland', 'wales', 'northern-ireland'], {
      required_error: 'Location is required.',
    }),
    housingStatus: z.enum(['renting', 'mortgaged', 'owned'], {
      required_error: 'Housing status is required.',
    }),
    maritalStatus: z.enum(['single', 'married', 'in-partnership'], {
      required_error: 'Marital status is required.',
    }),
    age: z.coerce
      .number({ required_error: 'Your age is required.' })
      .min(18, { message: 'You must be at least 18 years old to continue.' })
      .max(110, { message: 'Please provide a realistic age.' }),
    partnerAge: optionalize(
      z
        .coerce.number({ invalid_type_error: "Partner's age must be at least 18." })
        .min(18, { message: "Partner's age must be at least 18." })
        .max(110, { message: 'Please provide a realistic partner age.' })
    ),
    profession: z
      .string({ required_error: 'Profession is required.' })
      .min(2, { message: 'Please provide a valid profession.' }),
    partnerProfession: optionalize(
      z
        .string({ required_error: "Partner's profession is required." })
        .min(2, { message: "Partner's profession is required." })
    ),
    numberOfChildren: integerField('Number of children'),
    specialNeedsChildren: integerField('Number of children with special needs'),
    specialNeedsSupport: optionalize(
      z
        .string({ required_error: 'Please describe the support requirements.' })
        .min(3, { message: 'Please add a short description of support needs.' })
    ),
    healthStatus: z.enum(['good', 'fair', 'poor'], {
      required_error: 'Health status is required.',
    }),
    smoker: z.enum(['yes', 'no'], { required_error: 'Please let us know your smoking status.' }),
    alcoholUnitsWeekly: z.coerce
      .number({ required_error: 'Weekly alcohol consumption is required.' })
      .min(0, { message: 'Alcohol units cannot be negative.' })
      .max(150, { message: 'Please provide a realistic weekly consumption.' }),
    tobaccoSpendWeekly: moneyField('Weekly tobacco spend'),
  })
  .superRefine((data, ctx) => {
    if (data.blueprintFor === 'family') {
      if (data.partnerAge === undefined || Number.isNaN(data.partnerAge)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerAge'],
          message: "Partner's age is required for a family blueprint.",
        });
      }
      if (!data.partnerProfession) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerProfession'],
          message: "Partner's profession is required for a family blueprint.",
        });
      }
    }
    if (data.specialNeedsChildren > data.numberOfChildren) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['specialNeedsChildren'],
        message: 'Special needs children cannot exceed total children.',
      });
    }
    if (data.specialNeedsChildren > 0 && !data.specialNeedsSupport) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['specialNeedsSupport'],
        message: 'Please describe the support needs for your dependants.',
      });
    }
  });

export const step2Schema = z
  .object({
    blueprintFor: z.enum(['individual', 'family']),
    yourSalary: moneyField('Your annual salary'),
    partnerSalary: moneyField("Partner's annual salary"),
    otherIncomeMonthly: moneyField('Other monthly income'),
    benefitsIncomeMonthly: moneyField('Monthly income from benefits'),
  })
  .superRefine((data, ctx) => {
    if (data.blueprintFor === 'family' && data.partnerSalary <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['partnerSalary'],
        message: "Partner's salary is required for a family blueprint.",
      });
    }
  });

export const step3Schema = z
  .object({
    blueprintFor: z.enum(['individual', 'family']),
    housingStatus: z.enum(['renting', 'mortgaged', 'owned']),
    expensesHousing: moneyField('Housing costs'),
    expensesUtilities: moneyField('Utilities'),
    expensesGroceries: moneyField('Groceries'),
    expensesTransport: moneyField('Transport'),
    expensesLifestyle: moneyField('Lifestyle & entertainment'),
    expensesChildcare: moneyField('Childcare & education'),
    specialNeedsCostsMonthly: moneyField('Special needs support costs'),
    numberOfChildren: integerField('Number of children'),
    specialNeedsChildren: integerField('Number of children with special needs'),
    emergencySavingsContributionMonthly: moneyField('Monthly emergency savings contribution'),
    pensionContributionMonthly: moneyField('Your monthly pension contribution'),
    partnerPensionContributionMonthly: moneyField("Partner's monthly pension contribution"),
    isaContributionMonthly: moneyField('Monthly ISA investing'),
    partnerIsaContributionMonthly: moneyField("Partner's monthly ISA investing"),
    childcareVouchersMonthly: moneyField('Monthly childcare vouchers received'),
  })
  .superRefine((data, ctx) => {
    if (data.specialNeedsChildren > 0 && data.specialNeedsCostsMonthly <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['specialNeedsCostsMonthly'],
        message: 'Please provide monthly spending on special needs support.',
      });
    }
    if (data.housingStatus !== 'owned' && data.expensesHousing <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expensesHousing'],
        message: 'Please provide your monthly rent or mortgage costs.',
      });
    }
    if (data.numberOfChildren === 0 && data.expensesChildcare > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expensesChildcare'],
        message: 'Childcare costs should be zero if there are no children.',
      });
    }
    if (data.numberOfChildren === 0 && data.childcareVouchersMonthly > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['childcareVouchersMonthly'],
        message: 'Childcare vouchers should be zero if there are no children.',
      });
    }
    if (data.blueprintFor !== 'family') {
      if (data.partnerPensionContributionMonthly > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerPensionContributionMonthly'],
          message: 'Partner contributions should be zero for an individual blueprint.',
        });
      }
      if (data.partnerIsaContributionMonthly > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerIsaContributionMonthly'],
          message: 'Partner ISA investing should be zero for an individual blueprint.',
        });
      }
    }
  });

export const step4Schema = z.object({
  cashSavings: moneyField('Cash savings'),
  emergencyFundBalance: moneyField('Emergency fund balance'),
  pensionValue: moneyField('Total pension value'),
  propertyValue: moneyField('Primary residence value'),
  isaInvestmentsValue: moneyField('Investments held within ISAs'),
  otherInvestments: moneyField('Other investments'),
  otherAssets: moneyField('Other significant assets'),
});

export const step5Schema = z
  .object({
    housingStatus: z.enum(['renting', 'mortgaged', 'owned']),
    mortgageBalance: moneyField('Outstanding mortgage balance'),
    mortgageInterestRatePercent: z.coerce
      .number({ required_error: 'Mortgage interest rate is required.' })
      .min(0, { message: 'Mortgage interest rate cannot be negative.' })
      .max(100, { message: 'Mortgage interest rate should be below 100%.' }),
    mortgageRemainingTermYears: z.coerce
      .number({ required_error: 'Mortgage remaining term is required.' })
      .min(0, { message: 'Mortgage term cannot be negative.' }),
    creditCardDebt: moneyField('Credit card debt'),
    otherLoans: moneyField('Other loan balances'),
    studentLoanBalance: moneyField('Student loan balance'),
    insurancePremiumsTotalMonthly: moneyField('Total monthly insurance premiums'),
  })
  .superRefine((data, ctx) => {
    if (data.housingStatus === 'mortgaged') {
      if (data.mortgageBalance <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mortgageBalance'],
          message: 'Please provide your outstanding mortgage balance.',
        });
      }
      if (data.mortgageInterestRatePercent <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mortgageInterestRatePercent'],
          message: 'Please provide your current mortgage interest rate.',
        });
      }
      if (data.mortgageRemainingTermYears <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mortgageBalance'],
          message: 'Please share how many years are left on your mortgage.',
        });
      }
    }
    if (data.housingStatus !== 'mortgaged') {
      if (data.mortgageBalance > 0 || data.mortgageInterestRatePercent > 0 || data.mortgageRemainingTermYears > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mortgageBalance'],
          message: 'Mortgage details should be zero if you do not have a mortgage.',
        });
      }
    }
  });

export const step6Schema = z.object({
  earningHabit: z.enum(['active', 'stable', 'passive'], {
    required_error: 'Please choose the option that best describes your earning habit.',
  }),
  savingHabit: z.enum(['disciplined', 'opportunistic', 'struggling'], {
    required_error: 'Please choose the option that best describes your saving habit.',
  }),
  investingHabit: z.enum(['confident', 'cautious', 'avoidant'], {
    required_error: 'Please choose the option that best describes your investing habit.',
  }),
  emergencySavingsConfidence: z.enum(['comfortable', 'building', 'concerned'], {
    required_error: 'Please share how you feel about your emergency savings.',
  }),
});

export const step7Schema = z
  .object({
    blueprintFor: z.enum(['individual', 'family']),
    hasWill: z.enum(['yes', 'no'], { required_error: 'Please confirm if you have a will.' }),
    hasLifeInsurance: z.enum(['yes', 'no'], {
      required_error: 'Please confirm if you have life insurance.',
    }),
    partnerHasLifeInsurance: z.enum(['yes', 'no']).optional(),
    lifeInsuranceBenefitAmount: moneyField('Life insurance benefit amount'),
    partnerLifeInsuranceBenefitAmount: moneyField("Partner's life insurance benefit amount"),
    hasIncomeProtection: z.enum(['yes', 'no'], {
      required_error: 'Please confirm if you have income protection insurance.',
    }),
    partnerHasIncomeProtection: z.enum(['yes', 'no']).optional(),
    incomeProtectionBenefitAmount: moneyField('Income protection monthly benefit'),
    partnerIncomeProtectionBenefitAmount: moneyField("Partner's income protection monthly benefit"),
    hasLPA: z.enum(['yes', 'no'], {
      required_error: 'Please confirm if you have a lasting power of attorney.',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.hasLifeInsurance === 'yes' && data.lifeInsuranceBenefitAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lifeInsuranceBenefitAmount'],
        message: 'Please share the total benefit amount for your life insurance.',
      });
    }
    if (data.hasLifeInsurance !== 'yes' && data.lifeInsuranceBenefitAmount > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lifeInsuranceBenefitAmount'],
        message: 'Life insurance benefit should be zero if you do not have cover.',
      });
    }
    if (data.blueprintFor === 'family') {
      if (!data.partnerHasLifeInsurance) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerHasLifeInsurance'],
          message: 'Please tell us if your partner has life insurance.',
        });
      }
      if (!data.partnerHasIncomeProtection) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerHasIncomeProtection'],
          message: 'Please tell us if your partner has income protection.',
        });
      }
      if (data.partnerHasLifeInsurance === 'yes' && data.partnerLifeInsuranceBenefitAmount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerLifeInsuranceBenefitAmount'],
          message: 'Please share your partner’s life insurance benefit amount.',
        });
      }
      if (
        data.partnerHasLifeInsurance !== 'yes' &&
        data.partnerLifeInsuranceBenefitAmount > 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerLifeInsuranceBenefitAmount'],
          message: 'Partner life insurance benefit should be zero if they have no cover.',
        });
      }
      if (
        data.partnerHasIncomeProtection === 'yes' &&
        data.partnerIncomeProtectionBenefitAmount <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerIncomeProtectionBenefitAmount'],
          message: 'Please share your partner’s income protection benefit amount.',
        });
      }
      if (
        data.partnerHasIncomeProtection !== 'yes' &&
        data.partnerIncomeProtectionBenefitAmount > 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerIncomeProtectionBenefitAmount'],
          message: 'Partner income protection benefit should be zero if they have no cover.',
        });
      }
    } else {
      if (data.partnerLifeInsuranceBenefitAmount > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerLifeInsuranceBenefitAmount'],
          message: 'Partner life insurance should be zero for an individual blueprint.',
        });
      }
      if (data.partnerIncomeProtectionBenefitAmount > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerIncomeProtectionBenefitAmount'],
          message: 'Partner income protection should be zero for an individual blueprint.',
        });
      }
    }
    if (data.hasIncomeProtection === 'yes' && data.incomeProtectionBenefitAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['incomeProtectionBenefitAmount'],
        message: 'Please share the expected monthly income protection benefit.',
      });
    }
    if (data.hasIncomeProtection !== 'yes' && data.incomeProtectionBenefitAmount > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['incomeProtectionBenefitAmount'],
        message: 'Income protection benefit should be zero if you have no cover.',
      });
    }
  });

export const step8Schema = z
  .object({
    blueprintFor: z.enum(['individual', 'family']),
    retirementTargetAge: z.coerce
      .number({ required_error: 'Your target retirement age is required.' })
      .min(50, { message: 'Retirement age should be at least 50.' })
      .max(80, { message: 'Please provide a realistic retirement age.' }),
    partnerRetirementTargetAge: z.coerce
      .number({ required_error: "Partner's target retirement age is required." })
      .min(0, { message: "Partner's retirement age cannot be negative." })
      .max(120, { message: 'Please provide a realistic retirement age for your partner.' })
      .optional(),
    retirementIncomeTargetMonthly: moneyField('Desired monthly retirement income'),
    partnerRetirementIncomeTargetMonthly: moneyField(
      "Partner's desired monthly retirement income"
    ),
    statePensionQualifyingYears: z.coerce
      .number({ required_error: 'Please share your qualifying years of National Insurance.' })
      .min(0, { message: 'Qualifying years cannot be negative.' })
      .max(60, { message: 'Please provide a realistic number of qualifying years.' }),
    statePensionLastStatementYear: z.coerce
      .number({ required_error: 'Please share when you last checked your state pension.' })
      .min(1990, { message: 'Please share a year after 1990.' })
      .max(new Date().getFullYear(), {
        message: 'Your last statement year cannot be in the future.',
      }),
    statePensionForecastAmountMonthly: moneyField('Estimated monthly state pension'),
  })
  .superRefine((data, ctx) => {
    if (data.blueprintFor !== 'family') {
      if (data.partnerRetirementTargetAge && data.partnerRetirementTargetAge > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerRetirementTargetAge'],
          message: 'Partner retirement age should be left blank for an individual blueprint.',
        });
      }
      if (data.partnerRetirementIncomeTargetMonthly > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerRetirementIncomeTargetMonthly'],
          message: 'Partner retirement income should be zero for an individual blueprint.',
        });
      }
    } else {
      if (!data.partnerRetirementTargetAge || data.partnerRetirementTargetAge < 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerRetirementTargetAge'],
          message: 'Please provide your partner’s target retirement age (between 50 and 80).',
        });
      } else if (data.partnerRetirementTargetAge > 80) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerRetirementTargetAge'],
          message: 'Please provide a realistic retirement age for your partner.',
        });
      }
      if (data.partnerRetirementIncomeTargetMonthly <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerRetirementIncomeTargetMonthly'],
          message: 'Please provide your partner’s desired retirement income.',
        });
      }
    }
  });

const optionalProviderField = (label) =>
  z
    .string()
    .trim()
    .max(120, { message: `${label} must be 120 characters or fewer.` });

const optionalNotesField = (label) =>
  z
    .string()
    .trim()
    .max(500, { message: `${label} must be 500 characters or fewer.` });

export const step9Schema = z
  .object({
    blueprintFor: z.enum(['individual', 'family']),
    hasLifeInsurance: z.enum(['yes', 'no']),
    partnerHasLifeInsurance: z.enum(['yes', 'no']).optional(),
    lifeInsuranceProvider: optionalProviderField('Life insurance provider'),
    lifeInsuranceSumAssured: moneyField('Life insurance sum assured'),
    lifeInsurancePremiumMonthlyDetail: moneyField('Life insurance premium (monthly)'),
    lifeInsuranceBeneficiaryNotes: optionalNotesField('Life insurance beneficiary notes'),
    hasIncomeProtection: z.enum(['yes', 'no']),
    partnerHasIncomeProtection: z.enum(['yes', 'no']).optional(),
    incomeProtectionProvider: optionalProviderField('Income protection insurer'),
    incomeProtectionBenefitMonthly: moneyField('Income protection monthly benefit'),
    incomeProtectionPremiumMonthlyDetail: moneyField('Income protection premium (monthly)'),
    incomeProtectionBeneficiaryNotes: optionalNotesField('Income protection beneficiary notes'),
    partnerLifeInsuranceProvider: optionalProviderField("Partner's life insurance provider"),
    partnerLifeInsuranceSumAssured: moneyField("Partner's life insurance sum assured"),
    partnerLifeInsurancePremiumMonthlyDetail: moneyField(
      "Partner's life insurance premium (monthly)"
    ),
    partnerLifeInsuranceBeneficiaryNotes: optionalNotesField(
      "Partner's life insurance beneficiary notes"
    ),
    partnerIncomeProtectionProvider: optionalProviderField("Partner's income protection insurer"),
    partnerIncomeProtectionBenefitMonthly: moneyField(
      "Partner's income protection monthly benefit"
    ),
    partnerIncomeProtectionPremiumMonthlyDetail: moneyField(
      "Partner's income protection premium (monthly)"
    ),
    partnerIncomeProtectionBeneficiaryNotes: optionalNotesField(
      "Partner's income protection beneficiary notes"
    ),
  })
  .superRefine((data, ctx) => {
    const ensureProvider = (condition, path, value, label) => {
      if (condition && (!value || value.length < 2)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path,
          message: `Please provide the ${label}.`,
        });
      }
    };
    if (data.hasLifeInsurance === 'yes') {
      if (data.lifeInsuranceSumAssured <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lifeInsuranceSumAssured'],
          message: 'Please provide the total sum assured for your life insurance.',
        });
      }
      ensureProvider(true, ['lifeInsuranceProvider'], data.lifeInsuranceProvider, 'life insurance provider');
      if (data.lifeInsurancePremiumMonthlyDetail <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lifeInsurancePremiumMonthlyDetail'],
          message: 'Please provide your monthly life insurance premium.',
        });
      }
    } else {
      if (data.lifeInsuranceSumAssured > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lifeInsuranceSumAssured'],
          message: 'Sum assured should be zero if you do not have life insurance.',
        });
      }
      if (data.lifeInsurancePremiumMonthlyDetail > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lifeInsurancePremiumMonthlyDetail'],
          message: 'Premiums should be zero if you do not have life insurance.',
        });
      }
    }
    if (data.hasIncomeProtection === 'yes') {
      if (data.incomeProtectionBenefitMonthly <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['incomeProtectionBenefitMonthly'],
          message: 'Please share the expected monthly income protection benefit.',
        });
      }
      ensureProvider(
        true,
        ['incomeProtectionProvider'],
        data.incomeProtectionProvider,
        'income protection insurer'
      );
      if (data.incomeProtectionPremiumMonthlyDetail <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['incomeProtectionPremiumMonthlyDetail'],
          message: 'Please provide your monthly income protection premium.',
        });
      }
    } else {
      if (data.incomeProtectionBenefitMonthly > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['incomeProtectionBenefitMonthly'],
          message: 'Benefit amount should be zero if you do not have income protection.',
        });
      }
      if (data.incomeProtectionPremiumMonthlyDetail > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['incomeProtectionPremiumMonthlyDetail'],
          message: 'Premiums should be zero if you do not have income protection.',
        });
      }
    }
    if (data.blueprintFor === 'family') {
      ensureProvider(
        data.partnerHasLifeInsurance === 'yes',
        ['partnerLifeInsuranceProvider'],
        data.partnerLifeInsuranceProvider,
        "partner's life insurance provider"
      );
      if (
        data.partnerHasLifeInsurance === 'yes' &&
        data.partnerLifeInsuranceSumAssured <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerLifeInsuranceSumAssured'],
          message: 'Please share your partner’s life insurance sum assured.',
        });
      }
      if (
        data.partnerHasLifeInsurance === 'yes' &&
        data.partnerLifeInsurancePremiumMonthlyDetail <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerLifeInsurancePremiumMonthlyDetail'],
          message: 'Please share your partner’s monthly life insurance premium.',
        });
      }
      if (
        data.partnerHasLifeInsurance !== 'yes' &&
        (data.partnerLifeInsuranceSumAssured > 0 || data.partnerLifeInsurancePremiumMonthlyDetail > 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerLifeInsuranceSumAssured'],
          message: 'Partner life insurance values should be zero if they have no cover.',
        });
      }
      if (
        data.partnerHasIncomeProtection === 'yes' &&
        data.partnerIncomeProtectionBenefitMonthly <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerIncomeProtectionBenefitMonthly'],
          message: 'Please share your partner’s income protection benefit amount.',
        });
      }
      ensureProvider(
        data.partnerHasIncomeProtection === 'yes',
        ['partnerIncomeProtectionProvider'],
        data.partnerIncomeProtectionProvider,
        "partner's income protection insurer"
      );
      if (
        data.partnerHasIncomeProtection === 'yes' &&
        data.partnerIncomeProtectionPremiumMonthlyDetail <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerIncomeProtectionPremiumMonthlyDetail'],
          message: 'Please share your partner’s monthly income protection premium.',
        });
      }
      if (
        data.partnerHasIncomeProtection !== 'yes' &&
        (data.partnerIncomeProtectionBenefitMonthly > 0 ||
          data.partnerIncomeProtectionPremiumMonthlyDetail > 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerIncomeProtectionBenefitMonthly'],
          message: 'Partner income protection values should be zero if they have no cover.',
        });
      }
    } else {
      if (data.partnerLifeInsuranceSumAssured > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerLifeInsuranceSumAssured'],
          message: 'Partner values should be zero for an individual blueprint.',
        });
      }
      if (data.partnerIncomeProtectionBenefitMonthly > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['partnerIncomeProtectionBenefitMonthly'],
          message: 'Partner values should be zero for an individual blueprint.',
        });
      }
    }
  });
