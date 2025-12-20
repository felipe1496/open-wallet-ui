import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { TransactionsService } from '../../services/transactions-service';

export function usePostIncome({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof TransactionsService.postIncome>>,
  Parameters<typeof TransactionsService.postIncome>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['POST_INCOME_MUTATION', ...mutationKey],
    mutationFn: TransactionsService.postIncome,
  });
}
