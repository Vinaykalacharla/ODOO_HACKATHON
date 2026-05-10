import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ArrowLeft, Package, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

const PackingPage = () => {
  const { tripId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('clothing');
  const [newItem, setNewItem] = useState('');
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  const categories = [
    { id: 'clothing', label: 'Clothing' },
    { id: 'documents', label: 'Documents' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'toiletries', label: 'Toiletries' },
    { id: 'misc', label: 'Misc' },
  ];

  const fetchData = async () => {
    try {
      const { data } = await api.get(`/packing/${tripId}/packing`);
      setItems(data.data);
    } catch (err) {
      addToast('Failed to load packing items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tripId]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem) return;
    try {
      await api.post(`/packing/${tripId}/packing`, {
        label: newItem,
        category: activeCategory,
        is_packed: 0
      });
      setNewItem('');
      fetchData();
    } catch (err) {
      addToast('Failed to add item', 'error');
    }
  };

  const toggleItem = async (itemId) => {
    try {
      await api.patch(`/packing/${tripId}/packing/${itemId}`);
      fetchData();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/packing/${tripId}/packing/${itemId}`);
      fetchData();
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  const filteredItems = items.filter(item => item.category === activeCategory);
  const packedCount = items.filter(item => item.is_packed).length;
  const progress = items.length > 0 ? (packedCount / items.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate(`/trips/${tripId}`)} className="p-2 hover:bg-surface rounded-full transition-colors">
          <ArrowLeft />
        </button>
        <div className="flex-1">
          <h1 className="text-4xl">Packing Checklist</h1>
          <p className="text-muted">Don't leave the essentials behind.</p>
        </div>
      </header>

      {/* Progress Section */}
      <Card className="p-8 mb-12 bg-teal/5 border-teal/10">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold text-teal">Overall Progress</h3>
          <span className="text-2xl font-bold text-teal">{packedCount} / {items.length} packed</span>
        </div>
        <div className="h-4 w-full bg-teal/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Category Tabs */}
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all border
                ${activeCategory === cat.id 
                  ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                  : 'bg-white text-muted border-border hover:border-muted'}`}
            >
              {cat.label}
              <span className="text-xs opacity-60">
                {items.filter(i => i.category === cat.id && i.is_packed).length} / {items.filter(i => i.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="md:col-span-3">
          <Card className="p-8">
            <h2 className="text-2xl mb-8 capitalize">{activeCategory} Items</h2>
            
            <div className="space-y-4 mb-8">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className={`transition-colors ${item.is_packed ? 'text-teal' : 'text-muted/40 hover:text-accent'}`}
                    >
                      {item.is_packed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                    </button>
                    <span className={`flex-1 font-medium transition-all ${item.is_packed ? 'text-muted line-through' : 'text-text'}`}>
                      {item.label}
                    </span>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted">No items in this category yet.</p>
                </div>
              )}
            </div>

            <form onSubmit={handleAddItem} className="flex gap-2">
              <input 
                type="text"
                placeholder={`Add new ${activeCategory} item...`}
                className="flex-1 px-4 py-3 rounded-xl border border-border outline-none bg-bg focus:border-accent"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              />
              <Button type="submit" className="px-6">
                <Plus className="h-5 w-5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PackingPage;
