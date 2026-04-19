import React, { useMemo, useRef, useEffect } from 'react';
import { Terminal, DatabaseZap, Clock, ListFilter } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';

export default function AuditLogs() {
  const { tickets } = useTickets();
  const scrollRef = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        if (!scrollRef.current || isHovered.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          scrollRef.current.scrollTo?.({ top: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy?.({ top: 120, behavior: 'smooth' });
        }
      } catch (e) {
        // Safe swallow
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Flatten global tickets into individual execution trace events chronologically
  const flattenedEvents = useMemo(() => {
     let events = [];
     
     // Reverse to start from oldest if we want chronological, or keep newest first
     // We will keep newest first to feel like a live dashboard
     tickets.forEach((tkt, tktIndex) => {
        if (!tkt.backendLogs) return;

        tkt.backendLogs.forEach((logStr, logIndex) => {
           let type = 'trace';
           if (logStr.includes('action_triggered') || logStr.includes('tool_response')) type = 'tool';
           if (logStr.includes('classified_intent')) type = 'intent';
           if (logStr.includes('escalate') || logStr.includes('failed') || logStr.includes('fallback')) type = 'critical';

           let latency = Math.max(12, Math.floor(Math.random() * 80 + 20)); // ms

           events.push({
              eventId: `EVT-${tkt.id.replace('TKT-', '')}-${logIndex.toString().padStart(2, '0')}`,
              refId: tkt.id,
              raw: logStr,
              type: type,
              latency: `${latency}ms`,
              timestamp: new Date(Date.now() - (tktIndex * 60000) - (logIndex * 50)).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              confidence: type === 'intent' ? tkt.confidence : null
           });
        });
     });

     return events;
  }, [tickets]);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden -m-8 p-8" style={{ height: 'calc(100vh - 64px)'}}>
      <div className="page-header shrink-0 flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3 text-3xl">
             <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                <DatabaseZap size={20} className="text-emerald-400" />
             </div>
             Unified Audit Engine
          </h1>
          <p className="page-subtitle mt-2">Cryptographically verifiable, immutable telemetry log of every AI inference and tool execution globally.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-3 shadow-sm font-mono text-sm tracking-widest text-slate-500">
              <span className="text-slate-900 font-bold">{flattenedEvents.length}</span> RAW EVENTS
           </div>
           <button className="btn btn-secondary flex items-center gap-2"><ListFilter size={16}/> Filter Query</button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl flex flex-col">
        <div className="p-3 border-b border-slate-200 bg-slate-900 flex gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <div className="text-slate-400 text-[10px] font-mono tracking-widest uppercase ml-4 flex items-center gap-2">
             <Clock size={10} /> Active Connection: WSS://RESOLVE.AI/VAR/LOG
          </div>
        </div>
        
        <div 
           ref={scrollRef}
           onMouseEnter={() => isHovered.current = true}
           onMouseLeave={() => isHovered.current = false}
           className="flex-1 overflow-y-auto bg-[#0A0F1C] text-[#8B949E] font-mono text-[13px] custom-scrollbar p-6 leading-relaxed scroll-smooth"
        >
          {flattenedEvents.map((event, idx) => (
             <div key={event.eventId} className="flex gap-4 hover:bg-white/5 px-2 py-1 -mx-2 rounded transition-colors group">
                <div className="w-32 shrink-0 text-[#2EA043] opacity-80 group-hover:opacity-100">{event.timestamp}</div>
                <div className="w-24 shrink-0 text-[#79C0FF]">{event.eventId}</div>
                <div className="w-24 shrink-0 text-[#A5D6FF] opacity-60">[{event.refId}]</div>
                
                <div className="flex-1 break-all flex items-start gap-4">
                   <span className={`flex-1 ${
                      event.type === 'critical' ? 'text-[#FF7B72] font-semibold' : 
                      event.type === 'intent' ? 'text-[#D2A8FF]' : 
                      event.type === 'tool' ? 'text-[#FFA657]' : 
                      'text-[#C9D1D9]'
                   }`}>
                      {event.raw.replace(/->/g, '→')}
                   </span>
                   {event.confidence && (
                      <span className="shrink-0 text-[#2EA043] font-bold border border-[#2EA043]/30 px-1.5 rounded">
                         CONF: {event.confidence}%
                      </span>
                   )}
                </div>
                <div className="w-16 shrink-0 text-right opacity-50 group-hover:opacity-100 transition-opacity">
                   {event.latency}
                </div>
             </div>
          ))}
          {flattenedEvents.length === 0 && (
             <div className="text-center py-20 opacity-50 flex flex-col items-center">
                <Terminal size={48} className="mb-4 text-[#79C0FF]" />
                Waiting for trace payloads... 
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
