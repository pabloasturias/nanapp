import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['es']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Auto-detect language
    const savedLang = localStorage.getItem('dw_lang') as Language;
    const supportedLangs: Language[] = ['es', 'en', 'fr'];
    
    if (savedLang && supportedLangs.includes(savedLang)) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (supportedLangs.includes(browserLang)) {
          setLanguage(browserLang);
      } else {
          setLanguage('en'); // Global Fallback
      }
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('dw_lang', lang);
  };

  const t = (key: keyof typeof translations['es']) => {
    return translations[language][key] || translations['es'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};