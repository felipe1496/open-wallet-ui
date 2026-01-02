import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { TransactionsService } from '../../services/TransactionsService';

export function usePostInstallment({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof TransactionsService.postInstallment>>,
  Parameters<typeof TransactionsService.postInstallment>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['POST_INSTALLMENT_MUTATION', ...mutationKey],
    mutationFn: TransactionsService.postInstallment,
  });
}
