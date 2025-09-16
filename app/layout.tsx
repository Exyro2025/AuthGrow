// app/layout.tsx
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AuthGrow',
  description: 'AuthGrow — Lite Publisher',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          padding: 24,
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {children}
      </body>
    </html>
  );
}

