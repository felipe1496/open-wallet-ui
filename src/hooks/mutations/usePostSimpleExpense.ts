import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { TransactionsService } from '../../services/TransactionsService';

export function usePostSimpleExpense({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof TransactionsService.postSimpleExpense>>,
  Parameters<typeof TransactionsService.postSimpleExpense>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['POST_SIMPLE_EXPENSE_MUTATION', ...mutationKey],
    mutationFn: TransactionsService.postSimpleExpense,
  });
}
