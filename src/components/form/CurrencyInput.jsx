import React, { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

const formatNumber = (value, minimumFractionDigits = 0, maximumFractionDigits = 2) => {
  if (value === null || value === undefined || value === '') return '';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '';
  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numeric);
};

const normaliseInput = (rawValue) => {
  if (!rawValue) return '';
  const cleaned = rawValue.replace(/[^\d.,]/g, '').replace(/,/g, '');
  if (!cleaned) return '';
  const [integerPart = '', fractionalPart = ''] = cleaned.split('.');
  const safeInteger = integerPart.replace(/^0+(?=\d)/, '') || '0';
  const safeFraction = fractionalPart.slice(0, 2);
  return safeFraction ? `${safeInteger}.${safeFraction}` : safeInteger;
};

const CurrencyField = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  label,
  helpText,
  placeholder,
  error,
  prefix,
  minimumFractionDigits,
  maximumFractionDigits,
  formatter,
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value === undefined || value === null || value === '') {
      setDisplayValue('');
      return;
    }
    setDisplayValue(formatter.format(Number(value)));
  }, [value, formatter]);

  const handleChange = (event) => {
    const normalised = normaliseInput(event.target.value);
    if (!normalised) {
      setDisplayValue('');
      onChange('');
      return;
    }
    setDisplayValue(formatter.format(Number(normalised)));
    onChange(normalised);
  };

  const handleBlur = (event) => {
    const normalised = normaliseInput(event.target.value);
    const resolvedValue = normalised === '' ? '0' : normalised;
    setDisplayValue(
      resolvedValue
        ? formatNumber(resolvedValue, minimumFractionDigits, maximumFractionDigits)
        : ''
    );
    onChange(resolvedValue);
    onBlur();
  };

  return (
    <div>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
        <input
          ref={inputRef}
          id={id}
          name={name}
          inputMode="decimal"
          className="pl-7 block w-full rounded-md border-gray-400 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {error ? <p className="mt-1 text-sm text-red-600">{error.message}</p> : null}
      {!error && helpText ? <p className="mt-1 text-xs text-gray-500">{helpText}</p> : null}
    </div>
  );
};

const CurrencyInput = ({
  control,
  name,
  label,
  helpText,
  placeholder,
  error,
  prefix = '£',
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
}) => {
  const formatter = useMemo(
    () => new Intl.NumberFormat('en-GB', { minimumFractionDigits, maximumFractionDigits }),
    [minimumFractionDigits, maximumFractionDigits]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <CurrencyField
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          inputRef={ref}
          label={label}
          helpText={helpText}
          placeholder={placeholder}
          error={error}
          prefix={prefix}
          minimumFractionDigits={minimumFractionDigits}
          maximumFractionDigits={maximumFractionDigits}
          formatter={formatter}
        />
      )}
    />
  );
};

export default CurrencyInput;
