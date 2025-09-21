import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Zap, Calculator, Home, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";

// Current Ofgem price cap rates (as of 2025)
const energyRates = {
  electricity: {
    standingCharge: 60.10, // pence per day
    unitRate: 24.50 // pence per kWh
  },
  gas: {
    standingCharge: 31.43, // pence per day  
    unitRate: 6.24 // pence per kWh
  }
};

const propertyTypes = {
  flat: { electricityUsage: 2000, gasUsage: 8000 },
  terrace: { electricityUsage: 2900, gasUsage: 12000 },
  semi: { electricityUsage: 3300, gasUsage: 13500 },
  detached: { electricityUsage: 4200, gasUsage: 18000 },
  bungalow: { electricityUsage: 3100, gasUsage: 13000 }
};

export default function EnergyBillCalculator() {
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [occupants, setOccupants] = useState('2');
  const [electricityUsage, setElectricityUsage] = useState('');
  const [gasUsage, setGasUsage] = useState('');
  const [useCustomUsage, setUseCustomUsage] = useState(false);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  // Auto-populate usage based on property type
  useEffect(() => {
    if (propertyType && !useCustomUsage) {
      const baseUsage = propertyTypes[propertyType];
      const bedroomMultiplier = Number(bedrooms) * 0.15 + 0.7;
      const occupantMultiplier = Number(occupants) * 0.2 + 0.6;
      
      setElectricityUsage(Math.round(baseUsage.electricityUsage * bedroomMultiplier * occupantMultiplier).toString());
      setGasUsage(Math.round(baseUsage.gasUsage * bedroomMultiplier * occupantMultiplier).toString());
    }
  }, [propertyType, bedrooms, occupants, useCustomUsage]);

  const handleCalculate = () => {
    const currentElectricityUsage = Number(electricityUsage) || 0;
    const currentGasUsage = Number(gasUsage) || 0;

    if (currentElectricityUsage <= 0 && currentGasUsage <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // Calculate electricity costs
    const electricityStandingCharges = (energyRates.electricity.standingCharge / 100) * 365;
    const electricityUnitCosts = (currentElectricityUsage * energyRates.electricity.unitRate) / 100;
    const totalElectricityCost = electricityStandingCharges + electricityUnitCosts;

    // Calculate gas costs
    const gasStandingCharges = (energyRates.gas.standingCharge / 100) * 365;
    const gasUnitCosts = (currentGasUsage * energyRates.gas.unitRate) / 100;
    const totalGasCost = gasStandingCharges + gasUnitCosts;

    // Total energy bill
    const totalAnnualCost = totalElectricityCost + totalGasCost;
    const monthlyAverageCost = totalAnnualCost / 12;

    const newResults = {
      electricity: {
        usage: currentElectricityUsage,
        standingCharges: electricityStandingCharges,
        unitCosts: electricityUnitCosts,
        totalCost: totalElectricityCost
      },
      gas: {
        usage: currentGasUsage,
        standingCharges: gasStandingCharges,
        unitCosts: gasUnitCosts,
        totalCost: totalGasCost
      },
      totalAnnualCost,
      monthlyAverageCost
    };

    setResults(newResults);
    setHasCalculated(true);

    // Prepare CSV data
    const csvExportData = [
      ["Energy Type", "Usage", "Standing Charges", "Unit Costs", "Total"],
      ["Electricity", `${currentElectricityUsage} kWh`, `£${electricityStandingCharges.toFixed(2)}`, `£${electricityUnitCosts.toFixed(2)}`, `£${totalElectricityCost.toFixed(2)}`],
      ["Gas", `${currentGasUsage} kWh`, `£${gasStandingCharges.toFixed(2)}`, `£${gasUnitCosts.toFixed(2)}`, `£${totalGasCost.toFixed(2)}`],
      ["", "", "", "", ""],
      ["Total Annual Cost", "", "", "", `£${totalAnnualCost.toFixed(2)}`],
      ["Average Monthly Cost", "", "", "", `£${monthlyAverageCost.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [electricityUsage, gasUsage]);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              UK Energy Bill Calculator 2025
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate your annual electricity and gas costs based on current Ofgem price cap rates. Get accurate estimates for your household energy bills.
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculator Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Energy Bill Calculation Results</div>

        <div className="grid lg:grid-cols-3 gap-8 printable-grid-cols-1">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6 non-printable">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat/Apartment</SelectItem>
                      <SelectItem value="terrace">Terraced House</SelectItem>
                      <SelectItem value="semi">Semi-Detached House</SelectItem>
                      <SelectItem value="detached">Detached House</SelectItem>
                      <SelectItem value="bungalow">Bungalow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Bedrooms</Label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4 Bedrooms</SelectItem>
                      <SelectItem value="5">5+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Occupants</Label>
                  <Select value={occupants} onValueChange={setOccupants}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Person</SelectItem>
                      <SelectItem value="2">2 People</SelectItem>
                      <SelectItem value="3">3 People</SelectItem>
                      <SelectItem value="4">4 People</SelectItem>
                      <SelectItem value="5">5+ People</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Annual Energy Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useCustomUsage"
                    checked={useCustomUsage}
                    onChange={(e) => setUseCustomUsage(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="useCustomUsage" className="text-sm">
                    Use custom usage values
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="electricityUsage">Electricity Usage (kWh per year)</Label>
                  <Input
                    id="electricityUsage"
                    type="number"
                    value={electricityUsage}
                    onChange={(e) => setElectricityUsage(e.target.value)}
                    placeholder="e.g. 3000"
                    disabled={!useCustomUsage && propertyType}
                  />
                  <p className="text-xs text-gray-500">
                    Average UK household: 2,700 kWh
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gasUsage">Gas Usage (kWh per year)</Label>
                  <Input
                    id="gasUsage"
                    type="number"
                    value={gasUsage}
                    onChange={(e) => setGasUsage(e.target.value)}
                    placeholder="e.g. 12000"
                    disabled={!useCustomUsage && propertyType}
                  />
                  <p className="text-xs text-gray-500">
                    Average UK household: 11,500 kWh
                  </p>
                </div>

                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Energy Bill
                </Button>
              </CardContent>
            </Card>

            {/* Current Rates Info */}
            <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-400 text-base">
                  Current Ofgem Rates (2025)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold">Electricity:</p>
                    <p>Standing charge: {energyRates.electricity.standingCharge}p/day</p>
                    <p>Unit rate: {energyRates.electricity.unitRate}p/kWh</p>
                  </div>
                  <div>
                    <p className="font-semibold">Gas:</p>
                    <p>Standing charge: {energyRates.gas.standingCharge}p/day</p>
                    <p>Unit rate: {energyRates.gas.unitRate}p/kWh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Energy Bill Breakdown</h2>
                  <ExportActions csvData={csvData} fileName="energy-bill-calculation" title="Energy Bill Calculation" />
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">Annual Energy Bill</p>
                          <p className="text-3xl font-bold text-blue-900">
                            £{results.totalAnnualCost.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <Zap className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">Monthly Average</p>
                          <p className="text-3xl font-bold text-green-900">
                            £{results.monthlyAverageCost.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Electricity Breakdown */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-700">
                        <Zap className="w-5 h-5" />
                        Electricity Costs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Annual Usage:</span>
                        <span className="font-semibold">{results.electricity.usage.toLocaleString()} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Standing Charges:</span>
                        <span>£{results.electricity.standingCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Costs:</span>
                        <span>£{results.electricity.unitCosts.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
                        <span>Total Electricity:</span>
                        <span>£{results.electricity.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Monthly average: £{(results.electricity.totalCost / 12).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gas Breakdown */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700">
                        <Home className="w-5 h-5" />
                        Gas Costs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Annual Usage:</span>
                        <span className="font-semibold">{results.gas.usage.toLocaleString()} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Standing Charges:</span>
                        <span>£{results.gas.standingCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Costs:</span>
                        <span>£{results.gas.unitCosts.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
                        <span>Total Gas:</span>
                        <span>£{results.gas.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Monthly average: £{(results.gas.totalCost / 12).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Energy Saving Tips */}
                <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
                  <CardHeader>
                    <CardTitle className="text-green-900 dark:text-green-400">Energy Saving Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-green-800 dark:text-green-300">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Electricity Savings:</h4>
                        <ul className="space-y-1 text-xs">
                          <li>• Switch to LED light bulbs</li>
                          <li>• Unplug devices when not in use</li>
                          <li>• Use energy-efficient appliances</li>
                          <li>• Wash clothes at 30°C</li>
                          <li>• Air dry instead of tumble drying</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Gas Savings:</h4>
                        <ul className="space-y-1 text-xs">
                          <li>• Lower thermostat by 1°C (saves ~10%)</li>
                          <li>• Improve home insulation</li>
                          <li>• Service boiler annually</li>
                          <li>• Use a smart thermostat</li>
                          <li>• Close curtains at dusk</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <Card className="bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold">Important Notes:</p>
                      <ul className="text-xs mt-1 space-y-1">
                        <li>• Based on current Ofgem price cap rates</li>
                        <li>• Actual bills may vary based on supplier and tariff</li>
                        <li>• Usage estimates are based on typical household patterns</li>
                        <li>• Consider seasonal variations in energy usage</li>
                        <li>• Check your actual meter readings for precise calculations</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="lg:col-span-2 flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="text-center text-gray-500">
                  <Zap className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to calculate your energy bill?</h3>
                  <p>Enter your property details and energy usage to get an estimate.</p>
                  {hasCalculated && !results && (
                    <p className="text-red-500 mt-2">Please enter valid energy usage values.</p>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}