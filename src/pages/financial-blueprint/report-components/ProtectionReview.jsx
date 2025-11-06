// src/pages/financial-blueprint/report-components/ProtectionReview.jsx
import React from 'react';

const ProtectionReview = ({ data }) => {
  if (!data) return null;

  const { coverageOverview, existingCover, gaps, priorities } = data;

  const formatStatus = (value) => (value === 'yes' || value === true ? 'In place' : 'Not in place');

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Financial Protection Review</h2>
      <div className="rounded-lg bg-white shadow p-6 space-y-4">
        <p className="text-gray-700 text-sm">{coverageOverview}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Existing Cover</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Will</dt>
                <dd className="font-medium text-gray-900">{formatStatus(existingCover?.hasWill)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Life Insurance</dt>
                <dd className="font-medium text-gray-900">{formatStatus(existingCover?.hasLifeInsurance)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Income Protection</dt>
                <dd className="font-medium text-gray-900">{formatStatus(existingCover?.hasIncomeProtection)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Lasting Power of Attorney</dt>
                <dd className="font-medium text-gray-900">{formatStatus(existingCover?.hasLPA)}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Protection Gaps</h3>
            {Array.isArray(gaps) && gaps.length > 0 ? (
              <ul className="space-y-1 list-disc list-inside text-gray-600">
                {gaps.map((gap, index) => (
                  <li key={index}>{gap}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No major gaps identified.</p>
            )}
          </div>
        </div>

        {Array.isArray(priorities) && priorities.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Priority Actions</h3>
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-600">
              {priorities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProtectionReview;
