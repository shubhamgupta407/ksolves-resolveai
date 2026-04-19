import React from 'react';
import { Layers, Rocket, ShieldCheck, Github, ExternalLink } from 'lucide-react';

export default function About() {
  return (
    <div className="relative overflow-hidden bg-white min-h-[calc(100vh-80px)]">
      {/* Background Textures */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100 rounded-full blur-[120px] opacity-60 pointer-events-none -translate-y-1/3 translate-x-1/3"></div>
      
      <div className="container mx-auto px-6 py-24 relative z-10">
        
        {/* Massive Header */}
        <div className="text-center mb-24 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest mb-8 border border-slate-200 shadow-sm transition-transform hover:scale-105">
             <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span> BUILT FOR KSOLVES INNOVATION
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
             Automating the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Unautomatable.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            ResolveAI represents the pinnacle of autonomous enterprise workflows. We believe customer support shouldn't rely on brittle macros, but highly intelligent, deterministic hybrid-agent systems.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32 relative">
          {/* Subtle Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-slate-100 via-primary-200 to-slate-100 -z-10 hidden md:block"></div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)] hover:border-primary-200 flex flex-col items-center text-center p-10 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-200/50 flex items-center justify-center text-primary-600 mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Layers size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Modular Architecture</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Designed entirely as micro-agents. Each intent triggers a specific set of optimized workflows, allowing absolute scalability without accumulating technical debt.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:border-emerald-200 flex flex-col items-center text-center p-10 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 flex items-center justify-center text-emerald-600 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 -group-hover:rotate-3">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Enterprise Security</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              We don't trust LLMs blindly. Our rigid pipeline securely orchestrates sandboxed tools, ensuring high-risk actions drop instantly to human queues.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)] hover:border-amber-200 flex flex-col items-center text-center p-10 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 flex items-center justify-center text-amber-600 mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Rocket size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Zero to Deployed</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Experience a production-grade UI natively integrated. Deploying ResolveAI takes days compared to the months required by legacy platforms.
            </p>
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div className="max-w-4xl mx-auto rounded-3xl p-1 bg-[#0f172a] shadow-2xl relative mb-24">
           <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-emerald-500/20 rounded-3xl"></div>
           <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[22px] p-8 md:p-12 text-center relative overflow-hidden h-full">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
               
               <h3 className="text-2xl font-bold text-white mb-8 relative z-10 tracking-tight">System Architecture</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 text-left">
                  <div className="bg-slate-800/80 hover:bg-slate-800 transition-colors backdrop-blur border border-slate-700/50 p-5 rounded-2xl group">
                     <div className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-widest mb-1.5 group-hover:text-primary-400 transition-colors">Backend</div>
                     <div className="text-white font-bold flex items-center justify-between">FastAPI <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" /></div>
                  </div>
                  <div className="bg-slate-800/80 hover:bg-slate-800 transition-colors backdrop-blur border border-slate-700/50 p-5 rounded-2xl group">
                     <div className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-widest mb-1.5 group-hover:text-emerald-400 transition-colors">Frontend</div>
                     <div className="text-white font-bold flex items-center justify-between">React <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" /></div>
                  </div>
                  <div className="bg-slate-800/80 hover:bg-slate-800 transition-colors backdrop-blur border border-slate-700/50 p-5 rounded-2xl group">
                     <div className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-widest mb-1.5 group-hover:text-amber-400 transition-colors">Styling</div>
                     <div className="text-white font-bold flex items-center justify-between">Tailwind <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" /></div>
                  </div>
                  <div className="bg-slate-800/80 hover:bg-slate-800 transition-colors backdrop-blur border border-slate-700/50 p-5 rounded-2xl group">
                     <div className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-widest mb-1.5 group-hover:text-blue-400 transition-colors">Intelligence</div>
                     <div className="text-white font-bold flex items-center justify-between">Hybrid AI <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" /></div>
                  </div>
               </div>
           </div>
        </div>

        {/* Contact Section Anchor */}
        <div id="contact" className="max-w-2xl mx-auto text-center py-20 border-t border-slate-100">
           <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Enterprise Collaborations</h3>
           <p className="text-slate-500 font-medium mb-8">
             Looking for custom LLM deployments or engineering partnerships? Let's discuss your specific infrastructure needs.
           </p>
           <a href="mailto:aarushjais407@gmail.com" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-stripe hover:shadow-xl transition-all">
             Contact Technical Team
           </a>
        </div>
      </div>
    </div>
  );
}
