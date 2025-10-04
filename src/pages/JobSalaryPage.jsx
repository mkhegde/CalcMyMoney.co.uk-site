// --- ALL IMPORTS MUST BE AT THE TOP ---
import React, { useEffect, useMemo } from 'react';
import { Navigate, useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useSeo } from '@/components/seo/SeoContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { jobTitles, createSlug } from '../components/data/seo-data';

import Heading from '@/components/common/Heading';
export default function JobSalaryPage() {
  const { slug } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { setSeo, resetSeo } = useSeo();

  const selectedRole = useMemo(
    () => jobTitles.find((job) => createSlug(job.title) === slug),
    [slug]
  );

  // --- Legacy support: /jobsalarypage?slug=teacher -> /job-salaries/teacher
  useEffect(() => {
    if (!slug) {
      const params = new URLSearchParams(search);
      const legacy = params.get('slug');
      if (legacy) {
        navigate(`/job-salaries/${legacy}`, { replace: true });
      }
    }
  }, [slug, search, navigate]);

  useEffect(() => {
    if (slug && !selectedRole) {
      resetSeo();
    }
  }, [slug, selectedRole, resetSeo]);

  // If we just redirected (no slug yet), render nothing
  if (!slug) {
    return null;
  }

  if (slug && !selectedRole) {
    return <Navigate to="/job-salaries" replace />;
  }

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.calcmymoney.co.uk';
  const roleTitle = selectedRole.title;
  const salaryFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    []
  );
  const formatCurrency = (value) => salaryFormatter.format(Math.round(value));
  const averageSalary = selectedRole.averageSalary;
  const monthlySalary = averageSalary ? averageSalary / 12 : null;
  const weeklySalary = averageSalary ? averageSalary / 52 : null;
  const dailySalary = averageSalary ? averageSalary / 260 : null;
  const pageTitle = `${roleTitle} Salary (UK) | Job Pay Explorer`;
  const pageDesc = selectedRole.description
    ? `${selectedRole.description} Typical average salary: ${
        averageSalary ? `${formatCurrency(averageSalary)} per year` : 'Explore pay insights'
      } in the UK.`
    : `Typical UK salary data for ${roleTitle}: pay ranges, percentiles, and related roles.`;
  const canonical = `${origin}/job-salaries/${slug}`;

  const relatedRoles = useMemo(() => {
    if (!selectedRole?.category) return [];
    return jobTitles
      .filter(
        (job) => job.category === selectedRole.category && job.title !== selectedRole.title
      )
      .slice(0, 3);
  }, [selectedRole]);

  const statCards = [
    averageSalary
      ? {
          label: 'Average salary',
          value: `${formatCurrency(averageSalary)}/yr`,
          helper: 'Based on UK market data for this role.',
        }
      : null,
    monthlySalary
      ? {
          label: 'Estimated monthly pay',
          value: `${formatCurrency(monthlySalary)}/mo`,
          helper: 'Approximate gross monthly earnings.',
        }
      : null,
    weeklySalary
      ? {
          label: 'Estimated weekly pay',
          value: `${formatCurrency(weeklySalary)}/wk`,
          helper: 'Average annual salary divided over 52 weeks.',
        }
      : null,
    dailySalary
      ? {
          label: 'Estimated daily rate',
          value: `${formatCurrency(dailySalary)}/day`,
          helper: 'Assuming ~260 working days per year.',
        }
      : null,
  ].filter(Boolean);

  useEffect(() => {
    const seoPayload = {
      title: pageTitle,
      description: pageDesc,
      canonical,
      robots: 'index,follow,max-image-preview:large',
      ogTitle: pageTitle,
      ogDescription: pageDesc,
      ogUrl: canonical,
      twitterTitle: pageTitle,
      twitterDescription: pageDesc,
    };

    setSeo(seoPayload);

    return () => {
      resetSeo();
    };
  }, [canonical, pageDesc, pageTitle, resetSeo, setSeo]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-4">
          <Link className="text-blue-600 hover:text-blue-700 font-medium" to="/job-salaries">
            ← Back to job salary explorer
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-3">
              {selectedRole.category && (
                <Badge variant="secondary" className="uppercase tracking-wide">
                  {selectedRole.category}
                </Badge>
              )}
              <span className="text-sm text-gray-500">
                Updated for the latest UK market data
              </span>
            </div>
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-3">
              {roleTitle} salary (UK)
            </Heading>
            {selectedRole.description && (
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
                {selectedRole.description}
              </p>
            )}
          </div>
        </div>

        {statCards.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {statCards.map((stat) => (
              <Card key={stat.label} className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-base text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{stat.helper}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {relatedRoles.length > 0 && (
          <div className="space-y-3">
            <Heading as="h2" size="h2" className="text-gray-900 dark:text-gray-100">
              Related roles in {selectedRole.category}
            </Heading>
            <div className="flex flex-wrap gap-2">
              {relatedRoles.map((role) => (
                <Link
                  key={role.title}
                  to={`/job-salaries/${createSlug(role.title)}`}
                  className="px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100"
                >
                  {role.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Looking for another role? Explore the full list of UK salaries in our{' '}
            <Link className="text-blue-600 hover:text-blue-700" to="/job-salaries">
              Job Salary Explorer
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
