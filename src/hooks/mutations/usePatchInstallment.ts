import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { TransactionsService } from '../../services/TransactionsService';

export function usePatchInstallment({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof TransactionsService.patchInstallment>>,
  Parameters<typeof TransactionsService.patchInstallment>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['PATCH_INSTALLMENT_MUTATION', ...mutationKey],
    mutationFn: TransactionsService.patchInstallment,
  });
}
