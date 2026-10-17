import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart as PieIcon,
  CalendarClock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Plus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { useOutletContext } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface OutletContextType {
  onOpenQuickAdd: () => void;
}

// Preview Mock Fixtures
const MOCK_MONTHLY_DATA = [
  { month: 'Jun', income: 65000, expense: 32000 },
  { month: 'Jul', income: 72000, expense: 41000 },
  { month: 'Aug', income: 68000, expense: 35000 },
  { month: 'Sep', income: 78000, expense: 43000 },
  { month: 'Oct', income: 85000, expense: 38200 },
];

const MOCK_CATEGORY_SPENDING = [
  { name: 'Housing & Rent', value: 18000, color: '#6366F1' },
  { name: 'Groceries', value: 8500, color: '#10B981' },
  { name: 'Dining Out', value: 4200, color: '#F59E0B' },
  { name: 'Utilities & Bills', value: 3500, color: '#3B82F6' },
  { name: 'Transportation', value: 2500, color: '#8B5CF6' },
  { name: 'Subscriptions', value: 1500, color: '#EC4899' },
];

const MOCK_RECENT_TRANSACTIONS = [
  {
    id: 'tx-1',
    description: 'Monthly Salary Deposit',
    category: 'Salary',
    account: 'Checking Bank',
    amount: 85000,
    type: 'INCOME',
    date: '2026-10-01',
  },
  {
    id: 'tx-2',
    description: 'Apartment Monthly Rent',
    category: 'Housing & Rent',
    account: 'Checking Bank',
    amount: 18000,
    type: 'EXPENSE',
    date: '2026-10-03',
  },
  {
    id: 'tx-3',
    description: 'Supermarket Groceries',
    category: 'Groceries',
    account: 'Cash Wallet',
    amount: 3450,
    type: 'EXPENSE',
    date: '2026-10-07',
  },
  {
    id: 'tx-4',
    description: 'Dinner with Colleagues',
    category: 'Dining Out',
    account: 'Checking Bank',
    amount: 1820,
    type: 'EXPENSE',
    date: '2026-10-11',
  },
  {
    id: 'tx-5',
    description: 'Electricity & Internet Bill',
    category: 'Utilities & Bills',
    account: 'Checking Bank',
    amount: 2400,
    type: 'EXPENSE',
    date: '2026-10-14',
  },
];

const MOCK_UPCOMING_BILLS = [
  {
    id: 'bill-1',
    name: 'Broadband Fiber Internet',
    amount: 999,
    dueDate: '2026-10-22',
    daysLeft: 5,
  },
  {
    id: 'bill-2',
    name: 'Netflix & Spotify Subscriptions',
    amount: 1199,
    dueDate: '2026-10-25',
    daysLeft: 8,
  },
  {
    id: 'bill-3',
    name: 'Health Insurance Premium',
    amount: 4500,
    dueDate: '2026-10-30',
    daysLeft: 13,
  },
];

export function DashboardPage() {
  const { onOpenQuickAdd } = useOutletContext<OutletContextType>();
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);

  // Financial calculations
  const totalBalance = 124500;
  const monthlyIncome = 85000;
  const monthlyExpense = 38200;
  const monthlyBudget = 60000;
  const budgetRemaining = monthlyBudget - monthlyExpense;
  const budgetPercent = Math.round((monthlyExpense / monthlyBudget) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner & Fixture Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border-subtle">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Preview Mode</Badge>
          <span className="text-xs text-text-muted">
            Displaying simulated financial fixtures for layout verification.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideBalances(!hideBalances)}
            leftIcon={hideBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          >
            {hideBalances ? 'Show Figures' : 'Privacy Mode'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmptyState(!showEmptyState)}
          >
            {showEmptyState ? 'View Mock Data' : 'Preview Empty State'}
          </Button>
        </div>
      </div>

      {showEmptyState ? (
        <EmptyState
          icon={<Wallet className="w-7 h-7" />}
          title="No transactions recorded yet"
          description="Start taking control of your personal finances by logging your first income or expense transaction."
          actionLabel="Record First Transaction"
          onAction={onOpenQuickAdd}
          className="my-12"
        />
      ) : (
        <>
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Balance Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Total Net Worth
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
                  {hideBalances ? '••••••' : formatCurrency(totalBalance)}
                </div>
                <div className="text-xs text-income-500 font-medium flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+12.4% vs last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Total Income Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Monthly Income
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-income-500/10 text-income-600 dark:text-income-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-income-600 dark:text-income-400 tracking-tight">
                  {hideBalances ? '••••••' : formatCurrency(monthlyIncome)}
                </div>
                <div className="text-xs text-text-muted mt-2">
                  Salary & Freelance
                </div>
              </CardContent>
            </Card>

            {/* Total Expense Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Monthly Expenses
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-expense-500/10 text-expense-600 dark:text-expense-400 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-expense-600 dark:text-expense-400 tracking-tight">
                  {hideBalances ? '••••••' : formatCurrency(monthlyExpense)}
                </div>
                <div className="text-xs text-text-muted mt-2">
                  34 transactions recorded
                </div>
              </CardContent>
            </Card>

            {/* Remaining Budget Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Budget Remaining
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <PieIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
                  {hideBalances ? '••••••' : formatCurrency(budgetRemaining)}
                </div>
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
                    <span>{budgetPercent}% spent</span>
                    <span>Limit: {formatCurrency(monthlyBudget)}</span>
                  </div>
                  <div className="w-full bg-card h-2 rounded-full overflow-hidden border border-border-subtle">
                    <div
                      className="bg-brand-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Trend Comparison Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Income vs Expenses</CardTitle>
                  <p className="text-xs text-text-muted mt-0.5">Last 5 months cash flow performance</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-income-500"></span>
                    Income
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-expense-500"></span>
                    Expense
                  </span>
                </div>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val: number) => `₹${val / 1000}k`} />
                    <Tooltip
                      formatter={(val?: any) => [formatCurrency(Number(val || 0)), '']}
                      contentStyle={{
                        backgroundColor: 'var(--color-bg-surface)',
                        borderColor: 'var(--color-border-subtle)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spending Breakdown Donut Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <p className="text-xs text-text-muted mt-0.5">Top spending categories this month</p>
              </CardHeader>
              <CardContent className="h-72 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={MOCK_CATEGORY_SPENDING}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {MOCK_CATEGORY_SPENDING.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val?: any) => [formatCurrency(Number(val || 0)), 'Spent']}
                      contentStyle={{
                        backgroundColor: 'var(--color-bg-surface)',
                        borderColor: 'var(--color-border-subtle)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-2 text-xs">
                  {MOCK_CATEGORY_SPENDING.slice(0, 4).map((cat) => (
                    <div key={cat.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-text-secondary truncate">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lower Grid: Recent Transactions + Upcoming Bills */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions Table */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <p className="text-xs text-text-muted mt-0.5">Latest income and expense records</p>
                </div>
                <Button onClick={onOpenQuickAdd} variant="ghost" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-[11px] uppercase tracking-wider text-text-muted bg-card border-y border-border-subtle">
                      <tr>
                        <th className="px-6 py-2.5 font-semibold">Description</th>
                        <th className="px-6 py-2.5 font-semibold">Category</th>
                        <th className="px-6 py-2.5 font-semibold">Date</th>
                        <th className="px-6 py-2.5 font-semibold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {MOCK_RECENT_TRANSACTIONS.map((tx) => (
                        <tr key={tx.id} className="hover:bg-card/50 transition-colors">
                          <td className="px-6 py-3.5 font-medium text-text-primary">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  tx.type === 'INCOME'
                                    ? 'bg-income-500/10 text-income-600 dark:text-income-400'
                                    : 'bg-expense-500/10 text-expense-600 dark:text-expense-400'
                                }`}
                              >
                                {tx.type === 'INCOME' ? (
                                  <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                  <ArrowDownRight className="w-4 h-4" />
                                )}
                              </div>
                              <span className="truncate max-w-[180px] sm:max-w-xs">{tx.description}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-text-secondary text-xs">{tx.category}</td>
                          <td className="px-6 py-3.5 text-text-muted text-xs">{formatDate(tx.date)}</td>
                          <td
                            className={`px-6 py-3.5 text-right font-bold font-mono text-sm ${
                              tx.type === 'INCOME'
                                ? 'text-income-600 dark:text-income-400'
                                : 'text-expense-600 dark:text-expense-400'
                            }`}
                          >
                            {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Bills Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Bills</CardTitle>
                  <p className="text-xs text-text-muted mt-0.5">Subscriptions due in next 14 days</p>
                </div>
                <CalendarClock className="w-4 h-4 text-brand-500" />
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_UPCOMING_BILLS.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-3 rounded-xl border border-border-subtle bg-card hover:border-brand-500/30 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-text-primary leading-tight">{bill.name}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Due in {bill.daysLeft} days ({formatDate(bill.dueDate)})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-text-primary">
                        {formatCurrency(bill.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
