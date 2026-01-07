import { HeroSection, BenefitsSection, StickyCTA } from '@/components/landing';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <main>
                <HeroSection />
                <BenefitsSection />
            </main>
            <StickyCTA />
        </div>
    );
}
