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
import AnimatedNumber from '../components/general/AnimatedNumber';

import Heading from '@/components/common/Heading';
// ----------------- Config -----------------
const BASE = 'GBP';

// Limit to the set you support in UI (fast & compact)
const SUPPORTED = ['GBP', 'USD', 'EUR', 'JPY', 'AUD', 'CAD', 'CHF', 'INR', 'NZD'];
const CURRENCIES_PARAM = SUPPORTED.filter((c) => c !== BASE).join(','); // API param (no base)

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const LS_KEY = `fx:${BASE}:${CURRENCIES_PARAM}`;

const ZERO_DEC_CURRENCIES = ['JPY', 'KRW', 'VND'];

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

const currencyFAQs = [
  {
    question: 'How often are these rates updated?',
    answer:
      'The exchange rates on this page are updated once per day. For time-sensitive transactions, always confirm with a real-time provider.',
  },
  {
    question: 'What is an exchange rate?',
    answer:
      'An exchange rate is how much one currency is worth in another. If GBP/USD is 1.25, £1 buys $1.25.',
  },
  {
    question: 'What influences exchange rates?',
    answer:
      'Interest rates, inflation, economic stability, government debt, and trade balances all impact exchange rates.',
  },
  {
    question: "Why might this rate differ from my bank's rate?",
    answer:
      'Banks and FX services usually add a markup to the mid-market rate. Your actual rate will be slightly different.',
  },
];

// ---------- Local cache helpers ----------
function getCached(maxAgeMs) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const { t, data } = JSON.parse(raw);
    if (Date.now() - t < maxAgeMs) return data;
  } catch {}
  return null;
}
function setCached(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ t: Date.now(), data }));
  } catch {}
}

// Parse various date shapes into epoch seconds for display
function toEpochSeconds(d) {
  if (!d) return null;
  if (typeof d === 'number') return Math.floor(d);
  if (typeof d === 'string') {
    const ts = Date.parse(d);
    if (!Number.isNaN(ts)) return Math.floor(ts / 1000);
  }
  return Math.floor(Date.now() / 1000);
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('GBP');
  const [toCurrency, setToCurrency] = useState('USD');
  const [ratesMap, setRatesMap] = useState(null); // { GBP:1, USD:..., ... }
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null); // epoch seconds

  // Pick a sensible default "To" based on locale (runs once)
  useEffect(() => {
    try {
      const loc = navigator.language || Intl.DateTimeFormat().resolvedOptions().locale || '';
      if (loc.includes('en-IN')) setToCurrency('INR');
      else if (loc.includes('ja')) setToCurrency('JPY');
      else if (loc.includes('en-AU')) setToCurrency('AUD');
      else if (loc.includes('en-NZ')) setToCurrency('NZD');
      else if (loc.includes('en-CA')) setToCurrency('CAD');
      else if (
        loc.includes('de') ||
        loc.includes('fr') ||
        loc.includes('es') ||
        loc.includes('it') ||
        loc.includes('nl')
      ) {
        setToCurrency('EUR');
      }
    } catch {}
  }, []);

  // Fetch rates (edge cached 1 day; also cache locally for 1 day)
  useEffect(() => {
    const cached = getCached(ONE_DAY_MS);
    if (cached?.rates) {
      setRatesMap(cached.rates);
      setLastUpdated(toEpochSeconds(cached.date));
      setLoading(false);
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/rates?base=${encodeURIComponent(BASE)}&currencies=${encodeURIComponent(
            CURRENCIES_PARAM
          )}`
        );
        if (!res.ok) throw new Error('api_error');
        const json = await res.json();
        if (!json?.rates || typeof json.rates !== 'object') {
          throw new Error('invalid_response');
        }

        const withBase = { GBP: 1, ...json.rates };
        const normalized = {
          base: json.base || BASE,
          date: json.date || new Date().toISOString(),
          rates: withBase,
          provider: json.provider || 'forexrateapi',
        };

        setRatesMap(normalized.rates);
        setLastUpdated(toEpochSeconds(normalized.date));
        setCached(normalized);
        setError(null);
      } catch (e) {
        if (!cached) setError('Failed to fetch valid currency rates. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const calculateConversion = useCallback(() => {
    if (!ratesMap || !amount) {
      setResult(null);
      return;
    }
    const rateFrom = ratesMap[fromCurrency];
    const rateTo = ratesMap[toCurrency];
    const numericAmount = parseFloat(amount);

    if (rateFrom && rateTo && !Number.isNaN(numericAmount)) {
      // Convert to base (GBP) then to target
      const amountInGbp = numericAmount / rateFrom;
      const convertedAmount = amountInGbp * rateTo;
      setResult(convertedAmount);
    } else {
      setResult(null);
    }
  }, [amount, fromCurrency, toCurrency, ratesMap]);

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const exchangeRate =
    ratesMap && ratesMap[toCurrency] && ratesMap[fromCurrency]
      ? ratesMap[toCurrency] / ratesMap[fromCurrency]
      : 0;

  const fractionDigits = ZERO_DEC_CURRENCIES.includes(toCurrency) ? 0 : 2;

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Live Currency Converter
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Check the latest foreign exchange rates for major currencies against the Pound.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left card: inputs */}
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

              {!loading && !error && ratesMap && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
                      placeholder="e.g. 100"
                    />
                  </div>

                  {/* From/To row - made responsive and full-width to avoid overflow */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-4">
                    <div className="flex-1 space-y-1">
                      <Label>From</Label>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="w-full max-w-full truncate dark:text-gray-50">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">
                          {SUPPORTED.filter((c) => ratesMap[c]).map((curr) => (
                            <SelectItem key={curr} value={curr} className="truncate">
                              {currencyNames[curr] || curr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="sm:self-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSwapCurrencies}
                        className="mt-2 sm:mt-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Swap currencies"
                        aria-label="Swap currencies"
                      >
                        <ArrowRightLeft className="w-5 h-5 text-gray-500" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-1">
                      <Label>To</Label>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="w-full max-w-full truncate dark:text-gray-50">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">
                          {SUPPORTED.filter((c) => ratesMap[c]).map((curr) => (
                            <SelectItem key={curr} value={curr} className="truncate">
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

          {/* Right card: result */}
          {result !== null && (
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      {amount} {fromCurrency} equals
                    </p>
                    <div className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                      <AnimatedNumber
                        value={result}
                        options={{
                          minimumFractionDigits: fractionDigits,
                          maximumFractionDigits: fractionDigits,
                          currency: toCurrency,
                          style: 'currency',
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>

                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  Exchange Rate: 1 {fromCurrency} ={' '}
                  {exchangeRate.toFixed(Math.max(4, fractionDigits))} {toCurrency}
                </p>

                {lastUpdated && (
                  <>
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
                    <p className="text-xs text-gray-500 mt-1">
                      Source: mid-market rates • cached daily at edge and in your browser.
                    </p>
                  </>
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
