import { TransactionsService } from '../services/TransactionsService';
import type { QueryOpts } from '../utils/types';

export const entriesKeys = {
  all: () => ['entries'] as const,
  getEntries: (period: string, queryOpts?: QueryOpts) =>
    [...entriesKeys.all(), { period }, { queryOpts }] as const,
};

export function getEntriesQueryOpts(period: string, queryOpts?: QueryOpts) {
  return {
    queryKey: [...entriesKeys.getEntries(period), queryOpts],
    queryFn: () => TransactionsService.getEntries(period, queryOpts),
  };
}
