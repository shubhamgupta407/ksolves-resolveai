import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Search, 
  Bell, 
  Settings,
  BrainCircuit
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', to: '/app/overview' },
  { icon: Ticket, label: 'Live Tickets', to: '/app/tickets' },
  { icon: Network, label: 'AI Agents', to: '/app/agents' },
  { icon: CheckCircle2, label: 'Resolution Center', to: '/app/resolutions' },
  { icon: AlertTriangle, label: 'Escalations', to: '/app/escalations' },
  { icon: FileText, label: 'Audit Logs', to: '/app/logs' },
  { icon: BarChart3, label: 'Analytics', to: '/app/analytics' },
];

export default function AppLayout() {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <Link to="/" className="flex items-center gap-3 p-6 font-extrabold text-xl tracking-tight text-slate-900 border-b border-slate-200/60 bg-slate-50/50 hover:bg-slate-100 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-indigo-800 flex items-center justify-center text-white shadow-glow">
            <BrainCircuit size={18} strokeWidth={2.5} />
          </div>
          ResolveAI
        </Link>
        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-white shadow-sm border border-slate-200 text-primary-700' 
                    : 'text-slate-600 border border-transparent hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <NavLink 
            to="/app/settings"
            className={({ isActive }) => 
              `flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive 
                  ? 'bg-white shadow-sm border border-slate-200 text-primary-700' 
                  : 'text-slate-600 border border-transparent hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-content">
        {/* Top Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-8 justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search tickets, customers, or intents (Cmd+K)" 
                className="w-full bg-slate-100/80 border border-slate-200/60 focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-100/50 outline-none rounded-lg py-2 pl-10 pr-4 text-sm font-medium text-slate-800 transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Environment: Production
            </div>
            <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 text-primary-800 font-bold flex items-center justify-center text-sm border border-primary-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
              KS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
