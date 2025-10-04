import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Calendar, User, Clock, TrendingDown, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSeo } from '@/components/seo/SeoContext';

const createUnsplashUrl = (baseUrl, params, width) => `${baseUrl}?${params}&w=${width}`;

const createUnsplashSrcSet = (baseUrl, params, widths) =>
  widths.map((width) => `${createUnsplashUrl(baseUrl, params, width)} ${width}w`).join(', ');

export default function BlogDebtRepaymentStrategies() {
  const post = useMemo(
    () => ({
      title: 'Debt Snowball vs. Debt Avalanche: Which UK Debt Repayment Strategy is Right for You?',
      category: 'Debt Management',
      readTime: '6 min read',
      author: 'CalcMyMoney Team',
      displayDate: 'October 24, 2023',
      publishedTime: '2023-10-24T08:00:00+00:00',
      modifiedTime: '2023-10-24T08:00:00+00:00',
      imageUrl:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      imageAlt: 'Person organizing financial documents and calculating debt payments',
      tags: ['Debt Repayment', 'Personal Finance', 'UK Debt Advice', 'Budgeting'],
    }),
    []
  );
  const heroImage = useMemo(
    () => ({
      baseUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      params:
        'q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 1280,
      height: 853,
      srcSetWidths: [480, 768, 1024, 1280],
      sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 896px',
    }),
    []
  );
  const avalancheImage = useMemo(
    () => ({
      baseUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71',
      params:
        'q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px',
      alt: 'Calculator and financial documents showing debt reduction strategy planning',
    }),
    []
  );
  const successImage = useMemo(
    () => ({
      baseUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      params:
        'q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px',
      alt: 'Person celebrating financial success with calculator and paperwork',
    }),
    []
  );
  const { setSeo, resetSeo, defaults } = useSeo();

  const articleJsonLd = useMemo(() => {
    const baseDescription =
      defaults?.description ||
      'Compare the debt snowball and debt avalanche methods to find the best UK debt repayment strategy for your situation.';

    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: baseDescription,
      image: [post.imageUrl],
      author: {
        '@type': 'Organization',
        name: post.author,
      },
      datePublished: post.publishedTime,
      dateModified: post.modifiedTime,
      articleSection: post.category,
      keywords: post.tags.join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id':
          defaults?.canonical ||
          defaults?.ogUrl ||
          'https://www.calcmymoney.co.uk/blog-debt-repayment-strategies',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Calculate My Money',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.calcmymoney.co.uk/images/logo-high-res.png',
        },
      },
    };
  }, [defaults?.canonical, defaults?.description, defaults?.ogUrl, post]);

  useEffect(() => {
    const baseJsonLd = Array.isArray(defaults?.jsonLd) ? defaults.jsonLd : [];
    const combinedJsonLd = articleJsonLd ? [...baseJsonLd, articleJsonLd] : baseJsonLd;

    setSeo({
      ogType: 'article',
      ogImage: post.imageUrl,
      ogImageAlt: post.imageAlt,
      twitterImage: post.imageUrl,
      twitterImageAlt: post.imageAlt,
      articlePublishedTime: post.publishedTime,
      articleModifiedTime: post.modifiedTime,
      articleSection: post.category,
      articleAuthor: post.author,
      articleTags: post.tags,
      jsonLd: combinedJsonLd,
    });

    return () => {
      resetSeo();
    };
  }, [articleJsonLd, defaults?.jsonLd, post, resetSeo, setSeo]);

  return (
    <div className="bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={createPageUrl('Blog')}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all articles
        </Link>

        <article>
          <header className="mb-8">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-red-900/50 dark:text-red-300">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedTime}>{post.displayDate}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          <img
            src={createUnsplashUrl(heroImage.baseUrl, heroImage.params, heroImage.width)}
            srcSet={createUnsplashSrcSet(heroImage.baseUrl, heroImage.params, heroImage.srcSetWidths)}
            sizes={heroImage.sizes}
            alt={post.imageAlt}
            width={heroImage.width}
            height={heroImage.height}
            loading="eager"
            decoding="async"
            className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8"
          />

          <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-gray-700 dark:text-gray-300">
            <p className="lead text-xl">
              When you're drowning in debt, every pound counts, and every strategy matters. Two
              approaches have emerged as the most popular methods for UK residents tackling multiple
              debts: the debt snowball and the debt avalanche. But which one is right for you?
            </p>

            <Separator className="my-8" />

            <h2>Understanding the Debt Avalanche Method</h2>
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-6 h-6 text-red-600" />
              <p className="text-lg font-semibold text-red-800 dark:text-red-300 mb-0">
                Mathematically Optimal
              </p>
            </div>

            <p>
              The debt avalanche method focuses on paying off debts with the highest interest rates
              first, while making minimum payments on all other debts. This approach minimizes the
              total amount of interest you'll pay over the life of your debts.
            </p>

            <div className="my-6 p-6 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">
                How Debt Avalanche Works:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-red-700 dark:text-red-300">
                <li>List all your debts with their interest rates</li>
                <li>Arrange them from highest to lowest APR</li>
                <li>Pay minimums on all debts</li>
                <li>Put any extra money toward the highest interest debt</li>
                <li>Once paid off, move to the next highest rate</li>
              </ol>
            </div>

            <div className="my-8">
              <img
                src={createUnsplashUrl(
                  avalancheImage.baseUrl,
                  avalancheImage.params,
                  avalancheImage.width
                )}
                srcSet={createUnsplashSrcSet(
                  avalancheImage.baseUrl,
                  avalancheImage.params,
                  avalancheImage.srcSetWidths
                )}
                sizes={avalancheImage.sizes}
                alt={avalancheImage.alt}
                width={avalancheImage.width}
                height={avalancheImage.height}
                loading="lazy"
                decoding="async"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                The debt avalanche method focuses on mathematical optimization to save money
              </p>
            </div>

            <h2>Understanding the Debt Snowball Method</h2>
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-blue-600" />
              <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-0">
                Psychologically Motivating
              </p>
            </div>

            <p>
              The debt snowball method focuses on paying off the smallest balances first, regardless
              of interest rate. This approach prioritizes quick wins and psychological momentum over
              mathematical optimization.
            </p>

            <div className="my-6 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                How Debt Snowball Works:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-700 dark:text-blue-300">
                <li>List all your debts from smallest to largest balance</li>
                <li>Pay minimums on all debts</li>
                <li>Put any extra money toward the smallest balance</li>
                <li>Once paid off, add that payment to the next smallest debt</li>
                <li>Watch your momentum build with each victory</li>
              </ol>
            </div>

            <h2>Real UK Example: Sarah's Debt Journey</h2>
            <p>Let's look at Sarah, a teacher from Birmingham, with typical UK debts:</p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">Sarah's Debts:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Credit Card 1: £2,500 @ 22.9% APR</li>
                    <li>Credit Card 2: £1,200 @ 18.9% APR</li>
                    <li>Store Card: £800 @ 28.9% APR</li>
                    <li>Personal Loan: £4,500 @ 9.9% APR</li>
                    <li>Car Finance: £6,200 @ 7.5% APR</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <p>
                      <strong>Total Debt: £15,200</strong>
                    </p>
                    <p>Extra monthly payment: £300</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 text-green-800 dark:text-green-200">
                    Results Comparison:
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium text-red-700 dark:text-red-300">
                        Debt Avalanche:
                      </h5>
                      <p>Time to debt-free: 3.2 years</p>
                      <p>Total interest: £2,847</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-700 dark:text-blue-300">
                        Debt Snowball:
                      </h5>
                      <p>Time to debt-free: 3.4 years</p>
                      <p>Total interest: £3,156</p>
                    </div>
                    <div className="pt-2 border-t border-green-300 dark:border-green-600">
                      <p className="font-medium">Avalanche saves: £309</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2>Which Method Should You Choose?</h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <Card className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">
                    Choose Debt Avalanche If:
                  </h4>
                  <ul className="space-y-2 text-red-700 dark:text-red-300">
                    <li>• You're motivated by saving money</li>
                    <li>• You can stick to a plan without quick wins</li>
                    <li>• You have high-interest debts (credit cards, store cards)</li>
                    <li>• You're analytical and numbers-driven</li>
                    <li>• You want to minimize total interest paid</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                    Choose Debt Snowball If:
                  </h4>
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                    <li>• You need motivation from quick wins</li>
                    <li>• You've struggled with debt plans before</li>
                    <li>• Your interest rates are fairly similar</li>
                    <li>• You're emotionally driven</li>
                    <li>• You want to simplify your financial life faster</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2>UK-Specific Considerations</h2>
            <p>When choosing your debt repayment strategy in the UK, keep these factors in mind:</p>
            <ul>
              <li>
                <strong>Student Loans:</strong> Generally keep these last due to low interest rates
                and income-dependent repayments
              </li>
              <li>
                <strong>Council Tax Debt:</strong> Always prioritize this - bailiffs can be used for
                enforcement
              </li>
              <li>
                <strong>Mortgage vs Credit Cards:</strong> Focus on high-interest credit cards
                before overpaying your mortgage
              </li>
              <li>
                <strong>0% Balance Transfer Cards:</strong> Can be powerful tools when used with
                either strategy
              </li>
            </ul>

            <div className="my-8">
              <img
                src={createUnsplashUrl(
                  successImage.baseUrl,
                  successImage.params,
                  successImage.width
                )}
                srcSet={createUnsplashSrcSet(
                  successImage.baseUrl,
                  successImage.params,
                  successImage.srcSetWidths
                )}
                sizes={successImage.sizes}
                alt={successImage.alt}
                width={successImage.width}
                height={successImage.height}
                loading="lazy"
                decoding="async"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                Both strategies can lead to debt freedom - choose the one that fits your personality
              </p>
            </div>

            <Separator className="my-8" />

            <h2>The Bottom Line</h2>
            <p>
              The "perfect" debt repayment strategy is the one you'll actually stick to. While the
              debt avalanche saves more money mathematically, the debt snowball's psychological
              benefits can be game-changing for many people.
            </p>

            <p>
              Remember: the difference in interest paid is often less significant than the
              difference between having a plan and not having one at all.
            </p>

            <Card className="my-8 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  🧮 Ready to Run Your Numbers?
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Use our{' '}
                  <Link to={createPageUrl('DebtCalculator')} className="underline font-medium">
                    Debt Repayment Calculator
                  </Link>{' '}
                  to compare both strategies with your actual debts and see which approach works
                  best for your situation.
                </p>
              </CardContent>
            </Card>
          </div>
        </article>
      </div>
    </div>
  );
}
