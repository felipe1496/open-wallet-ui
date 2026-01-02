import { CategoriesService } from '../services/CategoriesService';
import type { QueryOpts } from '../utils/types';

export const categoriesKeys = {
  all: () => ['categories'] as const,
  getCategories: (queryOpts?: QueryOpts) => [...categoriesKeys.all(), { queryOpts }] as const,
  getCategoriesPerPeriod: (period: string, queryOpts?: QueryOpts) =>
    [...categoriesKeys.all(), 'PER_PERIOD', { period }, { queryOpts }] as const,
};

export function getCategoriesQueryOpts(queryOpts?: QueryOpts) {
  return {
    queryKey: categoriesKeys.getCategories(queryOpts),
    queryFn: () => CategoriesService.getCategories(queryOpts),
  };
}

export function getCategoriesPerPeriodQueryOpts(period: string, queryOpts?: QueryOpts) {
  return {
    queryKey: categoriesKeys.getCategoriesPerPeriod(period, queryOpts),
    queryFn: () => CategoriesService.getCategoriesPerPeriod(period),
  };
}
