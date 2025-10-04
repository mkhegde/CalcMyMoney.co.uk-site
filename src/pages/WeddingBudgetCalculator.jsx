import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, PartyPopper, Trash2 } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const weddingFAQs = [
  {
    question: 'How should I estimate these costs?',
    answer:
      "Start by researching average prices in your area for each category. Use these figures as a baseline. It's always a good idea to add a 10-15% contingency fund for unexpected expenses.",
  },
  {
    question: "What's a good way to save money on a wedding?",
    answer:
      "Consider an off-peak wedding date (avoiding Saturdays in summer), limiting your guest list, DIY-ing decorations, or choosing a venue that allows you to bring your own suppliers. Prioritise what's most important to you as a couple.",
  },
  {
    question: 'Should I include honeymoon costs here?',
    answer:
      "It's up to you! Some couples budget for the honeymoon as part of the overall wedding expenses, while others keep it separate. You can add it as a custom item if you'd like.",
  },
];

const initialItems = [
  { id: 1, name: 'Venue Hire', placeholder: '4500', value: '' },
  { id: 2, name: 'Catering (per head)', placeholder: '75', value: '' },
  { id: 3, name: 'Number of Guests', placeholder: '80', value: '' },
  { id: 4, name: 'Attire (Dresses, Suits)', placeholder: '2000', value: '' },
  { id: 5, name: 'Photography/Videography', placeholder: '1800', value: '' },
  { id: 6, name: 'Entertainment (DJ/Band)', placeholder: '1000', value: '' },
  { id: 7, name: 'Flowers & Decorations', placeholder: '1200', value: '' },
  { id: 8, name: 'Cake', placeholder: '400', value: '' },
  {
    id: 9,
    name: 'Contingency Fund (10%)',
    placeholder: 'Calculated',
    value: '',
    isCalculated: true,
  },
];

export default function WeddingBudgetCalculator() {
  const [items, setItems] = useState(initialItems);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPlaceholder, setNewItemPlaceholder] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleItemChange = (id, value) => {
    setItems(items.map((item) => (item.id === id ? { ...item, value } : item)));
  };

  const handleAddItem = () => {
    if (!newItemName) return;
    const newItem = {
      id: Date.now(),
      name: newItemName,
      placeholder: newItemPlaceholder || '0',
      value: '',
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemPlaceholder('');
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleCalculate = () => {
    let subTotal = 0;
    const guestCount = Number(items.find((i) => i.name === 'Number of Guests')?.value) || 0;
    const costPerHead = Number(items.find((i) => i.name === 'Catering (per head)')?.value) || 0;

    items.forEach((item) => {
      if (
        item.name === 'Catering (per head)' ||
        item.name === 'Number of Guests' ||
        item.isCalculated
      ) {
        return;
      }
      subTotal += Number(item.value) || 0;
    });

    const cateringTotal = guestCount * costPerHead;
    subTotal += cateringTotal;

    const contingency = subTotal * 0.1;
    const grandTotal = subTotal + contingency;

    setResults({
      subTotal,
      contingency,
      grandTotal,
      cateringTotal,
    });
    setHasCalculated(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Heading as="h1" size="h1" weight="bold">Wedding Budget Calculator</Heading>
          <p className="text-lg text-gray-600 mt-2">
            Plan and track your wedding expenses to stay on budget.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Your Wedding Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map(
                  (item) =>
                    !item.isCalculated && (
                      <div key={item.id} className="grid grid-cols-3 gap-4 items-center">
                        <Label htmlFor={`item-${item.id}`} className="col-span-1">
                          {item.name}
                        </Label>
                        <div className="relative col-span-2 flex items-center">
                          {!['Catering (per head)', 'Number of Guests'].includes(item.name) && (
                            <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          )}
                          <Input
                            id={`item-${item.id}`}
                            type="number"
                            value={item.value}
                            onChange={(e) => handleItemChange(item.id, e.target.value)}
                            placeholder={`e.g. ${item.placeholder}`}
                            className={
                              !['Catering (per head)', 'Number of Guests'].includes(item.name)
                                ? 'pl-10'
                                : ''
                            }
                          />
                          {item.id > 9 && ( // Allow deleting custom items only
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              className="ml-2 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                )}
                <div className="border-t pt-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Add a custom expense</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Expense name (e.g. Stationery)"
                    />
                    <Input
                      value={newItemPlaceholder}
                      onChange={(e) => setNewItemPlaceholder(e.target.value)}
                      placeholder="Example cost (e.g. 250)"
                    />
                    <Button onClick={handleAddItem}>Add</Button>
                  </div>
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
              {hasCalculated && results ? (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Total Estimated Budget</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-5xl font-bold text-blue-800">
                      £{results.grandTotal.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                    </p>
                    <div className="text-left space-y-2 text-sm pt-4 border-t">
                      <div className="flex justify-between">
                        <span>Catering Total:</span>{' '}
                        <span className="font-medium">
                          £{results.cateringTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Costs Subtotal:</span>{' '}
                        <span className="font-medium">
                          £{(results.subTotal - results.cateringTotal).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>10% Contingency:</span>{' '}
                        <span className="font-medium">
                          £
                          {results.contingency.toLocaleString('en-GB', {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex items-center justify-center h-64 bg-gray-50">
                  <div className="text-center text-gray-500">
                    <PartyPopper className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Ready to plan your big day?</h3>
                    <p>Enter your costs and click 'Calculate' to see your budget.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <FAQSection faqs={weddingFAQs} />
        </div>
      </div>
    </div>
  );
}
