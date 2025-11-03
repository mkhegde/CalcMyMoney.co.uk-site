import React from 'react';

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

const Step7_Protection = ({ onBack, onNext, register, errors, currentStep, totalSteps }) => {
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
        <RadioQuestion
          label="Do you have income protection insurance?"
          name="hasIncomeProtection"
          register={register}
          error={errors.hasIncomeProtection}
        />
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
