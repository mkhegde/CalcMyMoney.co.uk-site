import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button'; // Added Button import
import { Home } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';
import Heading from '@/components/common/Heading';

const councilTaxFAQs = [
  {
    question: 'What is Council Tax?',
    answer:
      "Council Tax is a locally-set tax in Great Britain charged on domestic properties. The amount is based on the property's valuation band and the local council's budget needs.",
  },
  {
    question: 'How are Council Tax bands determined?',
    answer:
      'Properties are assigned to a valuation band (A-H in England) based on their value on a specific date (1 April 1991 for England). This calculator uses a simplified model based on average Band D tax.',
  },
  {
    question: 'Can I get a discount?',
    answer:
      'Yes, various discounts and exemptions are available, such as the 25% single person discount, student exemptions, and Council Tax Reduction for those on low incomes. This calculator does not account for these discounts.',
  },
  {
    question: 'A Note on Accuracy',
    answer:
      "This is an ESTIMATION tool. Actual Council Tax varies significantly between local authorities. The figures are based on the average Band D tax for England and standard multipliers. Always check your local council's website for precise figures.",
  },
];

const BAND_MULTIPLIERS = {
  A: 6 / 9,
  B: 7 / 9,
  C: 8 / 9,
  D: 1,
  E: 11 / 9,
  F: 13 / 9,
  G: 15 / 9,
  H: 18 / 9,
};
const AVERAGE_BAND_D_ENGLAND = 2171; // For 2024/25

export default function CouncilTaxCalculator() {
  const [band, setBand] = useState('D');
  const [tax, setTax] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false); // Added hasCalculated state

  const handleCalculate = useCallback(() => {
    const multiplier = BAND_MULTIPLIERS[band];
    const estimatedTax = AVERAGE_BAND_D_ENGLAND * multiplier;
    setTax(estimatedTax);
    setHasCalculated(true); // Set hasCalculated to true after calculation
  }, [band]);

  // REMOVED: useEffect for auto-calculation
  // The previous useEffect hook which triggered handleCalculate on mount and band change has been removed.

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">Council Tax Estimator</Heading>
          {/* Added description paragraph */}
          <p className="text-center text-gray-600 mt-2">
            Get an estimate for your annual council tax bill based on your property band in England.
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              {/* Adjusted CardContent spacing */}
              <CardContent className="space-y-4">
                <div>
                  {/* Adjusted label class */}
                  <label className="block mb-2">Council Tax Band</label>
                  <Select value={band} onValueChange={setBand}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(BAND_MULTIPLIERS).map((b) => (
                        <SelectItem key={b} value={b}>
                          Band {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Added Estimate Tax Button */}
                <Button onClick={handleCalculate} className="w-full">
                  Estimate Tax
                </Button>
              </CardContent>
            </Card>
          </div>
          <div>
            {/* Conditional rendering based on hasCalculated */}
            {hasCalculated ? (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Estimated Annual Council Tax</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-bold text-blue-900">
                    £{tax.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm mt-2">
                    Monthly payment: ~£
                    {(tax / 12).toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[220px]">
                <div className="text-center text-gray-500">
                  <Home className="w-10 h-10 mx-auto mb-2" />
                  <p>Select your band to see an estimate.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
        <div className="mt-12">
          <FAQSection faqs={councilTaxFAQs} />
        </div>
      </div>
    </div>
  );
}
