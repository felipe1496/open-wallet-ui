import { client } from './client';
import type { QueryOpts } from '../utils/types';

export const CategoriesService = {
  async getCategoriesPerPeriod(period: string, queryOpts?: QueryOpts) {
    const response = await client.get<{
      data: {
        categories: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          period: string;
          total_amount: number;
        }[];
      };
      query: {
        page: number;
        per_page: number;
        next_page: boolean;
        total_pages: number;
        total_items: number;
      };
    }>(`/v1/categories/${period}`, { params: queryOpts });

    return response.data;
  },
  async getCategories(queryOpts?: QueryOpts) {
    const response = await client.get<{
      data: {
        categories: {
          id: string;
          user_id: string;
          name: string;
          color: string;
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
    }>(`/v1/categories`, { params: queryOpts });

    return response.data;
  },
  async postCategory(payload: { name: string; color: string }) {
    const response = await client.post<{
      data: {
        category: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
        };
      };
    }>('/v1/categories', payload);

    return response.data;
  },
  async deleteCategory(id: string) {
    await client.delete(`/v1/categories/${id}`);
  },
  async patchCategory(params: {
    id: string;
    payload: {
      name?: string;
      color?: string;
    };
  }) {
    const response = await client.patch<{
      data: {
        category: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
        };
      };
    }>(`/v1/categories/${params.id}`, params.payload);

    return response.data;
  },
};
