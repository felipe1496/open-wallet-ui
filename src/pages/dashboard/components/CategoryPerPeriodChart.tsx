import type { FC } from 'react';
import ReactECharts from 'echarts-for-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCategoriesPerPeriodQueryOpts } from '../../../queries/categories-queries';
import { usePeriod } from '../../../hooks/usePeriod';
import dayjs from 'dayjs';
import { useAPI } from '../../../hooks/useAPI';
import { useTranslation } from 'react-i18next';

export const CategoryPerPeriod: FC = () => {
  const { period } = usePeriod();
  const api = useAPI();
  const { t } = useTranslation();

  const { data } = useSuspenseQuery({
    ...getCategoriesPerPeriodQueryOpts(
      api,
      dayjs().month(period.month).year(period.year).format('YYYYMM'),
      {
        per_page: 100,
        order_by: 'total_amount:desc',
      },
    ),
  });

  const categories = data.data?.categories || [];
  const filteredData = categories.filter((item) => item.total_amount! < 0);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: { value: number; name: string; percent: string }) {
        return (
          params.name +
          '<br/>' +
          Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            params.value * -1,
          ) +
          ' (' +
          params.percent +
          '%)'
        );
      },
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 15,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: filteredData.map((category) => ({
          value: Math.abs(category.total_amount!),
          name: category.name!,
          itemStyle: {
            color: category.color!,
          },
          label: {
            formatter: (params: { value: number }) =>
              Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                params.value * -1,
              ),
          },
        })),
      },
    ],
  };

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <img src="/empty_state_donut.webp" alt="" className="size-24" />
        <span className="text-lg font-medium">{t('common.empty.noCategoriesTitle')}</span>
        <span>{t('common.empty.noCategoriesDescription')}</span>
      </div>
    );
  }

  return <ReactECharts option={option} />;
};
