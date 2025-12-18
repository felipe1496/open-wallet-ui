import { useState, type FC } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { entriesKeys, getEntriesQueryOpts } from '../../../queries/transactions-queries';
import dayjs from 'dayjs';
import { DataTable, type Column } from '../../../components/commons/DataTable';
import type { TransactionsService } from '../../../services/transactions-service';
import { TablePagination } from '../../../components/commons/TablePagination';
import { Skeleton } from '../../../components/commons/Skeleton';
import { BanknoteArrowDownIcon, TrashIcon } from 'lucide-react';
import { useCtx } from '../../../hooks/useCtx';
import { Button } from '../../../components/commons/Button';
import { useConfirmStore } from '../../../stores/useConfirmStore';
import { useDeleteTransaction } from '../../../hooks/mutations/useDeleteTransaction';

export const WalletList: FC = () => {
  const [isDeleting, setIsDeleting] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const { period } = useCtx();
  const confirm = useConfirmStore();

  const ITEMS_PER_PAGE = 10;

  const { data, isFetching } = useQuery({
    ...getEntriesQueryOpts(dayjs().year(period.year).month(period.month).format('YYYYMM'), {
      page: currentPage,
      per_page: ITEMS_PER_PAGE,
    }),
    placeholderData: keepPreviousData,
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

  const totalPages = data?.query.total_pages;
  const totalItems = data?.query.total_items;

  const columns: Column<
    Awaited<ReturnType<typeof TransactionsService.getEntries>>['data']['entries'][number]
  >[] = [
    {
      id: 'name',
      title: 'Name',
      render: (d) => {
        let icon = null;
        switch (d.type) {
          case 'simple_expense':
            icon = (
              <div className="rounded-full bg-red-950 p-2">
                <BanknoteArrowDownIcon className="size-8 text-red-500" />
              </div>
            );
            break;
          default:
            break;
        }
        return (
          <div className="flex items-center gap-4">
            {icon}
            {d.name}
          </div>
        );
      },
      isLoading: (
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton variant="text" width="60%" height={24} />
        </div>
      ),
      trClassName: 'w-[50%]',
    },
    {
      id: 'amount',
      title: 'Amount',
      render: (d) => d.amount,
      isLoading: <Skeleton variant="text" width={40} height={24} />,
      trClassName: 'w-[30%]',
    },
    {
      id: 'installment',
      title: 'Installment',
      render: (d) => `${d.installment}/${d.total_installments}`,
      isLoading: <Skeleton variant="text" width={20} height={24} />,
      trClassName: 'w-[10%]',
    },
    {
      id: 'actions',
      title: '',
      render: (data) => (
        <Button
          variant="outlined"
          size="sm"
          onClick={() =>
            confirm.add(
              'Delete Transaction',
              'This action will delete this entry and all other entries related to it. Are you sure? This action cannot be undone.',
              () => deleteTransaction(data.transaction_id),
            )
          }
        >
          <TrashIcon />
        </Button>
      ),
      trClassName: 'w-[10%]',
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data.entries ?? []}
        isLoading={isFetching}
        getRowProps={(row) => ({
          className: isDeleting === row.transaction_id ? 'opacity-30 pointer-events-none' : '',
          'aria-busy': isDeleting === row.transaction_id,
        })}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages ?? 0}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </>
  );
};
