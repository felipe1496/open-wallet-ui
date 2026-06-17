import { useEffect, useRef, useState, type ComponentProps, type FC } from 'react';
import { useQueryClient, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { transactionsKeys } from '../../../queries/transactions-queries';
import dayjs from 'dayjs';
import { useConfirm } from '../../../hooks/useConfirm';
import { useDeleteTransaction } from '../../../hooks/mutations/useDeleteTransaction';
import { Card } from '../../../components/commons/Card';
import { cn, parseUSD } from '../../../utils/functions';
import { Button } from '../../../components/commons/Button';
import { SquarePenIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { usePeriod } from '../../../hooks/usePeriod';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/commons/Tooltip';
import { SaveIncomeDialog } from './SaveIncomeDialog';
import { SaveSimpleExpenseDialog } from './SaveSimpleExpenseDialog';
import { SaveInstallmentDialog } from './SaveInstallmentDialog';
import { usePatchTransaction } from '../../../hooks/mutations/usePatchTransaction';
import { Spinner } from '../../../components/commons/loader/Spinner';
import { createStrategy } from './StrategyPattern';

import { useAPI } from '../../../hooks/useAPI';
import type { Entry, ListEntriesResponse } from '../../../queries/transactions-queries';
import { useLoader } from '../../../hooks/useLoader';

export const EntriesList: FC = () => {
  const api = useAPI();
  const [isEditingExpense, setIsEditingExpense] = useState<{
    id: string;
    defaultValues: NonNullable<ComponentProps<typeof SaveSimpleExpenseDialog>['defaultValues']>;
  } | null>(null);
  const [isEditingIncome, setIsEditingIncome] = useState<{
    id: string;
    defaultValues: NonNullable<ComponentProps<typeof SaveIncomeDialog>['defaultValues']>;
  } | null>(null);
  const [isEditingInstallment, setIsEditingInstallment] = useState<{
    transaction_id: string;
    defaultValues?: NonNullable<ComponentProps<typeof SaveInstallmentDialog>['defaultValues']>;
    previewDefaultValues?: NonNullable<
      ComponentProps<typeof SaveInstallmentDialog>['previewDefaultValues']
    >;
  } | null>(null);
  const { period } = usePeriod();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const periodFormatted = dayjs().year(period.year).month(period.month).format('YYYYMM');

  useSuspenseQuery({
    queryKey: ['recurrences', 'prepare', periodFormatted],
    queryFn: async () => {
      await api.recurrences.v1PrepareRecurrence(periodFormatted);
      return true;
    },
  });

  const {
    mutate: patchTransaction,
    isPending: isPatchTransactionLoading,
    variables: patchTransactionVariables,
  } = usePatchTransaction({
    meta: {
      successNotification: 'Transaction updated successfully',
      errorNotification: 'There was an error updating the transaction',
      invalidateQuery: [transactionsKeys.all()],
    },
  });

  const {
    data: entriesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: [...transactionsKeys.all(), periodFormatted, api],
    queryFn: ({ pageParam = 1 }) =>
      api.transactions
        .v1ListEntries({
          per_page: 25,
          page: pageParam as number,
          filter: `period eq '${periodFormatted}'`,
          order_by: 'reference_date:desc,created_at:desc',
        } as Parameters<typeof api.transactions.v1ListEntries>[0])
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.query?.next_page ? (lastPage.query.page || 0) + 1 : undefined;
    },
    select: (data) => {
      const entries = data.pages.flatMap((page) => page.data?.entries || []);

      const entriesPerDate: Record<string, Entry[]> = {};
      entries.forEach((entry) => {
        const date = entry.reference_date!.slice(0, 10);
        if (!entriesPerDate[date]) {
          entriesPerDate[date] = [entry as Entry];
        } else {
          entriesPerDate[date] = [...entriesPerDate[date], entry as Entry];
        }
      });

      return entriesPerDate;
    },
  });

  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0, rootMargin: '100px' },
    );

    if (sentinel.current) {
      observer.observe(sentinel.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const { mutate: deleteTransaction } = useDeleteTransaction({
    onMutate: async (id) => {
      const queryOpts = {
        per_page: 999,
        order_by: 'reference_date:desc,created_at:desc',
        filter: `period eq '${periodFormatted}'`,
      };

      const queryKey = transactionsKeys.getEntries(queryOpts);

      await queryClient.cancelQueries({ queryKey: transactionsKeys.all() });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData<ListEntriesResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            entries: old.data?.entries?.filter((entry) => entry.transaction_id !== id),
          },
        };
      });

      return {
        previousData,
        queryKey,
      };
    },
    onError: (_err, _id, context) => {
      const ctx = context as
        | {
            previousData?: ListEntriesResponse;
            queryKey?: readonly unknown[];
          }
        | undefined;
      if (ctx?.previousData && ctx?.queryKey) {
        queryClient.setQueryData(ctx.queryKey, ctx.previousData);
      }
    },
    meta: {
      errorNotification: 'An error occurred while deleting the transaction',
      invalidateQuery: [transactionsKeys.all()],
    },
  });

  const entries = Object.entries(entriesData);

  const setIsLoading = useLoader((state) => state.setIsLoading);
  const handleEdit = (entry: Entry) => {
    const strategies = createStrategy({
      setIsEditingExpense,
      setIsEditingIncome,
      setIsEditingInstallment,
      setIsLoading,
      queryClient,
      api,
    });

    return strategies[entry.type]?.(entry);
  };

  function getEntryData(entry: Entry) {
    return {
      category() {
        if (entry.category_id) {
          return (
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="size-4 shrink-0 rounded-full"
                  style={{
                    backgroundColor: entry.category_color ?? undefined,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{entry.category_name}</p>
              </TooltipContent>
            </Tooltip>
          );
        }
      },
      installment() {
        if (entry.type === 'installment') {
          return (
            <span className="text-sm font-bold">
              ({entry.installment}/{entry.total_installments})
            </span>
          );
        }
      },
      amount() {
        return Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(entry.amount!);
      },
      actions() {
        return (
          <>
            <Button size="sm" variant="outlined" onClick={() => handleEdit(entry)}>
              <SquarePenIcon className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="outlined"
              onClick={() =>
                confirm.add(
                  'Delete Transaction',
                  'This action will delete this entry and all other entries related to it. Are you sure? This action cannot be undone.',
                  () => deleteTransaction(entry.transaction_id!),
                )
              }
            >
              <TrashIcon className="size-4" />
            </Button>
          </>
        );
      },
    };
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="p-0" header={<h2 className="text-muted-foreground">Transactions</h2>}>
        {entries.length > 0 ? (
          <>
            <table className="hidden w-full md:table">
              <tbody>
                {entries
                  .map(([date, entries]) => [
                    <tr key={date} className="bg-zinc-100">
                      <td className="px-3 py-1 text-sm text-zinc-500" colSpan={5}>
                        {dayjs(date, 'YYYY-MM-DD').format('DD of MMMM')}
                      </td>
                    </tr>,
                    ...entries.map((entry, idx) => {
                      const data = getEntryData(entry);
                      const padding = idx === entries.length - 1 ? 'px-3 py-1' : 'px-3 pt-1';
                      return (
                        <tr key={entry.id}>
                          <td className={cn('w-[70%]', padding)}>
                            <div className="flex items-center gap-2">
                              {data.category()}
                              <p>
                                {entry.name} {data.installment()}
                              </p>
                            </div>
                          </td>
                          <td
                            className={cn(
                              'w-[10%] text-right font-medium',
                              entry.amount! < 0 ? 'text-red-400' : 'text-green-500',
                              padding,
                            )}
                          >
                            <span className="whitespace-nowrap">{data.amount()}</span>
                          </td>
                          <td className={cn('w-[4%] text-right', padding)}>
                            <div className="flex items-center gap-2">{data.actions()}</div>
                          </td>
                        </tr>
                      );
                    }),
                  ])
                  .flat(Infinity)}
              </tbody>
            </table>
            <div className="flex flex-col md:hidden">
              {entries.map(([date, entries]) => (
                <div key={date}>
                  <h3 className="px-3 py-1 font-medium">
                    {dayjs(date, 'YYYY-MM-DD').format('DD of MMMM')}
                  </h3>
                  {entries.map((entry) => {
                    const data = getEntryData(entry);
                    return (
                      <div
                        key={entry.id}
                        className="flex justify-between gap-2 border-b border-zinc-300 px-3 pt-1 pb-2"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          {data.category()}
                          <p className="truncate font-medium">{entry.name}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 font-medium">
                          <span
                            className={cn(
                              'whitespace-nowrap',
                              entry.amount! < 0 ? 'text-red-400' : 'text-green-500',
                            )}
                          >
                            {data.amount()}
                          </span>
                          <div className="flex items-center gap-1">{data.actions()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center pb-8">
            <img src="/empty_state_wallet.webp" alt="no results found" className="size-28" />

            <span className="text-lg font-medium">No transactions yet</span>
            <span>Try adding one</span>

            <Button className="mt-3" variant="outlined" asChild>
              <Link to={{ pathname: ROUTES.WALLET.NEW_TRANSACTION }}>Add Transaction</Link>
            </Button>
          </div>
        )}
        {isEditingExpense && (
          <SaveSimpleExpenseDialog
            isLoading={
              isPatchTransactionLoading &&
              isEditingExpense.id === patchTransactionVariables.transactionId
            }
            isVisible={!!isEditingExpense}
            onClose={() => setIsEditingExpense(null)}
            defaultValues={isEditingExpense?.defaultValues}
            onSave={(data) => {
              patchTransaction(
                {
                  transactionId: isEditingExpense.id,
                  payload: {
                    name: data.name,
                    note: data.description,
                    entries: [{ amount: parseUSD(data.amount) * -1, reference_date: data.date }],
                    category_id: data.category?.id,
                  },
                },
                {
                  onSuccess: () => {
                    setIsEditingExpense(null);
                  },
                },
              );
            }}
          />
        )}
        {isEditingIncome && (
          <SaveIncomeDialog
            isLoading={
              isPatchTransactionLoading &&
              isEditingIncome.id === patchTransactionVariables.transactionId
            }
            isVisible={!!isEditingIncome}
            onClose={() => setIsEditingIncome(null)}
            defaultValues={isEditingIncome?.defaultValues}
            onSave={(data) => {
              patchTransaction(
                {
                  transactionId: isEditingIncome.id,
                  payload: {
                    name: data.name,
                    note: data.description,
                    entries: [{ amount: parseUSD(data.amount), reference_date: data.date }],
                    category_id: data.category?.id,
                  },
                },
                {
                  onSuccess: () => {
                    setIsEditingIncome(null);
                  },
                },
              );
            }}
          />
        )}
        {isEditingInstallment && (
          <SaveInstallmentDialog
            isLoading={
              isPatchTransactionLoading &&
              isEditingInstallment.transaction_id === patchTransactionVariables.transactionId
            }
            isVisible={!!isEditingInstallment}
            onClose={() => setIsEditingInstallment(null)}
            onSave={(data) => {
              patchTransaction(
                {
                  transactionId: isEditingInstallment.transaction_id,
                  payload: {
                    category_id: data.category?.id,
                    entries: data.entries.map((entry) => ({
                      amount: parseUSD(entry.amount) * -1,
                      reference_date: entry.reference_date,
                    })),
                    name: data.name,
                    note: data.note,
                  },
                },
                {
                  onSuccess: () => {
                    setIsEditingInstallment(null);
                  },
                },
              );
            }}
            defaultValues={(() => {
              if (!isEditingInstallment?.defaultValues) return undefined;
              return {
                amount: isEditingInstallment.defaultValues.amount,
                name: isEditingInstallment.defaultValues.name,
                note: isEditingInstallment.defaultValues.note,
                installments: isEditingInstallment.defaultValues.installments,
                reference_date: isEditingInstallment.defaultValues.reference_date,
                category: isEditingInstallment.defaultValues.category,
              };
            })()}
            previewDefaultValues={{
              entries: [],
            }}
          />
        )}

        <div ref={sentinel} />
      </Card>

      {isFetchingNextPage && <Spinner className="size-8" />}
    </div>
  );
};
