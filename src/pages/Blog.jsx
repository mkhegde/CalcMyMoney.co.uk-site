import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const blogPosts = [
  {
    title: 'Smart Money-Saving Tips for UK Families: Tackling Groceries & Energy Bills',
    excerpt:
      'A guide to cutting costs on two of the biggest drains on family finances – groceries and energy bills.',
    date: 'October 26, 2023',
    author: 'CalcMyMoney Team',
    category: 'Money Saving',
    readTime: '7 min read',
    url: createPageUrl('BlogSmartMoneySavingTips'),
    image: {
      baseUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      params:
        'q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    },
  },
  {
    title: 'Debt Snowball vs. Debt Avalanche: Which UK Debt Repayment Strategy is Right for You?',
    excerpt:
      'The two most popular debt repayment strategies explained, helping you choose the right path to a debt-free life in the UK.',
    date: 'October 24, 2023',
    author: 'CalcMyMoney Team',
    category: 'Debt Management',
    readTime: '6 min read',
    url: createPageUrl('BlogDebtRepaymentStrategies'),
    image: {
      baseUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      params:
        'q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    },
  },
  {
    title: 'My Relationship with Money: A Guide to Financial Psychology',
    excerpt:
      "Understand the 'why' behind your financial decisions. Explore your money mindset and learn how to build a healthier, more prosperous future.",
    date: 'October 22, 2023',
    author: 'CalcMyMoney Team',
    category: 'Mindset',
    readTime: '8 min read',
    url: createPageUrl('BlogFinancialPsychology'),
    image: {
      baseUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e',
      params:
        'q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    },
  },
];

const categoryColors = {
  'Money Saving': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Debt Management': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Mindset: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'Tax Updates': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  Budgeting: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

export default function Blog() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Financial Insights & Updates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay informed with the latest UK financial news, tax updates, and money management
            strategies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Link
              to={post.url}
              key={index}
              className={`group ${post.url === '#' ? 'pointer-events-none' : ''}`}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
                <img
                  src={`${post.image.baseUrl}?${post.image.params}&w=${post.image.width}`}
                  srcSet={post.image.srcSetWidths
                    .map((width) => `${post.image.baseUrl}?${post.image.params}&w=${width} ${width}w`)
                    .join(', ')}
                  sizes={post.image.sizes}
                  alt={post.title}
                  width={post.image.width}
                  height={post.image.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
