import * as PrimitiveDropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ComponentProps, FC } from 'react';
import { cn } from '../../utils/functions';

export const DropdownMenu = PrimitiveDropdownMenu.Root;
export const DropdownMenuTrigger = PrimitiveDropdownMenu.Trigger;
export const DropdownMenuContent: FC<ComponentProps<typeof PrimitiveDropdownMenu.Content>> = ({
  className,
  ...props
}) => (
  <PrimitiveDropdownMenu.Portal>
    <PrimitiveDropdownMenu.Content
      className={cn('rounded border border-zinc-300 bg-zinc-50 shadow-md', className)}
      {...props}
    />
  </PrimitiveDropdownMenu.Portal>
);
export const DropdownMenuLabel = PrimitiveDropdownMenu.Label;
export const DropdownMenuItem: FC<ComponentProps<typeof PrimitiveDropdownMenu.Item>> = ({
  className,
  ...props
}) => (
  <PrimitiveDropdownMenu.Item
    className={cn('cursor-pointer rounded p-2 transition-all hover:bg-zinc-900', className)}
    {...props}
  />
);
export const DropdownMenuCheckboxItem = PrimitiveDropdownMenu.CheckboxItem;
export const DropdownMenuRadioGroup = PrimitiveDropdownMenu.RadioGroup;
export const DropdownMenuRadioItem = PrimitiveDropdownMenu.RadioItem;
export const DropdownMenuSub = PrimitiveDropdownMenu.Sub;
export const DropdownMenuSubTrigger = PrimitiveDropdownMenu.SubTrigger;
export const DropdownMenuSubContent = PrimitiveDropdownMenu.SubContent;
export const DropdownMenuSeparator = PrimitiveDropdownMenu.Separator;
export const DropdownMenuArrow = PrimitiveDropdownMenu.Arrow;
