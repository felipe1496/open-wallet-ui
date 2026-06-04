import { Menu as PrimitiveDropdownMenu } from '@base-ui/react/menu';
import type { ComponentProps, FC } from 'react';
import { cn } from '../../utils/functions';

type DropdownMenuPopupProps = React.ComponentPropsWithoutRef<typeof PrimitiveDropdownMenu.Popup>;
type DropdownMenuPositionerProps = React.ComponentPropsWithoutRef<
  typeof PrimitiveDropdownMenu.Positioner
>;
type DropdownMenuContentProps = DropdownMenuPopupProps &
  Omit<
    DropdownMenuPositionerProps,
    keyof DropdownMenuPopupProps | 'className' | 'style' | 'render'
  >; // Positioner deals with geomtry, while Popup is the actual content.

export const DropdownMenu = PrimitiveDropdownMenu.Root;
export const DropdownMenuTrigger = PrimitiveDropdownMenu.Trigger;
export const DropdownMenuContent: FC<DropdownMenuContentProps> = ({
  className,
  align = 'center',
  sideOffset,
  side,
  collisionPadding,
  collisionAvoidance,
  ...props
}) => (
  <PrimitiveDropdownMenu.Portal>
    <PrimitiveDropdownMenu.Positioner
      className={'z-60'}
      align={align}
      side={side}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      collisionAvoidance={collisionAvoidance}
    >
      <PrimitiveDropdownMenu.Popup
        className={cn('rounded border border-zinc-300 bg-zinc-50 shadow-md', className)}
        {...props}
      />
    </PrimitiveDropdownMenu.Positioner>
  </PrimitiveDropdownMenu.Portal>
);
export const DropdownMenuLabel = PrimitiveDropdownMenu.GroupLabel;
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
export const DropdownMenuSub = PrimitiveDropdownMenu.SubmenuRoot;
export const DropdownMenuSubTrigger = PrimitiveDropdownMenu.SubmenuTrigger;
export const DropdownMenuSeparator = PrimitiveDropdownMenu.Separator;
export const DropdownMenuArrow = PrimitiveDropdownMenu.Arrow;
