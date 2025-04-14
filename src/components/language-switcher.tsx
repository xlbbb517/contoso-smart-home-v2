'use client';

import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, pathname, query, asPath } = router;

  const handleLanguageChange = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="flex gap-2">
      <button 
        className={`px-2 py-1 rounded text-sm ${locale === 'en' ? 'bg-secondary-dark text-white' : 'bg-gray-200 text-secondary'}`}
        onClick={() => handleLanguageChange('en')}
      >
        English
      </button>
      <button 
        className={`px-2 py-1 rounded text-sm ${locale === 'zh' ? 'bg-secondary-dark text-white' : 'bg-gray-200 text-secondary'}`}
        onClick={() => handleLanguageChange('zh')}
      >
        中文
      </button>
    </div>
  );
}