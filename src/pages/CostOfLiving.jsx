import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ukCities, createSlug } from '../components/data/seo-data';
import { MapPin, Users, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
export default function CostOfLiving() {
  const regions = [...new Set(ukCities.map((city) => city.region))];
  const costOfLivingBase = createPageUrl('CostOfLiving');

  return (
    <div className="bg-white dark:bg-gray-900">
      <Helmet>
        <title>UK Cost of Living Calculator - Estimate Your Monthly Expenses</title>
        <meta
          name="description"
          content="Calculate the average monthly cost of living in various UK cities including rent, utilities, and transport. Get a complete breakdown of typical household expenditures."
        />
        <link rel="canonical" href="https://calcmymoney.co.uk/CostOfLiving" />
      </Helmet>

      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              UK Cost of Living Explorer
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Compare rental costs, population, and other key stats for major cities across the
              United Kingdom.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {regions.map((region) => (
          <div key={region} className="mb-10">
            <Heading as="h2" size="h2" weight="bold" className="border-b-2 border-green-500 pb-2 mb-4">{region}</Heading>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ukCities
                .filter((city) => city.region === region)
                .map((city) => (
                  <Link
                    to={`${costOfLivingBase}/${createSlug(city.name)}`}
                    key={city.name}
                    className="group"
                  >
                    <Card className="hover:shadow-lg hover:border-green-300 transition-all">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <span>{city.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Users className="w-4 h-4" /> Population:
                          </span>
                          <span className="font-medium">{city.population}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> Rent Index:
                          </span>
                          <span className="font-medium">{city.rentIndex}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
