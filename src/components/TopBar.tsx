import type { FC } from 'react';

import { PeriodPickerCustom } from './commons/PeriodPickerCustom';

import { MONTHS_FULL } from '../constants/dates';
import { useCtx } from '../hooks/useCtx';

export const TopBar: FC = () => {
  const { period, setPeriod } = useCtx();

  return (
    <header className="fixed top-0 flex h-16 w-[calc(100vw-14rem)] items-center justify-end gap-2 px-8">
      <PeriodPickerCustom value={period} onChange={setPeriod} align="center">
        <div className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 p-2 text-sm">
          {`${MONTHS_FULL[period.month]} ${period.year}`}
        </div>
      </PeriodPickerCustom>
    </header>
  );
};
