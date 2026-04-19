import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle, Clock, Search, Send, AlertTriangle, ArrowRight, User } from 'lucide-react';

export default function ProductTour() {
  const [ticketText, setTicketText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0); // 0: Idle, 1: Intake, 2: Intent, 3: Tools, 4: Action

  // Simulate workflow
  useEffect(() => {
    if (isProcessing) {
      if (step === 0) setStep(1);
      
      const t1 = setTimeout(() => setStep(2), 1500);
      const t2 = setTimeout(() => setStep(3), 3000);
      const t3 = setTimeout(() => setStep(4), 5000);
      const t4 = setTimeout(() => setIsProcessing(false), 6000);
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      }
    }
  }, [isProcessing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketText.trim()) return;
    setStep(0);
    setIsProcessing(true);
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">How ResolveAI Works</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Experience the autonomous support resolution workflow. Type a sample ticket below to see hybrid intelligence in real-time.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column: Input */}
        <div>
          <div className="card p-8 bg-white border border-slate-200">
            <h2 className="text-xl font-bold mb-4">1. Incoming Ticket</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea 
                rows={5}
                className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none text-slate-700"
                placeholder="E.g., I was charged $50 yesterday but my subscription still says inactive. Can you fix this or refund me?"
                value={ticketText}
                onChange={(e) => setTicketText(e.target.value)}
                disabled={isProcessing}
              ></textarea>
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-500 flex gap-2">
                  <button type="button" className="underline hover:text-primary-600" onClick={() => setTicketText("Where is my package? Tracking says delivered but I haven't got it.")}>Example 1</button>
                  <button type="button" className="underline hover:text-primary-600" onClick={() => setTicketText("How do I invite teammates to my enterprise workspace?")}>Example 2</button>
                </div>
                <button type="submit" disabled={isProcessing || !ticketText.trim()} className={`btn ${isProcessing ? 'btn-secondary' : 'btn-primary'}`}>
                  {isProcessing ? 'Processing...' : 'Simulate Workflow'}
                  {!isProcessing && <Send size={16} />}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Bot size={18} className="text-primary-600" /> Hybrid Intent Engine
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              ResolveAI utilizes a cascading architecture: fast local semantic search first, followed by a large language model only when reasoning is required.
            </p>
            <div className="flex gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400">Rule Engine</span>
                <span className="text-emerald-600 font-bold">1ms</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400">Semantic Model</span>
                <span className="text-warning-600 font-bold">45ms</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400">LLM Fallback</span>
                <span className="text-primary-600 font-bold">1.2s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Output */}
        <div className="relative">
          <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-200"></div>

          <div className={`flex gap-6 mb-8 relative ${step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              <Search size={20} />
            </div>
            <div className="pt-3 flex-1">
              <h3 className="font-bold text-lg text-slate-900">Analysis & Intent</h3>
              {step >= 2 && (
                <div className="mt-3 p-4 bg-white border border-slate-200 rounded-lg animate-fade-in shadow-sm">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Detected Intent:</span>
                    <span className="font-semibold text-primary-700">Billing / Payment Issue</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Sentiment:</span>
                    <span className="font-semibold text-amber-600">Frustrated</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Confidence:</span>
                    <span className="font-semibold text-emerald-600">96.4%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`flex gap-6 mb-8 relative ${step >= 3 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              <Bot size={20} />
            </div>
            <div className="pt-3 flex-1">
              <h3 className="font-bold text-lg text-slate-900">Tool Chain Activation</h3>
              {step >= 3 && (
                <div className="mt-3 p-4 bg-white border border-slate-200 rounded-lg animate-fade-in shadow-sm flex flex-col gap-2 font-mono text-sm">
                  <div className="text-slate-600 flex items-center gap-2">
                    <Clock size={14} /> <span>fetchCustomerData(email)</span>
                  </div>
                  <div className="text-emerald-600 pl-6 border-l-2 border-slate-100 ml-1">→ Status: Active, Plan: Pro</div>
                  
                  <div className="text-slate-600 flex items-center gap-2 mt-2">
                    <Clock size={14} /> <span>checkRecentPayments()</span>
                  </div>
                  <div className="text-emerald-600 pl-6 border-l-2 border-slate-100 ml-1">→ Found: $50 charge at 08:32 AM</div>

                  <div className="text-slate-600 flex items-center gap-2 mt-2">
                    <Clock size={14} /> <span>checkSyncStatus()</span>
                  </div>
                  <div className="text-critical-600 pl-6 border-l-2 border-slate-100 ml-1">→ Error: Account provisioning failed</div>
                </div>
              )}
            </div>
          </div>

          <div className={`flex gap-6 relative ${step >= 4 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${step >= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
              <CheckCircle size={20} />
            </div>
            <div className="pt-3 flex-1">
              <h3 className="font-bold text-lg text-slate-900">Action & Resolution</h3>
              {step >= 4 && (
                <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
                    <CheckCircle size={16} /> Automated Response Sent
                  </div>
                  <p className="text-sm text-emerald-700 bg-white p-3 rounded border border-emerald-100">
                    "Hi there, I sincerely apologize for the issue. I checked your account and found that while your payment of $50 went through, our system failed to flag your account as active. I have manually synced your account—you now have full access. I have also issued a $10 credit to your balance for the inconvenience."
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="badge badge-success">Issue Fixed</span>
                    <span className="badge badge-warning">Credit Applied</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
