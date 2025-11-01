// src/pages/financial-blueprint/Step6_Protection.jsx
import React from 'react';

// A reusable component for our Yes/No questions
const RadioQuestion = ({ label, name, value, handleChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-2 flex gap-4">
      <label className="inline-flex items-center">
        <input type="radio" name={name} value="yes" checked={value === 'yes'} onChange={handleChange} className="form-radio h-4 w-4 text-indigo-600"/>
        <span className="ml-2">Yes</span>
      </label>
      <label className="inline-flex items-center">
        <input type="radio" name={name} value="no" checked={value === 'no'} onChange={handleChange} className="form-radio h-4 w-4 text-indigo-600"/>
        <span className="ml-2">No</span>
      </label>
    </div>
  </div>
);

const Step6_Protection = ({ onBack, onNext, formData, handleChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Step 6: Financial Protection</h2>
        <p className="mt-2 text-gray-600">Finally, let's cover your financial safety net.</p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <RadioQuestion
          label="Do you have a legally valid Will?"
          name="hasWill"
          value={formData.hasWill}
          handleChange={handleChange}
        />
        <RadioQuestion
          label="Do you have Life Insurance?"
          name="hasLifeInsurance"
          value={formData.hasLifeInsurance}
          handleChange={handleChange}
        />
        <RadioQuestion
          label="Do you have Income Protection Insurance?"
          name="hasIncomeProtection"
          value={formData.hasIncomeProtection}
          handleChange={handleChange}
        />
        <RadioQuestion
          label="Do you have a Lasting Power of Attorney (LPA) in place?"
          name="hasLPA"
          value={formData.hasLPA}
          handleChange={handleChange}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={onBack} className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Back
        </button>
        <button onClick={onNext} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          Finish & Generate Report
        </button>
      </div>
    </div>
  );
};

export default Step6_Protection;
