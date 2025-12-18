import { createStore } from '../utils/functions';

interface States {
  isVisible: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
}

interface Actions {
  add: (title: string, description: string, onConfirm: () => void) => void;
  setIsVisible: (isVisible: boolean) => void;
}

const initialState: States = {
  isVisible: false,
  title: '',
  description: '',
  onConfirm: () => {},
};

export const useConfirmStore = createStore<States & Actions>()((set) => ({
  ...initialState,
  add: (title: string, description: string, onConfirm: () => void) => {
    set({ isVisible: true, title, description, onConfirm });
  },
  setIsVisible: (isVisible: boolean) => {
    set({ isVisible });
  },
}));
