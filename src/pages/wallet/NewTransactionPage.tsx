import { useState, type FC } from 'react';
import { Page } from '../../components/commons/Page';
import { usePostSimpleExpense } from '../../hooks/mutations/usePostSimpleExpense';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../constants/routes';
import { entriesKeys } from '../../queries/transactions-queries';
import { usePostIncome } from '../../hooks/mutations/usePostIncome';
import { usePostInstallment } from '../../hooks/mutations/usePostInstallment';
import { Card } from '../../components/commons/Card';
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, SquareDivideIcon } from 'lucide-react';
import { parseUSD } from '../../utils/functions';
import { SaveSimpleExpenseDialog } from './components/SaveSimpleExpenseDialog';
import { SaveIncomeDialog } from './components/SaveIncomeDialog';
import { SaveInstallmentDialog } from './components/SaveInstallmentDialog';

export const NewTransactionPage: FC = () => {
  const [simpleExpenseIsVisible, setSimpleExpenseIsVisible] = useState(false);
  const [incomeIsVisible, setIncomeIsVisible] = useState(false);
  const [installmentIsVisible, setInstallmentIsVisible] = useState(false);
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
        invalidateQuery: [entriesKeys.all()],
      },
    },
  );

  const { mutate: postIncome, isPending: isPostIncomePending } = usePostIncome({
    onSuccess: (data) => {
      setSimpleExpenseIsVisible(false);
      navigate(`${ROUTES.WALLET.LIST}?period=${data.data.entry.period}`);
    },
    meta: {
      successNotification: 'Transaction created successfully',
      errorNotification: 'There was an error creating the transaction',
      invalidateQuery: [entriesKeys.all()],
    },
  });

  const { mutate: postInstallment, isPending: isPostInstallmentPending } = usePostInstallment({
    onSuccess: (data) => {
      setSimpleExpenseIsVisible(false);
      navigate(`${ROUTES.WALLET.LIST}?period=${data.data.entries[0].period}`);
    },
    meta: {
      successNotification: 'Transaction created successfully',
      errorNotification: 'There was an error creating the transaction',
      invalidateQuery: [entriesKeys.all()],
    },
  });

  return (
    <Page>
      <main className="flex w-full flex-col items-center p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">Add Transaction</h1>
        </header>

        <Card
          header={<h2 className="text-muted-foreground">Choose the type of transaction</h2>}
          className="flex items-center justify-center"
        >
          <div className="grid grid-cols-2 gap-4">
            <SaveSimpleExpenseDialog
              isVisible={simpleExpenseIsVisible}
              onClose={() => setSimpleExpenseIsVisible(false)}
              onSave={(data) => {
                postSimpleExpense({
                  amount: parseUSD(data.amount),
                  name: data.name,
                  reference_date: data.date,
                  description: data.description,
                  category_id: data.category?.id,
                });
              }}
              isLoading={isPostSimpleExpensePending}
            />

            <button
              onClick={() => setSimpleExpenseIsVisible(true)}
              className="flex h-28 w-full max-w-2xs cursor-pointer flex-col gap-4 rounded border border-red-200 bg-red-50 p-2 text-left shadow"
            >
              <div className="flex items-center gap-2">
                <BanknoteArrowDownIcon strokeWidth={1.5} className="size-7 text-red-500" />

                <h3 className="font-medium">Expense</h3>
              </div>

              <p className="text-muted-foreground text-sm">
                Suitable for one-time simple expenses on your day.
              </p>
            </button>

            <SaveIncomeDialog
              isVisible={incomeIsVisible}
              onClose={() => setIncomeIsVisible(false)}
              onSave={(data) => {
                postIncome({
                  amount: parseUSD(data.amount),
                  name: data.name,
                  reference_date: data.date,
                  description: data.description,
                  category_id: data.category?.id,
                });
              }}
              isLoading={isPostIncomePending}
            />
            <button
              onClick={() => setIncomeIsVisible(true)}
              className="flex h-28 w-full max-w-2xs cursor-pointer flex-col gap-4 rounded border border-green-200 bg-green-50 p-2 text-left shadow"
            >
              <div className="flex items-center gap-2">
                <BanknoteArrowUpIcon strokeWidth={1.5} className="size-7 text-green-500" />

                <h3 className="font-medium">Income</h3>
              </div>

              <p className="text-muted-foreground text-sm">
                Suitable for one-time simple incomes on your day.
              </p>
            </button>

            <SaveInstallmentDialog
              isVisible={installmentIsVisible}
              onClose={() => setInstallmentIsVisible(false)}
              onSave={(data) => {
                postInstallment({
                  name: data.name,
                  total_amount: parseUSD(data.amount),
                  total_installments: Number(data.installments),
                  reference_date: data.date,
                  description: data.description,
                  category_id: data.category?.id,
                });
              }}
              isLoading={isPostInstallmentPending}
            />
            <button
              onClick={() => setInstallmentIsVisible(true)}
              className="flex h-28 w-full max-w-2xs cursor-pointer flex-col gap-4 rounded border border-amber-200 bg-amber-50 p-2 text-left shadow"
            >
              <div className="flex items-center gap-2">
                <SquareDivideIcon strokeWidth={1.5} className="size-6 text-amber-500" />

                <h3 className="font-medium">Installment</h3>
              </div>

              <p className="text-muted-foreground text-sm">
                Suitable for monthly installments, such as rent, utilities, etc.
              </p>
            </button>
          </div>
        </Card>
      </main>
    </Page>
  );
};
