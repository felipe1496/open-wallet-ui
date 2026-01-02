import { useSuspenseQuery } from '@tanstack/react-query';
import {
  categoriesKeys,
  getCategoriesPerPeriodQueryOpts,
  getCategoriesQueryOpts,
} from '../../../queries/categories-queries';
import { Card } from '../../../components/commons/Card';
import dayjs from 'dayjs';
import { cn } from '../../../utils/functions';
import { Button } from '../../../components/commons/Button';
import { SquarePenIcon, TrashIcon } from 'lucide-react';
import { useDeleteCategory } from '../../../hooks/mutations/useDeleteCategory';
import { useConfirm } from '../../../hooks/useConfirm';
import { usePeriod } from '../../../hooks/usePeriod';
import { SaveCategoryDialog } from './SaveCategoryDialog';
import { usePatchCategory } from '../../../hooks/mutations/usePatchCategory';
import { useState, type ComponentProps } from 'react';
import { entriesKeys } from '../../../queries/transactions-queries';

export const CategoriesPerPeriodList = () => {
  const [isEditing, setIsEditing] = useState<{
    id: string;
    defaultValues: NonNullable<ComponentProps<typeof SaveCategoryDialog>['defaultValues']>;
  }>();
  const confirm = useConfirm();
  const { period } = usePeriod();

  const { data: amountPerPeriodData } = useSuspenseQuery({
    ...getCategoriesPerPeriodQueryOpts(
      dayjs().year(period.year).month(period.month).format('YYYYMM'),
    ),
  });

  const { data: categoriesData } = useSuspenseQuery({
    ...getCategoriesQueryOpts({
      order_by: 'name',
      order: 'asc',
    }),
  });

  const categories = categoriesData.data.categories.map((category) => {
    const totalAmount =
      amountPerPeriodData.data.categories.find((c) => c.id === category.id)?.total_amount || 0;

    return {
      ...category,
      total_amount: totalAmount,
    };
  });

  const { mutate: deleteCategory } = useDeleteCategory({
    meta: {
      successNotification: 'Category deleted successfully',
      errorNotification: 'There was an error deleting the category',
      invalidateQuery: [categoriesKeys.all(), entriesKeys.all()],
    },
  });

  const { mutate: patchCategory, isPending: isPatchCategoryPending } = usePatchCategory({
    meta: {
      successNotification: 'Category updated successfully',
      errorNotification: 'There was an error updating the category',
      invalidateQuery: [categoriesKeys.all()],
    },
  });

  return (
    <Card
      className="flex justify-center"
      header={<h2 className="text-muted-foreground">Categories</h2>}
    >
      <div className="flex w-full max-w-4xl flex-col gap-2">
        {categories.map((category) => (
          <div className="flex w-full justify-between" key={`category-${category.id}`}>
            <div className="flex items-center gap-2">
              <div
                className="size-5 rounded-full shadow-sm"
                style={{ backgroundColor: category.color }}
              />
              <p>{category.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-medium',
                  category.total_amount >= 0 ? 'text-green-500' : 'text-red-400',
                )}
              >
                {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  category.total_amount,
                )}
              </span>
              <Button
                size="sm"
                variant="outlined"
                onClick={() => {
                  setIsEditing({
                    id: category.id,
                    defaultValues: {
                      name: category.name,
                      color: category.color,
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
                    'Delete Category',
                    'This action will delete this category and let entries associated to it orphaned.',
                    () => deleteCategory(category.id),
                  )
                }
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {isEditing && (
        <SaveCategoryDialog
          isVisible={!!isEditing}
          onVisibleChange={() => setIsEditing(undefined)}
          defaultValues={isEditing?.defaultValues}
          onSave={(data) => {
            patchCategory({
              id: isEditing?.id as string,
              payload: {
                name: data.name,
                color: data.color,
              },
            });
            setIsEditing(undefined);
          }}
          isLoading={isPatchCategoryPending}
        />
      )}
    </Card>
  );
};
