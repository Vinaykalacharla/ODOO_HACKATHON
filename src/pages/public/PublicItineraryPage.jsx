import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Plane, Calendar, MapPin, Clock, Globe } from 'lucide-react';

const PublicItineraryPage = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await api.get(`/public/${token}`);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl">Loading Itinerary...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-xl">Itinerary not found or link has expired.</div>;

  const { trip, stops, activities, summary } = data;

  return (
    <div className="min-h-screen bg-bg">
      {/* Public Header */}
      <nav className="bg-surface border-b border-border p-6 mb-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plane className="h-8 w-8 text-accent rotate-45" />
            <h1 className="text-2xl font-serif">Traveloop</h1>
          </div>
          <p className="text-sm text-muted font-bold">Shared by {trip.user_name}</p>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        <header className="mb-12">
          <Badge className="mb-4">Public Itinerary</Badge>
          <h1 className="text-6xl mb-6 font-serif">{trip.title}</h1>
          <div className="flex flex-wrap gap-8">
            <InfoItem icon={Calendar} label="Dates" value={`${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`} />
            <InfoItem icon={Globe} label="Destinations" value={`${stops.length} Cities`} />
            <InfoItem icon={Clock} label="Duration" value={`${summary.trip_duration_days} Days`} />
          </div>
        </header>

        {/* Stops & Activities Timeline */}
        <div className="space-y-12">
          {stops.map((stop, index) => (
            <section key={stop.id} className="relative pl-12 border-l-2 border-border/50 pb-8 last:pb-0">
              <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-accent border-4 border-bg shadow-lg shadow-accent/20" />
              
              <div className="mb-8">
                <h2 className="text-3xl mb-1">{stop.city_name}</h2>
                <p className="text-muted font-bold text-sm">
                  {new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.filter(a => a.trip_stop_id === stop.id).map(act => (
                  <Card key={act.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="gray">{act.category}</Badge>
                      <span className="text-sm text-muted font-bold">{act.scheduled_time?.slice(0, 5) || 'Anytime'}</span>
                    </div>
                    <h4 className="text-lg font-bold mb-2">{act.activity_name}</h4>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-accent/10 rounded-lg">
      <Icon className="h-5 w-5 text-accent" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted font-bold">{label}</p>
      <p className="font-bold text-text">{value}</p>
    </div>
  </div>
);

export default PublicItineraryPage;
