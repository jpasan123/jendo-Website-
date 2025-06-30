import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JENDO INNOVATIONS INC',
  description: 'Empowering healthcare with cutting-edge vascular monitoring solutions.',
  icons: {
    icon: 'https://i.ibb.co/8DmPV6GS/OIP.webp',
    shortcut: 'https://i.ibb.co/8DmPV6GS/OIP.webp',
    apple: 'https://i.ibb.co/8DmPV6GS/OIP.webp',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: 'https://i.ibb.co/8DmPV6GS/OIP.webp',
    },
  },
  manifest: '/manifest.json',
  themeColor: '#9333EA',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>JENDO INNOVATIONS INC</title>
        <link rel="icon" href="https://i.ibb.co/8DmPV6GS/OIP.webp" type="image/webp" />
        <meta property="og:title" content="JENDO INNOVATIONS INC" />
        <meta name="twitter:title" content="JENDO INNOVATIONS INC" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}