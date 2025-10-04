import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useSeo } from '@/components/seo/SeoContext';
import useFaqSchema from '@/components/seo/useFaqSchema';

export default function FAQSection({
  faqs,
  title = 'Frequently Asked Questions',
  disableSchema = false,
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const { setSeo, defaults } = useSeo();
  const faqSchema = useFaqSchema(faqs);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (!faqSchema) {
      return;
    }

    const removeSchema = () => {
      setSeo((prevOverrides) => {
        if (!prevOverrides || !Array.isArray(prevOverrides.jsonLd)) {
          return prevOverrides;
        }

        const nextJsonLd = prevOverrides.jsonLd.filter((schema) => schema !== faqSchema);

        if (nextJsonLd.length === prevOverrides.jsonLd.length) {
          return prevOverrides;
        }

        if (nextJsonLd.length === 0) {
          const nextOverrides = { ...prevOverrides };
          delete nextOverrides.jsonLd;
          return nextOverrides;
        }

        if (
          Array.isArray(defaults?.jsonLd) &&
          nextJsonLd.length === defaults.jsonLd.length &&
          nextJsonLd.every((schema, index) => schema === defaults.jsonLd[index])
        ) {
          const nextOverrides = { ...prevOverrides };
          delete nextOverrides.jsonLd;
          return nextOverrides;
        }

        return {
          ...prevOverrides,
          jsonLd: nextJsonLd,
        };
      });
    };

    if (disableSchema) {
      removeSchema();
      return;
    }

    setSeo((prevOverrides) => {
      const baseJsonLd = Array.isArray(prevOverrides?.jsonLd)
        ? prevOverrides.jsonLd
        : Array.isArray(defaults?.jsonLd)
          ? defaults.jsonLd
          : [];

      if (baseJsonLd.includes(faqSchema)) {
        return prevOverrides;
      }

      const nextJsonLd = [...baseJsonLd, faqSchema];

      return {
        ...prevOverrides,
        jsonLd: nextJsonLd,
      };
    });

    return removeSchema;
  }, [defaults?.jsonLd, disableSchema, faqSchema, setSeo]);

  return (
    <Card className="border border-card-muted bg-card-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <HelpCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="overflow-hidden rounded-lg border border-card-muted bg-card">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-soft"
            >
              <span className="font-medium text-foreground">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-primary transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out grid ${openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 pt-1">
                  <div className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
