import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { ArrowLeft, GripVertical, Plus, Calendar, MapPin, Trash2, Search, X, Check } from 'lucide-react';

const ItineraryBuilderPage = () => {
  const { tripId } = useParams();
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState([]);
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchStops = async () => {
    try {
      const { data } = await api.get(`/stops/${tripId}/stops`);
      setStops(data.data);
    } catch (err) {
      addToast('Failed to load stops', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
  }, [tripId]);

  const handleSearchCities = async (val) => {
    setSearch(val);
    if (val.length < 2) return;
    try {
      const { data } = await api.get(`/cities?search=${val}`);
      setCities(data.data);
    } catch (err) {}
  };

  const addStop = async (city) => {
    try {
      const lastStop = stops[stops.length - 1];
      const arrival = lastStop ? lastStop.departure_date : new Date().toISOString();
      const departure = new Date(new Date(arrival).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
      
      await api.post(`/stops/${tripId}/stops`, {
        city_id: city.id,
        arrival_date: arrival.split('T')[0],
        departure_date: departure.split('T')[0],
        stop_order: stops.length + 1
      });
      
      addToast(`${city.name} added to your trip!`, 'success');
      setIsAddModalOpen(false);
      fetchStops();
    } catch (err) {
      addToast('Failed to add stop', 'error');
    }
  };

  const deleteStop = async (stopId) => {
    if (!window.confirm('Remove this stop and all its activities?')) return;
    try {
      await api.delete(`/stops/${tripId}/stops/${stopId}`);
      addToast('Stop removed', 'success');
      fetchStops();
    } catch (err) {
      addToast('Failed to delete stop', 'error');
    }
  };

  // Activity Modal Logic
  const openActivityModal = async (stop) => {
    setSelectedStop(stop);
    setIsActivityModalOpen(true);
    try {
      const { data } = await api.get(`/activities/cities/${stop.city_id}/activities`);
      setActivities(data.data);
    } catch (err) {}
  };

  const toggleActivity = async (activity) => {
    try {
      await api.post(`/activities/stops/${selectedStop.id}/activities`, {
        activity_id: activity.id,
        scheduled_date: selectedStop.arrival_date.split('T')[0]
      });
      addToast('Activity added!', 'success');
    } catch (err) {
      addToast('Failed to add activity', 'error');
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('draggedIndex', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetIndex) => {
    const draggedIndex = e.dataTransfer.getData('draggedIndex');
    if (draggedIndex === targetIndex.toString()) return;

    const newStops = [...stops];
    const [draggedItem] = newStops.splice(draggedIndex, 1);
    newStops.splice(targetIndex, 0, draggedItem);

    // Update orders locally first
    const updatedStops = newStops.map((s, i) => ({ ...s, stop_order: i + 1 }));
    setStops(updatedStops);

    try {
      await api.patch(`/stops/${tripId}/stops/reorder`, updatedStops.map(s => ({
        id: s.id,
        stop_order: s.stop_order
      })));
      addToast('Stops reordered!', 'success');
    } catch (err) {
      addToast('Failed to save order', 'error');
      fetchStops(); // Rollback
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/trips/${tripId}`)} className="p-2 hover:bg-surface rounded-full transition-colors">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl">Itinerary Builder</h1>
            <p className="text-muted">Drag stops to reorder your journey.</p>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-5 w-5" /> Add Stop
        </Button>
      </header>

      {/* Stops List */}
      <div className="space-y-4" onDragOver={handleDragOver}>
        {stops.length > 0 ? (
          stops.map((stop, index) => (
            <div 
              key={stop.id} 
              draggable 
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <StopCard 
                stop={stop} 
                index={index} 
                onDelete={() => deleteStop(stop.id)}
                onActivities={() => openActivityModal(stop)}
              />
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center bg-surface rounded-3xl border border-dashed border-border text-center p-8">
            <div className="bg-bg p-6 rounded-full mb-6">
              <MapPin className="h-12 w-12 text-muted/30" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No stops added yet</h3>
            <p className="text-muted mb-8">Start by adding your first city destination.</p>
            <Button onClick={() => setIsAddModalOpen(true)}>Add Your First Stop</Button>
          </div>
        )}
      </div>

      {/* Add Stop Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add City Stop"
      >
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input 
              type="text"
              placeholder="Search cities (e.g. Paris, Tokyo...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none bg-bg"
              value={search}
              onChange={(e) => handleSearchCities(e.target.value)}
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
            {cities.map(city => (
              <button
                key={city.id}
                onClick={() => addStop(city)}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-bg transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div className="text-left">
                    <p className="font-bold">{city.name}</p>
                    <p className="text-xs text-muted">{city.country}</p>
                  </div>
                </div>
                <Plus className="h-5 w-5 text-muted" />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Activities Modal */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title={`Activities in ${selectedStop?.city_name}`}
        className="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map(act => (
            <button
              key={act.id}
              onClick={() => toggleActivity(act)}
              className="flex flex-col p-4 rounded-2xl border border-border hover:border-teal hover:bg-teal/5 transition-all text-left group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{act.category}</span>
                <span className="text-sm font-bold text-teal">${act.estimated_cost_usd}</span>
              </div>
              <h4 className="font-bold mb-2 group-hover:text-teal">{act.name}</h4>
              <p className="text-xs text-muted line-clamp-2">{act.description}</p>
              <div className="mt-4 flex items-center justify-end text-teal opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

const StopCard = ({ stop, index, onDelete, onActivities }) => (
  <Card className="flex items-center gap-6 p-6 group">
    <div className="text-muted cursor-grab active:cursor-grabbing">
      <GripVertical className="h-6 w-6" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-1">
        <span className="h-6 w-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">{index + 1}</span>
        <h3 className="text-2xl font-serif">{stop.city_name}</h3>
        <span className="text-muted text-sm">{stop.city_country}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted font-bold">
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Button variant="secondary" onClick={onActivities} className="gap-2">
        Activities
      </Button>
      <button onClick={onDelete} className="p-3 text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all">
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  </Card>
);

export default ItineraryBuilderPage;
