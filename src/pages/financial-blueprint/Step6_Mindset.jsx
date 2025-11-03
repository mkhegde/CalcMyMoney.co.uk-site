// src/pages/financial-blueprint/Step6_Mindset.jsx
import React from 'react';

// Reusable component for our new mindset questions
const MindsetQuestion = ({ question, name, value, handleChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{question}</label>
    <div className="mt-2 space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            className="form-radio h-4 w-4 text-indigo-600"
          />
          <span className="ml-3 text-sm text-gray-800">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const Step6_Mindset = ({ onBack, onNext, formData, handleChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Step 6 of 7: Your Financial Mindset</h2>
        <p className="mt-2 text-gray-600">How do you approach your finances?</p>
      </div>

      <div className="space-y-8 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <MindsetQuestion
          question="Regarding what you EARN, which best describes you?"
          name="earningHabit"
          value={formData.earningHabit}
          handleChange={handleChange}
          options={[
            { value: 'active', label: 'I actively look for ways to increase my income.' },
            { value: 'stable', label: 'I am content with my current, stable income.' },
            { value: 'passive', label: 'I tend not to think about my income level often.' },
          ]}
        />
        <MindsetQuestion
          question="Regarding what you SAVE, which best describes you?"
          name="savingHabit"
          value={formData.savingHabit}
          handleChange={handleChange}
          options={[
            {
              value: 'disciplined',
              label: 'I save a set amount from every paycheck without fail.',
            },
            { value: 'opportunistic', label: 'I save what is left over at the end of the month.' },
            { value: 'struggling', label: 'I find it difficult to save money regularly.' },
          ]}
        />
        <MindsetQuestion
          question="Regarding how you GROW your money, which best describes you?"
          name="investingHabit"
          value={formData.investingHabit}
          handleChange={handleChange}
          options={[
            {
              value: 'confident',
              label: 'I am comfortable with investing and manage my own portfolio.',
            },
            {
              value: 'cautious',
              label: 'I am interested in investing but hesitant or unsure where to start.',
            },
            { value: 'avoidant', label: 'I prefer to keep my money in cash savings accounts.' },
          ]}
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
          Next
        </button>
      </div>
    </div>
  );
};

export default Step6_Mindset;
