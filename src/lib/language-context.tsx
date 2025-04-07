'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// 导入翻译文件
import enTranslations from '../translations/en.json';
import zhTranslations from '../translations/zh.json';

type TranslationsType = typeof enTranslations;

interface LanguageContextType {
  t: (key: string) => string;
  locale: string;
  setLocale: (locale: string) => void;
  isInitialized: boolean;
}

const translations: Record<string, TranslationsType> = {
  en: enTranslations,
  zh: zhTranslations
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  t: () => '',
  locale: 'en',
  setLocale: () => {},
  isInitialized: false
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化语言设置
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedLang = localStorage.getItem('language');
    const pathLang = pathname?.startsWith('/zh') ? 'zh' : 
                    pathname?.startsWith('/en') ? 'en' : null;

    const detectedLocale = pathLang || storedLang || 'en';
    setLocale(detectedLocale);
    setIsInitialized(true);
  }, [pathname]);

  // 处理语言切换
  const changeLanguage = (newLocale: string) => {
    if (newLocale !== 'en' && newLocale !== 'zh') return;
    
    setLocale(newLocale);
    localStorage.setItem('language', newLocale);
    
    // 获取当前路径（去除语言前缀）
    let currentPath = pathname || '/';
    if (currentPath.startsWith('/en') || currentPath.startsWith('/zh')) {
      currentPath = currentPath.substring(3) || '/';
    }
    
    // 构建新的路径
    const newPath = `/${newLocale}${currentPath === '/' ? '' : currentPath}`;
    
    // 尝试使用router.replace进行导航
    try {
      router.replace(newPath);
    } catch (error) {
      console.error('Error during navigation:', error);
      // 出现错误时使用window.location作为备用
      if (typeof window !== 'undefined') {
        window.location.href = newPath;
      }
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale] || translations.en;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ t, locale, setLocale: changeLanguage, isInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);