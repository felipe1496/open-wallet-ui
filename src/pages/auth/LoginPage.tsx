import { useEffect, type FC } from 'react';
import { Button } from '../../components/commons/Button';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { LINKS } from '../../constants/links';
import { env } from '../../utils/functions';
import { useSession } from '../../hooks/useSession';
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
      login(data.data.user, data.data.access_token);
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

  if (sessionUser) {
    return null;
  }

  return (
    <Page>
      <main className="flex h-screen w-full items-center justify-center">
        <Card className="w-full max-w-96">
          <h1 className="text-xl font-medium">Welcome to Money</h1>
          <p className="text-sm text-zinc-400">Log in with your favorite provider</p>

          <Link
            to={LINKS.GOOGLE_AUTH.replace(':client_id', env().GOOGLE_CLIENT_ID).replace(
              ':redirect_uri',
              env().GOOGLE_AUTH_REDIRECT_URI,
            )}
          >
            <Button disabled={loginGoogleIsPending} className="mt-6" variant="outlined" size="wide">
              <img src="/google_48.webp" alt="google icon" className="size-4" />
              Continue with Google
            </Button>
          </Link>

          <p className="mt-6 text-center text-sm text-zinc-400">
            By continuing, you agree to money's Terms of Service and Privacy Policy.
          </p>
        </Card>
      </main>
    </Page>
  );
};
