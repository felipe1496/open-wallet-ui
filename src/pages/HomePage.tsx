import type { FC } from 'react';
import { Page } from '../components/commons/Page';

export const HomePage: FC = () => {
  return (
    <Page>
      <main className="flex flex-col p-2">
        <span className="text-xl font-medium">Dashboard</span>
      </main>
    </Page>
  );
};
