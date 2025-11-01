// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';
import Step1_Profile from './Step1_Profile'; // <-- 1. IMPORT the new component

// --- Placeholder for Step 2 ---
const Step2 = ({ onBack, onNext }) => <div className="text-center"><h2 className="text-2xl font-bold">Step 2: Income</h2><p className="mt-4">Income questions will go here.</p><div className="flex justify-center gap-4 mt-6"><button onClick={onBack} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">Back</button><button onClick={onNext} className="bg-indigo-600 text-white py-2 px-4 rounded-md">Next</button></div></div>;
// ---

const TOTAL_STEPS = 6;

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // --- 2. UPDATE state to include all our new fields ---
  const [formData, setFormData] = useState({
    blueprintFor: 'individual',
    location: 'england',
    maritalStatus: 'single',
    age: '',
    profession: '',
    // We will add income, assets, etc. here in later steps
  });

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 3. CREATE a universal handleChange function ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // The handleSubmit function remains the same
  const handleSubmit = async () => { /* ... no changes here ... */ };

  const completionPercentage = ((currentStep - 1) / TOTAL_STEPS) * 100;

  const renderContent = () => {
    if (isLoading) { /* ... no changes here ... */ }
    if (error) { /* ... no changes here ... */ }
    if (reportData) { /* ... no changes here ... */ }

    let stepContent;
    switch (currentStep) {
      case 1:
        // --- 4. USE the new component, passing props ---
        stepContent = <Step1_Profile onNext={handleNext} formData={formData} handleChange={handleChange} />;
        break;
      case 2:
        stepContent = <Step2 onBack={handleBack} onNext={handleNext} />;
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

  // This part needs the full code for handleSubmit and renderContent's other conditions
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white my-10 rounded-lg shadow-md">
      {renderContent()}
    </div>
  );
};

export default SurveyPage;
