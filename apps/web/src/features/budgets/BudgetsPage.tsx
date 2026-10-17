import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatPercentage } from '../../lib/formatters';

const MOCK_BUDGETS = [
  {
    id: 'b-1',
    category: 'Housing & Rent',
    allocated: 20000,
    spent: 18000,
  },
  {
    id: 'b-2',
    category: 'Groceries',
    allocated: 10000,
    spent: 8500,
  },
  {
    id: 'b-3',
    category: 'Dining Out',
    allocated: 4000,
    spent: 4200, // Exceeded!
  },
  {
    id: 'b-4',
    category: 'Utilities & Bills',
    allocated: 5000,
    spent: 3500,
  },
  {
    id: 'b-5',
    category: 'Transportation',
    allocated: 4000,
    spent: 2500,
  },
  {
    id: 'b-6',
    category: 'Entertainment',
    allocated: 3000,
    spent: 1500,
  },
];

export function BudgetsPage() {
  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false);

  const totalAllocated = MOCK_BUDGETS.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = MOCK_BUDGETS.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallUtilization = (totalSpent / totalAllocated) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Monthly Budget Planner</h2>
          <p className="text-xs text-text-muted mt-0.5">
            October 2026 spending ceilings and real-time category utilization.
          </p>
        </div>
        <Button
          onClick={() => setIsSetBudgetOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Set Budget Limit
        </Button>
      </div>

      {/* Overall Budget Overview Card */}
      <Card className="bg-gradient-to-br from-surface to-brand-500/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-semibold uppercase text-text-secondary tracking-wider">
                Total Monthly Budget
              </span>
              <div className="text-3xl font-extrabold font-display text-text-primary mt-1">
                {formatCurrency(totalSpent)}{' '}
                <span className="text-sm font-normal text-text-muted">
                  / {formatCurrency(totalAllocated)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <Badge
                variant={overallUtilization >= 100 ? 'expense' : overallUtilization >= 80 ? 'warning' : 'income'}
                size="md"
                hasDot
              >
                {formatPercentage(overallUtilization)} Utilized
              </Badge>
              <p className="text-xs text-text-muted mt-1">
                {totalRemaining >= 0
                  ? `${formatCurrency(totalRemaining)} remaining`
                  : `${formatCurrency(Math.abs(totalRemaining))} over budget`}
              </p>
            </div>
          </div>

          {/* Progress Track */}
          <div className="w-full bg-card h-3 rounded-full overflow-hidden border border-border-subtle">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallUtilization >= 100
                  ? 'bg-expense-500'
                  : overallUtilization >= 80
                  ? 'bg-amber-500'
                  : 'bg-brand-500'
              }`}
              style={{ width: `${Math.min(overallUtilization, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_BUDGETS.map((item) => {
          const util = (item.spent / item.allocated) * 100;
          const isExceeded = util >= 100;
          const isWarning = util >= 80 && !isExceeded;

          return (
            <Card key={item.id} className="hover:border-brand-500/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-bold font-display text-text-primary">{item.category}</h4>
                  <Badge
                    variant={isExceeded ? 'expense' : isWarning ? 'warning' : 'income'}
                    size="sm"
                  >
                    {formatPercentage(util, 0)}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between text-xs mb-2">
                  <span className="text-text-muted">Spent: {formatCurrency(item.spent)}</span>
                  <span className="font-semibold text-text-primary">
                    Limit: {formatCurrency(item.allocated)}
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-card h-2 rounded-full overflow-hidden border border-border-subtle">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isExceeded ? 'bg-expense-500' : isWarning ? 'bg-amber-500' : 'bg-income-500'
                    }`}
                    style={{ width: `${Math.min(util, 100)}%` }}
                  />
                </div>

                <div className="mt-3 text-[11px] flex items-center gap-1.5">
                  {isExceeded ? (
                    <span className="text-expense-500 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Exceeded by {formatCurrency(item.spent - item.allocated)}
                    </span>
                  ) : (
                    <span className="text-text-muted">
                      {formatCurrency(item.allocated - item.spent)} remaining
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Set Budget Modal */}
      <Modal
        isOpen={isSetBudgetOpen}
        onClose={() => setIsSetBudgetOpen(false)}
        title="Set Category Budget"
        description="Configure spending thresholds to prevent budget overruns."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsSetBudgetOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Category" placeholder="e.g. Dining Out" required />
          <Input label="Allocated Limit (₹)" type="number" placeholder="5000" required />
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="secondary" onClick={() => setIsSetBudgetOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
