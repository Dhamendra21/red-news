import { Poppins, Anek_Devanagari, Karma, Eczar } from 'next/font/google';
import '../index.css';
import { Providers } from "./providers";

const poppins = Karma({
  weight: ['400', '500', '600', '700'],
  subsets: ['devanagari'],
  variable: '--font-poppins',
});

const anek = Karma({
  weight: ['400', '500', '600', '700'],
  subsets: ['devanagari'],
  variable: '--font-headline',
});

const karma = Karma({
  weight: ['400', '500', '600', '700'],
  subsets: ['devanagari'],
  variable: '--font-editorial',
});

const eczar = Karma({
  weight: ['400', '500', '600', '700'],
  subsets: ['devanagari'],
  variable: '--font-description',
});

export const metadata = {
  title: 'RED NEWS BHARAT - देश का सबसे तेज हिंदी समाचार',
  description: 'RED NEWS BHARAT: सत्य और साहस की पत्रकारिता।',
  icons: {
    icon: '/logo.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className={`font-sans antialiased bg-slate-50 text-slate-900 ${poppins.variable} ${anek.variable} ${karma.variable} ${eczar.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
