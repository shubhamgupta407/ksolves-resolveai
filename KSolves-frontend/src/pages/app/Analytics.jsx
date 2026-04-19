import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie, Legend } from 'recharts';
import { Network, Activity, TrendingUp, TrendingDown, DollarSign, BrainCircuit } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6'];

export default function Analytics() {
  const { tickets, kpis } = useTickets();

  const intentData = useMemo(() => {
     const counts = {};
     // Bootstrap with generic counts for volume if global state is fresh
     counts['Account Cancellation'] = 210;
     counts['Billing FAQ'] = 320;
     counts['Login/SSO'] = 430;
     counts['Tracking'] = 650;
     counts['Refund Request'] = 840;

     tickets.forEach(t => {
        counts[t.intent] = (counts[t.intent] || 0) + 1;
     });

     return Object.entries(counts)
         .map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 20)+'...' : name, value }))
         .sort((a,b) => b.value - a.value)
         .slice(0, 6); // Top 6
  }, [tickets]);

  const resolutionVolume = useMemo(() => {
     // Mock historical 7-day data mixed with live global
     const liveAuto = tickets.filter(t => t.status === 'Automated').length;
     const liveHuman = tickets.filter(t => t.status === 'Escalated').length;

     return [
        { day: 'Mon', Auto: Math.floor(kpis.resolved * 0.70), Human: Math.floor(kpis.resolved * 0.1) },
        { day: 'Tue', Auto: Math.floor(kpis.resolved * 0.75), Human: Math.floor(kpis.resolved * 0.12) },
        { day: 'Wed', Auto: Math.floor(kpis.resolved * 0.80), Human: Math.floor(kpis.resolved * 0.15) },
        { day: 'Thu', Auto: Math.floor(kpis.resolved * 0.82), Human: Math.floor(kpis.resolved * 0.18) },
        { day: 'Fri', Auto: Math.floor(kpis.resolved * 0.88), Human: Math.floor(kpis.resolved * 0.2) },
        { day: 'Sat', Auto: Math.floor(kpis.resolved * 0.95), Human: Math.floor(kpis.resolved * 0.22) },
        { day: 'Sun (Live)', Auto: liveAuto > 0 ? liveAuto + (kpis.resolved % 100) : kpis.resolved, Human: liveHuman > 0 ? liveHuman + (kpis.escalated % 50) : kpis.escalated }

     ];
  }, [kpis.resolved, tickets]);


  const fallbackRatio = useMemo(() => {
     const auto = tickets.filter(t => t.status === 'Automated').length;
     const fallback = tickets.filter(t => t.status === 'Processing' || t.status === 'Escalated').length;
     return [
        { name: 'Model Inference Success', value: auto || 1 },
        { name: 'LLM Fallback / Human', value: fallback || 0 }
     ]
  }, [tickets]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="page-header shrink-0 mb-6">
        <h1 className="page-title flex items-center gap-3">
           <Activity className="text-primary-600" />
           Telemetric Analytics Engine
        </h1>
        <p className="page-subtitle">Real-time macro analysis pulling from global operational intent datasets.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 shrink-0 mb-6">
         <div className="card bg-white p-5 shadow-sm border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><DollarSign size={16}/> Gross ROI</h4>
            <div className="text-3xl font-bold text-emerald-600 mb-2">${kpis.savings.toLocaleString()}K</div>
            <div className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 inline-flex rounded items-center gap-1"><TrendingUp size={14}/> +14.2% MoM</div>
         </div>
         <div className="card bg-white p-5 shadow-sm border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><BrainCircuit size={16}/> Avg Latency</h4>
            <div className="text-3xl font-bold text-primary-600 mb-2">{kpis.time}s</div>
            <div className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 inline-flex rounded items-center gap-1"><TrendingDown size={14}/> -0.4s Drop</div>
         </div>
         <div className="card bg-slate-900 p-5 shadow-sm border border-slate-800 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Network size={120} />
            </div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 relative z-10">Resolution Accuracy</h4>
            <div className="text-3xl font-bold text-white mb-2 relative z-10">{kpis.rate}%</div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-400/20 px-2 py-1 inline-flex rounded items-center gap-1 relative z-10">System Optimal</div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="card p-6 shadow-sm border border-slate-200 bg-white">
             <h3 className="font-bold text-slate-900 mb-2">Primary Intent Clusters (Live)</h3>
             <p className="text-xs text-slate-500 mb-8">Classification vectors mapped across all ticket metadata.</p>
             <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intentData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} width={120} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {intentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             </div>
          </div>

          <div className="card p-6 shadow-sm border border-slate-200 bg-white">
             <h3 className="font-bold text-slate-900 mb-2">Automated vs Human Volume</h3>
             <p className="text-xs text-slate-500 mb-8">Deflective capacity against human-escalated queue states.</p>
             <div className="h-[280px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={resolutionVolume}>
                   <defs>
                     <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                   <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                   <Area type="monotone" dataKey="Auto" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAuto)" />
                   <Area type="monotone" dataKey="Human" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorHuman)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
