import { Route, Routes } from 'react-router';
import { LoginPage } from './pages/auth/LoginPage';
import { ROUTES } from './constants/routes';
import { HomePage } from './pages/HomePage';
import { Layout } from './components/Layout';
import { WalletPage } from './pages/wallet/WalletPage';
import { NewTransactionPage } from './pages/wallet/NewTransactionPage';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  type QueryKey,
} from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { useEffect } from 'react';
import { useSessionStore } from './stores/useSessionStore';
import { ConfirmDialog } from './components/commons/ConfirmDialog';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidateQuery?: QueryKey;
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
        queryClient.invalidateQueries({
          queryKey: mutation.meta.invalidateQuery,
        });
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
  const { sessionIsSettled, startUpSession } = useSessionStore();

  useEffect(() => {
    startUpSession();
  }, [startUpSession]);

  if (!sessionIsSettled) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors theme="dark" position="top-center" />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.WALLET.LIST} element={<WalletPage />} />
          <Route path={ROUTES.WALLET.NEW} element={<NewTransactionPage />} />
        </Route>
      </Routes>
      <ConfirmDialog />
    </QueryClientProvider>
  );
}

export default App;
