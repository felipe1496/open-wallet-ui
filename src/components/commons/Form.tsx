import type { FC, FormHTMLAttributes } from 'react';
import { cn } from '../../utils/functions';

export const Form: FC<FormHTMLAttributes<HTMLFormElement>> = ({ className, ...props }) => (
  <form className={cn('flex flex-col gap-3 p-4', className)} {...props} />
);
