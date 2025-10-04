import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, Book, Landmark, Banknote } from 'lucide-react';

import Heading from '@/components/common/Heading';
const governmentResources = [
  {
    title: 'HMRC',
    description:
      'The official source for all UK tax and National Insurance information, rates, and personal tax accounts.',
    url: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
    icon: Landmark,
  },
  {
    title: 'MoneyHelper',
    description: 'Free, impartial help with money and pensions, backed by the UK government.',
    url: 'https://www.moneyhelper.org.uk/en', // Fixed URL
    icon: Banknote,
  },
  {
    title: 'Citizens Advice',
    description: 'Offers confidential advice online, over the phone, and in person, for free.',
    url: 'https://www.citizensadvice.org.uk/',
    icon: Landmark,
  },
];

const bookReviews = [
  {
    title: 'The Psychology of Money by Morgan Housel',
    description:
      "A brilliant book that explores the strange ways people think about money and teaches you how to make better sense of one of life's most important topics. A must-read for understanding financial behaviour.",
    url: 'https://www.amazon.co.uk/Psychology-Money-Morgan-Housel/dp/0857197681',
    icon: Book,
  },
  {
    title: 'I Will Teach You To Be Rich by Ramit Sethi',
    description:
      'A practical, no-nonsense 6-week programme for mastering your money. Focuses on automation, conscious spending, and investing for the long term. Highly actionable advice.',
    url: 'https://www.amazon.co.uk/Will-Teach-You-Be-Rich/dp/1523505745',
    icon: Book,
  },
  {
    title: 'Smarter Investing by Tim Hale',
    description:
      'Considered one of the best books on passive investing for a UK audience. Hale breaks down complex topics into simple, evidence-based principles for building a successful portfolio.',
    url: 'https://www.amazon.co.uk/Smarter-Investing-Simpler-Decisions-Financial/dp/0273785370',
    icon: Book,
  },
];

export default function Resources() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Book className="w-12 h-12 mx-auto text-blue-600" />
          <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mt-4">Financial Resources</Heading>
          <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
            Knowledge is power. Here are some trusted resources and recommended reading to help you
            on your financial journey.
          </p>
        </div>

        <div className="space-y-12">
          {/* Government & Charity Resources */}
          <div>
            <Heading as="h2" size="h2" weight="bold" className="text-gray-800 mb-6">Official Guidance & Charities</Heading>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {governmentResources.map((resource) => (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={resource.title}
                  className="block group"
                >
                  <Card className="h-full transition-all duration-300 border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <resource.icon className="w-8 h-8 text-gray-500" />
                      <CardTitle>{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{resource.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* Book Reviews */}
          <div>
            <Heading as="h2" size="h2" weight="bold" className="text-gray-800 mb-6">Recommended Reading</Heading>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookReviews.map((book) => (
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={book.title}
                  className="block group"
                >
                  <Card className="h-full transition-all duration-300 border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <book.icon className="w-8 h-8 text-gray-500" />
                      <CardTitle>{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{book.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
