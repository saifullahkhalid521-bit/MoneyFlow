import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { DEFAULT_CURRENCY, CURRENCY_SYMBOLS } from '@moneyflow/shared';

interface QuickAddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (transaction: any) => void;
}

export function QuickAddTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: QuickAddTransactionModalProps) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME' | 'TRANSFER'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('acc-1');
  const [destinationAccountId, setDestinationAccountId] = useState('acc-2');
  const [categoryId, setCategoryId] = useState('cat-1');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0 || !description) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTx = {
        id: `tx-${Date.now()}`,
        type,
        amount: parseFloat(amount),
        description,
        accountId,
        destinationAccountId: type === 'TRANSFER' ? destinationAccountId : null,
        categoryId: type !== 'TRANSFER' ? categoryId : null,
        date,
        notes,
      };
      setIsSubmitting(false);
      onClose();
      if (onSuccess) onSuccess(newTx);
      // Reset form
      setAmount('');
      setDescription('');
      setNotes('');
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Transaction"
      description="Record a new expense, income, or transfer between your accounts."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-card rounded-xl border border-border-subtle">
          {(['EXPENSE', 'INCOME', 'TRANSFER'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                type === t
                  ? t === 'EXPENSE'
                    ? 'bg-expense-500 text-white shadow-sm'
                    : t === 'INCOME'
                    ? 'bg-income-500 text-white shadow-sm'
                    : 'bg-brand-600 text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t === 'EXPENSE' ? 'Expense' : t === 'INCOME' ? 'Income' : 'Transfer'}
            </button>
          ))}
        </div>

        {/* Amount Input */}
        <Input
          label={`Amount (${CURRENCY_SYMBOLS[DEFAULT_CURRENCY]})`}
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {/* Description Input */}
        <Input
          label="Description"
          placeholder="e.g. Grocery shopping, Salary deposit"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Account and Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label={type === 'TRANSFER' ? 'From Account' : 'Account'}
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            options={[
              { value: 'acc-1', label: 'Main Checking Bank' },
              { value: 'acc-2', label: 'Cash Wallet' },
              { value: 'acc-3', label: 'Emergency Savings' },
            ]}
          />

          {type === 'TRANSFER' ? (
            <Select
              label="To Account"
              value={destinationAccountId}
              onChange={(e) => setDestinationAccountId(e.target.value)}
              options={[
                { value: 'acc-2', label: 'Cash Wallet' },
                { value: 'acc-3', label: 'Emergency Savings' },
                { value: 'acc-1', label: 'Main Checking Bank' },
              ]}
            />
          ) : (
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={
                type === 'EXPENSE'
                  ? [
                      { value: 'cat-1', label: 'Groceries' },
                      { value: 'cat-2', label: 'Housing & Rent' },
                      { value: 'cat-3', label: 'Dining Out' },
                      { value: 'cat-4', label: 'Utilities & Bills' },
                      { value: 'cat-5', label: 'Transportation' },
                      { value: 'cat-6', label: 'Entertainment' },
                    ]
                  : [
                      { value: 'cat-inc-1', label: 'Monthly Salary' },
                      { value: 'cat-inc-2', label: 'Freelance & Consulting' },
                      { value: 'cat-inc-3', label: 'Investments' },
                    ]
              }
            />
          )}
        </div>

        {/* Date Input */}
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* Notes Input */}
        <Input
          label="Notes (Optional)"
          placeholder="Optional extra details"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={type === 'EXPENSE' ? 'danger' : type === 'INCOME' ? 'success' : 'primary'}
            isLoading={isSubmitting}
          >
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
