import dayjs from 'dayjs';
import { startTransition, useOptimistic } from 'react';
import { useSearchParams } from 'react-router';

/**
 * Represents a period with month and year.
 */
export interface Period {
  /** The month (0-11, where 0 = January) */
  month: number;
  /** The year (e.g., 2025) */
  year: number;
}

/**
 * Return value of the usePeriod hook.
 */
interface UsePeriodReturn {
  /** The current period (optimistic) */
  period: Period;
  /** Function to update the period */
  setPeriod: (newPeriod: Period) => void;
}

/**
 * Custom hook to manage the period (month/year) through URL search parameters as the global state.
 *
 * Uses optimistic updates to provide an instant UI experience,
 * even when child components are in suspense.
 *
 * @returns Object containing the current period and function to update it
 *
 * @example
 * ```tsx
 * const { period, setPeriod } = usePeriod();
 *
 * // Display the current period
 * console.log(period.month, period.year); // 0, 2024
 *
 * // Update the period
 * setPeriod({ month: 5, year: 2024 }); // June 2024
 * ```
 */
export function usePeriod(): UsePeriodReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Period extracted from URL or current period if no parameter exists.
   * Reads the 'period' parameter in 'YYYYMM' format (e.g., '202401' = January/2024)
   */
  const period: Period = searchParams.get('p')
    ? {
        month: dayjs(searchParams.get('p'), 'YYYYMM').month(),
        year: dayjs(searchParams.get('p'), 'YYYYMM').year(),
      }
    : {
        month: dayjs().month(),
        year: dayjs().year(),
      };

  /**
   * Optimistic version of the period that is updated instantly,
   * even if components below are in suspense.
   */
  const [optimisticPeriod, setOptimisticPeriod] = useOptimistic(period);

  /**
   * Updates the period optimistically and persists it to the URL.
   *
   * The update occurs in two steps:
   * 1. Updates the UI immediately (optimistic update)
   * 2. Triggers the actual URL change through a transition
   *
   * @param newPeriod - The new period to be set
   */
  const handlePeriodChange = (newPeriod: Period): void => {
    // 1. Update the UI immediately (optimistic)
    // 2. Trigger the actual URL change
    startTransition(() => {
      setOptimisticPeriod(newPeriod);
      setSearchParams({
        p: dayjs().year(newPeriod.year).month(newPeriod.month).format('YYYYMM'),
      });
    });
  };

  return {
    period: optimisticPeriod,
    setPeriod: handlePeriodChange,
  };
}
