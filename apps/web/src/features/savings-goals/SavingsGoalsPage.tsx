import { useState } from 'react';
import { Target, Plus, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatDate, formatPercentage } from '../../lib/formatters';

const MOCK_GOALS = [
  {
    id: 'goal-1',
    name: 'Emergency Rainy Day Fund',
    targetAmount: 150000,
    currentSaved: 95000,
    targetDate: '2027-03-31',
    category: 'Safety',
    monthsLeft: 5,
  },
  {
    id: 'goal-2',
    name: 'MacBook Pro M4 Workstation',
    targetAmount: 220000,
    currentSaved: 140000,
    targetDate: '2026-12-31',
    category: 'Tech',
    monthsLeft: 2,
  },
  {
    id: 'goal-3',
    name: 'Annual Vacation Trip',
    targetAmount: 80000,
    currentSaved: 32000,
    targetDate: '2027-06-30',
    category: 'Travel',
    monthsLeft: 8,
  },
];

export function SavingsGoalsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Savings Goals & Planning</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Forward-looking financial targets, contribution pacing, and progress tracking.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Goal
        </Button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_GOALS.map((goal) => {
          const progress = (goal.currentSaved / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentSaved;
          const monthlyRequired = Math.ceil(remaining / Math.max(goal.monthsLeft, 1));

          return (
            <Card key={goal.id} className="hover:border-brand-500/30 transition-colors flex flex-col justify-between">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <Badge variant="brand" size="sm" hasDot>
                    On Track
                  </Badge>
                </div>

                <h3 className="text-base font-bold font-display text-text-primary mb-1">
                  {goal.name}
                </h3>
                <p className="text-xs text-text-muted flex items-center gap-1 mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  Target: {formatDate(goal.targetDate)} ({goal.monthsLeft} months left)
                </p>

                {/* Progress Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-text-primary text-sm font-mono">
                      {formatCurrency(goal.currentSaved)}
                    </span>
                    <span className="text-text-muted">
                      Target: {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-card h-2.5 rounded-full overflow-hidden border border-border-subtle">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-text-muted">
                    <span>{formatPercentage(progress, 0)} complete</span>
                    <span>{formatCurrency(remaining)} left</span>
                  </div>
                </div>

                {/* Monthly Suggested Saving Box */}
                <div className="p-3 rounded-xl bg-card border border-border-subtle text-xs">
                  <span className="text-text-muted text-[11px] block">Suggested Monthly Saving</span>
                  <span className="font-bold font-mono text-brand-600 dark:text-brand-400 text-sm">
                    {formatCurrency(monthlyRequired)} / month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Savings Goal"
        description="Set a target purchase or emergency reserve to monitor future savings."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsAddOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Goal Title" placeholder="e.g. New Laptop, Vacation" required />
          <Input label="Target Amount (₹)" type="number" placeholder="50000" required />
          <Input label="Target Date" type="date" required />
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
