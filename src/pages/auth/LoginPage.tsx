import { useEffect, type FC } from 'react';
import { Button } from '../../components/commons/Button';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { LINKS } from '../../constants/links';
import { env } from '../../utils/functions';
import { useSession } from '../../hooks/useSession';
import type { SessionUser } from '../../utils/types';
import { ROUTES } from '../../constants/routes';
import { toast } from 'sonner';
import { usePostLoginGoogle } from '../../hooks/mutations/usePostLoginGoogle';
import { Page } from '../../components/commons/Page';
import { Card } from '../../components/commons/Card';
import { useTranslation } from 'react-i18next';

export const LoginPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const googleCallback = searchParams.get('code');
  const { login, sessionUser } = useSession();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { mutate: loginGoogle, isPending: loginGoogleIsPending } = usePostLoginGoogle({
    onSuccess: (data) => {
      login(data.data!.user! as SessionUser, data.data!.access_token!);
      navigate(ROUTES.HOME);
    },
    onError: () => {
      toast.error(t('auth.errors.googleLogin'));
    },
  });

  useEffect(() => {
    if (googleCallback) {
      loginGoogle(googleCallback);
      setSearchParams(new URLSearchParams());
    } else if (sessionUser) {
      navigate(ROUTES.HOME);
    }
  }, [googleCallback, loginGoogle, navigate, sessionUser, setSearchParams]);

  useEffect(() => {
    const logoutMessage = sessionStorage.getItem('logout_message');

    if (logoutMessage) {
      toast.error(logoutMessage);
      sessionStorage.removeItem('logout_message');
    }
  }, []);

  if (sessionUser) {
    return null;
  }

  return (
    <Page>
      <main className="flex h-screen w-full items-center justify-center px-2">
        <Card wrapperClassName="w-full max-w-96">
          <h1 className="text-xl font-medium">{t('auth.title')}</h1>
          <p className="text-sm text-zinc-400">{t('auth.subtitle')}</p>

          <Link
            to={LINKS.GOOGLE_AUTH.replace(':client_id', env().GOOGLE_CLIENT_ID).replace(
              ':redirect_uri',
              env().GOOGLE_AUTH_REDIRECT_URI,
            )}
          >
            <Button disabled={loginGoogleIsPending} className="mt-6" variant="outlined" size="wide">
              <img src="/google_48.webp" alt={t('common.alt.googleIcon')} className="size-4" />
              {t('auth.continueWithGoogle')}
            </Button>
          </Link>

          <p className="mt-6 text-center text-sm text-zinc-400">{t('auth.terms')}</p>
        </Card>
      </main>
    </Page>
  );
};
