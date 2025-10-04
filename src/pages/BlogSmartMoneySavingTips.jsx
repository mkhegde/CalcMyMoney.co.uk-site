import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSeo } from '@/components/seo/SeoContext';

const createUnsplashUrl = (baseUrl, params, width) => `${baseUrl}?${params}&w=${width}`;

const createUnsplashSrcSet = (baseUrl, params, widths) =>
  widths.map((width) => `${createUnsplashUrl(baseUrl, params, width)} ${width}w`).join(', ');

export default function BlogSmartMoneySavingTips() {
  const post = useMemo(
    () => ({
      title: 'Smart Money-Saving Tips for UK Families: Tackling Groceries & Energy Bills',
      category: 'Money Saving',
      readTime: '7 min read',
      author: 'CalcMyMoney Team',
      displayDate: 'October 26, 2023',
      publishedTime: '2023-10-26T08:00:00+00:00',
      modifiedTime: '2023-10-26T08:00:00+00:00',
      imageUrl:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      imageAlt: 'A family happily unpacking groceries in a bright, modern kitchen.',
      tags: ['Money Saving', 'Family Budgeting', 'Energy Bills', 'UK Finance'],
    }),
    []
  );
  const heroImage = useMemo(
    () => ({
      baseUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      params:
        'q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 1280,
      height: 853,
      srcSetWidths: [480, 768, 1024, 1280],
      sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 896px',
    }),
    []
  );
  const groceriesImage = useMemo(
    () => ({
      baseUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      params:
        'q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px',
      alt: 'Fresh vegetables and groceries laid out for meal planning',
    }),
    []
  );
  const thermostatImage = useMemo(
    () => ({
      baseUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      params:
        'q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 1200,
      height: 800,
      srcSetWidths: [480, 768, 1024, 1200],
      sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 640px',
      alt: 'Modern smart thermostat on wall showing energy savings',
    }),
    []
  );
  const { setSeo, resetSeo, defaults } = useSeo();

  const articleJsonLd = useMemo(() => {
    const baseDescription =
      defaults?.description ||
      'Discover practical tips for UK families to save money on groceries, energy bills, and everyday expenses.';

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
        '@id': defaults?.canonical || defaults?.ogUrl || 'https://www.calcmymoney.co.uk/blog-smart-money-saving-tips',
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
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-blue-900/50 dark:text-blue-300">
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
              The cost of living in the UK continues to be a hot topic, with rising prices hitting
              household budgets hard. This guide focuses on two of the biggest drains on family
              finances – groceries and energy bills – offering actionable tips specifically for UK
              households.
            </p>

            <Separator className="my-8" />

            <h2>Winning the Grocery Game: Strategies for the Supermarket</h2>
            <p>
              Groceries are often one of the largest flexible expenses for families. Small changes
              here can lead to significant savings.
            </p>
            <ul>
              <li>
                <strong>Meal Planning is Your Superpower:</strong> Before you even step foot in the
                supermarket, plan out every meal for the week. This prevents impulse buys and
                reduces food waste.
              </li>
              <li>
                <strong>Shop Your Pantry First:</strong> Before making your shopping list, "shop"
                your own fridge, freezer, and cupboards. You might be surprised what you already
                have.
              </li>
              <li>
                <strong>Embrace 'Wonky' Veg & Own Brands:</strong> Supermarkets often sell
                "imperfect" vegetables at a discount. They taste exactly the same! Similarly, don't
                shy away from own-brand products.
              </li>
              <li>
                <strong>Batch Cooking for Busy Weeks:</strong> Dedicate a few hours on a weekend to
                cook larger portions of staples like pasta sauce or chili. Freeze individual
                portions for quick, cheap, and healthy meals on busy weeknights.
              </li>
            </ul>

            <div className="my-8">
              <img
                src={createUnsplashUrl(
                  groceriesImage.baseUrl,
                  groceriesImage.params,
                  groceriesImage.width
                )}
                srcSet={createUnsplashSrcSet(
                  groceriesImage.baseUrl,
                  groceriesImage.params,
                  groceriesImage.srcSetWidths
                )}
                sizes={groceriesImage.sizes}
                alt={groceriesImage.alt}
                width={groceriesImage.width}
                height={groceriesImage.height}
                loading="lazy"
                decoding="async"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                Meal planning and smart shopping can dramatically reduce your grocery spend
              </p>
            </div>

            <h2>Taming the Energy Beast: Heating, Lighting & Appliances</h2>
            <p>With fluctuating energy prices, making your home more energy-efficient is key.</p>
            <ul>
              <li>
                <strong>Understand Your Usage:</strong> Many smart meters or online accounts provide
                a detailed breakdown of your energy consumption. Identify peak usage times or
                'energy hungry' appliances.
              </li>
              <li>
                <strong>Smart Thermostat & Zoned Heating:</strong> Invest in a smart thermostat that
                learns your habits or allows you to control heating from your phone. Only heat the
                rooms you're using.
              </li>
              <li>
                <strong>Appliance Awareness:</strong> Run washing machines and dishwashers only on
                full loads, wash clothes at 30°C, and unplug devices left on standby.
              </li>
              <li>
                <strong>LED Lighting:</strong> Switch to LED bulbs. They use significantly less
                energy and last much longer than traditional bulbs.
              </li>
            </ul>

            <div className="my-8">
              <img
                src={createUnsplashUrl(
                  thermostatImage.baseUrl,
                  thermostatImage.params,
                  thermostatImage.width
                )}
                srcSet={createUnsplashSrcSet(
                  thermostatImage.baseUrl,
                  thermostatImage.params,
                  thermostatImage.srcSetWidths
                )}
                sizes={thermostatImage.sizes}
                alt={thermostatImage.alt}
                width={thermostatImage.width}
                height={thermostatImage.height}
                loading="lazy"
                decoding="async"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                Smart home technology can help you take control of your energy usage
              </p>
            </div>

            <h2>Quick Wins: Small Changes, Big Impact</h2>
            <p>Sometimes the smallest adjustments yield the greatest results:</p>
            <ul>
              <li>
                <strong>Loyalty Programs:</strong> Use supermarket loyalty cards and apps – they
                often offer personalized discounts.
              </li>
              <li>
                <strong>Energy Supplier Switching:</strong> Use comparison sites to ensure you're on
                the best tariff for your usage.
              </li>
              <li>
                <strong>Water-Saving Devices:</strong> Simple devices like shower timers or low-flow
                showerheads can reduce both water and energy bills.
              </li>
              <li>
                <strong>Draft Proofing:</strong> Seal gaps around windows and doors – it's cheap and
                effective.
              </li>
            </ul>

            <Separator className="my-8" />

            <h2>Making it Sustainable: The Long Game</h2>
            <p>
              The key to lasting financial change isn't dramatic overnight transformations – it's
              building sustainable habits that compound over time. Start with one or two changes
              from this guide, master them, then gradually add more. Your future self (and your bank
              account) will thank you.
            </p>

            <Card className="my-8 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  💡 Pro Tip: Track Your Progress
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Use our{' '}
                  <Link to={createPageUrl('BudgetCalculator')} className="underline font-medium">
                    Budget Planner
                  </Link>{' '}
                  to track your grocery and energy spending before and after implementing these
                  tips. Seeing the actual numbers will keep you motivated!
                </p>
              </CardContent>
            </Card>
          </div>
        </article>
      </div>
    </div>
  );
}
