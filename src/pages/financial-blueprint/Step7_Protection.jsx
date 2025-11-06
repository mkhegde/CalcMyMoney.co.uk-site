import React from 'react';
import CurrencyInput from '@/components/form/CurrencyInput.jsx';

const radioClass = 'form-radio h-4 w-4 text-indigo-600';

const RadioQuestion = ({ label, name, register, error }) => (
  <div>
    <span className="block text-sm font-medium text-gray-700">{label}</span>
    <div className="mt-2 flex gap-6">
      <label className="inline-flex items-center gap-2">
        <input type="radio" value="yes" {...register(name)} className={radioClass} />
        <span>Yes</span>
      </label>
      <label className="inline-flex items-center gap-2">
        <input type="radio" value="no" {...register(name)} className={radioClass} />
        <span>No</span>
      </label>
    </div>
    {error ? <p className="mt-1 text-sm text-red-600">{error.message}</p> : null}
  </div>
);

const Step7_Protection = ({
  onBack,
  onNext,
  register,
  errors,
  control,
  watch,
  setValue,
  currentStep,
  totalSteps,
}) => {
  const blueprintFor = watch('blueprintFor');
  const hasLifeInsurance = watch('hasLifeInsurance');
  const hasIncomeProtection = watch('hasIncomeProtection');
  const partnerHasLifeInsurance = watch('partnerHasLifeInsurance');
  const partnerHasIncomeProtection = watch('partnerHasIncomeProtection');

  React.useEffect(() => {
    const resetMoney = (field) => setValue(field, '0', { shouldValidate: false, shouldDirty: false });
    if (hasLifeInsurance !== 'yes') {
      resetMoney('lifeInsuranceBenefitAmount');
    }
    if (hasIncomeProtection !== 'yes') {
      resetMoney('incomeProtectionBenefitAmount');
    }
    if (blueprintFor !== 'family') {
      setValue('partnerHasLifeInsurance', 'no', { shouldValidate: false, shouldDirty: false });
      setValue('partnerHasIncomeProtection', 'no', { shouldValidate: false, shouldDirty: false });
      resetMoney('partnerLifeInsuranceBenefitAmount');
      resetMoney('partnerIncomeProtectionBenefitAmount');
    } else {
      if (partnerHasLifeInsurance !== 'yes') {
        resetMoney('partnerLifeInsuranceBenefitAmount');
      }
      if (partnerHasIncomeProtection !== 'yes') {
        resetMoney('partnerIncomeProtectionBenefitAmount');
      }
    }
  }, [
    blueprintFor,
    hasIncomeProtection,
    hasLifeInsurance,
    partnerHasIncomeProtection,
    partnerHasLifeInsurance,
    setValue,
  ]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Step {currentStep} of {totalSteps}: Your financial protection
        </h2>
        <p className="mt-2 text-gray-600">
          Tell us about the safety nets you already have in place.
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <RadioQuestion
          label="Do you have a legally valid Will?"
          name="hasWill"
          register={register}
          error={errors.hasWill}
        />
        <RadioQuestion
          label="Do you have life insurance?"
          name="hasLifeInsurance"
          register={register}
          error={errors.hasLifeInsurance}
        />
        {hasLifeInsurance === 'yes' ? (
          <CurrencyInput
            name="lifeInsuranceBenefitAmount"
            control={control}
            label="Total life insurance benefit amount"
            placeholder="150,000"
            error={errors.lifeInsuranceBenefitAmount}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : (
          <input type="hidden" {...register('lifeInsuranceBenefitAmount')} value="0" readOnly />
        )}
        {blueprintFor === 'family' ? (
          <div className="space-y-4">
            <RadioQuestion
              label="Does your partner have life insurance?"
              name="partnerHasLifeInsurance"
              register={register}
              error={errors.partnerHasLifeInsurance}
            />
            {partnerHasLifeInsurance === 'yes' ? (
              <CurrencyInput
                name="partnerLifeInsuranceBenefitAmount"
                control={control}
                label="Partner’s life insurance benefit amount"
                placeholder="150,000"
                error={errors.partnerLifeInsuranceBenefitAmount}
                minimumFractionDigits={0}
                maximumFractionDigits={0}
              />
            ) : (
              <input
                type="hidden"
                {...register('partnerLifeInsuranceBenefitAmount')}
                value="0"
                readOnly
              />
            )}
          </div>
        ) : (
          <>
            <input type="hidden" {...register('partnerHasLifeInsurance')} value="no" readOnly />
            <input
              type="hidden"
              {...register('partnerLifeInsuranceBenefitAmount')}
              value="0"
              readOnly
            />
          </>
        )}
        <RadioQuestion
          label="Do you have income protection insurance?"
          name="hasIncomeProtection"
          register={register}
          error={errors.hasIncomeProtection}
        />
        {hasIncomeProtection === 'yes' ? (
          <CurrencyInput
            name="incomeProtectionBenefitAmount"
            control={control}
            label="Monthly income protection benefit"
            placeholder="2,000"
            error={errors.incomeProtectionBenefitAmount}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : (
          <input
            type="hidden"
            {...register('incomeProtectionBenefitAmount')}
            value="0"
            readOnly
          />
        )}
        {blueprintFor === 'family' ? (
          <div className="space-y-4">
            <RadioQuestion
              label="Does your partner have income protection insurance?"
              name="partnerHasIncomeProtection"
              register={register}
              error={errors.partnerHasIncomeProtection}
            />
            {partnerHasIncomeProtection === 'yes' ? (
              <CurrencyInput
                name="partnerIncomeProtectionBenefitAmount"
                control={control}
                label="Partner’s monthly income protection benefit"
                placeholder="2,000"
                error={errors.partnerIncomeProtectionBenefitAmount}
                minimumFractionDigits={0}
                maximumFractionDigits={0}
              />
            ) : (
              <input
                type="hidden"
                {...register('partnerIncomeProtectionBenefitAmount')}
                value="0"
                readOnly
              />
            )}
          </div>
        ) : (
          <>
            <input type="hidden" {...register('partnerHasIncomeProtection')} value="no" readOnly />
            <input
              type="hidden"
              {...register('partnerIncomeProtectionBenefitAmount')}
              value="0"
              readOnly
            />
          </>
        )}
        <RadioQuestion
          label="Do you have a lasting power of attorney (LPA)?"
          name="hasLPA"
          register={register}
          error={errors.hasLPA}
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
          Review answers
        </button>
      </div>
    </div>
  );
};

export default Step7_Protection;
