// src/pages/financial-blueprint/ReportDisplay.jsx

import React from 'react';
import ProfileSummary from './report-components/ProfileSummary';
import FinancialOverview from './report-components/FinancialOverview';
import QuantitativeAnalysis from './report-components/QuantitativeAnalysis';
import TaxAndCashflow from './report-components/TaxAndCashflow';
import RetirementSnapshot from './report-components/RetirementSnapshot';
import ProtectionReview from './report-components/ProtectionReview';
import SwotAnalysis from './report-components/SwotAnalysis';
import ActionPlan from './report-components/ActionPlan';

const ReportDisplay = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="text-center p-8">
        <p>No report data available. Please generate a new report.</p>
      </div>
    );
  }

  // Destructure the data from the report for easier access
  const {
    profileSummary,
    financialOverview,
    taxAndCashflow,
    cashFlowAnalysis,
    taxAnalysis,
    quantitativeAnalysis,
    retirementSnapshot,
    protectionReview,
    swotAnalysis,
    actionPlan,
  } = reportData;

  const convertReportToCSV = (data) => {
    if (!data) return '';

    const rows = [['Section', 'Details']];

    Object.entries(data).forEach(([section, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          rows.push([
            `${section} ${index + 1}`,
            typeof item === 'object' && item !== null ? JSON.stringify(item) : item,
          ]);
        });
      } else if (typeof value === 'object' && value !== null) {
        rows.push([section, JSON.stringify(value)]);
      } else {
        rows.push([section, value ?? '']);
      }
    });

    return rows
      .map((row) => row.map((field) => `"${String(field ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportCSV = () => {
    if (typeof window === 'undefined') return;

    const csvContent = convertReportToCSV(reportData);
    const blob = new window.Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'financial-blueprint-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Your Financial Blueprint Report
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          A comprehensive analysis of your financial health.
        </p>
      </div>

      {/* Main content area for the report cards */}
      <div className="space-y-8">
        {/* We pass the relevant piece of data to each component */}
        <ProfileSummary data={profileSummary} />
        <FinancialOverview data={financialOverview} />
        <QuantitativeAnalysis data={quantitativeAnalysis} />
        <TaxAndCashflow
          data={
            taxAndCashflow ||
            (taxAnalysis || cashFlowAnalysis
              ? { tax: taxAnalysis, cashflow: cashFlowAnalysis }
              : null)
          }
        />
        <RetirementSnapshot data={retirementSnapshot} />
        <ProtectionReview data={protectionReview} />
        <SwotAnalysis data={swotAnalysis} />
        <ActionPlan data={actionPlan} />
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default ReportDisplay;
