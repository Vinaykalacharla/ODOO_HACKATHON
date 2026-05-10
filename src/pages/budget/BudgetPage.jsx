import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Wallet, Plus, Trash2, AlertTriangle, TrendingUp } from 'lucide-react';

const BudgetPage = () => {
  const { tripId } = useParams();
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ category: 'transport', label: '', amount: '', entry_date: new Date().toISOString().split('T')[0] });
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [entriesRes, summaryRes] = await Promise.all([
        api.get(`/budget/${tripId}/budget`),
        api.get(`/trips/${tripId}/cost-summary`)
      ]);
      setEntries(entriesRes.data.data);
      setSummary(summaryRes.data.data);
    } catch (err) {
      addToast('Failed to load budget data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tripId]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/budget/${tripId}/budget`, formData);
      addToast('Entry added!', 'success');
      setFormData({ category: 'transport', label: '', amount: '', entry_date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      addToast('Failed to add entry', 'error');
    }
  };

  const handleDelete = async (entryId) => {
    try {
      await api.delete(`/budget/${tripId}/budget/${entryId}`);
      addToast('Entry removed', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  const chartData = [
    { name: 'Transport', value: entries.filter(e => e.category === 'transport').reduce((a, b) => a + parseFloat(b.amount), 0) },
    { name: 'Stay', value: entries.filter(e => e.category === 'accommodation').reduce((a, b) => a + parseFloat(b.amount), 0) },
    { name: 'Food', value: entries.filter(e => e.category === 'food').reduce((a, b) => a + parseFloat(b.amount), 0) },
    { name: 'Activity', value: entries.filter(e => e.category === 'activities').reduce((a, b) => a + parseFloat(b.amount), 0) },
    { name: 'Misc', value: entries.filter(e => e.category === 'misc').reduce((a, b) => a + parseFloat(b.amount), 0) },
  ].filter(d => d.value > 0);

  const COLORS = ['#2A9D8F', '#F4A261', '#E8A020', '#E63946', '#6B6560'];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate(`/trips/${tripId}`)} className="p-2 hover:bg-surface rounded-full transition-colors">
          <ArrowLeft />
        </button>
        <div>
          <h1 className="text-4xl">Budget & Costs</h1>
          <p className="text-muted">Track your spending and stay on budget.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Table & Form */}
        <div className="lg:col-span-2 space-y-8">
          {summary?.budget_status === 'over' && (
            <div className="bg-danger/10 border border-danger/20 p-4 rounded-2xl flex items-center gap-3 text-danger font-bold">
              <AlertTriangle className="h-5 w-5" />
              Warning: You are over your total budget of ${summary?.total_budget}!
            </div>
          )}

          <Card className="p-8">
            <h2 className="text-2xl mb-6">Expense Entries</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-widest text-muted">
                    <th className="pb-4 font-bold">Category</th>
                    <th className="pb-4 font-bold">Label</th>
                    <th className="pb-4 font-bold">Date</th>
                    <th className="pb-4 font-bold text-right">Amount</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {entries.map(entry => (
                    <tr key={entry.id} className="group">
                      <td className="py-4"><Badge variant={entry.category === 'transport' ? 'blue' : 'amber'}>{entry.category}</Badge></td>
                      <td className="py-4 font-bold">{entry.label}</td>
                      <td className="py-4 text-sm text-muted">{new Date(entry.entry_date).toLocaleDateString()}</td>
                      <td className="py-4 font-bold text-right text-text">${parseFloat(entry.amount).toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleDelete(entry.id)} className="p-2 text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <form onSubmit={handleAddEntry} className="mt-8 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-4 gap-4">
              <select 
                className="px-4 py-2.5 rounded-xl border border-border outline-none bg-bg text-sm font-bold"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="transport">Transport</option>
                <option value="accommodation">Accommodation</option>
                <option value="food">Food</option>
                <option value="activities">Activities</option>
                <option value="misc">Misc</option>
              </select>
              <input 
                placeholder="Label"
                className="px-4 py-2.5 rounded-xl border border-border outline-none bg-bg text-sm"
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                required
              />
              <input 
                type="number"
                placeholder="Amount"
                className="px-4 py-2.5 rounded-xl border border-border outline-none bg-bg text-sm"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
              <Button type="submit" className="py-2.5">
                Add Entry
              </Button>
            </form>
          </Card>
        </div>

        {/* Right: Charts & Summary */}
        <div className="space-y-8">
          <Card className="p-8 bg-text text-white">
            <h3 className="text-white/60 text-xs uppercase tracking-widest font-bold mb-4">Total Spent</h3>
            <p className="text-5xl font-bold mb-2">${summary?.total_estimated_cost?.toLocaleString()}</p>
            <div className="flex items-center gap-2 text-teal font-bold text-sm">
              <TrendingUp className="h-4 w-4" /> {summary?.budget_used_pct}% of budget used
            </div>
          </Card>

          <Card className="p-8 h-80">
            <h3 className="text-xl mb-6">Spending Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#FAF7F2' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
