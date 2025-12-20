import type { FC, InputHTMLAttributes } from 'react';
import { cn } from '../../utils/functions';

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'h-10 rounded-md border border-zinc-600 px-2 text-sm placeholder:text-zinc-600',
        className,
      )}
      {...props}
    />
  );
};
