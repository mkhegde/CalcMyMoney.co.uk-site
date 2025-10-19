import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Calculator, TrendingUp, Layers3, ChevronDown, ChevronUp, BarChart3, Download, Printer } from 'lucide-react';

// --- Utility Components (Defined internally to comply with Single-File Mandate) ---

// Replicating basic shadcn/ui/Card structure using Tailwind
const Card = ({ className = '', children }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="flex flex-col space-y-1.5 p-6">{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

// Replicating basic shadcn/ui/Input structure
const Input = ({ value, onChange, type = 'text', min = 0, step, inputMode, id, ...props }) => {
    // Ensure value is correctly formatted for display and handling (no unexpected scientific notation)
    const displayValue = String(value).replace(/[^0-9.]/g, '');

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9.]/g, '');
        onChange({ target: { value: rawValue } });
    };

    return (
        <input
            id={id}
            type="text" // Use text for better control over input, relying on inputMode and pattern for hints
            inputMode={inputMode || 'decimal'}
            pattern="[0-9]*[.]?[0-9]*"
            min={min}
            step={step}
            value={displayValue}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-emerald-400 tabular-nums"
            {...props}
        />
    );
};

// Simplified Slider component
const Slider = ({ value, onValueChange, min, max, step, id, className = '' }) => {
  const displayValue = Array.isArray(value) ? value[0] : value;
  const percentage = ((displayValue - min) / (max - min)) * 100;

  return (
    <div className={`relative flex w-full items-center ${className}`}>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={(e) => onValueChange([Number(e.target.value)])}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
        style={{
          background: `linear-gradient(to right, #059669 0%, #059669 ${percentage}%, #d1d5db ${percentage}%, #d1d5db 100%)`,
        }}
      />
    </div>
  );
};

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300">
    {children}
  </label>
);

const Button = ({ children, onClick, variant = 'default', className = '', Icon, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2';

  let variantClasses = 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-md hover:shadow-lg'; // Default

  if (variant === 'outline') {
    variantClasses = 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700';
  } else if (variant === 'ghost') {
    variantClasses = 'hover:bg-gray-100 dark:hover:bg-gray-800 text-emerald-600 dark:text-emerald-400';
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

// Simple Calculator Wrapper for responsive padding (Replaces external CalculatorWrapper)
const MainWrapper = ({ children }) => (
  <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    {children}
  </main>
);

// Simple Accordion for FAQ
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900 dark:text-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-emerald-600" /> : <ChevronDown className="h-5 w-5 text-emerald-600" />}
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 dark:text-gray-400 transition-all duration-300">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection = ({ faqs }) => (
  <div className="space-y-2">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Common Questions</h2>
    {faqs.map((faq, index) => (
      <FAQItem key={index} question={faq.question} answer={faq.answer} />
    ))}
  </div>
);

// --- Calculation Logic ---

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const compoundFaqs = [
  {
    question: 'How often should I compound?',
    answer:
      'Banks typically compound monthly or daily. Select the frequency that matches your account to ensure the calculator mirrors real-world growth.',
  },
  {
    question: 'Can I add annual increases to contributions?',
    answer:
      'Yes. Enter a yearly contribution growth rate. This shows how increasing contributions accelerates savings, keeping pace with inflation or salary raises.',
  },
  {
    question: 'Why does daily compounding yield more?',
    answer:
      'Daily compounding means interest starts earning interest faster than monthly or annual compounding, leading to slightly higher returns over long periods.',
  },
];

const monthsPerCompounding = (periodsPerYear) => {
  // Calculates what fraction of 12 monthly contributions is added per compounding period.
  return 12 / periodsPerYear;
};


const generateProjection = ({
  initialDeposit,
  monthlyContribution,
  contributionAnnualGrowth,
  annualRate,
  compoundingFrequency,
  years,
}) => {
  const periodsPerYear = Math.max(compoundingFrequency, 1);
  const totalPeriods = Math.max(Math.round(years * periodsPerYear), 0);
  const periodicRate = Math.max(annualRate, 0) / 100 / periodsPerYear;
  const contributionGrowth = Math.max(contributionAnnualGrowth, 0) / 100;
  const monthlyContributionValue = Math.max(monthlyContribution, 0);

  let balance = Math.max(initialDeposit, 0);
  let totalContributions = balance;
  const projection = [];

  for (let period = 1; period <= totalPeriods; period += 1) {
    const isStartOfCompoundingPeriod = period % periodsPerYear === 1 || period === 1;

    // Determine the year index (0-based) for contribution growth calculation
    const currentYearIndex = Math.floor((period - 1) / periodsPerYear);

    // Contribution amount for the current period, adjusted for annual growth
    const contributionFactor = (1 + contributionGrowth) ** currentYearIndex;
    const periodicContribution =
      monthsPerCompounding(periodsPerYear) * monthlyContributionValue * contributionFactor;


    // 1. Add Contribution
    balance += periodicContribution;
    totalContributions += periodicContribution;

    // 2. Apply Interest
    if (periodicRate > 0) {
      balance *= 1 + periodicRate;
    }

    // 3. Record Projection (End of Year)
    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear;
      projection.push({
        year,
        balance: Math.round(balance),
        contribution: Math.round(totalContributions),
        interest: Math.round(balance - totalContributions),
      });
    }
  }

  const interestEarned = Math.max(Math.round(balance - totalContributions), 0);
  return {
    balance: Math.round(balance),
    totalContributions: Math.round(totalContributions),
    interestEarned,
    projection,
  };
};

// --- Custom Chart Component (SVG based) ---

const CompoundChart = ({ data, years, currencyFormatter }) => {
  const chartWidth = 600;
  const chartHeight = 300;
  const margin = { top: 20, right: 30, bottom: 40, left: 70 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No projection data available. Please enter your investment details.
      </div>
    );
  }

  const maxBalance = Math.max(...data.map(d => d.balance));
  const maxYear = years;

  // Scaling functions (Linear interpolation)
  const scaleY = (value) => innerHeight - (value / maxBalance) * innerHeight;
  const scaleX = (year) => (year / maxYear) * innerWidth;

  // Line path generator (Balance)
  const balancePath = data.map((d, i) => {
    const x = scaleX(d.year);
    const y = scaleY(d.balance);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  // Line path generator (Contribution)
  const contributionPath = data.map((d, i) => {
    const x = scaleX(d.year);
    const y = scaleY(d.contribution);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  // Y-Axis ticks
  const numYTicks = 5;
  const yTicks = Array.from({ length: numYTicks + 1 }).map((_, i) => {
    const value = (i * maxBalance) / numYTicks;
    const y = scaleY(value);
    return { y, label: currencyFormatter.format(value) };
  });

  // X-Axis ticks
  const numXTicks = Math.min(maxYear, 10);
  const xTicks = Array.from({ length: numXTicks + 1 }).map((_, i) => {
    const year = Math.round((i * maxYear) / numXTicks);
    const x = scaleX(year);
    return { x, label: year };
  }).filter(tick => tick.year > 0);

  return (
    <div className="relative overflow-x-auto overflow-y-hidden">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" role="img" aria-label="Compound Interest Projection Chart">
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Y-Axis Grid Lines */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line x1={0} y1={tick.y} x2={innerWidth} y2={tick.y} stroke="#e5e7eb" strokeDasharray="3 3" className="dark:stroke-gray-700" />
                <text x={-5} y={tick.y + 5} textAnchor="end" fontSize="10" fill="#6b7280" className="dark:fill-gray-400 tabular-nums">
                  {tick.label}
                </text>
              </g>
            ))}

            {/* X-Axis Labels */}
            {xTicks.map((tick, i) => (
              <text key={i} x={tick.x} y={innerHeight + 20} textAnchor="middle" fontSize="10" fill="#6b7280" className="dark:fill-gray-400">
                {tick.label}
              </text>
            ))}
             <text x={innerWidth / 2} y={innerHeight + 35} textAnchor="middle" fontSize="11" fill="#4b5563" className="dark:fill-gray-300 font-medium">
                Years
            </text>

            {/* Data Lines */}
            <path d={balancePath} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d={contributionPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Legend */}
            <g transform={`translate(${innerWidth - 150}, ${-5})`}>
              <rect width="10" height="10" fill="#059669" rx="2" />
              <text x="15" y="9" fontSize="10" fill="#4b5563" className="dark:fill-gray-300">Total Balance</text>

              <rect x="0" y="15" width="10" height="10" fill="#3b82f6" rx="2" />
              <text x="15" y="24" fontSize="10" fill="#4b5563" className="dark:fill-gray-300">Total Contributions</text>
            </g>
          </g>
        </svg>
    </div>
  );
};


// --- Data Handling & Export Functions ---

const exportToCsv = (data, inputs) => {
    if (data.length === 0) return;

    // Header Row
    const headers = [
      'Year',
      'Total Balance (£)',
      'Total Contribution (£)',
      'Interest Earned (£)'
    ];

    // Input Parameters
    const inputLines = [
      `Initial Deposit: £${inputs.initialDeposit}`,
      `Monthly Contribution: £${inputs.monthlyContribution}`,
      `Annual Growth Rate: ${inputs.contributionAnnualGrowth}%`,
      `Annual Interest Rate: ${inputs.annualRate}%`,
      `Compounding Frequency: ${inputs.compoundingFrequency}`,
      `Years Invested: ${inputs.years}`
    ];

    // Data Rows
    const dataRows = data.map(row => [
      row.year,
      row.balance,
      row.contribution,
      row.interest,
    ]);

    const allRows = [
      ...inputLines.map(line => [line]),
      [], // Spacer
      headers,
      ...dataRows
    ];

    const csvContent = allRows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'compound_interest_projection.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const printDocument = () => {
    // Uses the browser's native print dialog
    window.print();
};

// --- Main Application Component ---

export default function App() {
  const [inputs, setInputs] = useState({
    initialDeposit: 7500,
    monthlyContribution: 350,
    contributionAnnualGrowth: 3,
    annualRate: 6,
    compoundingFrequency: 12,
    years: 15,
  });

  const handleInputChange = useCallback((name, value) => {
    const numberValue = Number(value);
    setInputs(prev => ({
      ...prev,
      [name]: isNaN(numberValue) ? 0 : numberValue,
    }));
  }, []);

  const handleSliderChange = useCallback((name, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: Number(value[0].toFixed(name === 'annualRate' ? 1 : 0)), // Precision for rates
    }));
  }, []);

  const results = useMemo(
    () =>
      generateProjection({
        initialDeposit: inputs.initialDeposit,
        monthlyContribution: inputs.monthlyContribution,
        contributionAnnualGrowth: inputs.contributionAnnualGrowth,
        annualRate: inputs.annualRate,
        compoundingFrequency: inputs.compoundingFrequency,
        years: inputs.years,
      }),
    [inputs]
  );

  const resetAll = useCallback(() =>
    setInputs({
      initialDeposit: 7500,
      monthlyContribution: 350,
      contributionAnnualGrowth: 3,
      annualRate: 6,
      compoundingFrequency: 12,
      years: 15,
    }),
    []
  );

  // Helper function for slider labels
  const getRateLabel = (value, unit = '%') => value.toFixed(1) + unit;
  const getYearLabel = (value) => `${value} year${value !== 1 ? 's' : ''}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans antialiased">

      {/* Styles for Print/PDF - Hidden on screen, active on print */}
      <style>{`
        @media print {
          body > #root > div > :not(.print-container) { display: none; }
          .print-container {
            width: 100%;
            margin: 0;
            padding: 0;
            background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
          .compound-quote { font-style: italic; margin-top: 1rem; }
          .summary-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          .summary-table th, .summary-table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .summary-table tr:nth-child(even) { background-color: #f2f2f2; }
          .chart-title { font-weight: bold; margin-bottom: 10px; }
          svg text { fill: black !important; }
          .dark\\:fill-gray-400 { fill: black !important; }
          .dark\\:stroke-gray-700 { stroke: #ccc !important; }
        }
      `}</style>

      {/* Responsive Header Section */}
      <section className="bg-gradient-to-r from-emerald-700 via-slate-800 to-emerald-700 py-16 text-white shadow-xl no-print">
        <div className="mx-auto max-w-4xl space-y-4 px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Compound Interest Calculator
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/90">
            Visualise how deposits, contributions, and compounding frequency accelerate investment and savings growth.
          </p>
        </div>
      </section>

      {/* Main Calculator Body - Fully Responsive Grid */}
      <MainWrapper className="print-container">
        {/* Emotional Hook */}
        <div className="mx-auto max-w-4xl text-center mb-10 p-4 border-b border-emerald-200 dark:border-emerald-700 compound-quote no-print">
            <blockquote className="italic text-lg text-gray-700 dark:text-gray-300">
                “Compound interest is the **eighth wonder of the world**. He who understands it, earns it... he who doesn't, pays it.”
            </blockquote>
            <cite className="block mt-2 text-sm text-gray-500 dark:text-gray-400">— Attributed to Albert Einstein</cite>
        </div>


        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* LEFT COLUMN: Inputs */}
          <div className="space-y-6 no-print">
            <Card className="border-emerald-300 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                  <Calculator className="h-5 w-5" />
                  Contribution Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Initial Deposit Input */}
                <div className="space-y-2">
                  <Label htmlFor="initialDeposit">Initial deposit (£)</Label>
                  <Input
                    id="initialDeposit"
                    min="0"
                    step="100"
                    value={inputs.initialDeposit}
                    onChange={(e) => handleInputChange('initialDeposit', e.target.value)}
                  />
                </div>
                {/* Monthly Contribution Input */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Monthly contribution (£)</Label>
                  <Input
                    id="monthlyContribution"
                    min="0"
                    step="10"
                    value={inputs.monthlyContribution}
                    onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
                  />
                </div>
                {/* Contribution Growth Slider */}
                <div className="space-y-4">
                  <Label htmlFor="contributionAnnualGrowth">Contribution increase per year (%)</Label>
                  <Slider
                    id="contributionAnnualGrowth"
                    value={[inputs.contributionAnnualGrowth]}
                    onValueChange={(value) => handleSliderChange('contributionAnnualGrowth', value)}
                    min={0}
                    max={15}
                    step={0.5}
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                      {getRateLabel(inputs.contributionAnnualGrowth)}
                    </span>
                    <span>15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-300 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                  <Layers3 className="h-5 w-5" />
                  Growth Assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Annual Rate Slider */}
                <div className="space-y-4">
                  <Label htmlFor="annualRate">Annual interest rate (%)</Label>
                  <Slider
                    id="annualRate"
                    value={[inputs.annualRate]}
                    onValueChange={(value) => handleSliderChange('annualRate', value)}
                    min={0}
                    max={15}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                      {getRateLabel(inputs.annualRate)}
                    </span>
                    <span>15%</span>
                  </div>
                </div>
                {/* Compounding Frequency Select */}
                <div className="space-y-2">
                  <Label htmlFor="compoundingFrequency">Compounding frequency</Label>
                  <select
                    id="compoundingFrequency"
                    className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium text-gray-700 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                    value={inputs.compoundingFrequency}
                    onChange={(event) =>
                      handleInputChange('compoundingFrequency', event.target.value)
                    }
                  >
                    <option value={1}>Annually (1x per year)</option>
                    <option value={2}>Semi-annually (2x per year)</option>
                    <option value={4}>Quarterly (4x per year)</option>
                    <option value={12}>Monthly (12x per year)</option>
                    <option value={52}>Weekly (52x per year)</option>
                    <option value={365}>Daily (365x per year)</option>
                  </select>
                </div>
                {/* Years Invested Slider */}
                <div className="space-y-4">
                  <Label htmlFor="years">Years invested</Label>
                  <Slider
                    id="years"
                    value={[inputs.years]}
                    onValueChange={(value) => handleSliderChange('years', value)}
                    min={1}
                    max={40}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>1</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                      {getYearLabel(inputs.years)}
                    </span>
                    <span>40</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="outline"
                    className="flex-1 transition duration-150 ease-in-out hover:shadow-lg dark:hover:bg-gray-800"
                    onClick={resetAll}
                >
                    Reset calculator
                </Button>
                <Button
                    Icon={Download}
                    variant="default"
                    className="flex-1"
                    onClick={() => exportToCsv(results.projection, inputs)}
                    disabled={results.projection.length === 0}
                >
                    Export CSV
                </Button>
                <Button
                    Icon={Printer}
                    variant="outline"
                    className="flex-1"
                    onClick={printDocument}
                >
                    Print / Save PDF
                </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Results, Chart, and Insights */}
          <div className="space-y-8">
            {/* Growth Summary */}
            <Card className="bg-emerald-50 dark:bg-gray-800 border-emerald-500 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <TrendingUp className="h-6 w-6" />
                  Final Projected Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-4xl font-extrabold text-emerald-800 dark:text-emerald-300 tabular-nums">
                    {currencyFormatter.format(results.balance)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Projected total balance after {inputs.years} years.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-emerald-200 dark:border-gray-700">
                  <div className="flex justify-between text-base font-medium text-gray-700 dark:text-gray-300">
                    <span>Total contributed</span>
                    <span className="tabular-nums">{currencyFormatter.format(results.totalContributions)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-emerald-700 dark:text-emerald-400">
                    <span>Interest earned</span>
                    <span className="tabular-nums">{currencyFormatter.format(results.interestEarned)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart */}
            <Card className="dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                    Growth Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <CompoundChart
                    data={results.projection}
                    years={inputs.years}
                    currencyFormatter={currencyFormatter}
                />
              </CardContent>
            </Card>

            {/* Yearly Projection Table (for print and screen) */}
            <Card className="dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Yearly Projection ({results.projection.length} years)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-300 max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm summary-table">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="py-2 px-1 font-bold">Year</th>
                            <th scope="col" className="py-2 px-1 font-bold text-right">Balance</th>
                            <th scope="col" className="py-2 px-1 font-bold text-right">Contributed</th>
                            <th scope="col" className="py-2 px-1 font-bold text-right">Interest</th>
                        </tr>
                    </thead>
                    <tbody>
                    {results.projection.map((row) => (
                        <tr key={row.year} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-1 px-1 font-medium text-gray-900 dark:text-white whitespace-nowrap">{row.year}</td>
                            <td className="py-1 px-1 text-right tabular-nums">{currencyFormatter.format(row.balance)}</td>
                            <td className="py-1 px-1 text-right tabular-nums">{currencyFormatter.format(row.contribution)}</td>
                            <td className="py-1 px-1 text-right tabular-nums">{currencyFormatter.format(row.interest)}</td>
                        </tr>
                    ))}
                    {results.projection.length === 0 && (
                        <tr><td colSpan="4" className="text-center italic text-gray-400 py-4">Enter positive values to see the projection.</td></tr>
                    )}
                    </tbody>
                </table>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-6 no-print">
              <FAQSection faqs={compoundFaqs} />
            </Card>
          </div>
        </div>
      </MainWrapper>
    </div>
  );
}
