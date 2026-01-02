import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { TransactionsService } from '../../services/TransactionsService';

export function useDeleteTransaction({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof TransactionsService.deleteTransaction>>,
  Parameters<typeof TransactionsService.deleteTransaction>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['DELETE_TRANSACTION_MUTATION', ...mutationKey],
    mutationFn: TransactionsService.deleteTransaction,
  });
}
