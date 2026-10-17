import { useState, useEffect } from 'react';
import {
  Wallet,
  Activity,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun,
  ShieldCheck,
  Server,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { checkHealth } from '../lib/api';
import type { HealthStatusDto } from '@moneyflow/shared';
import { DEFAULT_CURRENCY, CURRENCY_SYMBOLS } from '@moneyflow/shared';

export function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return (
      localStorage.getItem('moneyflow_theme') === 'dark' ||
      (!localStorage.getItem('moneyflow_theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  const [health, setHealth] = useState<HealthStatusDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('moneyflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('moneyflow_theme', 'light');
    }
  };

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Backend connection unavailable';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight text-text-primary">
                Money<span className="text-brand-500">Flow</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500">
                Phase 1: Foundation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border-subtle hover:bg-surface text-text-secondary hover:text-text-primary transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-br from-surface via-surface to-brand-500/5 p-8 sm:p-12 mb-10 shadow-sm">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-500 border border-brand-500/20 mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Application Foundation Verified
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-text-primary mb-4">
              Master Your Money with Precision & Clarity
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-6">
              A professional, modular personal finance engine engineered for reliable income and expense tracking, account balance integrity, and forward goal planning.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-income-500"></span>
                Currency: {DEFAULT_CURRENCY} ({CURRENCY_SYMBOLS[DEFAULT_CURRENCY]})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-500" />
                Zero-Leakage User Isolation
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-income-500" />
                Exact Minor-Unit Arithmetic
              </span>
            </div>
          </div>
        </div>

        {/* Status Verification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: API Server Status */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <button
                onClick={fetchHealthStatus}
                disabled={loading}
                className="p-1.5 rounded-md hover:bg-card text-text-muted hover:text-text-primary transition"
                title="Refresh API status"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">Backend API Status</h3>
            {loading ? (
              <div className="text-lg font-semibold text-text-muted animate-pulse">Connecting to API...</div>
            ) : health ? (
              <div>
                <div className="flex items-center gap-2 text-lg font-bold text-income-500">
                  <CheckCircle2 className="w-5 h-5" />
                  Online & Healthy
                </div>
                <div className="text-xs text-text-muted mt-2 space-y-0.5 font-mono">
                  <div>Environment: {health.environment}</div>
                  <div>Uptime: {health.uptimeSeconds}s</div>
                  <div>Endpoint: /api/v1/health</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-lg font-bold text-amber-500">
                  <AlertCircle className="w-5 h-5" />
                  Offline / Connecting
                </div>
                <p className="text-xs text-text-muted mt-2">
                  {error || 'API server not responding on port 5000'}
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Monorepo Workspaces */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">Monorepo Packages</h3>
            <div className="text-lg font-bold text-text-primary mb-2">3 Linked Workspaces</div>
            <ul className="text-xs text-text-muted space-y-1.5 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-income-500" />
                <span>@moneyflow/shared (v0.1.0)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-income-500" />
                <span>@moneyflow/api (v0.1.0)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-income-500" />
                <span>@moneyflow/web (v0.1.0)</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Next Phase */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">Upcoming Milestone</h3>
            <div className="text-lg font-bold text-text-primary mb-2">Phase 2: UI Foundation</div>
            <p className="text-xs text-text-muted leading-relaxed">
              Design system components, responsive sidebar navigation, shells for transactions, budgets, goals, and reports.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-500">
              <span>Ready to scaffold</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
