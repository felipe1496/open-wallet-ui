import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { categoriesKeys } from '../../../queries/categories-queries';
import { Card } from '../../../components/commons/Card';
import { Button } from '../../../components/commons/Button';
import { SquarePenIcon, TrashIcon } from 'lucide-react';
import { useDeleteCategory } from '../../../hooks/mutations/useDeleteCategory';
import { useConfirm } from '../../../hooks/useConfirm';
import { SaveCategoryDialog } from './SaveCategoryDialog';
import { usePatchCategory } from '../../../hooks/mutations/usePatchCategory';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { transactionsKeys } from '../../../queries/transactions-queries';
import { useAPI } from '../../../hooks/useAPI';
import { Spinner } from '../../../components/commons/loader/Spinner';
import { useTranslation } from 'react-i18next';

export const CategoriesList = () => {
  const api = useAPI();
  const { t } = useTranslation();
  const {
    data: categoriesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: [...categoriesKeys.all(), api],
    queryFn: ({ pageParam }) =>
      api.categories
        .v1ListCategories({
          per_page: 25,
          page: pageParam as number,
          order_by: 'created_at',
        } as Parameters<typeof api.categories.v1ListCategories>[0])
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.query?.next_page ? (lastPage.query?.page || 0) + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.data?.categories || []),
  });

  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0, rootMargin: '50px' },
    );

    if (sentinel.current) {
      observer.observe(sentinel.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const [isEditing, setIsEditing] = useState<{
    id: string;
    defaultValues: NonNullable<ComponentProps<typeof SaveCategoryDialog>['defaultValues']>;
  }>();
  const confirm = useConfirm();

  const { mutate: deleteCategory } = useDeleteCategory({
    meta: {
      successNotification: t('notifications.categories.deleted'),
      errorNotification: t('notifications.categories.deleteError'),
      invalidateQuery: [categoriesKeys.all(), transactionsKeys.all()],
    },
  });

  const { mutate: patchCategory, isPending: isPatchCategoryPending } = usePatchCategory({
    meta: {
      successNotification: t('notifications.categories.updated'),
      errorNotification: t('notifications.categories.updateError'),
      invalidateQuery: [categoriesKeys.all()],
    },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <Card
        className="flex flex-col items-center justify-center"
        header={<h2 className="text-muted-foreground">{t('categories.list.header')}</h2>}
      >
        <div className="flex w-full max-w-4xl flex-col gap-2">
          {categoriesData.length > 0 ? (
            categoriesData.map((category) => (
              <div className="flex w-full justify-between" key={`category-${category.id!}`}>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className="size-5 shrink-0 rounded-full shadow-sm"
                    style={{ backgroundColor: category.color! }}
                  />
                  <p className="truncate">{category.name!}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={() => {
                      setIsEditing({
                        id: category.id!,
                        defaultValues: {
                          name: category.name!,
                          color: category.color!,
                        },
                      });
                    }}
                  >
                    <SquarePenIcon className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={() =>
                      confirm.add(
                        t('categories.confirmDelete.title'),
                        t('categories.confirmDelete.description'),
                        () => deleteCategory(category.id!),
                      )
                    }
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img src="/empty_state_tag.webp" alt="" className="size-20" />
              <span className="mt-3 text-lg font-medium">
                {t('common.empty.noCategoriesTitle')}
              </span>
              <span>{t('common.empty.noCategoriesDescription')}</span>
            </div>
          )}
        </div>
        {isEditing && (
          <SaveCategoryDialog
            isVisible={!!isEditing}
            onVisibleChange={() => setIsEditing(undefined)}
            defaultValues={isEditing?.defaultValues}
            onSave={(data, { reset }) => {
              patchCategory(
                {
                  id: isEditing?.id as string,
                  payload: {
                    name: data.name,
                    color: data.color,
                  },
                },
                {
                  onSuccess: () => {
                    setIsEditing(undefined);
                    reset();
                  },
                },
              );
            }}
            isLoading={isPatchCategoryPending}
          />
        )}

        <div ref={sentinel} />
      </Card>

      {isFetchingNextPage && <Spinner className="size-8" />}
    </div>
  );
};
