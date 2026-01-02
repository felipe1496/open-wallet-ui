import type { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes';
import { cn } from '../utils/functions';
import { ChevronDown, HomeIcon, LogOutIcon, TagsIcon, WalletMinimalIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './commons/DropdownMenu';
import { Avatar, AvatarFallback, AvatarImage } from './commons/Avatar';
import { useSession } from '../hooks/useSession';
import { Zelda } from './commons/Zelda';

export const NavBar: FC = () => {
  const location = useLocation();
  const { sessionUser, logout } = useSession();

  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 flex h-screen w-56 flex-col justify-between p-4">
      <nav className="flex flex-col gap-1">
        <Zelda
          to={ROUTES.HOME}
          className={cn(
            'flex items-center gap-3 rounded px-4 py-3 transition-colors hover:bg-zinc-200',
            location.pathname === ROUTES.HOME && 'bg-zinc-200',
          )}
          keepQueryParams
        >
          <HomeIcon className="size-5" />
          Dashboard
        </Zelda>
        <Zelda
          to={ROUTES.WALLET.LIST}
          className={cn(
            'flex items-center gap-3 rounded px-4 py-3 transition-colors hover:bg-zinc-200',
            location.pathname.startsWith(ROUTES.WALLET.LIST) && 'bg-zinc-200',
          )}
          keepQueryParams
        >
          <WalletMinimalIcon className="size-5" />
          Wallet
        </Zelda>
        <Zelda
          to={ROUTES.CATEGORIES.LIST}
          className={cn(
            'flex items-center gap-3 rounded px-4 py-3 transition-colors hover:bg-zinc-200',
            location.pathname.startsWith(ROUTES.CATEGORIES.LIST) && 'bg-zinc-200',
          )}
          keepQueryParams
        >
          <TagsIcon className="size-5" /> Categories
        </Zelda>
      </nav>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full">
            <div className="flex w-full cursor-pointer items-center justify-between gap-2 rounded px-4 py-2 transition-colors hover:bg-zinc-200">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={sessionUser?.avatar_url}
                    alt="Profile picture"
                    className="size-6 rounded-full"
                  />
                  <AvatarFallback>
                    <div className="flex size-6 items-center justify-center rounded-full bg-orange-500">
                      <span className="text-xs font-medium text-zinc-800">
                        {sessionUser?.name[0]}
                      </span>
                    </div>
                  </AvatarFallback>
                </Avatar>
                {sessionUser?.name.split(' ')[0]}
              </div>
              <ChevronDown className="size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="end">
            <DropdownMenuItem
              className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50"
              onClick={() => {
                logout();
                navigate(ROUTES.LOGIN);
              }}
            >
              <LogOutIcon className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
