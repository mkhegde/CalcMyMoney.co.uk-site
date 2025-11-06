import React from 'react';

const radioClass = 'form-radio h-4 w-4 text-indigo-600';

const MindsetQuestion = ({ question, name, options, register, error }) => (
  <div>
    <span className="block text-sm font-medium text-gray-700">{question}</span>
    <div className="mt-2 space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-3">
          <input type="radio" value={option.value} {...register(name)} className={radioClass} />
          <span className="text-sm text-gray-800">{option.label}</span>
        </label>
      ))}
    </div>
    {error ? <p className="mt-1 text-sm text-red-600">{error.message}</p> : null}
  </div>
);

const Step6_Mindset = ({ onBack, onNext, register, errors, currentStep, totalSteps }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Step {currentStep} of {totalSteps}: Your financial mindset
        </h2>
        <p className="mt-2 text-gray-600">
          Help us understand how you approach earning, saving and growing your money.
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <MindsetQuestion
          question="Regarding what you EARN, which best describes you?"
          name="earningHabit"
          register={register}
          error={errors.earningHabit}
          options={[
            {
              value: 'active',
              label: 'I actively look for ways to increase my income.',
            },
            { value: 'stable', label: 'I am content with my current, stable income.' },
            { value: 'passive', label: 'I tend not to think about my income level often.' },
          ]}
        />
        <MindsetQuestion
          question="Regarding what you SAVE, which best describes you?"
          name="savingHabit"
          register={register}
          error={errors.savingHabit}
          options={[
            {
              value: 'disciplined',
              label: 'I save a set amount from every paycheck without fail.',
            },
            { value: 'opportunistic', label: 'I save what is left at the end of the month.' },
            { value: 'struggling', label: 'I find it difficult to save money regularly.' },
          ]}
        />
        <MindsetQuestion
          question="Regarding how you GROW your money, which best describes you?"
          name="investingHabit"
          register={register}
          error={errors.investingHabit}
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
        <MindsetQuestion
          question="How do you feel about your emergency savings safety net?"
          name="emergencySavingsConfidence"
          register={register}
          error={errors.emergencySavingsConfidence}
          options={[
            {
              value: 'comfortable',
              label: 'I have a healthy emergency fund that covers several months of expenses.',
            },
            {
              value: 'building',
              label: 'I’m actively building my emergency savings but not at my target yet.',
            },
            {
              value: 'concerned',
              label: 'I have little to no emergency savings and want guidance.',
            },
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
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step6_Mindset;
