import { useSuspenseQuery } from '@tanstack/react-query';
import { getCategoriesPerPeriodQueryOpts } from '../../../queries/categories-queries';
import { usePeriod } from '../../../hooks/usePeriod';
import dayjs from 'dayjs';
import { cn } from '../../../utils/functions';
import { useState } from 'react';

import { useAPI } from '../../../hooks/useAPI';
import { useTranslation } from 'react-i18next';

const DATA_EXPANDED = {
  SHOW_ALL: 100,
  SHOW_LESS: 10,
};

export const CategoryBalancePerPeriodList = () => {
  const [perPage, setPerPage] = useState(DATA_EXPANDED.SHOW_LESS);
  const { t } = useTranslation();

  const { period } = usePeriod();
  const api = useAPI();

  const { data } = useSuspenseQuery({
    ...getCategoriesPerPeriodQueryOpts(
      api,
      dayjs().year(period.year).month(period.month).format('YYYYMM'),
      { per_page: 100, order_by: 'total_amount:desc' },
    ),
  });

  const categories = data.data?.categories || [];
  const showData = categories.slice(0, perPage);

  const toggleButton = () => {
    if (categories.length <= DATA_EXPANDED.SHOW_LESS) {
      return null;
    }

    if (perPage === DATA_EXPANDED.SHOW_LESS) {
      return (
        <button
          className="mt-2 cursor-pointer text-sm font-medium text-blue-500 underline"
          onClick={() => {
            setPerPage(DATA_EXPANDED.SHOW_ALL);
          }}
        >
          {t('common.actions.showMore')}
        </button>
      );
    }

    return (
      <button
        className="mt-2 cursor-pointer text-sm font-medium text-blue-500 underline"
        onClick={() => {
          setPerPage(DATA_EXPANDED.SHOW_LESS);
        }}
      >
        {t('common.actions.showLess')}
      </button>
    );
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <img src="/empty_state_tag.webp" alt="" className="size-20" />
        <span className="mt-3 text-lg font-medium">{t('common.empty.noCategoriesTitle')}</span>
        <span>{t('common.empty.noCategoriesDescription')}</span>
      </div>
    );
  }

  return (
    <div>
      {showData.map((item) => (
        <div key={item.id!} className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className="size-5 shrink-0 rounded-full shadow-sm"
              style={{ backgroundColor: item.color! }}
            />
            <p className="truncate">{item.name!}</p>
          </div>

          <div
            className={cn(
              'font-medium',
              item.total_amount! < 0 ? 'text-red-400' : 'text-green-500',
            )}
          >
            <span>
              {item.total_amount!.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </span>
          </div>
        </div>
      ))}

      {toggleButton()}
    </div>
  );
};
