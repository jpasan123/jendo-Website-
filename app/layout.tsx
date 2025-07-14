import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jendo.health.com'), // Add this line
  title: 'JENDO INNOVATIONS INC',
  description: 'Empowering healthcare with cutting-edge vascular monitoring solutions.',
  icons: {
    icon: '/jendo.jpeg',
    shortcut: '/jendo.jpeg',
    apple: '/jendo.jpeg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/jendo.jpeg',
    },
  },
  manifest: '/manifest.json',
  themeColor: '#9333EA',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    title: 'JENDO INNOVATIONS INC',
    description: 'Empowering healthcare with cutting-edge vascular monitoring solutions.',
    images: [{ url: '/jendo.jpeg' }],
  },
  twitter: {
    title: 'JENDO INNOVATIONS INC',
    card: 'summary_large_image',
    images: [{ url: '/jendo.jpeg' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}