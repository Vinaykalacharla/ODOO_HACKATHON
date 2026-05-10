import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, PackageCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import TripSubnav from '../../components/travel/TripSubnav';
import TripAccessDenied from '../../components/travel/TripAccessDenied';
import { useTripBundle } from '../../hooks/useTripBundle';
import { useAuthStore } from '../../store/authStore';
import { useTravelStore } from '../../store/travelStore';
import { useToastStore } from '../../store/toastStore';
import { PACKING_CATEGORY_META } from '../../lib/meta';

export default function PackingPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const bundle = useTripBundle(tripId);
  const currentUser = useAuthStore((store) => store.users.find((user) => user.id === store.currentUserId));
  const addPackingItem = useTravelStore((store) => store.addPackingItem);
  const togglePackingItem = useTravelStore((store) => store.togglePackingItem);
  const deletePackingItem = useTravelStore((store) => store.deletePackingItem);
  const pushToast = useToastStore((store) => store.pushToast);
  const [activeCategory, setActiveCategory] = useState('clothing');
  const [value, setValue] = useState('');

  const itemsByCategory = useMemo(() => {
    if (!bundle) return [];
    return bundle.packingItems.filter((item) => item.category === activeCategory);
  }, [bundle, activeCategory]);

  const packedCount = bundle?.packingItems.filter((item) => item.isPacked).length || 0;
  const totalCount = bundle?.packingItems.length || 0;

  if (!bundle) {
    return (
      <EmptyState
        icon={PackageCheck}
        title="Trip not found"
        description="Open a valid trip to manage its packing checklist."
        actionLabel="Back to trips"
        onAction={() => navigate('/trips')}
      />
    );
  }

  if (bundle.trip.userId !== currentUser?.id && !currentUser?.isAdmin) {
    return <TripAccessDenied actionLabel="Back to trips" onAction={() => navigate('/trips')} />;
  }

  const addItem = async () => {
    if (!value.trim()) return;
    await addPackingItem(tripId, { label: value, category: activeCategory });
    setValue('');
    pushToast({ title: 'Packing item added', description: 'New checklist item created.', variant: 'success' });
  };

  return (
    <div className="space-y-6">
      <TripSubnav basePath={`/trips/${tripId}`} />

      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Packing Checklist</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">{bundle.trip.title}</h1>
            <p className="mt-1 text-sm text-muted">
              {packedCount} of {totalCount} items packed
            </p>
          </div>
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-sm text-muted">
              <span>Progress</span>
              <span>{totalCount ? Math.round((packedCount / totalCount) * 100) : 0}%</span>
            </div>
            <div className="h-3 rounded-full bg-bg">
              <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${totalCount ? (packedCount / totalCount) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      </section>

      <Card className="flex flex-wrap gap-2 p-4">
        {Object.entries(PACKING_CATEGORY_META).map(([valueKey, meta]) => (
          <button
            key={valueKey}
            type="button"
            onClick={() => setActiveCategory(valueKey)}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === valueKey ? 'bg-accent text-text' : 'bg-bg text-muted hover:text-text'
            }`}
          >
            {meta.label}
          </button>
        ))}
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Category</p>
              <h2 className="mt-2 text-3xl text-text">{PACKING_CATEGORY_META[activeCategory].label}</h2>
            </div>
            <Badge tone="gray">{itemsByCategory.length} items</Badge>
          </div>

          <div className="mt-5 space-y-3">
            {itemsByCategory.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
                <label className="flex items-center gap-3 text-sm text-text">
                  <input
                    type="checkbox"
                    checked={Boolean(item.isPacked)}
                    onChange={() => togglePackingItem(item.id)}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className={item.isPacked ? 'line-through text-muted' : ''}>{item.label}</span>
                </label>
                <Button
                  variant="ghost"
                  className="text-danger"
                  onClick={async () => {
                    await deletePackingItem(item.id);
                    pushToast({ title: 'Packing item deleted', description: 'The item was removed.', variant: 'success' });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {itemsByCategory.length === 0 ? (
              <EmptyState icon={PackageCheck} title="No items in this category" description="Add a new packing item below." />
            ) : null}
          </div>

          <div className="mt-5 flex gap-3">
            <Input
              label={`Add ${PACKING_CATEGORY_META[activeCategory].label.toLowerCase()} item`}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Packable item"
              className="flex-1"
            />
            <div className="flex items-end">
              <Button onClick={addItem}>Add</Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-2xl text-text">All Categories</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(PACKING_CATEGORY_META).map(([valueKey, meta]) => {
              const count = bundle.packingItems.filter((item) => item.category === valueKey).length;
              const packed = bundle.packingItems.filter((item) => item.category === valueKey && item.isPacked).length;
              return (
                <div key={valueKey} className="rounded-2xl border border-border bg-bg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text">{meta.label}</span>
                    <Badge tone="gray">
                      {packed}/{count}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
