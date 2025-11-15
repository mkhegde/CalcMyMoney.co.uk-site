// src/pages/financial-blueprint/report-components/ProfileSummary.jsx
import React from 'react';
import ReportSection from './ReportSection';

const formatLabel = (label) => {
  if (!label) return '';
  const cleaned = label.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const normaliseMembers = (data) => {
  if (!data) return [];

  if (Array.isArray(data.members)) {
    return data.members;
  }
  if (Array.isArray(data.household?.members)) {
    return data.household.members;
  }
  if (Array.isArray(data.clients)) {
    return data.clients;
  }

  const entries = [];
  if (data.primaryClient) {
    entries.push({ relationship: 'You', ...data.primaryClient });
  }
  if (data.partner) {
    entries.push({ relationship: 'Partner', ...data.partner });
  }
  if (Array.isArray(data.dependants)) {
    data.dependants.forEach((dependant) => entries.push({ relationship: 'Dependant', ...dependant }));
  }
  return entries;
};

const normaliseEmployment = (employment) => {
  if (!employment) return [];

  if (Array.isArray(employment)) {
    return employment;
  }
  if (Array.isArray(employment.roles)) {
    return employment.roles;
  }
  if (Array.isArray(employment.members)) {
    return employment.members;
  }

  if (typeof employment === 'string') {
    return [{ summary: employment }];
  }

  return Object.entries(employment)
    .map(([key, value]) => {
      if (!value) return null;
      if (typeof value === 'string') {
        return { label: formatLabel(key), summary: value };
      }
      return { label: formatLabel(key), ...value };
    })
    .filter(Boolean);
};

const normaliseHealthIndicators = (health) => {
  if (!health) return [];

  if (Array.isArray(health)) {
    return health;
  }

  if (typeof health === 'string') {
    return [health];
  }

  return Object.entries(health)
    .map(([key, value]) => ({ label: formatLabel(key), value }))
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
};

const ProfileSummary = ({ data }) => {
  if (!data) {
    return (
      <ReportSection title="Profile Summary">
        <p className="text-sm text-gray-500">We&apos;re gathering your household details. Check back in a moment.</p>
      </ReportSection>
    );
  }

  const {
    userCode,
    household,
    householdMakeup,
    location,
    headline,
    dependants,
    healthIndicators,
  } = data;

  const members = normaliseMembers(data);
  const employmentEntries = normaliseEmployment(data.employment);
  const healthEntries = normaliseHealthIndicators(healthIndicators || data.health);

  const householdFacts = [
    {
      label: 'Household Makeup',
      value: householdMakeup || household?.description || household?.composition || household,
    },
    {
      label: 'Location',
      value: location || household?.location,
    },
    {
      label: 'Dependants',
      value: Array.isArray(dependants) ? dependants.length : dependants,
    },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value !== '');

  return (
    <ReportSection
      title="Profile Summary"
      action={userCode ? <span className="font-mono text-xs uppercase tracking-wide">Ref: {userCode}</span> : null}
    >
      {headline ? <p className="text-sm text-gray-600">{headline}</p> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Household Members</h3>
            {members.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {members.map((member, index) => (
                  <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-base font-semibold text-gray-900">
                      {member.name || member.fullName || member.label || `Member ${index + 1}`}
                    </p>
                    <dl className="mt-2 space-y-1 text-sm">
                      {member.relationship ? (
                        <div className="flex justify-between text-gray-600">
                          <dt>Relationship</dt>
                          <dd className="font-medium text-gray-900">{member.relationship}</dd>
                        </div>
                      ) : null}
                      {member.age ? (
                        <div className="flex justify-between text-gray-600">
                          <dt>Age</dt>
                          <dd className="font-medium text-gray-900">{member.age}</dd>
                        </div>
                      ) : null}
                      {member.lifeStage ? (
                        <div className="flex justify-between text-gray-600">
                          <dt>Life stage</dt>
                          <dd className="font-medium text-gray-900">{member.lifeStage}</dd>
                        </div>
                      ) : null}
                      {member.notes ? (
                        <p className="text-xs text-gray-500">{member.notes}</p>
                      ) : null}
                    </dl>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No household members recorded yet.</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700">Employment</h3>
            {employmentEntries.length > 0 ? (
              <div className="mt-3 space-y-3">
                {employmentEntries.map((entry, index) => (
                  <div key={index} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-gray-900">
                      {entry.label || entry.name || `Role ${index + 1}`}
                    </p>
                    <dl className="mt-2 space-y-1 text-sm text-gray-600">
                      {entry.summary ? <dd className="text-gray-600">{entry.summary}</dd> : null}
                      {entry.status ? (
                        <div className="flex justify-between">
                          <dt>Status</dt>
                          <dd className="font-medium text-gray-900">{entry.status}</dd>
                        </div>
                      ) : null}
                      {entry.employer ? (
                        <div className="flex justify-between">
                          <dt>Employer</dt>
                          <dd className="font-medium text-gray-900">{entry.employer}</dd>
                        </div>
                      ) : null}
                      {entry.income ? (
                        <div className="flex justify-between">
                          <dt>Income</dt>
                          <dd className="font-medium text-gray-900">{entry.income}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">Employment information will appear once provided.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Household At-a-glance</h3>
            {householdFacts.length > 0 ? (
              <dl className="mt-3 space-y-3 text-sm">
                {householdFacts.map((fact, index) => (
                  <div key={index} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <dt className="text-gray-500">{fact.label}</dt>
                    <dd className="font-medium text-gray-900">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-2 text-sm text-gray-500">We&apos;ll highlight key household facts here.</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700">Health Indicators</h3>
            {healthEntries.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {healthEntries.map((item, index) => (
                  <li key={index} className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-emerald-900">
                    {item.label ? (
                      <div className="flex justify-between">
                        <span className="font-medium">{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ) : (
                      <span>{item.value || item}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">Let us know about any health considerations.</p>
            )}
          </div>
        </div>
      </div>
    </ReportSection>
  );
};

export default ProfileSummary;
