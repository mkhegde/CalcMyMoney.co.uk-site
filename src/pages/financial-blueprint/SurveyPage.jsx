// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';

// --- Placeholder Step Components ---
// We will replace these with real components later.
const Step1 = ({ onNext }) => <div className="text-center"><h2 className="text-2xl font-bold">Step 1: Profile</h2><p className="mt-4">Profile questions will go here.</p><button onClick={onNext} className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md">Next</button></div>;
const Step2 = ({ onBack, onNext }) => <div className="text-center"><h2 className="text-2xl font-bold">Step 2: Income</h2><p className="mt-4">Income questions will go here.</p><div className="flex justify-center gap-4 mt-6"><button onClick={onBack} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">Back</button><button onClick={onNext} className="bg-indigo-600 text-white py-2 px-4 rounded-md">Next</button></div></div>;
// ---

const TOTAL_STEPS = 6; // We have 6 steps in our plan

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Our full data object will go here later
  });

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // If on the last step, submit the form
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Something went wrong.');
      }
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate completion percentage
  const completionPercentage = ((currentStep - 1) / TOTAL_STEPS) * 100;

  // This is the main render logic
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-8">Generating your report...</div>;
    }
    if (error) {
      return <div className="text-center p-8 text-red-600">{error}</div>;
    }
    if (reportData) {
      return <ReportDisplay reportData={reportData} />;
    }

    // --- RENDER THE CURRENT STEP ---
    // This switch statement is the "brain" of our survey
    let stepContent;
    switch (currentStep) {
      case 1:
        stepContent = <Step1 onNext={handleNext} />;
        break;
      case 2:
        stepContent = <Step2 onBack={handleBack} onNext={handleNext} />;
        break;
      // We will add cases for steps 3, 4, 5, 6 later
      default:
        stepContent = <div><p>Step {currentStep}</p><button onClick={handleBack} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md">Back</button><button onClick={handleNext} className="bg-indigo-600 text-white py-2 px-4 rounded-md">Finish</button></div>;
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

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white my-10 rounded-lg shadow-md">
      {renderContent()}
    </div>
  );
};

export default SurveyPage;
