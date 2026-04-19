import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Shield, Zap, RefreshCw, PlayCircle, Terminal, CheckCircle2, ShieldAlert, Cpu, Network, Clock, BarChart, ArrowRight, ShieldCheck, AlertTriangle, MessageSquare, Loader2, ChevronDown } from 'lucide-react';

const AnimatedNumber = ({ value, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const target = parseFloat(value.replace(/,/g, ''));
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const current = easeOutExpo * target;
      
      setCount(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, duration]);

  const displayValue = value.includes('.') 
    ? count.toFixed(1) 
    : Math.floor(count).toLocaleString();

  return <span>{displayValue}{suffix}</span>;
};

export default function Home() {
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep(prev => (prev >= 4 ? 0 : prev + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.location.hash === '#architecture') {
        // Use a timeout to ensure DOM is ready especially after page navigation
        setTimeout(() => {
          const el = document.getElementById('architecture');
          if (el) {
            const offset = 100;
            const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else if (window.location.pathname === '/' && !window.location.hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };


    // Trigger on mount and location change
    handleScroll();
    
    // Also listen for manual hash changes (clicking same page link)
    window.addEventListener('hashchange', handleScroll);
    return () => window.removeEventListener('hashchange', handleScroll);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-white selection:bg-primary-200 selection:text-primary-900">
      
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.15; transform: translate(-50%, 0) scale(1); }
            50% { opacity: 0.25; transform: translate(-50%, -2%) scale(1.05); }
          }
          @keyframes bounce-soft {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }
          .hero-glow {
            animation: pulse-slow 8s ease-in-out infinite;
          }
          .bounce-soft {
            animation: bounce-soft 2.5s ease-in-out infinite;
          }
        `}
      </style>
      
      {/* Absolute Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[1000px] opacity-[0.15] pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-400/40 via-indigo-100/10 to-transparent blur-3xl z-0 hero-glow"></div>

      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-6 max-w-7xl pt-16 lg:pt-28 pb-24 flex flex-col items-center text-center relative z-10">
        
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-primary-50/50 backdrop-blur-md text-primary-700 rounded-full text-xs font-bold mb-10 border border-primary-200 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          ResolveAI 2.0 Engine Live
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] max-w-4xl tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Automate Enterprise Support<br/>with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">Hybrid AI Agents</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-12 animate-fade-in-up font-medium leading-relaxed" style={{ animationDelay: '0.3s' }}>
          Resolve repetitive tickets instantly using local AI models, intelligent LLM fallback, and seamless human escalation.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up mb-16" style={{ animationDelay: '0.4s' }}>
          <Link to="/app/tickets" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-stripe hover:shadow-[0_20px_40px_-10px_rgba(30,41,59,0.3)] hover:-translate-y-1 transition-all duration-300 gap-2 group">
            View Live Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 gap-2 group">
            <PlayCircle size={20} className="text-primary-600 group-hover:scale-110 transition-transform" />
            Watch Product Tour
          </button>
        </div>

        <div className="flex flex-col items-center gap-10 w-full animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-center gap-8 md:gap-20 text-slate-600 font-medium text-sm">
             <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  <AnimatedNumber value="12,000" suffix="+" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tickets Resolved</span>
             </div>
             <div className="w-px h-10 bg-slate-200/60"></div>
             <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  <AnimatedNumber value="92.4" suffix="%" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Auto Resolution</span>
             </div>
             <div className="hidden md:block w-px h-10 bg-slate-200/60"></div>
             <div className="hidden md:flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  <AnimatedNumber value="2.1" suffix="s" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Response Time</span>
             </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400/60 uppercase tracking-[0.2em] border-t border-slate-100 pt-8 w-full max-w-xl justify-center">
            Built for SaaS • E-commerce • Fintech • Logistics • IT Support
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bounce-soft text-slate-300 opacity-50">
           <ChevronDown size={24} />
        </div>
      </section>

      {/* 2. HERO VISUAL (DASHBOARD MOCKUP) */}
      <section className="container mx-auto px-6 max-w-6xl pb-32 animate-fade-in-up relative z-10" style={{ animationDelay: '0.6s' }}>
         <div className="rounded-2xl border-[1.5px] border-slate-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25),_0_0_40px_rgba(99,102,241,0.15)] bg-slate-50/80 backdrop-blur-xl overflow-hidden flex flex-col h-[550px] ring-8 ring-slate-900/5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none z-10 hidden"></div>
            
            {/* Top Browser Bar */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-2 relative z-20 shadow-sm">
               <div className="flex gap-2.5 px-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:bg-red-500 transition-colors"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:bg-amber-400 transition-colors"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:bg-emerald-500 transition-colors"></div>
               </div>
               <div className="mx-auto flex flex-1 max-w-md items-center justify-center text-[11px] font-mono text-slate-500 font-bold bg-slate-100 px-8 py-1.5 rounded-md border border-slate-200">
                  <Terminal size={12} className="mr-2 opacity-60" /> workspace.resolveai.app/live
               </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-6 bg-[#f8fafc] overflow-hidden">
               {/* Ticket Queue left */}
               <div className="w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                 <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-sm tracking-tight">Operations Queue</div>
                 <div className="p-4 border-l-[4px] border-l-primary-500 bg-primary-50/10">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-slate-900 text-sm">Priya Sharma</span>
                       <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Resolved</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mb-1">Refund Request</div>
                    <div className="text-xs text-slate-500 truncate mb-3">I accidentally selected the annual pla...</div>
                    <div className="flex gap-2">
                       <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-bold">CONF: 98.0%</span>
                    </div>
                 </div>
                 <div className="p-4 border-b border-slate-100 opacity-60">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-slate-900 text-sm">David Chen</span>
                       <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">Escalated</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mb-1">Feature Request</div>
                    <div className="text-xs text-slate-500 truncate mb-3">We need advanced RBAC for HIPAA...</div>
                    <div className="flex gap-2">
                       <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-bold">CONF: 88.0%</span>
                    </div>
                 </div>
               </div>

               {/* Mock Trace Panel */}
               <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                     <span className="font-bold text-sm tracking-tight">Trace Profile</span>
                     <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">TKT-8942</span>
                  </div>
                  
                  <div className="p-6">
                     {/* Techy Pipeline Visual */}
                     <div className="mb-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100 overflow-hidden">
                           <div className="w-full bg-primary-400 absolute top-0 left-0 transition-all duration-500 ease-out" style={{ height: demoStep === 0 ? '0%' : demoStep === 1 ? '33%' : demoStep === 2 ? '66%' : '100%' }}></div>
                        </div>
                        
                        {/* Step 1: Local Model */}
                        <div className={`relative z-10 flex items-start gap-3 mb-3 transition-all duration-500 ${demoStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                           <div className={`w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0 mt-1 transition-colors duration-500 ${demoStep >= 1 ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                              <span className={`flex h-3 w-3 rounded-full transition-all duration-500 ${demoStep === 1 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse' : demoStep > 1 ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                           </div>
                           <div className={`flex-1 border rounded-lg p-3 relative overflow-hidden transition-all duration-500 ${demoStep >= 1 ? 'bg-white border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-50 border-slate-200'}`}>
                              {demoStep >= 1 && <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-400"></div>}
                              <div className="flex justify-between items-start mb-1">
                                 <div className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider ${demoStep >= 1 ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    <ShieldCheck size={14} /> LOCAL AI MODEL
                                 </div>
                                 <div className={`font-mono font-bold text-lg leading-none ${demoStep >= 1 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {demoStep >= 1 ? '98.0%' : '---%'}
                                 </div>
                              </div>
                              <div className="text-slate-500 text-[10px] font-medium leading-tight">Keywords + Semantic (TF-IDF) + all-MiniLM-L6-v2</div>
                           </div>
                        </div>

                        {/* Step 2: LLM Fallback */}
                        <div className={`relative z-10 flex items-start gap-3 mb-3 transition-all duration-500 ${demoStep >= 2 ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                           <div className={`w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0 mt-1 transition-colors duration-500 ${demoStep >= 2 ? 'bg-slate-100' : 'bg-slate-100'}`}>
                              <span className={`flex h-2 w-2 rounded-full transition-all duration-500 ${demoStep === 2 ? 'bg-slate-400 animate-pulse' : 'bg-slate-400'}`}></span>
                           </div>
                           <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-1">
                                 <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs uppercase tracking-wider">
                                    <AlertTriangle size={14} /> LLM FALLBACK
                                 </div>
                                 <div className="font-mono text-slate-400 text-xs font-bold leading-none bg-slate-200/50 px-1.5 py-0.5 rounded">BYPASSED</div>
                              </div>
                              <div className="text-slate-500 text-[10px] font-medium leading-tight">OpenRouter Intelligent Resolution Layer</div>
                           </div>
                        </div>

                        {/* Step 3: Human Escalation */}
                        <div className={`relative z-10 flex items-start gap-3 transition-all duration-500 ${demoStep >= 3 ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                           <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 mt-1">
                              <span className="flex h-2 w-2 rounded-full bg-slate-400"></span>
                           </div>
                           <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                              <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    HUMAN ESCALATION
                                 </div>
                                 <div className="font-mono text-slate-400 text-[10px] font-bold leading-none bg-slate-200/50 px-1.5 py-0.5 rounded">BYPASSED</div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-300 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 blur-[20px] rounded-full pointer-events-none"></div>
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-slate-500 font-bold">
                           <Terminal size={12} className="text-emerald-400"/> EXECUTION TRACE
                        </div>
                        <div className="space-y-1.5 relative z-10">
                           {demoStep === 0 && (
                              <div className="text-primary-400 flex items-center gap-2 animate-pulse"><Loader2 size={10} className="animate-spin" /> Awaiting route classification...</div>
                           )}
                           {demoStep >= 1 && <div className="text-slate-500 break-words animate-fade-in">[12:44:01] <span className="text-slate-300">ticket_received → I accidentally selected...</span></div>}
                           {demoStep >= 1 && <div className="text-slate-500 break-words animate-fade-in" style={{ animationDelay: '200ms' }}>[12:44:01] <span className="text-emerald-400 font-bold">classified_intent → refund_request</span></div>}
                           {demoStep >= 2 && <div className="text-slate-500 break-words animate-fade-in">[12:44:02] <span className="text-blue-400 font-bold">confidence → 0.98</span></div>}
                           {demoStep >= 3 && <div className="text-slate-500 break-words animate-fade-in">[12:44:02] <span className="text-emerald-400 font-bold">routing_decision → local_model_approved</span></div>}
                           {demoStep >= 4 && <div className="text-slate-500 break-words animate-fade-in">[12:44:02] <span className="text-primary-400 font-bold">action_triggered → query_billing_db</span></div>}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. SOCIAL PROOF / TRUST */}
      <section className="bg-slate-50 py-12 border-y border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
             Designed for SaaS, E-commerce, FinTech, Logistics, and IT Support Teams
          </p>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="architecture" className="container mx-auto px-6 max-w-7xl py-32">
         <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Architecture</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">How ResolveAI Works</h3>
         </div>

         <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03]"><Cpu size={120}/></div>
               <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
                 1
               </div>
               <h4 className="font-bold text-lg text-slate-900 mb-2">Understand Intent</h4>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">Keyword + semantic routing classifies incoming tickets instantly against trained logic boundaries.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03]"><Zap size={120}/></div>
               <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                 2
               </div>
               <h4 className="font-bold text-lg text-slate-900 mb-2">Resolve Locally</h4>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">Over 80% of common issues are securely handled by the blazing fast, privacy-safe local AI engine.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03]"><Network size={120}/></div>
               <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                 3
               </div>
               <h4 className="font-bold text-lg text-slate-900 mb-2">Smart Escalation</h4>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">Complex tickets exceeding local bounds are dynamically routed to advanced LLM reasoning fallback layers.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03]"><Shield size={120}/></div>
               <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                 4
               </div>
               <h4 className="font-bold text-lg text-slate-900 mb-2">Human Handoff</h4>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">Unresolved or highly sensitive operational failures are directly escalated to human agents safely.</p>
            </div>
         </div>
      </section>

      {/* 5. WHY WE WIN SECTION */}
      <section className="bg-slate-900 py-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-3">Enterprise Ready</h2>
            <h3 className="text-4xl font-extrabold tracking-tight">Built for Real Enterprise Support</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
             <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl text-center flex flex-col items-center justify-center">
                <div className="text-5xl font-black tracking-tight text-white mb-2">92<span className="text-slate-400">.4%</span></div>
                <div className="font-bold text-primary-400 uppercase tracking-widest text-sm">Auto Resolution</div>
             </div>
             <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl text-center flex flex-col items-center justify-center">
                <div className="text-5xl font-black tracking-tight text-white mb-2">2<span className="text-slate-400">.1s</span></div>
                <div className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Avg Response Time</div>
             </div>
             <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl text-center flex flex-col items-center justify-center">
                <div className="text-5xl font-black tracking-tight text-white mb-2"><span className="text-slate-400">$</span>128<span className="text-slate-400">K</span></div>
                <div className="font-bold text-amber-400 uppercase tracking-widest text-sm">Monthly Ops Savings</div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURE GRID */}
      <section className="container mx-auto px-6 max-w-7xl py-32 bg-white">
         <div className="text-center mb-20 max-w-2xl mx-auto">
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Platform Features</h3>
         </div>

         <div className="grid md:grid-cols-3 gap-y-12 gap-x-8">
            <div className="flex flex-col gap-3 p-6 rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300">
               <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-slate-700 mb-2"><Network size={20}/></div>
               <h4 className="font-bold text-slate-900 text-lg">Hybrid AI Routing</h4>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Dynamically routes support logic between deterministic local models and advanced open LLM intelligence.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300">
               <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-slate-700 mb-2"><BarChart size={20}/></div>
               <h4 className="font-bold text-slate-900 text-lg">Confidence Scoring</h4>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Transparent algorithmic decision engine requiring rigid boundary scores before allowing autonomous action.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300">
               <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-slate-700 mb-2"><Terminal size={20}/></div>
               <h4 className="font-bold text-slate-900 text-lg">Live Telemetry Logs</h4>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Every routing decision, timeout, intent extraction, and fallback is completely auditable and traceable natively.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300">
               <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-slate-700 mb-2"><ShieldCheck size={20}/></div>
               <h4 className="font-bold text-slate-900 text-lg">Refund Policy Engine</h4>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Safely execute massive financial workflows natively, including automated approvals, query loops, and denials.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300">
               <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-slate-700 mb-2"><MessageSquare size={20}/></div>
               <h4 className="font-bold text-slate-900 text-lg">Human Escalation Queue</h4>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Keep your customer success metrics safe. Anything the AI cannot resolve to 95% certainty drops to a human queue.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-2xl border border-transparent hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300">
               <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-slate-700 mb-2"><Zap size={20}/></div>
               <h4 className="font-bold text-slate-900 text-lg">Plug-and-Play API</h4>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">Connect to any existing helpdesk stack like Zendesk, Intercom, or Salesforce seamlessly with one REST integration.</p>
            </div>
         </div>
      </section>

      {/* 8. FINAL CTA SECTION */}
      <section className="bg-primary-50 py-32 border-y border-primary-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="container mx-auto px-6 max-w-4xl flex flex-col items-center justify-center text-center relative z-10 min-h-[300px]">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-10 leading-tight py-4">
             Let AI Handle Support<br/>While Humans Handle Growth.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/app/tickets" className="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-stripe hover:bg-primary-700 hover:-translate-y-0.5 transition-all">
              Launch Live Demo
            </Link>
            <button className="inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 hover:-translate-y-0.5 shadow-sm transition-all">
              Book Walkthrough
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
