import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import RelatedCalculators from "../components/calculators/RelatedCalculators";

export default function HomeLoanMortgageCalculator() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const breadcrumbJson = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":`${origin}/`},
      {"@type":"ListItem","position":2,"name":"Mortgage Calculators Hub","item":`${origin}/MortgageCalculatorUK`},
      {"@type":"ListItem","position":3,"name":"Home Loan Mortgage Calculator","item":`${origin}/HomeLoanMortgageCalculator`}
    ]
  };
  const faqs = [
    { question: "How is the payment calculated?", answer: "Based on the loan amount, term and interest rate entered." }
  ];
  const faqJson = { "@context":"https://schema.org", "@type":"FAQPage", "mainEntity": faqs.map(f => ({ "@type":"Question","name":f.question,"acceptedAnswer":{ "@type":"Answer","text":f.answer }})) };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
      <script type="application/ld+json">{JSON.stringify(faqJson)}</script>

      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200 text-center py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Home Loan Mortgage Calculator</h1>
          <p className="text-gray-600 mt-2">Quickly estimate payments for common mortgage scenarios.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to={createPageUrl("MortgageCalculatorUK")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Mortgage Hub</Link>
            <Link to={createPageUrl("MortgageLoanRepayment")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Mortgage Repayment</Link>
            <Link to={createPageUrl("MortgageComparison")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50">Mortgage Comparison</Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="p-6 bg-gray-50 border rounded">
            <p className="text-gray-700">Calculator coming soon. Meanwhile, use the main Mortgage Calculator for a detailed breakdown.</p>
          </div>

          <div className="mt-12">
            <RelatedCalculators
              calculators={[
                { name: "Back to Mortgage Hub", url: createPageUrl("MortgageCalculatorUK"), description: "Explore all mortgage tools." },
                { name: "Mortgage Loan Repayment", url: createPageUrl("MortgageLoanRepayment"), description: "See monthly payments." },
                { name: "Mortgage Comparison", url: createPageUrl("MortgageComparison"), description: "Compare deals." }
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}