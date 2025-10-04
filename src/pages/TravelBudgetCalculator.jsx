import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Plane, Calculator } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';
import Heading from '@/components/common/Heading';

const travelFAQs = [
  {
    question: 'How do I estimate costs accurately?',
    answer:
      "Research is key. Use flight comparison sites, check accommodation prices on booking platforms for your dates, and look up average meal costs at your destination. It's also wise to add a 10-15% contingency for unexpected expenses.",
  },
  {
    question: 'What are some common forgotten expenses?',
    answer:
      "Don't forget to budget for travel insurance, visa fees, local transport (taxis, buses), currency exchange fees, and tips. These small costs can add up.",
  },
  {
    question: 'Any tips for saving money on a trip?',
    answer:
      "Consider traveling during the 'shoulder seasons' (just outside of peak time) for better prices. Booking flights and accommodation in advance can also lead to significant savings. Eating at local markets or preparing some of your own meals can also cut down food costs.",
  },
];

const initialItems = [
  { id: 1, category: 'Flights', placeholder: '800', budget: '' },
  { id: 2, category: 'Accommodation', placeholder: '1000', budget: '' },
  { id: 3, category: 'Food & Drink', placeholder: '700', budget: '' },
  { id: 4, category: 'Activities', placeholder: '400', budget: '' },
];

export default function TravelBudgetCalculator() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () =>
    setItems([...items, { id: Date.now(), category: '', placeholder: 'e.g. 150', budget: '' }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleCalculate = useCallback(() => {
    const budgetTotal = items.reduce((acc, item) => acc + (Number(item.budget) || 0), 0);
    setTotal(budgetTotal);
    setHasCalculated(true);
  }, [items]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <Heading as="h1" size="h1" weight="bold">Travel &amp; Holiday Budget Calculator</Heading>
          <p className="text-lg text-gray-600 mt-2">
            Plan your next holiday with our easy-to-use travel budget calculator. Estimate costs for
            flights, accommodation, food, and activities.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Your Trip Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-3 gap-4 items-center">
                    <Input
                      placeholder="Expense Category"
                      value={item.category}
                      onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                      className="col-span-1"
                    />
                    <div className="col-span-2 flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder={`e.g. ${item.placeholder}`}
                        value={item.budget}
                        onChange={(e) => handleItemChange(index, 'budget', e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <Button variant="outline" onClick={addItem} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense Item
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCalculate} className="w-full text-lg py-6">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Total Budget
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {hasCalculated && total !== null ? (
                <Card className="bg-cyan-50 border-cyan-200">
                  <CardHeader>
                    <CardTitle className="text-cyan-900">Total Trip Budget</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-5xl font-bold text-cyan-800">£{total.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex items-center justify-center h-64 bg-gray-50">
                  <div className="text-center text-gray-500">
                    <Plane className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Ready for an adventure?</h3>
                    <p>Enter your costs and click 'Calculate' to see your budget.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <FAQSection faqs={travelFAQs} title="Travel Budgeting Tips" />
        </div>
      </div>
    </div>
  );
}
