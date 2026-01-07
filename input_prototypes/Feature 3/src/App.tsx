import React from 'react';
import { MobileLayout } from './components/layout/MobileLayout';
import { DetailHeader } from './components/scholarship/DetailHeader';
import { DetailContent } from './components/scholarship/DetailContent';
import { StickyActionBar } from './components/scholarship/StickyActionBar';
import { MOCK_SCHOLARSHIP } from './lib/mock-data';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <>
      <MobileLayout title="장학금 상세" showStickyBar={true}>
        <DetailHeader scholarship={MOCK_SCHOLARSHIP} />
        <DetailContent scholarship={MOCK_SCHOLARSHIP} />
        <StickyActionBar scholarship={MOCK_SCHOLARSHIP} />
      </MobileLayout>
      <Toaster />
    </>
  );
}
