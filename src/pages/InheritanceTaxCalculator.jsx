import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PoundSterling, Shield } from "lucide-react";
import FAQSection from "../components/calculators/FAQSection";

const iFAQs = [
    { question: "What is Inheritance Tax (IHT)?", answer: "IHT is a tax on the estate (the property, money, and possessions) of someone who has died. It's also sometimes payable on gifts made during a person's lifetime." },
    { question: "What is the Nil-Rate Band (NRB)?", answer: "Most estates can pass on up to £325,000 without any IHT being due. This is the Nil-Rate Band." },
    { question: "What is the Residence Nil-Rate Band (RNRB)?", answer: "The RNRB is an additional threshold of up to £175,000 if you give away your main residence to your children or other direct descendants." },
    { question: "A Note on Trustworthiness", answer: "This is a simplified calculator based on 2024/25 tax rules. IHT is extremely complex, involving gifts, trusts, and exemptions not covered here. This tool is for educational purposes only. Always consult a qualified legal or financial advisor for estate planning." }
];

export default function InheritanceTaxCalculator() {
    const [estateValue, setEstateValue] = useState('750000');
    const [passToDirectDescendant, setPassToDirectDescendant] = useState(true);
    const [results, setResults] = useState(null);

    const NRB = 325000;
    const RNRB = 175000;
    const IHT_RATE = 0.40;

    const handleCalculate = useCallback(() => {
        const value = Number(estateValue) || 0;
        let totalThreshold = NRB;
        if (passToDirectDescendant) {
            totalThreshold += RNRB;
        }
        
        const taxableAmount = Math.max(0, value - totalThreshold);
        const ihtPayable = taxableAmount * IHT_RATE;

        setResults({ ihtPayable, taxableAmount, totalThreshold });
    }, [estateValue, passToDirectDescendant]);

    useEffect(() => {
        handleCalculate();
    }, [handleCalculate]);

    return (
        <div className="bg-white">
            <div className="bg-gray-50 border-b"><div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-center">Inheritance Tax Calculator</h1></div></div>
            <div className="max-w-4xl mx-auto p-4 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <Card><CardHeader><CardTitle>Estate Details</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div><Label>Total Estate Value (£)</Label><Input type="number" value={estateValue} onChange={e => setEstateValue(e.target.value)} /></div>
                                <div className="flex items-center justify-between"><Label>Passing main home to direct descendants?</Label><Switch checked={passToDirectDescendant} onCheckedChange={setPassToDirectDescendant} /></div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        {results && <Card className="bg-red-50 border-red-200"><CardHeader><CardTitle className="text-red-900">Estimated IHT Payable</CardTitle></CardHeader>
                            <CardContent><p className="text-5xl font-bold text-red-900">£{results.ihtPayable.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</p>
                                <div className="mt-4 text-sm space-y-2">
                                    <div className="flex justify-between"><span>Total tax-free threshold:</span> <strong>£{results.totalThreshold.toLocaleString()}</strong></div>
                                    <div className="flex justify-between"><span>Taxable estate value:</span> <strong>£{results.taxableAmount.toLocaleString()}</strong></div>
                                </div>
                            </CardContent>
                        </Card>}
                    </div>
                </div>
                <div className="mt-12"><FAQSection faqs={iFAQs} /></div>
            </div>
        </div>
    );
}