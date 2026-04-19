import React from 'react';
import { Check, Shield, Zap, Rocket, Gem, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Growth',
    price: 'Early Access',
    period: 'Limited Slots',
    features: [
       'Up to 5,000 tickets', 
       'Basic Intent Parsing', 
       'Email & Chat Support', 
       'Standard Analytics', 
       '3 Agent Types'
    ],
    highlight: false,
    cta: 'Start Free Trial',
    icon: Zap,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Business',
    price: 'Enterprise',
    period: 'On Request',
    features: [
       'Up to 50,000 tickets', 
       'Advanced Semantic AI', 
       'Custom Tool Connections', 
       'Escalation Workflows', 
       'Audit Logging', 
       'Unlimited Agent Nodes'
    ],
    highlight: true,
    cta: 'Book Consultation',
    icon: Rocket,
    color: 'from-primary-600 to-indigo-800'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
       'Unlimited tickets', 
       'On-Premise LLM options', 
       'Dedicated Success Manager', 
       'SSO & SOC2 Compliance', 
       'SLA Guarantees', 
       'Custom Tool Engineering'
    ],
    highlight: false,
    cta: 'Contact Sales',
    icon: Gem,
    color: 'from-slate-700 to-slate-900'
  }
];

export default function Pricing() {
  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none opacity-40"></div>
      
      <div className="container mx-auto px-6 pt-24 pb-32 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100/50 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-primary-200 shadow-sm">
             <HelpCircle size={12}/> Early Access Pricing
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight leading-[1.1]">
             Flexible Plans<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">for Every Scale</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
            Only pay for successful automation. Scale infinitely without hiring thousands of agents.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch px-4">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`card group relative p-6 md:p-8 flex flex-col h-full bg-white transition-all duration-500 hover:shadow-2xl border-[1.5px] ${
                plan.highlight 
                  ? 'border-primary-500 shadow-xl ring-4 ring-primary-500/5 scale-102 z-10' 
                  : 'border-slate-200 hover:-translate-y-1'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-indigo-700 text-white text-[10px] font-black uppercase tracking-[0.2em] py-1.5 px-6 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-500`}>
                   <plan.icon size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight uppercase tracking-widest">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                  <span className="text-slate-500 font-bold text-xs tracking-tight">{plan.period}</span>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100 mb-6"></div>

              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex gap-3 text-slate-600 text-[13px] font-semibold items-center">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                       <Check size={10} className="text-emerald-500 stroke-[3px]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/signup" className={`inline-flex items-center justify-center rounded-xl py-4 px-6 text-sm font-black transition-all duration-300 shadow-stripe ${
                plan.highlight 
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-200' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
              }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-24 max-w-4xl mx-auto rounded-3xl bg-slate-50 border border-slate-200 p-8 md:p-12 text-center shadow-inner">
           <div className="inline-flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">
              <Shield size={14}/> Security & Compliance
           </div>
           <h4 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Need a Custom Security Infrastructure?</h4>
           <p className="text-slate-500 font-medium mb-8 max-w-2xl mx-auto">
             For organizations requiring SOC2/HIPAA compliance or On-Premise LLM deployment, we offer specialized engineering packages.
           </p>
           <button className="text-slate-900 font-black text-sm uppercase tracking-widest border-b-2 border-primary-500 pb-1 hover:text-primary-600 transition-colors">
              Request a Technical Deep Dive →
           </button>
        </div>
      </div>
    </div>
  );
}
