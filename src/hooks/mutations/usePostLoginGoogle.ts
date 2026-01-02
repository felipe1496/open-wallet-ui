import { useMutation } from '@tanstack/react-query';
import type { MutationOpts, SessionUser } from '../../utils/types';
import { client } from '../../services/client';

export function usePostLoginGoogle({
  mutationKey = [],
  ...props
}: MutationOpts<
  {
    data: {
      user: SessionUser;
      access_token: string;
    };
  },
  string
> = {}) {
  return useMutation({
    ...props,
    mutationKey: ['LOGIN_GOOGLE_MUTATION', ...mutationKey],
    mutationFn: async (code) => {
      const response = await client.post('/v1/auth/login/google', {
        code,
      });

      return response.data;
    },
  });
}
