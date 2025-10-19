import React, { useMemo, useState, useCallback } from 'react';
import { Calculator, Table, TrendingUp, Download, Printer } from 'lucide-react';

// --- Utility Components (Defined internally to comply with Single-File Mandate) ---
const Card = ({ className = '', children }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children }) => <div className="flex flex-col space-y-1.5 p-6">{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Input = ({ value, onChange, type = 'text', min = 0, step, inputMode, id, ...props }) => {
    const displayValue = String(value).replace(/[^0-9.]/g, '');
    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9.]/g, '');
        onChange({ target: { value: rawValue } });
    };
    return (
        <input
            id={id}
            type="text"
            inputMode={inputMode || 'decimal'}
            pattern="[0-9]*[.]?[0-9]*"
            min={min}
            step={step}
            value={displayValue}
            onChange={handleChange}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 tabular-nums"
            {...props}
        />
    );
};
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
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #d1d5db ${percentage}%, #d1d5db 100%)`,
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
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2';
  let variantClasses = 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md hover:shadow-lg'; // Default

  if (variant === 'outline') {
    variantClasses = 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700';
  } else if (variant === 'ghost') {
    variantClasses = 'hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400';
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};
const MainWrapper = ({ children }) => (
  <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    {children}
  </main>
);

// --- Calculation Logic ---

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const calculateAmortization = (principal, annualRate, years) => {
  const P = principal;
  const i = annualRate / 100 / 12; // Monthly interest rate
  const n = years * 12; // Total number of payments

  if (P <= 0 || n <= 0) {
    return { monthlyPayment: 0, totalInterest: 0, totalPaid: 0, schedule: [] };
  }

  let monthlyPayment = 0;
  if (i > 0) {
    // Standard Amortization Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
    monthlyPayment = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  } else {
    // Zero interest loan
    monthlyPayment = P / n;
  }

  let balance = P;
  let totalInterest = 0;
  let schedule = [];

  for (let paymentNumber = 1; paymentNumber <= n; paymentNumber++) {
    let interestPayment = balance * i;
    let principalPayment = monthlyPayment - interestPayment;

    // Adjust last payment to zero out the loan due to potential rounding errors
    if (paymentNumber === n) {
        principalPayment = balance;
        monthlyPayment = principalPayment + interestPayment;
    }

    balance -= principalPayment;
    totalInterest += interestPayment;

    schedule.push({
      payment: paymentNumber,
      paymentAmount: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }

  const totalPaid = P + totalInterest;

  return {
    monthlyPayment: monthlyPayment,
    totalInterest: totalInterest,
    totalPaid: totalPaid,
    schedule: schedule,
  };
};

// --- Data Handling & Export Functions ---

const exportToCsv = (schedule, inputs, results) => {
    if (schedule.length === 0) return;

    // Define the UTF-8 Byte Order Mark (BOM)
    const BOM = '\ufeff';

    // Helper for formatting currency values for CSV fields (raw number without symbol)
    const csvValue = (value) => value.toFixed(2);

    // Input Parameters
    const inputLines = [
      `Loan Amount (£): ${csvValue(inputs.principal)}`,
      `Annual Interest Rate (%): ${inputs.annualRate}`,
      `Loan Term (Years): ${inputs.years}`,
      `Monthly Payment (£): ${csvValue(results.monthlyPayment)}`,
      `Total Interest Paid (£): ${csvValue(results.totalInterest)}`,
      `Total Paid (£): ${csvValue(results.totalPaid)}`,
    ];

    // Header Row - Use the symbol in the header for clarity
    const headers = [
      'Payment #',
      'Payment Amount (£)',
      'Principal (£)',
      'Interest (£)',
      'Remaining Balance (£)'
    ];

    // Data Rows - Use raw numeric data (formatted to 2 decimal places)
    const dataRows = schedule.map(row => [
      row.payment,
      csvValue(row.paymentAmount),
      csvValue(row.principal),
      csvValue(row.interest),
      csvValue(row.balance),
    ]);

    const allRows = [
      ...inputLines.map(line => [line]),
      [], // Spacer
      headers,
      ...dataRows
    ];

    const csvContent = allRows.map(e => e.join(',')).join('\n');
    const finalContent = BOM + csvContent;

    const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'amortization_schedule.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const printDocument = () => {
    window.print();
};

// --- Main Application Component ---

export default function App() {
  const [inputs, setInputs] = useState({
    principal: 200000,
    annualRate: 4.5,
    years: 25,
  });

  const [scheduleVisible, setScheduleVisible] = useState(false);

  const handleSliderChange = useCallback((name, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: Number(value[0].toFixed(name === 'annualRate' ? 2 : 0)),
    }));
  }, []);

  const handleInputChange = useCallback((name, value) => {
    const numberValue = Number(value);
    setInputs(prev => ({
      ...prev,
      [name]: isNaN(numberValue) ? 0 : numberValue,
    }));
  }, []);

  const { monthlyPayment, totalInterest, totalPaid, schedule } = useMemo(
    () => calculateAmortization(inputs.principal, inputs.annualRate, inputs.years),
    [inputs]
  );

  const resetAll = useCallback(() =>
    setInputs({
      principal: 200000,
      annualRate: 4.5,
      years: 25,
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans antialiased">
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-schedule-table { display: table !important; }
          .print-container { width: 100%; margin: 0; padding: 0; background: white !important; color: black !important; }
          .summary-grid { display: block !important; }
          .summary-item { margin-bottom: 1rem; border: 1px solid #ccc; padding: 10px; border-radius: 8px; }
          .schedule-wrapper { max-height: none !important; overflow: visible !important; }
          .schedule-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .schedule-table th, .schedule-table td { border: 1px solid #ccc; padding: 8px; text-align: right; }
          .schedule-table th:first-child, .schedule-table td:first-child { text-align: left; }
        }
      `}</style>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 via-slate-800 to-blue-700 py-16 text-white shadow-xl no-print">
        <div className="mx-auto max-w-4xl space-y-4 px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Amortization Calculator
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90">
            Determine your monthly loan payments and see the full principal/interest breakdown.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <MainWrapper className="print-container">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN: Inputs */}
          <div className="space-y-6 lg:col-span-1 no-print">
            <Card className="border-blue-300 dark:border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-300">
                  <Calculator className="h-5 w-5" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Principal Input */}
                <div className="space-y-2">
                  <Label htmlFor="principal">Loan Amount (£)</Label>
                  <Input
                    id="principal"
                    min="100"
                    step="1000"
                    value={inputs.principal}
                    onChange={(e) => handleInputChange('principal', e.target.value)}
                  />
                </div>
                {/* Annual Rate Slider */}
                <div className="space-y-4">
                  <Label htmlFor="annualRate">Annual Interest Rate (%)</Label>
                  <Slider
                    id="annualRate"
                    value={[inputs.annualRate]}
                    onValueChange={(value) => handleSliderChange('annualRate', value)}
                    min={0.1}
                    max={15.0}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>0.1%</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-300">
                      {inputs.annualRate.toFixed(2)}%
                    </span>
                    <span>15.0%</span>
                  </div>
                </div>
                {/* Years Slider */}
                <div className="space-y-4">
                  <Label htmlFor="years">Loan Term (Years)</Label>
                  <Slider
                    id="years"
                    value={[inputs.years]}
                    onValueChange={(value) => handleSliderChange('years', value)}
                    min={1}
                    max={30}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>1 year</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-300">
                      {inputs.years} years
                    </span>
                    <span>30 years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetAll}
                >
                    Reset
                </Button>
                <Button
                    Icon={Download}
                    variant="default"
                    className="flex-1"
                    onClick={() => exportToCsv(schedule, inputs, { monthlyPayment, totalInterest, totalPaid })}
                    disabled={schedule.length === 0}
                >
                    Export CSV
                </Button>
                <Button
                    Icon={Printer}
                    variant="outline"
                    className="flex-1"
                    onClick={printDocument}
                >
                    Print Schedule
                </Button>
            </div>
          </div>

          {/* RIGHT COLUMNS: Results and Schedule */}
          <div className="space-y-6 lg:col-span-2">
            {/* Summary Results */}
            <Card className="bg-blue-50 dark:bg-gray-800 border-blue-500 dark:border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <TrendingUp className="h-6 w-6" />
                  Repayment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 summary-grid">
                  <div className="space-y-1 summary-item border-b sm:border-b-0 sm:border-r pb-4 sm:pb-0 dark:border-gray-700 pr-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Payment</p>
                    <p className="text-3xl font-extrabold text-blue-800 dark:text-blue-300 tabular-nums">
                      {currencyFormatter.format(monthlyPayment)}
                    </p>
                  </div>
                  <div className="space-y-1 summary-item border-b sm:border-b-0 sm:border-r pb-4 sm:pb-0 dark:border-gray-700 pr-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Interest Paid</p>
                    <p className="text-3xl font-extrabold text-blue-800 dark:text-blue-300 tabular-nums">
                      {currencyFormatter.format(totalInterest)}
                    </p>
                  </div>
                  <div className="space-y-1 summary-item">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payments</p>
                    <p className="text-3xl font-extrabold text-blue-800 dark:text-blue-300 tabular-nums">
                      {currencyFormatter.format(totalPaid)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amortization Schedule */}
            <Card className="dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                        <Table className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        Amortization Schedule
                    </CardTitle>
                    <Button
                        variant="ghost"
                        onClick={() => setScheduleVisible(!scheduleVisible)}
                        className="no-print"
                    >
                        {scheduleVisible ? 'Hide Table' : 'Show Table'}
                    </Button>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                    <div className={`schedule-wrapper ${scheduleVisible ? 'max-h-[500px]' : 'max-h-0'} overflow-y-auto transition-max-height duration-500 ease-in-out`}>
                        <div className="min-w-full print-schedule-table" style={{ display: scheduleVisible ? 'block' : 'none' }}>
                            <table className="w-full text-right text-sm schedule-table">
                                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 sticky top-0">
                                    <tr>
                                        <th scope="col" className="py-2 px-1 font-bold text-left">Payment</th>
                                        <th scope="col" className="py-2 px-1 font-bold">Payment (£)</th>
                                        <th scope="col" className="py-2 px-1 font-bold">Principal (£)</th>
                                        <th scope="col" className="py-2 px-1 font-bold">Interest (£)</th>
                                        <th scope="col" className="py-2 px-1 font-bold">Balance (£)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {schedule.map((row, index) => (
                                    <tr key={index} className={`border-b dark:border-gray-700 ${index % 12 === 11 ? 'bg-blue-100/50 dark:bg-gray-700/50 font-semibold' : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                        <td className="py-1 px-1 text-left whitespace-nowrap">{row.payment}</td>
                                        <td className="py-1 px-1 tabular-nums">{currencyFormatter.format(row.paymentAmount)}</td>
                                        <td className="py-1 px-1 tabular-nums">{currencyFormatter.format(row.principal)}</td>
                                        <td className="py-1 px-1 tabular-nums text-red-600 dark:text-red-400">{currencyFormatter.format(row.interest)}</td>
                                        <td className="py-1 px-1 tabular-nums text-blue-600 dark:text-blue-400">{currencyFormatter.format(row.balance)}</td>
                                    </tr>
                                ))}
                                {schedule.length === 0 && (
                                    <tr><td colSpan="5" className="text-center italic text-gray-400 py-4">Enter valid loan details to generate the schedule.</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </MainWrapper>
    </div>
  );
}
