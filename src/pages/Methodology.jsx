import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Methodology() {
  const LAST_UPDATED_ISO = "2025-09-10";
  const LAST_UPDATED_DISPLAY = "10 September 2025";

  const origin = typeof window !== "undefined" ? window.location.origin : "https://calcmymoney.co.uk";
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Home","item": `${origin}/`},
      {"@type":"ListItem","position":2,"name":"Methodology","item": `${origin}/Methodology`}
    ]
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Methodology & Data Sources
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-3">
              How we calculate UK salary, tax and mortgage results. Data sources: HMRC 2025/26, Bank of England.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <p>
                At Calculate My Money, accuracy and transparency are core principles. All of our calculators are built on official UK sources, and we update them as new figures are released. This page explains the rules we use, how frequently we refresh our data, and the assumptions behind our estimates.
              </p>
              <p className="text-gray-700">
                While our tools are carefully engineered, they are designed for guidance only and should not be relied upon as financial or legal advice. For personal advice, please consult a qualified professional, your employer, or your lender.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Year & Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Current default:</strong> 2025/26 UK tax year</li>
                <li>
                  <strong>Data source:</strong>{" "}
                  <a href="https://www.gov.uk/guidance/rates-and-allowances-for-income-tax" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    HMRC Income Tax Rates and Allowances
                  </a>
                </li>
                <li><strong>Regional support:</strong> calculators reflect both rUK and Scottish tax bands</li>
                <li>
                  <strong>National Insurance:</strong> thresholds and rates from{" "}
                  <a href="https://www.gov.uk/national-insurance-rates-letters" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    HMRC National Insurance Rates
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pension & Student Loans</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Pension contributions: calculated on either a relief-at-source or net pay basis (depending on input).</li>
                <li>Student loans: Plan 1, Plan 2, Plan 4, and Postgraduate Loans supported.</li>
                <li>
                  Thresholds from{" "}
                  <a href="https://www.gov.uk/repaying-your-student-loan/what-you-pay" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    HMRC Student Loan Repayment
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mortgage & Interest Rates</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Mortgage calculators allow flexible entry of rate, deposit, and term.</li>
                <li>We recommend cross-checking with current lender offers.</li>
                <li>
                  Reference:{" "}
                  <a href="https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    Bank of England Base Rate
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assumptions & Rounding</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Results rounded to the nearest £1 for clarity.</li>
                <li>Annual to monthly/weekly conversions use standard 12-month or 52-week assumptions.</li>
                <li>PAYE applied cumulatively across the tax year.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates & Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
              <p>Figures updated within 1 week of official HMRC or BoE releases.</p>
              <p><strong>Last updated:</strong> {LAST_UPDATED_DISPLAY}</p>
              <p><strong>Maintained by:</strong> Calculate My Money Team</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}