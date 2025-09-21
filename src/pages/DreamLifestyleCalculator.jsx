
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PoundSterling, Calculator, Sparkles, Gem, Car, Home, TrendingUp, Plane, Crown, Zap, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ExportActions from "../components/calculators/ExportActions";

const dreamItems = {
  property: {
    icon: Home,
    items: [
      { name: "Penthouse in Mayfair", value: 25000000 },
      { name: "Country Estate with 500 Acres", value: 15000000 },
      { name: "Luxury Villa in the Cotswolds", value: 8000000 }
    ]
  },
  vehicles: {
    icon: Car,
    items: [
      { name: "Rolls-Royce Phantom", value: 400000 },
      { name: "Private Jet (Gulfstream G650)", value: 70000000 },
      { name: "Luxury Yacht (100ft)", value: 15000000 }
    ]
  },
  investments: {
    icon: TrendingUp,
    items: [
      { name: "S&P 500 Portfolio", value: 750000 },
      { name: "Bitcoin (10 BTC)", value: 350000 },
      { name: "Art Collection (Banksy, Hockney)", value: 5000000 }
    ]
  },
  luxury: {
    icon: Gem,
    items: [
      { name: "Patek Philippe Nautilus", value: 80000 },
      { name: "Diamond Engagement Ring (5 carat)", value: 150000 },
      { name: "Hermès Birkin Bag Collection", value: 200000 }
    ]
  },
  experiences: {
    icon: Plane,
    items: [
      { name: "Space Tourism Ticket", value: 450000 },
      { name: "Private Safari in Africa", value: 75000 },
      { name: "Formula 1 VIP Experience", value: 15000 }
    ]
  }
};

const getFunResponse = (total) => {
  if (total >= 100000000) {
    return {
      title: "🏰 Royalty Status Achieved!",
      message: "You're not just rich, you're 'buy a small country' rich! Even the Queen would be impressed. Time to start practicing your royal wave! 👑",
      tip: "With great wealth comes great responsibility... and amazing tax planning opportunities!"
    };
  } else if (total >= 50000000) {
    return {
      title: "🛩️ Private Jet Lifestyle",
      message: "You've entered the stratosphere of wealth! At this level, you probably have people who have people. Don't forget us little people! ✈️",
      tip: "Pro tip: This level of wealth requires serious financial planning. Our pension calculator suddenly seems quite modest!"
    };
  } else if (total >= 25000000) {
    return {
      title: "🏖️ Island Owner Status",
      message: "Welcome to the 'I own my own island' club! You're so rich, your money has money. Time to start your own currency! 🏝️",
      tip: "Reality check: Even billionaires started with budgeting. Check out our budget calculator for the journey!"
    };
  } else if (total >= 10000000) {
    return {
      title: "🎩 Definitely Not Average",
      message: "You're living like a character from a Jane Austen novel, but with better plumbing! Society parties and fox hunting await! 🦊",
      tip: "Your fantasy lifestyle is enviable! Want to make some of it reality? Start with our compound interest calculator."
    };
  } else if (total >= 5000000) {
    return {
      title: "🍾 Champagne Problems",
      message: "You've got 99 problems, but money ain't one! Your biggest worry is which yacht to take to Monaco. Life is tough! ⛵",
      tip: "Living the dream! But even dreams need planning. Check out our investment calculators to get started."
    };
  } else if (total >= 2000000) {
    return {
      title: "🏡 Fancy Pants Territory",
      message: "You're officially in 'I have arrived' territory! Time to practice saying 'my people will call your people' with a straight face! 🎭",
      tip: "This lifestyle is achievable with smart planning! Our pension calculator shows how compound growth works magic."
    };
  } else if (total >= 1000000) {
    return {
      title: "💎 Millionaire Mindset",
      message: "Welcome to the millionaire's club! You can now afford to be 'eccentric' instead of 'weird'. Embrace your quirkiness! 🎪",
      tip: "Being a millionaire is more achievable than you think! Our savings goal calculator can show you the path."
    };
  } else if (total >= 500000) {
    return {
      title: "🚗 Living Comfortably",
      message: "You're in the 'comfortable' zone! You can afford the good stuff without checking your bank balance first. Living the dream! 😌",
      tip: "This level of wealth is definitely within reach! Start with our budget planner to see how to get there."
    };
  } else {
    return {
      title: "🌱 Everyone Starts Somewhere",
      message: "Hey, we all have to start somewhere! Even Jeff Bezos once worried about student loans. Your empire awaits! 🚀",
      tip: "Turn dreams into plans! Our salary calculator and budget planner are perfect places to start your wealth journey."
    };
  }
};

export default function DreamLifestyleCalculator() {
  const [selectedItems, setSelectedItems] = useState({});
  const [customEntries, setCustomEntries] = useState({});
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const addItem = (category, item) => {
    const key = `${category}_${item.name}`;
    setSelectedItems(prev => ({
      ...prev,
      [key]: { ...item, category, quantity: (prev[key]?.quantity || 0) + 1 }
    }));
  };

  const removeItem = (key) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (newItems[key].quantity > 1) {
        newItems[key] = { ...newItems[key], quantity: newItems[key].quantity - 1 };
      } else {
        delete newItems[key];
      }
      return newItems;
    });
  };

  const addCustomItem = (e, category) => {
    e.preventDefault();
    const name = e.target.name.value;
    const value = e.target.value.value;
    if (!name || !value || value <= 0) return;

    setCustomEntries(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), { name, value: Number(value) }]
    }));
    e.target.reset();
  };

  const removeCustomItem = (category, index) => {
    setCustomEntries(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(selectedItems).forEach(item => {
      total += item.value * item.quantity;
    });
    Object.values(customEntries).forEach(categoryItems => {
      categoryItems.forEach(item => {
        total += item.value;
      });
    });
    return total;
  };

  const isItemSelected = (category, item) => {
    const key = `${category}_${item.name}`;
    return selectedItems[key] ? true : false;
  };

  const handleCalculate = () => {
    const total = calculateTotal();
    const response = getFunResponse(total);
    
    setResults({
      total,
      response,
      itemCount: Object.keys(selectedItems).length + Object.values(customEntries).flat().length
    });
    setHasCalculated(true);

    const csvExportData = [
      ["Category", "Item", "Quantity", "Value"],
      ...Object.values(selectedItems).map(item => [item.category, item.name, item.quantity, item.value * item.quantity]),
      ...Object.entries(customEntries).flatMap(([category, items]) => 
        items.map(item => [category, item.name, 1, item.value])
      ),
      [],
      ["Summary", "Total Dream Value", "", total.toFixed(2)],
    ];
    setCsvData(csvExportData);
  };

  const clearAll = () => {
    setSelectedItems({});
    setCustomEntries({});
    setResults(null);
    setHasCalculated(false);
  };

  return (
    <div className="bg-white">
       <style>{`
        .print-only {
            display: none;
        }
        @media print {
            body {
                background-color: white !important;
            }
            .non-printable {
                display: none !important;
            }
            .printable-area {
                display: block !important;
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
            }
            .printable-grid-cols-1 {
                grid-template-columns: 1fr !important;
            }
            .print-title {
                display: block !important;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 2rem;
            }
            .print-only {
                display: block;
                margin-top: 2rem;
            }
            .print-images {
                display: grid !important;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-top: 1.5rem;
                page-break-before: auto;
            }
            .print-images img {
                width: 100%;
                border-radius: 8px;
                aspect-ratio: 16 / 10;
                object-fit: cover;
            }
        }
      `}</style>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dream Lifestyle Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Go on, live a little in your imagination! Build your fantasy empire and see just how wealthy your dreams really are. 
              <span className="text-purple-600 font-medium"> Warning: May cause excessive daydreaming!</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 printable-grid-cols-1 grid lg:grid-cols-5 gap-8">
        {/* Dream Builder */}
        <div className="lg:col-span-2 space-y-6 non-printable">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Build Your Fantasy Empire</h2>
            <p className="text-gray-600">Click to add pre-defined items or add your own!</p>
          </div>

          {Object.entries(dreamItems).map(([category, data]) => (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 capitalize">
                  <data.icon className="w-6 h-6 text-purple-600" />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {data.items.map((item, index) => (
                    <Button
                      key={index}
                      variant={isItemSelected(category, item) ? "default" : "outline"}
                      onClick={() => addItem(category, item)}
                      className={`h-auto p-4 text-left justify-start transition-all duration-200 ${
                        isItemSelected(category, item) 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
                          : 'hover:bg-purple-50 hover:border-purple-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-sm ${isItemSelected(category, item) ? 'text-purple-100' : 'text-gray-500'}`}>
                          £{item.value.toLocaleString()}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                <div className="border-t my-4"></div>
                <form onSubmit={(e) => addCustomItem(e, category)} className="space-y-3">
                  <h4 className="font-medium">Add a custom item</h4>
                  <div className="grid sm:grid-cols-3 gap-2 items-end">
                    <div className="sm:col-span-2 space-y-1">
                      <Label htmlFor={`${category}-name`} className="text-xs">Item Name</Label>
                      <Input id={`${category}-name`} name="name" placeholder="e.g. My Beach House" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`${category}-value`} className="text-xs">Value (£)</Label>
                      <Input id={`${category}-value`} name="value" type="number" placeholder="1500000" />
                    </div>
                  </div>
                  <Button type="submit" variant="secondary" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Custom {category.slice(0, -1)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dream Summary & Results */}
        <div className="lg:col-span-3 space-y-6 printable-area">
          <div className="print-title hidden">My Dream Lifestyle Vision Board</div>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Your Dream Empire</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(selectedItems).length > 0 || Object.values(customEntries).flat().length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(selectedItems).map(([key, item]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="pr-2">{item.name} {item.quantity > 1 && `(x${item.quantity})`}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span>£{(item.value * item.quantity).toLocaleString()}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(key)}
                          className="h-6 w-6 p-0 text-red-500 non-printable"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                  {Object.entries(customEntries).flatMap(([category, items]) => 
                    items.map((item, index) => (
                      <div key={`${category}-${index}`} className="flex justify-between items-center text-sm">
                        <span className="pr-2">{item.name} <em className="text-xs text-purple-600">(Custom)</em></span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span>£{item.value.toLocaleString()}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeCustomItem(category, index)}
                            className="h-6 w-6 p-0 text-red-500 non-printable"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {hasCalculated && (
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total Dream Value:</span>
                        <span className="text-purple-800">£{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2 non-printable">
                    <Button onClick={handleCalculate} className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Crown className="w-4 h-4 mr-2" />
                      Calculate My Empire!
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      Clear All
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8 non-printable">
                  <Sparkles className="w-12 h-12 mx-auto mb-4" />
                  <p>Start building your dream lifestyle by selecting items above!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {hasCalculated && results && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-center text-orange-800 flex items-center justify-between">
                    {results.response.title}
                    <div className="non-printable">
                      <ExportActions csvData={csvData} fileName="dream-lifestyle" title="My Dream Lifestyle Vision Board" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-900 mb-2">
                      £{results.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-700">
                      Your total fantasy net worth
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-gray-700 mb-3">{results.response.message}</p>
                    <p className="text-sm text-blue-600 font-medium">{results.response.tip}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t non-printable">
                    <h4 className="font-semibold text-gray-800">Ready to turn dreams into reality?</h4>
                    <div className="flex flex-wrap gap-2">
                      <Link to={createPageUrl("SalaryCalculator")}>
                        <Button size="sm" variant="outline">Start with Salary Planning</Button>
                      </Link>
                      <Link to={createPageUrl("BudgetCalculator")}>
                        <Button size="sm" variant="outline">Create a Budget</Button>
                      </Link>
                      <Link to={createPageUrl("CompoundInterestCalculator")}>
                        <Button size="sm" variant="outline">See Investment Growth</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Print Only Enhancements */}
              <div className="print-only">
                <div className="text-center p-6 border-y-2 border-dashed border-gray-300">
                  <p className="text-lg italic text-gray-800">"Imagination is more powerful than knowledge."</p>
                  <p className="text-md font-semibold text-gray-600 mt-1">- Albert Einstein</p>
                </div>
                <div className="print-images">
                    <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800" alt="Luxury modern home" />
                    <img src="https://images.unsplash.com/photo-1599793323219-ce4e708f1b13?q=80&w=800" alt="Yacht on the ocean" />
                    <img src="https://images.unsplash.com/photo-1555215695-300494945849?q=80&w=800" alt="Luxury sports car" />
                    <img src="https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=800" alt="Tropical beach destination" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
