import { Sparkles, PlaneTakeoff, Map, Wallet, CheckSquare, ArrowRight, ShieldCheck, CalendarRange } from 'lucide-react';
import Card from '../ui/Card';

const highlights = [
  { icon: PlaneTakeoff, label: 'Multi-city routing' },
  { icon: Map, label: 'Public itinerary links' },
  { icon: Wallet, label: 'Real budget control' },
  { icon: CheckSquare, label: 'Packing and notes' },
];

const stats = [
  { label: 'Cities seeded', value: '25+' },
  { label: 'Demo trips', value: '2' },
  { label: 'Views', value: 'Booking-style' },
];

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-bg px-4 py-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-white shadow-[0_30px_90px_rgba(15,23,42,0.12)] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#12294f_45%,#2563eb_100%)] p-8 text-white lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />
          <div className="absolute -left-16 top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#60a5fa]/20 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.12] text-white backdrop-blur">
                  <Sparkles className="h-7 w-7 text-[#93c5fd]" />
                </div>
                <div>
                  <p className="text-4xl font-semibold tracking-[-0.05em] text-white">Traveloop</p>
                  <p className="text-sm text-white/70">Premium trip planning for serious itineraries.</p>
                </div>
              </div>

              <div className="mt-10 max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/[0.55]">Plan smarter, travel cleaner</p>
                <h1 className="mt-4 text-5xl leading-[0.94] tracking-[-0.06em] text-white lg:text-7xl">
                  Book-worthy planning for every city on the route.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-white/[0.78]">
                  Traveloop keeps stops, activities, budgets, packing, and shared itineraries in one polished workspace so a trip never feels scattered.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-white/[0.12] bg-white/[0.08] p-4 backdrop-blur">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.55]">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="!border-white/10 !bg-white/10 p-4 text-white !shadow-none backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/[0.55]">Today&apos;s route</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="rounded-2xl bg-white/[0.12] px-3 py-2 text-sm font-semibold">Paris</div>
                  <ArrowRight className="h-4 w-4 text-white/[0.55]" />
                  <div className="rounded-2xl bg-white/[0.12] px-3 py-2 text-sm font-semibold">Rome</div>
                  <ArrowRight className="h-4 w-4 text-white/[0.55]" />
                  <div className="rounded-2xl bg-white/[0.12] px-3 py-2 text-sm font-semibold">Barcelona</div>
                </div>
              </Card>
              <Card className="!border-white/10 !bg-white/10 p-4 text-white !shadow-none backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/[0.55]">Trip pulse</p>
                    <p className="mt-2 text-sm font-medium text-white/[0.85]">Budget + packing + stops</p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-[#86efac]" />
                </div>
                <div className="mt-4 grid gap-2 text-sm text-white/[0.78]">
                  <div className="flex items-center justify-between rounded-2xl bg-white/[0.08] px-3 py-2">
                    <span>Trip health</span>
                    <span className="font-semibold text-white">70+</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/[0.08] px-3 py-2">
                    <span>Ready to book</span>
                    <span className="font-semibold text-white">Yes</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[1.35rem] border border-white/[0.12] bg-white/[0.08] p-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                        <Icon className="h-5 w-5 text-[#bfdbfe]" />
                      </div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[linear-gradient(180deg,#f8fbff,#eef4ff)] p-6 lg:p-10">
          <div className="w-full max-w-xl">
            <div className="mb-6 rounded-[1.5rem] border border-border bg-white/[0.85] p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">
                  <CalendarRange className="h-4 w-4" />
                  Secure account access
                </span>
                <span>Quick login</span>
                <span>Demo access ready</span>
              </div>
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
