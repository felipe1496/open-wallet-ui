import { useEffect, type FC } from 'react';
import { Button } from '../../components/commons/Button';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { LINKS } from '../../constants/links';
import { cn, env } from '../../utils/functions';
import { useSession } from '../../hooks/useSession';
import type { SessionUser } from '../../utils/types';
import { ROUTES } from '../../constants/routes';
import { toast } from 'sonner';
import { usePostLoginGoogle } from '../../hooks/mutations/usePostLoginGoogle';
import { Page } from '../../components/commons/Page';
import { Card } from '../../components/commons/Card';

export const LoginPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const googleCallback = searchParams.get('code');
  const { login, sessionUser } = useSession();
  const navigate = useNavigate();

  const { mutate: loginGoogle, isPending: loginGoogleIsPending } = usePostLoginGoogle({
    onSuccess: (data) => {
      login(data.data!.user! as SessionUser, data.data!.access_token!);
      navigate(ROUTES.HOME);
    },
    onError: () => {
      toast.error('It was not possible to login with Google');
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
          <h1 className="text-xl font-medium">Welcome to Money</h1>
          <p className="text-sm text-zinc-400">Log in with your favorite provider</p>

          <Button
            aria-disabled={loginGoogleIsPending}
            tabIndex={loginGoogleIsPending ? -1 : undefined}
            className={cn('mt-6', loginGoogleIsPending && 'pointer-events-none opacity-50')}
            variant="outlined"
            size="wide"
            nativeButton={false}
            render={
              <Link
                to={LINKS.GOOGLE_AUTH.replace(':client_id', env().GOOGLE_CLIENT_ID).replace(
                  ':redirect_uri',
                  env().GOOGLE_AUTH_REDIRECT_URI,
                )}
              />
            }
          >
            <img src="/google_48.webp" alt="google icon" className="size-4" />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            By continuing, you agree to money's Terms of Service and Privacy Policy.
          </p>
        </Card>
      </main>
    </Page>
  );
};
