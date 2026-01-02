/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationOptions } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';

export interface ApiException {
  status: number;
  error: {
    message: string;
    type: string;
  };
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type MutationOpts<T = any, D = any> = Omit<
  UseMutationOptions<T, ApiException, D>,
  'mutationFn'
>;

export type QueryOpts = {
  page?: number;
  per_page?: number;
  order_by?: string;
  order?: 'asc' | 'desc';
  [key: string]: unknown;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  created_at: string;
  username: string;
};

export type FCC<T = object> = FC<{ children?: ReactNode } & T>;
