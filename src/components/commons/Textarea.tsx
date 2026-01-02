import type { FC, TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/functions';

export const Textarea: FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => (
  <textarea className={cn('h-10 rounded-md border border-zinc-300 px-2', className)} {...props} />
);
