import {
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  CalendarSyncIcon,
  DiamondPercentIcon,
  WaypointsIcon,
} from 'lucide-react';
import { useState, type FC } from 'react';
import { SimpleExpenseDialog } from './components/SimpleExpenseDialog';
import { IncomeDialog } from './components/IncomeDialog';
import { InstallmentDialog } from './components/InstallmentDialog';
import { Page } from '../../components/commons/Page';
import { usePostSimpleExpense } from '../../hooks/mutations/usePostSimpleExpense';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../constants/routes';
import { entriesKeys } from '../../queries/transactions-queries';

export const NewTransactionPage: FC = () => {
  const [simpleExpenseIsVisible, setSimpleExpenseIsVisible] = useState(false);
  const navigate = useNavigate();

  const { mutate: postSimpleExpense, isPending: isPostSimpleExpensePending } = usePostSimpleExpense(
    {
      onSuccess: (data) => {
        setSimpleExpenseIsVisible(false);
        navigate(`${ROUTES.WALLET.LIST}?period=${data.data.entry.period}`);
      },
      meta: {
        successNotification: 'Transaction created successfully',
        errorNotification: 'There was an error creating the transaction',
        invalidateQuery: [...entriesKeys.all()],
      },
    },
  );

  return (
    <Page>
      <main className="flex w-full flex-col items-center px-8 py-16">
        <h1 className="font-title text-3xl text-shadow-2xs">Select a transaction type</h1>

        <div className="mt-12 grid w-full grid-cols-3 gap-6">
          <SimpleExpenseDialog
            isVisible={simpleExpenseIsVisible}
            onVisibleChange={setSimpleExpenseIsVisible}
            onSave={(data) => {
              postSimpleExpense({
                amount: Number(data.amount),
                name: data.name,
                period: dayjs(data.date).format('YYYYMM'),
                description: data.description,
              });
            }}
            isLoading={isPostSimpleExpensePending}
          >
            <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-red-400 hover:text-red-800">
              <BanknoteArrowDownIcon className="size-24" />
              <span className="text-2xl">Expense</span>
            </button>
          </SimpleExpenseDialog>
          <IncomeDialog onSave={() => {}}>
            <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-green-400 hover:text-green-800">
              <BanknoteArrowUpIcon className="size-24" />
              <span className="text-2xl">Income</span>
            </button>
          </IncomeDialog>
          <InstallmentDialog onSave={() => {}}>
            <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-orange-400 hover:text-orange-800">
              <DiamondPercentIcon className="size-24" />
              <span className="text-2xl">Installment</span>
            </button>
          </InstallmentDialog>
          <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-purple-400 hover:text-purple-800">
            <CalendarSyncIcon className="size-24" />
            <span className="text-2xl">Recurring</span>
          </button>
          <button className="flex cursor-pointer flex-col items-center justify-center rounded-md bg-zinc-950 p-12 text-zinc-600 transition-colors hover:bg-blue-400 hover:text-blue-800">
            <WaypointsIcon className="size-24" />
            <span className="text-2xl">Shared</span>
          </button>
        </div>
      </main>
    </Page>
  );
};
