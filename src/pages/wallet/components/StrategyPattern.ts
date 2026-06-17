import { formatCurrency } from '../../../utils/functions';
import type { Entry } from '../../../queries/transactions-queries';
import type { QueryClient } from '@tanstack/react-query';
import type { Api } from '../../../api/api';
import type { SaveIncomeDialog } from './SaveIncomeDialog';
import type { SaveSimpleExpenseDialog } from './SaveSimpleExpenseDialog';
import type { SaveInstallmentDialog } from './SaveInstallmentDialog';
import type { ComponentProps } from 'react';

type Deps = {
  setIsEditingExpense: (
    values: {
      id: string;
      defaultValues: NonNullable<ComponentProps<typeof SaveSimpleExpenseDialog>['defaultValues']>;
    } | null,
  ) => void;
  setIsEditingIncome: (
    values: {
      id: string;
      defaultValues: NonNullable<ComponentProps<typeof SaveIncomeDialog>['defaultValues']>;
    } | null,
  ) => void;
  setIsEditingInstallment: (
    values: {
      transaction_id: string;
      defaultValues: NonNullable<ComponentProps<typeof SaveInstallmentDialog>['defaultValues']>;
    } | null,
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
  queryClient: QueryClient;
  api: Api<unknown>;
};

type InstallmentDefaultValues = NonNullable<
  ComponentProps<typeof SaveInstallmentDialog>['defaultValues']
>;

function buildCategory(entry: Entry) {
  if (!entry.category_id) return null;

  return {
    id: entry.category_id,
    value: {
      id: entry.category_id,
      name: entry.category_name,
      color: entry.category_color,
    },
    label: entry.category_name,
  };
}

function buildDefaultValues(entry: Entry) {
  return {
    name: entry.name!,
    amount: formatCurrency(Math.abs(entry.amount!)),
    description: entry.description || '',
    date: entry.reference_date!.substring(0, 10),
    category: buildCategory(entry),
  };
}

type Strategy = (entry: Entry) => Promise<void> | void;

export function createStrategy(deps: Deps): Record<string, Strategy> {
  return {
    simple_expense: (entry) => {
      const defaultValues = buildDefaultValues(entry);

      deps.setIsEditingExpense({
        id: entry.transaction_id!,
        defaultValues,
      });
    },

    income: (entry) => {
      const defaultValues = buildDefaultValues(entry);

      deps.setIsEditingIncome({
        id: entry.transaction_id!,
        defaultValues,
      });
    },

    installment: async (entry) => {
      deps.setIsLoading(true);

      let installmentEntries: Entry[] = [];
      try {
        installmentEntries = await deps.queryClient.fetchQuery({
          queryKey: ['installment-entries', entry.transaction_id],
          queryFn: async () => {
            return deps.api.transactions
              .v1ListEntries({
                filter: `transaction_id eq '${entry.transaction_id}'`,
                order_by: 'reference_date:asc',
              })
              .then((res) => res.data.data?.entries || []);
          },
        });
      } finally {
        deps.setIsLoading(false);
      }

      const initialReferenceDate = installmentEntries[0]?.reference_date?.substring(0, 10) ?? '';

      const defaultValues: InstallmentDefaultValues = {
        amount: formatCurrency(Math.abs(entry.total_amount!)),
        name: entry.name!,
        note: entry.description || '',
        installments: entry.total_installments!.toString(),
        reference_date: initialReferenceDate,
        category: buildCategory(entry) as InstallmentDefaultValues['category'], // This cast needs to be revised since the category structure might differ between simple entries and installments. Adjust the buildCategory function if necessary to ensure compatibility.
      };

      deps.setIsEditingInstallment({
        transaction_id: entry.transaction_id!,
        defaultValues,
      });
    },
  };
}
