import React from 'react';
import { Calculator as CalculatorIcon, Quote } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';

const DEFAULT_ORIGIN = 'https://www.calcmymoney.co.uk';

function buildSeoProps(seo = {}) {
  const props = { ...seo };

  if (!props.ogTitle && props.title) {
    props.ogTitle = props.title;
  }
  if (!props.ogDescription && props.description) {
    props.ogDescription = props.description;
  }
  if (!props.ogUrl && props.canonical) {
    props.ogUrl = props.canonical;
  }
  if (!props.twitterTitle && (props.ogTitle || props.title)) {
    props.twitterTitle = props.ogTitle || props.title;
  }
  if (!props.twitterDescription && (props.ogDescription || props.description)) {
    props.twitterDescription = props.ogDescription || props.description;
  }
  if (!props.ogSiteName) {
    props.ogSiteName = 'CalcMyMoney UK';
  }
  if (!props.ogLocale) {
    props.ogLocale = 'en_GB';
  }

  return props;
}

export default function StandardCalculatorLayout({
  seo,
  schemaConfig,
  icon: Icon = CalculatorIcon,
  title,
  description,
  intro,
  quote,
  children,
  faqs,
  relatedCalculators,
}) {
  const seoProps = buildSeoProps(seo);

  const schema = useCalculatorSchema({
    origin: DEFAULT_ORIGIN,
    faq: faqs,
    ...schemaConfig,
  });

  const hasIntroContent = intro?.title || intro?.body || quote?.text;
  const hasFaqs = Array.isArray(faqs) && faqs.length > 0;
  const hasRelatedCalculators =
    Array.isArray(relatedCalculators) && relatedCalculators.length > 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead {...seoProps} jsonLd={schema} />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                {title}
              </Heading>
            </div>
            {description ? (
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {description}
              </p>
            ) : null}
          </header>

          {hasIntroContent ? (
            <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/40">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2 max-w-2xl">
                  {intro?.title ? (
                    <Heading as="h2" size="h3" className="!mb-0 text-slate-900 dark:text-slate-100">
                      {intro.title}
                    </Heading>
                  ) : null}
                  {intro?.body ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">{intro.body}</p>
                  ) : null}
                </div>
                {quote?.text ? (
                  <blockquote className="max-w-sm rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
                    <div className="flex items-start gap-2">
                      <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <p className="italic leading-relaxed">“{quote.text}”</p>
                    </div>
                    {quote.author ? (
                      <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        — {quote.author}
                      </footer>
                    ) : null}
                  </blockquote>
                ) : null}
              </div>
            </section>
          ) : null}

          {children}

          {hasFaqs ? (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={faqs} />
            </section>
          ) : null}

          {hasRelatedCalculators ? (
            <RelatedCalculators calculators={relatedCalculators} />
          ) : null}
        </div>
      </CalculatorWrapper>
    </div>
  );
}
