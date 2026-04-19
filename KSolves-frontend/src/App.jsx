import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MarketingLayout from './layouts/MarketingLayout';
import AppLayout from './layouts/AppLayout';

// Pages - Marketing
import Home from './pages/marketing/Home';
import ProductTour from './pages/marketing/ProductTour';
import Pricing from './pages/marketing/Pricing';
import About from './pages/marketing/About';

// Pages - Auth
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';

// Pages - App
import Overview from './pages/app/Overview';
import LiveTickets from './pages/app/LiveTickets';
import AIAgents from './pages/app/AIAgents';
import ResolutionCenter from './pages/app/ResolutionCenter';
import Escalations from './pages/app/Escalations';
import AuditLogs from './pages/app/AuditLogs';
import Analytics from './pages/app/Analytics';
import Settings from './pages/app/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing Routes */}
        <Route path="/" element={<MarketingLayout />}>
          <Route index element={<Home />} />
          <Route path="tour" element={<ProductTour />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Product Application Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="tickets" element={<LiveTickets />} />
          <Route path="agents" element={<AIAgents />} />
          <Route path="resolutions" element={<ResolutionCenter />} />
          <Route path="escalations" element={<Escalations />} />
          <Route path="logs" element={<AuditLogs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
