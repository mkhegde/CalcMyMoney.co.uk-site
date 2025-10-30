// src/pages/financial-blueprint/report-components/QuantitativeAnalysis.jsx
import React from 'react';

const StatCard = ({ label, value, isPrimary = false }) => (
  <div className={`p-4 rounded-lg ${isPrimary ? 'bg-indigo-50' : 'bg-gray-50'}`}>
    <div className="text-sm font-medium text-gray-500">{label}</div>
    <div className={`text-2xl font-bold ${isPrimary ? 'text-indigo-600' : 'text-gray-900'}`}>{value}</div>
  </div>
);

const QuantitativeAnalysis = ({ data }) => {
  if (!data) return null;
  const formatCurrency = (val) => `£${Number(val || 0).toLocaleString()}`;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Section 2: Quantitative Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Net Worth" value={formatCurrency(data.netWorth)} isPrimary />
        <StatCard label="Total Assets" value={formatCurrency(data.totalAssets)} />
        <StatCard label="Total Liabilities" value={formatCurrency(data.totalLiabilities)} />
      </div>
    </div>
  );
};

export default QuantitativeAnalysis;```

**File 3: `SwotAnalysis.jsx`**
```jsx
// src/pages/financial-blueprint/report-components/SwotAnalysis.jsx
import React from 'react';

const SwotSection = ({ title, items, color }) => (
  <div className="bg-white p-4 rounded-lg border">
    <h3 className={`font-semibold mb-2 text-${color}-600`}>{title}</h3>
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
        <SwotSection title="Strengths" items={data.strengths} color="green" />
        <SwotSection title="Weaknesses" items={data.weaknesses} color="red" />
        <SwotSection title="Opportunities" items={data.opportunities} color="blue" />
        <SwotSection title="Threats" items={data.threats} color="yellow" />
      </div>
    </div>
  );
};

export default SwotAnalysis;
