import { useState } from 'react';
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Download,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/formatters';
import { useOutletContext } from 'react-router-dom';

const MOCK_TRANSACTIONS = [
  {
    id: 'tx-1',
    description: 'Monthly Salary Deposit',
    category: 'Salary',
    account: 'Checking Bank',
    amount: 85000,
    type: 'INCOME',
    date: '2026-10-01',
    notes: 'Direct deposit from employer',
  },
  {
    id: 'tx-2',
    description: 'Apartment Monthly Rent',
    category: 'Housing & Rent',
    account: 'Checking Bank',
    amount: 18000,
    type: 'EXPENSE',
    date: '2026-10-03',
    notes: 'Paid via bank transfer',
  },
  {
    id: 'tx-3',
    description: 'Supermarket Groceries',
    category: 'Groceries',
    account: 'Cash Wallet',
    amount: 3450,
    type: 'EXPENSE',
    date: '2026-10-07',
    notes: 'Weekly household supplies',
  },
  {
    id: 'tx-4',
    description: 'ATM Cash Withdrawal',
    category: 'Transfer',
    account: 'Checking Bank',
    destinationAccount: 'Cash Wallet',
    amount: 5000,
    type: 'TRANSFER',
    date: '2026-10-09',
    notes: 'Cash withdrawal for petty expenses',
  },
  {
    id: 'tx-5',
    description: 'Dinner with Colleagues',
    category: 'Dining Out',
    account: 'Checking Bank',
    amount: 1820,
    type: 'EXPENSE',
    date: '2026-10-11',
    notes: 'Italian restaurant',
  },
  {
    id: 'tx-6',
    description: 'Freelance Design Project',
    category: 'Freelance',
    account: 'Checking Bank',
    amount: 14500,
    type: 'INCOME',
    date: '2026-10-12',
    notes: 'Mobile app UI design milestone 1',
  },
  {
    id: 'tx-7',
    description: 'Electricity & Internet Bill',
    category: 'Utilities & Bills',
    account: 'Checking Bank',
    amount: 2400,
    type: 'EXPENSE',
    date: '2026-10-14',
    notes: 'Combined utility payments',
  },
  {
    id: 'tx-8',
    description: 'Metro Transit Card Recharge',
    category: 'Transportation',
    account: 'Cash Wallet',
    amount: 1000,
    type: 'EXPENSE',
    date: '2026-10-15',
    notes: 'Monthly pass top-up',
  },
];

export function TransactionsPage() {
  const { onOpenQuickAdd } = useOutletContext<{ onOpenQuickAdd: () => void }>();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filtered = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'ALL' || tx.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">
            Financial Transactions
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Complete audit trail of all income, expenses, and inter-account transfers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => alert('CSV export will download in Phase 9')}
          >
            Export CSV
          </Button>
          <Button
            onClick={onOpenQuickAdd}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-card border border-border-subtle focus:outline-none focus:border-brand-500 text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'EXPENSE', 'INCOME', 'TRANSFER'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === t
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-card border border-transparent hover:border-border-subtle'
                }`}
              >
                {t === 'ALL' ? 'All' : t === 'EXPENSE' ? 'Expenses' : t === 'INCOME' ? 'Income' : 'Transfers'}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-text-muted bg-card border-b border-border-subtle">
                <tr>
                  <th className="px-6 py-3 font-semibold">Transaction</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Account</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-card/40 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-text-primary">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            tx.type === 'INCOME'
                              ? 'bg-income-500/10 text-income-600 dark:text-income-400'
                              : tx.type === 'EXPENSE'
                              ? 'bg-expense-500/10 text-expense-600 dark:text-expense-400'
                              : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          }`}
                        >
                          {tx.type === 'INCOME' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : tx.type === 'EXPENSE' ? (
                            <ArrowDownRight className="w-4 h-4" />
                          ) : (
                            <ArrowLeftRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-text-primary">{tx.description}</div>
                          {tx.notes && <div className="text-[11px] text-text-muted">{tx.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="neutral" size="sm">
                        {tx.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-text-secondary">
                      {tx.type === 'TRANSFER'
                        ? `${tx.account} ➔ ${tx.destinationAccount}`
                        : tx.account}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-text-muted font-mono">
                      {formatDate(tx.date)}
                    </td>
                    <td
                      className={`px-6 py-3.5 text-right font-bold font-mono text-sm ${
                        tx.type === 'INCOME'
                          ? 'text-income-600 dark:text-income-400'
                          : tx.type === 'EXPENSE'
                          ? 'text-expense-600 dark:text-expense-400'
                          : 'text-text-primary'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''} {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
