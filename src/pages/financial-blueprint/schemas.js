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
    partnerAge: z
      .preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
        z
          .number({ required_error: "Partner's age must be at least 18." })
          .min(18, { message: "Partner's age must be at least 18." })
          .max(110, { message: 'Please provide a realistic partner age.' })
      )
      .optional(),
    profession: z
      .string({ required_error: 'Profession is required.' })
      .min(2, { message: 'Please provide a valid profession.' }),
    partnerProfession: z
      .preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : val),
        z.string().min(2, { message: "Partner's profession is required." })
      )
      .optional(),
    numberOfChildren: integerField('Number of children'),
    specialNeedsChildren: integerField('Number of children with special needs'),
    specialNeedsSupport: z
      .preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : val),
        z
          .string({ required_error: 'Please describe the support requirements.' })
          .min(3, { message: 'Please add a short description of support needs.' })
      )
      .optional(),
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

export const step3Schema = z.object({
  calculatedGrossAnnualIncome: moneyField('Calculated gross annual income'),
  calculatedTaxableIncome: moneyField('Calculated taxable income'),
  calculatedIncomeTaxAnnual: moneyField('Calculated income tax'),
  calculatedNationalInsuranceAnnual: moneyField('Calculated National Insurance'),
  calculatedNetAnnualIncome: moneyField('Calculated net annual income'),
  calculatedNetMonthlyIncome: moneyField('Calculated net monthly income'),
});

export const step4Schema = z
  .object({
    expensesHousing: moneyField('Housing costs'),
    expensesUtilities: moneyField('Utilities'),
    expensesGroceries: moneyField('Groceries'),
    expensesTransport: moneyField('Transport'),
    expensesLifestyle: moneyField('Lifestyle & entertainment'),
    expensesChildcare: moneyField('Childcare & education'),
    specialNeedsCostsMonthly: moneyField('Special needs support costs'),
    numberOfChildren: integerField('Number of children'),
    specialNeedsChildren: integerField('Number of children with special needs'),
  })
  .superRefine((data, ctx) => {
    if (data.specialNeedsChildren > 0 && data.specialNeedsCostsMonthly <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['specialNeedsCostsMonthly'],
        message: 'Please provide monthly spending on special needs support.',
      });
    }
    if (data.numberOfChildren === 0 && data.expensesChildcare > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expensesChildcare'],
        message: 'Childcare costs should be zero if there are no children.',
      });
    }
  });

export const step5Schema = z.object({
  cashSavings: moneyField('Cash savings'),
  pensionValue: moneyField('Total pension value'),
  propertyValue: moneyField('Primary residence value'),
  otherInvestments: moneyField('Other investments'),
  otherAssets: moneyField('Other significant assets'),
});

export const step6Schema = z
  .object({
    housingStatus: z.enum(['renting', 'mortgaged', 'owned']),
    monthlyRent: moneyField('Monthly rent'),
    mortgageBalance: moneyField('Outstanding mortgage balance'),
    mortgageMonthlyPayment: moneyField('Monthly mortgage payment'),
    mortgageRemainingTermYears: z.coerce
      .number({ required_error: 'Mortgage remaining term is required.' })
      .min(0, { message: 'Mortgage term cannot be negative.' }),
    creditCardDebt: moneyField('Credit card debt'),
    otherLoans: moneyField('Other loan balances'),
    studentLoanBalance: moneyField('Student loan balance'),
  })
  .superRefine((data, ctx) => {
    if (data.housingStatus === 'renting') {
      if (data.monthlyRent <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['monthlyRent'],
          message: 'Please enter your monthly rent.',
        });
      }
      if (data.mortgageBalance > 0 || data.mortgageMonthlyPayment > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mortgageBalance'],
          message: 'Mortgage values should be zero if you are renting.',
        });
      }
    }
    if (data.housingStatus === 'mortgaged') {
      if (data.mortgageBalance <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mortgageBalance'],
          message: 'Please provide your outstanding mortgage balance.',
        });
      }
      if (data.mortgageMonthlyPayment <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mortgageMonthlyPayment'],
          message: 'Please provide your monthly mortgage payment.',
        });
      }
    }
    if (data.housingStatus === 'owned') {
      if (data.mortgageBalance > 0 || data.mortgageMonthlyPayment > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mortgageBalance'],
          message: 'Mortgage fields should be zero if the property is owned outright.',
        });
      }
    }
  });

export const step7Schema = z.object({
  earningHabit: z.enum(['active', 'stable', 'passive'], {
    required_error: 'Please choose the option that best describes your earning habit.',
  }),
  savingHabit: z.enum(['disciplined', 'opportunistic', 'struggling'], {
    required_error: 'Please choose the option that best describes your saving habit.',
  }),
  investingHabit: z.enum(['confident', 'cautious', 'avoidant'], {
    required_error: 'Please choose the option that best describes your investing habit.',
  }),
});

export const step8Schema = z.object({
  hasWill: z.enum(['yes', 'no'], { required_error: 'Please confirm if you have a will.' }),
  hasLifeInsurance: z.enum(['yes', 'no'], {
    required_error: 'Please confirm if you have life insurance.',
  }),
  hasIncomeProtection: z.enum(['yes', 'no'], {
    required_error: 'Please confirm if you have income protection insurance.',
  }),
  hasLPA: z.enum(['yes', 'no'], {
    required_error: 'Please confirm if you have a lasting power of attorney.',
  }),
});
