import React, { useEffect } from 'react';
import CurrencyInput from '@/components/form/CurrencyInput.jsx';

const Step5_Liabilities = ({
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
  const housingStatus = watch('housingStatus');
  const housingLabelMap = {
    renting: 'Renting',
    mortgaged: 'Mortgaged',
    owned: 'Owned outright',
  };
  const housingLabel = housingLabelMap[housingStatus] || housingStatus;

  useEffect(() => {
    const resetOptions = { shouldValidate: false, shouldDirty: false };
    if (housingStatus !== 'mortgaged') {
      setValue('mortgageBalance', '0', resetOptions);
      setValue('mortgageMonthlyPayment', '0', resetOptions);
      setValue('mortgageRemainingTermYears', '0', resetOptions);
    }
    if (housingStatus !== 'renting') {
      setValue('monthlyRent', '0', resetOptions);
    }
  }, [housingStatus, setValue]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Step {currentStep} of {totalSteps}: What you owe
        </h2>
        <p className="mt-2 text-gray-600">
          We tailor these questions based on your housing status (<strong>{housingLabel}</strong>).
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        {housingStatus === 'renting' ? (
          <CurrencyInput
            name="monthlyRent"
            control={control}
            label="Monthly rent"
            placeholder="1,200"
            error={errors.monthlyRent}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : null}

        {housingStatus === 'mortgaged' ? (
          <div className="space-y-6">
            <CurrencyInput
              name="mortgageBalance"
              control={control}
              label="Outstanding mortgage balance"
              placeholder="200,000"
              error={errors.mortgageBalance}
              minimumFractionDigits={0}
              maximumFractionDigits={0}
            />
            <CurrencyInput
              name="mortgageMonthlyPayment"
              control={control}
              label="Monthly mortgage payment"
              placeholder="1,100"
              error={errors.mortgageMonthlyPayment}
              minimumFractionDigits={0}
              maximumFractionDigits={0}
            />
            <div>
              <label htmlFor="mortgageRemainingTermYears" className="block text-sm font-medium text-gray-700">
                Years remaining on mortgage
              </label>
              <input
                id="mortgageRemainingTermYears"
                type="number"
                min={0}
                step="1"
                {...register('mortgageRemainingTermYears')}
                className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              />
              {errors.mortgageRemainingTermYears ? (
                <p className="mt-1 text-sm text-red-600">{errors.mortgageRemainingTermYears.message}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <CurrencyInput
          name="creditCardDebt"
          control={control}
          label="Credit card debt"
          placeholder="5,000"
          helpText="Include store cards and other revolving credit."
          error={errors.creditCardDebt}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="otherLoans"
          control={control}
          label="Other loans"
          placeholder="8,000"
          helpText="Car finance, personal loans, hire purchase etc."
          error={errors.otherLoans}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="studentLoanBalance"
          control={control}
          label="Student loan balance"
          placeholder="12,000"
          error={errors.studentLoanBalance}
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

export default Step5_Liabilities;
