import type { ReactNode } from 'react';

export const metadata = {
  title: 'Publish – AuthGrow',
};

export default function PublishLayout({ children }: { children: ReactNode }) {
  return (
    <section style={{ padding: 20 }}>
      <h2>Publish Section</h2>
      {children}
    </section>
  );
}
