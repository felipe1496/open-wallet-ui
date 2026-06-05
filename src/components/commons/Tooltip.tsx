import { Tooltip as PrimitiveTooltip } from '@base-ui/react/tooltip';
import type { FC } from 'react';
import { cn } from '../../utils/functions';
import type React from 'react';

export const TooltipProvider = PrimitiveTooltip.Provider;
export const Tooltip = PrimitiveTooltip.Root;
export const TooltipTrigger = PrimitiveTooltip.Trigger;

type TooltipProps = React.ComponentPropsWithoutRef<typeof PrimitiveTooltip.Popup>;
type TooltipPositionerProps = React.ComponentPropsWithoutRef<typeof PrimitiveTooltip.Positioner>;
type TooltipContentProps = TooltipProps &
  Omit<TooltipPositionerProps, keyof TooltipProps | 'className' | 'style' | 'render'>; // Positioner deals with geomtry, while Popup is the actual content.

export const TooltipContent: FC<TooltipContentProps> = ({ className, children, ...props }) => (
  <PrimitiveTooltip.Portal>
    <PrimitiveTooltip.Positioner>
      <PrimitiveTooltip.Popup
        className={cn(
          className,
          'rounded bg-zinc-800 px-[15px] py-2.5 text-[15px] leading-none text-white shadow-lg select-none',
        )}
        {...props}
        render={children as React.ReactElement}
      >
        <PrimitiveTooltip.Arrow className="fill-zinc-800" />
      </PrimitiveTooltip.Popup>
    </PrimitiveTooltip.Positioner>
  </PrimitiveTooltip.Portal>
);
