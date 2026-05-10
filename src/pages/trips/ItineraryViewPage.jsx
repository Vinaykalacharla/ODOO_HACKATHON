import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, LayoutList, Calendar, MapPin, Clock, Wallet } from 'lucide-react';

const ItineraryViewPage = () => {
  const { tripId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isListView, setIsListView] = useState(true);
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, stopsRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/stops/${tripId}/stops`)
        ]);
        
        // Fetch activities for all stops
        const stopIds = stopsRes.data.data.map(s => s.id);
        let activities = [];
        if (stopIds.length > 0) {
          // This is a bit inefficient, in a real app we'd have a bulk endpoint
          // But for now we'll mock the data structure or fetch per stop
          const activitiesRes = await Promise.all(
            stopIds.map(id => api.get(`/activities/cities/${stopsRes.data.data.find(s => s.id === id).city_id}/activities`))
          );
          activities = activitiesRes.flatMap((res, i) => res.data.data.map(a => ({ ...a, trip_stop_id: stopIds[i] })));
        }

        setData({
          trip: tripRes.data.data,
          stops: stopsRes.data.data,
          activities: activities
        });
      } catch (err) {
        addToast('Failed to load itinerary', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  if (loading) return <div className="max-w-5xl mx-auto py-20 text-center font-serif text-2xl">Loading your journey...</div>;

  const { trip, stops, activities } = data;

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/trips/${tripId}`)} className="p-2 hover:bg-surface rounded-full transition-colors">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl">{trip.title}</h1>
            <p className="text-muted">Day-by-day plan for your adventure.</p>
          </div>
        </div>
        <div className="flex bg-surface p-1 rounded-xl border border-border">
          <button 
            onClick={() => setIsListView(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${isListView ? 'bg-accent text-white' : 'text-muted hover:text-text'}`}
          >
            <LayoutList className="h-4 w-4" /> List
          </button>
          <button 
            onClick={() => setIsListView(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${!isListView ? 'bg-accent text-white' : 'text-muted hover:text-text'}`}
          >
            <Calendar className="h-4 w-4" /> Timeline
          </button>
        </div>
      </header>

      {isListView ? (
        <div className="space-y-8">
          {stops.map((stop, index) => (
            <div key={stop.id} className="relative pl-8 border-l-2 border-border/50 pb-8 last:pb-0">
              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-accent border-2 border-bg" />
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-serif">{stop.city_name}</h2>
                  <span className="text-muted text-sm font-bold">Stop #{index + 1}</span>
                </div>
                <p className="text-muted text-sm font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  {new Date(stop.arrival_date).toLocaleDateString()} — {new Date(stop.departure_date).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.filter(a => a.trip_stop_id === stop.id).length > 0 ? (
                  activities.filter(a => a.trip_stop_id === stop.id).map(act => (
                    <Card key={act.id} className="p-5 flex flex-col group">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="gray">{act.category}</Badge>
                        <div className="flex items-center gap-1 text-xs font-bold text-muted">
                          <Clock className="h-3.5 w-3.5" />
                          {act.scheduled_time?.slice(0, 5) || 'Anytime'}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold mb-4 group-hover:text-accent transition-colors">{act.name}</h4>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-1 text-sm font-bold text-teal">
                          <Wallet className="h-4 w-4" />
                          ${act.estimated_cost_usd}
                        </div>
                        <span className="text-xs text-muted font-bold">{act.duration_hours}h duration</span>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted italic col-span-full">No activities planned for this stop.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {stops.map((stop, index) => (
              <div key={stop.id} className="w-80 flex flex-col gap-4">
                <Card className="p-6 bg-accent text-white border-none shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Stop {index + 1}</span>
                    <MapPin className="h-4 w-4 opacity-70" />
                  </div>
                  <h3 className="text-2xl font-serif mb-1">{stop.city_name}</h3>
                  <p className="text-xs font-bold opacity-80">{new Date(stop.arrival_date).toLocaleDateString()}</p>
                </Card>
                
                <div className="space-y-4">
                  {activities.filter(a => a.trip_stop_id === stop.id).map(act => (
                    <Card key={act.id} className="p-4 border-l-4 border-l-teal">
                      <div className="text-[10px] font-bold text-teal uppercase mb-1">{act.category}</div>
                      <h4 className="font-bold text-sm mb-2">{act.name}</h4>
                      <div className="flex items-center justify-between text-[10px] font-bold text-muted">
                        <span>{act.scheduled_time?.slice(0, 5) || 'Anytime'}</span>
                        <span>${act.estimated_cost_usd}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryViewPage;
