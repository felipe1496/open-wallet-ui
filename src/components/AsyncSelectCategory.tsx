import { useState, type FC } from 'react';
import { AsyncSelect, type Option } from './commons/select/AsyncSelect';
import { useQuery } from '@tanstack/react-query';
import { getCategoriesQueryOpts } from '../queries/categories-queries';
import type { CategoriesService } from '../services/CategoriesService';
import { useDebounce } from '../hooks/useDebounce';

interface Props {
  selected?: Option<
    Awaited<ReturnType<typeof CategoriesService.getCategories>>['data']['categories'][number]
  > | null;
  onChange?: (
    value: Option<
      Awaited<ReturnType<typeof CategoriesService.getCategories>>['data']['categories'][number]
    > | null,
  ) => void;
}

export const AsyncSelectCategory: FC<Props> = ({ selected = null, onChange }) => {
  const [search, setSearch] = useState<string>('');

  const debouncedSearch = useDebounce(search, 500);

  const { data, isFetching } = useQuery({
    ...getCategoriesQueryOpts({
      name: debouncedSearch,
    }),
    select: (data) =>
      data.data.categories.map((category) => ({
        id: category.id,
        value: category,
        label: category.name,
      })),
  });

  return (
    <AsyncSelect
      options={data ?? []}
      isLoading={isFetching}
      search={search}
      selected={selected}
      onSelectedChange={onChange}
      onSearchChange={setSearch}
      placeholder="Select a category..."
    />
  );
};
