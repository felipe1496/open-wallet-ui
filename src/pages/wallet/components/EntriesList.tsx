import { useState, type FC } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { entriesKeys, getEntriesQueryOpts } from '../../../queries/transactions-queries';
import dayjs from 'dayjs';
import type { TransactionsService } from '../../../services/TransactionsService';
import { useConfirm } from '../../../hooks/useConfirm';
import { useDeleteTransaction } from '../../../hooks/mutations/useDeleteTransaction';
import { Card } from '../../../components/commons/Card';
import { cn } from '../../../utils/functions';
import { Button } from '../../../components/commons/Button';
import { TrashIcon } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { usePeriod } from '../../../hooks/usePeriod';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/commons/Tooltip';

export const EntriesList: FC = () => {
  const { period } = usePeriod();
  const [isDeleting, setIsDeleting] = useState<string>('');
  const confirm = useConfirm();

  const { data } = useSuspenseQuery({
    ...getEntriesQueryOpts(dayjs().year(period.year).month(period.month).format('YYYYMM'), {
      per_page: 999,
    }),
    select: (data) => {
      const entriesPerDate: Record<
        string,
        Awaited<ReturnType<typeof TransactionsService.getEntries>>['data']['entries'][number][]
      > = {};
      data.data.entries.forEach((entry) => {
        const date = entry.reference_date.slice(0, 10);
        if (!entriesPerDate[date]) {
          entriesPerDate[date] = [entry];
        } else {
          entriesPerDate[date] = [...entriesPerDate[date], entry];
        }
      });
      return entriesPerDate;
    },
  });

  const { mutate: deleteTransaction } = useDeleteTransaction({
    onMutate: (id) => {
      setIsDeleting(id);
    },
    onSettled: () => {
      setIsDeleting('');
    },
    meta: {
      successNotification: 'Transaction deleted successfully',
      errorNotification: 'An error occurred while deleting the transaction',
      invalidateQuery: [...entriesKeys.all()],
    },
  });

  const entries = Object.entries(data);

  return (
    <Card className="p-0" header={<h2 className="text-muted-foreground">Transactions</h2>}>
      {entries.length > 0 ? (
        <table className="w-full">
          <tbody>
            {entries
              .map(([date, entries]) => [
                <tr key={date} className="bg-zinc-100">
                  <td className="px-3 py-1 text-sm text-zinc-500" colSpan={5}>
                    {dayjs(date, 'YYYY-MM-DD').format('DD of MMMM')}
                  </td>
                </tr>,
                ...entries.map((entry) => (
                  <tr
                    className={cn(
                      isDeleting === entry.transaction_id && 'pointer-events-none opacity-30',
                    )}
                    key={entry.id}
                  >
                    <td className="w-[30%] px-3 py-1">
                      <div className="flex items-center gap-2">
                        {entry.category_color && (
                          <Tooltip>
                            <TooltipTrigger>
                              <div
                                className="size-4 shrink-0 rounded-full"
                                style={{
                                  backgroundColor: entry.category_color,
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>{entry.category_name}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <p>{entry.name}</p>
                      </div>
                    </td>
                    <td className="w-[20%] px-3 py-1">{entry.reference_date.slice(0, 10)}</td>
                    <td className="w-[20%] px-3 py-1">
                      {entry.installment}/{entry.total_installments}
                    </td>
                    <td
                      className={cn(
                        'w-[25%] px-3 py-1 text-right font-medium',
                        entry.amount < 0 ? 'text-red-400' : 'text-green-500',
                      )}
                    >
                      {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                        entry.amount,
                      )}
                    </td>
                    <td className="w-[5%] px-3 py-1 text-right">
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() =>
                          confirm.add(
                            'Delete Transaction',
                            'This action will delete this entry and all other entries related to it. Are you sure? This action cannot be undone.',
                            () => deleteTransaction(entry.transaction_id),
                          )
                        }
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </td>
                  </tr>
                )),
              ])
              .flat(Infinity)}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center pb-8">
          <img src="/no_data.webp" alt="no results found" className="size-64" />

          <span className="text-lg font-medium">No transactions yet</span>
          <span>Try adding one</span>

          <Button className="mt-3" variant="outlined" asChild>
            <Link to={{ pathname: ROUTES.WALLET.NEW }}>Add Transaction</Link>
          </Button>
        </div>
      )}
    </Card>
  );
};
