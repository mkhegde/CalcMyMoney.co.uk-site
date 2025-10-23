const numericPattern = /^(\d+)([\.,]\d{1,2})?$/;
const emailPattern = /^(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})$/i;

const coerceNumberString = (value) => value.replace(/,/g, '').replace(/\s+/g, '');

const toTrimmedString = (value) => {
  if (value == null) return '';
  return String(value).trim();
};

const normaliseGoalAreas = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
};

const createIssue = (field, message) => ({ path: [field], code: 'custom', message });

const buildResult = (errors, issues, data) => ({
  result: {
    success: Object.keys(errors).length === 0,
    errors,
    issues,
  },
  data,
});

const validateBasics = (values = {}) => {
  const errors = {};
  const issues = [];

  const planName = toTrimmedString(values.planName ?? '');
  const householdSizeRaw = toTrimmedString(values.householdSize ?? '');
  const incomeRaw = toTrimmedString(values.netIncome ?? '');
  const incomeFrequency = toTrimmedString(values.incomeFrequency ?? '');
  const region = toTrimmedString(values.region ?? '');
  const focus = toTrimmedString(values.focus ?? '');

  if (planName && planName.length < 3) {
    errors.planName = 'Give your blueprint a nickname of at least 3 characters or leave it blank.';
    issues.push(createIssue('planName', errors.planName));
  }

  if (!householdSizeRaw) {
    errors.householdSize = 'Enter how many people rely on this plan.';
    issues.push(createIssue('householdSize', errors.householdSize));
  } else if (!/^\d+$/.test(householdSizeRaw)) {
    errors.householdSize = 'Use whole numbers when counting people.';
    issues.push(createIssue('householdSize', errors.householdSize));
  } else {
    const householdSizeValue = Number.parseInt(householdSizeRaw, 10);
    if (householdSizeValue < 1 || householdSizeValue > 12) {
      errors.householdSize = 'Enter a household size between 1 and 12.';
      issues.push(createIssue('householdSize', errors.householdSize));
    }
  }

  let netIncome = incomeRaw;
  if (!incomeRaw) {
    errors.netIncome = 'Enter your combined take-home pay.';
    issues.push(createIssue('netIncome', errors.netIncome));
  } else {
    const coerced = coerceNumberString(incomeRaw);
    netIncome = coerced;
    if (!numericPattern.test(coerced)) {
      errors.netIncome = 'Use numbers only, you can include up to 2 decimal places.';
      issues.push(createIssue('netIncome', errors.netIncome));
    } else if (Number.parseFloat(coerced) <= 0) {
      errors.netIncome = 'Enter an amount greater than zero.';
      issues.push(createIssue('netIncome', errors.netIncome));
    }
  }

  if (!incomeFrequency) {
    errors.incomeFrequency = 'Choose how often you receive this income.';
    issues.push(createIssue('incomeFrequency', errors.incomeFrequency));
  }

  if (!region) {
    errors.region = 'Pick the region you live in.';
    issues.push(createIssue('region', errors.region));
  }

  if (!focus) {
    errors.focus = 'Select the money focus guiding your blueprint.';
    issues.push(createIssue('focus', errors.focus));
  }

  return buildResult(errors, issues, {
    planName,
    householdSize: householdSizeRaw,
    netIncome,
    incomeFrequency,
    region,
    focus,
  });
};

const validatePriorities = (values = {}) => {
  const errors = {};
  const issues = [];

  const goalAreas = normaliseGoalAreas(values.goalAreas);
  const topGoalRaw = values.topGoal;
  const topGoal = toTrimmedString(values.topGoal ?? '');
  const savingsTargetRaw = toTrimmedString(values.savingsTarget ?? '');
  const timeline = toTrimmedString(values.timeline ?? '');

  if (goalAreas.length === 0) {
    errors.goalAreas = 'Select at least one goal area to continue.';
    issues.push(createIssue('goalAreas', errors.goalAreas));
  }

  if (topGoalRaw === undefined) {
    errors.topGoal = 'Describe your number one outcome.';
    issues.push(createIssue('topGoal', errors.topGoal));
  } else if (topGoal.length < 10) {
    errors.topGoal = 'Describe your number one outcome using at least 10 characters.';
    issues.push(createIssue('topGoal', errors.topGoal));
  }

  if (savingsTargetRaw) {
    const coerced = coerceNumberString(savingsTargetRaw);
    if (!numericPattern.test(coerced)) {
      errors.savingsTarget = 'Use numbers only, you can include up to 2 decimal places.';
      issues.push(createIssue('savingsTarget', errors.savingsTarget));
    } else if (Number.parseFloat(coerced) <= 0) {
      errors.savingsTarget = 'Enter an amount greater than zero or leave this blank.';
      issues.push(createIssue('savingsTarget', errors.savingsTarget));
    }
  }

  if (!timeline) {
    errors.timeline = 'Choose the timeline that fits your goal.';
    issues.push(createIssue('timeline', errors.timeline));
  }

  return buildResult(errors, issues, {
    goalAreas,
    topGoal,
    savingsTarget: savingsTargetRaw,
    timeline,
  });
};

const validateHabits = (values = {}) => {
  const errors = {};
  const issues = [];

  const budgetingStyle = toTrimmedString(values.budgetingStyle ?? '');
  const checkInFrequency = toTrimmedString(values.checkInFrequency ?? '');
  const emergencyFundMonths = toTrimmedString(values.emergencyFundMonths ?? '');
  const confidenceLevel = toTrimmedString(values.confidenceLevel ?? '');
  const additionalNotes = toTrimmedString(values.additionalNotes ?? '');

  if (!budgetingStyle) {
    errors.budgetingStyle = 'Select the budgeting style that fits best.';
    issues.push(createIssue('budgetingStyle', errors.budgetingStyle));
  }

  if (!checkInFrequency) {
    errors.checkInFrequency = 'Choose how often you review your money.';
    issues.push(createIssue('checkInFrequency', errors.checkInFrequency));
  }

  if (!emergencyFundMonths) {
    errors.emergencyFundMonths = 'Share how many months your emergency fund covers.';
    issues.push(createIssue('emergencyFundMonths', errors.emergencyFundMonths));
  }

  if (!confidenceLevel) {
    errors.confidenceLevel = 'Tell us how confident you feel about money right now.';
    issues.push(createIssue('confidenceLevel', errors.confidenceLevel));
  }

  if (additionalNotes.length > 800) {
    errors.additionalNotes = 'Keep notes under 800 characters.';
    issues.push(createIssue('additionalNotes', errors.additionalNotes));
  }

  return buildResult(errors, issues, {
    budgetingStyle,
    checkInFrequency,
    emergencyFundMonths,
    confidenceLevel,
    additionalNotes,
  });
};

const validateSummary = (values = {}) => {
  const errors = {};
  const issues = [];

  const shareEmail = toTrimmedString(values.shareEmail ?? '');
  const consentToContact = Boolean(values.consentToContact);

  if (shareEmail && !emailPattern.test(shareEmail)) {
    errors.shareEmail = 'Enter a valid email address or leave this blank.';
    issues.push(createIssue('shareEmail', errors.shareEmail));
  }

  if (consentToContact && shareEmail.length === 0) {
    errors.shareEmail = 'Add your email so we can send the reminder.';
    issues.push(createIssue('shareEmail', errors.shareEmail));
  }

  return buildResult(errors, issues, {
    shareEmail,
    consentToContact,
  });
};

const moneyBlueprintStepValidators = {
  basics: validateBasics,
  priorities: validatePriorities,
  habits: validateHabits,
  summary: validateSummary,
};

export const moneyBlueprintStepSchemas = moneyBlueprintStepValidators;

export const moneyBlueprintSchema = {
  safeParse(input = {}) {
    const data = input ?? {};
    const parsed = {};
    const issues = [];
    let success = true;

    for (const [stepId, validator] of Object.entries(moneyBlueprintStepValidators)) {
      const { result, data: stepData } = validator(data[stepId] ?? {});
      parsed[stepId] = stepData;
      if (!result.success) {
        success = false;
        result.issues.forEach((issue) => {
          issues.push({
            path: [stepId, ...(issue.path ?? [])],
            code: issue.code ?? 'custom',
            message: issue.message,
          });
        });
      }
    }

    if (success) {
      return { success: true, data: parsed };
    }

    return { success: false, error: { issues } };
  },
};

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
  const validator = moneyBlueprintStepValidators[stepId];
  if (!validator) {
    return { success: true, errors: {}, issues: [] };
  }

  const { result } = validator(stepData ?? {});
  return result;
}

export function validateMoneyBlueprint(data) {
  return moneyBlueprintSchema.safeParse(data ?? {});
}
