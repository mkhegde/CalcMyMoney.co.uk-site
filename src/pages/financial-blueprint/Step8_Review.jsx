// src/pages/financial-blueprint/Step8_Review.jsx
import React from 'react';
import { safeGBP, parseMoney } from '../../utils/number';

const ReviewItem = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-200">
    <dt className="text-sm font-medium text-gray-600">{label}</dt>
    <dd className="text-sm font-semibold text-gray-900 capitalize">{value || 'Not provided'}</dd>
  </div>
);

const SectionHeader = ({ title }) => (
  <h3 className="text-lg font-semibold text-gray-800 pt-4 mb-2">{title}</h3>
);

const Step8_Review = ({ onBack, handleSubmit, formData }) => {
  const formatMoney = (val) =>
    `£${safeGBP(parseMoney(val), { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Step 8: Review Your Information</h2>
        <p className="mt-2 text-gray-600">
          Please confirm your details are correct before generating your blueprint.
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <dl className="space-y-2">
          {/* --- PROFILE --- */}
          <SectionHeader title="Profile" />
          <ReviewItem label="Blueprint For" value={formData.blueprintFor} />
          <ReviewItem label="Location" value={formData.location} />
          <ReviewItem label="Your Age" value={formData.age} />
          {formData.blueprintFor === 'family' && (
            <ReviewItem label="Partner's Age" value={formData.partnerAge} />
          )}
          <ReviewItem label="Your Profession" value={formData.profession} />
          {formData.blueprintFor === 'family' && (
            <ReviewItem label="Partner's Profession" value={formData.partnerProfession} />
          )}

          {/* --- INCOME --- */}
          <SectionHeader title="Income" />
          <ReviewItem label="Your Annual Salary" value={formatMoney(formData.yourSalary)} />
          {formData.blueprintFor === 'family' && (
            <ReviewItem label="Partner's Salary" value={formatMoney(formData.partnerSalary)} />
          )}
          <ReviewItem label="Monthly Other Income" value={formatMoney(formData.otherIncome)} />
          <ReviewItem label="Monthly Benefits" value={formatMoney(formData.benefitsIncome)} />

          {/* --- EXPENSES --- */}
          <SectionHeader title="Expenses" />
          <ReviewItem
            label="Monthly Essential Expenses"
            value={formatMoney(formData.essentialExpenses)}
          />
          <ReviewItem
            label="Monthly Discretionary Spending"
            value={formatMoney(formData.discretionaryExpenses)}
          />
          <ReviewItem
            label="Annual Irregular Expenses"
            value={formatMoney(formData.annualExpenses)}
          />

          {/* --- ASSETS --- */}
          <SectionHeader title="Assets" />
          <ReviewItem label="Cash Savings" value={formatMoney(formData.cashSavings)} />
          <ReviewItem label="Pension Value" value={formatMoney(formData.pensionValue)} />
          <ReviewItem label="Property Value" value={formatMoney(formData.propertyValue)} />
          <ReviewItem label="Other Investments" value={formatMoney(formData.otherInvestments)} />

          {/* --- LIABILITIES --- */}
          <SectionHeader title="Liabilities" />
          <ReviewItem label="Mortgage Balance" value={formatMoney(formData.mortgageBalance)} />
          <ReviewItem label="Credit Card Debt" value={formatMoney(formData.creditCardDebt)} />
          <ReviewItem label="Other Loans" value={formatMoney(formData.otherLoans)} />

          {/* --- MINDSET --- */}
          <SectionHeader title="Financial Mindset" />
          <ReviewItem label="Earning Habit" value={formData.earningHabit} />
          <ReviewItem label="Saving Habit" value={formData.savingHabit} />
          <ReviewItem label="Investing Habit" value={formData.investingHabit} />

          {/* --- PROTECTION --- */}
          <SectionHeader title="Financial Protection" />
          <ReviewItem label="Has a Will" value={formData.hasWill} />
          <ReviewItem label="Has Life Insurance" value={formData.hasLifeInsurance} />
          <ReviewItem label="Has Income Protection" value={formData.hasIncomeProtection} />
          <ReviewItem label="Has an LPA" value={formData.hasLPA} />
        </dl>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back to Edit
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Confirm & Generate Report
        </button>
      </div>
    </div>
  );
};

export default Step8_Review;
