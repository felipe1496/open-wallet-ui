import { useState, type FC, type ReactNode } from 'react';
import { Api } from '../api/api';
import { env } from '../utils/functions';
import { ApiContext } from './ApiContext';
import { useSession } from '../hooks/useSession';
import { useTranslation } from 'react-i18next';

export interface ApiProviderProps {
  children: ReactNode;
  apiClient?: Api<unknown>;
}

export const ApiProvider: FC<ApiProviderProps> = ({ children, apiClient }) => {
  const { t } = useTranslation();
  const [api] = useState<Api<unknown>>(() => {
    if (apiClient) {
      return apiClient;
    }

    const defaultApi = new Api({
      baseUrl: env().API_URL,
      securityWorker: () => {
        const token = localStorage.getItem('access_token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      },
      customFetch: async (...fetchParams) => {
        const response = await fetch(...fetchParams);

        if (response.status === 401) {
          useSession.getState().logout(t('session.expired'));
        }
        return response;
      },
    });

    return defaultApi;
  });

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
