import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { StateCreator } from 'zustand';
import { create as actualCreate } from 'zustand';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
