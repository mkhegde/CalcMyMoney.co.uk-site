import React from 'react';
import CurrencyInput from '@/components/form/CurrencyInput.jsx';

const numberInputClass =
  'mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2';

const Step8_RetirementGoals = ({
  onBack,
  onNext,
  control,
  register,
  errors,
  watch,
  setValue,
  currentStep,
  totalSteps,
}) => {
  const blueprintFor = watch('blueprintFor');

  React.useEffect(() => {
    if (blueprintFor !== 'family') {
      const options = { shouldValidate: false, shouldDirty: false };
      setValue('partnerRetirementTargetAge', '0', options);
      setValue('partnerRetirementIncomeTargetMonthly', '0', options);
    }
  }, [blueprintFor, setValue]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Step {currentStep} of {totalSteps}: Retirement goals
        </h2>
        <p className="mt-2 text-gray-600">
          Share the milestones you’re working toward so we can tailor long-term planning guidance.
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <div>
          <label htmlFor="retirementTargetAge" className="block text-sm font-medium text-gray-700">
            Target retirement age
          </label>
          <input
            id="retirementTargetAge"
            type="number"
            min={50}
            max={80}
            step="1"
            {...register('retirementTargetAge')}
            className={numberInputClass}
          />
          {errors.retirementTargetAge ? (
            <p className="mt-1 text-sm text-red-600">{errors.retirementTargetAge.message}</p>
          ) : null}
        </div>

        {blueprintFor === 'family' ? (
          <div>
            <label
              htmlFor="partnerRetirementTargetAge"
              className="block text-sm font-medium text-gray-700"
            >
              Partner’s target retirement age
            </label>
            <input
              id="partnerRetirementTargetAge"
              type="number"
              min={50}
              max={80}
              step="1"
              {...register('partnerRetirementTargetAge')}
              className={numberInputClass}
            />
            {errors.partnerRetirementTargetAge ? (
              <p className="mt-1 text-sm text-red-600">{errors.partnerRetirementTargetAge.message}</p>
            ) : null}
          </div>
        ) : (
          <input type="hidden" {...register('partnerRetirementTargetAge')} value="0" readOnly />
        )}

        <CurrencyInput
          name="retirementIncomeTargetMonthly"
          control={control}
          label="Desired monthly income in retirement"
          placeholder="3,000"
          helpText="What monthly income would let you live comfortably once you stop working?"
          error={errors.retirementIncomeTargetMonthly}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />

        {blueprintFor === 'family' ? (
          <CurrencyInput
            name="partnerRetirementIncomeTargetMonthly"
            control={control}
            label="Partner’s desired monthly retirement income"
            placeholder="2,800"
            error={errors.partnerRetirementIncomeTargetMonthly}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : (
          <input
            type="hidden"
            {...register('partnerRetirementIncomeTargetMonthly')}
            value="0"
            readOnly
          />
        )}

        <div>
          <label
            htmlFor="statePensionQualifyingYears"
            className="block text-sm font-medium text-gray-700"
          >
            Qualifying National Insurance years
          </label>
          <input
            id="statePensionQualifyingYears"
            type="number"
            min={0}
            max={60}
            step="1"
            {...register('statePensionQualifyingYears')}
            className={numberInputClass}
          />
          {errors.statePensionQualifyingYears ? (
            <p className="mt-1 text-sm text-red-600">{errors.statePensionQualifyingYears.message}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="statePensionLastStatementYear"
            className="block text-sm font-medium text-gray-700"
          >
            Year you last checked your state pension
          </label>
          <input
            id="statePensionLastStatementYear"
            type="number"
            min={1990}
            max={new Date().getFullYear()}
            step="1"
            {...register('statePensionLastStatementYear')}
            className={numberInputClass}
          />
          {errors.statePensionLastStatementYear ? (
            <p className="mt-1 text-sm text-red-600">{errors.statePensionLastStatementYear.message}</p>
          ) : null}
        </div>

        <CurrencyInput
          name="statePensionForecastAmountMonthly"
          control={control}
          label="Estimated monthly state pension"
          placeholder="750"
          helpText="Use £0 if you haven’t checked your forecast yet."
          error={errors.statePensionForecastAmountMonthly}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step8_RetirementGoals;
