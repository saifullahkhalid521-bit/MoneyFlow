import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { QuickAddTransactionModal } from '../transactions/QuickAddTransactionModal';
import { cn } from '../../lib/utils';

const ROUTE_META: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Executive financial overview & metrics' },
  '/transactions': { title: 'Transactions', subtitle: 'Detailed ledger, search & filters' },
  '/accounts': { title: 'Accounts & Wallets', subtitle: 'Manage cash, bank & savings accounts' },
  '/budgets': { title: 'Monthly Budget Planner', subtitle: 'Category spending targets & utilization' },
  '/goals': { title: 'Savings Goals', subtitle: 'Future purchase planning & target forecasting' },
  '/bills': { title: 'Recurring Bills & Subscriptions', subtitle: 'Upcoming payment schedule & reminders' },
  '/reports': { title: 'Reports & Analytics', subtitle: 'Historical breakdown & spending trends' },
  '/settings': { title: 'Settings', subtitle: 'Preferences, theme, currency & profile' },
};

export function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    return (
      localStorage.getItem('moneyflow_theme') === 'dark' ||
      (!localStorage.getItem('moneyflow_theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

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

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const currentMeta = ROUTE_META[location.pathname] || {
    title: 'MoneyFlow',
    subtitle: 'Personal Finance Manager',
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <TopHeader
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ onOpenQuickAdd: () => setQuickAddOpen(true) }} />
        </main>
      </div>

      {/* Quick Add Modal */}
      <QuickAddTransactionModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </div>
  );
}
