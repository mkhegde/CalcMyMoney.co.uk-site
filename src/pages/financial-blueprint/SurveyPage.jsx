// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';
import Step1_Profile from './Step1_Profile';
import Step2_Income from './Step2_Income'; // <-- 1. IMPORT Step 2

// --- Placeholder for Step 3 ---
const Step3 = ({ onBack, onNext }) => <div className="text-center"><h2 className="text-2xl font-bold">Step 3: Expenses</h2><p className="mt-4">Expense questions will go here.</p><div className="flex justify-center gap-4 mt-6"><button onClick={onBack} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">Back</button><button onClick={onNext} className="bg-indigo-600 text-white py-2 px-4 rounded-md">Next</button></div></div>;
// ---

const TOTAL_STEPS = 6;

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // --- 2. UPDATE state to include all our new fields ---
  const [formData, setFormData] = useState({
    // Step 1
    blueprintFor: 'individual',
    location: 'england',
    maritalStatus: 'single',
    age: '',
    partnerAge: '',
    profession: '',
    // Step 2
    yourSalary: '',
    partnerSalary: '',
    otherIncome: '',
    benefitsIncome: '',
  });

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // No changes needed to our handler functions
  const handleChange = (e) => { /* ... */ };
  const handleNext = () => { /* ... */ };
  const handleBack = () => { /* ... */ };
  const handleSubmit = async () => { /* ... */ };

  const completionPercentage = ((currentStep - 1) / TOTAL_STEPS) * 100;

  const renderContent = () => {
    if (isLoading) { /* ... */ }
    if (error) { /* ... */ }
    if (reportData) { /* ... */ }

    let stepContent;
    switch (currentStep) {
      case 1:
        stepContent = <Step1_Profile onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      case 2:
        // --- 3. USE the new Step 2 component ---
        stepContent = <Step2_Income onBack={handleBack} onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      case 3:
        stepContent = <Step3 onBack={handleBack} onNext={handleNext} />;
        break;
      default:
        stepContent = <div><p>Step {currentStep}</p><button onClick={handleBack}>Back</button><button onClick={handleNext}>Finish</button></div>;
    }

    return (
      <>
        <div className="mb-8">
          <ProgressBar completion={completionPercentage} />
        </div>
        {stepContent}
      </>
    );
  };

  // The full code with all the handlers
  // (Paste the full component code here from previous steps to be safe)
  return (
     <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white my-10 rounded-lg shadow-md">
      {renderContent()}
    </div>
  );
};


export default SurveyPage;
