import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import pt from './locales/pt/translation.json';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt'],
    load: 'languageOnly',
    detection: {
      order: ['navigator', 'localStorage'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: en,
      },
      pt: {
        translation: pt,
      },
    },
  });

export default i18next;
