import React from 'react';
import CurrencyInput from '@/components/form/CurrencyInput.jsx';

const radioGroup = 'form-radio h-4 w-4 text-indigo-600';

const Step1_Profile = ({ onNext, register, control, errors, watch, currentStep, totalSteps }) => {
  const blueprintFor = watch('blueprintFor');
  const housingStatus = watch('housingStatus');
  const numberOfChildren = watch('numberOfChildren');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Step {currentStep} of {totalSteps}: Your Household Profile
        </h2>
        <p className="mt-2 text-gray-600">
          Tell us about your current circumstances so we can tailor the blueprint to your needs.
        </p>
      </div>

      <div className="space-y-8 rounded-lg bg-gray-50 p-6 border border-gray-200">
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">
            Who is this blueprint for?
          </legend>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                value="individual"
                {...register('blueprintFor')}
                className={radioGroup}
              />
              <span>Individual</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                value="family"
                {...register('blueprintFor')}
                className={radioGroup}
              />
              <span>Family / Joint</span>
            </label>
          </div>
          {errors.blueprintFor ? (
            <p className="mt-1 text-sm text-red-600">{errors.blueprintFor.message}</p>
          ) : null}
        </fieldset>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Where do you live?
          </label>
          <select
            id="location"
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 pl-3 pr-10"
          >
            <option value="england">England</option>
            <option value="scotland">Scotland</option>
            <option value="wales">Wales</option>
            <option value="northern-ireland">Northern Ireland</option>
          </select>
          {errors.location ? (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="housingStatus" className="block text-sm font-medium text-gray-700">
            What best describes your housing situation?
          </label>
          <select
            id="housingStatus"
            {...register('housingStatus')}
            className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 pl-3 pr-10"
          >
            <option value="renting">Renting</option>
            <option value="mortgaged">Mortgage in place</option>
            <option value="owned">Owned outright</option>
          </select>
          {errors.housingStatus ? (
            <p className="mt-1 text-sm text-red-600">{errors.housingStatus.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
            Marital status
          </label>
          <select
            id="maritalStatus"
            {...register('maritalStatus')}
            className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 pl-3 pr-10"
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="in-partnership">In a partnership</option>
          </select>
          {errors.maritalStatus ? (
            <p className="mt-1 text-sm text-red-600">{errors.maritalStatus.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Your age
          </label>
          <input
            type="number"
            id="age"
            {...register('age')}
            className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            placeholder="e.g. 35"
            min={18}
            max={110}
          />
          {errors.age ? <p className="mt-1 text-sm text-red-600">{errors.age.message}</p> : null}
        </div>

        {blueprintFor === 'family' ? (
          <div>
            <label htmlFor="partnerAge" className="block text-sm font-medium text-gray-700">
              Partner's age
            </label>
            <input
              type="number"
              id="partnerAge"
              {...register('partnerAge')}
              className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              placeholder="e.g. 33"
              min={18}
              max={110}
            />
            {errors.partnerAge ? (
              <p className="mt-1 text-sm text-red-600">{errors.partnerAge.message}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
            Your profession
          </label>
          <input
            type="text"
            id="profession"
            {...register('profession')}
            className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            placeholder="e.g. Software Engineer"
          />
          {errors.profession ? (
            <p className="mt-1 text-sm text-red-600">{errors.profession.message}</p>
          ) : null}
        </div>

        {blueprintFor === 'family' ? (
          <div>
            <label htmlFor="partnerProfession" className="block text-sm font-medium text-gray-700">
              Partner's profession
            </label>
            <input
              type="text"
              id="partnerProfession"
              {...register('partnerProfession')}
              className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              placeholder="e.g. Consultant"
            />
            {errors.partnerProfession ? (
              <p className="mt-1 text-sm text-red-600">{errors.partnerProfession.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="numberOfChildren" className="block text-sm font-medium text-gray-700">
              How many children live in your household?
            </label>
            <input
              type="number"
              id="numberOfChildren"
              {...register('numberOfChildren')}
              className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              min={0}
              placeholder="e.g. 2"
            />
            {errors.numberOfChildren ? (
              <p className="mt-1 text-sm text-red-600">{errors.numberOfChildren.message}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="specialNeedsChildren"
              className="block text-sm font-medium text-gray-700"
            >
              How many children have additional needs?
            </label>
            <input
              type="number"
              id="specialNeedsChildren"
              {...register('specialNeedsChildren')}
              className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              min={0}
              placeholder="e.g. 1"
            />
            {errors.specialNeedsChildren ? (
              <p className="mt-1 text-sm text-red-600">{errors.specialNeedsChildren.message}</p>
            ) : null}
          </div>
        </div>

        {Number(numberOfChildren) > 0 ? (
          <div>
            <label
              htmlFor="specialNeedsSupport"
              className="block text-sm font-medium text-gray-700"
            >
              Support required for dependants with additional needs
            </label>
            <textarea
              id="specialNeedsSupport"
              {...register('specialNeedsSupport')}
              className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              rows={3}
              placeholder="Provide a brief overview of therapies, assistance, or accommodations."
            />
            {errors.specialNeedsSupport ? (
              <p className="mt-1 text-sm text-red-600">{errors.specialNeedsSupport.message}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label htmlFor="healthStatus" className="block text-sm font-medium text-gray-700">
            How would you rate your overall health?
          </label>
          <select
            id="healthStatus"
            {...register('healthStatus')}
            className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 pl-3 pr-10"
          >
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
          {errors.healthStatus ? (
            <p className="mt-1 text-sm text-red-600">{errors.healthStatus.message}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">Do you smoke or vape?</legend>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="yes" {...register('smoker')} className={radioGroup} />
              <span>Yes</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="no" {...register('smoker')} className={radioGroup} />
              <span>No</span>
            </label>
          </div>
          {errors.smoker ? (
            <p className="mt-1 text-sm text-red-600">{errors.smoker.message}</p>
          ) : null}
        </fieldset>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="alcoholUnitsWeekly" className="block text-sm font-medium text-gray-700">
              Weekly alcohol consumption (units)
            </label>
            <input
              type="number"
              id="alcoholUnitsWeekly"
              {...register('alcoholUnitsWeekly')}
              className="mt-1 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              min={0}
              placeholder="e.g. 6"
            />
            {errors.alcoholUnitsWeekly ? (
              <p className="mt-1 text-sm text-red-600">{errors.alcoholUnitsWeekly.message}</p>
            ) : null}
          </div>

          <CurrencyInput
            name="tobaccoSpendWeekly"
            control={control}
            label="Weekly spend on cigarettes or tobacco"
            placeholder="0.00"
            helpText="If you do not purchase tobacco items, leave this as zero."
            error={errors.tobaccoSpendWeekly}
            minimumFractionDigits={0}
            maximumFractionDigits={2}
          />
        </div>
      </div>

      <div className="flex justify-end">
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

export default Step1_Profile;
