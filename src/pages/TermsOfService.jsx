import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FileText className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Last updated: 27/08/2025</p>
        </div>

        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Welcome to CalcMyMoney.co.uk. By accessing or using our website and its services, you
              agree to be bound by these Terms of Service. If you disagree with any part of the
              terms, you may not access the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
              1. Use of Calculators and Content
            </h2>
            <p>
              The financial calculators, tools, and content provided on CalcMyMoney.co.uk are for
              informational and educational purposes only. They are intended to be used as a guide
              and for personal, non-commercial use. The results from the calculators are estimates
              and should not be considered as professional financial advice.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
              2. No Financial Advice
            </h2>
            <p>
              CalcMyMoney.co.uk is not a financial advisor. The information provided on this website
              does not constitute financial, tax, legal, or investment advice. You should consult
              with a qualified professional before making any financial decisions. Your use of any
              information or materials on this website is entirely at your own risk, for which we
              shall not be liable.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
              3. Accuracy of Information
            </h2>
            <p>
              We strive to keep the information and calculation logic up-to-date and correct.
              However, we make no representations or warranties of any kind, express or implied,
              about the completeness, accuracy, reliability, suitability, or availability with
              respect to the website or the information, products, services, or related graphics
              contained on the website for any purpose. Tax laws and regulations change frequently.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
              4. Limitation of Liability
            </h2>
            <p>
              In no event will CalcMyMoney.co.uk, nor its owners, employees, or affiliates, be
              liable for any loss or damage including without limitation, indirect or consequential
              loss or damage, or any loss or damage whatsoever arising from loss of data or profits
              arising out of, or in connection with, the use of this website.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
              5. Governing Law
            </h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of England and
              Wales, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
              6. Changes to Terms
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any
              time. We will provide notice of any changes by posting the new Terms of Service on
              this page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
