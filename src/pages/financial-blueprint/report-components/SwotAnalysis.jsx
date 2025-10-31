// src/pages/financial-blueprint/report-components/SwotAnalysis.jsx
import React from 'react';

const SwotSection = ({ title, items, colorClass }) => (
  <div className="rounded-lg border bg-white p-4">
    <h3 className={`font-semibold mb-2 ${colorClass}`}>{title}</h3>
    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
      {items?.map((item, index) => <li key={index}>{item}</li>) || <li>No data.</li>}
    </ul>
  </div>
);

const SwotAnalysis = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial SWOT Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SwotSection title="✓ Strengths" items={data.strengths} colorClass="text-green-600" />
        <SwotSection title="! Weaknesses" items={data.weaknesses} colorClass="text-red-600" />
        <SwotSection title="↗ Opportunities" items={data.opportunities} colorClass="text-blue-600" />
        <SwotSection title="! Threats" items={data.threats} colorClass="text-orange-600" />
      </div>
    </div>
  );
};

export default SwotAnalysis;
