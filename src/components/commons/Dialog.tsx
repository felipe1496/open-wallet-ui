import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import type { ComponentProps, FC, HTMLAttributes } from 'react';
import { cn } from '../../utils/functions';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent: FC<ComponentProps<typeof DialogPrimitive.Content>> = ({
  children,
  className,
  ...props
}) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs" />
    <DialogPrimitive.Content
      className={cn(
        'fixed top-[50%] left-[50%] z-50 flex w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] flex-col rounded-md bg-white shadow-md',
        className,
      )}
      {...props}
    >
      <DialogClose
        className="text-muted-foreground absolute top-2 right-3 cursor-pointer rounded-full p-1 transition-all hover:bg-zinc-100 hover:text-red-500"
        asChild
      >
        <button>
          <XIcon className="size-6" />
        </button>
      </DialogClose>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);
export const DialogHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn('border-b border-zinc-300 px-4 py-2', className)} {...props} />;
};
export const DialogTitle: FC<ComponentProps<typeof DialogPrimitive.Title>> = ({
  className,
  ...props
}) => <DialogPrimitive.Title className={cn('text-xl font-medium', className)} {...props} />;

export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;
