import type { ButtonHTMLAttributes, FC } from 'react';
import { cn } from '../../utils/functions';
import { Slot } from '@radix-ui/react-slot';

const variants = {
  primary:
    'bg-primary hover:bg-primary/90 text-shadow-2xs shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)] text-zinc-50',
  ghost: 'bg-zinc-800 hover:bg-zinc-800/90',
  outlined: 'border border-zinc-300 hover:bg-zinc-50 shadow-sm bg-white',
};

const sizes = {
  sm: 'h-7 px-2 font-medium text-xs',
  md: 'h-10 px-4 font-medium text-sm',
  wide: 'w-full h-12 py-2 font-medium text-sm',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
}

export const Button: FC<Props> = ({
  variant = 'primary',
  size = 'md',
  asChild,
  className,
  ...props
}) => {
  const Element = asChild ? Slot : 'button';

  return (
    <Element
      className={cn(
        variants[variant],
        sizes[size],
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
};
