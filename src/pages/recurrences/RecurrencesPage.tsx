import { Suspense, useState, type FC } from 'react';
import { Page } from '../../components/commons/Page';
import { Button } from '../../components/commons/Button';
import { SaveRecurrenceDialog } from './components/SaveRecurrenceDialog';
import { RecurrencesList } from './components/RecurrencesList';
import { usePostRecurrence } from '../../hooks/mutations/usePostRecurrence';
import { recurrencesKeys } from '../../queries/recurrences-queries';
import { LoaderWords } from '../../components/commons/loader/LoaderWords';
import { parseUSD } from '../../utils/functions';
import { LanguageSwitch } from '../../i18n/LanguageSwitch';
import { useTranslation } from 'react-i18next';

export const RecurrencesPage: FC = () => {
  const [addRecurrenceVisible, setAddRecurrenceVisible] = useState(false);
  const { t } = useTranslation();

  const { mutate: postRecurrence, isPending } = usePostRecurrence({
    onSuccess: () => setAddRecurrenceVisible(false),
    meta: {
      successNotification: t('notifications.recurrences.created'),
      errorNotification: t('notifications.recurrences.createError'),
      invalidateQuery: [recurrencesKeys.all()],
    },
  });

  return (
    <Page>
      <main className="flex flex-col p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">{t('recurrences.title')}</h1>

          <div className="flex gap-2">
            <LanguageSwitch />
            <SaveRecurrenceDialog
              isVisible={addRecurrenceVisible}
              onVisibleChange={setAddRecurrenceVisible}
              onSave={(data, { reset }) => {
                postRecurrence(
                  {
                    name: data.name,
                    category_id: data.category?.id || undefined,
                    note: data.note || undefined,
                    amount: parseUSD(data.amount) * -1,
                    day_of_month: parseInt(data.day_of_month, 10),
                    start_period: data.start_period,
                    end_period: data.end_period || undefined,
                  },
                  {
                    onSuccess: () => {
                      reset();
                      setAddRecurrenceVisible(false);
                    },
                  },
                );
              }}
              isLoading={isPending}
            >
              <Button>{t('recurrences.addRecurrence')}</Button>
            </SaveRecurrenceDialog>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
              <LoaderWords
                words={[
                  t('loaderWords.recurrences.loops'),
                  t('loaderWords.recurrences.recurrences'),
                  t('loaderWords.recurrences.monthlyEntries'),
                  t('loaderWords.recurrences.automation'),
                  t('loaderWords.recurrences.rules'),
                ]}
              />
            </div>
          }
        >
          <RecurrencesList onAddClick={() => setAddRecurrenceVisible(true)} />
        </Suspense>
      </main>
    </Page>
  );
};
