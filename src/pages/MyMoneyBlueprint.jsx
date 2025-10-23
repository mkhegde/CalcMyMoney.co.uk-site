import React from 'react';
import {
  Lightbulb,
  Target,
  ShieldCheck,
  ClipboardCheck,
  RefreshCcw,
  Copy,
  Sparkles,
} from 'lucide-react';

import Heading from '@/components/common/Heading';
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
import { WizardStepper, WizardNavigation } from '@/components/wizard';
import {
  useMoneyBlueprintWizard,
  MONEY_BLUEPRINT_DEFAULT_DATA,
} from '@/hooks/use-money-blueprint-wizard';
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
    isFirstStep,
    isLastStep,
    progressPercent,
    visitedStepIds,
    data,
    status,
    completedAt,
    reportId,
    updateStepData,
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
    toast({
      title: 'Wizard reset',
      description: 'All answers cleared. Start fresh whenever you are ready.',
    });
  }, [reset, toast]);

  const handleNext = React.useCallback(() => {
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
  }, [isLastStep, isComplete, formattedReportId, completeWizard, formatReportId, nextStep, toast]);

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

  const handlePriorityToggle = React.useCallback(
    (value) => (checked) => {
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
    [updateStepData]
  );

  const handleSummaryConsent = React.useCallback(
    (checked) => {
      updateStepData('summary', { consentToContact: checked === true });
    },
    [updateStepData]
  );

  const summaryMessage = isLastStep
    ? isComplete
      ? 'Your blueprint is locked in. Share the code or revisit earlier steps to refine it.'
      : 'Review your answers and generate a share code for this anonymised plan.'
    : 'Keep building your blueprint to unlock personalised recommendations.';

  const renderBasicsStep = () => (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="planName">Give your blueprint a nickname</Label>
        <Input
          id="planName"
          placeholder="e.g. 2025 fresh start"
          value={basics.planName ?? ''}
          onChange={(event) => updateStepData('basics', { planName: event.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          The nickname is private and helps you recognise this blueprint later.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="householdSize">How many people rely on this plan?</Label>
          <Input
            id="householdSize"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="e.g. 3"
            value={basics.householdSize ?? ''}
            onChange={(event) => updateStepData('basics', { householdSize: event.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="netIncome">Combined take-home pay</Label>
          <Input
            id="netIncome"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 4200"
            value={basics.netIncome ?? ''}
            onChange={(event) => updateStepData('basics', { netIncome: event.target.value })}
          />
          <p className="text-xs text-muted-foreground">Enter the amount after tax for your household.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="incomeFrequency">Income frequency</Label>
          <Select
            value={basics.incomeFrequency ?? 'monthly'}
            onValueChange={(value) => updateStepData('basics', { incomeFrequency: value })}
          >
            <SelectTrigger id="incomeFrequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="four-weekly">Every 4 weeks</SelectItem>
              <SelectItem value="fortnightly">Fortnightly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="region">Where in the UK do you live?</Label>
          <Select
            value={basics.region ?? ''}
            onValueChange={(value) => updateStepData('basics', { region: value })}
          >
            <SelectTrigger id="region">
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
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="focus">Main money focus for the next 12 months</Label>
        <Select
          value={basics.focus ?? ''}
          onValueChange={(value) => updateStepData('basics', { focus: value })}
        >
          <SelectTrigger id="focus">
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
      </div>
    </div>
  );

  const renderPrioritiesStep = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Label>Which goals resonate right now?</Label>
          <p className="text-xs text-muted-foreground">
            Pick as many as apply. We use them to build your personalised checklist.
          </p>
        </div>
        <Badge variant={goalsCount > 0 ? 'default' : 'outline'} className="uppercase tracking-wide">
          {goalsCount} selected
        </Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
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
                isChecked ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              )}
            >
              <Checkbox
                id={`priority-${option.value}`}
                checked={isChecked}
                onCheckedChange={handlePriorityToggle(option.value)}
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
        <Label htmlFor="topGoal">Describe your number one outcome</Label>
        <Textarea
          id="topGoal"
          placeholder="e.g. Build a £6,000 emergency fund while clearing my credit card"
          value={priorities.topGoal ?? ''}
          onChange={(event) => updateStepData('priorities', { topGoal: event.target.value })}
          rows={4}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="timeline">Ideal timeframe</Label>
          <Select
            value={priorities.timeline ?? ''}
            onValueChange={(value) => updateStepData('priorities', { timeline: value })}
          >
            <SelectTrigger id="timeline">
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
        </div>
        <div className="grid gap-2">
          <Label htmlFor="savingsTarget">Target amount (optional)</Label>
          <Input
            id="savingsTarget"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 6000"
            value={priorities.savingsTarget ?? ''}
            onChange={(event) => updateStepData('priorities', { savingsTarget: event.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderHabitsStep = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Which statement fits your budgeting style?</Label>
        <RadioGroup
          value={habits.budgetingStyle ?? ''}
          onValueChange={(value) => updateStepData('habits', { budgetingStyle: value })}
          className="grid gap-3 md:grid-cols-3"
        >
          {budgetingStyles.map((style) => {
            const isActive = habits.budgetingStyle === style.value;
            return (
              <label
                key={style.value}
                htmlFor={`budget-style-${style.value}`}
                className={cn(
                  'flex cursor-pointer flex-col gap-2 rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md',
                  isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border'
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
          <Label htmlFor="confidenceLevel">How confident do you feel managing money?</Label>
          <Select
            value={habits.confidenceLevel ?? ''}
            onValueChange={(value) => updateStepData('habits', { confidenceLevel: value })}
          >
            <SelectTrigger id="confidenceLevel">
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
        </div>
        <div className="grid gap-2">
          <Label htmlFor="checkInFrequency">How often do you check in with your finances?</Label>
          <Select
            value={habits.checkInFrequency ?? ''}
            onValueChange={(value) => updateStepData('habits', { checkInFrequency: value })}
          >
            <SelectTrigger id="checkInFrequency">
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
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="emergencyFund">Current emergency fund coverage</Label>
          <Select
            value={habits.emergencyFundMonths ?? ''}
            onValueChange={(value) => updateStepData('habits', { emergencyFundMonths: value })}
          >
            <SelectTrigger id="emergencyFund">
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
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Any habits or challenges worth noting?</Label>
          <Textarea
            id="notes"
            rows={4}
            placeholder="e.g. Automating savings works, but unexpected car costs knock me off course"
            value={habits.additionalNotes ?? ''}
            onChange={(event) => updateStepData('habits', { additionalNotes: event.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="space-y-6">
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
              {formattedReportId || 'PENDING'}
            </Badge>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCopyReportId}
              className="gap-2"
            >
              <Copy className="h-4 w-4" /> Copy code
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Household snapshot
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="font-medium text-foreground">Plan nickname</dt>
              <dd className="text-right text-muted-foreground">
                {basics.planName?.trim() || 'Not set'}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-medium text-foreground">Household size</dt>
              <dd className="text-right text-muted-foreground">
                {basics.householdSize?.trim() || 'Not set'}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-medium text-foreground">Take-home pay</dt>
              <dd className="text-right text-muted-foreground">
                {formatCurrency(basics.netIncome)} per {basics.incomeFrequency || 'month'}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-medium text-foreground">Region</dt>
              <dd className="text-right text-muted-foreground">
                {regionOptions.find((option) => option.value === basics.region)?.label || 'Not set'}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="font-medium text-foreground">Focus</dt>
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
          <Label htmlFor="shareEmail">Email a copy to yourself (optional)</Label>
          <Input
            id="shareEmail"
            type="email"
            placeholder="you@example.com"
            value={summary.shareEmail ?? ''}
            onChange={(event) => updateStepData('summary', { shareEmail: event.target.value })}
          />
        </div>
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <Checkbox
            id="consentToContact"
            checked={!!summary.consentToContact}
            onCheckedChange={handleSummaryConsent}
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
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              className="gap-2 px-0 text-muted-foreground hover:text-foreground"
            >
              <RefreshCcw className="h-4 w-4" /> Start over
            </Button>
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
