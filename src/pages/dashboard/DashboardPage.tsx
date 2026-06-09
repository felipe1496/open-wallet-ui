import { Suspense, type FC } from 'react';
import { Page } from '../../components/commons/Page';
import { Insights } from './components/Insights';
import { PeriodPickerCustom } from '../../components/commons/PeriodPickerCustom';
import { Button } from '../../components/commons/Button';
import { usePeriod } from '../../hooks/usePeriod';
import { LoaderWords } from '../../components/commons/loader/LoaderWords';
import { LanguageSwitch } from '../../i18n/LanguageSwitch';
import { useTranslation } from 'react-i18next';

export const DashboardPage: FC = () => {
  const { period, setPeriod } = usePeriod();
  const { t } = useTranslation();

  return (
    <Page>
      <main className="flex flex-col p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">{t('dashboard.title')}</h1>

          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <PeriodPickerCustom value={period} onChange={setPeriod} align="center">
              <Button variant="outlined" className="font-normal">
                {`${t('dates.months.full', { returnObjects: true })[period.month]} ${period.year}`}
              </Button>
            </PeriodPickerCustom>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
              <LoaderWords
                words={[
                  t('loaderWords.dashboard.insights'),
                  t('loaderWords.dashboard.spending'),
                  t('loaderWords.dashboard.analysis'),
                  t('loaderWords.dashboard.review'),
                  t('loaderWords.dashboard.graphs'),
                ]}
              />
            </div>
          }
        >
          <Insights />
        </Suspense>
      </main>
    </Page>
  );
};
