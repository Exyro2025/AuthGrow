// app/publish/layout.tsx
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publish • AuthGrow',
};

export default function PublishLayout({ children }: { children: ReactNode }) {
  return (
    <section style={{ display: 'block', gap: 16 }}>
      {children}
    </section>
  );
}

