import type { AppProps } from 'next/app';
import { LanguageProvider } from '@/lib/language-context';
import Chat from '@/components/chat';
import Header from '@/components/header';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">
          <Component {...pageProps} />
          <footer className="p-4 mt-4 border-t-2 text-center">
            <p className="text-gray-500 text-sm">
              &copy;Contoso 2025
            </p>
          </footer>
        </main>
        <Chat />
      </div>
    </LanguageProvider>
  );
} 