import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Trash2, PencilLine, PlusCircle, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import BudgetPulseBar from '../../components/travel/BudgetPulseBar';
import TripSubnav from '../../components/travel/TripSubnav';
import TripAccessDenied from '../../components/travel/TripAccessDenied';
import { useTripBundle } from '../../hooks/useTripBundle';
import { useAuthStore } from '../../store/authStore';
import { useTravelStore } from '../../store/travelStore';
import { useToastStore } from '../../store/toastStore';
import { BUDGET_CATEGORY_META } from '../../lib/meta';
import { formatCurrency, formatDate } from '../../lib/format';
import { validateBudgetEntry } from '../../lib/validators';

const initialForm = {
  category: 'transport',
  label: '',
  amount: '',
  entryDate: '',
  isEstimated: true,
};

export default function BudgetPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const bundle = useTripBundle(tripId);
  const currentUser = useAuthStore((store) => store.users.find((user) => user.id === store.currentUserId));
  const addBudgetEntry = useTravelStore((store) => store.addBudgetEntry);
  const updateBudgetEntry = useTravelStore((store) => store.updateBudgetEntry);
  const deleteBudgetEntry = useTravelStore((store) => store.deleteBudgetEntry);
  const pushToast = useToastStore((store) => store.pushToast);
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const totals = useMemo(() => {
    if (!bundle) return [];
    return Object.keys(BUDGET_CATEGORY_META).map((categoryKey) => ({
      category: categoryKey,
      total: bundle.budgetEntries
        .filter((entry) => entry.category === categoryKey)
        .reduce((sum, entry) => sum + Number(entry.amount), 0),
    }));
  }, [bundle]);

  useEffect(() => {
    if (bundle?.trip && !form.entryDate) {
      setForm((state) => ({ ...state, entryDate: bundle.trip.startDate }));
    }
  }, [bundle, form.entryDate]);

  if (!bundle) {
    return (
      <EmptyState
        icon={PlusCircle}
        title="Trip not found"
        description="Open a trip before editing budget entries."
        actionLabel="Back to trips"
        onAction={() => navigate('/trips')}
      />
    );
  }

  if (bundle.trip.userId !== currentUser?.id && !currentUser?.isAdmin) {
    return <TripAccessDenied actionLabel="Back to trips" onAction={() => navigate('/trips')} />;
  }

  const handleBlur = (field) => {
    setTouched((state) => ({ ...state, [field]: true }));
    setErrors(validateBudgetEntry(form));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateBudgetEntry(form);
    setTouched({ category: true, label: true, amount: true });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      if (editingId) {
        await updateBudgetEntry(editingId, {
          category: form.category,
          label: form.label,
          amount: Number(form.amount),
          entryDate: form.entryDate,
          isEstimated: form.isEstimated ? 1 : 0,
        });
        pushToast({ title: 'Budget entry updated', description: 'The entry was saved.', variant: 'success' });
      } else {
        await addBudgetEntry(tripId, form);
        pushToast({ title: 'Budget entry added', description: 'New cost added to the budget.', variant: 'success' });
      }
      setForm(initialForm);
      setEditingId(null);
      setTouched({});
      setErrors({});
    } catch (error) {
      pushToast({ title: 'Budget save failed', description: error.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const chartData = totals.map((item) => ({
    name: BUDGET_CATEGORY_META[item.category].label,
    total: item.total,
  }));

  const budgetSummary = bundle.finances;

  return (
    <div className="space-y-6">
      <TripSubnav basePath={`/trips/${tripId}`} />

      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Budget</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">{bundle.trip.title}</h1>
            <p className="mt-1 text-sm text-muted">Track estimates, actuals, and category totals.</p>
          </div>
          <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Activity cost</p>
            <p className="mt-1 text-xl font-semibold text-text">{formatCurrency(budgetSummary.activityCost)}</p>
          </div>
        </div>
      </section>

      {budgetSummary.budgetStatus === 'over' ? (
        <Card className="flex items-start gap-3 border-rose-200 bg-rose-50 p-5 text-rose-700">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Trip is over budget</p>
            <p className="mt-1 text-sm">The combined budget entries and activity costs exceed the budget cap.</p>
          </div>
        </Card>
      ) : null}

      <BudgetPulseBar
        budget={bundle.trip.totalBudget}
        spent={budgetSummary.totalSpent}
        activityCost={budgetSummary.activityCost}
        status={budgetSummary.budgetStatus}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-text">Budget Entries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg/60 text-xs uppercase tracking-[0.2em] text-muted">
                <tr>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Label</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {bundle.budgetEntries.map((entry) => (
                  <tr key={entry.id} className="border-t border-border">
                    <td className="px-5 py-4">
                      <Badge tone="blue">{BUDGET_CATEGORY_META[entry.category]?.label}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-text">{entry.label}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-text">{formatCurrency(entry.amount)}</td>
                    <td className="px-5 py-4 text-sm text-muted">{entry.entryDate ? formatDate(entry.entryDate) : '-'}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        className="rounded-full bg-bg px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-text"
                        onClick={async () => {
                          await updateBudgetEntry(entry.id, { isEstimated: entry.isEstimated ? 0 : 1 });
                        }}
                      >
                        {entry.isEstimated ? 'Estimated' : 'Actual'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setForm({
                              category: entry.category,
                              label: entry.label,
                              amount: String(entry.amount),
                              entryDate: entry.entryDate || '',
                              isEstimated: Boolean(entry.isEstimated),
                            });
                            setEditingId(entry.id);
                          }}
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-danger"
                          onClick={async () => {
                            await deleteBudgetEntry(entry.id);
                            pushToast({ title: 'Budget entry deleted', description: 'The entry was removed.', variant: 'success' });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form className="space-y-4 border-t border-border p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Category" as="select" value={form.category} onChange={(event) => setForm((state) => ({ ...state, category: event.target.value }))}>
                {Object.entries(BUDGET_CATEGORY_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </Input>
              <Input
                label="Label"
                value={form.label}
                onChange={(event) => setForm((state) => ({ ...state, label: event.target.value }))}
                onBlur={() => handleBlur('label')}
                error={touched.label ? errors.label : ''}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) => setForm((state) => ({ ...state, amount: event.target.value }))}
                onBlur={() => handleBlur('amount')}
                error={touched.amount ? errors.amount : ''}
              />
              <Input
                label="Date"
                type="date"
                value={form.entryDate}
                onChange={(event) => setForm((state) => ({ ...state, entryDate: event.target.value }))}
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-text">
              <input
                type="checkbox"
                checked={form.isEstimated}
                onChange={(event) => setForm((state) => ({ ...state, isEstimated: event.target.checked }))}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              Estimated amount
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" loading={loading}>
                {editingId ? 'Update Entry' : 'Add Entry'}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel Edit
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-text">Category Breakdown</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#E8E2D9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="total" fill="#2563EB" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-text">Budget Summary</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
                <span className="text-sm text-muted">Total budget</span>
                <span className="font-semibold text-text">{formatCurrency(bundle.trip.totalBudget)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
                <span className="text-sm text-muted">Spent</span>
                <span className="font-semibold text-text">{formatCurrency(budgetSummary.totalSpent)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
                <span className="text-sm text-muted">Activity cost</span>
                <span className="font-semibold text-text">{formatCurrency(budgetSummary.activityCost)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
