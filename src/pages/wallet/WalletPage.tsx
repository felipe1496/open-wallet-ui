import { Suspense, type FC } from 'react';
import { Button } from '../../components/commons/Button';
import { ROUTES } from '../../constants/routes';
import { Page } from '../../components/commons/Page';

import { PeriodPickerCustom } from '../../components/commons/PeriodPickerCustom';
import { MONTHS_FULL } from '../../constants/dates';
import { EntriesList } from './components/EntriesList';
import { usePeriod } from '../../hooks/usePeriod';
import { Zelda } from '../../components/commons/Zelda';
import { LoaderWords } from '../../components/commons/loader/LoaderWords';

export const WalletPage: FC = () => {
  const { period, setPeriod } = usePeriod();

  return (
    <Page>
      <main className="p-2">
        <header className="mb-4 flex w-full flex-col items-start justify-between md:flex-row md:items-center">
          <h1 className="text-xl font-medium">Wallet</h1>

          <div className="flex w-full justify-between gap-2 md:w-auto md:justify-start">
            <PeriodPickerCustom value={period} onChange={setPeriod} align="center">
              <Button variant="outlined" className="font-normal">
                {`${MONTHS_FULL[period.month]} ${period.year}`}
              </Button>
            </PeriodPickerCustom>

            <Button
              nativeButton={false}
              render={<Zelda to={ROUTES.WALLET.NEW_TRANSACTION} keepQueryParams />}
            >
              Add Transaction
            </Button>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
              <LoaderWords
                words={['sums', 'expenses', 'incomes', 'installments', 'transactions']}
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
