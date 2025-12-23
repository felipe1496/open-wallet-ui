import type { FC } from 'react';
import { Link, useLocation } from 'react-router';
import { ROUTES } from '../constants/routes';
import { cn } from '../utils/functions';
import { HomeIcon, TagsIcon, WalletMinimalIcon } from 'lucide-react';

export const NavBar: FC = () => {
  const location = useLocation();
  return (
    <aside className="fixed left-0 flex h-screen w-72 flex-col bg-zinc-800 pt-12">
      <Link
        to={ROUTES.HOME}
        className={cn(
          'flex items-center gap-2 py-2 pl-12',
          location.pathname === ROUTES.HOME ? 'text-zinc-50' : 'text-zinc-400',
        )}
      >
        <HomeIcon className="size-7" />
        Home
      </Link>
      <Link
        to={ROUTES.WALLET.LIST}
        className={cn(
          'mt-2 flex items-center gap-2 py-2 pl-12',
          location.pathname.startsWith(ROUTES.WALLET.LIST) ? 'text-zinc-50' : 'text-zinc-400',
        )}
      >
        <WalletMinimalIcon className="size-7" />
        Wallet
      </Link>
      <Link
        to="#"
        className={cn(
          'mt-2 flex items-center gap-2 py-2 pl-12',
          location.pathname.startsWith('a') ? 'text-zinc-50' : 'text-zinc-400',
        )}
      >
        <TagsIcon className="size-7" /> Categories
      </Link>
    </aside>
  );
};
