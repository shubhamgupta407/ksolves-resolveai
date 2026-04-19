import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Sector } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, Cpu, Network } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';


const mockTrendData = [
  { time: '08:00', tickets: 120, resolved: 110 },
  { time: '09:00', tickets: 240, resolved: 220 },
  { time: '10:00', tickets: 350, resolved: 330 },
  { time: '11:00', tickets: 400, resolved: 370 },
  { time: '12:00', tickets: 280, resolved: 260 },
  { time: '13:00', tickets: 310, resolved: 290 },
  { time: '14:00', tickets: 460, resolved: 430 },
  { time: '15:00', tickets: 500, resolved: 470 }
];

const mockIntentData = [
  { name: 'refund_request', value: 45, volume: 1245 },
  { name: 'order_tracking', value: 25, volume: 812 },
  { name: 'login_failure', value: 15, volume: 430 },
  { name: 'unknown_fallback', value: 15, volume: 430 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#64748b'];

const renderActiveShape = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  if (!payload) return null;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 15;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g style={{ transition: 'all 0.3s ease' }}>
      <text x={cx} y={cy} dy={-6} textAnchor="middle" fill="#0f172a" className="font-bold text-sm">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={14} textAnchor="middle" fill="#64748b" className="text-xs font-mono">
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 8}
        fill={fill}
      />
    </g>
  );
};

function AnimatedNumber({ valueStr }) {
  const [displayStr, setDisplayStr] = useState(valueStr);

  useEffect(() => {
    try {
      const numMatch = String(valueStr).match(/[\d,.]+/);
      if (!numMatch) return;
      
      const numRaw = parseFloat(numMatch[0].replace(/,/g, ''));
      if (isNaN(numRaw)) return;
      
      const prefix = valueStr.substring(0, numMatch.index);
      const suffix = valueStr.substring(numMatch.index + numMatch[0].length);
      const hasDecimals = numMatch[0].includes('.');
      
      const duration = 800; // ms
      const steps = 20;
      const stepTime = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentVal = numRaw * progress;
        
        const formatted = hasDecimals 
          ? currentVal.toFixed(1) 
          : Math.floor(currentVal).toLocaleString('en-US');
        
        setDisplayStr(`${prefix}${formatted}${suffix}`);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayStr(valueStr); // Snap exactly to final string
        }
      }, stepTime);
      
      return () => clearInterval(interval);
    } catch(e) {
      setDisplayStr(valueStr); // Fallback to raw string
    }
  }, [valueStr]);

  return <span>{displayStr}</span>;
}

function StatCard({ title, value, trend, isPositive }) {
  return (
    <div className="card group cursor-default">
      <div className="text-sm font-medium text-slate-500 mb-1 group-hover:text-slate-700 transition-colors">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-slate-900 tracking-tight"><AnimatedNumber valueStr={value} /></div>
        <div className={`flex items-center text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trend}
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const { tickets, kpis } = useTickets();
  const [activeIndex, setActiveIndex] = useState(0);

  const automatedCount = tickets.filter(t => t.status === 'Automated').length;
  const escalatedCount = tickets.filter(t => t.status === 'Escalated').length;
  const totalCount = tickets.length;
  const autoRate = totalCount > 0 ? ((automatedCount / totalCount) * 100).toFixed(1) : 0;

  const intentData = React.useMemo(() => {
     const counts = {};
     tickets.forEach(t => {
        counts[t.intent] = (counts[t.intent] || 0) + 1;
     });
     
     // Fallback to mock categories if data is thin
     if (Object.keys(counts).length === 0) return mockIntentData;

     return Object.entries(counts)
        .map(([name, value]) => ({ 
           name, 
           value: Math.round((value / totalCount) * 100), 
           volume: value 
        }))
        .sort((a,b) => b.volume - a.volume)
        .slice(0, 4);
  }, [tickets, totalCount]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div>
      <div className="page-header flex justify-between items-end">
        <div>
          <h1 className="page-title">Executive Overview</h1>
          <p className="page-subtitle">Real-time enterprise metrics & automation health</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              SYSTEM NOMINAL
           </div>
           <button className="btn btn-secondary text-xs font-bold uppercase tracking-widest px-4">
             <Activity size={14} /> Global Live Sink
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tickets" value={kpis.total.toLocaleString()} trend="12.5%" isPositive={true} />
        <StatCard title="Auto Resolved" value={`${kpis.resolved.toLocaleString()} (${kpis.rate}%)`} trend="2.1%" isPositive={true} />
        <StatCard title="Human Escalations" value={kpis.escalated.toLocaleString()} trend="4.2%" isPositive={false} />
        <StatCard title="Avg Resolution Time" value={`${kpis.time}s`} trend="0.4s" isPositive={true} />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Ticket Volume Chart - 2 Columns */}
        <div className="card lg:col-span-2 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <Activity size={160} />
           </div>
          <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
             <TrendingUp size={18} className="text-primary-600" /> Resolution Trend VS Volume
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="tickets" stroke="#94a3b8" strokeWidth={2} activeDot={{ r: 6, fill: '#94a3b8' }} fillOpacity={1} fill="url(#colorTickets)" name="Incoming" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6, fill: '#10b981' }} fillOpacity={1} fill="url(#colorResolved)" name="Auto Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intent Breakdown - 1 Column */}
        <div className="card flex flex-col relative overflow-hidden border-slate-200 shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
             <Network size={100}/>
          </div>
          <div className="flex justify-between items-start mb-6">
             <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                   <Cpu size={16} className="text-primary-600"/> Classification Matrix
                </h3>
                <p className="text-[11px] font-semibold text-slate-400 font-mono tracking-wider uppercase mt-1">Live Vector Distribution</p>
             </div>
             <div className="bg-primary-50 text-primary-600 text-[10px] font-bold px-2 py-1 rounded border border-primary-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span> LIVE
             </div>
          </div>
          
          <div className="flex-1 w-full min-h-[220px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={intentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  stroke="none"
                >
                  {intentData.map((entry, index) => (
                    <Cell 
                       key={`cell-${index}`} 
                       fill={COLORS[index % COLORS.length]} 
                       style={{ transition: 'all 0.3s ease', cursor: 'pointer', opacity: activeIndex === index ? 1 : 0.6 }} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-3 mt-4 relative z-10 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {intentData.map((intent, idx) => (
              <div 
                key={intent.name} 
                className={`flex flex-col gap-1.5 transition-all duration-300 cursor-pointer ${activeIndex === idx ? 'opacity-100 scale-[1.02]' : 'opacity-60'}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-slate-800 font-mono truncate max-w-[120px]">{intent.name}</span>
                  </div>
                  <div className="flex gap-3 text-slate-500 font-mono">
                     <span>{intent.volume} req</span>
                     <span className="font-bold text-slate-900 w-8 text-right">{intent.value}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                   <div 
                      className="h-1 rounded-full transition-all duration-1000" 
                      style={{ width: `${intent.value}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                   ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="card bg-primary-900 text-white border-primary-800">
           <h3 className="font-semibold text-primary-100 mb-2">Model Routing Efficiency</h3>
           <p className="text-sm text-primary-200 mb-6 font-mono">Rule-based vs LLM utilization</p>
           
           <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Semantic Matcher (Local)</span>
                  <span className="font-bold">68%</span>
                </div>
                <div className="w-full bg-primary-800 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fallback LLM (GPT-4)</span>
                  <span className="font-bold">24%</span>
                </div>
                <div className="w-full bg-primary-800 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Human Escalation</span>
                  <span className="font-bold">8%</span>
                </div>
                <div className="w-full bg-primary-800 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
           </div>
         </div>

         <div className="card">
           <h3 className="font-semibold text-slate-900 mb-2">Tool Execution Success</h3>
           <p className="text-sm text-slate-500 mb-6 font-mono">Last 10,000 requests</p>
           
           <div className="space-y-3 font-mono text-sm">
             <div className="flex items-center justify-between border-b border-slate-100 pb-2">
               <span className="text-primary-600">fetchStripeCharge()</span>
               <span className="text-slate-900">99.8%</span>
             </div>
             <div className="flex items-center justify-between border-b border-slate-100 pb-2">
               <span className="text-primary-600">postgres_readOrder()</span>
               <span className="text-slate-900">99.9%</span>
             </div>
             <div className="flex items-center justify-between border-b border-slate-100 pb-2">
               <span className="text-primary-600">Zendesk.issueRefund()</span>
               <span className="text-slate-900">98.5%</span>
             </div>
             <div className="flex items-center justify-between pb-2">
               <span className="text-primary-600">Shopify.cancelOrder()</span>
               <span className="text-amber-600">94.2%</span>
             </div>
           </div>
         </div>
      </div>

    </div>
  );
}
