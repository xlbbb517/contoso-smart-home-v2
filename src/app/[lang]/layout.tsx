import "../../app/globals.css";
import type { Metadata } from "next";
import Chat from "@/components/chat";
import Block from "@/components/block";
import { LanguageProvider } from "@/lib/language-context";
import { use } from "react";

export const metadata: Metadata = {
  title: "Contoso Smart Home",
  description:
    "Transform Your Home with Contoso - Smart Living for Modern Life",
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {children}
        <footer className="p-4 mt-4 border-t-2 text-center">
          <p className="text-gray-500 text-sm">
            &copy;Contoso 2025
          </p>
        </footer>
      </main>
      <Chat />
    </div>
  );
}