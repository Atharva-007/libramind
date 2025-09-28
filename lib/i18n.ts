import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import language files
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import it from './locales/it.json'
import pt from './locales/pt.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import ar from './locales/ar.json'
import hi from './locales/hi.json'
import ru from './locales/ru.json'

const resources = {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    it: { translation: it },
    pt: { translation: pt },
    zh: { translation: zh },
    ja: { translation: ja },
    ko: { translation: ko },
    ar: { translation: ar },
    hi: { translation: hi },
    ru: { translation: ru },
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false, // React already escapes values
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },

        react: {
            useSuspense: false,
        },
    })

export default i18n