import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Система учета б/у запчастей',
  description: 'Современная система для учета и управления б/у автомобильными запчастями',
  keywords: 'запчасти, автомобили, учет, инвентарь, б/у',
  authors: [{ name: 'Система учета запчастей' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/**
 * Корневой layout компонент
 * Определяет общую структуру приложения и метаданные
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Отладочная информация
  console.log('🔧 [DEBUG] RootLayout: Рендеринг корневого layout');
  console.log('🔧 [DEBUG] RootLayout: Шрифт Inter загружен:', inter.className);
  
  return (
    <html lang="ru" className="h-full">
      <body className={`${inter.className} h-full bg-neutral-50`}>
        <div className="min-h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
