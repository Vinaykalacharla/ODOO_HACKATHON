import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/axios';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Plane, Calendar, Wallet, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const CreateTripPage = () => {
  const { tripId } = useParams();
  const isEdit = !!tripId;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    total_budget: 0,
    cover_image_url: '',
    status: 'draft',
    is_public: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchTrip = async () => {
        try {
          const { data } = await api.get(`/trips/${tripId}`);
          const trip = data.data;
          // Format dates for input[type="date"]
          setFormData({
            ...trip,
            start_date: trip.start_date.split('T')[0],
            end_date: trip.end_date.split('T')[0],
          });
        } catch (err) {
          addToast('Failed to load trip data', 'error');
          navigate('/trips');
        }
      };
      fetchTrip();
    }
  }, [tripId, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/trips/${tripId}`, formData);
        addToast('Trip updated successfully!', 'success');
      } else {
        const { data } = await api.post('/trips', formData);
        addToast('New adventure created!', 'success');
        navigate(`/trips/${data.data.id}`);
        return;
      }
      navigate(`/trips/${tripId}`);
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to save trip', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted hover:text-text font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" /> Back
      </button>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-accent rounded-2xl text-white">
            <Plane className="h-8 w-8" />
          </div>
          <h1 className="text-4xl">{isEdit ? 'Edit Your Trip' : 'Plan a New Trip'}</h1>
        </div>
        <p className="text-muted text-lg">Define the details of your next grand journey.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="p-8 space-y-8">
          <Input 
            label="Trip Title"
            name="title"
            placeholder="e.g. Europe Summer 2025"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-muted ml-1">Description</label>
            <textarea 
              name="description"
              rows={4}
              className="px-4 py-2.5 rounded-xl border border-border focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none bg-surface text-text resize-none"
              placeholder="What's this trip about?"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
            <Input 
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Total Budget ($)"
              name="total_budget"
              type="number"
              min="0"
              value={formData.total_budget}
              onChange={handleChange}
              placeholder="0.00"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-muted ml-1">Status</label>
              <select 
                name="status"
                className="px-4 py-2.5 rounded-xl border border-border focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none bg-surface text-text"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <Input 
            label="Cover Image URL (Optional)"
            name="cover_image_url"
            placeholder="https://..."
            value={formData.cover_image_url}
            onChange={handleChange}
            helper="Paste a link to a nice background image"
          />

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <input 
              type="checkbox"
              id="is_public"
              checked={formData.is_public === 1}
              onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked ? 1 : 0 }))}
              className="h-5 w-5 rounded border-border text-accent focus:ring-accent"
            />
            <label htmlFor="is_public" className="text-sm font-bold text-text">Make this trip public (Shareable via link)</label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" loading={loading} className="flex-1 py-4 text-lg">
              {isEdit ? 'Save Changes' : 'Create Trip'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="px-8">
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreateTripPage;
