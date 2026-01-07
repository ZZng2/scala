import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/BenefitsSection';
import { StickyCTA } from './components/StickyCTA';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-text-primary">
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
      </main>
      <StickyCTA />
    </div>
  );
}
