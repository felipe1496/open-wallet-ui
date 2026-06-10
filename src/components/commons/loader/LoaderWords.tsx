import type { FC } from 'react';
import './loader-words.css';
import { useTranslation } from 'react-i18next';

interface Props {
  words: [string, string, string, string, string];
}

export const LoaderWords: FC<Props> = ({ words }) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="loader">
        <p>{t('common.loading')}</p>
        <div className="words">
          {words.map((word) => (
            <span key={word} className="word">
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
