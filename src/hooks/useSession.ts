import { createStore } from '../utils/functions';
import type { SessionUser } from '../utils/types';
import { useCollapsed } from './useCollapsed';

interface States {
  sessionUser: SessionUser | null;
  sessionIsSettled: boolean;
}

interface Actions {
  login: (user: SessionUser, accessToken?: string) => void;
  logout: (logoutMessage?: string) => void;
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
  logout: (logoutMessage?: string) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('session_user');

    if (logoutMessage) {
      sessionStorage.setItem('logout_message', logoutMessage);
    }

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
    const storedCollapsed = localStorage.getItem('NAV_BAR_COLLAPSED');
    if (storedCollapsed && storedCollapsed === 'true') {
      useCollapsed.setState({ isCollapsed: true });
    }
  },
}));
