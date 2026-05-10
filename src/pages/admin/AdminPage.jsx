import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { ShieldCheck, Users, Map, Activity, Globe, TrendingUp } from 'lucide-react';

const AdminPage = () => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setData(statsRes.data.data);
        setUsers(usersRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto"><Skeleton variant="card" className="h-[800px]" /></div>;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <ShieldCheck className="h-10 w-10 text-teal" />
          <h1 className="text-4xl">Admin Dashboard</h1>
        </div>
        <p className="text-muted text-lg">Platform-wide analytics and user management.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <AdminStatCard icon={Users} label="Total Users" value={data.totals.users} />
        <AdminStatCard icon={Map} label="Total Trips" value={data.totals.trips} />
        <AdminStatCard icon={Activity} label="Activities" value={data.totals.activities} />
        <AdminStatCard icon={Globe} label="Public Trips" value={data.totals.publicTrips} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Top Cities */}
        <Card className="p-8">
          <h3 className="text-2xl mb-6">Top Cities</h3>
          <div className="space-y-4">
            {data.topCities.map((city, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-bg rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-surface flex items-center justify-center font-bold text-xs">{i+1}</span>
                  <div>
                    <p className="font-bold">{city.name}</p>
                    <p className="text-xs text-muted">{city.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal">{city.times_added}</p>
                  <p className="text-[10px] uppercase font-bold text-muted">Stops</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Activities */}
        <Card className="p-8">
          <h3 className="text-2xl mb-6">Trending Activities</h3>
          <div className="space-y-4">
            {data.topActivities.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-bg rounded-2xl">
                <div className="flex items-center gap-3">
                  <Badge variant="gray">{act.category}</Badge>
                  <p className="font-bold truncate max-w-[200px]">{act.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">{act.times_added}</p>
                  <p className="text-[10px] uppercase font-bold text-muted">Adds</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Table */}
      <Card className="p-8 overflow-x-auto">
        <h3 className="text-2xl mb-6">Recent Users</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-widest text-muted">
              <th className="pb-4 font-bold">User</th>
              <th className="pb-4 font-bold">Email</th>
              <th className="pb-4 font-bold">Joined</th>
              <th className="pb-4 font-bold text-center">Trips</th>
              <th className="pb-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.map(u => (
              <tr key={u.id}>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <span className="font-bold">{u.name} {u.is_admin === 1 && <Badge variant="amber" className="ml-2 scale-75 origin-left">Admin</Badge>}</span>
                  </div>
                </td>
                <td className="py-4 text-sm text-muted">{u.email}</td>
                <td className="py-4 text-sm text-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="py-4 text-center font-bold">{u.trip_count}</td>
                <td className="py-4 text-right">
                  <button className="text-muted hover:text-accent font-bold text-xs uppercase">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AdminStatCard = ({ icon: Icon, label, value }) => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
      <div className="p-4 bg-bg rounded-2xl">
        <Icon className="h-6 w-6 text-muted" />
      </div>
      <div>
        <p className="text-muted text-xs uppercase font-bold tracking-widest">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

export default AdminPage;
