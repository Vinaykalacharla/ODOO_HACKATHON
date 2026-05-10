import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Plus, Search, Calendar, MapPin, MoreVertical, Edit2, Eye, Trash2, Plane } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/trips');
      setTrips(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      addToast('Trip deleted', 'success');
      fetchTrips();
    } catch (err) {
      addToast('Failed to delete trip', 'error');
    }
  };

  const filteredTrips = filterStatus === 'all' 
    ? trips 
    : trips.filter(t => t.status === filterStatus);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl mb-2">My Trips</h1>
          <p className="text-muted text-lg">Your personal library of adventures past and future.</p>
        </div>
        <Link to="/trips/new">
          <Button className="py-3 px-6 text-lg">
            <Plus className="h-5 w-5" /> Plan New Trip
          </Button>
        </Link>
      </header>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'draft', 'planned', 'ongoing', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-6 py-2 rounded-xl font-bold transition-all border whitespace-nowrap
              ${filterStatus === status 
                ? 'bg-text text-white border-text' 
                : 'bg-white text-muted border-border hover:border-muted'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} variant="card" className="h-80" />)}
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <TripListItem key={trip.id} trip={trip} onDelete={() => handleDelete(trip.id)} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No trips found" 
          description={filterStatus === 'all' ? "You haven't created any trips yet." : `No trips with status "${filterStatus}" found.`}
          actionLabel={filterStatus === 'all' ? "Create Your First Trip" : null}
          onAction={() => navigate('/trips/new')}
        />
      )}
    </div>
  );
};

const TripListItem = ({ trip, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Card className="flex flex-col h-full group overflow-visible relative">
      <div className="h-48 relative overflow-hidden rounded-t-2xl">
        {trip.cover_image_url ? (
          <img src={trip.cover_image_url} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-accent/5 flex items-center justify-center">
            <Plane className="h-12 w-12 text-accent/20" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge>{trip.status}</Badge>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl mb-4 line-clamp-1">{trip.title}</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-muted">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
          </div>
          <div className="flex items-center gap-3 text-muted">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Multiple destinations</span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <Link to={`/trips/${trip.id}`} className="flex-1">
            <Button variant="secondary" className="w-full gap-2 py-2">
              <Eye className="h-4 w-4" /> View
            </Button>
          </Link>
          <Link to={`/trips/${trip.id}/edit`}>
            <Button variant="secondary" className="px-3 py-2">
              <Edit2 className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" onClick={onDelete} className="px-3 py-2 text-danger hover:bg-danger/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MyTripsPage;
