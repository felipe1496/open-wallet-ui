import * as React from 'react';
import * as PopoverPrimitive from '@base-ui/react/popover';
import { cn } from '../../utils/functions';

const Popover = PopoverPrimitive.Popover.Root;

const PopoverTrigger = PopoverPrimitive.Popover.Trigger;

type PopoverPopupProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popover.Popup>;
type PopoverPositionerProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Popover.Positioner
>;
type PopoverContentProps = PopoverPopupProps &
  Omit<PopoverPositionerProps, keyof PopoverPopupProps | 'className' | 'style' | 'render'>; // Positioner deals with geomtry, while Popup is the actual content.

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Popover.Positioner>,
  PopoverContentProps
>(
  (
    {
      className,
      align = 'center',
      sideOffset = 4,
      side,
      collisionPadding,
      collisionAvoidance,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Popover.Portal>
      <PopoverPrimitive.Popover.Positioner
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        collisionAvoidance={collisionAvoidance}
        className={'z-60'}
      >
        <PopoverPrimitive.Popover.Popup
          className={cn(
            'w-72 rounded-md border border-zinc-300 bg-white p-4 shadow-md outline-none',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Popover.Positioner>
    </PopoverPrimitive.Popover.Portal>
  ),
);
const PopoverArrow = PopoverPrimitive.Popover.Arrow;

PopoverContent.displayName = PopoverPrimitive.Popover.Popup.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverArrow };
