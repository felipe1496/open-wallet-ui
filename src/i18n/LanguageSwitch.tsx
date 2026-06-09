import type { FC } from 'react';
import i18next from '.';
import { GB, PT } from 'country-flag-icons/react/1x1';
import { Button } from '../components/commons/Button';

export const LanguageSwitch: FC = () => {
  const lngs = {
    en: { nativeName: 'English' },
    pt: { nativeName: 'Português' },
  };
  return (
    <div className="flex items-center">
      {Object.keys(lngs).map((lng) => (
        <Button
          key={lng}
          className="mx-1 size-6 overflow-hidden rounded-full p-0"
          size="sm"
          variant="ghost"
          onClick={() => i18next.changeLanguage(lng)}
        >
          {lng === 'en' && <GB className="size-full" />}
          {lng === 'pt' && <PT className="size-full" />}
        </Button>
      ))}
    </div>
  );
};
