import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { CategoriesService } from '../../services/CategoriesService';

export function usePatchCategory({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof CategoriesService.patchCategory>>,
  Parameters<typeof CategoriesService.patchCategory>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['PATCH_CATEGORY_MUTATION', ...mutationKey],
    mutationFn: CategoriesService.patchCategory,
  });
}
