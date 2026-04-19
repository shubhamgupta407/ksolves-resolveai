import React from 'react';
import { Filter, Download, CheckCircle2, ChevronRight, Zap, ArrowUpRight } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';

export default function ResolutionCenter() {
  const { tickets } = useTickets();
  const automatedTickets = tickets.filter(t => t.status === 'Automated');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="page-header shrink-0 flex justify-between items-end mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            Resolution Center
            <span className="badge badge-success text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">{automatedTickets.length} Auto-Solved</span>
          </h1>
          <p className="page-subtitle">Fully automated cases handled definitively without human intervention.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm font-semibold flex items-center gap-2"><Filter size={16} /> Filter</button>
          <button className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm font-semibold flex items-center gap-2"><Download size={16} /> Export CSV</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar shadow-sm rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="p-4">Ticket ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Resolution Pipeline</th>
              <th className="p-4">Latency</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">Node Operations</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {automatedTickets.length === 0 ? (
               <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 font-medium">No automated resolutions yet. Send a ticket to begin.</td>
               </tr>
            ) : (
               automatedTickets.map((row, i) => (
                 <tr key={viewTarget(row.id, i)} className="hover:bg-slate-50/80 transition-colors group">
                   <td className="p-4 font-mono font-bold text-slate-600 group-hover:text-primary-600 transition-colors">{row.id}</td>
                   <td className="p-4 font-medium text-slate-900">
                      <div>{row.user}</div>
                      <div className="text-xs text-slate-400 font-normal">{row.email}</div>
                   </td>
                   <td className="p-4">
                     <div className="flex items-center gap-2">
                       <CheckCircle2 size={16} className="text-emerald-500" />
                       <span className="text-slate-800 font-semibold">{row.intent}</span>
                     </div>
                   </td>
                   <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                         <Zap size={14} className="text-amber-500" />
                         {row.latency ? `${row.latency}s` : `${(Math.random() * 0.7 + 0.2).toFixed(1)}s`}
                      </div>
                   </td>
                   <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.confidence >= 95 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-primary-50 text-primary-700 border border-primary-200'}`}>
                         {row.confidence}%
                      </span>
                   </td>
                   <td className="p-4">
                      <div className="flex -space-x-2">
                         <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700 tooltip" title="Intent Routing">IR</div>
                         <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-700 tooltip" title="Database Exec">DB</div>
                         {row.confidence > 96 && <div className="w-7 h-7 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-amber-700 tooltip" title="Automated SMTP Dispatch">EM</div>}
                      </div>
                   </td>
                   <td className="p-4 text-right">
                     <button className="btn btn-ghost px-3 py-1.5 font-bold text-slate-400 group-hover:text-primary-600 hover:bg-slate-100 transition-colors flex items-center gap-1 ml-auto">
                        Trace Payload <ArrowUpRight size={14} />
                     </button>
                   </td>
                 </tr>
               ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function viewTarget(id, mapIndex) {
   return id + '-' + mapIndex;
}
