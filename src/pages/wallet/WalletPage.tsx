import { Suspense, type FC } from 'react';
import { Button } from '../../components/commons/Button';
import { ROUTES } from '../../constants/routes';
import { Page } from '../../components/commons/Page';

import { PeriodPickerCustom } from '../../components/commons/PeriodPickerCustom';
import { EntriesList } from './components/EntriesList';
import { usePeriod } from '../../hooks/usePeriod';
import { Zelda } from '../../components/commons/Zelda';
import { LoaderWords } from '../../components/commons/loader/LoaderWords';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from '../../i18n/LanguageSwitch';

export const WalletPage: FC = () => {
  const { period, setPeriod } = usePeriod();
  const { t } = useTranslation();

  return (
    <Page>
      <main className="p-2">
        <header className="mb-4 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
          <h1 className="text-xl font-medium">{t('wallet.title')}</h1>

          <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
            <LanguageSwitch />
            <PeriodPickerCustom value={period} onChange={setPeriod} align="center">
              <Button variant="outlined" className="font-normal">
                {`${t('dates.months.full', { returnObjects: true })[period.month]} ${period.year}`}
              </Button>
            </PeriodPickerCustom>

            <Button asChild>
              <Zelda to={ROUTES.WALLET.NEW_TRANSACTION} keepQueryParams>
                {t('wallet.addTransaction')}
              </Zelda>
            </Button>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
              <LoaderWords
                words={[
                  t('loaderWords.wallet.sums'),
                  t('loaderWords.wallet.expenses'),
                  t('loaderWords.wallet.incomes'),
                  t('loaderWords.wallet.installments'),
                  t('loaderWords.wallet.transactions'),
                ]}
              />
            </div>
          }
        >
          <EntriesList />
        </Suspense>
      </main>
    </Page>
  );
};
