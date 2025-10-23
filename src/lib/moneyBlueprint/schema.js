import { z } from 'zod';

const numericPattern = /^(\d+)([\.,]\d{1,2})?$/;

const coerceNumberString = (value) => value.replace(/,/g, '').replace(/\s+/g, '');

const basicsSchema = z
  .object({
    planName: z
      .string()
      .trim()
      .refine((value) => value.length === 0 || value.length >= 3, {
        message: 'Give your blueprint a nickname of at least 3 characters or leave it blank.',
      }),
    householdSize: z
      .string({ required_error: 'Enter how many people rely on this plan.' })
      .trim()
      .min(1, 'Enter how many people rely on this plan.')
      .refine((value) => /^\d+$/.test(value), {
        message: 'Use whole numbers when counting people.',
      })
      .refine((value) => Number.parseInt(value, 10) >= 1 && Number.parseInt(value, 10) <= 12, {
        message: 'Enter a household size between 1 and 12.',
      }),
    netIncome: z
      .string({ required_error: 'Enter your combined take-home pay.' })
      .trim()
      .min(1, 'Enter your combined take-home pay.')
      .transform((value) => coerceNumberString(value))
      .refine((value) => numericPattern.test(value), {
        message: 'Use numbers only, you can include up to 2 decimal places.',
      })
      .refine((value) => Number.parseFloat(value) > 0, {
        message: 'Enter an amount greater than zero.',
      }),
    incomeFrequency: z
      .string({ required_error: 'Choose how often you receive this income.' })
      .trim()
      .min(1, 'Choose how often you receive this income.'),
    region: z
      .string({ required_error: 'Pick the region you live in.' })
      .trim()
      .min(1, 'Pick the region you live in.'),
    focus: z
      .string({ required_error: 'Select the money focus guiding your blueprint.' })
      .trim()
      .min(1, 'Select the money focus guiding your blueprint.'),
  })
  .strict();

const prioritiesSchema = z
  .object({
    goalAreas: z
      .array(z.string().trim().min(1))
      .min(1, 'Select at least one goal area to continue.'),
    topGoal: z
      .string({ required_error: 'Describe your number one outcome.' })
      .trim()
      .min(10, 'Describe your number one outcome using at least 10 characters.'),
    savingsTarget: z
      .string()
      .trim()
      .refine((value) => value.length === 0 || numericPattern.test(coerceNumberString(value)), {
        message: 'Use numbers only, you can include up to 2 decimal places.',
      })
      .refine((value) => value.length === 0 || Number.parseFloat(coerceNumberString(value)) > 0, {
        message: 'Enter an amount greater than zero or leave this blank.',
      }),
    timeline: z
      .string({ required_error: 'Choose the timeline that fits your goal.' })
      .trim()
      .min(1, 'Choose the timeline that fits your goal.'),
  })
  .strict();

const habitsSchema = z
  .object({
    budgetingStyle: z
      .string({ required_error: 'Select the budgeting style that fits best.' })
      .trim()
      .min(1, 'Select the budgeting style that fits best.'),
    checkInFrequency: z
      .string({ required_error: 'Choose how often you review your money.' })
      .trim()
      .min(1, 'Choose how often you review your money.'),
    emergencyFundMonths: z
      .string({ required_error: 'Share how many months your emergency fund covers.' })
      .trim()
      .min(1, 'Share how many months your emergency fund covers.'),
    confidenceLevel: z
      .string({ required_error: 'Tell us how confident you feel about money right now.' })
      .trim()
      .min(1, 'Tell us how confident you feel about money right now.'),
    additionalNotes: z
      .string()
      .trim()
      .refine((value) => value.length <= 800, {
        message: 'Keep notes under 800 characters.',
      }),
  })
  .strict();

const summarySchema = z
  .object({
    shareEmail: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || /^(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})$/i.test(value),
        {
          message: 'Enter a valid email address or leave this blank.',
        }
      ),
    consentToContact: z.boolean(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.consentToContact && value.shareEmail.length === 0) {
      ctx.addIssue({
        path: ['shareEmail'],
        code: z.ZodIssueCode.custom,
        message: 'Add your email so we can send the reminder.',
      });
    }
  });

export const moneyBlueprintStepSchemas = {
  basics: basicsSchema,
  priorities: prioritiesSchema,
  habits: habitsSchema,
  summary: summarySchema,
};

export const moneyBlueprintSchema = z.object(moneyBlueprintStepSchemas).strict();

export const MONEY_BLUEPRINT_GUIDANCE = {
  basics: {
    title: 'Tips for the basics step',
    points: [
      'Include everyone who shares the same household pot, even if income fluctuates.',
      'Use your usual net pay after tax. A rounded monthly figure is fine.',
      'Pick the focus that best reflects what you want to change this year.',
    ],
  },
  priorities: {
    title: 'Tips for choosing priorities',
    points: [
      'Select the goal areas that will unlock the most progress for you.',
      'Use the headline goal to capture the result you want to see.',
      'Add a target amount if it helps you measure success.',
    ],
  },
  habits: {
    title: 'Tips for habits & safety nets',
    points: [
      'Pick the budgeting style you follow most of the time, even if it is not perfect.',
      'Your confidence level helps us tailor the follow-up actions.',
      'Estimate how many months of expenses your emergency fund covers.',
    ],
  },
  summary: {
    title: 'Tips before you generate your blueprint',
    points: [
      'Double-check the highlights in the summary card before locking in.',
      'Share your email if you would like a reminder – we only store it with your consent.',
      'You can revisit any step later; updating answers will refresh your share code.',
    ],
  },
};

export function validateMoneyBlueprintStep(stepId, stepData) {
  const schema = moneyBlueprintStepSchemas[stepId];
  if (!schema) {
    return { success: true, errors: {}, issues: [] };
  }

  const result = schema.safeParse(stepData ?? {});
  if (result.success) {
    return { success: true, errors: {}, issues: [] };
  }

  const errors = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path?.[0] ?? 'root';
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  });

  return { success: false, errors, issues: result.error.issues };
}

export function validateMoneyBlueprint(data) {
  return moneyBlueprintSchema.safeParse(data ?? {});
}
