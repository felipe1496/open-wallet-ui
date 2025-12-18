import { ChevronDown, LogOutIcon } from 'lucide-react';
import type { FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './commons/DropdownMenu';
import { useSessionStore } from '../stores/useSessionStore';
import { useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes';
import { Avatar, AvatarFallback, AvatarImage } from './commons/Avatar';
import { PeriodPickerCustom } from './commons/PeriodPickerCustom';

import { MONTHS_FULL } from '../constants/dates';
import { useCtx } from '../hooks/useCtx';

export const TopBar: FC = () => {
  const { logout, sessionUser } = useSessionStore();
  const { period, setPeriod } = useCtx();

  const navigate = useNavigate();

  if (sessionUser) {
    return (
      <header className="fixed top-0 flex h-16 w-[calc(100vw-18rem)] items-center justify-end gap-2 px-8">
        <PeriodPickerCustom value={period} onChange={setPeriod} align="center">
          <div className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-950 p-2 text-sm">
            {`${MONTHS_FULL[period.month]} de ${period.year}`}
          </div>
        </PeriodPickerCustom>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-zinc-950 p-2 text-sm">
              <Avatar>
                <AvatarImage
                  src={sessionUser.avatar_url}
                  alt="Profile picture"
                  className="size-6 rounded-full"
                />
                <AvatarFallback>
                  <div className="flex size-6 items-center justify-center rounded-full bg-orange-500">
                    <span className="text-xs font-medium text-zinc-800">{sessionUser.name[0]}</span>
                  </div>
                </AvatarFallback>
              </Avatar>
              {sessionUser.name}
              <ChevronDown className="size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-1 w-54" align="end">
            <DropdownMenuItem
              className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-950"
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
      </header>
    );
  }

  return null;
};
