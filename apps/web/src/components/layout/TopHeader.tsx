import { Menu, Plus, Sun, Moon, User } from 'lucide-react';
import { Button } from '../ui/Button';

interface TopHeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenQuickAdd: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  title: string;
  subtitle?: string;
}

export function TopHeader({
  onOpenMobileSidebar,
  onOpenQuickAdd,
  isDark,
  onToggleTheme,
  title,
  subtitle,
}: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-card lg:hidden transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold font-display tracking-tight text-text-primary leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-text-muted mt-0.5 leading-none">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Quick Add + Theme Toggle + User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Transaction Button */}
        <Button
          onClick={onOpenQuickAdd}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm"
        >
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </Button>

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          className="p-2 rounded-xl border border-border-subtle hover:bg-card text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* User Profile Avatar Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs ring-2 ring-brand-500/20">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
