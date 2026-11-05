import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'CareBee — дневник заботы', description: 'Голосовой дневник ухода и самочувствия. Записи хранятся только в вашем браузере.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
