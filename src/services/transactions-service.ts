import { API } from '../api/API';
import type { QueryOpts } from '../utils/types';

export const TransactionsService = {
  async getEntries(period: string, queryOpts?: QueryOpts) {
    const response = await API.get<{
      data: {
        entries: {
          id: string;
          transaction_id: string;
          name: string;
          descriptions?: string | null;
          amount: number;
          period: string;
          user_id: string;
          type: string;
          total_amount: number;
          installment: number;
          total_installments: number;
          created_at: string;
        }[];
      };
      query: {
        page: number;
        per_page: number;
        next_page: boolean;
        total_pages: number;
        total_items: number;
      };
    }>(`/v1/transactions/entries/${period}`, {
      params: queryOpts,
    });

    return response.data;
  },
  async postSimpleExpense(payload: {
    name: string;
    amount: number;
    period: string;
    description?: string | null;
  }) {
    const response = await API.post<{
      data: {
        entry: {
          id: string;
          transaction_id: string;
          description?: string | null;
          amount: number;
          period: string;
          user_id: string;
          type: string;
          total_amount: number;
          installment: number;
          total_installments: number;
        };
      };
    }>('/v1/transactions/simple-expense', payload);

    return response.data;
  },
  async deleteTransaction(id: string) {
    await API.delete(`/v1/transactions/${id}`);
  },
};
