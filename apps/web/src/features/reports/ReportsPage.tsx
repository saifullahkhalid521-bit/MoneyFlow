import { useState } from 'react';
import { Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatPercentage } from '../../lib/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const MOCK_TREND = [
  { date: 'Oct 01', net: 85000 },
  { date: 'Oct 05', net: 67000 },
  { date: 'Oct 10', net: 63550 },
  { date: 'Oct 15', net: 59330 },
  { date: 'Oct 20', net: 54900 },
  { date: 'Oct 25', net: 51200 },
  { date: 'Oct 31', net: 46800 },
];

export function ReportsPage() {
  const [period, setPeriod] = useState('OCT');

  const totalIncome = 85000;
  const totalExpense = 38200;
  const netSavings = totalIncome - totalExpense;
  const savingsRate = (netSavings / totalIncome) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Reports & Analytics</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Holistic cash flow performance, net savings rates, and historical spending patterns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period Selector Tabs */}
          <div className="flex items-center p-1 bg-card rounded-xl border border-border-subtle">
            {[
              { id: '30D', label: '30 Days' },
              { id: 'OCT', label: 'Oct 2026' },
              { id: 'YTD', label: '2026 YTD' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  period === p.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => alert('CSV file prepared for download')}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <span className="text-xs font-semibold uppercase text-text-secondary tracking-wider">
              Net Cash Flow
            </span>
            <div className="text-2xl font-extrabold font-display text-income-600 dark:text-income-400 mt-1">
              +{formatCurrency(netSavings)}
            </div>
            <p className="text-[11px] text-text-muted mt-1">Income minus all expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-xs font-semibold uppercase text-text-secondary tracking-wider">
              Savings Rate
            </span>
            <div className="text-2xl font-extrabold font-display text-brand-600 dark:text-brand-400 mt-1">
              {formatPercentage(savingsRate)}
            </div>
            <p className="text-[11px] text-text-muted mt-1">Percentage of income retained</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-xs font-semibold uppercase text-text-secondary tracking-wider">
              Total Inflow
            </span>
            <div className="text-2xl font-extrabold font-display text-text-primary mt-1">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-[11px] text-text-muted mt-1">Earned across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-xs font-semibold uppercase text-text-secondary tracking-wider">
              Total Outflow
            </span>
            <div className="text-2xl font-extrabold font-display text-text-primary mt-1">
              {formatCurrency(totalExpense)}
            </div>
            <p className="text-[11px] text-text-muted mt-1">Total recorded debits</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Progression Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trajectory (October 2026)</CardTitle>
          <p className="text-xs text-text-muted mt-0.5">Cumulative net funds progression over the month</p>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="netColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val: number) => `₹${val / 1000}k`} />
              <Tooltip
                formatter={(val?: any) => [formatCurrency(Number(val || 0)), 'Net Position']}
                contentStyle={{
                  backgroundColor: 'var(--color-bg-surface)',
                  borderColor: 'var(--color-border-subtle)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="net" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#netColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
