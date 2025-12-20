import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { StateCreator } from 'zustand';
import { create as actualCreate } from 'zustand';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeNumericOnInput(
  value: string,
  decimalPrecision?: number,
  min?: number,
  max?: number,
) {
  let newValue = String(value);

  newValue = newValue.replace(/[^0-9.,-]/g, '');

  if (decimalPrecision === 0) {
    newValue = newValue.replace(/[.,]/g, '');
  } else {
    newValue = newValue.replace(/(\..*)\./g, '$1');

    newValue = newValue.replace(/(,.*),/g, '$1');
  }

  if (min !== undefined && min >= 0) {
    newValue = newValue.replace(/-/g, '');
  } else {
    newValue = newValue.replace(/(?!^)-/g, '');
  }

  if (max !== undefined && max < 0) {
    newValue = '-' + newValue.replace(/-/g, '');
  } else if (min === undefined || min < 0) {
    newValue = newValue.replace(/(?!^)-/g, '');
  }

  return newValue;
}

export function sanitizeNumericOnBlur(
  value: string,
  decimalPrecision?: number,
  min?: number,
  max?: number,
) {
  let newValue = String(value);
  newValue = newValue.trim();

  if (
    newValue === '-' ||
    newValue === '.' ||
    newValue === ',' ||
    newValue === '-.' ||
    newValue === '-,'
  ) {
    newValue = '';
  }

  newValue = newValue.replace(',', '.');

  newValue = newValue.replace(/\.$/, '');

  if (/^-?\d+\./.test(newValue) === false) {
    newValue = newValue.replace(/^(-?)0+(\d)/, '$1$2');
  }

  if (decimalPrecision != null && decimalPrecision >= 0) {
    const [int, dec] = newValue.split('.');
    if (dec && dec.length > decimalPrecision) {
      newValue = int + '.' + dec.slice(0, decimalPrecision);
    }
  }

  const numeric = Number(newValue);

  if (!isNaN(numeric)) {
    if (Object.is(numeric, -0) || (numeric === 0 && /^-/.test(newValue))) {
      newValue = '0';
    }

    if (min != null && numeric < min) newValue = String(min);
    if (max != null && numeric > max) newValue = String(max);
  }

  return newValue;
}

export function env() {
  return {
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    GOOGLE_AUTH_REDIRECT_URI: import.meta.env.VITE_GOOGLE_AUTH_REDIRECT_URI,
    API_URL: import.meta.env.VITE_API_URL,
  };
}

const storeResetFns = new Set<() => void>();

export function resetAllStores() {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
}

export const createStore = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    storeResetFns.add(() => {
      store.setState(store.getInitialState(), true);
    });
    return store;
  };
}) as typeof actualCreate;

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseUSD(value: string) {
  return Number(value.replace(/,/g, ''));
}
