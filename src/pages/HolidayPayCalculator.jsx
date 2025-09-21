import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, CalendarDays, Briefcase } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExportActions from "../components/calculators/ExportActions";

const STATUTORY_WEEKS = 5.6;

export default function HolidayPayCalculator() {
  const [calculationType, setCalculationType] = useState('days');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [weeksWorked, setWeeksWorked] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    let holidayEntitlement = 0;
    let holidayPay = 0;

    if (calculationType === 'days') {
        const days = Number(daysPerWeek) || 0;
        const rate = Number(dailyRate) || 0;
        if (days > 0 && days <= 7) {
            holidayEntitlement = Math.min(days * STATUTORY_WEEKS, 28);
            holidayPay = holidayEntitlement * rate;
        }
    } else { // Irregular hours
        const weeks = Number(weeksWorked) || 0;
        const rate = Number(hourlyRate) || 0;
        if (weeks > 0 && rate > 0) {
            // Holiday entitlement for irregular hours workers is 12.07% of hours worked
            holidayEntitlement = (weeks * 12.07) / 100; // in weeks, convert to hours
            // This is a simplified model. True calculation is based on average pay over last 52 weeks.
            const avgWeeklyHours = weeks;
            const avgWeeklyPay = avgWeeklyHours * rate;
            holidayPay = avgWeeklyPay * STATUTORY_WEEKS;
        }
    }
    
    const newResults = {
        holidayEntitlement,
        holidayPay
    };

    setResults(newResults);
    setHasCalculated(true);
    
    const csvExportData = [
        ["Metric", "Value"],
        ["Holiday Entitlement", `${newResults.holidayEntitlement.toFixed(2)} ${calculationType === 'days' ? 'days' : 'hours'}`],
        ["Estimated Holiday Pay", `£${newResults.holidayPay.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [calculationType, daysPerWeek, dailyRate, weeksWorked, hourlyRate]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Holiday Pay & Entitlement Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everyone needs a break. Make sure you're getting the paid time off you're entitled to.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Work Pattern</CardTitle>
                <Select value={calculationType} onValueChange={setCalculationType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="days">I work a fixed number of days per week</SelectItem>
                        <SelectItem value="irregular">I work irregular hours / am on a zero-hour contract</SelectItem>
                    </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="space-y-6">
                {calculationType === 'days' ? (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="daysPerWeek">Days worked per week</Label>
                            <Input id="daysPerWeek" type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)} placeholder="e.g. 5" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dailyRate">Normal daily pay (£)</Label>
                            <Input id="dailyRate" type="number" value={dailyRate} onChange={e => setDailyRate(e.target.value)} placeholder="e.g. 150" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="weeksWorked">Average hours worked per week</Label>
                            <Input id="weeksWorked" type="number" value={weeksWorked} onChange={e => setWeeksWorked(e.target.value)} placeholder="e.g. 30" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hourlyRate">Your hourly rate (£)</Label>
                            <Input id="hourlyRate" type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="e.g. 11.50" />
                        </div>
                        <p className="text-xs text-gray-500">For irregular hours, holiday pay is based on your average pay over the previous 52 weeks worked.</p>
                    </>
                )}
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Entitlement
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your Holiday Entitlement</h2>
                   <ExportActions csvData={csvData} fileName="holiday-entitlement" title="Holiday Entitlement" />
                </div>
                <Card>
                  <CardHeader><CardTitle>Annual Entitlement</CardTitle></CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Annual Holiday Days/Hours</p>
                        <p className="text-3xl font-bold text-blue-900">{results.holidayEntitlement.toFixed(1)} {calculationType === 'days' ? 'days' : 'hours'}</p>
                    </div>
                     <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Total Holiday Pay</p>
                        <p className="text-3xl font-bold text-green-900">£{results.holidayPay.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Know your time off</h3>
                  <p>Enter your details to calculate your holiday pay.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}