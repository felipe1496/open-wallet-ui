import { client } from './client';
import type { QueryOpts } from '../utils/types';

export const TransactionsService = {
  async getEntries(period: string, queryOpts?: QueryOpts) {
    const response = await client.get<{
      data: {
        entries: {
          id: string;
          transaction_id: string;
          name: string;
          description?: string | null;
          amount: number;
          period: string;
          user_id: string;
          type: string;
          total_amount: number;
          installment: number;
          total_installments: number;
          created_at: string;
          reference_date: string;
          category_id?: string | null;
          category_name?: string | null;
          category_color?: string | null;
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
    reference_date: string;
    description?: string | null;
    category_id?: string | null;
  }) {
    const response = await client.post<{
      data: {
        entry: {
          id: string;
          transaction_id: string;
          name: string;
          description?: string | null;
          amount: number;
          period: string;
          user_id: string;
          type: string;
          total_amount: number;
          installment: number;
          total_installments: number;
          created_at: string;
          reference_date: string;
          category_id?: string | null;
          category_name?: string | null;
          category_color?: string | null;
        };
      };
    }>('/v1/transactions/simple-expense', payload);

    return response.data;
  },
  async deleteTransaction(id: string) {
    await client.delete(`/v1/transactions/${id}`);
  },

  async postIncome(payload: {
    name: string;
    amount: number;
    reference_date: string;
    description?: string | null;
    category_id?: string | null;
  }) {
    const response = await client.post<{
      data: {
        entry: {
          id: string;
          transaction_id: string;
          name: string;
          description?: string | null;
          amount: number;
          period: string;
          user_id: string;
          type: string;
          total_amount: number;
          installment: number;
          total_installments: number;
          created_at: string;
          reference_date: string;
          category_id?: string | null;
          category_name?: string | null;
          category_color?: string | null;
        };
      };
    }>('/v1/transactions/income', payload);

    return response.data;
  },
  async postInstallment(payload: {
    name: string;
    description?: string | null;
    total_amount: number;
    total_installments: number;
    reference_date: string;
    category_id?: string | null;
  }) {
    const response = await client.post<{
      data: {
        entries: {
          id: string;
          transaction_id: string;
          name: string;
          description?: string | null;
          amount: number;
          period: string;
          user_id: string;
          type: string;
          total_amount: number;
          installment: number;
          total_installments: number;
          created_at: string;
          reference_date: string;
          category_id?: string | null;
          category_name?: string | null;
          category_color?: string | null;
        }[];
      };
    }>('/v1/transactions/installment', payload);

    return response.data;
  },
  async patchSimpleExpense({
    id,
    payload,
  }: {
    id: string;
    payload: {
      name?: string;
      description?: string;
      amount?: number;
      reference_date?: string;
      category_id?: string;
    };
  }) {
    const response = await client.patch<{
      id: string;
      transaction_id: string;
      name: string;
      description: string | null;
      amount: number;
      period: string;
      user_id: string;
      type: string;
      total_amount: number;
      installment: number;
      total_installments: number;
      created_at: string;
      reference_date: string;
      category_id?: string | null;
      category_name?: string | null;
      category_color?: string | null;
    }>(`/v1/transactions/simple-expense/${id}`, payload);

    return response.data;
  },

  async patchIncome({
    id,
    payload,
  }: {
    id: string;
    payload: {
      name?: string;
      description?: string;
      amount?: number;
      reference_date?: string;
      category_id?: string;
    };
  }) {
    const response = await client.patch<{
      id: string;
      transaction_id: string;
      name: string;
      description: string | null;
      amount: number;
      period: string;
      user_id: string;
      type: string;
      total_amount: number;
      installment: number;
      total_installments: number;
      created_at: string;
      reference_date: string;
      category_id?: string | null;
      category_name?: string | null;
      category_color?: string | null;
    }>(`/v1/transactions/income/${id}`, payload);

    return response.data;
  },
};
