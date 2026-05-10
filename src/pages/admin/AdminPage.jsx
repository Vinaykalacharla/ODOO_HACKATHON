import { useMemo } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { useTravelStore } from '../../store/travelStore';
import { getRecentUsers, getTopActivitiesFromTrips, getTopCitiesFromTrips } from '../../lib/selectors';
import { formatDate } from '../../lib/format';
import { BarChart3 } from 'lucide-react';

function StatCard({ label, value, detail }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-text">{value}</p>
      {detail ? <p className="mt-2 text-sm text-muted">{detail}</p> : null}
    </Card>
  );
}

export default function AdminPage() {
  const state = useTravelStore((current) => current);

  const totalUsers = state.users.length;
  const totalTrips = state.trips.filter((trip) => !trip.deletedAt).length;
  const totalActivities = state.tripActivities.length;
  const publicTrips = state.trips.filter((trip) => trip.isPublic && !trip.deletedAt).length;
  const tripsByStatus = useMemo(() => {
    return ['draft', 'planned', 'ongoing', 'completed'].map((status) => ({
      status,
      count: state.trips.filter((trip) => trip.status === status && !trip.deletedAt).length,
    }));
  }, [state.trips]);
  const topCities = getTopCitiesFromTrips(state, 10);
  const topActivities = getTopActivitiesFromTrips(state, 10);
  const recentUsers = getRecentUsers(state, 5);

  if (state.users.length === 0) {
    return <EmptyState icon={BarChart3} title="No admin data" description="The platform analytics are empty right now." />;
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Admin Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">Platform analytics</h1>
          <p className="mt-1 text-sm text-muted">Monitor trips, users, and the most active content across the platform.</p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Total users" value={totalUsers} detail="Registered accounts" />
        <StatCard label="Total trips" value={totalTrips} detail="Active and archived trips" />
        <StatCard label="Activities added" value={totalActivities} detail="All trip activity selections" />
        <StatCard label="Public trips" value={publicTrips} detail="Shareable itineraries" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-2xl text-text">Trips by Status</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-bg/60 text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Count</th>
              </tr>
            </thead>
            <tbody>
              {tripsByStatus.map((row) => (
                <tr key={row.status} className="border-t border-border">
                  <td className="px-5 py-4">
                    <Badge tone={row.status === 'draft' ? 'amber' : row.status === 'ongoing' ? 'blue' : 'green'}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-text">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-2xl text-text">Top Cities</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-bg/60 text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Country</th>
                <th className="px-5 py-3">Times added</th>
              </tr>
            </thead>
            <tbody>
              {topCities.map((city) => (
                <tr key={city.id} className="border-t border-border">
                  <td className="px-5 py-4 text-sm text-text">{city.flag} {city.name}</td>
                  <td className="px-5 py-4 text-sm text-muted">{city.country}</td>
                  <td className="px-5 py-4 text-sm text-text">{city.timesAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-2xl text-text">Top Activities</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-bg/60 text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-5 py-3">Activity</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Times added</th>
              </tr>
            </thead>
            <tbody>
              {topActivities.map((activity) => (
                <tr key={activity.id} className="border-t border-border">
                  <td className="px-5 py-4 text-sm text-text">{activity.name}</td>
                  <td className="px-5 py-4 text-sm text-muted">{activity.category}</td>
                  <td className="px-5 py-4 text-sm text-text">{activity.timesAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-2xl text-text">Recent Users</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-bg/60 text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Trips</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-5 py-4 text-sm text-text">{user.name}</td>
                  <td className="px-5 py-4 text-sm text-muted">{user.email}</td>
                  <td className="px-5 py-4 text-sm text-muted">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-4 text-sm text-text">{user.tripCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
