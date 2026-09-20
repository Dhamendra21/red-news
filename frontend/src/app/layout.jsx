import '../index.css';
import { Providers } from "./providers";

export const metadata = {
  title: 'RED NEWS BHARAT - देश का सबसे तेज हिंदी समाचार',
  description: 'RED NEWS BHARAT: सत्य और साहस की पत्रकारिता।',
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
