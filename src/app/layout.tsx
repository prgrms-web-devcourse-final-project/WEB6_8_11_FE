import { Nunito, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
});

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata = {
  title: 'Korea Travel Guide Chatbot',
  description: 'AI-powered travel guide service for visitors to Korea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${nunito.variable} ${notoSansKR.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}