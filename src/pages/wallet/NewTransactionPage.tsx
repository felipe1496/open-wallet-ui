import { useState, type FC } from 'react';
import { Page } from '../../components/commons/Page';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../constants/routes';
import { transactionsKeys } from '../../queries/transactions-queries';
import { Card } from '../../components/commons/Card';
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, SquareDivideIcon } from 'lucide-react';
import { parseUSD } from '../../utils/functions';
import { SaveSimpleExpenseDialog } from './components/SaveSimpleExpenseDialog';
import { SaveIncomeDialog } from './components/SaveIncomeDialog';
import { SaveInstallmentDialog } from './components/SaveInstallmentDialog';
import { usePostTransaction } from '../../hooks/mutations/usePostTransaction';
import { usePeriod } from '../../hooks/usePeriod';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export const NewTransactionPage: FC = () => {
  const [simpleExpenseIsVisible, setSimpleExpenseIsVisible] = useState(false);
  const [incomeIsVisible, setIncomeIsVisible] = useState(false);
  const [installmentIsVisible, setInstallmentIsVisible] = useState(false);
  const navigate = useNavigate();
  const { period } = usePeriod();
  const { t } = useTranslation();
  const date =
    dayjs(`${period.year}-${period.month + 1}`).format('YYYY-MM') === dayjs().format('YYYY-MM')
      ? dayjs().format('YYYY-MM-DD')
      : dayjs(`${period.year}-${period.month + 1}-01`).format('YYYY-MM-DD');
  const {
    mutate: postTransaction,
    isPending: isPostTransactionPending,
    variables: postTransactionVariables,
  } = usePostTransaction({
    onSuccess: () => {
      navigate({
        pathname: ROUTES.WALLET.INDEX,
        search: `?p=${dayjs(`${period.year}${period.month + 1}`).format('YYYYMM')}`,
      });
    },
    meta: {
      successNotification: t('notifications.transactions.created'),
      errorNotification: t('notifications.transactions.createError'),
      invalidateQuery: [transactionsKeys.all()],
    },
  });

  return (
    <Page>
      <main className="flex w-full flex-col items-center p-2">
        <header className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-xl font-medium">{t('wallet.addTransaction')}</h1>
        </header>

        <Card
          header={<h2 className="text-muted-foreground">{t('wallet.new.chooseType')}</h2>}
          className="flex items-center justify-center"
        >
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
            <SaveSimpleExpenseDialog
              defaultValues={{ date: date }}
              isVisible={simpleExpenseIsVisible}
              onClose={() => setSimpleExpenseIsVisible(false)}
              onSave={(data, { reset }) => {
                postTransaction(
                  {
                    category_id: data.category?.id,
                    entries: [{ amount: parseUSD(data.amount) * -1, reference_date: data.date }],
                    name: data.name,
                    note: data.description,
                    type: 'simple_expense',
                  },
                  {
                    onSuccess: () => {
                      setSimpleExpenseIsVisible(false);
                      reset();
                    },
                  },
                );
              }}
              isLoading={
                isPostTransactionPending && postTransactionVariables?.type === 'simple_expense'
              }
            />

            <button
              onClick={() => setSimpleExpenseIsVisible(true)}
              className="flex h-28 w-full max-w-2xs cursor-pointer flex-col gap-4 rounded border border-red-200 bg-red-50 p-2 text-left shadow"
            >
              <div className="flex items-center gap-2">
                <BanknoteArrowDownIcon strokeWidth={1.5} className="size-7 text-red-500" />

                <h3 className="font-medium">{t('wallet.transactionTypes.expense')}</h3>
              </div>

              <p className="text-muted-foreground text-sm">{t('wallet.new.expenseDescription')}</p>
            </button>

            <SaveIncomeDialog
              defaultValues={{ date: date }}
              isVisible={incomeIsVisible}
              onClose={() => setIncomeIsVisible(false)}
              onSave={(data, { reset }) => {
                postTransaction(
                  {
                    category_id: data.category?.id,
                    entries: [{ amount: parseUSD(data.amount), reference_date: data.date }],
                    name: data.name,
                    note: data.description,
                    type: 'income',
                  },
                  {
                    onSuccess: () => {
                      setIncomeIsVisible(false);
                      reset();
                    },
                  },
                );
              }}
              isLoading={isPostTransactionPending && postTransactionVariables?.type === 'income'}
            />
            <button
              onClick={() => setIncomeIsVisible(true)}
              className="flex h-28 w-full max-w-2xs cursor-pointer flex-col gap-4 rounded border border-green-200 bg-green-50 p-2 text-left shadow"
            >
              <div className="flex items-center gap-2">
                <BanknoteArrowUpIcon strokeWidth={1.5} className="size-7 text-green-500" />

                <h3 className="font-medium">{t('wallet.transactionTypes.income')}</h3>
              </div>

              <p className="text-muted-foreground text-sm">{t('wallet.new.incomeDescription')}</p>
            </button>

            <SaveInstallmentDialog
              defaultValues={{ reference_date: date }}
              isVisible={installmentIsVisible}
              onClose={() => setInstallmentIsVisible(false)}
              onSave={(data, { reset }) => {
                postTransaction(
                  {
                    category_id: data.category?.id,
                    entries: data.entries.map((entry) => ({
                      amount: parseUSD(entry.amount) * -1,
                      reference_date: entry.reference_date,
                    })),
                    name: data.name,
                    note: data.note,
                    type: 'installment',
                  },
                  {
                    onSuccess: () => {
                      setInstallmentIsVisible(false);
                      reset();
                    },
                  },
                );
              }}
              isLoading={
                isPostTransactionPending && postTransactionVariables?.type === 'installment'
              }
            />
            <button
              onClick={() => setInstallmentIsVisible(true)}
              className="flex h-28 w-full max-w-2xs cursor-pointer flex-col gap-4 rounded border border-amber-200 bg-amber-50 p-2 text-left shadow"
            >
              <div className="flex items-center gap-2">
                <SquareDivideIcon strokeWidth={1.5} className="size-6 text-amber-500" />

                <h3 className="font-medium">{t('wallet.transactionTypes.installment')}</h3>
              </div>

              <p className="text-muted-foreground text-sm">
                {t('wallet.new.installmentDescription')}
              </p>
            </button>
          </div>
        </Card>
      </main>
    </Page>
  );
};
