import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { TransactionsService } from '../../services/TransactionsService';

export function usePatchIncome({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof TransactionsService.patchIncome>>,
  Parameters<typeof TransactionsService.patchIncome>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['PATCH_INCOME_MUTATION', ...mutationKey],
    mutationFn: TransactionsService.patchIncome,
  });
}
