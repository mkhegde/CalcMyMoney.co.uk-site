import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/common/Heading';
import { jobTitles, createSlug } from '../components/data/seo-data';
import { Briefcase, Search } from 'lucide-react';

export default function JobSalaries() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [...new Set(jobTitles.map((job) => job.category))];

  const filteredJobs = jobTitles.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background text-foreground">
      <div className="bg-hero bg-hero-pattern text-hero-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Heading as="h1" size="h1" weight="bold" className="mb-4">
            UK Job Salary Explorer
          </Heading>
          <p className="lead text-hero-foreground/80 max-w-3xl mx-auto">
            Discover average salaries for hundreds of jobs across the UK. Find out what you could be
            earning.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  <Card className="hover:shadow-lg hover:border-primary/60 transition-all">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <span>{job.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
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
              <p className="text-center md:col-span-3 text-muted-foreground">
                No job titles found for "{searchTerm}".
              </p>
            )}
          </div>
        ) : (
          categories.map((category) => (
            <div key={category} className="mb-10">
              <Heading as="h2" size="h2" weight="bold" className="mb-4 border-b-2 border-primary pb-2">
                {category}
              </Heading>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {jobTitles
                  .filter((job) => job.category === category)
                  .map((job) => (
                    <Link
                      to={`/job-salaries/${createSlug(job.title)}`}
                      key={job.title}
                      className="group"
                    >
                      <div className="p-4 rounded-lg border border-card-muted bg-card transition-colors hover:border-primary/40">
                        <p className="font-semibold text-card-foreground group-hover:text-primary">
                          {job.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
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
