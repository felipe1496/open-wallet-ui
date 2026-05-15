import { cn } from '../../../utils/functions';
import { forwardRef, type ButtonHTMLAttributes, type PropsWithChildren } from 'react';

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: string;
  }
>;

export const ColorCircle = forwardRef<HTMLButtonElement, Props>(
  ({ color, children, className, style, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        {...props}
        className={cn(
          color
            ? 'pointer-events-auto flex size-6 cursor-pointer items-center justify-center rounded-full'
            : 'border-muted-foreground pointer-events-auto flex size-6 cursor-pointer items-center justify-center rounded-full border border-dashed',
          className,
        )}
        style={{ backgroundColor: color || 'transparent', ...style }}
      >
        {children}
      </button>
    );
  },
);
