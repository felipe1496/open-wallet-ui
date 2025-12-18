import dayjs, { Dayjs } from 'dayjs';
import { useSearchParams } from 'react-router';

export function useCtx() {
  const [params, setParams] = useSearchParams();
  let period: Dayjs;

  const periodParam = params.get('period');
  const isValid = dayjs(periodParam, 'YYYYMM').isValid();

  if (periodParam && isValid) {
    period = dayjs(periodParam);
  } else {
    period = dayjs();
  }

  const setPeriod = (newPeriod: { month: number; year: number }) => {
    setParams({ period: dayjs().year(newPeriod.year).month(newPeriod.month).format('YYYYMM') });
  };

  return {
    period: {
      month: period.month(),
      year: period.year(),
    },
    setPeriod,
  };
}
