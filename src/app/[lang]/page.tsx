'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/language-context';
import HomeComponent from '@/components/home';
import { use } from 'react';

// 支持的语言列表
const supportedLocales = ['en', 'zh'];

export default function LocalizedHome({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { setLocale } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string | null>(null);
  const { lang } = use(params);
  const resolvedSearchParams = use(searchParams);

  // 当组件加载时，根据URL中的lang参数更新语言上下文
  useEffect(() => {
    if (lang && supportedLocales.includes(lang)) {
      // 将语言保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
      }
      
      // 更新语言上下文
      setLocale(lang);
      setCurrentLang(lang);
    }
  }, [lang, setLocale]);

  // 使用主页组件
  return <HomeComponent params={{ lang: currentLang || lang }} searchParams={resolvedSearchParams} />;
}