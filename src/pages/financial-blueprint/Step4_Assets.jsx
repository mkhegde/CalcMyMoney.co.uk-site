import React from 'react';
import CurrencyInput from '@/components/form/CurrencyInput.jsx';

const Step4_Assets = ({ onBack, onNext, control, errors, currentStep, totalSteps }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Step {currentStep} of {totalSteps}: What you own
        </h2>
        <p className="mt-2 text-gray-600">
          Capture the current value of your assets. Use £0 for anything that does not apply.
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <CurrencyInput
          name="cashSavings"
          control={control}
          label="Cash savings"
          placeholder="15,000"
          error={errors.cashSavings}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="pensionValue"
          control={control}
          label="Total pension value"
          placeholder="50,000"
          helpText="Workplace, personal and self-invested pensions."
          error={errors.pensionValue}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="propertyValue"
          control={control}
          label="Primary residence value"
          placeholder="250,000"
          error={errors.propertyValue}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="otherInvestments"
          control={control}
          label="Other investments"
          placeholder="10,000"
          helpText="Stocks & Shares ISAs, funds, portfolios, crypto, etc."
          error={errors.otherInvestments}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
        <CurrencyInput
          name="otherAssets"
          control={control}
          label="Other significant assets"
          placeholder="5,000"
          helpText="Vehicles, business interests or other valuable items."
          error={errors.otherAssets}
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

export default Step4_Assets;
