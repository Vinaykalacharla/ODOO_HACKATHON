import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { 
  ArrowLeft, 
  Map as MapIcon, 
  List, 
  Wallet, 
  Package, 
  FileText, 
  Share2, 
  Settings,
  Calendar,
  ChevronRight,
  TrendingUp,
  Heart
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const TripDetailPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [tripRes, summaryRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/trips/${tripId}/cost-summary`)
        ]);
        setTrip(tripRes.data.data);
        setSummary(summaryRes.data.data);
      } catch (err) {
        addToast('Failed to load trip details', 'error');
        navigate('/trips');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [tripId]);

  if (loading) return <div className="max-w-6xl mx-auto"><Skeleton variant="card" className="h-[600px]" /></div>;

  const navCards = [
    { label: 'Itinerary Builder', icon: MapIcon, color: 'text-accent bg-accent/10', path: `/trips/${tripId}/builder`, desc: 'Plan stops and activities' },
    { label: 'Itinerary View', icon: List, color: 'text-blue-500 bg-blue-500/10', path: `/trips/${tripId}/view`, desc: 'Check your daily schedule' },
    { label: 'Budget & Costs', icon: Wallet, color: 'text-teal bg-teal/10', path: `/trips/${tripId}/budget`, desc: 'Manage your trip expenses' },
    { label: 'Packing List', icon: Package, color: 'text-purple-500 bg-purple-500/10', path: `/trips/${tripId}/packing`, desc: 'Gear up for the journey' },
    { label: 'Trip Notes', icon: FileText, color: 'text-orange-500 bg-orange-500/10', path: `/trips/${tripId}/notes`, desc: 'Capture thoughts and ideas' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <button onClick={() => navigate('/trips')} className="flex items-center gap-2 text-muted hover:text-text font-bold mb-8 transition-colors">
        <ArrowLeft className="h-5 w-5" /> All Trips
      </button>

      {/* Header Section */}
      <section className="mb-12 relative rounded-3xl overflow-hidden h-80">
        <div className="absolute inset-0 bg-gradient-to-t from-text to-transparent z-10 opacity-80" />
        {trip.cover_image_url ? (
          <img src={trip.cover_image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-accent/20" />
        )}
        <div className="absolute bottom-10 left-10 right-10 z-20 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge>{trip.status}</Badge>
              {trip.is_public === 1 && <Badge variant="blue"><Share2 className="h-3 w-3 inline mr-1" /> Public</Badge>}
            </div>
            <h1 className="text-5xl mb-2">{trip.title}</h1>
            <div className="flex items-center gap-4 text-white/80 font-bold">
              <span className="flex items-center gap-1"><Calendar className="h-5 w-5" /> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{summary?.trip_duration_days} days</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/trips/${tripId}/edit`}>
              <Button variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-md">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            {trip.is_public === 1 && (
              <Button onClick={() => {
                navigator.clipboard.writeText(`http://localhost:5173/share/${trip.share_token}`);
                addToast('Share link copied!', 'info');
              }} variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-md">
                <Share2 className="h-5 w-5" /> Share
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Gauges Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <HealthScoreGauge score={85} /> {/* Placeholder for health score logic */}
        <BudgetPulseBar summary={summary} />
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navCards.map((card, i) => (
          <Link key={i} to={card.path}>
            <Card className="p-6 h-full flex flex-col hover:border-accent transition-all group">
              <div className={`p-4 rounded-2xl w-fit mb-6 ${card.color}`}>
                <card.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl mb-2 group-hover:text-accent transition-colors">{card.label}</h3>
              <p className="text-muted text-sm flex-1">{card.desc}</p>
              <div className="mt-6 flex items-center text-accent font-bold text-sm">
                Open <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

const HealthScoreGauge = ({ score }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s > 70) return 'text-teal';
    if (s > 40) return 'text-accent';
    return 'text-danger';
  };

  return (
    <Card className="p-8 flex items-center justify-between">
      <div className="relative flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle cx="80" cy="80" r={radius} className="text-border fill-none stroke-current" strokeWidth="12" />
          <circle cx="80" cy="80" r={radius} className={`${getColor(score)} fill-none stroke-current transition-all duration-1000 ease-out`} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold">{score}</span>
          <span className="text-xs text-muted font-bold uppercase tracking-widest">Score</span>
        </div>
      </div>
      <div className="flex-1 ml-10">
        <h3 className="text-2xl mb-2">Trip Health</h3>
        <p className="text-muted leading-relaxed">Your trip planning is looking great! You have a solid mix of stops and activities.</p>
        <div className="mt-4 flex items-center gap-2 text-teal font-bold">
          <TrendingUp className="h-4 w-4" /> Improving
        </div>
      </div>
    </Card>
  );
};

const BudgetPulseBar = ({ summary }) => {
  const pct = Math.min(summary?.budget_used_pct || 0, 100);
  
  const getColor = (s) => {
    if (s === 'healthy') return 'bg-teal shadow-teal/20';
    if (s === 'warning') return 'bg-accent shadow-accent/20';
    return 'bg-danger shadow-danger/20';
  };

  const textColor = (s) => {
    if (s === 'healthy') return 'text-teal';
    if (s === 'warning') return 'text-accent';
    return 'text-danger';
  };

  return (
    <Card className="p-8 flex flex-col justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-2xl mb-1">Budget Pulse</h3>
          <p className="text-muted">Real-time spending vs. plan</p>
        </div>
        <div className={`text-3xl font-bold ${textColor(summary?.budget_status)}`}>{summary?.budget_used_pct}%</div>
      </div>
      
      <div className="h-6 w-full bg-border/30 rounded-full overflow-hidden mb-6 relative">
        <div 
          className={`h-full ${getColor(summary?.budget_status)} shadow-lg transition-all duration-1000 ease-out`} 
          style={{ width: `${pct}%` }} 
        />
      </div>

      <div className="flex justify-between text-sm font-bold">
        <div className="flex flex-col">
          <span className="text-muted uppercase text-[10px] tracking-wider mb-1">Total Budget</span>
          <span className="text-lg">${summary?.total_budget?.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-muted uppercase text-[10px] tracking-wider mb-1">Total Estimated</span>
          <span className={`text-lg ${textColor(summary?.budget_status)}`}>${summary?.total_estimated_cost?.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default TripDetailPage;
