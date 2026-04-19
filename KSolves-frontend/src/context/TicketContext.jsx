import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MOCK_TICKETS = [
  {
    id: 'TKT-8942',
    user: 'Priya Sharma',
    email: 'priya.s@techcorp.com',
    intent: 'Refund Request',
    confidence: 98,
    status: 'Automated',
    message: 'I accidentally selected the annual enterprise plan. Can you please refund the difference and switch our org to monthly?',
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    source: 'Local Model',
    type: 'billing',
    backendLogs: [
      "ticket_received -> I accidentally selected the annual enterprise plan. Can you please refund the difference and switch our org to monthly?",
      "classified_intent -> refund_request",
      "confidence -> 0.98",
      "classifier_source -> local_model",
      "action_triggered -> query_billing_db(customer_id)",
      "tool_response -> plan_type: 'annual_enterprise'",
      "action_triggered -> execute_stripe_refund(amount: prorated)",
      "tool_response -> success",
      "agent_status -> automated_resolution_complete"
    ],
    rawPayload: { intent: 'refund_request', confidence: 0.98, source: 'local_model' },
    aiMessage: 'Successfully downgraded to Monthly and refunded difference. Automated reply dispatched via SMTP.',
    orderId: 'null'
  },
  {
    id: 'TKT-8943',
    user: 'Alex Morgan',
    email: 'alex@fintech.io',
    intent: 'Login Issue',
    confidence: 95,
    status: 'Processing',
    message: 'Our SSO integration is failing with a SAML assertion error since the 2.4 platform update.',
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    source: 'LLM Fallback',
    type: 'technical',
    backendLogs: [
      "ticket_received -> Our SSO integration is failing with a SAML assertion error since the 2.4 platform update.",
      "classified_intent -> sso_login_failure",
      "confidence -> 0.95",
      "fallback_triggered -> true",
      "classifier_source -> llm_fallback",
      "action_triggered -> tail_auth_logs(org: fintech_io)",
      "tool_response -> SAML Error: Invalid Signature Config",
      "agent_status -> compiling_technical_docs..."
    ],
    rawPayload: { intent: 'sso_login_failure', confidence: 0.95, source: 'openrouter_fallback' },
    aiMessage: 'Searching internal knowledge base for SAML 2.4 signature deprecations...',
    orderId: 'null'
  },
  {
    id: 'TKT-8944',
    user: 'David Chen',
    email: 'david.c@healthstartup.net',
    intent: 'Feature Request',
    confidence: 88,
    status: 'Escalated',
    message: 'We need advanced RBAC. Your current roles are too broad for our HIPAA compliance requirements.',
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    source: 'LLM Fallback',
    type: 'product',
    backendLogs: [
      "ticket_received -> We need advanced RBAC. Your current roles are too broad for our HIPAA compliance requirements.",
      "classified_intent -> feature_request_rbac",
      "confidence -> 0.88",
      "fallback_triggered -> true",
      "classifier_source -> llm_fallback",
      "risk_boundary -> confidence < 0.90 for product_roadmap mapping",
      "agent_status -> escalated_to_human"
    ],
    rawPayload: { intent: 'feature_request_rbac', confidence: 0.88, source: 'openrouter_fallback' },
    aiMessage: 'Risk boundary exceeded. Confidence < 90% for Action Pipeline. Routed to human tier 2 support.',
    orderId: 'null'
  },
  {
    id: 'TKT-8945',
    user: 'Sarah Wilson',
    email: 'sarah.w@logistics.co',
    intent: 'Account Cancellation',
    confidence: 99,
    status: 'Automated',
    message: 'Cancel our agency workspace immediately. The contract is over.',
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    source: 'Rule Engine',
    type: 'billing',
    backendLogs: [
      "ticket_received -> Cancel our agency workspace immediately. The contract is over.",
      "classified_intent -> account_cancellation",
      "confidence -> 0.99",
      "classifier_source -> deterministic_rule_engine",
      "action_triggered -> verify_contract_status()",
      "tool_response -> status: EXPIRED",
      "action_triggered -> execute_workspace_archival()",
      "agent_status -> automated_resolution_complete"
    ],
    rawPayload: { intent: 'account_cancellation', confidence: 0.99, source: 'local_model' },
    aiMessage: 'Contract verified as expired. Workspace successfully archived safely without human intervention.',
    orderId: 'null'
  },
  {
    id: 'TKT-8946',
    user: 'Rahul Verma',
    email: 'rahul.v@datasync.com',
    intent: 'Database Timeout',
    confidence: 92,
    status: 'Processing',
    message: 'Our production database cluster is heavily rate limited during syncs.',
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    source: 'LLM Fallback',
    type: 'technical',
    backendLogs: [
      "ticket_received -> Our production database cluster is heavily rate limited during syncs.",
      "classified_intent -> database_rate_limit",
      "confidence -> 0.92",
      "fallback_triggered -> true",
      "classifier_source -> llm_fallback",
      "action_triggered -> query_cloudwatch_metrics(cluster_id)",
      "tool_response -> IOPS sustained at 99%",
      "agent_status -> generating_auto_scaling_params..."
    ],
    rawPayload: { intent: 'database_rate_limit', confidence: 0.92, source: 'openrouter_fallback' },
    aiMessage: 'Cluster running hot. Preparing automated cluster vertical scaling suggestion...',
    orderId: 'null'
  }
];

const TicketContext = createContext();

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('resolveai_global_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : MOCK_TICKETS;
      }
    } catch (e) {
      console.error("Failed to load tickets from localStorage:", e);
    }
    return MOCK_TICKETS;
  });

  const [kpis, setKpis] = useState(() => {
    try {
      const saved = localStorage.getItem('resolveai_global_kpis');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load KPIs from localStorage:", e);
    }
    return {
       total: 13540,
       resolved: 12481,
       escalated: 412,
       rate: 92.4,
       time: 2.1,
       savings: 128.4
    };
  });

  // Persist changes to localStorage with safety
  useEffect(() => {
    try {
      localStorage.setItem('resolveai_global_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error("Failed to save tickets to localStorage:", e);
    }
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem('resolveai_global_kpis', JSON.stringify(kpis));
    } catch (e) {
      console.error("Failed to save KPIs to localStorage:", e);
    }
  }, [kpis]);

  // HANDLE CROSS-TAB SYNCHRONIZATION
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'resolveai_global_tickets' && e.newValue) {
        try {
          const freshTickets = JSON.parse(e.newValue);
          setTickets(freshTickets);
        } catch (err) {
          console.error("Sync Error:", err);
        }
      }
      if (e.key === 'resolveai_global_kpis' && e.newValue) {
        try {
          const freshKpis = JSON.parse(e.newValue);
          setKpis(freshKpis);
        } catch (err) {
          console.error("KPI Sync Error:", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleEscalation = (id, action, reply = '') => {
    setTickets(prev => prev.map(t => {
       if (t.id === id) {
          let newStatus = t.status;
          if (action === 'approve') newStatus = 'Handled';
          if (action === 'decline') newStatus = 'Declined';
          if (action === 'reply') newStatus = 'Handled';
          
          return { 
             ...t, 
             status: newStatus, 
             handledBy: 'human',
             humanReply: reply || (action === 'approve' ? 'Approved by supervisor.' : ''),
             handledAt: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
             backendLogs: [
                ...t.backendLogs,
                `human_action_triggered -> ${action.toUpperCase()}`,
                `final_status -> ${newStatus.toUpperCase()}`
             ]
          };
       }
       return t;
    }));
    
    setKpis(prev => {
       const updates = { ...prev };
       if (action === 'approve' || action === 'reply') {
          updates.resolved += 1;
          updates.escalated = Math.max(0, updates.escalated - 1);
          updates.savings = Number((updates.savings + 0.5).toFixed(1));
       } else if (action === 'decline') {
          updates.escalated = Math.max(0, updates.escalated - 1);
       }
       return updates;
    });
  };

  const addTicket = (ticket, isResolved) => {
    setTickets(prev => [ticket, ...prev]);

     setKpis(prev => {
        let newTotal = prev.total + 1;
        let newResolved = prev.resolved;
        let newEscalated = prev.escalated;
        let newRate = prev.rate;
        let newTime = prev.time;
        let newSavings = prev.savings;

        if (isResolved) {
           newResolved += 1;
           newRate = Math.min(99.9, newRate + 0.04);
           const randomSavings = parseFloat((Math.random() * 0.4 + 0.1).toFixed(1)); 
           newSavings += randomSavings;
        } else {
           newEscalated += 1;
           newRate = Math.max(0, newRate - 0.08); 
           newTime += 0.1; 
        }

        return {
           total: newTotal,
           resolved: newResolved,
           escalated: newEscalated,
           rate: Number(newRate.toFixed(1)),
           time: Number(newTime.toFixed(1)),
           savings: Number(newSavings.toFixed(1)),
           timestamp: new Date(Date.now()).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }
     });

  };

  const resetSandbox = () => {
    localStorage.removeItem('resolveai_global_tickets');
    localStorage.removeItem('resolveai_global_kpis');
    window.location.reload();
  };

  return (
    <TicketContext.Provider value={{ tickets, kpis, addTicket, handleEscalation, resetSandbox }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
