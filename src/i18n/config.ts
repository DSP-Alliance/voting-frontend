import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/translation';
import cn from './cn/translation';

i18next.use(initReactI18next).init({
  lng: 'en',
  debug: true,
  resources: {
    en: {
      translation: en,
    },
    cn: {
      translation: cn,
    },
  },
});
