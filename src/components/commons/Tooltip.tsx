import * as PrimitiveTooltip from '@radix-ui/react-tooltip';
import type { ComponentProps, FC } from 'react';
import { cn } from '../../utils/functions';

export const Tooltip = PrimitiveTooltip.Root;
export const TooltipTrigger = PrimitiveTooltip.Trigger;
export const TooltipContent: FC<ComponentProps<typeof PrimitiveTooltip.Content>> = ({
  className,
  children,
  ...props
}) => (
  <PrimitiveTooltip.Portal>
    <PrimitiveTooltip.Content
      className={cn(
        className,
        'rounded bg-zinc-800 px-[15px] py-2.5 text-[15px] leading-none text-white shadow-lg select-none',
      )}
      {...props}
    >
      {children}
      <PrimitiveTooltip.Arrow className="fill-zinc-800" />
    </PrimitiveTooltip.Content>
  </PrimitiveTooltip.Portal>
);
