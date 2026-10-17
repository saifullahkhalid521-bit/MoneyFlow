import { useState } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { formatCurrency, formatDate } from '../../lib/formatters';

const MOCK_RECURRING = [
  {
    id: 'rec-1',
    name: 'Broadband Fiber Internet',
    category: 'Utilities & Bills',
    account: 'Checking Bank',
    amount: 999,
    frequency: 'MONTHLY',
    nextDueDate: '2026-10-22',
    isAutoPay: true,
  },
  {
    id: 'rec-2',
    name: 'Netflix & Spotify Premium',
    category: 'Subscriptions',
    account: 'Checking Bank',
    amount: 1199,
    frequency: 'MONTHLY',
    nextDueDate: '2026-10-25',
    isAutoPay: true,
  },
  {
    id: 'rec-3',
    name: 'Health Insurance Premium',
    category: 'Health & Medical',
    account: 'Checking Bank',
    amount: 4500,
    frequency: 'MONTHLY',
    nextDueDate: '2026-10-30',
    isAutoPay: false,
  },
  {
    id: 'rec-4',
    name: 'Apartment Monthly Rent',
    category: 'Housing & Rent',
    account: 'Checking Bank',
    amount: 18000,
    frequency: 'MONTHLY',
    nextDueDate: '2026-11-01',
    isAutoPay: false,
  },
];

export function RecurringPaymentsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [paidIds, setPaidIds] = useState<string[]>([]);

  const handleMarkAsPaid = (id: string) => {
    setPaidIds([...paidIds, id]);
  };

  const totalMonthlyCommitment = MOCK_RECURRING.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">
            Recurring Payments & Subscriptions
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor active subscriptions, due dates, and mark upcoming bills as paid.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Subscription
        </Button>
      </div>

      {/* KPI Card */}
      <Card className="bg-gradient-to-br from-surface to-brand-500/5">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Fixed Monthly Commitments
            </span>
            <div className="text-3xl font-extrabold font-display text-text-primary mt-1">
              {formatCurrency(totalMonthlyCommitment)}
              <span className="text-sm font-normal text-text-muted"> / month</span>
            </div>
          </div>
          <div className="text-xs text-text-muted">
            {MOCK_RECURRING.length} active scheduled recurring obligations
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-text-muted bg-card border-b border-border-subtle">
                <tr>
                  <th className="px-6 py-3 font-semibold">Bill / Subscription</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Frequency</th>
                  <th className="px-6 py-3 font-semibold">Next Due Date</th>
                  <th className="px-6 py-3 font-semibold text-right">Amount</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {MOCK_RECURRING.map((bill) => {
                  const isPaid = paidIds.includes(bill.id);
                  return (
                    <tr key={bill.id} className="hover:bg-card/40 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-text-primary">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                            <CalendarClock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-text-primary">{bill.name}</div>
                            <div className="text-[11px] text-text-muted">{bill.account}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge variant="neutral" size="sm">
                          {bill.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-text-secondary capitalize">
                        {bill.frequency.toLowerCase()}
                      </td>
                      <td className="px-6 py-3.5 text-xs font-mono text-text-primary">
                        {formatDate(bill.nextDueDate)}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold font-mono text-sm text-text-primary">
                        {formatCurrency(bill.amount)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {isPaid ? (
                          <Badge variant="income" size="sm" hasDot>
                            Paid
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => handleMarkAsPaid(bill.id)}
                            variant="secondary"
                            size="sm"
                          >
                            Mark Paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Subscription Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Recurring Payment"
        description="Track automated subscriptions and recurring utility payments."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsAddOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Subscription Name" placeholder="e.g. Netflix, Gym" required />
          <Input label="Amount (₹)" type="number" placeholder="999" required />
          <Select
            label="Frequency"
            options={[
              { value: 'MONTHLY', label: 'Monthly' },
              { value: 'YEARLY', label: 'Yearly' },
              { value: 'WEEKLY', label: 'Weekly' },
            ]}
          />
          <Input label="Next Due Date" type="date" required />
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Subscription
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
