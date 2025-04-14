import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="h-full antialiased">
      <Head>
        <meta
          name="description"
          content="Transform Your Home with Contoso - Smart Living for Modern Life"
        />
      </Head>
      <body className="bg-primary text-secondary-light">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 