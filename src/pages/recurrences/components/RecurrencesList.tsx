import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { recurrencesKeys } from '../../../queries/recurrences-queries';
import { Card } from '../../../components/commons/Card';
import { Button } from '../../../components/commons/Button';
import { SquarePenIcon, TrashIcon } from 'lucide-react';
import { useDeleteRecurrence } from '../../../hooks/mutations/useDeleteRecurrence';
import { SaveRecurrenceDialog } from './SaveRecurrenceDialog';
import { usePatchRecurrence } from '../../../hooks/mutations/usePatchRecurrence';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { formatCurrency } from '../../../utils/functions';
import { DataTable } from '../../../components/commons/DataTable';
import { Spinner } from '../../../components/commons/loader/Spinner';
import { parseUSD } from '../../../utils/functions';
import { DeleteRecurrenceModal } from './DeleteRecurrenceModal';

import { useAPI } from '../../../hooks/useAPI';
import type { Recurrence } from '../../../queries/recurrences-queries';

export const RecurrencesList = ({ onAddClick }: { onAddClick?: () => void }) => {
  const api = useAPI();
  const [isEditing, setIsEditing] = useState<{
    id: string;
    defaultValues: NonNullable<ComponentProps<typeof SaveRecurrenceDialog>['defaultValues']>;
  }>();
  const [deletingRecurrenceId, setDeletingRecurrenceId] = useState<string | null>(null);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const {
    data: recurrencesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: [...recurrencesKeys.all(), api],
    queryFn: ({ pageParam = 1 }) =>
      api.recurrences
        .v1ListRecurrences({
          per_page: 25,
          page: pageParam as number,
          order_by: 'created_at:desc',
        } as Parameters<typeof api.recurrences.v1ListRecurrences>[0])
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.query?.next_page ? (lastPage.query.page || 0) + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => (page.data?.recurrences || []) as Recurrence[]),
  });

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

  const { mutate: deleteRecurrence, isPending: isDeleteRecurrencePending } = useDeleteRecurrence({
    meta: {
      successNotification: 'Recurrence deleted successfully',
      errorNotification: 'There was an error deleting the recurrence',
      invalidateQuery: [recurrencesKeys.all()],
    },
    onSuccess: () => {
      setDeletingRecurrenceId(null);
    },
  });

  const { mutate: patchRecurrence, isPending: isPatchRecurrencePending } = usePatchRecurrence({
    meta: {
      successNotification: 'Recurrence updated successfully',
      errorNotification: 'There was an error updating the recurrence',
      invalidateQuery: [recurrencesKeys.all()],
    },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <Card
        className="flex justify-center p-0"
        header={<h2 className="text-muted-foreground">Manage your recurring entries</h2>}
      >
        <div className="flex w-full flex-col">
          {recurrencesData.length > 0 ? (
            <DataTable
              data={recurrencesData}
              groupBy={(row) => `Day ${row.day_of_month}`}
              columns={[
                {
                  id: 'name',
                  title: 'Name',
                  trClassName: 'text-left',
                  render: (row) => <span>{row.name}</span>,
                },
                {
                  id: 'amount',
                  title: 'Amount',
                  trClassName: 'text-center',
                  render: (row) => (
                    <span className="font-semibold text-red-400">
                      {Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(row.amount!)}
                    </span>
                  ),
                },
                {
                  id: 'start_period',
                  title: 'Period',
                  trClassName: 'text-center',
                  render: (row) => (
                    <div className="flex flex-col text-zinc-500">
                      {row.start_period} {row.end_period ? `- ${row.end_period}` : ''}
                    </div>
                  ),
                },
                {
                  id: 'note',
                  title: 'Note',
                  trClassName: 'text-right',
                  render: (row) => <span>{row.note}</span>,
                },
                {
                  id: 'actions',
                  title: '',
                  trClassName: 'w-[1%] whitespace-nowrap',
                  render: (row) => (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => {
                          setIsEditing({
                            id: row.id!,
                            defaultValues: {
                              name: row.name!,
                              amount: formatCurrency(Math.abs(row.amount!)),
                              day_of_month: row.day_of_month!.toString(),
                              start_period: row.start_period || dayjs().format('YYYYMM'),
                              end_period: row.end_period,
                              note: row.note ?? '',
                              category: row.category_id
                                ? {
                                    id: row.category_id,
                                    label: row.category_name,
                                    value: {
                                      id: row.category_id,
                                      name: row.category_name,
                                      color: row.category_color,
                                    },
                                  }
                                : null,
                            },
                          });
                        }}
                      >
                        <SquarePenIcon className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => setDeletingRecurrenceId(row.id!)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          ) : (
            <div className="flex flex-col items-center justify-center pb-8">
              <img src="/empty_state_recurrences.webp" alt="" className="size-28" />

              <span className="mt-3 text-lg font-medium">No recurrences yet</span>
              <span className="text-muted-foreground">Create rules to automate your entries</span>

              <Button className="mt-3" variant="outlined" onClick={onAddClick}>
                Add Recurrence
              </Button>
            </div>
          )}
          <div ref={sentinel} />
        </div>
        {isEditing && (
          <SaveRecurrenceDialog
            isVisible={!!isEditing}
            onVisibleChange={() => setIsEditing(undefined)}
            defaultValues={isEditing.defaultValues}
            onSave={(data, { reset }) => {
              patchRecurrence(
                {
                  recurrenceId: isEditing.id,
                  payload: {
                    name: data.name,
                    category_id: data.category?.id || undefined,
                    note: data.note || undefined,
                    amount: parseUSD(data.amount) * -1,
                    day_of_month: parseInt(data.day_of_month, 10),
                    start_period: data.start_period,
                    end_period: data.end_period || undefined,
                  },
                },
                {
                  onSuccess: () => {
                    reset();
                    setIsEditing(undefined);
                  },
                },
              );
            }}
            isLoading={isPatchRecurrencePending}
          />
        )}
        <DeleteRecurrenceModal
          isVisible={!!deletingRecurrenceId}
          onClose={() => setDeletingRecurrenceId(null)}
          isLoading={isDeleteRecurrencePending}
          onConfirm={(scope) => {
            if (deletingRecurrenceId) {
              deleteRecurrence({ id: deletingRecurrenceId, scope });
            }
          }}
        />
      </Card>

      {isFetchingNextPage && <Spinner className="mx-auto size-8" />}
    </div>
  );
};
