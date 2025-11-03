import React, { useMemo } from 'react';
import CurrencyInput from '@/components/form/CurrencyInput.jsx';

const Step2_Income = ({ onBack, onNext, control, errors, watch }) => {
  const blueprintFor = watch('blueprintFor');
  const salary = Number(watch('yourSalary') || 0);
  const partnerSalary = blueprintFor === 'family' ? Number(watch('partnerSalary') || 0) : 0;
  const otherIncomeMonthly = Number(watch('otherIncomeMonthly') || 0);
  const benefitsIncomeMonthly = Number(watch('benefitsIncomeMonthly') || 0);

  const summary = useMemo(() => {
    const otherIncome = otherIncomeMonthly * 12;
    const benefitsIncome = benefitsIncomeMonthly * 12;
    const annualised = salary + partnerSalary + otherIncome + benefitsIncome;
    return {
      salary,
      partnerSalary,
      otherIncome,
      benefitsIncome,
      annualised,
    };
  }, [salary, partnerSalary, otherIncomeMonthly, benefitsIncomeMonthly]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Step 2 of 9: Household income</h2>
        <p className="mt-2 text-gray-600">
          Capture every source of income so we can model tax, NI, and take-home pay accurately.
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <CurrencyInput
          name="yourSalary"
          control={control}
          label="Your annual salary (before tax)"
          placeholder="65,000"
          error={errors.yourSalary}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />

        {blueprintFor === 'family' ? (
          <CurrencyInput
            name="partnerSalary"
            control={control}
            label="Partner's annual salary (before tax)"
            placeholder="55,000"
            error={errors.partnerSalary}
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ) : null}

        <CurrencyInput
          name="otherIncomeMonthly"
          control={control}
          label="Average monthly income from other sources"
          placeholder="250"
          helpText="Rental profits, dividends, side hustles, additional employment."
          error={errors.otherIncomeMonthly}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />

        <CurrencyInput
          name="benefitsIncomeMonthly"
          control={control}
          label="Monthly income from benefits or allowances"
          placeholder="150"
          helpText="Child Benefit, Universal Credit, PIP, carers allowance."
          error={errors.benefitsIncomeMonthly}
          minimumFractionDigits={0}
          maximumFractionDigits={0}
        />
      </div>

      <div className="rounded-lg border border-indigo-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800">Annualised snapshot</h3>
        <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <div className="flex justify-between">
            <dt>Your salary</dt>
            <dd>£{summary.salary.toLocaleString('en-GB')}</dd>
          </div>
          {blueprintFor === 'family' ? (
            <div className="flex justify-between">
              <dt>Partner salary</dt>
              <dd>£{summary.partnerSalary.toLocaleString('en-GB')}</dd>
            </div>
          ) : null}
          <div className="flex justify-between">
            <dt>Other income (annualised)</dt>
            <dd>£{summary.otherIncome.toLocaleString('en-GB')}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Benefits (annualised)</dt>
            <dd>£{summary.benefitsIncome.toLocaleString('en-GB')}</dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-indigo-100 pt-3 text-base font-semibold text-indigo-900">
          <span>Total gross household income</span>
          <span>£{summary.annualised.toLocaleString('en-GB')}</span>
        </div>
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

export default Step2_Income;
