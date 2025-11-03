// src/pages/financial-blueprint/SurveyPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ProgressBar from './ProgressBar';
import ReportDisplay from './ReportDisplay';

// Import all our schemas and components
import { step1Schema, step2Schema, step3Schema } from './schemas';
import Step1_Profile from './Step1_Profile';
import Step2_Income from './Step2_Income';
import Step3_Expenses from './Step3_Expenses';

const TOTAL_STEPS = 8;

const schemas = [step1Schema, step2Schema, step3Schema];

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [finalData, setFinalData] = useState({});

  const currentSchema = useMemo(() => schemas[currentStep - 1], [currentStep]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      blueprintFor: 'individual',
      location: 'england',
      maritalStatus: 'single',
      age: '',
      partnerAge: '',
      profession: '',
      partnerProfession: '',
      yourSalary: '',
      partnerSalary: '',
      otherIncome: '0',
      benefitsIncome: '0',
      essentialExpenses: '',
      discretionaryExpenses: '',
      annualExpenses: '0',
    },
  });

  useEffect(() => {
    if (currentSchema) {
      reset(getValues(), {
        resolver: zodResolver(currentSchema),
      });
    }
  }, [currentSchema, reset, getValues]);

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const processStep = (data) => {
    setFinalData((prev) => ({ ...prev, ...data }));
    if (currentStep < TOTAL_STEPS) {
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
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allData),
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

  const completionPercentage = (currentStep / TOTAL_STEPS) * 100;

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

    switch (currentStep) {
      case 1:
        return (
          <Step1_Profile register={register} errors={errors} watch={watch} onNext={handleNext} />
        );
      case 2:
        return (
          <Step2_Income
            register={register}
            errors={errors}
            watch={watch}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3_Expenses
            register={register}
            errors={errors}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold">Step {currentStep}</h2>
            <p className="mt-4">This step has not been refactored yet.</p>
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
