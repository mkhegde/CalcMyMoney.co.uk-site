import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowRightLeft, Loader2, AlertCircle, TrendingUp, Info } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';
import { getForexRates } from '@/api/functions';
import AnimatedNumber from '../components/general/AnimatedNumber';

const currencyFAQs = [
  {
    question: 'How often are these rates updated?',
    answer:
      'The exchange rates on this page are updated once per day, as provided by our data source on the free plan. For time-sensitive transactions, you should always consult a real-time financial service.',
  },
  {
    question: 'What is an exchange rate?',
    answer:
      'An exchange rate is the value of one currency for the purpose of conversion to another. For example, if the GBP/USD exchange rate is 1.25, it means one British Pound can be exchanged for 1.25 US Dollars.',
  },
  {
    question: 'What influences exchange rates?',
    answer:
      'Exchange rates are affected by a wide range of economic and political factors, including interest rates, inflation, economic stability, government debt, and trade balances. This is why they fluctuate constantly.',
  },
  {
    question: "Why might this rate differ from my bank's rate?",
    answer:
      "The rates shown here are 'mid-market' rates. When you exchange money through a bank or currency service, they typically add a markup or 'spread' to this rate, which is how they make a profit. Your actual rate will likely be slightly different.",
  },
];

// Helper to format currency display
const currencyNames = {
  GBP: 'GBP - British Pound',
  USD: 'USD - United States Dollar',
  EUR: 'EUR - Euro',
  JPY: 'JPY - Japanese Yen',
  AUD: 'AUD - Australian Dollar',
  CAD: 'CAD - Canadian Dollar',
  CHF: 'CHF - Swiss Franc',
  INR: 'INR - Indian Rupee',
  NZD: 'NZD - New Zealand Dollar',
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('GBP');
  const [toCurrency, setToCurrency] = useState('USD');
  const [rates, setRates] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await getForexRates();

        // Handle successful API responses
        if (response.data && response.data.success) {
          const allRates = { ...response.data.rates, GBP: 1 };
          setRates(allRates);
          setLastUpdated(response.data.timestamp);
          setError(null);
          return; // Success, so exit
        }

        // If not successful, determine the error message
        let errorMessage = 'Failed to fetch valid currency rates. Please try again later.'; // A safe default

        if (response.error) {
          // Handle SDK-level errors
          if (typeof response.error.message === 'string') {
            errorMessage = response.error.message;
          } else if (typeof response.error.message === 'object' && response.error.message?.error) {
            // Handle errors returned from the backend function's JSON body
            errorMessage = response.error.message.error;
          }
        } else if (response.data && response.data.error) {
          // Handle API-level errors (e.g., success: false)
          // Fix: Ensure errorMessage is always a string to prevent object rendering errors.
          if (typeof response.data.error === 'string') {
            errorMessage = response.data.error;
          } else if (typeof response.data.error === 'object' && response.data.error !== null) {
            // Attempt to get a 'message' property from the error object, or fall back to stringifying it.
            errorMessage = response.data.error.message || JSON.stringify(response.data.error);
          }
        }

        setError(errorMessage);
      } catch (err) {
        // Handle network errors or other unexpected issues
        console.error('Currency fetch error:', err);
        setError('A client-side error occurred while fetching rates.');
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const calculateConversion = useCallback(() => {
    if (!rates || !amount) {
      setResult(null);
      return;
    }

    const rateFrom = rates[fromCurrency];
    const rateTo = rates[toCurrency];
    const numericAmount = parseFloat(amount);

    if (rateFrom && rateTo && !isNaN(numericAmount)) {
      // Convert amount to base currency (GBP) first, then to target currency
      const amountInGbp = numericAmount / rateFrom;
      const convertedAmount = amountInGbp * rateTo;
      setResult(convertedAmount);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const exchangeRate =
    rates && rates[toCurrency] && rates[fromCurrency] ? rates[toCurrency] / rates[fromCurrency] : 0;

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Live Currency Converter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Check the latest foreign exchange rates for major currencies against the Pound.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Convert Currency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600 dark:text-gray-300">
                    Fetching latest rates...
                  </span>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!loading && !error && rates && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
                      placeholder="e.g. 100"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <Label>From</Label>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="dark:text-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">
                          {Object.keys(rates).map((curr) => (
                            <SelectItem key={curr} value={curr}>
                              {currencyNames[curr] || curr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSwapCurrencies}
                      className="mt-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowRightLeft className="w-5 h-5 text-gray-500" />
                    </Button>
                    <div className="flex-1 space-y-1">
                      <Label>To</Label>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="dark:text-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">
                          {Object.keys(rates).map((curr) => (
                            <SelectItem key={curr} value={curr}>
                              {currencyNames[curr] || curr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {result !== null && (
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      {amount} {fromCurrency} equals
                    </p>
                    <div className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                      <AnimatedNumber
                        value={result}
                        options={{
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          currency: toCurrency,
                          style: 'currency',
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  Exchange Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </p>
                {lastUpdated && (
                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <Info className="w-3.5 h-3.5" />
                    <span>
                      Rates last updated:{' '}
                      {new Date(lastUpdated * 1000).toLocaleString('en-GB', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12">
          <FAQSection faqs={currencyFAQs} />
        </div>
      </div>
    </div>
  );
}
