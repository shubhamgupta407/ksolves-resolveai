import React, { useState, useEffect } from 'react';
import { Filter, AlertCircle, Bot, Zap, X, Terminal, Clock, Send, ServerCrash, CheckCircle2, Package, ArrowUpRight, ArrowDownRight, Activity, PlayCircle, Layers, Code2, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';


const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    let startTimestamp = null;
    const duration = 1200; // 1.2s smooth interpolation
    const initialValue = displayValue;
    
    if (initialValue === value) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentVal = initialValue + (value - initialValue) * easeProgress;
      setDisplayValue(currentVal);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  const formatted = displayValue.toLocaleString(undefined, {
     minimumFractionDigits: decimals,
     maximumFractionDigits: decimals
  });

  return <span>{prefix}{formatted}{suffix}</span>;
}

function StatCard({ title, value, prefix, suffix, decimals, trend, isPositive, flash }) {
  return (
    <div className={`group glass-morphism flex-1 p-6 shadow-sm border rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary-200 cursor-default relative overflow-hidden ${flash ? 'border-primary-400 bg-primary-50/30' : 'border-slate-100'}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 blur-2xl rounded-full group-hover:bg-primary-500/10 transition-colors"></div>
      
      <div className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">{title}</div>
      <div className="flex items-end justify-between relative z-10">
        <div className={`text-4xl font-black text-slate-900 tracking-tighter ${flash ? 'animate-kpi-pulse' : ''}`}>
           <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </div>
        <div className={`flex items-center text-xs font-black px-2 py-1 rounded-lg transition-all ${isPositive ? 'text-emerald-600 bg-emerald-50 shadow-[0_0_10px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-amber-600 bg-amber-50'}`}>
          {isPositive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          {trend}
        </div>
      </div>
      
      {/* Decorative Glow Line */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}


const AnimatedLogs = ({ logs }) => {
  const [visibleLogs, setVisibleLogs] = useState([]);
  
  useEffect(() => {
    setVisibleLogs([]);
    let timeouts = [];
    logs.forEach((log, index) => {
      const timeout = setTimeout(() => {
        setVisibleLogs(prev => [...prev, log]);
      }, (index + 1) * 800);
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(clearTimeout);
  }, [logs]);

  return (
    <div className="space-y-3 font-mono text-xs">
      {visibleLogs.map((log, i) => {
        const isLocalModel = log.includes('local_model');
        const isFallback = log.includes('openrouter_fallback') || log.includes('llm_fallback');
        const isEscalate = log.includes('escalate') || log.includes('failed');
        const isConfidence = log.includes('confidence');
        
        let textColorClass = "text-slate-700";
        if (isLocalModel) textColorClass = "text-emerald-600 font-bold";
        else if (isFallback) textColorClass = "text-amber-600 font-bold";
        else if (isEscalate) textColorClass = "text-red-600 font-bold";
        else if (isConfidence) textColorClass = "text-blue-600 font-bold";

        return (
          <div key={i} className="animate-fade-in flex gap-3 bg-slate-50 border border-slate-200 p-3 rounded-md shadow-sm">
             <span className="text-slate-400 font-bold shrink-0">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
             <span className={`break-words ${textColorClass}`}>{log}</span>
          </div>
        );
      })}
      {visibleLogs.length < logs.length && (
        <div className="flex gap-3 text-slate-400 bg-slate-50/50 border border-slate-200 border-dashed p-3 rounded-md animate-pulse">
           <span className="font-bold shrink-0">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
           <span className="flex items-center gap-2"><Clock size={12} className="animate-spin" /> Awaiting intelligence trace...</span>
        </div>
      )}
      {visibleLogs.length > 0 && visibleLogs.length === logs.length && (
         <div className="text-emerald-600 flex items-center gap-2 mt-4 font-sans font-semibold text-sm">
            <CheckCircle2 size={16} /> Trace Execution Ended
         </div>
      )}
    </div>
  );
};

const EnterpriseStyles = () => (
   <style>{`
      @keyframes gradient-xy {
         0%, 100% { background-position: 0% 50%; }
         50% { background-position: 100% 50%; }
      }
      .animate-gradient-xy {
         background-size: 200% 200%;
         animation: gradient-xy 15s ease infinite;
      }
      @keyframes slide-up-reveal {
         from { opacity: 0; transform: translateY(20px); }
         to { opacity: 1; transform: translateY(0); }
      }
      .animate-slide-up-reveal {
         animation: slide-up-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes kpi-pulse {
         0%, 100% { opacity: 1; transform: scale(1); }
         50% { opacity: 0.8; transform: scale(0.98); }
      }
      .animate-kpi-pulse {
         animation: kpi-pulse 4s ease-in-out infinite;
      }
      @keyframes float {
         0%, 100% { transform: translateY(0); }
         50% { transform: translateY(-4px); }
      }
      .animate-float {
         animation: float 3s ease-in-out infinite;
      }
      .glass-morphism {
         background: rgba(255, 255, 255, 0.8);
         backdrop-filter: blur(12px);
         border: 1px solid rgba(255, 255, 255, 0.3);
      }
   `}</style>
);


export default function LiveTickets() {
  return (
     <>
        <EnterpriseStyles />
        <LiveTicketsContent />
     </>
  );
}

function LiveTicketsContent() {
  const { tickets, kpis, addTicket, resetSandbox } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(-1);
  const [ticketInput, setTicketInput] = useState('');
  const [testError, setTestError] = useState('');
  
  const [flashKPIs, setFlashKPIs] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);

  // --- Bulk Mode State ---
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResults, setBulkResults] = useState([]);
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  const [bulkSummary, setBulkSummary] = useState(null);
  const [batchTime, setBatchTime] = useState(0);


  const BULK_DEMO_DATA = `I need refund for accidental payment
I was charged twice please refund
Cannot login to my account forgot password
Reset my password login issue
Where is my order not delivered yet
Track my package please
Cancel my order immediately
I ordered by mistake cancel purchase
Coupon code not working today
Promo code failed at checkout
Product arrived damaged and broken
Need replacement wrong item received
Package came late and delayed
Missing item inside the package
Need to change delivery address
Wrong pin code entered change address
Very disappointed with support service
Nothing is working I am frustrated
Payment deducted but no confirmation
Warranty claim product stopped working`;

  const getTicketCount = () => bulkInput.split('\n').filter(l => l.trim()).length;


  useEffect(() => {
     if (tickets && tickets.length > 0 && !selectedTicket) {
        setSelectedTicket(tickets[0]);
     }
  }, [tickets]);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Automated': return <span className="badge badge-success">Resolved</span>;
      case 'Processing': return <span className="badge badge-warning text-xs"><Zap size={12} className="mr-1 inline animate-pulse" /> Processing</span>;
      case 'Escalated': return <span className="badge badge-critical">Escalated</span>;
      default: return <span className="badge bg-slate-200">Pending</span>;
    }
  };

  const submitLiveTicket = async () => {
    if (!ticketInput.trim()) return;
    
    setIsSubmitting(true);
    setLoadingPhase(0);
    setTestError('');
    const genId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);

    let phaseInterval = setInterval(() => {
       setLoadingPhase(prev => {
          if (prev < 4) return prev + 1;
          clearInterval(phaseInterval);
          return prev;
       });
    }, 1200);
    
    // Logic for individual ticket processing (reusable)
    const processTicket = async (text, id) => {
      try {
        const res = await fetch('https://resolveai-backend-bv4e.onrender.com/resolve-ticket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticket: text, ticket_id: id })
        });
        if (!res.ok) throw new Error(`Backend Error (${res.status})`);
        const data = await res.json();
        
        const isResolved = data.agent_response?.flow !== 'escalated_to_human';
        let confidenceStr = "0%";
        if (typeof data.confidence === 'number') {
            confidenceStr = data.confidence <= 1 
              ? (data.confidence * 100).toFixed(1) + '%'
              : data.confidence.toFixed(1) + '%';
        } else if (data.confidence) {
            confidenceStr = data.confidence.toString();
        }

        const result = {
          id: data.ticket_id || id,
          user: 'Stress Test Agent',
          email: 'concurrent.demo@resolve.ai',
          intent: data.intent || 'Unknown',
          confidence: confidenceStr,
          rawConfidence: typeof data.confidence === 'number' ? (data.confidence <= 1 ? data.confidence * 100 : data.confidence) : 0,
          status: isResolved ? 'Automated' : 'Escalated',
          message: data.input_ticket || text,
          time: 'Just now',
          source: data.source || 'local_model',
          isLive: true,
          orderId: data.order_id,
          backendLogs: data.logs || [],
          aiMessage: data.agent_response?.message,
          flow: data.agent_response?.flow || 'auto_resolved',
          rawPayload: data
        };

        return { success: true, ticket: result };
      } catch (err) {
        return { success: false, error: err.message };
      }
    };

    try {

      const res = await fetch('https://resolveai-backend-bv4e.onrender.com/resolve-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket: ticketInput, ticket_id: genId })
      });
      
      if (!res.ok) throw new Error(`Backend Error (${res.status}) - API might be spinning up from sleep.`);
      
      let data = await res.json();
      
      // Strict pure client mapping
      const isResolved = data.agent_response?.flow !== 'escalated_to_human';
      
      let confidenceStr = "0%";
      if (typeof data.confidence === 'number') {
          confidenceStr = data.confidence <= 1 
            ? (data.confidence * 100).toFixed(1) + '%'
            : data.confidence.toFixed(1) + '%';
      } else if (data.confidence) {
          confidenceStr = data.confidence.toString();
      }
          
      const newTicket = {
        id: data.ticket_id || genId,
        user: 'Guest User',
        email: 'api.simulation@resolve.ai',
        intent: data.intent || 'Unknown',
        confidence: confidenceStr,
        status: isResolved ? 'Automated' : 'Escalated',
        message: data.input_ticket || ticketInput,
        time: 'Just now',
        source: data.source || 'local_model',
        isLive: true,
        orderId: data.order_id,
        backendLogs: data.logs || [],
        aiMessage: data.agent_response?.message,
        rawPayload: data
      };

      addTicket(newTicket, isResolved);
      setSelectedTicket(newTicket);
      setTicketInput('');
      
      setFlashKPIs(true);
      setTimeout(() => setFlashKPIs(false), 800);

    } catch (err) {
      setTestError(err.message || "Failed to reach FastAPI backend. Is Render awake?");
    } finally {
      clearInterval(phaseInterval);
      setIsSubmitting(false);
    }
  };

  const runBulkConcurrent = async () => {
    const lines = bulkInput.split('\n').filter(l => l.trim()).map(l => l.trim()).slice(0, 20);
    if (lines.length === 0) return;

    setIsBulkRunning(true);
    setBulkSummary(null);
    setBatchTime(0);
    const startTime = Date.now();
    
    // Stopwatch interval
    const timerInterval = setInterval(() => {
       setBatchTime(prev => prev + 0.1);
    }, 100);

    // Initialize results with "Queued"
    const initialBatch = lines.map((text, i) => ({
      id: `TKT-${1000 + i + Math.floor(Math.random() * 500)}`,
      text,
      executionStatus: 'queued',
      result: null,
      latency: 0
    }));
    setBulkResults(initialBatch);

    const executeBatch = async () => {
       const tasks = initialBatch.map(async (item, index) => {
          // Staggered delay for "Processing" wave
          await new Promise(r => setTimeout(r, index * 120));
          
          const tStart = Date.now();
          setBulkResults(prev => prev.map((it, idx) => idx === index ? { ...it, executionStatus: 'resolving' } : it));
          
          try {
             const res = await fetch('https://resolveai-backend-bv4e.onrender.com/resolve-ticket', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ ticket: item.text, ticket_id: item.id })
             });
             
             if (!res.ok) throw new Error(`HTTP ${res.status}`);
             const data = await res.json();
             
             const tEnd = Date.now();
             const latency = ((tEnd - tStart) / 1000).toFixed(1);

             // Map result similar to single mode
             const isResolved = data.agent_response?.flow !== 'escalated_to_human';
             let confidenceNum = 0;
             if (typeof data.confidence === 'number') {
                confidenceNum = data.confidence <= 1 ? data.confidence * 100 : data.confidence;
             }
             
             const confidenceStr = confidenceNum.toFixed(1) + '%';

             const mappedTicket = {
               id: data.ticket_id || item.id,
               user: 'Demo Agent',
               intent: data.intent || 'Unknown',
               confidence: confidenceStr,
               rawConfidence: confidenceNum,
               status: isResolved ? 'Automated' : 'Escalated',
               message: item.text,
               time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
               source: data.source || 'local_model',
               isLive: true,
               backendLogs: data.logs || [],
               aiMessage: data.agent_response?.message,
               flow: data.agent_response?.flow,
               rawPayload: data
             };

             // Update single batch item
             setBulkResults(prev => prev.map((it, idx) => idx === index ? { 
                ...it, 
                executionStatus: 'success', 
                result: mappedTicket,
                latency
             } : it));

             // Also add to main context queue
             addTicket(mappedTicket, isResolved);

          } catch (err) {
             setBulkResults(prev => prev.map((it, idx) => idx === index ? { 
                ...it, 
                executionStatus: 'error', 
                error: err.message,
                latency: ((Date.now() - tStart) / 1000).toFixed(1)
             } : it));
          }
       });

       await Promise.all(tasks);
       
       clearInterval(timerInterval);
       const endTime = Date.now();
       const finalResults = await new Promise(resolve => {
          setBulkResults(prev => {
             resolve(prev);
             return prev;
          });
       });

       const finishedResults = finalResults.filter(r => r.executionStatus === 'success');
       const successCount = finishedResults.length;
       
       const totalTimeTaken = ((endTime - startTime) / 1000).toFixed(2);
       setBatchTime(parseFloat(totalTimeTaken));

       const summary = {
          total: finalResults.length,
          resolved: finishedResults.filter(r => r.result?.status === 'Automated').length,
          escalated: finishedResults.filter(r => r.result?.status === 'Escalated').length,
          local: finishedResults.filter(r => r.result?.source === 'local_model').length,
          fallback: finishedResults.filter(r => r.result?.source === 'openrouter_fallback' || r.result?.source === 'llm_fallback').length,
          avgConfidence: successCount > 0 
             ? (finishedResults.reduce((acc, r) => acc + (r.result?.rawConfidence || 0), 0) / successCount).toFixed(1)
             : 0,
          timeTaken: totalTimeTaken
       };
       
       setBulkSummary(summary);
       setIsBulkRunning(false);
    };

    executeBatch();
  };



  const renderSourceBadge = () => {
     if (!selectedTicket) return null;
     const source = selectedTicket.source;
     if (source === 'local_model' || source === 'Local Model') {
        return (
           <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                 <ShieldCheck size={18} /> LOCAL AI MODEL
              </div>
              <div className="text-emerald-600/80 text-xs font-semibold">Keywords + Semantic (TF-IDF) + all-MiniLM-L6-v2</div>
           </div>
        );
     }
     if (source === 'openrouter_fallback' || source === 'LLM Fallback' || source === 'llm_fallback') {
        return (
           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex items-center gap-2 text-amber-700 font-bold mb-1">
                 <AlertTriangle size={18} /> LLM FALLBACK
              </div>
              <div className="text-amber-600/80 text-xs font-semibold">OpenRouter Intelligent Resolution Layer</div>
           </div>
        );
     }
     return null;
  };

  const renderPipelineVisual = () => {
    if (!selectedTicket) return null;
    const source = selectedTicket.source;
    if (source === 'local_model' || source === 'Local Model') {
       return (
          <div className="flex flex-col gap-2 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm font-medium">
             <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16}/> Keyword Match</div>
             <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16}/> Semantic Match (TF-IDF)</div>
             <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16}/> all-MiniLM-L6-v2 Logic Layer</div>
             <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16}/> Confidence Passed</div>
             <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16}/> Auto Resolved</div>
          </div>
       )
    }
    if (selectedTicket.status === 'Escalated') {
       return (
          <div className="flex flex-col gap-2 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm font-medium">
             <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16}/> Keyword Attempted</div>
             <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16}/> Semantic Attempted</div>
             <div className="flex items-center gap-2 text-red-600"><X size={16}/> LLM Attempted</div>
             <div className="flex items-center gap-2 text-red-600"><AlertCircle size={16}/> Human Escalation Triggered</div>
          </div>
       )
    }
    return (
      <div className="flex flex-col gap-2 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm font-medium">
         <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16}/> Keyword Attempted</div>
         <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={16}/> Semantic Attempted</div>
         <div className="flex items-center gap-2 text-red-600"><X size={16}/> Threshold Not Met</div>
         <div className="flex items-center gap-2 text-amber-600"><AlertTriangle size={16}/> LLM Fallback Activated</div>
      </div>
   )
  };

  return (
    <div className="flex flex-col gap-6">
      
       {/* Top Header */}
       <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
             <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                   Support Intelligence Engine Live 
                   <div className="bg-primary-100 text-primary-700 text-[10px] font-black px-2 py-0.5 rounded-full tracking-tighter uppercase mb-0.5">LIVE CONCURRENT MODE</div>
                </h1>
                <div className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
                   Keyword Rules + TF-IDF + all-MiniLM-L6-v2 + LLM Escalation
                   <span className="text-[10px] text-slate-400 font-normal italic lowercase tracking-tight">Processed using async parallel ticket execution</span>
                </div>
             </div>
             {/* Live & Persistence Badge */}
             <div className="flex flex-col gap-1.5 ml-4">
                <div className="badge badge-success border border-emerald-200/50 shadow-sm flex items-center gap-1.5 px-3 py-1 bg-emerald-50 self-start animate-fade-in">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div> 
                   <span className="font-bold tracking-wide text-emerald-700 text-xs uppercase">Intake Active</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 text-slate-100 rounded-lg text-[10px] font-mono border border-slate-700 shadow-lg">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                   <span className="opacity-60 uppercase font-bold tracking-widest text-[8px]">Origin</span> 
                   <span className="text-blue-300 font-bold">{window.location.origin.replace('http://', '')}</span>
                </div>
             </div>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500">
                <CheckCircle2 size={12} className="text-emerald-500" />
                Cross-Tab Persistence Active
             </div>
             <button className="text-xs text-slate-400 font-semibold uppercase tracking-wider hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1.5 group" onClick={resetSandbox}>
                <RefreshCw size={12} className="group-hover:animate-spin" />
                Reset Sandbox
             </button>
          </div>
       </div>
      
      {/* Inline Live Ticket Submission */}
      <div className="card p-5 border border-primary-200/50 bg-white shadow-[0_0_15px_rgba(99,102,241,0.03)] rounded-xl flex-shrink-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500"></div>
        <div className="flex gap-6 items-start">
           <div className="flex-1">
             <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Terminal size={18} className="text-primary-500" />
                Provide Live Ticket Payload
             </h2>
             <textarea 
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter customer complaint, refund issue, delivery problem, login issue, etc."
                className="w-full h-16 min-h-[64px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition resize-none disabled:opacity-50 shadow-inner"
             />
             
             {testError && (
                <div className="mt-2 text-red-600 text-xs font-semibold flex items-center gap-1 bg-red-50 p-2 rounded border border-red-100 inline-flex">
                   <ServerCrash size={14} className="shrink-0"/> {testError}
                </div>
             )}
             
             {isSubmitting && (
               <div className="mt-3 flex items-center gap-3">
                 <div className="text-primary-600 text-xs font-semibold flex items-center gap-2 w-48 shrink-0">
                    <Activity size={14} className="animate-pulse" />
                    Transmitting to FastAPI...
                 </div>
                 <div className="w-full bg-primary-100 h-1.5 rounded-full overflow-hidden max-w-sm">
                    <div className="bg-primary-500 h-full transition-all duration-[1200ms] ease-out rounded-full w-full animate-pulse"></div>
                 </div>
               </div>
             )}
           </div>
           
           <div className="pt-9">
             <button 
                onClick={submitLiveTicket}
                disabled={!ticketInput.trim() || isSubmitting}
                className={`btn py-2.5 px-6 flex items-center justify-center gap-2 text-sm font-bold shadow-sm transition-all ${isSubmitting ? 'bg-primary-300 cursor-not-allowed text-white' : 'btn-primary hover:-translate-y-0.5 hover:shadow-md'}`}
             >
                {isSubmitting ? (
                  <>
                     <div className="w-4 h-4 border-[2px] border-white/30 border-t-white rounded-full animate-spin"></div>
                     Awaiting Response
                  </>
                ) : (
                  <>
                     <Send size={16} /> POST /resolve-ticket
                  </>
                )}
             </button>
           </div>
        </div>
      </div>

      {/* Concurrent Ticket Stress Test */}
      <div className="card p-6 border border-slate-200 bg-white shadow-sm rounded-xl flex-shrink-0">
        <div className="flex flex-col lg:flex-row gap-8">
           <div className="flex-1">
             <div className="flex items-center justify-between mb-4">
                <div>
                   <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Layers size={20} className="text-primary-600" />
                      Concurrent Ticket Stress Test
                   </h2>
                   <p className="text-slate-500 text-sm font-medium">Submit up to 20 live tickets simultaneously and watch the platform resolve them in parallel.</p>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${getTicketCount() > 20 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-primary-50 text-primary-600 border-primary-100'}`}>
                   {getTicketCount()} / 20 Tickets Ready
                </div>
             </div>

             <textarea 
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                disabled={isBulkRunning}
                placeholder="Enter tickets (one per line)..."
                className="w-full h-32 p-4 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition resize-none shadow-inner"
             />

             {getTicketCount() > 20 && (
                <div className="mt-2 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-2">
                   <AlertCircle size={12} /> Maximum 20 tickets allowed per run
                </div>
             )}

             <div className="mt-4 flex flex-wrap gap-3">
                <button 
                   onClick={runBulkConcurrent}
                   disabled={isBulkRunning || getTicketCount() === 0 || getTicketCount() > 20}
                   className="btn btn-primary px-8 py-3 rounded-xl flex items-center gap-2 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none"
                >
                   {isBulkRunning ? (
                      <><Activity size={18} className="animate-spin" /> Executing Stress Test...</>
                   ) : (
                      <><PlayCircle size={18} /> Run Concurrent Demo</>
                   )}
                </button>

                <button 
                   onClick={() => setBulkInput(BULK_DEMO_DATA)}
                   disabled={isBulkRunning}
                   className="btn bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                   Load Best Demo Dataset
                </button>
                <button 
                   onClick={() => {setBulkInput(''); setBulkResults([]); setBulkSummary(null);}}
                   disabled={isBulkRunning}
                   className="btn bg-slate-100 text-slate-600 px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-slate-200 transition-all"
                >
                   Clear
                </button>
             </div>
           </div>
        </div>

        {/* Bulk Results & Progress Area */}
        {(bulkResults.length > 0 || isBulkRunning) && (
           <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={18} className={isBulkRunning ? "text-primary-500 animate-pulse" : "text-slate-400"} />
                    Live Execution Monitor
                 </h3>
                 {isBulkRunning && (
                    <div className="flex items-center gap-4 flex-1 max-w-md ml-8">
                       <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-primary-500 transition-all duration-500" 
                             style={{ width: `${(bulkResults.filter(r => r.executionStatus !== 'pending' && r.executionStatus !== 'resolving').length / bulkResults.length) * 100}%` }}
                          ></div>
                       </div>
                       <span className="text-[10px] font-black font-mono text-slate-400">
                          {bulkResults.filter(r => r.executionStatus !== 'pending' && r.executionStatus !== 'resolving').length} / {bulkResults.length}
                       </span>
                    </div>
                 )}
              </div>

              {/* Grid of Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {bulkResults.map((item, i) => {
                    const res = item.result;
                    let borderColor = "border-slate-100";
                    let glowColor = "";
                    let shadowStyle = "shadow-sm";
                    
                    if (item.executionStatus === 'resolving') {
                       borderColor = "border-blue-400";
                       glowColor = "shadow-[0_0_15px_rgba(59,130,246,0.2)]";
                    }
                    if (item.executionStatus === 'error') borderColor = "border-red-300 bg-red-50/10";
                    if (item.executionStatus === 'success' && res) {
                       if (res.status === 'Automated') {
                          borderColor = "border-emerald-400";
                          glowColor = "shadow-[0_0_20px_rgba(16,185,129,0.15)]";
                       } else if (res.source.includes('fallback')) {
                          borderColor = "border-purple-400";
                          glowColor = "shadow-[0_0_20px_rgba(168,85,247,0.15)]";
                       } else {
                          borderColor = "border-amber-400";
                          glowColor = "shadow-[0_0_20px_rgba(245,158,11,0.15)]";
                       }
                    }

                    return (
                       <div 
                          key={i} 
                          style={{ animationDelay: `${i * 100}ms` }}
                          className={`p-4 rounded-2xl border-[1.5px] transition-all duration-500 flex flex-col h-full bg-white hover:-translate-y-1.5 hover:shadow-xl group animate-slide-up-reveal ${borderColor} ${glowColor}`}
                       >
                          <div className="flex justify-between items-start mb-3">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tighter uppercase">{item.id}</span>
                                {item.executionStatus === 'success' && (
                                   <span className="text-[9px] font-mono font-bold text-slate-300 italic">Latency: {item.latency}s</span>
                                )}
                             </div>
                             {item.executionStatus === 'queued' && <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 uppercase tracking-widest">Queued</span>}
                             {item.executionStatus === 'resolving' && (
                                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                                   <RefreshCw size={10} className="animate-spin"/> Processing
                                </span>
                             )}
                             {item.executionStatus === 'error' && <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-widest">Failed</span>}
                             {item.executionStatus === 'success' && (
                                <div className="flex flex-col items-end gap-1">
                                   <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${
                                      res.status === 'Automated' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                                      res.source.includes('fallback') ? 'text-purple-700 bg-purple-50 border-purple-100' :
                                      'text-amber-700 bg-amber-50 border-amber-100'
                                   }`}>
                                      {res.status}
                                   </span>
                                   <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                      res.status === 'Automated' ? 'bg-emerald-100 text-emerald-800' : 
                                      res.source.includes('fallback') ? 'bg-purple-100 text-purple-800' :
                                      'bg-amber-100 text-amber-800'
                                   }`}>
                                      {res.status === 'Automated' ? 'LOCAL' : res.source.includes('fallback') ? 'FALLBACK' : 'HUMAN'}
                                   </span>
                                </div>
                             )}
                          </div>
                          
                          <p className="text-xs text-slate-600 line-clamp-2 mb-4 font-medium flex-1 italic group-hover:text-slate-900 transition-colors">"{item.text}"</p>
                          
                          {item.executionStatus === 'success' && (
                             <div className="space-y-2 border-t border-slate-50 pt-3">
                                <div className="flex items-center justify-between">
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Resolution Layer</span>
                                   <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{res.intent}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Confidence</span>
                                   <div className="text-[10px] font-black text-blue-600 font-mono">
                                      <AnimatedNumber value={res.rawConfidence} suffix="%" decimals={1} />
                                   </div>
                                </div>
                                <div className="pt-2 mt-2 border-t border-slate-50 flex items-center gap-1.5 overflow-hidden">
                                   <Bot size={12} className={`shrink-0 ${res.status === 'Automated' ? 'text-emerald-500' : res.source.includes('fallback') ? 'text-purple-500' : 'text-amber-500'}`} />
                                   <span className="text-[10px] text-slate-500 line-clamp-1 italic font-medium">{res.aiMessage}</span>
                                </div>
                             </div>
                          )}

                          {(item.executionStatus === 'queued' || item.executionStatus === 'resolving') && (
                             <div className="mt-auto h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div className={`h-full bg-blue-500 transition-all duration-1000 ${item.executionStatus === 'resolving' ? 'w-2/3 animate-pulse' : 'w-0'}`}></div>
                             </div>
                          )}
                       </div>
                    );
                 })}
              </div>

              {/* Summary Panel */}
              {bulkSummary && (
                 <div className="mt-12 animate-slide-up-reveal">
                    <div className="bg-slate-950 rounded-[2rem] p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 animate-gradient-xy bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30">
                       {/* High-End Animated Glows */}
                       <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/10 blur-[120px] rounded-full animate-float"></div>
                       <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full"></div>
                       
                       <div className="relative z-10">
                          <div className="flex items-center justify-between mb-10">
                             <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                                <div className="flex flex-col">
                                   <div className="text-primary-400 text-[11px] font-black uppercase tracking-[0.3em]">AI Operations Intelligence Report</div>
                                   <h3 className="text-white text-xl font-bold tracking-tight mt-1">Batch Execution Summary</h3>
                                </div>
                             </div>
                             <div className="flex flex-col items-end">
                                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Throughput Time</div>
                                <div className="text-emerald-400 text-3xl font-mono font-black italic tracking-tighter">
                                   <AnimatedNumber value={batchTime} suffix="s" decimals={2} />
                                </div>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
                             <div className="flex flex-col group cursor-default">
                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-primary-400 transition-colors">Tickets Processed</span>
                                <span className="text-white text-4xl font-black group-hover:scale-110 transition-transform origin-left w-fit block"><AnimatedNumber value={bulkSummary.total} /></span>
                             </div>
                             <div className="flex flex-col group cursor-default">
                                <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-emerald-400 transition-colors">Local Resolved</span>
                                <span className="text-white text-4xl font-black group-hover:scale-110 transition-transform origin-left w-fit block"><AnimatedNumber value={bulkSummary.local} /></span>
                             </div>
                             <div className="flex flex-col group cursor-default">
                                <span className="text-purple-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-purple-400 transition-colors">LLM Fallback</span>
                                <span className="text-white text-4xl font-black group-hover:scale-110 transition-transform origin-left w-fit block"><AnimatedNumber value={bulkSummary.fallback} /></span>
                             </div>
                             <div className="flex flex-col group cursor-default">
                                <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-amber-400 transition-colors">Human Escalated</span>
                                <span className="text-white text-4xl font-black group-hover:scale-110 transition-transform origin-left w-fit block"><AnimatedNumber value={bulkSummary.escalated} /></span>
                             </div>
                             <div className="flex flex-col group cursor-default">
                                <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-blue-300 transition-colors">Avg Confidence</span>
                                <span className="text-white text-4xl font-black group-hover:scale-110 transition-transform origin-left w-fit block"><AnimatedNumber value={parseFloat(bulkSummary.avgConfidence)} suffix="%" decimals={1} /></span>
                             </div>
                          </div>
                          
                          <div className="mt-12 pt-8 border-t border-slate-800/50 flex justify-between items-center">
                             <div className="flex items-center gap-6">
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                   <CheckCircle2 size={16} className="text-emerald-500" />
                                   {bulkSummary.escalated > 0 ? 'Completed with fallback recoveries' : 'Execution completed successfully'}
                                </div>
                                {bulkSummary.local / bulkSummary.total > 0.8 && (
                                   <div className="text-[10px] text-primary-400 bg-primary-400/5 px-3 py-1 rounded-full border border-primary-400/20 font-bold uppercase tracking-widest">High Efficiency Run</div>
                                )}
                             </div>
                             <button 
                                onClick={() => {setBulkInput(''); setBulkResults([]); setBulkSummary(null); setBatchTime(0);}}
                                className="px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
                             >
                                Clear Platform State
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}
      </div>




      {/* Persistent Animated KPIs */}
      <div className="flex gap-6 flex-shrink-0">
         <StatCard title="Resolved Today" value={kpis.resolved} decimals={0} trend="12.5%" isPositive={true} flash={flashKPIs} />
         <StatCard title="Auto Resolution Rate" value={kpis.rate} suffix="%" decimals={1} trend="4.1%" isPositive={true} flash={flashKPIs} />
         <StatCard title="Avg Response Time" value={kpis.time} suffix="s" decimals={1} trend="-0.4s" isPositive={true} flash={flashKPIs} />
         <StatCard title="Ops Savings (MTD)" value={kpis.savings} prefix="$" suffix="K" decimals={1} trend="$14K" isPositive={true} flash={flashKPIs} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
        {/* Ticket List */}
        <div className="lg:w-[40%] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[52vh] lg:min-h-[60vh]">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
               <h2 className="font-bold text-slate-900 flex items-center gap-2">Operations Queue</h2>
               <span className="badge badge-neutral bg-slate-200 font-mono text-[10px] px-2 rounded-full">{tickets.length} LIVE</span>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost px-2 py-1 hover:bg-white transition-colors"><Filter size={16} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-visible">
            {tickets.map((ticket, index) => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className={`p-5 border-b border-slate-50 cursor-pointer transition-all relative ${
                  selectedTicket?.id === ticket.id
                    ? ticket.isLive ? 'bg-primary-50/40 border-l-[6px] border-l-primary-500' : 'bg-slate-50 border-l-[6px] border-l-slate-400' 
                    : 'hover:bg-slate-50/50 border-l-[6px] border-l-transparent'
                } ${ticket.isLive && index === 0 ? 'animate-slide-up bg-primary-50/10' : ''}`}
              >
                {ticket.isLive && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[36px] border-l-[36px] border-t-primary-500 border-l-transparent drop-shadow-sm">
                     <Zap size={12} className="absolute -top-[30px] right-[4px] text-white" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm tracking-tight">{ticket.user}</span>
                    <span className="text-[10px] font-mono text-slate-400 capitalize">· {ticket.time}</span>
                  </div>
                  {renderStatusBadge(ticket.status)}
                </div>
                <div className="text-sm font-bold text-slate-800 mb-2 tracking-tight">{ticket.intent}</div>
                <p className="text-xs text-slate-500 line-clamp-1 mb-4 pr-6 leading-relaxed italic">"{ticket.message}"</p>
                
                <div className="flex items-center gap-4 text-[10px] font-black">
                  <span className={`px-2 py-0.5 rounded-full border border-blue-100 font-mono bg-blue-50 text-blue-700`}>
                    CONF: {ticket.confidence}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-mono uppercase tracking-tighter">
                    <Bot size={12} /> {ticket.source}
                  </span>
                  <span className="text-slate-300 ml-auto uppercase tracking-widest font-mono text-[9px]">{ticket.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedTicket ? (
          <div className="lg:w-[60%] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[52vh] lg:min-h-[60vh] relative">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                Trace Profile Telemetry
              </h2>
              <button onClick={() => setShowJsonModal(true)} className="btn btn-ghost px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-slate-500 hover:text-primary-600 bg-white border border-slate-200 shadow-sm transition-all hover:scale-105 cursor-pointer relative z-[30]">
                 <Code2 size={14} /> Diagnostic JSON
              </button>
            </div>


            <div className="flex-1 p-6">
              
              {/* Context Summary */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-mono text-xs text-slate-400 mb-1">{selectedTicket.id}</div>
                  <div className="font-bold text-slate-900 text-lg">{selectedTicket.intent}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-blue-600 text-xl border-b-2 border-blue-200 pb-1">{selectedTicket.confidence}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Raw Confidence</div>
                </div>
              </div>

              {renderSourceBadge()}
              
              {renderPipelineVisual()}

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Input Payload</h4>
                <p className="text-slate-800 text-sm leading-relaxed">{selectedTicket.message}</p>
              </div>

              {selectedTicket.aiMessage && (
                 <div className="bg-primary-50/50 p-5 rounded-xl border border-primary-100 mb-6 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                    <h4 className="text-[11px] font-bold text-primary-600 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Bot size={14}/> Backend Agent Response</h4>
                    <p className="text-slate-900 font-medium text-sm leading-relaxed">{selectedTicket.aiMessage}</p>
                 </div>
              )}

              <h4 className="font-semibold text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 mt-8">
                <Terminal size={18} /> Backend Logs Trace
              </h4>

              <AnimatedLogs logs={selectedTicket.backendLogs} />
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center mt-auto flex-shrink-0">
              <div className="w-full text-center text-xs text-slate-400 font-mono tracking-widest uppercase">
                 Strict Mirroring Mode Enabled
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:w-[60%] flex items-center justify-center bg-slate-50 border border-slate-200/50 rounded-lg shadow-sm border-dashed min-h-[400px]">
            <div className="text-center text-slate-400">
              <Layers size={48} className="mx-auto mb-4 opacity-50 text-slate-300" />
              <p className="text-slate-500 font-medium">Select a trace to view deep resolution telemetry</p>
            </div>
          </div>
        )}

        {/* JSON Modal */}
        {showJsonModal && selectedTicket && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[85vh]">
                 <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold flex items-center gap-2 text-slate-800"><Code2 size={18} className="text-primary-600"/> Diagnostic JSON Payload</h3>
                    <button onClick={() => setShowJsonModal(false)} className="text-slate-400 hover:text-slate-700 bg-white shadow-sm border border-slate-200 rounded-md p-1"><X size={18}/></button>
                 </div>
                 <div className="p-6 bg-[#0A0F1C] overflow-y-auto custom-scrollbar flex-1">
                    <pre className="text-emerald-400 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all">
                       {JSON.stringify(selectedTicket.rawPayload || selectedTicket, null, 2)}
                    </pre>
                 </div>
                 <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
                    <button onClick={() => setShowJsonModal(false)} className="btn btn-secondary px-4">Close</button>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
}
