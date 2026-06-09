import { useEffect, type FC } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { NavBar } from './NavBar';
import { useSession } from '../hooks/useSession';
import { ROUTES } from '../constants/routes';
import { ErrorBoundary } from './commons/ErrorBoundary';
import { useCollapsed } from '../hooks/useCollapsed';
import { cn } from '../utils/functions';
import { TopBar } from './TopBar';
import { useTranslation } from 'react-i18next';

export const Layout: FC = () => {
  const collapsed = useCollapsed((state) => state.isCollapsed);
  const { sessionUser } = useSession();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const logoutMessage = sessionStorage.getItem('logout_message');
    if (logoutMessage) {
      window.location.replace(ROUTES.LOGIN);
      return;
    }

    if (!sessionUser) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [sessionUser, navigate]);

  if (!sessionUser) {
    return null;
  }

  return (
    <div className={cn('transition-all', collapsed ? 'md:pl-20' : 'md:pl-56', 'pt-14 md:pt-0')}>
      <NavBar />
      <TopBar />
      <ErrorBoundary
        fallback={
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <img src="/error.webp" alt={t('common.alt.errorImage')} className="size-12" />
            <h1 className="text-xl font-medium">{t('common.errors.unexpected')}</h1>
          </div>
        }
      >
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};
