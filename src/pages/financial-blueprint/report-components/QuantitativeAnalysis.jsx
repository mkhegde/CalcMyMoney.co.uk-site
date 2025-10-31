// src/pages/financial-blueprint/report-components/QuantitativeAnalysis.jsx

import React from 'react';

// A reusable component for the three main stats
const StatCard = ({ label, value, isPrimary = false }) => (
  <div className={`p-4 rounded-lg ${isPrimary ? 'bg-indigo-50' : 'bg-gray-50'}`}>
    <div className="text-sm font-medium text-gray-500">{label}</div>
    <div className={`text-2xl font-bold ${isPrimary ? 'text-indigo-600' : 'text-gray-900'}`}>{value}</div>
  </div>
);

const QuantitativeAnalysis = ({ data }) => {
  // Don't render if there's no data
  if (!data) {
    return null;
  }
  
  // Helper function to format numbers as UK currency
  const formatCurrency = (val) => `£${Number(val || 0).toLocaleString()}`;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Section 2: Quantitative Analysis</h2>
      
      {/* A 3-column grid on medium screens, single column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Net Worth" value={formatCurrency(data.netWorth)} isPrimary />
        <StatCard label="Total Assets" value={format-currency(data.totalAssets)} />
        <StatCard label="Total Liabilities" value={formatCurrency(data.totalLiabilities)} />
      </div>
    </div>
  );
};

export default QuantitativeAnalysis;
