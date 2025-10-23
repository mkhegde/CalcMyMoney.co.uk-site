import React from 'react';
import {
  Lightbulb,
  Target,
  ShieldCheck,
  ClipboardCheck,
  RefreshCcw,
  Copy,
  Sparkles,
  FileDown,
  FileSpreadsheet,
  Eraser,
} from 'lucide-react';

import Heading from '@/components/common/Heading';
import { PrivacyAssuranceBanner } from '@/components/alerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { WizardStepper, WizardNavigation, StepGuidance } from '@/components/wizard';
import {
  useMoneyBlueprintWizard,
  MONEY_BLUEPRINT_DEFAULT_DATA,
} from '@/hooks/use-money-blueprint-wizard';
import {
  MONEY_BLUEPRINT_GUIDANCE,
  validateMoneyBlueprintStep,
} from '@/lib/moneyBlueprint/schema';
import {
  generateMoneyBlueprintPdf,
  generateMoneyBlueprintCsv,
} from '@/lib/moneyBlueprint/report';
import { cn } from '@/lib/utils';

const regionOptions = [
  { value: 'england', label: 'England' },
  { value: 'scotland', label: 'Scotland' },
  { value: 'wales', label: 'Wales' },
  { value: 'northern-ireland', label: 'Northern Ireland' },
];

const focusOptions = [
  { value: 'stability', label: 'Build stability' },
  { value: 'debt', label: 'Reduce debt' },
  { value: 'home', label: 'Save for a home move' },
  { value: 'growth', label: 'Grow savings & investments' },
  { value: 'future-proof', label: 'Prepare for life changes' },
];

const priorityOptions = [
  {
    value: 'emergency-fund',
    label: 'Build or top up my emergency fund',
    description: 'Create a cushion that covers essential bills if income drops.',
  },
  {
    value: 'clear-debt',
    label: 'Pay down expensive debt faster',
    description: 'Tackle credit cards, overdrafts or loans that are costing the most.',
  },
  {
    value: 'home-purchase',
    label: 'Save for a home or renovation',
    description: 'Grow a deposit or build a renovation fund without derailing other plans.',
  },
  {
    value: 'retirement',
    label: 'Boost retirement contributions',
    description: 'Increase pension or ISA investments for long-term security.',
  },
  {
    value: 'family-milestones',
    label: 'Prepare for family milestones',
    description: 'Budget for childcare, school, university or caring responsibilities.',
  },
  {
    value: 'upgrade-budgeting',
    label: 'Improve budgeting habits',
    description: 'Stay on top of spending, automate savings and reduce friction.',
  },
];

const timelineOptions = [
  { value: '0-3', label: '0 - 3 months' },
  { value: '3-6', label: '3 - 6 months' },
  { value: '6-12', label: '6 - 12 months' },
  { value: '12+', label: '12 months or longer' },
];

const budgetingStyles = [
  {
    value: 'detailed',
    title: 'Detailed planner',
    description: 'I use a spreadsheet or app to plan every pound.',
  },
  {
    value: 'guided',
    title: 'Guided tracker',
    description: 'I track key categories but allow some flexibility.',
  },
  {
    value: 'reactive',
    title: 'Reactive responder',
    description: 'I review after spending and adjust when needed.',
  },
];

const confidenceOptions = [
  { value: 'finding-feet', label: 'Still finding my feet' },
  { value: 'steady', label: 'Steady most months' },
  { value: 'confident', label: 'Confident and consistent' },
];

const checkInOptions = [
  { value: 'weekly', label: 'Weekly check-ins' },
  { value: 'fortnightly', label: 'Every couple of weeks' },
  { value: 'monthly', label: 'Once a month' },
  { value: 'ad-hoc', label: 'Only when something changes' },
];

const emergencyFundOptions = [
  { value: 'less-1', label: 'Less than 1 month' },
  { value: '1-3', label: '1 - 3 months' },
  { value: '3-6', label: '3 - 6 months' },
  { value: '6+', label: 'More than 6 months' },
];

const stepIcons = {
  basics: Lightbulb,
  priorities: Target,
  habits: ShieldCheck,
  summary: ClipboardCheck,
};

const fallbackData = MONEY_BLUEPRINT_DEFAULT_DATA;

const createInitialTouchedState = () => ({
  basics: {},
  priorities: {},
  habits: {},
  summary: {},
});

const createInitialSubmitAttempts = () => ({
  basics: 0,
  priorities: 0,
  habits: 0,
  summary: 0,
});

const PRIVACY_NOTICE_INTRO =
  'We never store your Money Blueprint answers on our servers. Everything stays on this device unless you export or share it yourself.';
const CLEAR_CONTROLS_NOTE =
  'Use the Start over or Clear step options whenever you want to wipe answers mid-session.';
const PRIVACY_NOTICE_SUMMARY =
  'Even after generating a share code, your answers remain on this device. Use Start over or Clear step to wipe them, or clear your browser data to remove everything.';
const PROFESSIONAL_ADVICE_NOTICE =
  'This planner offers educational guidance only. Speak with a regulated financial adviser for personalised recommendations before making financial decisions.';

const formatCurrency = (value) => {
  if (!value) return 'Not set';
  const numeric = Number.parseFloat(String(value).replace(/,/g, ''));
  if (!Number.isFinite(numeric)) return value;
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch (error) {
    return `£${numeric.toFixed(0)}`;
  }
};

export default function MyMoneyBlueprint() {
  const {
    steps,
    currentStep,
    currentStepIndex,
    currentStepId,
    isFirstStep,
    isLastStep,
    progressPercent,
    visitedStepIds,
    data,
    status,
    completedAt,
    reportId,
    updateStepData,
    clearStepData,
    nextStep,
    previousStep,
    goToStep,
    reset,
    completeWizard,
  } = useMoneyBlueprintWizard();
  const { toast } = useToast();

  const basics = React.useMemo(
    () => ({ ...fallbackData.basics, ...(data?.basics || {}) }),
    [data?.basics]
  );
  const priorities = React.useMemo(
    () => ({ ...fallbackData.priorities, ...(data?.priorities || {}) }),
    [data?.priorities]
  );
  const habits = React.useMemo(
    () => ({ ...fallbackData.habits, ...(data?.habits || {}) }),
    [data?.habits]
  );
  const summary = React.useMemo(
    () => ({ ...fallbackData.summary, ...(data?.summary || {}) }),
    [data?.summary]
  );

  const blueprintReport = React.useMemo(
    () => ({
      basics,
      priorities,
      habits,
      summary,
      reportId,
      completedAt,
      status,
    }),
    [basics, priorities, habits, summary, reportId, completedAt, status]
  );

  const fileBaseName = React.useMemo(() => {
    const slug = reportId ? reportId.replace(/\s+/g, '').toLowerCase() : 'draft';
    return `money-blueprint-${slug}`;
  }, [reportId]);

  const [touchedFields, setTouchedFields] = React.useState(createInitialTouchedState);
  const [submitAttempts, setSubmitAttempts] = React.useState(createInitialSubmitAttempts);

  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [isGeneratingCsv, setIsGeneratingCsv] = React.useState(false);

  const stepValidations = React.useMemo(
    () => ({
      basics: validateMoneyBlueprintStep('basics', basics),
      priorities: validateMoneyBlueprintStep('priorities', priorities),
      habits: validateMoneyBlueprintStep('habits', habits),
      summary: validateMoneyBlueprintStep('summary', summary),
    }),
    [basics, priorities, habits, summary]
  );

  const markFieldTouched = React.useCallback((stepId, field) => {
    if (!stepId || !field) return;
    setTouchedFields((prev) => ({
      ...prev,
      [stepId]: { ...(prev?.[stepId] ?? {}), [field]: true },
    }));
  }, []);

  const revealStepErrors = React.useCallback((stepId, fields) => {
    if (!stepId || !Array.isArray(fields) || fields.length === 0) return;
    setTouchedFields((prev) => {
      const previous = prev?.[stepId] ?? {};
      const next = { ...previous };
      fields.forEach((field) => {
        next[field] = true;
      });
      return {
        ...prev,
        [stepId]: next,
      };
    });
  }, []);

  const getFieldError = React.useCallback(
    (stepId, field) => {
      const validation = stepValidations[stepId];
      if (!validation) return null;
      const message = validation.errors?.[field];
      if (!message) return null;
      const touched = touchedFields?.[stepId]?.[field];
      const attempted = (submitAttempts?.[stepId] ?? 0) > 0;
      if (!touched && !attempted) {
        return null;
      }
      return message;
    },
    [stepValidations, touchedFields, submitAttempts]
  );

  const isComplete = status === 'completed';
  const goalsCount = priorities.goalAreas?.length || 0;
  const stepsCount = steps.length;

  const formatReportId = React.useCallback((value) => {
    if (!value) return '';
    return value.match(/.{1,4}/g)?.join(' ') ?? value;
  }, []);

  const formattedReportId = React.useMemo(
    () => formatReportId(reportId),
    [formatReportId, reportId]
  );

  const completionTimestamp = React.useMemo(() => {
    if (!completedAt) return null;
    try {
      return new Date(completedAt).toLocaleString('en-GB', {
        dateStyle: 'long',
        timeStyle: 'short',
      });
    } catch (error) {
      return completedAt;
    }
  }, [completedAt]);

  const StepIcon = stepIcons[currentStep?.id] || Lightbulb;

  const handleStepperClick = React.useCallback(
    (index) => {
      goToStep(index);
    },
    [goToStep]
  );

  const handleReset = React.useCallback(() => {
    reset();
    setTouchedFields(createInitialTouchedState());
    setSubmitAttempts(createInitialSubmitAttempts());
    toast({
      title: 'Wizard reset',
      description: 'All answers cleared. Start fresh whenever you are ready.',
    });
  }, [reset, toast]);

  const handleClearCurrentStep = React.useCallback(() => {
    if (!currentStepId) return;

    clearStepData(currentStepId);
    setTouchedFields((prev) => ({
      ...prev,
      [currentStepId]: {},
    }));
    setSubmitAttempts((prev) => ({
      ...prev,
      [currentStepId]: 0,
    }));

    const label = currentStep?.title || 'Step';
    toast({
      title: 'Step cleared',
      description: `${label} answers removed for this session.`,
    });
  }, [clearStepData, currentStep, currentStepId, toast]);

  const handleNext = React.useCallback(() => {
    if (!currentStep) {
      nextStep();
      return;
    }

    const validation = stepValidations[currentStep.id];
    if (validation && !validation.success) {
      const errorFields = Object.keys(validation.errors ?? {});
      setSubmitAttempts((prev) => ({
        ...prev,
        [currentStep.id]: (prev?.[currentStep.id] ?? 0) + 1,
      }));
      revealStepErrors(currentStep.id, errorFields);
      toast({
        title: 'Check this step',
        description: 'Please fix the highlighted fields before continuing.',
        variant: 'destructive',
      });
      return;
    }

    if (isLastStep) {
      if (isComplete) {
        toast({
          title: 'Blueprint ready to share',
          description: `Use code ${formattedReportId} when discussing this plan.`,
        });
      } else {
        const { reportId: generatedId } = completeWizard();
        toast({
          title: 'Blueprint generated',
          description: `Your anonymised share code ${formatReportId(generatedId)} is ready.`,
        });
      }
      return;
    }

    nextStep();
  }, [
    currentStep,
    stepValidations,
    nextStep,
    isLastStep,
    isComplete,
    formattedReportId,
    completeWizard,
    formatReportId,
    revealStepErrors,
    toast,
  ]);

  const handleCopyReportId = React.useCallback(async () => {
    if (!reportId) return;

    const shareCode = reportId;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareCode);
      } else if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = shareCode;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      toast({
        title: 'Report ID copied',
        description: `${formatReportId(shareCode)} is on your clipboard.`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Please highlight the code and copy it manually.',
        variant: 'destructive',
      });
    }
  }, [reportId, formatReportId, toast]);

  const downloadBlob = React.useCallback((blob, filename) => {
    if (!blob) return false;
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof URL === 'undefined') {
      return false;
    }

    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      if (import.meta?.env?.DEV) {
        // eslint-disable-next-line no-console
        console.error('Money Blueprint download failed', error);
      }
      return false;
    }
  }, []);

  const handleDownloadPdf = React.useCallback(async () => {
    setIsGeneratingPdf(true);
    try {
      const { blob, bytes } = await generateMoneyBlueprintPdf(blueprintReport, {
        title: basics.planName?.trim() || 'My Money Blueprint',
      });
      const pdfBlob =
        blob ||
        (bytes && typeof Blob !== 'undefined'
          ? new Blob([bytes], { type: 'application/pdf' })
          : null);

      if (!pdfBlob || !downloadBlob(pdfBlob, `${fileBaseName}.pdf`)) {
        throw new Error('pdf-download-unsupported');
      }

      toast({
        title: 'PDF downloaded',
        description: 'Your Money Blueprint summary has been saved as a PDF.',
      });
    } catch (error) {
      if (import.meta?.env?.DEV) {
        // eslint-disable-next-line no-console
        console.error('Money Blueprint PDF export failed', error);
      }
      toast({
        title: 'PDF download failed',
        description: 'We could not prepare the PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [basics.planName, blueprintReport, downloadBlob, fileBaseName, toast]);

  const handleDownloadCsv = React.useCallback(() => {
    setIsGeneratingCsv(true);
    try {
      const { blob, csv } = generateMoneyBlueprintCsv(blueprintReport);
      const csvBlob =
        blob ||
        (typeof Blob !== 'undefined'
          ? new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
          : null);

      if (!csvBlob || !downloadBlob(csvBlob, `${fileBaseName}.csv`)) {
        throw new Error('csv-download-unsupported');
      }

      toast({
        title: 'CSV downloaded',
        description: 'Your Money Blueprint answers have been exported to CSV.',
      });
    } catch (error) {
      if (import.meta?.env?.DEV) {
        // eslint-disable-next-line no-console
        console.error('Money Blueprint CSV export failed', error);
      }
      toast({
        title: 'CSV download failed',
        description: 'We could not prepare the CSV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingCsv(false);
    }
  }, [blueprintReport, downloadBlob, fileBaseName, toast]);

  const handlePriorityToggle = React.useCallback(
    (value) => (checked) => {
      markFieldTouched('priorities', 'goalAreas');
      updateStepData('priorities', (prev) => {
        const existing = new Set(Array.isArray(prev.goalAreas) ? prev.goalAreas : []);
        if (checked === true) {
          existing.add(value);
        } else {
          existing.delete(value);
        }
        return { ...prev, goalAreas: Array.from(existing) };
      });
    },
    [markFieldTouched, updateStepData]
  );

  const handleSummaryConsent = React.useCallback(
    (checked) => {
      if (checked === true) {
        markFieldTouched('summary', 'shareEmail');
      }
      markFieldTouched('summary', 'consentToContact');
      updateStepData('summary', { consentToContact: checked === true });
    },
    [markFieldTouched, updateStepData]
  );

  const summaryMessage = isLastStep
    ? isComplete
      ? 'Your blueprint is locked in. Share the code or revisit earlier steps to refine it.'
      : 'Review your answers and generate a share code for this anonymised plan.'
    : 'Keep building your blueprint to unlock personalised recommendations.';

  const renderBasicsStep = () => {
    const guidance = MONEY_BLUEPRINT_GUIDANCE.basics;
    const planNameError = getFieldError('basics', 'planName');
    const householdSizeError = getFieldError('basics', 'householdSize');
    const netIncomeError = getFieldError('basics', 'netIncome');
    const incomeFrequencyError = getFieldError('basics', 'incomeFrequency');
    const regionError = getFieldError('basics', 'region');
    const focusError = getFieldError('basics', 'focus');

    return (
      <div className="space-y-6">
        <StepGuidance {...guidance} />

        <PrivacyAssuranceBanner
          title="You're in control of this session"
          description={`${PRIVACY_NOTICE_INTRO} ${CLEAR_CONTROLS_NOTE}`}
          className="shadow-sm"
        >
          <p className="font-medium">{PROFESSIONAL_ADVICE_NOTICE}</p>
        </PrivacyAssuranceBanner>

        <div className="grid gap-2">
          <Label htmlFor="planName" className={cn(planNameError ? 'text-destructive' : '')}>
            Give your blueprint a nickname
          </Label>
          <Input
            id="planName"
            placeholder="e.g. 2025 fresh start"
            value={basics.planName ?? ''}
            onChange={(event) => updateStepData('basics', { planName: event.target.value })}
            onBlur={() => markFieldTouched('basics', 'planName')}
            aria-invalid={!!planNameError}
            aria-describedby={planNameError ? 'planName-error' : 'planName-helper'}
            className={cn(planNameError ? 'border-destructive focus-visible:ring-destructive/60' : '')}
          />
          {planNameError ? (
            <p id="planName-error" className="text-xs font-medium text-destructive">
              {planNameError}
            </p>
          ) : (
            <p id="planName-helper" className="text-xs text-muted-foreground">
              The nickname is private and helps you recognise this blueprint later.
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="householdSize" className={cn(householdSizeError ? 'text-destructive' : '')}>
              How many people rely on this plan?
            </Label>
            <Input
              id="householdSize"
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="e.g. 3"
              value={basics.householdSize ?? ''}
              onChange={(event) => updateStepData('basics', { householdSize: event.target.value })}
              onBlur={() => markFieldTouched('basics', 'householdSize')}
              aria-invalid={!!householdSizeError}
              aria-describedby={householdSizeError ? 'householdSize-error' : undefined}
              className={cn(householdSizeError ? 'border-destructive focus-visible:ring-destructive/60' : '')}
            />
            {householdSizeError ? (
              <p id="householdSize-error" className="text-xs font-medium text-destructive">
                {householdSizeError}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="netIncome" className={cn(netIncomeError ? 'text-destructive' : '')}>
              Combined take-home pay
            </Label>
            <Input
              id="netIncome"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 4200"
              value={basics.netIncome ?? ''}
              onChange={(event) => updateStepData('basics', { netIncome: event.target.value })}
              onBlur={() => markFieldTouched('basics', 'netIncome')}
              aria-invalid={!!netIncomeError}
              aria-describedby={netIncomeError ? 'netIncome-error' : 'netIncome-helper'}
              className={cn(netIncomeError ? 'border-destructive focus-visible:ring-destructive/60' : '')}
            />
            {netIncomeError ? (
              <p id="netIncome-error" className="text-xs font-medium text-destructive">
                {netIncomeError}
              </p>
            ) : (
              <p id="netIncome-helper" className="text-xs text-muted-foreground">
                Enter the amount after tax for your household.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="incomeFrequency" className={cn(incomeFrequencyError ? 'text-destructive' : '')}>
              Income frequency
            </Label>
            <Select
              value={basics.incomeFrequency ?? 'monthly'}
              onValueChange={(value) => {
                markFieldTouched('basics', 'incomeFrequency');
                updateStepData('basics', { incomeFrequency: value });
              }}
            >
              <SelectTrigger
                id="incomeFrequency"
                aria-invalid={!!incomeFrequencyError}
                aria-describedby={incomeFrequencyError ? 'incomeFrequency-error' : undefined}
                className={cn(incomeFrequencyError ? 'border-destructive focus:ring-destructive/60' : '')}
              >
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="four-weekly">Every 4 weeks</SelectItem>
                <SelectItem value="fortnightly">Fortnightly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            {incomeFrequencyError ? (
              <p id="incomeFrequency-error" className="text-xs font-medium text-destructive">
                {incomeFrequencyError}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="region" className={cn(regionError ? 'text-destructive' : '')}>
              Where in the UK do you live?
            </Label>
            <Select
              value={basics.region ?? ''}
              onValueChange={(value) => {
                markFieldTouched('basics', 'region');
                updateStepData('basics', { region: value });
              }}
            >
              <SelectTrigger
                id="region"
                aria-invalid={!!regionError}
                aria-describedby={regionError ? 'region-error' : undefined}
                className={cn(regionError ? 'border-destructive focus:ring-destructive/60' : '')}
              >
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {regionError ? (
              <p id="region-error" className="text-xs font-medium text-destructive">
                {regionError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="focus" className={cn(focusError ? 'text-destructive' : '')}>
            Main money focus for the next 12 months
          </Label>
          <Select
            value={basics.focus ?? ''}
            onValueChange={(value) => {
              markFieldTouched('basics', 'focus');
              updateStepData('basics', { focus: value });
            }}
          >
            <SelectTrigger
              id="focus"
              aria-invalid={!!focusError}
              aria-describedby={focusError ? 'focus-error' : undefined}
              className={cn(focusError ? 'border-destructive focus:ring-destructive/60' : '')}
            >
              <SelectValue placeholder="Select your focus area" />
            </SelectTrigger>
            <SelectContent>
              {focusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {focusError ? (
            <p id="focus-error" className="text-xs font-medium text-destructive">
              {focusError}
            </p>
          ) : null}
        </div>
      </div>
    );
  };

  const renderPrioritiesStep = () => {
    const guidance = MONEY_BLUEPRINT_GUIDANCE.priorities;
    const goalAreasError = getFieldError('priorities', 'goalAreas');
    const topGoalError = getFieldError('priorities', 'topGoal');
    const timelineError = getFieldError('priorities', 'timeline');
    const savingsTargetError = getFieldError('priorities', 'savingsTarget');

    return (
      <div className="space-y-6">
        <StepGuidance {...guidance} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Label className={cn(goalAreasError ? 'text-destructive' : '')}>Which goals resonate right now?</Label>
            <p className="text-xs text-muted-foreground">
              Pick as many as apply. We use them to build your personalised checklist.
            </p>
            {goalAreasError ? (
              <p id="goalAreas-error" className="text-xs font-medium text-destructive">
                {goalAreasError}
              </p>
            ) : null}
          </div>
          <Badge variant={goalsCount > 0 ? 'default' : 'outline'} className="uppercase tracking-wide">
            {goalsCount} selected
          </Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2" role="group" aria-invalid={!!goalAreasError}>
          {priorityOptions.map((option) => {
            const isChecked = Array.isArray(priorities.goalAreas)
              ? priorities.goalAreas.includes(option.value)
              : false;
            return (
              <label
                key={option.value}
                htmlFor={`priority-${option.value}`}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 text-sm shadow-sm transition hover:border-primary/40 hover:shadow-md',
                  isChecked ? 'border-primary ring-2 ring-primary/20' : 'border-border',
                  goalAreasError ? 'border-destructive/70' : ''
                )}
              >
                <Checkbox
                  id={`priority-${option.value}`}
                  checked={isChecked}
                  onCheckedChange={handlePriorityToggle(option.value)}
                  aria-describedby={goalAreasError ? 'goalAreas-error' : undefined}
                />
                <span className="flex flex-col gap-1">
                  <span className="font-semibold text-foreground">{option.label}</span>
                  <span className="text-xs leading-snug text-muted-foreground">{option.description}</span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="topGoal" className={cn(topGoalError ? 'text-destructive' : '')}>
            Describe your number one outcome
          </Label>
          <Textarea
            id="topGoal"
            placeholder="e.g. Build a £6,000 emergency fund while clearing my credit card"
            value={priorities.topGoal ?? ''}
            onChange={(event) => updateStepData('priorities', { topGoal: event.target.value })}
            onBlur={() => markFieldTouched('priorities', 'topGoal')}
            rows={4}
            aria-invalid={!!topGoalError}
            aria-describedby={topGoalError ? 'topGoal-error' : undefined}
            className={cn(topGoalError ? 'border-destructive focus-visible:ring-destructive/60' : '')}
          />
          {topGoalError ? (
            <p id="topGoal-error" className="text-xs font-medium text-destructive">
              {topGoalError}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="timeline" className={cn(timelineError ? 'text-destructive' : '')}>
              Ideal timeframe
            </Label>
            <Select
              value={priorities.timeline ?? ''}
              onValueChange={(value) => {
                markFieldTouched('priorities', 'timeline');
                updateStepData('priorities', { timeline: value });
              }}
            >
              <SelectTrigger
                id="timeline"
                aria-invalid={!!timelineError}
                aria-describedby={timelineError ? 'timeline-error' : undefined}
                className={cn(timelineError ? 'border-destructive focus:ring-destructive/60' : '')}
              >
                <SelectValue placeholder="Select a timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelineOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {timelineError ? (
              <p id="timeline-error" className="text-xs font-medium text-destructive">
                {timelineError}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="savingsTarget" className={cn(savingsTargetError ? 'text-destructive' : '')}>
              Target amount (optional)
            </Label>
            <Input
              id="savingsTarget"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 6000"
              value={priorities.savingsTarget ?? ''}
              onChange={(event) => updateStepData('priorities', { savingsTarget: event.target.value })}
              onBlur={() => markFieldTouched('priorities', 'savingsTarget')}
              aria-invalid={!!savingsTargetError}
              aria-describedby={savingsTargetError ? 'savingsTarget-error' : undefined}
              className={cn(savingsTargetError ? 'border-destructive focus-visible:ring-destructive/60' : '')}
            />
            {savingsTargetError ? (
              <p id="savingsTarget-error" className="text-xs font-medium text-destructive">
                {savingsTargetError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Leave blank if you do not have a number in mind.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderHabitsStep = () => {
    const guidance = MONEY_BLUEPRINT_GUIDANCE.habits;
    const budgetingStyleError = getFieldError('habits', 'budgetingStyle');
    const confidenceLevelError = getFieldError('habits', 'confidenceLevel');
    const checkInFrequencyError = getFieldError('habits', 'checkInFrequency');
    const emergencyFundError = getFieldError('habits', 'emergencyFundMonths');
    const additionalNotesError = getFieldError('habits', 'additionalNotes');

    return (
      <div className="space-y-6">
        <StepGuidance {...guidance} />

        <div className="space-y-3">
          <Label className={cn(budgetingStyleError ? 'text-destructive' : '')}>
            Which statement fits your budgeting style?
          </Label>
          {budgetingStyleError ? (
            <p id="budgetingStyle-error" className="text-xs font-medium text-destructive">
              {budgetingStyleError}
            </p>
          ) : null}
          <RadioGroup
            value={habits.budgetingStyle ?? ''}
            onValueChange={(value) => {
              markFieldTouched('habits', 'budgetingStyle');
              updateStepData('habits', { budgetingStyle: value });
            }}
            className="grid gap-3 md:grid-cols-3"
            aria-invalid={!!budgetingStyleError}
            aria-describedby={budgetingStyleError ? 'budgetingStyle-error' : undefined}
          >
            {budgetingStyles.map((style) => {
              const isActive = habits.budgetingStyle === style.value;
              return (
                <label
                  key={style.value}
                  htmlFor={`budget-style-${style.value}`}
                  className={cn(
                    'flex cursor-pointer flex-col gap-2 rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md',
                    isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border',
                    budgetingStyleError ? 'border-destructive/70' : ''
                  )}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={style.value} id={`budget-style-${style.value}`} />
                    <span className="font-semibold text-foreground">{style.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{style.description}</span>
                </label>
              );
            })}
          </RadioGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="confidenceLevel" className={cn(confidenceLevelError ? 'text-destructive' : '')}>
              How confident do you feel managing money?
            </Label>
            <Select
              value={habits.confidenceLevel ?? ''}
              onValueChange={(value) => {
                markFieldTouched('habits', 'confidenceLevel');
                updateStepData('habits', { confidenceLevel: value });
              }}
            >
              <SelectTrigger
                id="confidenceLevel"
                aria-invalid={!!confidenceLevelError}
                aria-describedby={confidenceLevelError ? 'confidenceLevel-error' : undefined}
                className={cn(confidenceLevelError ? 'border-destructive focus:ring-destructive/60' : '')}
              >
                <SelectValue placeholder="Select a confidence level" />
              </SelectTrigger>
              <SelectContent>
                {confidenceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {confidenceLevelError ? (
              <p id="confidenceLevel-error" className="text-xs font-medium text-destructive">
                {confidenceLevelError}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="checkInFrequency" className={cn(checkInFrequencyError ? 'text-destructive' : '')}>
              How often do you check in with your finances?
            </Label>
            <Select
              value={habits.checkInFrequency ?? ''}
              onValueChange={(value) => {
                markFieldTouched('habits', 'checkInFrequency');
                updateStepData('habits', { checkInFrequency: value });
              }}
            >
              <SelectTrigger
                id="checkInFrequency"
                aria-invalid={!!checkInFrequencyError}
                aria-describedby={checkInFrequencyError ? 'checkInFrequency-error' : undefined}
                className={cn(checkInFrequencyError ? 'border-destructive focus:ring-destructive/60' : '')}
              >
                <SelectValue placeholder="Select a cadence" />
              </SelectTrigger>
              <SelectContent>
                {checkInOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {checkInFrequencyError ? (
              <p id="checkInFrequency-error" className="text-xs font-medium text-destructive">
                {checkInFrequencyError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="emergencyFund" className={cn(emergencyFundError ? 'text-destructive' : '')}>
              Current emergency fund coverage
            </Label>
            <Select
              value={habits.emergencyFundMonths ?? ''}
              onValueChange={(value) => {
                markFieldTouched('habits', 'emergencyFundMonths');
                updateStepData('habits', { emergencyFundMonths: value });
              }}
            >
              <SelectTrigger
                id="emergencyFund"
                aria-invalid={!!emergencyFundError}
                aria-describedby={emergencyFundError ? 'emergencyFund-error' : undefined}
                className={cn(emergencyFundError ? 'border-destructive focus:ring-destructive/60' : '')}
              >
                <SelectValue placeholder="Select an estimate" />
              </SelectTrigger>
              <SelectContent>
                {emergencyFundOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {emergencyFundError ? (
              <p id="emergencyFund-error" className="text-xs font-medium text-destructive">
                {emergencyFundError}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes" className={cn(additionalNotesError ? 'text-destructive' : '')}>
              Any habits or challenges worth noting?
            </Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder="e.g. Automating savings works, but unexpected car costs knock me off course"
              value={habits.additionalNotes ?? ''}
              onChange={(event) => updateStepData('habits', { additionalNotes: event.target.value })}
              onBlur={() => markFieldTouched('habits', 'additionalNotes')}
              aria-invalid={!!additionalNotesError}
              aria-describedby={additionalNotesError ? 'additionalNotes-error' : undefined}
              className={cn(additionalNotesError ? 'border-destructive focus-visible:ring-destructive/60' : '')}
            />
            {additionalNotesError ? (
              <p id="additionalNotes-error" className="text-xs font-medium text-destructive">
                {additionalNotesError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Optional, but it helps capture behaviours to celebrate or improve.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSummaryStep = () => {
    const guidance = MONEY_BLUEPRINT_GUIDANCE.summary;
    const shareEmailError = getFieldError('summary', 'shareEmail');

    return (
      <div className="space-y-6">
        <StepGuidance {...guidance} />

        <PrivacyAssuranceBanner
          title="Before you share your blueprint"
          description={PRIVACY_NOTICE_SUMMARY}
          className="shadow-sm"
        >
          <p className="font-medium">{PROFESSIONAL_ADVICE_NOTICE}</p>
        </PrivacyAssuranceBanner>

        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-4 w-4" /> Share code ready
              </p>
              <h3 className="text-xl font-semibold text-primary">{formattedReportId || 'Generating…'}</h3>
              <p className="text-sm text-primary/80">
                Use this anonymised code when sharing your blueprint with a partner, coach or adviser.
              </p>
              {completionTimestamp ? (
                <p className="text-xs text-primary/70">Generated on {completionTimestamp}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Badge
                variant="outline"
                className="border-primary/50 bg-white/70 px-4 py-2 text-sm font-semibold tracking-[0.35em] text-primary"
              >
                {formattedReportId || '---- ---- ----'}
              </Badge>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyReportId}>
                <Copy className="h-4 w-4" /> Copy share code
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/40 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Save a copy</p>
              <p className="text-xs text-muted-foreground">
                Download your Money Blueprint as a PDF summary or CSV data export.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="gap-2">
                <FileDown className="h-4 w-4" />
                {isGeneratingPdf ? 'Preparing PDF…' : 'Download PDF'}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadCsv}
                disabled={isGeneratingCsv}
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {isGeneratingCsv ? 'Preparing CSV…' : 'Download CSV'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Household snapshot</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="font-medium text-foreground">Plan nickname</dt>
                <dd className="text-right text-muted-foreground">
                  {basics.planName?.trim() || 'Add a nickname to personalise this plan.'}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="font-medium text-foreground">Household size</dt>
                <dd className="text-right text-muted-foreground">{basics.householdSize || 'Not set'}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="font-medium text-foreground">Net income</dt>
                <dd className="text-right text-muted-foreground">{formatCurrency(basics.netIncome)}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="font-medium text-foreground">Income frequency</dt>
                <dd className="text-right text-muted-foreground">{basics.incomeFrequency}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="font-medium text-foreground">Region</dt>
                <dd className="text-right text-muted-foreground">
                  {regionOptions.find((option) => option.value === basics.region)?.label || 'Not set'}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="font-medium text-foreground">Primary focus</dt>
                <dd className="text-right text-muted-foreground">
                  {focusOptions.find((option) => option.value === basics.focus)?.label || 'Not set'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Priorities & milestones
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                {(priorities.goalAreas || []).length > 0 ? (
                  priorities.goalAreas.map((goal) => {
                    const option = priorityOptions.find((item) => item.value === goal);
                    return (
                      <Badge key={goal} variant="secondary" className="text-xs">
                        {option?.label || goal}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-muted-foreground">No goals selected yet.</span>
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">Headline goal</p>
                <p className="text-sm text-muted-foreground">
                  {priorities.topGoal?.trim() || 'Add a short description of your most important outcome.'}
                </p>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="font-medium text-foreground">Timeline</span>
                <span className="text-right text-muted-foreground">
                  {timelineOptions.find((option) => option.value === priorities.timeline)?.label || 'Not set'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="font-medium text-foreground">Target amount</span>
                <span className="text-right text-muted-foreground">
                  {priorities.savingsTarget?.trim() ? formatCurrency(priorities.savingsTarget) : 'Optional'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Habits & resilience
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="font-medium text-foreground">Budgeting style</dt>
              <dd className="text-right text-muted-foreground">
                {budgetingStyles.find((option) => option.value === habits.budgetingStyle)?.title || 'Not set'}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-medium text-foreground">Confidence level</dt>
              <dd className="text-right text-muted-foreground">
                {confidenceOptions.find((option) => option.value === habits.confidenceLevel)?.label || 'Not set'}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-medium text-foreground">Check-in cadence</dt>
              <dd className="text-right text-muted-foreground">
                {checkInOptions.find((option) => option.value === habits.checkInFrequency)?.label || 'Not set'}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-medium text-foreground">Emergency fund</dt>
              <dd className="text-right text-muted-foreground">
                {emergencyFundOptions.find((option) => option.value === habits.emergencyFundMonths)?.label || 'Not set'}
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="font-medium text-foreground">Notes</dt>
              <dd className="text-sm text-muted-foreground whitespace-pre-line">
                {habits.additionalNotes?.trim() || 'Use this space to record habits, triggers or wins you want to remember.'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="shareEmail" className={cn(shareEmailError ? 'text-destructive' : '')}>
              Email a copy to yourself (optional)
            </Label>
            <Input
              id="shareEmail"
              type="email"
              placeholder="you@example.com"
              value={summary.shareEmail ?? ''}
              onChange={(event) => updateStepData('summary', { shareEmail: event.target.value })}
              onBlur={() => markFieldTouched('summary', 'shareEmail')}
              aria-invalid={!!shareEmailError}
              aria-describedby={shareEmailError ? 'shareEmail-error' : undefined}
              className={cn(shareEmailError ? 'border-destructive focus-visible:ring-destructive/60' : '')}
            />
            {shareEmailError ? (
              <p id="shareEmail-error" className="text-xs font-medium text-destructive">
                {shareEmailError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">We only send you a reminder if you choose to opt in.</p>
            )}
          </div>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <Checkbox
              id="consentToContact"
              checked={!!summary.consentToContact}
              onCheckedChange={handleSummaryConsent}
              aria-describedby={shareEmailError ? 'shareEmail-error' : undefined}
            />
            <span>
              <span className="font-medium text-foreground">Email me a reminder to review this plan</span>
              <span className="block text-xs text-muted-foreground">
                We only store your share code and email if you opt in. You can unsubscribe at any time.
              </span>
            </span>
          </label>
        </div>

        {isComplete ? (
          <div className="rounded-xl border border-emerald-400/60 bg-emerald-50/80 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100">
            <p className="font-semibold">Blueprint saved</p>
            <p className="mt-1">
              Share the code above or revisit any step to refresh your plan. Updating answers will create a new snapshot.
            </p>
          </div>
        ) : null}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep?.id) {
      case 'priorities':
        return renderPrioritiesStep();
      case 'habits':
        return renderHabitsStep();
      case 'summary':
        return renderSummaryStep();
      case 'basics':
      default:
        return renderBasicsStep();
    }
  };

  return (
    <div className="bg-background">
      <div className="bg-hero border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <Heading as="h1" size="h1" weight="bold" underline className="mt-6 text-hero-foreground">
            My Money Blueprint
          </Heading>
          <p className="lead mx-auto mt-4 max-w-3xl text-muted-foreground">
            Build an anonymised action plan in four guided steps. Capture your priorities, habits and safety nets to create a
            shareable code you control.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Wizard progress</p>
                <p className="text-lg font-semibold text-foreground">{currentStep?.title || 'Blueprint wizard'}</p>
              </div>
              <Badge variant="outline" className="text-xs font-semibold uppercase">
                {progressPercent}% complete
              </Badge>
            </div>
            <Progress value={progressPercent} />
            <WizardStepper
              steps={steps}
              currentStepIndex={currentStepIndex}
              visitedStepIds={visitedStepIds}
              onStepClick={handleStepperClick}
            />
          </div>
        </section>

        <Card className="overflow-hidden border border-border/70 shadow-lg">
          <CardHeader className="space-y-3 bg-muted/40">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <StepIcon className="h-6 w-6" />
              </span>
              <div>
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  {currentStep?.title || 'Blueprint step'}
                </CardTitle>
                {currentStep?.description ? (
                  <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                ) : null}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 py-6">{renderStepContent()}</CardContent>
        </Card>

        <WizardNavigation
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrevious={previousStep}
          onNext={handleNext}
          nextLabel="Next step"
          finishLabel={isComplete ? 'Share blueprint' : 'Generate blueprint'}
          leftSlot={
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="gap-2 px-0 text-muted-foreground hover:text-foreground"
              >
                <RefreshCcw className="h-4 w-4" /> Start over
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleClearCurrentStep}
                className="gap-2 px-0 text-muted-foreground hover:text-foreground"
                disabled={!currentStepId}
              >
                <Eraser className="h-4 w-4" /> Clear step
              </Button>
            </>
          }
        >
          <span className="font-semibold text-foreground">
            Step {currentStepIndex + 1} of {stepsCount}
          </span>
          <span className="ml-2 text-muted-foreground">{summaryMessage}</span>
        </WizardNavigation>
      </div>
    </div>
  );
}
