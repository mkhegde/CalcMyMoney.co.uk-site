import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function MortgageCalculatorUK() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const breadcrumbJson = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":`${origin}/`},
      {"@type":"ListItem","position":2,"name":"Mortgage Calculators Hub","item":`${origin}/MortgageCalculatorUK`}
    ]
  };
  const faqs = [
    { question: "What inputs do the mortgage tools use?", answer: "Rate, term, deposit, and loan amount; some include fees and overpayments." },
    { question: "Where do rates come from?", answer: "We recommend cross-checking offers; refer to the Bank of England base rate for context." }
  ];
  const faqJson = { "@context":"https://schema.org", "@type":"FAQPage", "mainEntity": faqs.map(f => ({ "@type":"Question","name":f.question,"acceptedAnswer":{ "@type":"Answer","text":f.answer }})) };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
      <script type="application/ld+json">{JSON.stringify(faqJson)}</script>

      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">UK Mortgage Calculators Hub</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3">Explore UK mortgage tools: repayment, comparison, and home loan calculators.</p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link to={createPageUrl("MortgageLoanRepayment")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Mortgage Loan Repayment</Link>
              <Link to={createPageUrl("HomeLoanMortgageCalculator")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Home Loan Mortgage</Link>
              <Link to={createPageUrl("MortgageComparison")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Mortgage Comparison</Link>
              <Link to={createPageUrl("PersonalLoanCalculator")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Personal Loan Calculator</Link>
            </div>

            {/* Affiliate CTA placeholder */}
            <div className="mt-6">
              <a href="#" className="inline-block px-5 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Check partner mortgage rates (coming soon)
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6">
          {[{
            name: "Mortgage Loan Repayment",
            url: createPageUrl("MortgageLoanRepayment"),
            desc: "Estimate monthly repayments across a range of interest rates."
          },{
            name: "Home Loan Mortgage Calculator",
            url: createPageUrl("HomeLoanMortgageCalculator"),
            desc: "Quick home loan estimates with deposit and term options."
          },{
            name: "Mortgage Comparison",
            url: createPageUrl("MortgageComparison"),
            desc: "Compare two mortgage offers side-by-side."
          },{
            name: "Personal Loan Calculator",
            url: createPageUrl("PersonalLoanCalculator"),
            desc: "Estimate payments for unsecured personal loans."
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