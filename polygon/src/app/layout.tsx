'use client';

// import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Provider as JotaiProvider } from 'jotai';
import AuthProvider from '@/components/AuthProvider';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Polygon</title>
        {/* Default favicon for SSR */}
        <link rel="icon" href="/topcoder.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <JotaiProvider>
            <AuthProvider>
              <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
            </AuthProvider>
          </JotaiProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
