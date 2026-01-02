import type { FC, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/functions';

interface Props extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  wrapperClassName?: string;
}

export const Card: FC<Props> = ({ header, className, children, wrapperClassName, ...props }) => (
  <div className={cn('flex w-full flex-col rounded-md bg-white shadow', wrapperClassName)}>
    {header && <div className="w-full border-b border-zinc-200 p-4">{header}</div>}
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  </div>
);
