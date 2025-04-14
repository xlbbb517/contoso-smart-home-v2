import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';

// 导入翻译文件
import enTranslations from '../translations/en.json';
import zhTranslations from '../translations/zh.json';

interface LanguageContextType {
  locale: string;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  t: () => '',
});

export const useTranslation = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { locale = 'en' } = router;

  const t = (key: string): string => {
    const translations = locale === 'zh' ? zhTranslations : enTranslations;
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};