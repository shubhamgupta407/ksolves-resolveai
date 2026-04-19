import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BrainCircuit, ChevronRight, Menu, X, Github, Linkedin, Mail } from 'lucide-react';

export default function MarketingLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation layout state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', hash: '', label: 'Product' },
    { path: '/app/tickets', hash: '', label: 'Live Demo' },
    { path: '/', hash: '#architecture', label: 'Architecture' },
    { path: '/pricing', hash: '', label: 'Pricing' },
    { path: '/about', hash: '', label: 'About' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-primary-200 selection:text-primary-900">
      
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-slate-200/50 py-3' : 'bg-transparent border-transparent py-5'
      }`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-800 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <BrainCircuit size={18} strokeWidth={2.5} />
            </div>
            ResolveAI
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 bg-slate-50/50 px-6 py-2 rounded-full border border-slate-200/50 shadow-inner">
            {navLinks.map(link => (
              <Link 
                key={link.label} 
                to={link.hash ? link.path + link.hash : link.path} 
                className={`text-sm font-semibold transition-colors hover:text-primary-600 ${
                  location.pathname === link.path && (!link.hash || location.hash === link.hash) ? 'text-primary-600' : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Link to="/signin" className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-stripe-sm hover:bg-slate-800 hover:-translate-y-0.5 transition-all gap-1 group">
              Start Free Trial <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <button className="md:hidden text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6">
            {navLinks.map(link => (
              <Link key={link.label} to={link.hash ? link.path + link.hash : link.path} onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-slate-900">
                {link.label}
              </Link>
            ))}
            <hr className="border-slate-100" />
            <Link to="/signin" className="text-lg font-bold text-slate-600">Sign In</Link>
            <Link to="/signup" className="inline-flex justify-center rounded-xl bg-slate-900 px-6 py-3 text-lg font-bold text-white">
              Start Free Trial
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1 w-full pt-20">
        <Outlet />
      </main>

      <footer className="bg-[#0f172a] border-t border-slate-800 py-24 mt-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-64 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800/20 to-transparent"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-16">
            <div className="col-span-2 md:col-span-5">
              <div className="flex items-center gap-2 font-bold text-white text-xl tracking-tight mb-4">
                 <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-sm border border-slate-700">
                   <BrainCircuit size={18} strokeWidth={2.5} />
                 </div>
                 ResolveAI
              </div>
              <p className="text-slate-400 font-medium max-w-sm mb-6 leading-relaxed">Hybrid Support Intelligence Platform.<br/>Automating enterprise operations at edge speed.</p>
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                 Built with FastAPI • React • Hybrid AI Intelligence
              </div>
            </div>
            <div className="col-span-2 md:col-span-2">
              <h4 className="font-bold text-white mb-4 tracking-tight">Platform</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/" className="text-slate-400 hover:text-white transition-colors block">Product</Link></li>
                <li><Link to="/pricing" className="text-slate-400 hover:text-white transition-colors block">Pricing</Link></li>
                <li><Link to="/app/tickets" className="text-slate-400 hover:text-white transition-colors block">Dashboard</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-2">
              <h4 className="font-bold text-white mb-4 tracking-tight">Resources</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors block">Docs</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors block">API</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors block">Status</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-3">
              <h4 className="font-bold text-white mb-5 tracking-tight flex items-center gap-2">
                Company
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50"></span>
              </h4>
              <ul className="space-y-3.5 text-sm font-medium">
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">About <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/></Link></li>
                <li><Link to="/about#contact" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">Contact <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/></Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-10 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center lg:items-start gap-2">
              <p className="text-sm font-medium text-slate-500 tracking-tight flex items-center gap-2">
                © 2026 ResolveAI, Inc. 
                <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                <span className="text-[11px] font-mono opacity-60 uppercase tracking-widest text-slate-600">Enterprise Edition</span>
              </p>
              <div className="flex gap-5 text-xs font-semibold text-slate-600">
                 <a href="#" className="hover:text-primary-400 transition-colors uppercase tracking-widest">Privacy Policy</a>
                 <a href="#" className="hover:text-primary-400 transition-colors uppercase tracking-widest">Terms of Service</a>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/15 to-indigo-500/15 blur-2xl opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex flex-col items-center gap-4 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl px-8 py-5 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  <p className="text-[13px] font-bold text-slate-300 tracking-wide">
                    Developed by <span className="text-white font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Shubham Gupta</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-8">
                  <a href="mailto:aarushjais407@gmail.com" className="group/link flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover/link:bg-primary-500 group-hover/link:text-white transition-all shadow-inner border border-slate-700/50">
                      <Mail size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 group-hover/link:text-white transition-colors tracking-tight">aarushjais407@gmail.com</span>
                  </a>

                  <div className="flex items-center gap-3.5 pl-8 border-l border-slate-800">
                    <a href="https://github.com/shubhamgupta407" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all transform hover:-translate-y-1 shadow-lg" title="GitHub">
                      <Github size={16} />
                    </a>
                    <a href="https://www.linkedin.com/in/shubhamgupta407" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all transform hover:-translate-y-1 shadow-lg" title="LinkedIn">
                      <Linkedin size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
