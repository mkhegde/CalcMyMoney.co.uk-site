import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { jobTitles, createSlug } from '../components/data/seo-data';
import { Briefcase, Search, PoundSterling } from 'lucide-react';

export default function JobSalaries() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [...new Set(jobTitles.map((job) => job.category))];

  const filteredJobs = jobTitles.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              UK Job Salary Explorer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover average salaries for hundreds of jobs across the UK. Find out what you could
              be earning.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </div>

        {searchTerm ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Link
                  to={`/job-salaries/${createSlug(job.title)}`}
                  key={job.title}
                  className="group"
                >
                  <Card className="hover:shadow-lg hover:border-blue-300 transition-all">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <span>{job.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{job.category}</Badge>
                        <span className="font-semibold text-lg">
                          ~£{job.averageSalary.toLocaleString()}/yr
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-center md:col-span-3 text-gray-500">
                No job titles found for "{searchTerm}".
              </p>
            )}
          </div>
        ) : (
          categories.map((category) => (
            <div key={category} className="mb-10">
              <h2 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 mb-4">
                {category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {jobTitles
                  .filter((job) => job.category === category)
                  .map((job) => (
                    <Link
                      to={`/job-salaries/${createSlug(job.title)}`}
                      key={job.title}
                      className="group"
                    >
                      <div className="p-4 bg-gray-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <p className="font-semibold text-gray-800 group-hover:text-blue-700">
                          {job.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          ~£{job.averageSalary.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
