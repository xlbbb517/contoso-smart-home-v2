'use client';

import { useTranslation } from '@/lib/language-context';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  // 获取当前路径并保留路径部分（不包括语言前缀）
  const getCurrentPath = () => {
    if (typeof window === 'undefined') return '/';
    
    let path = window.location.pathname;
    // 移除语言前缀
    if (path.startsWith('/en') || path.startsWith('/zh')) {
      path = path.substring(3) || '/';
    }
    return path;
  };

  return (
    <div className="flex gap-2">
      <button 
        className={`px-2 py-1 rounded text-sm ${locale === 'en' ? 'bg-secondary-dark text-white' : 'bg-gray-200 text-secondary'}`}
        onClick={() => {
          setLocale('en');
          // 额外的备用跳转方式，确保切换有效
          if (locale === 'zh') {
            const currentPath = getCurrentPath();
            window.location.href = `/en${currentPath === '/' ? '' : currentPath}`;
          }
        }}
      >
        English
      </button>
      <button 
        className={`px-2 py-1 rounded text-sm ${locale === 'zh' ? 'bg-secondary-dark text-white' : 'bg-gray-200 text-secondary'}`}
        onClick={() => {
          setLocale('zh');
          // 额外的备用跳转方式，确保切换有效
          if (locale === 'en') {
            const currentPath = getCurrentPath();
            window.location.href = `/zh${currentPath === '/' ? '' : currentPath}`;
          }
        }}
      >
        中文
      </button>
    </div>
  );
}