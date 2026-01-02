import { Suspense, useState, type FC } from 'react';
import { Page } from '../../components/commons/Page';
import { CategoriesPerPeriodList } from './components/CategoriesPerPeriodList';
import { PeriodPickerCustom } from '../../components/commons/PeriodPickerCustom';
import { MONTHS_FULL } from '../../constants/dates';
import { Button } from '../../components/commons/Button';
import { usePeriod } from '../../hooks/usePeriod';
import { SaveCategoryDialog } from './components/SaveCategoryDialog';
import { usePostCategory } from '../../hooks/mutations/usePostCategory';
import { categoriesKeys } from '../../queries/categories-queries';

export const CategoriesPage: FC = () => {
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);
  const { period, setPeriod } = usePeriod();

  const { mutate: postCategory, isPending } = usePostCategory({
    onSuccess: () => setAddCategoryVisible(false),
    meta: {
      successNotification: 'Category created successfully',
      errorNotification: 'There was an error creating the category',
      invalidateQuery: [categoriesKeys.all()],
    },
  });

  return (
    <Page>
      <main className="flex flex-col p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">Categories</h1>

          <div className="flex items-center gap-2">
            <PeriodPickerCustom value={period} onChange={setPeriod} align="center">
              <Button variant="outlined" className="font-normal">
                {`${MONTHS_FULL[period.month]} ${period.year}`}
              </Button>
            </PeriodPickerCustom>

            <SaveCategoryDialog
              isVisible={addCategoryVisible}
              onVisibleChange={setAddCategoryVisible}
              onSave={postCategory}
              isLoading={isPending}
            >
              <Button>Add Category</Button>
            </SaveCategoryDialog>
          </div>
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <CategoriesPerPeriodList />
        </Suspense>
      </main>
    </Page>
  );
};
