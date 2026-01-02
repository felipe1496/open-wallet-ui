import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { CategoriesService } from '../../services/CategoriesService';

export function usePostCategory({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof CategoriesService.postCategory>>,
  Parameters<typeof CategoriesService.postCategory>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['POST_CATEGORY_MUTATION', ...mutationKey],
    mutationFn: CategoriesService.postCategory,
  });
}
