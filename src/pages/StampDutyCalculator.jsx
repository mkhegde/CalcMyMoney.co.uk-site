
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PoundSterling, Calculator, Home, AlertTriangle } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";
import FAQSection from "../components/calculators/FAQSection";

const sdltFAQs = [
  {
    question: "What is Stamp Duty Land Tax (SDLT)?",
    answer: "SDLT is a tax you might have to pay if you buy a residential property or piece of land in England or Northern Ireland over a certain price. The rules are different for Scotland (Land and Buildings Transaction Tax) and Wales (Land Transaction Tax)."
  },
  {
    question: "Do first-time buyers pay Stamp Duty?",
    answer: "First-time buyers receive relief. In England and NI, they pay no Stamp Duty on properties up to £425,000, and a 5% rate on the portion from £425,001 to £625,000. If the property price is over £625,000, they cannot claim the relief and pay the standard rates."
  },
  {
    question: "What is the additional rate for second homes?",
    answer: "If you are buying an additional residential property (e.g., a buy-to-let or a second home), you will usually have to pay a 3% surcharge on top of the standard SDLT rates."
  },
  {
    question: "When is SDLT due and how do I pay it?",
    answer: "SDLT must be filed and paid within 14 days of the effective date of the transaction (usually completion). Your solicitor or conveyancer typically submits the SDLT return and pays HMRC on your behalf as part of the completion process."
  },
  {
    question: "Does SDLT work differently for leasehold vs. freehold?",
    answer: "Yes. For leasehold purchases, SDLT can be due on both the purchase price (premium) and, in some cases, the net present value of the rent (ground rent). Freehold purchases are usually assessed solely on the purchase price. Always check your solicitor’s advice for your specific contract terms."
  }
];

const standardRates = [
  { threshold: 250000, rate: 0 },
  { threshold: 925000, rate: 0.05 },
  { threshold: 1500000, rate: 0.10 },
  { threshold: Infinity, rate: 0.12 }
];

const ftbRates = [
  { threshold: 425000, rate: 0 },
  { threshold: 625000, rate: 0.05 },
  { threshold: Infinity, rate: -1 } // Indicates standard rates apply
];

const additionalRateSurcharge = 0.03;

export default function StampDutyCalculator() {
  const [propertyPrice, setPropertyPrice] = useState('');
  const [buyerType, setBuyerType] = useState('nextHome');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const calculateSDLT = () => {
    const price = Number(propertyPrice) || 0;
    if (price <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    let totalTax = 0;
    let taxBreakdown = [];
    let previousThreshold = 0;
    
    let ratesToUse = standardRates;

    if (buyerType === 'firstTimeBuyer') {
      if (price <= 625000) {
        ratesToUse = ftbRates;
      }
    }
    
    for (const band of ratesToUse) {
        if (band.rate === -1) { // FTB relief limit exceeded
            ratesToUse = standardRates;
            totalTax = 0;
            taxBreakdown = [];
            previousThreshold = 0;
            // Restart calculation with standard rates
            for (const stdBand of standardRates) {
                 if (price > stdBand.threshold) {
                     const taxInBand = (stdBand.threshold - previousThreshold) * stdBand.rate;
                     if(taxInBand > 0) {
                        taxBreakdown.push({ band: `£${previousThreshold.toLocaleString()} - £${stdBand.threshold.toLocaleString()}`, rate: stdBand.rate * 100, tax: taxInBand });
                        totalTax += taxInBand;
                     }
                 } else {
                     const taxInBand = (price - previousThreshold) * stdBand.rate;
                     if(taxInBand > 0) {
                         taxBreakdown.push({ band: `£${previousThreshold.toLocaleString()} - £${price.toLocaleString()}`, rate: stdBand.rate * 100, tax: taxInBand });
                         totalTax += taxInBand;
                     }
                     break;
                 }
                previousThreshold = stdBand.threshold;
            }
            break; // Exit outer loop
        }

      if (price > previousThreshold) {
        const taxableAmountInBand = Math.min(price, band.threshold) - previousThreshold;
        const taxInBand = taxableAmountInBand * band.rate;
        if (taxInBand > 0) {
            taxBreakdown.push({
                band: `£${previousThreshold.toLocaleString()} to £${Math.min(price, band.threshold).toLocaleString()}`,
                rate: band.rate * 100,
                tax: taxInBand,
            });
            totalTax += taxInBand;
        }
      }
      previousThreshold = band.threshold;
    }

    if (buyerType === 'additionalHome') {
      const surcharge = price * additionalRateSurcharge;
      totalTax += surcharge;
      taxBreakdown.push({ band: 'Additional Property Surcharge', rate: 3, tax: surcharge });
    }

    const newResults = { totalTax, taxBreakdown, effectiveRate: (totalTax / price) * 100 };
    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
        ["Metric", "Value"],
        ["Total Stamp Duty", `£${newResults.totalTax.toFixed(2)}`],
        ["Effective Tax Rate", `${newResults.effectiveRate.toFixed(2)}%`],
        ...newResults.taxBreakdown.map(b => [`Tax on ${b.band} @ ${b.rate}%`, `£${b.tax.toFixed(2)}`]),
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [propertyPrice, buyerType]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Stamp Duty Calculator (England & NI)
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate the Stamp Duty Land Tax (SDLT) for your property purchase.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Stamp Duty Calculation</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Purchase Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyPrice">Property Price</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="propertyPrice" type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} className="pl-10" placeholder="e.g. 350000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Buyer Status</Label>
                  <RadioGroup value={buyerType} onValueChange={setBuyerType} className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                      <RadioGroupItem value="firstTimeBuyer" id="ftb" />
                      <Label htmlFor="ftb" className="w-full">First-Time Buyer</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                      <RadioGroupItem value="nextHome" id="nh" />
                      <Label htmlFor="nh" className="w-full">Moving to a Next Home</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                      <RadioGroupItem value="additionalHome" id="ah" />
                      <Label htmlFor="ah" className="w-full">Additional Home (e.g. Buy-to-Let)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button onClick={calculateSDLT} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Stamp Duty
                </Button>
                <Card className="border-yellow-300 bg-yellow-50 text-yellow-800 text-sm p-3">
                  <p>This calculator is for properties in England and Northern Ireland only. Scotland and Wales have different tax systems.</p>
                </Card>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Stamp Duty Result</h2>
                  <ExportActions csvData={csvData} fileName="stamp-duty" title="Stamp Duty" />
                </div>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-red-800 mb-2">Total Stamp Duty Payable</h3>
                    <div className="text-4xl font-bold text-red-900">
                      £{results.totalTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-sm text-red-700">Effective tax rate: {results.effectiveRate.toFixed(2)}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Tax Breakdown</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {results.taxBreakdown.map((band, index) => (
                      <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Tax on {band.band} at {band.rate}%</span>
                        <span className="font-semibold">£{band.tax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to calculate SDLT?</h3>
                  <p>Enter property price and buyer type to see the tax.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <section className="mt-12 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">How this Stamp Duty calculator works</h2>
          <p className="text-gray-700">
            This tool applies the current residential SDLT bands for England and Northern Ireland to your purchase price.
            If you select First-Time Buyer, the calculator applies relief up to the published threshold and then switches
            to standard rates where relief no longer applies. For Additional Homes, it adds the 3% surcharge to the
            relevant portions of the price. Your effective tax rate is the total SDLT divided by the purchase price.
          </p>
          <h3 className="text-xl font-semibold text-gray-900">Important notes and exclusions</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Scotland and Wales use different taxes (LBTT and LTT). Rates and thresholds differ from England/NI.</li>
            <li>Special rules may apply for shared ownership, leasehold ground rent, and mixed‑use or non‑residential property.</li>
            <li>This is guidance only and not financial or legal advice. Always confirm figures with your solicitor or HMRC.</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900">Worked example</h3>
          <p className="text-gray-700">
            For a £350,000 next‑home purchase, tax is calculated band‑by‑band. The portion within the 0% band is untaxed;
            the portion in the 5% band is charged at 5%, and so on. Our breakdown shows each band, rate and the tax due,
            helping you understand exactly how your total SDLT is derived.
          </p>
        </section>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={sdltFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
