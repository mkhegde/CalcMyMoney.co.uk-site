import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Users } from 'lucide-react';
import Heading from '@/components/common/Heading';

export default function HouseholdBillsSplitter() {
  const [bills, setBills] = useState([
    { name: 'Rent', amount: '1200' },
    { name: 'Energy', amount: '150' },
  ]);
  const [people, setPeople] = useState(2);
  const [results, setResults] = useState(null);

  const handleBillChange = (index, field, value) => {
    const newBills = [...bills];
    newBills[index][field] = value;
    setBills(newBills);
  };
  const addBill = () => setBills([...bills, { name: '', amount: '' }]);
  const removeBill = (index) => setBills(bills.filter((_, i) => i !== index));

  const calculate = () => {
    const total = bills.reduce((acc, bill) => acc + (Number(bill.amount) || 0), 0);
    const perPerson = total / people;
    setResults({ total, perPerson });
  };

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">Household Bills Splitter</Heading>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Enter Bills & People</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bills.map((bill, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Bill Name"
                      value={bill.name}
                      onChange={(e) => handleBillChange(index, 'name', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={bill.amount}
                      onChange={(e) => handleBillChange(index, 'amount', e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeBill(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addBill}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bill
                </Button>
                <div className="flex items-center gap-2">
                  <label>Number of People:</label>
                  <Input
                    type="number"
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
                <Button onClick={calculate} className="w-full">
                  Calculate Split
                </Button>
              </CardContent>
            </Card>
          </div>
          <div>
            {results && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle>Split Result</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p>Total Bills</p>
                  <p className="text-3xl font-bold">£{results.total.toLocaleString()}</p>
                  <p className="pt-4">Cost Per Person</p>
                  <p className="text-4xl font-bold text-green-700">
                    £{results.perPerson.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
