import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function TaxCalculatorsUK() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${origin}/` },
      { "@type": "ListItem", "position": 2, "name": "Tax Calculators Hub", "item": `${origin}/TaxCalculatorsUK` }
    ]
  };

  const faqs = [
    { question: "Which tax year do these tools use?", answer: "All tax calculators default to 2025/26 and are updated when HMRC publishes new thresholds." },
    { question: "Do you support Scottish and rUK bands?", answer: "Yes, where relevant we apply the appropriate Scottish or rUK bands." },
    { question: "Can I export or print results?", answer: "Yes, calculators include print or CSV export where applicable." }
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer } }))
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
      <script type="application/ld+json">{JSON.stringify(faqJson)}</script>

      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              UK Tax Calculators Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3">
              Explore UK tax tools for 2025/26: income tax after tax, tax + NI and net income calculators.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link to={createPageUrl("TaxAfterTaxCalculator")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Tax After Tax</Link>
              <Link to={createPageUrl("TaxAndNICalculator")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Tax + NI</Link>
              <Link to={createPageUrl("NetIncomeUKCalculator")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Net Income</Link>
              <Link to={createPageUrl("SelfAssessmentGuide")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Self Assessment Guide</Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6">
          {[{
            name: "Tax After Tax Calculator",
            url: createPageUrl("TaxAfterTaxCalculator"),
            desc: "Calculate your tax after tax for 2025/26 with clear band breakdowns."
          },{
            name: "Tax + NI Calculator",
            url: createPageUrl("TaxAndNICalculator"),
            desc: "See combined Income Tax and National Insurance contributions."
          },{
            name: "Net Income Calculator",
            url: createPageUrl("NetIncomeUKCalculator"),
            desc: "Estimate your net take-home pay after Tax and NI."
          },{
            name: "Self Assessment Guide",
            url: createPageUrl("SelfAssessmentGuide"),
            desc: "Understand deadlines, rates, allowances and tips."
          }].map((c, i) => (
            <Link key={i} to={c.url}>
              <Card className="hover:shadow-md transition">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900">{c.name}</h3>
                  <p className="text-gray-600 mt-2">{c.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}