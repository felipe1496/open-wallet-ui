import { useMutation } from '@tanstack/react-query';
import type { MutationOpts } from '../../utils/types';
import { CategoriesService } from '../../services/CategoriesService';

export function useDeleteCategory({
  mutationKey = [],
  ...props
}: MutationOpts<
  Awaited<ReturnType<typeof CategoriesService.deleteCategory>>,
  Parameters<typeof CategoriesService.deleteCategory>[0]
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['DELETE_CATEGORY_MUTATION', ...mutationKey],
    mutationFn: CategoriesService.deleteCategory,
  });
}
