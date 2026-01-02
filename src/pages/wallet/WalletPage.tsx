import { Suspense, type FC } from 'react';
import { Button } from '../../components/commons/Button';
import { ROUTES } from '../../constants/routes';
import { Page } from '../../components/commons/Page';

import { PeriodPickerCustom } from '../../components/commons/PeriodPickerCustom';
import { MONTHS_FULL } from '../../constants/dates';
import { EntriesList } from './components/EntriesList';
import { usePeriod } from '../../hooks/usePeriod';
import { Zelda } from '../../components/commons/Zelda';

export const WalletPage: FC = () => {
  const { period, setPeriod } = usePeriod();

  return (
    <Page>
      <main className="p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">Wallet</h1>

          <div className="flex items-center gap-2">
            <PeriodPickerCustom value={period} onChange={setPeriod} align="center">
              <Button variant="outlined" className="font-normal">
                {`${MONTHS_FULL[period.month]} ${period.year}`}
              </Button>
            </PeriodPickerCustom>

            <Button asChild>
              <Zelda to={ROUTES.WALLET.NEW} keepQueryParams>
                Add Transaction
              </Zelda>
            </Button>
          </div>
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <EntriesList />
        </Suspense>
      </main>
    </Page>
  );
};
