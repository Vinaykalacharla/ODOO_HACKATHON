import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { Map, Calendar, Wallet, Star, ArrowRight, Plus } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [recentTrips, setRecentTrips] = useState([]);
  const [recommendedCities, setRecommendedCities] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, upcoming: 0, visited: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsRes, citiesRes] = await Promise.all([
          api.get('/trips?limit=3'),
          api.get('/cities?limit=6')
        ]);
        
        setRecentTrips(tripsRes.data.data);
        setRecommendedCities(citiesRes.data.data);
        
        // Mock stats for dashboard feel
        setStats({
          totalTrips: tripsRes.data.meta.total,
          upcoming: tripsRes.data.data.filter(t => t.status === 'planned').length,
          visited: Math.floor(tripsRes.data.meta.total * 1.5)
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-muted text-lg">Where is your heart taking you next?</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard icon={Map} label="Total Trips" value={stats.totalTrips} color="bg-accent/10 text-accent" />
        <StatCard icon={Calendar} label="Upcoming" value={stats.upcoming} color="bg-teal/10 text-teal" />
        <StatCard icon={Wallet} label="Cities Visited" value={stats.visited} color="bg-blue-500/10 text-blue-500" />
      </div>

      {/* Recent Trips */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Recent Trips</h2>
          <Link to="/trips" className="text-accent font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => <Skeleton key={i} variant="card" />)
          ) : recentTrips.length > 0 ? (
            recentTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} formatDate={formatDate} />
            ))
          ) : (
            <div className="col-span-full py-12 bg-surface rounded-3xl border border-dashed border-border flex flex-col items-center">
              <p className="text-muted mb-4">No trips planned yet.</p>
              <Button as={Link} to="/trips/new">
                <Plus className="h-5 w-5" /> Start Planning
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Cities */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl mb-1">Discover Cities</h2>
          <p className="text-muted">Hand-picked destinations for your next escape.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} variant="card" className="h-64" />)
          ) : (
            recommendedCities.map(city => (
              <CityCard key={city.id} city={city} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card className="p-6 flex items-center gap-4">
    <div className={`p-4 rounded-2xl ${color}`}>
      <Icon className="h-8 w-8" />
    </div>
    <div>
      <p className="text-muted font-medium">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </Card>
);

const TripCard = ({ trip, formatDate }) => (
  <Card className="flex flex-col h-full group">
    <div className="h-40 bg-muted/20 relative overflow-hidden">
      {trip.cover_image_url ? (
        <img src={trip.cover_image_url} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-accent/10">
          <Map className="h-12 w-12 text-accent/30" />
        </div>
      )}
      <div className="absolute top-4 right-4">
        <Badge>{trip.status}</Badge>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <h3 className="text-xl mb-2 group-hover:text-accent transition-colors">{trip.title}</h3>
      <p className="text-muted text-sm mb-4 line-clamp-2">{trip.description || 'No description provided.'}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm font-bold text-text">
          <Calendar className="h-4 w-4 text-accent" />
          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
        </div>
        <Link to={`/trips/${trip.id}`} className="p-2 bg-bg rounded-lg hover:bg-accent hover:text-white transition-all">
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  </Card>
);

const CityCard = ({ city }) => (
  <Card className="relative h-64 group cursor-pointer overflow-hidden border-none">
    <div className="absolute inset-0 bg-gradient-to-t from-text/80 to-transparent z-10" />
    <img 
      src={`https://source.unsplash.com/featured/?${city.name},${city.country}`} 
      alt={city.name} 
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
    <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-2xl font-serif">{city.name}</h3>
        <span className="text-accent font-bold">${city.avg_daily_cost_usd}/day</span>
      </div>
      <div className="flex items-center justify-between text-sm opacity-90">
        <p>{city.country}</p>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < city.popularity_score / 2 ? 'fill-accent text-accent' : 'text-white/20'}`} />
          ))}
        </div>
      </div>
    </div>
  </Card>
);

export default DashboardPage;
