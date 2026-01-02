import { createStore } from '../utils/functions';
import type { SessionUser } from '../utils/types';

interface States {
  sessionUser: SessionUser | null;
  sessionIsSettled: boolean;
}

interface Actions {
  login: (user: SessionUser, accessToken?: string) => void;
  logout: () => void;
  startUpSession: () => void;
}

const initialState: States = {
  sessionUser: null,
  sessionIsSettled: false,
};

export const useSession = createStore<States & Actions>()((set) => ({
  ...initialState,
  login: (user: SessionUser, accessToken?: string) => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    }
    localStorage.setItem('session_user', JSON.stringify(user));
    set({ sessionUser: user });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('session_user');
    set({ sessionUser: null });
  },
  startUpSession: () => {
    const storedUser = localStorage.getItem('session_user');
    const accessToken = localStorage.getItem('access_token');

    if (storedUser && accessToken) {
      set({ sessionUser: JSON.parse(storedUser) });
    } else {
      set({ sessionUser: null });
    }

    set({ sessionIsSettled: true });
  },
}));
