// src/pages/financial-blueprint/report-components/ProtectionReview.jsx
import React from 'react';
import ReportSection from './ReportSection';

const formatStatus = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not recorded';
  }
  return value === 'yes' || value === true ? 'In place' : 'Not in place';
};

const ProtectionReview = ({ data }) => {
  if (!data) {
    return (
      <ReportSection title="Protection Review">
        <p className="text-sm text-gray-500">Protection recommendations will appear once your answers are processed.</p>
      </ReportSection>
    );
  }

  const { coverageOverview, existingCover, gaps, priorities } = data;

  const hasExistingCover = existingCover && Object.keys(existingCover).length > 0;
  const hasGaps = Array.isArray(gaps) && gaps.length > 0;
  const hasPriorities = Array.isArray(priorities) && priorities.length > 0;

  return (
    <ReportSection title="Protection Review" subtitle="Assess your safety net and identify any gaps">
      {coverageOverview ? <p className="text-sm text-gray-600">{coverageOverview}</p> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700">Existing Cover</h3>
          {hasExistingCover ? (
            <dl className="mt-3 space-y-2 text-sm">
              {Object.entries(existingCover).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <dt className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())}</dt>
                  <dd className="font-medium text-gray-900">{formatStatus(value)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-2 text-sm text-gray-500">Let us know what cover you already have in place.</p>
          )}
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-amber-900">
          <h3 className="text-sm font-semibold">Protection Gaps</h3>
          {hasGaps ? (
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
              {gaps.map((gap, index) => (
                <li key={index}>{gap}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm">No major gaps identified from the current information.</p>
          )}
        </div>
      </div>

      {hasPriorities ? (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-indigo-900">
          <h3 className="text-sm font-semibold">Priority Actions</h3>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            {priorities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </ReportSection>
  );
};

export default ProtectionReview;
