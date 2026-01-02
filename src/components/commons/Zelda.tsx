import type { FC, ReactNode } from 'react';
import { Link as PrimitiveLink, useSearchParams } from 'react-router';

interface Props {
  to: string;
  keepQueryParams?: boolean;
  className?: string;
  children?: ReactNode;
}

export const Zelda: FC<Props> = ({ to, keepQueryParams = false, className, children }) => {
  const [searchParams] = useSearchParams();

  const newSearchParams = new URLSearchParams(searchParams);

  let targetURL = String(to);

  if (keepQueryParams) {
    targetURL += `?${newSearchParams.toString()}`;
  }

  return (
    <PrimitiveLink to={targetURL} className={className}>
      {children}
    </PrimitiveLink>
  );
};
