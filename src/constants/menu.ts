import { ChartPieIcon, RepeatIcon, TagsIcon, WalletMinimalIcon } from 'lucide-react';
import { ROUTES } from './routes';

export const MENU = {
  ITEMS: [
    {
      labelKey: 'navigation.dashboard',
      route: ROUTES.DASHBOARD,
      icon: ChartPieIcon,
    },
    {
      labelKey: 'navigation.wallet',
      route: ROUTES.WALLET.INDEX,
      icon: WalletMinimalIcon,
    },
    {
      labelKey: 'navigation.categories',
      route: ROUTES.CATEGORIES.INDEX,
      icon: TagsIcon,
    },
    {
      labelKey: 'navigation.recurrences',
      route: ROUTES.RECURRENCES.INDEX,
      icon: RepeatIcon,
    },
  ],
} as const;
