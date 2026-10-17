import { useState } from 'react';
import { Moon, Sun, Monitor, ShieldAlert, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export function SettingsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('moneyflow_theme') || 'system');
  const [currency, setCurrency] = useState('INR');
  const [name, setName] = useState('Saifullah Khalid');
  const [email, setEmail] = useState('saifullah@example.com');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('moneyflow_theme', 'dark');
    } else if (selectedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('moneyflow_theme', 'light');
    } else {
      localStorage.removeItem('moneyflow_theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-text-primary">System Preferences & Settings</h2>
        <p className="text-xs text-text-muted mt-0.5">
          Configure appearance, default currencies, profile details, and account security.
        </p>
      </div>

      {/* Appearance & Theme Card */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Theme</CardTitle>
          <p className="text-xs text-text-muted">Choose your preferred visual presentation mode</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Theme', icon: Sun },
              { id: 'dark', label: 'Dark Theme', icon: Moon },
              { id: 'system', label: 'System Default', icon: Monitor },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'border-border-subtle bg-card hover:bg-surface text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className="font-semibold text-xs">{t.label}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Currency & Locale Card */}
      <Card>
        <CardHeader>
          <CardTitle>Currency & Regional Formats</CardTitle>
          <p className="text-xs text-text-muted">Standard monetary unit for balances, ledger and reporting</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-xs">
            <Select
              label="Authoritative Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                { value: 'USD', label: 'USD ($) - US Dollar' },
                { value: 'EUR', label: 'EUR (€) - Euro' },
                { value: 'GBP', label: 'GBP (£) - British Pound' },
              ]}
            />
          </div>
          <p className="text-[11px] text-text-muted">
            Note: Changing the base currency symbol updates visual presentation. Authoritative ledger arithmetic is maintained in exact decimal precision.
          </p>
        </CardContent>
      </Card>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <p className="text-xs text-text-muted">Personal identity details associated with this ledger</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save Profile Changes
              </Button>
              {savedMessage && (
                <span className="text-xs text-income-500 flex items-center gap-1 font-medium">
                  <Check className="w-4 h-4" /> Changes saved
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-expense-500/20 bg-expense-500/5">
        <CardHeader>
          <div className="flex items-center gap-2 text-expense-600 dark:text-expense-400">
            <ShieldAlert className="w-5 h-5" />
            <CardTitle className="text-expense-600 dark:text-expense-400">Danger Zone</CardTitle>
          </div>
          <p className="text-xs text-text-muted">Destructive actions cannot be reversed</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-text-secondary leading-relaxed">
            Permanently delete your account and all associated personal financial records, transaction history, categories, and savings vaults.
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => alert('Account deletion requires explicit confirmation modal in Phase 9')}
          >
            Delete Account & Wipe Financial Records
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
