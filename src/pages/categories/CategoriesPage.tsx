import { Suspense, useState, type FC } from 'react';
import { Page } from '../../components/commons/Page';
import { CategoriesList } from './components/CategoriesList';
import { Button } from '../../components/commons/Button';
import { SaveCategoryDialog } from './components/SaveCategoryDialog';
import { usePostCategory } from '../../hooks/mutations/usePostCategory';
import { categoriesKeys } from '../../queries/categories-queries';
import { LoaderWords } from '../../components/commons/loader/LoaderWords';
import { LanguageSwitch } from '../../i18n/LanguageSwitch';
import { useTranslation } from 'react-i18next';

export const CategoriesPage: FC = () => {
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);
  const { t } = useTranslation();

  const { mutate: postCategory, isPending } = usePostCategory({
    meta: {
      successNotification: t('notifications.categories.created'),
      errorNotification: t('notifications.categories.createError'),
      invalidateQuery: [categoriesKeys.all()],
    },
  });

  return (
    <Page>
      <main className="flex flex-col p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">{t('categories.title')}</h1>

          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <SaveCategoryDialog
              isVisible={addCategoryVisible}
              onVisibleChange={setAddCategoryVisible}
              onSave={(data, { reset }) => {
                postCategory(
                  {
                    name: data.name,
                    color: data.color,
                  },
                  {
                    onSuccess: () => {
                      setAddCategoryVisible(false);
                      reset();
                    },
                  },
                );
              }}
              isLoading={isPending}
            >
              <Button>{t('categories.addCategory')}</Button>
            </SaveCategoryDialog>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
              <LoaderWords
                words={[
                  t('loaderWords.categories.sums'),
                  t('loaderWords.categories.categories'),
                  t('loaderWords.categories.spentPerMonth'),
                  t('loaderWords.categories.colors'),
                  t('loaderWords.categories.labels'),
                ]}
              />
            </div>
          }
        >
          <CategoriesList />
        </Suspense>
      </main>
    </Page>
  );
};
