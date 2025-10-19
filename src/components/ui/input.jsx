import * as React from 'react';

import { cn } from '@/lib/utils';

const formatWithGrouping = (value) => {
  if (value === null || value === undefined) return value;
  const stringValue = String(value);
  if (stringValue === '') return '';

  const hasTrailingDecimal = stringValue.endsWith('.');
  let working = stringValue.replace(/,/g, '');
  const sign = working.startsWith('-') ? '-' : '';
  if (sign) working = working.slice(1);

  const [integerPartRaw, decimalPartRaw] = working.split('.');
  if (!/^\d*$/.test(integerPartRaw)) {
    return stringValue;
  }

  const integerGrouped = integerPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = decimalPartRaw !== undefined ? decimalPartRaw : undefined;

  if (decimalPart !== undefined) {
    if (decimalPart === '' && hasTrailingDecimal) {
      return `${sign}${integerGrouped}.`;
    }
    return `${sign}${integerGrouped}.${decimalPart}`;
  }

  return `${sign}${integerGrouped}`;
};

const Input = React.forwardRef(
  ({ className, type, value, onChange, inputMode, groupDigits, ...props }, ref) => {
    const shouldGroupDigits = React.useMemo(() => {
      if (typeof groupDigits === 'boolean') return groupDigits;
      const mode = inputMode || type;
      return mode === 'decimal' || mode === 'numeric' || mode === 'number';
    }, [groupDigits, inputMode, type]);

    const displayValue = React.useMemo(() => {
      if (!shouldGroupDigits || value === undefined || value === null) return value;
      if (value === '') return '';
      return formatWithGrouping(value);
    }, [shouldGroupDigits, value]);

    const handleChange = React.useCallback(
      (event) => {
        if (!shouldGroupDigits || !onChange) {
          onChange?.(event);
          return;
        }

        const rawValue = event.target.value.replace(/,/g, '');

        onChange({
          ...event,
          target: {
            ...event.target,
            value: rawValue,
          },
        });
      },
      [shouldGroupDigits, onChange]
    );

    return (
      <input
        type={type}
        inputMode={inputMode}
        value={displayValue}
        onChange={handleChange}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
