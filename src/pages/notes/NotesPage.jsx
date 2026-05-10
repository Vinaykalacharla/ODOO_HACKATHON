import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ArrowLeft, Plus, Trash2, Save, FileText, Calendar } from 'lucide-react';

const NotesPage = () => {
  const { tripId } = useParams();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [stops, setStops] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState(null);
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [notesRes, stopsRes] = await Promise.all([
        api.get(`/notes/${tripId}/notes`),
        api.get(`/stops/${tripId}/stops`)
      ]);
      setNotes(notesRes.data.data);
      setStops(stopsRes.data.data);
      if (notesRes.data.data.length > 0 && !selectedNote) {
        setSelectedNote(notesRes.data.data[0]);
        setContent(notesRes.data.data[0].content);
        setSelectedStopId(notesRes.data.data[0].stop_id);
      }
    } catch (err) {
      addToast('Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tripId]);

  const handleCreateNote = async () => {
    try {
      const { data } = await api.post(`/notes/${tripId}/notes`, {
        content: 'New adventure note...',
        stop_id: null
      });
      addToast('New note created', 'success');
      await fetchData();
      setSelectedNote(data.data);
      setContent(data.data.content);
      setSelectedStopId(null);
    } catch (err) {
      addToast('Failed to create note', 'error');
    }
  };

  const handleSave = async () => {
    if (!selectedNote) return;
    try {
      await api.put(`/notes/${tripId}/notes/${selectedNote.id}`, {
        content,
        stop_id: selectedStopId
      });
      addToast('Note saved!', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to save', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedNote || !window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${tripId}/notes/${selectedNote.id}`);
      addToast('Note removed', 'success');
      setSelectedNote(null);
      setContent('');
      fetchData();
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-200px)]">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(`/trips/${tripId}`)} className="p-2 hover:bg-surface rounded-full transition-colors">
          <ArrowLeft />
        </button>
        <div className="flex-1">
          <h1 className="text-4xl">Trip Notes</h1>
          <p className="text-muted">Jot down your memories and plans.</p>
        </div>
        <Button onClick={handleCreateNote}>
          <Plus className="h-5 w-5" /> New Note
        </Button>
      </header>

      <div className="flex gap-8 h-full">
        {/* Left Sidebar: Notes List */}
        <Card className="w-80 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-bg/50">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted">Recent Notes</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notes.map(note => (
              <button
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setContent(note.content);
                  setSelectedStopId(note.stop_id);
                }}
                className={`w-full text-left p-6 border-b border-border transition-all hover:bg-bg
                  ${selectedNote?.id === note.id ? 'bg-accent/5 border-l-4 border-l-accent' : ''}`}
              >
                <p className="font-bold text-text truncate mb-1">{note.content.split('\n')[0]}</p>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Calendar className="h-3 w-3" />
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Right Panel: Note Editor */}
        <Card className="flex-1 flex flex-col p-8">
          {selectedNote ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted">Link to Stop:</label>
                  <select 
                    className="bg-bg border border-border px-3 py-1.5 rounded-lg text-sm font-bold outline-none focus:border-accent"
                    value={selectedStopId || ''}
                    onChange={(e) => setSelectedStopId(e.target.value || null)}
                  >
                    <option value="">No specific stop</option>
                    {stops.map(stop => (
                      <option key={stop.id} value={stop.id}>{stop.city_name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleDelete}
                    className="p-2.5 text-muted hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" /> Save
                  </Button>
                </div>
              </div>

              <textarea 
                className="flex-1 w-full bg-transparent resize-none outline-none text-lg leading-relaxed placeholder:text-muted/30"
                placeholder="Start writing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <FileText className="h-20 w-20 mb-4" />
              <p className="text-xl">Select a note or create a new one to begin.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default NotesPage;
