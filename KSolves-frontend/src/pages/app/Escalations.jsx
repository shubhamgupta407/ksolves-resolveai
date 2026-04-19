import React, { useState } from 'react';
import { useTickets } from '../../context/TicketContext';
import { ShieldAlert, ThumbsUp, ThumbsDown, MessageSquare, Clock, AlertTriangle, AlertCircle } from 'lucide-react';

export default function Escalations() {
  const { tickets, handleEscalation } = useTickets();
  const escalatedTickets = tickets.filter(t => t.status === 'Escalated');
  const handledTickets = tickets.filter(t => t.status === 'Handled' || t.status === 'Declined');
  
  const [activeTab, setActiveTab] = useState('pending');
  const [replyingTo, setReplyingTo] = useState(null); // id of ticket being replied to
  const [draftMessage, setDraftMessage] = useState('');

  const displayedTickets = activeTab === 'pending' ? escalatedTickets : handledTickets;

  const onReplySubmit = (id) => {
    if (!draftMessage.trim()) return;
    handleEscalation(id, 'reply', draftMessage);
    setReplyingTo(null);
    setDraftMessage('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="page-header shrink-0 flex justify-between items-end">
        <div>
          <h1 className="page-title flex items-center gap-2">
            Escalation Console
            <span className={`badge ${escalatedTickets.length > 0 ? 'badge-critical' : 'badge-success'} text-xs px-2 py-0.5 rounded-full`}>
               {escalatedTickets.length} {activeTab === 'pending' ? 'Action Required' : 'Cases Pending'}
            </span>
          </h1>
          <p className="page-subtitle">Human review required. Automations could not reach confidence or boundary thresholds.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-6 shrink-0 gap-6">
         <button onClick={() => setActiveTab('pending')} className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'pending' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            Pending Review ({escalatedTickets.length})
         </button>
         <button onClick={() => setActiveTab('resolved')} className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'resolved' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            Handled by Human ({handledTickets.length})
         </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-20 custom-scrollbar pr-4">
        {displayedTickets.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <ShieldAlert className="text-slate-300 w-16 h-16 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Inbox Zero</h3>
              <p className="text-slate-500 text-sm">All operations are handled or running autonomously.</p>
           </div>
        ) : (
           displayedTickets.map((ticket) => (
             <div key={ticket.id} className={`card p-6 shadow-sm border relative overflow-hidden transition hover:shadow-md ${ticket.status === 'Handled' ? 'border-emerald-200 bg-emerald-50/20' : ticket.status === 'Declined' ? 'border-slate-200 bg-slate-50 grayscale' : 'border-orange-200 bg-white'}`}>
               <div className={`absolute top-0 left-0 w-1.5 h-full ${ticket.status === 'Handled' ? 'bg-emerald-500' : ticket.status === 'Declined' ? 'bg-slate-400' : 'bg-orange-400'}`}></div>
               
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-slate-900">{ticket.id}</span>
                      <span className={`badge text-xs px-2 py-0.5 font-bold tracking-wide ${ticket.status === 'Handled' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>
                        {ticket.intent}
                      </span>
                      {ticket.status !== 'Escalated' && (
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                          Status: {ticket.status}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                       Customer: {ticket.user} ({ticket.email}) 
                       {ticket.status === 'Escalated' && (
                         <>
                           <span className="text-slate-300 mx-2">•</span> 
                           LTV: <span className="text-emerald-600 font-semibold">${(Math.random() * 5000 + 500).toFixed(0)}</span>
                         </>
                       )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock size={14}/> {ticket.status === 'Escalated' ? ticket.time : ticket.handledAt}
                    {ticket.latency && ticket.status === 'Escalated' && (
                      <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono text-[10px]">
                        LATENCY: {ticket.latency}s
                      </span>
                    )}
                  </div>
               </div>

               <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-5 shadow-inner">
                 <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Customer Message</div>
                 <p className="text-slate-800 text-sm leading-relaxed">{ticket.message}</p>
               </div>

               {ticket.humanReply && (
                 <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5 mb-5">
                   <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <MessageSquare size={14} /> Human Agent Reply
                   </div>
                   <p className="text-slate-800 text-sm italic">"{ticket.humanReply}"</p>
                 </div>
               )}

               {ticket.status === 'Escalated' && (
                 <>
                   <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-5 mb-6">
                      <div className="text-[11px] font-bold text-orange-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <AlertTriangle size={14} /> AI Context & Reason for Escalation
                      </div>
                      <ul className="text-sm font-medium text-slate-700 space-y-2 list-disc list-inside">
                         {ticket.backendLogs.filter(log => log.includes('failed') || log.includes('escalate') || log.includes('fallback')).length > 0 ? (
                            ticket.backendLogs.filter(log => log.includes('failed') || log.includes('escalate') || log.includes('fallback')).map((log, idx) => (
                               <li key={idx}>{log.replace(/->/g, ':')}</li>
                            ))
                         ) : (
                            <li>Policy Engine suspended automatic resolution due to confidence threshold limits ({ticket.confidence}%).</li>
                         )}
                      </ul>
                   </div>

                   {replyingTo === ticket.id ? (
                     <div className="bg-slate-900 rounded-xl p-4 mb-6 animate-slide-up shadow-2xl">
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Drafting Manual Response</span>
                           <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white"><AlertCircle size={14}/></button>
                        </div>
                        <textarea 
                           className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary-500 min-h-[100px] mb-4"
                           placeholder="Type your official response to the customer..."
                           value={draftMessage}
                           onChange={(e) => setDraftMessage(e.target.value)}
                           autoFocus
                        ></textarea>
                        <div className="flex justify-end gap-3">
                           <button onClick={() => setReplyingTo(null)} className="btn btn-ghost text-xs text-slate-400 font-bold uppercase tracking-widest">Cancel</button>
                           <button 
                              onClick={() => onReplySubmit(ticket.id)} 
                              disabled={!draftMessage.trim()}
                              className="btn btn-primary text-xs font-bold uppercase tracking-widest px-6"
                           >
                              Send Official Reply
                           </button>
                        </div>
                     </div>
                   ) : (
                     <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <button 
                          onClick={() => handleEscalation(ticket.id, 'approve')}
                          className="flex-1 btn bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 shadow-sm"
                        >
                           <ThumbsUp size={16} /> Override & Approve Route
                        </button>
                        <button 
                          onClick={() => handleEscalation(ticket.id, 'decline')}
                          className="flex-1 btn bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2.5 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 shadow-sm"
                        >
                           <ThumbsDown size={16} /> Decline Request
                        </button>
                        <button 
                          onClick={() => setReplyingTo(ticket.id)}
                          className="flex-1 btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2.5 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 shadow-sm"
                        >
                           <MessageSquare size={16} /> Draft Manual Reply
                        </button>
                     </div>
                   )}
                 </>
               )}
              </div>
           ))
        )}
      </div>
    </div>
  );
}
