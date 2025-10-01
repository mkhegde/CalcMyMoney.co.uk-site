import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export default function JobSalaryPage() {
  const { slug } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      const p = new URLSearchParams(search);
      const s = p.get('slug');
      if (s) navigate(`/job-salaries/${s}`, { replace: true });
    }
  }, [slug, search, navigate]);

import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { jobTitles, createSlug } from '../components/data/seo-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PoundSterling, Briefcase, MapPin, ArrowLeft } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

const jobSalaryFAQs = [
  {
    question: 'Where does this salary data come from?',
    answer:
      'The salary figures on this page are estimates based on an aggregation of publicly available data, including national statistics, industry reports, and salary data from job boards. They are intended to be used as a guideline and may not reflect the exact salary for any specific role.',
  },
  {
    question: "Is this the 'take-home' pay?",
    answer:
      'No, the figures shown are for gross annual salary (before tax, National Insurance, pension, or other deductions). To find out what your take-home pay would be, you can use our UK Salary Calculator.',
  },
  {
    question: 'Why do salaries for the same job title vary?',
    answer:
      "Salaries can vary significantly based on a number of factors, including geographic location (e.g., London vs. other regions), the employee's years of experience, the size and type of the company, and the specific skills or specializations required for the role.",
  },
];

export default function JobSalaryPage() {
  const location = useLocation();
  const job = useMemo(() => {
    const urlParams = new URLSearchParams(location.search);
    const slug = urlParams.get('slug');
    return jobTitles.find((j) => createSlug(j.title) === slug);
  }, [location.search]);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <p className="text-gray-600">
          The job salary information you're looking for could not be found.
        </p>
        <Link
          to={createPageUrl('JobSalaries')}
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          &larr; Back to Job Salaries
        </Link>
      </div>
    );
  }

  const relatedJobs = jobTitles
    .filter((j) => j.category === job.category && j.title !== job.title)
    .slice(0, 5);

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link
            to={createPageUrl('JobSalaries')}
            className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Job Salaries
          </Link>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <Badge variant="secondary" className="w-fit mb-2">
              {job.category}
            </Badge>
            <CardTitle className="text-3xl font-extrabold text-gray-900">
              {job.title} Salary in the UK
            </CardTitle>
            <p className="text-lg text-gray-600">{job.description}</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center bg-blue-50 p-6 rounded-lg">
              <p className="text-lg text-blue-800">Average Annual Salary</p>
              <p className="text-5xl font-bold text-blue-900 flex items-center justify-center">
                <PoundSterling className="w-10 h-10 mr-2" />
                {job.averageSalary.toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Salary Overview</h3>
              <p className="text-gray-700">
                The average salary for a {job.title} in the United Kingdom is estimated to be around
                **£{job.averageSalary.toLocaleString()} per year**. This figure can vary based on
                factors such as experience, location, company size, and specific skill set. For
                entry-level positions, the salary might start lower, while experienced professionals
                in high-demand areas like London can command significantly higher wages.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800">Key Factors Influencing Salary:</h4>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                  <li>Experience Level (Junior, Mid, Senior)</li>
                  <li>Geographic Location (e.g., London vs. North England)</li>
                  <li>Company Size and Industry</li>
                  <li>Specialized Skills and Certifications</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800">Career Path:</h4>
                <p className="text-gray-600 mt-2">
                  A career as a {job.title} often involves continuous learning and specialization.
                  Advancing in this role could lead to positions like Senior {job.title}, Lead{' '}
                  {job.title}, or management roles within the {job.category} field.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Related Job Salaries</h3>
              <div className="space-y-2">
                {relatedJobs.map((relatedJob) => (
                  <Link
                    to={createPageUrl(`JobSalaryPage?slug=${createSlug(relatedJob.title)}`)}
                    key={relatedJob.title}
                    className="block p-3 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-700">{relatedJob.title}</span>
                      <span className="font-semibold text-gray-800">
                        ~£{relatedJob.averageSalary.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Find Your Take-Home Pay</h3>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <p className="text-green-800 mb-4">
                    Wondering what £{job.averageSalary.toLocaleString()} looks like after tax? Use
                    our comprehensive UK Salary Calculator to find out your take-home pay, including
                    deductions for National Insurance and student loans.
                  </p>
                  <Link to={createPageUrl(`SalaryCalculator?salary=${job.averageSalary}`)}>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Calculate Take-Home Pay
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="pt-8 border-t">
              <FAQSection faqs={jobSalaryFAQs} title="About This Salary Data" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
