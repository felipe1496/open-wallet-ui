import * as DialogPrimitive from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';
import type { ComponentProps, FC, HTMLAttributes } from 'react';
import { cn } from '../../utils/functions';

export const Dialog = DialogPrimitive.Dialog.Root;
export const DialogTrigger = DialogPrimitive.Dialog.Trigger;

export const DialogContent: FC<
  ComponentProps<typeof DialogPrimitive.Dialog.Popup> & { isClosable?: boolean }
> = ({ children, className, isClosable = true, ...props }) => (
  <DialogPrimitive.Dialog.Portal>
    <DialogPrimitive.Dialog.Backdrop className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs" />
    <DialogPrimitive.Dialog.Popup
      className={cn(
        'fixed top-[50%] left-[50%] z-50 flex w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] flex-col rounded-md bg-white shadow-md',
        className,
      )}
      {...props}
    >
      {isClosable && (
        <DialogClose
          aria-label="Close"
          className="text-muted-foreground absolute top-2 right-3 cursor-pointer rounded-full p-1 transition-all hover:bg-zinc-100 hover:text-red-500"
        >
          <XIcon className="size-6" />
        </DialogClose>
      )}
      {children}
    </DialogPrimitive.Dialog.Popup>
  </DialogPrimitive.Dialog.Portal>
);
export const DialogHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn('border-b border-zinc-300 px-4 py-2', className)} {...props} />;
};
export const DialogTitle: FC<ComponentProps<typeof DialogPrimitive.Dialog.Title>> = ({
  className,
  ...props
}) => <DialogPrimitive.Dialog.Title className={cn('text-xl font-medium', className)} {...props} />;

export const DialogDescription = DialogPrimitive.Dialog.Description;
export const DialogClose = DialogPrimitive.Dialog.Close;
