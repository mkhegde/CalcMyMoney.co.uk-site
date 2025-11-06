import React from 'react';
import CurrencyInput from '@/components/form/CurrencyInput.jsx';

const inputClass =
  'mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2';

const textareaClass =
  'mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2';

const Step9_ProtectionDetails = ({
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
  const hasLifeInsurance = watch('hasLifeInsurance');
  const hasIncomeProtection = watch('hasIncomeProtection');
  const partnerHasLifeInsurance = watch('partnerHasLifeInsurance');
  const partnerHasIncomeProtection = watch('partnerHasIncomeProtection');

  const resetField = React.useCallback(
    (field, value = '') => setValue(field, value, { shouldValidate: false, shouldDirty: false }),
    [setValue]
  );

  React.useEffect(() => {
    if (hasLifeInsurance !== 'yes') {
      resetField('lifeInsuranceProvider');
      resetField('lifeInsuranceSumAssured', '0');
      resetField('lifeInsurancePremiumMonthlyDetail', '0');
      resetField('lifeInsuranceBeneficiaryNotes');
    }
  }, [hasLifeInsurance, resetField]);

  React.useEffect(() => {
    if (hasIncomeProtection !== 'yes') {
      resetField('incomeProtectionProvider');
      resetField('incomeProtectionBenefitMonthly', '0');
      resetField('incomeProtectionPremiumMonthlyDetail', '0');
      resetField('incomeProtectionBeneficiaryNotes');
    }
  }, [hasIncomeProtection, resetField]);

  React.useEffect(() => {
    if (blueprintFor !== 'family') {
      resetField('partnerHasLifeInsurance', 'no');
      resetField('partnerHasIncomeProtection', 'no');
    }
  }, [blueprintFor, resetField]);

  React.useEffect(() => {
    if (partnerHasLifeInsurance !== 'yes') {
      resetField('partnerLifeInsuranceProvider');
      resetField('partnerLifeInsuranceSumAssured', '0');
      resetField('partnerLifeInsurancePremiumMonthlyDetail', '0');
      resetField('partnerLifeInsuranceBeneficiaryNotes');
    }
  }, [partnerHasLifeInsurance, resetField]);

  React.useEffect(() => {
    if (partnerHasIncomeProtection !== 'yes') {
      resetField('partnerIncomeProtectionProvider');
      resetField('partnerIncomeProtectionBenefitMonthly', '0');
      resetField('partnerIncomeProtectionPremiumMonthlyDetail', '0');
      resetField('partnerIncomeProtectionBeneficiaryNotes');
    }
  }, [partnerHasIncomeProtection, resetField]);

  const renderLifeInsuranceSection = (fieldPrefix, title, showFields) => {
    const providerField = `${fieldPrefix}Provider`;
    const sumField = `${fieldPrefix}SumAssured`;
    const premiumField = `${fieldPrefix}PremiumMonthlyDetail`;
    const notesField = `${fieldPrefix}BeneficiaryNotes`;
    const idPrefix = fieldPrefix;

    return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {showFields ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor={`${idPrefix}Provider`}>
              Insurer name
            </label>
            <input
              id={`${idPrefix}Provider`}
              type="text"
              {...register(providerField)}
              className={inputClass}
            />
            {errors[providerField] ? (
              <p className="mt-1 text-sm text-red-600">
                {errors[providerField].message}
              </p>
            ) : null}
          </div>
          <CurrencyInput
            name={sumField}
            control={control}
            label="Sum assured"
            placeholder="200,000"
            error={errors[sumField]}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
          <CurrencyInput
            name={premiumField}
            control={control}
            label="Monthly premium"
            placeholder="40"
            error={errors[premiumField]}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor={`${idPrefix}BeneficiaryNotes`}
            >
              Beneficiary notes (optional)
            </label>
            <textarea
              id={`${idPrefix}BeneficiaryNotes`}
              rows={3}
              {...register(notesField)}
              className={textareaClass}
            />
            {errors[notesField] ? (
              <p className="mt-1 text-sm text-red-600">
                {errors[notesField].message}
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <input type="hidden" {...register(providerField)} value="" readOnly />
          <input type="hidden" {...register(sumField)} value="0" readOnly />
          <input type="hidden" {...register(premiumField)} value="0" readOnly />
          <input type="hidden" {...register(notesField)} value="" readOnly />
        </>
      )}
    </div>
  );
  };

  const renderIncomeProtectionSection = (fieldPrefix, title, showFields) => {
    const providerField = `${fieldPrefix}Provider`;
    const benefitField = `${fieldPrefix}BenefitMonthly`;
    const premiumField = `${fieldPrefix}PremiumMonthlyDetail`;
    const notesField = `${fieldPrefix}BeneficiaryNotes`;
    const idPrefix = fieldPrefix;

    return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {showFields ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor={`${idPrefix}Provider`}>
              Insurer name
            </label>
            <input
              id={`${idPrefix}Provider`}
              type="text"
              {...register(providerField)}
              className={inputClass}
            />
            {errors[providerField] ? (
              <p className="mt-1 text-sm text-red-600">
                {errors[providerField].message}
              </p>
            ) : null}
          </div>
          <CurrencyInput
            name={benefitField}
            control={control}
            label="Monthly benefit"
            placeholder="2,000"
            error={errors[benefitField]}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
          <CurrencyInput
            name={premiumField}
            control={control}
            label="Monthly premium"
            placeholder="60"
            error={errors[premiumField]}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor={`${idPrefix}BeneficiaryNotes`}
            >
              Notes on payout or beneficiaries (optional)
            </label>
            <textarea
              id={`${idPrefix}BeneficiaryNotes`}
              rows={3}
              {...register(notesField)}
              className={textareaClass}
            />
            {errors[notesField] ? (
              <p className="mt-1 text-sm text-red-600">
                {errors[notesField].message}
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <input type="hidden" {...register(providerField)} value="" readOnly />
          <input type="hidden" {...register(benefitField)} value="0" readOnly />
          <input type="hidden" {...register(premiumField)} value="0" readOnly />
          <input type="hidden" {...register(notesField)} value="" readOnly />
        </>
      )}
    </div>
  );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Step {currentStep} of {totalSteps}: Protection policy details
        </h2>
        <p className="mt-2 text-gray-600">
          Capture the specifics of your protection policies so we can highlight strengths and gaps.
        </p>
      </div>

      <div className="space-y-8 rounded-lg bg-gray-50 p-6 border border-gray-200">
        {renderLifeInsuranceSection('lifeInsurance', 'Your life insurance', hasLifeInsurance === 'yes')}
        {renderIncomeProtectionSection('incomeProtection', 'Your income protection', hasIncomeProtection === 'yes')}

        {blueprintFor === 'family'
          ? (
              <>
                {renderLifeInsuranceSection(
                  'partnerLifeInsurance',
                  'Partner’s life insurance',
                  partnerHasLifeInsurance === 'yes'
                )}
                {renderIncomeProtectionSection(
                  'partnerIncomeProtection',
                  'Partner’s income protection',
                  partnerHasIncomeProtection === 'yes'
                )}
              </>
            )
          : (
              <>
                {renderLifeInsuranceSection('partnerLifeInsurance', 'Partner’s life insurance', false)}
                {renderIncomeProtectionSection('partnerIncomeProtection', 'Partner’s income protection', false)}
              </>
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

export default Step9_ProtectionDetails;
