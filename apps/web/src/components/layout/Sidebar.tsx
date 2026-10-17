import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PieChart,
  Target,
  CalendarClock,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { DEFAULT_CURRENCY, CURRENCY_SYMBOLS } from '@moneyflow/shared';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { name: 'Accounts', path: '/accounts', icon: Wallet },
  { name: 'Budget Planner', path: '/budgets', icon: PieChart },
  { name: 'Savings Goals', path: '/goals', icon: Target },
  { name: 'Recurring Bills', path: '/bills', icon: CalendarClock },
  { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-surface border-r border-border-subtle transition-all duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-64',
          // Mobile responsive slide-over
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-md shadow-brand-500/20 text-white shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold font-display tracking-tight text-text-primary leading-tight">
                  Money<span className="text-brand-500">Flow</span>
                </span>
                <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                  Personal Finance
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group select-none',
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-card'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 shrink-0 transition-colors',
                        isActive ? 'text-white' : 'text-text-muted group-hover:text-text-primary'
                      )}
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Currency & Security Badge */}
        <div className="p-3 border-t border-border-subtle">
          {!collapsed ? (
            <div className="p-3 rounded-xl bg-card border border-border-subtle">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-muted font-medium">Currency</span>
                <span className="font-bold text-text-primary font-mono">
                  {DEFAULT_CURRENCY} ({CURRENCY_SYMBOLS[DEFAULT_CURRENCY]})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-income-500 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Isolated Vault</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-2 rounded-xl bg-card text-xs font-mono font-bold text-text-primary">
              {CURRENCY_SYMBOLS[DEFAULT_CURRENCY]}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
