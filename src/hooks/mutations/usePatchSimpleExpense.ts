import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { TransactionsService } from '../../services/TransactionsService';

export function usePatchSimpleExpense({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof TransactionsService.patchSimpleExpense>>,
  Parameters<typeof TransactionsService.patchSimpleExpense>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['PATCH_SIMPLE_EXPENSE_MUTATION', ...mutationKey],
    mutationFn: TransactionsService.patchSimpleExpense,
  });
}
