import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { XIcon } from 'lucide-react';
import type { ComponentProps, FC, HTMLAttributes } from 'react';
import { cn } from '../../utils/functions';

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;

export const DrawerContent: FC<
  ComponentProps<typeof DrawerPrimitive.Content> & { isClosable?: boolean }
> = ({ children, className, isClosable = true, ...props }) => (
  <DrawerPrimitive.Portal>
    <DrawerPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs" />
    <DrawerPrimitive.Viewport>
      <DrawerPrimitive.Popup
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen w-full max-w-64 flex-col rounded-md bg-white shadow-md',
          'data-open:animate-drawer-in',
          'data-closed:animate-drawer-out',
          className,
        )}
      >
        <DrawerPrimitive.Content {...props}>
          {isClosable && (
            <DrawerPrimitive.Close
              className="text-muted-foreground absolute top-2 right-3 cursor-pointer rounded-full p-1 transition-all hover:bg-zinc-100 hover:text-red-500"
              render={
                <button>
                  <XIcon className="size-6" />
                </button>
              }
            />
          )}
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPrimitive.Portal>
);
export const DrawerSwipeArea = DrawerPrimitive.SwipeArea;

export const DrawerHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn('border-b border-zinc-300 px-4 py-2', className)} {...props} />;
};
export const DrawerTitle: FC<ComponentProps<typeof DrawerPrimitive.Title>> = ({
  className,
  ...props
}) => <DrawerPrimitive.Title className={cn('text-xl font-medium', className)} {...props} />;

export const DrawerDescription = DrawerPrimitive.Description;
export const DrawerClose = DrawerPrimitive.Close;
