import { useState } from 'react';
import { Wallet, Building, PiggyBank, CreditCard, Plus, ArrowLeftRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { formatCurrency } from '../../lib/formatters';

const MOCK_ACCOUNTS = [
  {
    id: 'acc-1',
    name: 'Main Checking Bank',
    type: 'BANK',
    balance: 85200,
    currency: 'INR',
    institution: 'HDFC Bank',
    accountNumber: '•••• 4829',
    icon: Building,
  },
  {
    id: 'acc-2',
    name: 'Cash Wallet',
    type: 'CASH',
    balance: 4300,
    currency: 'INR',
    institution: 'Physical Cash',
    accountNumber: 'Cash on Hand',
    icon: Wallet,
  },
  {
    id: 'acc-3',
    name: 'High-Yield Emergency Fund',
    type: 'SAVINGS',
    balance: 35000,
    currency: 'INR',
    institution: 'ICICI Bank',
    accountNumber: '•••• 9102',
    icon: PiggyBank,
  },
  {
    id: 'acc-4',
    name: 'Platinum Rewards Card',
    type: 'CREDIT_CARD',
    balance: -8400,
    currency: 'INR',
    institution: 'SBI Card',
    accountNumber: '•••• 1184',
    icon: CreditCard,
  },
];

export function AccountsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('BANK');
  const [initialBalance, setInitialBalance] = useState('');

  const totalAssets = MOCK_ACCOUNTS.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = Math.abs(
    MOCK_ACCOUNTS.filter((a) => a.balance < 0).reduce((s, a) => s + a.balance, 0)
  );
  const netWorth = totalAssets - totalLiabilities;

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddOpen(false);
    setName('');
    setInitialBalance('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Accounts & Wallets</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Track balances across bank accounts, cash, savings, and credit lines.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Account
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Assets
            </span>
            <div className="text-2xl font-bold font-display text-income-600 dark:text-income-400 mt-1">
              {formatCurrency(totalAssets)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Liabilities
            </span>
            <div className="text-2xl font-bold font-display text-expense-600 dark:text-expense-400 mt-1">
              {formatCurrency(totalLiabilities)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Net Wealth Position
            </span>
            <div className="text-2xl font-bold font-display text-brand-600 dark:text-brand-400 mt-1">
              {formatCurrency(netWorth)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ACCOUNTS.map((acc) => {
          const Icon = acc.icon;
          return (
            <Card key={acc.id} className="hover:border-brand-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold font-display text-text-primary">
                        {acc.name}
                      </h4>
                      <p className="text-xs text-text-muted">
                        {acc.institution} • {acc.accountNumber}
                      </p>
                    </div>
                  </div>
                  <Badge variant={acc.type === 'CREDIT_CARD' ? 'warning' : 'neutral'} size="sm">
                    {acc.type.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="mt-6 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-text-muted">Current Balance</span>
                    <div
                      className={`text-2xl font-bold font-mono tracking-tight ${
                        acc.balance < 0 ? 'text-expense-500' : 'text-text-primary'
                      }`}
                    >
                      {formatCurrency(acc.balance)}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}>
                    Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Account Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Account"
        description="Add a new bank account, cash wallet, or savings account to your vault."
      >
        <form onSubmit={handleAddAccount} className="space-y-4">
          <Input
            label="Account Name"
            placeholder="e.g. HDFC Salary Account, Emergency Fund"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Select
            label="Account Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'BANK', label: 'Bank Account' },
              { value: 'CASH', label: 'Cash Wallet' },
              { value: 'SAVINGS', label: 'Savings Account' },
              { value: 'CREDIT_CARD', label: 'Credit Card' },
            ]}
          />
          <Input
            label="Initial Balance (₹)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
