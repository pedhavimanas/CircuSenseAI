import React from 'react';
import { Check, ArrowRight, Sparkles, Shield, Users, Compass } from 'lucide-react';
import { AuthMode } from '../../types';

interface PricingSectionProps {
  onNavigateAuth: (mode: AuthMode) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigateAuth }) => {
  const plans = [
    {
      id: 'explorer',
      name: 'Explorer',
      tagline: 'For students, hobbyists & hardware tinkerers.',
      price: '₹0',
      period: 'Forever free',
      icon: Compass,
      popular: false,
      features: [
        'Up to 10 PCB visual scans/mo',
        'Standard component identification',
        'Optical package classification',
        'Basic AI circuit explanations',
        'Integrated open datasheet lookup',
        'Community troubleshooting support'
      ],
      cta: 'Start Free'
    },
    {
      id: 'pro',
      name: 'Pro Engineer',
      tagline: 'For professional repair techs & hardware developers.',
      price: '₹999',
      period: 'per month',
      icon: Sparkles,
      popular: true,
      features: [
        'Unlimited PCB optical analyses',
        'Deep OCR & laser marking recognition',
        'Full AI circuit netlist analysis',
        'Automated fault & anomaly screening',
        'Interactive AI Assistant Copilot',
        'Saved diagnostic boards & measurements',
        'Datasheet pinout synthesis & PDF viewer'
      ],
      cta: 'Launch Pro Trial'
    },
    {
      id: 'team',
      name: 'Hardware Team',
      tagline: 'For lab teams, electronics manufacturing & QA.',
      price: '₹2,999',
      period: 'per month / 5 seats',
      icon: Users,
      popular: false,
      features: [
        'All Pro tier capabilities',
        'Shared diagnostic boards & team workspace',
        'Multi-seat collaboration & notes',
        'Higher resolution processing limits',
        'Custom component library definitions',
        'Export test reports & inspection logs',
        'Priority feature roadmap access'
      ],
      cta: 'Get Team Access'
    }
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 scroll-mt-24 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/20 text-sky-600 dark:text-[#00D1FF] text-xs font-mono font-medium">
          Transparent Tiers
        </div>
        <h2 className="font-domine text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
          Choose Your Workspace
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Scale your circuit diagnostics from single-board bench testing to multi-team hardware lab operations.
        </p>
      </div>

      {/* 3 Glassmorphic Pricing Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 text-left ${
                plan.popular
                  ? 'bg-white/85 dark:bg-[#0D1322]/90 border-2 border-sky-500/70 dark:border-[#00D1FF]/70 shadow-[0_12px_40px_rgba(14,165,233,0.18)] dark:shadow-[0_12px_40px_rgba(0,209,255,0.18)] lg:-translate-y-2'
                  : 'bg-white/70 dark:bg-[#090D18]/80 border border-slate-200/80 dark:border-white/[0.08] shadow-md hover:shadow-xl'
              }`}
            >
              {/* Most Popular Highlight Pill */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white dark:text-[#050811] text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Sparkles size={11} />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] flex items-center justify-center border border-sky-500/20">
                    <PlanIcon size={20} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500 font-semibold uppercase">
                    {plan.id}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  {plan.tagline}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-slate-200/70 dark:border-white/[0.07]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      / {plan.period}
                    </span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block mb-2">
                    Included Capabilities
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} strokeWidth={2.5} />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action button */}
              <div>
                <button
                  type="button"
                  onClick={() => onNavigateAuth('signup')}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                    plan.popular
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white dark:text-[#050811] shadow-md hover:shadow-lg'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.07] dark:hover:bg-white/[0.12] text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-white/[0.09]'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Concept Disclaimer */}
      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-500 mt-10">
        * Tier specifications represent platform tier structures. All test accounts immediately receive full preview access.
      </p>
    </section>
  );
};
