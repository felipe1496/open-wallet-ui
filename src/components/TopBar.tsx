import { useState, type FC } from 'react';
import { Button } from './commons/Button';
import { ChevronDown, LogOutIcon, PanelLeftIcon } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from './commons/Drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './commons/DropdownMenu';
import { cn } from '../utils/functions';
import { Avatar, AvatarFallback, AvatarImage } from './commons/Avatar';
import { useSession } from '../hooks/useSession';
import { useNavigate, useLocation } from 'react-router';
import { ROUTES } from '../constants/routes';
import { MENU } from '../constants/menu';
import { Zelda } from './commons/Zelda';

export const TopBar: FC = () => {
  const sessionUser = useSession((state) => state.sessionUser);
  const logout = useSession((state) => state.logout);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 z-10 flex h-14 w-screen items-center justify-between border-b border-zinc-300 bg-white px-1 shadow-sm md:hidden">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button className="size-10 rounded-full" size="sm" variant="ghost">
            <PanelLeftIcon className="text-muted-foreground size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4 pt-8">
          {MENU.ITEMS.map((item, idx) => (
            <Zelda
              key={`drawer-item-${item.label.trim().toLocaleLowerCase()}-${idx}`}
              onClick={() => setIsOpen(false)}
              to={item.route}
              className={cn(
                'flex h-12 items-center gap-3 rounded px-4 transition-colors hover:bg-zinc-200',
                location.pathname.startsWith(item.route) && 'bg-zinc-200',
              )}
              keepQueryParams
            >
              <item.icon className="size-5 shrink-0" />
              {item.label}
            </Zelda>
          ))}
        </DrawerContent>
      </Drawer>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div
            className={cn(
              'flex cursor-pointer items-center justify-between gap-2 rounded py-2 transition-colors hover:bg-zinc-200',
            )}
          >
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={sessionUser?.avatar_url}
                  alt="Profile picture"
                  className="size-6 shrink-0 rounded-full"
                />
                <AvatarFallback>
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-500">
                    <span className="text-xs font-medium text-zinc-800">
                      {sessionUser?.name[0]}
                    </span>
                  </div>
                </AvatarFallback>
              </Avatar>
            </div>
            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
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
    </header>
  );
};
