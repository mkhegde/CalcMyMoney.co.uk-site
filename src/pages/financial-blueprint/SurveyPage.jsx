// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';

// Import all our schemas and components
import { step1Schema, step2Schema, step4Schema } from './schemas';
import Step1_Profile from './Step1_Profile';
import Step2_Income from './Step2_Income';
import Step3_Expenses from './Step3_Expenses';

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [finalData, setFinalData] = useState({});
  const stepConfigs = useMemo(
    () => [
      { Component: Step1_Profile, schema: step1Schema },
      { Component: Step2_Income, schema: step2Schema },
      { Component: Step3_Expenses, schema: step4Schema },
    ],
    []
  );
  const totalSteps = stepConfigs.length;
  const currentIndex = Math.min(Math.max(currentStep - 1, 0), totalSteps - 1);
  const currentStepConfig = stepConfigs[currentIndex];
  const currentSchema = useMemo(() => currentStepConfig?.schema, [currentStepConfig]);
  const resolver = useMemo(() => (currentSchema ? zodResolver(currentSchema) : undefined), [currentSchema]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    control,
  } = useForm({
    resolver,
    defaultValues: {
      blueprintFor: 'individual',
      location: 'england',
      housingStatus: 'renting',
      maritalStatus: 'single',
      age: '',
      partnerAge: '',
      profession: '',
      partnerProfession: '',
      numberOfChildren: '0',
      specialNeedsChildren: '0',
      specialNeedsSupport: '',
      healthStatus: 'good',
      smoker: 'no',
      alcoholUnitsWeekly: '0',
      tobaccoSpendWeekly: '0',
      yourSalary: '',
      partnerSalary: '',
      otherIncomeMonthly: '0',
      benefitsIncomeMonthly: '0',
      expensesHousing: '0',
      expensesUtilities: '0',
      expensesGroceries: '0',
      expensesTransport: '0',
      expensesLifestyle: '0',
      expensesChildcare: '0',
      specialNeedsCostsMonthly: '0',
    },
    shouldUnregister: false,
  });

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const processStep = (data) => {
    setFinalData((prev) => ({ ...prev, ...data }));
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      finalSubmit({ ...finalData, ...data });
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      handleSubmit(processStep)();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finalSubmit = async (allData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...allData,
        otherIncome: allData.otherIncomeMonthly ?? allData.otherIncome ?? '0',
        benefitsIncome: allData.benefitsIncomeMonthly ?? allData.benefitsIncome ?? '0',
      };
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const completionPercentage = totalSteps ? (currentStep / totalSteps) * 100 : 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-12">
          <h2 className="text-2xl font-semibold">Generating Your Blueprint...</h2>
          <p className="mt-2 text-gray-600">
            Our AI is analyzing your data. This may take a moment.
          </p>
        </div>
      );
    }
    if (error) {
      return <div className="text-center p-8 text-red-600">{error}</div>;
    }
    if (reportData) {
      return <ReportDisplay reportData={reportData} />;
    }

    const StepComponent = currentStepConfig?.Component;
    if (!StepComponent) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Step {currentStep}</h2>
          <p className="mt-4">This step is unavailable. Please go back and try again.</p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-6 bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
          >
            Go Back
          </button>
        </div>
      );
    }

    return (
      <StepComponent
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        onNext={handleNext}
        onBack={handleBack}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white my-10 rounded-lg shadow-md">
      {reportData || isLoading || error ? null : (
        <div className="mb-8">
          <ProgressBar completion={completionPercentage} />
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default SurveyPage;
