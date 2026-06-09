import { useState, type FC } from 'react';
import { AsyncSelect, type Option } from './commons/select/AsyncSelect';
import { useQuery } from '@tanstack/react-query';
import {
  categoriesKeys,
  getCategoriesQueryOpts,
  type Category,
} from '../queries/categories-queries';
import { useDebounce } from '../hooks/useDebounce';
import { SaveCategoryDialog } from '../pages/categories/components/SaveCategoryDialog';
import { usePostCategory } from '../hooks/mutations/usePostCategory';
import { useAPI } from '../hooks/useAPI';
import { useTranslation } from 'react-i18next';

interface Props {
  selected?: Option<Category> | null;
  onChange?: (value: Option<Category> | null) => void;
  isCreatable?: boolean;
}

export const AsyncSelectCategory: FC<Props> = ({
  selected = null,
  onChange = () => {},
  isCreatable,
}) => {
  const [search, setSearch] = useState<string>('');
  const [creatingName, setCreatingName] = useState<string>('');
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);
  const api = useAPI();
  const { t } = useTranslation();

  const debouncedSearch = useDebounce(search, 500);

  const { data, isFetching } = useQuery({
    ...getCategoriesQueryOpts(api, {
      name: debouncedSearch,
    }),
    select: (data) =>
      data.data?.categories?.map((category) => ({
        id: category.id!,
        value: category as Category,
        label: category.name!,
      })) || [],
  });

  const { mutateAsync: postCategory, isPending } = usePostCategory({
    meta: {
      successNotification: t('notifications.categories.created'),
      errorNotification: t('notifications.categories.createError'),
      invalidateQuery: [categoriesKeys.all()],
    },
  });

  return (
    <>
      <AsyncSelect
        options={data ?? []}
        isLoading={isFetching}
        search={search}
        selected={selected}
        onSelectedChange={onChange}
        onSearchChange={setSearch}
        placeholder={t('common.select.categoryPlaceholder')}
        onCreate={
          isCreatable
            ? (name) => {
                setCreatingName(name);
                setAddCategoryVisible(true);
              }
            : undefined
        }
      />
      {isCreatable && addCategoryVisible && (
        <SaveCategoryDialog
          isVisible={addCategoryVisible}
          onSave={(data, { reset }) => {
            postCategory(
              {
                name: data.name,
                color: data.color,
              },
              {
                onSuccess: (result) => {
                  const category = result?.data?.category;
                  if (!category) return;

                  const option = {
                    id: category.id!,
                    value: category as Category,
                    label: category.name!,
                  };

                  onChange(option);
                  setAddCategoryVisible(false);
                  reset();
                },
              },
            );
          }}
          onVisibleChange={() => {
            setCreatingName('');
            setAddCategoryVisible(false);
          }}
          defaultValues={{ name: creatingName, color: '' }}
          isLoading={isPending}
        />
      )}
    </>
  );
};
