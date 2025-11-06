import React from 'react';
import CurrencyInput from '@/components/form/CurrencyInput.jsx';

const Step3_Expenses = ({
  onBack,
  onNext,
  control,
  errors,
  watch,
  currentStep,
  totalSteps,
  register,
  setValue,
}) => {
  const numberOfChildren = Number(watch('numberOfChildren') || 0);
  const specialNeedsChildren = Number(watch('specialNeedsChildren') || 0);
  const blueprintFor = watch('blueprintFor');

  React.useEffect(() => {
    if (blueprintFor !== 'family') {
      const resetOptions = { shouldValidate: false, shouldDirty: false };
      setValue('partnerPensionContributionMonthly', '0', resetOptions);
      setValue('partnerIsaContributionMonthly', '0', resetOptions);
    }
  }, [blueprintFor, setValue]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Step {currentStep} of {totalSteps}: Monthly spending snapshot
        </h2>
        <p className="mt-2 text-gray-600">
          Break out your core expenses. This helps highlight the biggest opportunities for savings.
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <CurrencyInput
          name="expensesHousing"
          control={control}
          label="Housing (rent or mortgage & service charges)"
          placeholder="1,200"
          error={errors.expensesHousing}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="expensesUtilities"
          control={control}
          label="Utilities & household bills"
          placeholder="350"
          helpText="Gas, electric, water, council tax, broadband."
          error={errors.expensesUtilities}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="expensesGroceries"
          control={control}
          label="Groceries & essential shopping"
          placeholder="450"
          error={errors.expensesGroceries}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="expensesTransport"
          control={control}
          label="Transport & commuting"
          placeholder="220"
          helpText="Fuel, insurance, public transport, car maintenance."
          error={errors.expensesTransport}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="expensesLifestyle"
          control={control}
          label="Lifestyle & entertainment"
          placeholder="300"
          helpText="Subscriptions, dining out, hobbies, personal care."
          error={errors.expensesLifestyle}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        {numberOfChildren > 0 ? (
          <CurrencyInput
            name="expensesChildcare"
            control={control}
            label="Childcare & education"
            placeholder="400"
            helpText="Nursery, clubs, tuition, school expenses."
            error={errors.expensesChildcare}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : (
          <input type="hidden" {...register('expensesChildcare')} value="0" readOnly />
        )}

        {specialNeedsChildren > 0 ? (
          <CurrencyInput
            name="specialNeedsCostsMonthly"
            control={control}
            label="Special needs support & therapies"
            placeholder="250"
            error={errors.specialNeedsCostsMonthly}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : (
          <input type="hidden" {...register('specialNeedsCostsMonthly')} value="0" readOnly />
        )}
        <CurrencyInput
          name="emergencySavingsContributionMonthly"
          control={control}
          label="Monthly emergency savings contribution"
          placeholder="200"
          helpText="Transfers into your emergency fund or rainy-day savings."
          error={errors.emergencySavingsContributionMonthly}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="pensionContributionMonthly"
          control={control}
          label="Your monthly pension contributions"
          placeholder="350"
          helpText="Include workplace and personal pension contributions."
          error={errors.pensionContributionMonthly}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        {blueprintFor === 'family' ? (
          <CurrencyInput
            name="partnerPensionContributionMonthly"
            control={control}
            label="Partner’s monthly pension contributions"
            placeholder="320"
            error={errors.partnerPensionContributionMonthly}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : (
          <input
            type="hidden"
            {...register('partnerPensionContributionMonthly')}
            value="0"
            readOnly
          />
        )}
        <CurrencyInput
          name="isaContributionMonthly"
          control={control}
          label="Monthly ISA investing"
          placeholder="250"
          helpText="Regular amounts invested into ISAs."
          error={errors.isaContributionMonthly}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        {blueprintFor === 'family' ? (
          <CurrencyInput
            name="partnerIsaContributionMonthly"
            control={control}
            label="Partner’s monthly ISA investing"
            placeholder="200"
            error={errors.partnerIsaContributionMonthly}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : (
          <input type="hidden" {...register('partnerIsaContributionMonthly')} value="0" readOnly />
        )}
        {numberOfChildren > 0 ? (
          <CurrencyInput
            name="childcareVouchersMonthly"
            control={control}
            label="Childcare vouchers received each month"
            placeholder="100"
            error={errors.childcareVouchersMonthly}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : (
          <input type="hidden" {...register('childcareVouchersMonthly')} value="0" readOnly />
        )}
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

export default Step3_Expenses;
