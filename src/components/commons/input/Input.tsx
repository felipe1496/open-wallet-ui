import type { FC, InputHTMLAttributes } from 'react';
import { cn } from '../../../utils/functions';

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'placeholder:text-muted-foreground h-10 rounded-md border border-zinc-300 px-2 text-sm',
        className,
      )}
      {...props}
    />
  );
};
