// src/pages/financial-blueprint/report-components/ProfileSummary.jsx
import React from 'react';

const ProfileSummary = ({ data }) => {
  if (!data) return null;

  const { userCode, headline, household, dependants, employment, location, incomeOverview, priorities } = data;

  return (
    <section className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-800">Profile Summary</h2>
        {userCode ? <span className="text-sm font-mono text-gray-500">Reference: {userCode}</span> : null}
      </div>

      {headline ? <p className="text-gray-700 text-sm">{headline}</p> : null}

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {household ? (
          <div>
            <dt className="font-medium text-gray-600">Household</dt>
            <dd className="text-gray-900">{household}</dd>
          </div>
        ) : null}
        {dependants ? (
          <div>
            <dt className="font-medium text-gray-600">Dependants</dt>
            <dd className="text-gray-900">{dependants}</dd>
          </div>
        ) : null}
        {employment ? (
          <div>
            <dt className="font-medium text-gray-600">Employment</dt>
            <dd className="text-gray-900">{employment}</dd>
          </div>
        ) : null}
        {location ? (
          <div>
            <dt className="font-medium text-gray-600">Location</dt>
            <dd className="text-gray-900">{location}</dd>
          </div>
        ) : null}
      </dl>

      {incomeOverview ? (
        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Income Overview</h3>
          <p className="text-sm text-gray-600">{incomeOverview}</p>
        </div>
      ) : null}

      {Array.isArray(priorities) && priorities.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Top Priorities</h3>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-600">
            {priorities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
};

export default ProfileSummary;
