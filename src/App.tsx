import { Route, Routes } from 'react-router';
import { LoginPage } from './pages/auth/LoginPage';
import { ROUTES } from './constants/routes';
import { Layout } from './components/Layout';
import { WalletPage } from './pages/wallet/WalletPage';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  type QueryKey,
} from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { useEffect } from 'react';
import { useSession } from './hooks/useSession';
import { ConfirmDialog } from './components/commons/ConfirmDialog';
import { NewTransactionPage } from './pages/wallet/NewTransactionPage';
import { CategoriesPage } from './pages/categories/CategoriesPage';
import { Tooltip as PrimitiveTooltip } from '@base-ui/react/tooltip';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { RecurrencesPage } from './pages/recurrences/RecurrencesPage';
import { DialogLoader } from './components/DialogLoader';
import { ApiProvider } from './providers/ApiProvider';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidateQuery?: QueryKey[];
      successNotification?: string;
      errorNotification?: string;
    };
  }
}

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.successNotification) {
        toast.success(mutation.meta.successNotification);
      }
    },
    onError: (_error, _variables, _context, mutation) => {
      if (mutation.meta?.errorNotification) {
        toast.error(mutation.meta?.errorNotification);
      }
    },
    onSettled: (_data, _error, _variables, _context, mutation) => {
      if (mutation.meta?.invalidateQuery) {
        for (const queryKey of mutation.meta.invalidateQuery) {
          queryClient.invalidateQueries({ queryKey });
        }
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  const { sessionIsSettled, startUpSession } = useSession();

  useEffect(() => {
    startUpSession();
  }, [startUpSession]);

  if (!sessionIsSettled) return null;

  return (
    <ApiProvider>
      <QueryClientProvider client={queryClient}>
        <PrimitiveTooltip.Provider delay={300}>
          <Toaster richColors position="bottom-left" />
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.WALLET.INDEX} element={<WalletPage />} />
              <Route path={ROUTES.WALLET.NEW_TRANSACTION} element={<NewTransactionPage />} />
              <Route path={ROUTES.HOME} element={<WalletPage />} />
              <Route path={ROUTES.CATEGORIES.INDEX} element={<CategoriesPage />} />
              <Route path={ROUTES.RECURRENCES.INDEX} element={<RecurrencesPage />} />
            </Route>
          </Routes>
          <DialogLoader />
          <ConfirmDialog />
        </PrimitiveTooltip.Provider>
      </QueryClientProvider>
    </ApiProvider>
  );
}

export default App;
