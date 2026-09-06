import React, { useState } from 'react';
import { AuthMode } from '../../types';
import { PCBBackground } from '../auth/PCBBackground';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ProductPreviewSection } from './ProductPreviewSection';
import { AIAssistantSection } from './AIAssistantSection';
import { AboutSection } from './AboutSection';
import { PricingSection } from './PricingSection';
import { AuthPortalSection } from './AuthPortalSection';
import { FinalCTASection } from './FinalCTASection';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  initialAuthMode?: AuthMode;
}

export const LandingPage: React.FC<LandingPageProps> = ({ initialAuthMode = 'login' }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(initialAuthMode);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    scrollToSection('auth');
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-[#F8FAFC] dark:bg-[#07090F] text-slate-900 dark:text-slate-100 relative selection:bg-cyan-500/20 selection:text-cyan-400 font-sans transition-colors duration-300 overflow-x-hidden">
      {/* Background Subtle PCB Vector & Circuit Traces */}
      <PCBBackground />

      {/* Floating Glass Navbar */}
      <LandingNavbar onNavigateAuth={handleNavigateAuth} />

      {/* Main Content Sections */}
      <main className="relative z-10 w-full max-w-full overflow-x-hidden">
        {/* Section 1: Hero / Home */}
        <HeroSection
          onNavigateAuth={handleNavigateAuth}
          onExploreFeatures={() => scrollToSection('features')}
        />

        {/* Section 2: Authentication / Login Portal */}
        <AuthPortalSection mode={authMode} onSetMode={setAuthMode} />

        {/* Section 3: Features */}
        <FeaturesSection />

        {/* Section 4: How It Works */}
        <HowItWorksSection />

        {/* Section 5: Product Preview */}
        <ProductPreviewSection onNavigateAuth={handleNavigateAuth} />

        {/* Section 6: AI Assistant */}
        <AIAssistantSection />

        {/* Section 7: About */}
        <AboutSection />

        {/* Section 8: Pricing */}
        <PricingSection onNavigateAuth={handleNavigateAuth} />

        {/* Section 9: Final CTA */}
        <FinalCTASection
          onNavigateAuth={handleNavigateAuth}
          onExploreFeatures={() => scrollToSection('features')}
        />
      </main>

      {/* Footer */}
      <LandingFooter
        onNavigateAuth={handleNavigateAuth}
        onScrollTo={scrollToSection}
      />
    </div>
  );
};
