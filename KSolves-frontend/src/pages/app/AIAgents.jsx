import React, { useEffect, useState } from 'react';
import { Network, Database, Shield, Zap, Search, Bot, Activity, Brain } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';

const AgentNode = ({ icon: Icon, title, desc, top, left, delay, type = 'default', metrics }) => {
  const getStyle = () => {
    switch (type) {
      case 'primary': return 'border-primary-500/40 bg-gradient-to-b from-primary-50/50 to-white text-primary-900 shadow-primary-500/10 hover:shadow-primary-500/30 hover:border-primary-500/80';
      case 'success': return 'border-emerald-500/40 bg-gradient-to-b from-emerald-50/50 to-white text-emerald-900 shadow-emerald-500/10 hover:shadow-emerald-500/30 hover:border-emerald-500/80';
      case 'warning': return 'border-amber-500/40 bg-gradient-to-b from-amber-50/50 to-white text-amber-900 shadow-amber-500/10 hover:shadow-amber-500/30 hover:border-amber-500/80';
      default: return 'border-slate-300/80 bg-gradient-to-b from-slate-50/50 to-white text-slate-800 shadow-slate-300/20 hover:shadow-slate-400/30 hover:border-slate-400';
    }
  };

  const getIconColor = () => {
    switch(type) {
      case 'primary': return 'text-primary-600 bg-primary-100';
      case 'success': return 'text-emerald-600 bg-emerald-100';
      case 'warning': return 'text-amber-600 bg-amber-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div 
      className={`absolute w-48 px-4 py-3 rounded-xl border flex flex-col shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in ${getStyle()}`}
      style={{ top, left, animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between mb-2.5 border-b border-black/5 pb-2">
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider opacity-70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Active
        </div>
        <div className="text-[10px] font-mono opacity-60 font-semibold">{metrics?.latency || 'N/A'}</div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-inner ${getIconColor()}`}>
          <Icon size={14} strokeWidth={2.5} />
        </div>
        <h4 className="font-bold text-[13px] leading-tight text-slate-800 tracking-tight">{title}</h4>
      </div>

      <p className="text-[11px] opacity-75 mb-3 leading-snug min-h-[48px] text-balance">{desc}</p>
      
      <div className="mt-auto pt-2 flex items-center justify-between text-[10px] font-bold border-t border-black/5 opacity-70 mb-1">
        <span className="uppercase text-[9px] tracking-wider">Vol</span>
        <span className="font-mono">{metrics?.volume || '0'}/m</span>
      </div>
    </div>
  );
};

export default function AIAgents() {
  const { tickets, kpis } = useTickets();
  
  const totalVol = tickets?.length || 0;
  const localVol = tickets?.filter(t => t.source === 'local_model' || t.source === 'Local Model').length || 0;
  const fallbackVol = tickets?.filter(t => t.source.includes('fallback') || t.source.includes('Fallback')).length || 0;
  const escalationVol = tickets?.filter(t => t.status === 'Escalated').length || 0;

  return (

    <div className="h-full flex flex-col">
      <style>
        {`
          @keyframes drawPath {
            from { stroke-dashoffset: 20; }
            to { stroke-dashoffset: 0; }
          }
          .path-flow {
            animation: drawPath 1s linear infinite;
          }
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.02);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.08);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0,0,0,0.2);
          }
        `}
      </style>

      <div className="page-header mb-4">
        <h1 className="page-title">Agent Network</h1>
        <p className="page-subtitle">Live topology of active reasoning models and orchestrators</p>
      </div>

      <div className="flex-1 card p-0 relative bg-slate-50 border-slate-200 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="absolute inset-0 pattern-dots text-slate-200" style={{ backgroundSize: '16px 16px', backgroundImage: 'radial-gradient(currentColor 0.8px, transparent 1px)' }}></div>
        
        <div className="relative h-[600px] w-[1040px] mx-auto mt-6">
          
          {/* SVG Connection Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id="warningGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Col 1 -> Col 1.5 (Intake to Intent) */}
            <path d="M 192 275 L 212 275" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 4" className="path-flow" fill="none" />
            
            {/* Col 1 -> Col 2 (Intent to Rule, Semantic, GPT) */}
            <path d="M 404 275 C 414 275, 414 75, 424 75" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 4" className="path-flow" fill="none" />
            <path d="M 404 275 L 424 275" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 4" className="path-flow" fill="none" />
            <path d="M 404 275 C 414 275, 414 475, 424 475" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 4" className="path-flow" fill="none" />
            
            {/* Col 2 -> Col 3 (Rule, Semantic, GPT to Policy Evaluator) */}
            <path d="M 616 75 C 626 75, 626 275, 636 275" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 4" className="path-flow" fill="none" />
            <path d="M 616 275 L 636 275" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 4" className="path-flow" fill="none" />
            <path d="M 616 475 C 626 475, 626 275, 636 275" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 4" className="path-flow" fill="none" />
            
            {/* Col 3 -> Col 4 (Policy Evaluator to Action Nodes) */}
            <path d="M 828 275 C 838 275, 838 175, 848 175" stroke="url(#successGrad)" strokeWidth="2.5" strokeDasharray="6 4" className="path-flow" fill="none" />
            <path d="M 828 275 C 838 275, 838 375, 848 375" stroke="url(#warningGrad)" strokeWidth="2.5" strokeDasharray="6 4" className="path-flow" fill="none" />
          </svg>

          {/* Render Nodes layout */}
          <div style={{ zIndex: 1, position: 'relative' }}>
            <AgentNode 
              icon={Activity} type="primary" title="Intake Agent" desc="Ingests incoming tickets, API payloads, and customer requests into the routing pipeline." 
              top="185px" left="0px" delay={0.1} metrics={{ latency: '1.2ms', volume: totalVol.toLocaleString() }}
            />
            
            <AgentNode 
              icon={Network} type="primary" title="Intent Router" desc="Routes requests dynamically between rules engine, semantic layer, fallback models, and human review." 
              top="185px" left="212px" delay={0.2} metrics={{ latency: '8.4ms', volume: totalVol.toLocaleString() }}
            />
            
            <AgentNode 
              icon={Zap} type="success" title="Rule Engine" desc="Fast keyword and pattern-based routing for repetitive known ticket classes." 
              top="0px" left="424px" delay={0.3} metrics={{ latency: '0.8ms', volume: localVol.toLocaleString() }}
            />
            <AgentNode 
              icon={Search} type="warning" title="Semantic Matcher" desc="Hybrid similarity engine using TF-IDF vectors + all-MiniLM-L6-v2 embeddings for intent matching." 
              top="185px" left="424px" delay={0.4} metrics={{ latency: '42ms', volume: localVol.toLocaleString() }}
            />
            <AgentNode 
              icon={Brain} type="default" title="LLM Fallback Layer" desc="Handles ambiguous, low-confidence, or complex multi-step tickets when local pipeline is insufficient." 
              top="385px" left="424px" delay={0.5} metrics={{ latency: '2.4s', volume: fallbackVol.toLocaleString() }}
            />

            <AgentNode 
              icon={Shield} type="primary" title="Policy Evaluator" desc="Applies confidence thresholds, risk checks, refund safety logic, and escalation boundaries." 
              top="185px" left="636px" delay={0.6} metrics={{ latency: '18ms', volume: totalVol.toLocaleString() }}
            />

            <AgentNode 
              icon={Bot} type="success" title="Execution Agent" desc="Triggers approved actions such as refunds, password resets, notifications, and account workflows." 
              top="85px" left="848px" delay={0.7} metrics={{ latency: `${kpis.time}s`, volume: (totalVol - escalationVol).toLocaleString() }}
            />

            <AgentNode 
              icon={Database} type="warning" title="Escalation Agent" desc="Packages full diagnostic context and routes unresolved or sensitive cases to human operators." 
              top="285px" left="848px" delay={0.8} metrics={{ latency: '12ms', volume: escalationVol.toLocaleString() }}
            />

          </div>

        </div>
      </div>
    </div>
  );
}
