import * as React from 'react';

const REPORT_ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const REPORT_ID_LENGTH = 12;

const DEFAULT_STEPS = [
  {
    id: 'basics',
    title: 'Blueprint basics',
    description: 'Capture the household details that shape your plan.',
  },
  {
    id: 'priorities',
    title: 'Money priorities',
    description: 'Choose the goals you want to focus on first.',
  },
  {
    id: 'habits',
    title: 'Habits & safety nets',
    description: 'Understand how you currently manage your money.',
  },
  {
    id: 'summary',
    title: 'Summary & sharing',
    description: 'Review your blueprint and share the anonymised report.',
  },
];

const DEFAULT_DATA = {
  basics: {
    planName: '',
    householdSize: '',
    netIncome: '',
    incomeFrequency: 'monthly',
    region: '',
    focus: '',
  },
  priorities: {
    goalAreas: [],
    topGoal: '',
    savingsTarget: '',
    timeline: '',
  },
  habits: {
    budgetingStyle: '',
    checkInFrequency: '',
    emergencyFundMonths: '',
    confidenceLevel: '',
    additionalNotes: '',
  },
  summary: {
    shareEmail: '',
    consentToContact: false,
  },
};

const cloneData = (value) => JSON.parse(JSON.stringify(value ?? {}));

const createReportId = () => {
  const alphabet = REPORT_ID_ALPHABET;
  const length = REPORT_ID_LENGTH;

  const fallback = () =>
    Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');

  const cryptoSource =
    typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : undefined;

  if (cryptoSource?.randomUUID) {
    const raw = cryptoSource.randomUUID().replace(/-/g, '').toUpperCase();
    if (raw.length >= length) {
      return raw.slice(0, length);
    }
    return (raw + fallback()).slice(0, length);
  }

  if (cryptoSource?.getRandomValues) {
    const array = cryptoSource.getRandomValues(new Uint32Array(length));
    return Array.from(array, (value) => alphabet[value % alphabet.length]).join('');
  }

  return fallback();
};

export const MONEY_BLUEPRINT_STEPS = DEFAULT_STEPS;
export const MONEY_BLUEPRINT_DEFAULT_DATA = DEFAULT_DATA;

export function useMoneyBlueprintWizard(options = {}) {
  const { steps: stepsProp, initialData, idFactory } = options ?? {};

  const getInitialData = React.useCallback(
    () => cloneData(initialData && Object.keys(initialData).length ? initialData : DEFAULT_DATA),
    [initialData]
  );

  const getReportId = React.useCallback(() => {
    if (typeof idFactory === 'function') {
      try {
        const candidate = idFactory();
        if (candidate && typeof candidate === 'string') {
          return candidate;
        }
      } catch (error) {
        if (import.meta?.env?.DEV) {
          // eslint-disable-next-line no-console
          console.warn('useMoneyBlueprintWizard: idFactory threw an error', error);
        }
      }
    }

    return createReportId();
  }, [idFactory]);

  const resolvedSteps = React.useMemo(() => {
    const baseSteps = Array.isArray(stepsProp) && stepsProp.length ? stepsProp : DEFAULT_STEPS;

    return baseSteps.map((step, index) => {
      const safeStep = step ?? {};
      return {
        ...safeStep,
        id: safeStep.id ?? `step-${index + 1}`,
        title: safeStep.title ?? `Step ${index + 1}`,
        description: safeStep.description ?? '',
        index,
      };
    });
  }, [stepsProp]);

  const firstStepId = resolvedSteps[0]?.id;

  const [data, setData] = React.useState(() => getInitialData());
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [status, setStatus] = React.useState('collecting');
  const [completedAt, setCompletedAt] = React.useState(null);
  const [reportId, setReportId] = React.useState(() => getReportId());
  const [visitedStepIds, setVisitedStepIds] = React.useState(() => (firstStepId ? [firstStepId] : []));

  const totalSteps = resolvedSteps.length;

  React.useEffect(() => {
    if (totalSteps === 0) return;
    if (currentStepIndex > totalSteps - 1) {
      setCurrentStepIndex(totalSteps - 1);
    }
  }, [currentStepIndex, totalSteps]);

  React.useEffect(() => {
    const currentStep = resolvedSteps[currentStepIndex];
    if (!currentStep) return;

    setVisitedStepIds((prev) => {
      if (!Array.isArray(prev)) return [currentStep.id];
      if (prev.includes(currentStep.id)) return prev;
      return [...prev, currentStep.id];
    });
  }, [currentStepIndex, resolvedSteps]);

  const currentStep = resolvedSteps[Math.min(currentStepIndex, totalSteps - 1)] ?? null;
  const progress = totalSteps > 0 ? (Math.min(currentStepIndex, totalSteps - 1) + 1) / totalSteps : 0;
  const progressPercent = Math.round(progress * 100);
  const hasNext = currentStepIndex < totalSteps - 1;
  const hasPrevious = currentStepIndex > 0;
  const remainingSteps = totalSteps > 0 ? Math.max(totalSteps - currentStepIndex - 1, 0) : 0;

  const stepStatuses = React.useMemo(
    () =>
      resolvedSteps.map((step, index) => {
        if (index < currentStepIndex) return 'complete';
        if (index === currentStepIndex) return status === 'completed' ? 'complete' : 'current';
        return 'upcoming';
      }),
    [resolvedSteps, currentStepIndex, status]
  );

  const updateStepData = React.useCallback(
    (stepId, patch) => {
      if (!stepId) return;

      setData((prev) => {
        const previousStepState = prev?.[stepId];
        const nextStepState =
          typeof patch === 'function'
            ? patch(previousStepState ?? {})
            : { ...(previousStepState ?? {}), ...(patch ?? {}) };

        return {
          ...prev,
          [stepId]: nextStepState,
        };
      });

      if (status === 'completed') {
        setStatus('collecting');
        setCompletedAt(null);
      }
    },
    [status]
  );

  const clearStepData = React.useCallback(
    (stepId) => {
      if (!stepId) return;

      setData((prev) => {
        const base = getInitialData();
        const next = { ...(prev ?? {}) };
        next[stepId] = cloneData(base?.[stepId] ?? {});
        return next;
      });

      if (status === 'completed') {
        setStatus('collecting');
        setCompletedAt(null);
      }
    },
    [getInitialData, status]
  );

  const clearAllData = React.useCallback(() => {
    setData(getInitialData());
    if (status === 'completed') {
      setStatus('collecting');
      setCompletedAt(null);
    }
  }, [getInitialData, status]);

  const goToStep = React.useCallback(
    (index) => {
      if (typeof index !== 'number' || Number.isNaN(index)) return;
      const clamped = Math.max(0, Math.min(Math.trunc(index), totalSteps - 1));
      setCurrentStepIndex(clamped);
    },
    [totalSteps]
  );

  const nextStep = React.useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const previousStep = React.useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = React.useCallback(() => {
    setData(getInitialData());
    setCurrentStepIndex(0);
    setStatus('collecting');
    setCompletedAt(null);
    setVisitedStepIds(firstStepId ? [firstStepId] : []);
    setReportId(getReportId());
  }, [getInitialData, firstStepId, getReportId]);

  const completeWizard = React.useCallback(() => {
    const finalId = reportId || getReportId();
    if (!reportId) {
      setReportId(finalId);
    }

    const timestamp = new Date().toISOString();
    setStatus('completed');
    setCompletedAt(timestamp);
    setVisitedStepIds((prev) => {
      const existing = Array.isArray(prev) ? new Set(prev) : new Set();
      resolvedSteps.forEach((step) => existing.add(step.id));
      return Array.from(existing);
    });

    return { reportId: finalId, completedAt: timestamp };
  }, [getReportId, reportId, resolvedSteps]);

  return {
    steps: resolvedSteps,
    stepStatuses,
    totalSteps,
    currentStep,
    currentStepIndex,
    currentStepId: currentStep?.id ?? null,
    isFirstStep: !hasPrevious,
    isLastStep: !hasNext,
    hasNext,
    hasPrevious,
    remainingSteps,
    progress,
    progressPercent,
    visitedStepIds,
    data,
    status,
    completedAt,
    reportId,
    updateStepData,
    clearStepData,
    clearAllData,
    goToStep,
    nextStep,
    previousStep,
    reset,
    completeWizard,
  };
}
