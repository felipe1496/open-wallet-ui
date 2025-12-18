import { TransactionsService } from '../services/transactions-service';
import type { QueryOpts } from '../utils/types';

export const entriesKeys = {
  all: () => ['entries'],
  getEntries: (period: string, queryOpts?: QueryOpts) => [
    ...entriesKeys.all(),
    { period },
    { queryOpts },
  ],
};

export function getEntriesQueryOpts(period: string, queryOpts?: QueryOpts) {
  return {
    queryKey: [...entriesKeys.getEntries(period), queryOpts],
    queryFn: () => TransactionsService.getEntries(period, queryOpts),
  };
}
