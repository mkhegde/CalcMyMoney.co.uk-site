// --- ALL IMPORTS MUST BE AT THE TOP ---
import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useSeo } from '@/components/seo/SeoContext';

// Small helper to make a nice title from the slug
const toTitle = (s) =>
  String(s || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function JobSalaryPage() {
  const { slug } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { setSeo, resetSeo } = useSeo();

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

  // If we just redirected (no slug yet), render nothing
  if (!slug) return null;

  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://www.calcmymoney.co.uk';
  const roleTitle = toTitle(slug);
  const pageTitle = `${roleTitle} Salary (UK) | Job Pay Explorer`;
  const pageDesc = `Typical UK salary data for ${roleTitle}: pay ranges, percentiles, and related roles.`;
  const canonical = `${origin}/job-salaries/${slug}`;

  useEffect(() => {
    if (!slug) return;

    setSeo({
      title: pageTitle,
      description: pageDesc,
      canonical,
      ogTitle: pageTitle,
      ogDescription: pageDesc,
      ogUrl: canonical,
      twitterTitle: pageTitle,
      twitterDescription: pageDesc,
    });

    return () => {
      resetSeo();
    };
  }, [slug, pageTitle, pageDesc, canonical, setSeo, resetSeo]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{roleTitle} salary (UK)</h1>
      <p className="text-sm text-gray-500 mb-6">
        Clean path detected. Legacy query URLs are redirected to this canonical route.
      </p>

      {/* TODO: Replace with your real salary content for this role */}
      <div className="rounded-lg border p-4 bg-white">
        <p className="text-gray-700">
          Build your salary lookup here for <strong>{roleTitle}</strong>.
        </p>
      </div>

      <div className="mt-6">
        <Link className="text-blue-600 underline" to="/">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
