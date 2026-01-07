import React from 'react';
import { Header } from './Header';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showStickyBar?: boolean;
}

export function MobileLayout({ children, title, showStickyBar = false }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30 flex justify-center">
      <div className="w-full max-w-[480px] bg-background min-h-screen relative shadow-2xl flex flex-col">
        <Header title={title} />
        <main className={`flex-1 pt-14 ${showStickyBar ? 'pb-20' : 'pb-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
