// src/pages/financial-blueprint/Step1_Profile.jsx
import React from 'react';

const Step1_Profile = ({ onNext, formData, handleChange }) => {
  // --- UPDATED STYLES ---
  // Slightly darker border and a subtle background color on the input
  const inputStyles = "mt-1 block w-full rounded-md border-gray-400 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2";
  const selectStyles = "mt-1 block w-full rounded-md border-gray-400 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 pl-3 pr-10";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Step 1: Your Profile</h2>
        <p className="mt-2 text-gray-600">Let's start with some basic details to tailor your report.</p>
      </div>

      {/* --- ADDED A BACKGROUND AND PADDING TO THE FORM AREA --- */}
      <div className="space-y-6 rounded-lg bg-gray-50 p-6 border border-gray-200">
        {/* Blueprint For: Individual or Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700">This blueprint is for:</label>
          <div className="mt-2 flex gap-4">
            <label className="inline-flex items-center">
              <input type="radio" name="blueprintFor" value="individual" checked={formData.blueprintFor === 'individual'} onChange={handleChange} className="form-radio h-4 w-4 text-indigo-600"/>
              <span className="ml-2">An Individual</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="blueprintFor" value="family" checked={formData.blueprintFor === 'family'} onChange={handleChange} className="form-radio h-4 w-4 text-indigo-600"/>
              <span className="ml-2">A Family (Joint)</span>
            </label>
          </div>
        </div>

        {/* Location Dropdown */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Where do you live?</label>
          <select id="location" name="location" value={formData.location} onChange={handleChange} className={selectStyles}>
            <option value="england">England</option>
            <option value="scotland">Scotland</option>
            <option value="wales">Wales</option>
            <option value="northern-ireland">Northern Ireland</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">This helps us apply the correct tax rules.</p>
        </div>
        
        {/* Marital Status (Conditional on 'Individual') */}
        {formData.blueprintFor === 'individual' && (
          <div>
            <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">What is your marital status?</label>
            <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={selectStyles}>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="in-partnership">In a Partnership</option>
            </select>
          </div>
        )}

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Your Age</label>
          <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className={inputStyles} placeholder="e.g., 35" />
        </div>

        {/* Partner's Age (Conditional on 'Family') */}
        {formData.blueprintFor === 'family' && (
          <div>
            <label htmlFor="partnerAge" className="block text-sm font-medium text-gray-700">Your Partner's Age</label>
            <input type="number" id="partnerAge" name="partnerAge" value={formData.partnerAge} onChange={handleChange} className={inputStyles} placeholder="e.g., 34" />
          </div>
        )}

        {/* Profession */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Your Profession</label>
          <input type="text" id="profession" name="profession" value={formData.profession} onChange={handleChange} className={inputStyles} placeholder="e.g., Software Engineer" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button onClick={onNext} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1_Profile;
