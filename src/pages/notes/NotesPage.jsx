import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import TripSubnav from '../../components/travel/TripSubnav';
import TripAccessDenied from '../../components/travel/TripAccessDenied';
import { useTripBundle } from '../../hooks/useTripBundle';
import { useAuthStore } from '../../store/authStore';
import { useTravelStore } from '../../store/travelStore';
import { useToastStore } from '../../store/toastStore';
import { formatDate } from '../../lib/format';
import { validateNote } from '../../lib/validators';

export default function NotesPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const bundle = useTripBundle(tripId);
  const currentUser = useAuthStore((store) => store.users.find((user) => user.id === store.currentUserId));
  const addNote = useTravelStore((store) => store.addNote);
  const updateNote = useTravelStore((store) => store.updateNote);
  const deleteNote = useTravelStore((store) => store.deleteNote);
  const pushToast = useToastStore((store) => store.pushToast);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [draft, setDraft] = useState('');
  const [stopId, setStopId] = useState('');
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (bundle?.notes?.length && !selectedNoteId) {
      setSelectedNoteId(bundle.notes[0].id);
    }
  }, [bundle, selectedNoteId]);

  useEffect(() => {
    const note = bundle?.notes.find((entry) => entry.id === selectedNoteId);
    if (note) {
      setDraft(note.content);
      setStopId(note.stopId || '');
      setHasChanges(false);
    } else if (selectedNoteId === 'new') {
      setDraft('');
      setStopId('');
      setHasChanges(false);
    }
  }, [bundle, selectedNoteId]);

  const selectedNote = useMemo(() => bundle?.notes.find((entry) => entry.id === selectedNoteId) || null, [bundle, selectedNoteId]);

  if (!bundle) {
    return (
      <EmptyState
        icon={PlusCircle}
        title="Trip not found"
        description="Open a valid trip to manage notes."
        actionLabel="Back to trips"
        onAction={() => navigate('/trips')}
      />
    );
  }

  if (bundle.trip.userId !== currentUser?.id && !currentUser?.isAdmin) {
    return <TripAccessDenied actionLabel="Back to trips" onAction={() => navigate('/trips')} />;
  }

  const saveNote = async () => {
    const nextErrors = validateNote({ content: draft });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (selectedNote) {
      await updateNote(selectedNote.id, { content: draft, stopId: stopId || null });
      pushToast({ title: 'Note updated', description: 'Your note was saved.', variant: 'success' });
    } else {
      const created = await addNote(tripId, { content: draft, stopId: stopId || null });
      setSelectedNoteId(created.id);
      pushToast({ title: 'Note added', description: 'New note created.', variant: 'success' });
    }
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <TripSubnav basePath={`/trips/${tripId}`} />

      <section className="overflow-hidden rounded-[2rem] border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(15,118,110,0.08))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1d4ed8]">Trip Notes</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-text">{bundle.trip.title}</h1>
            <p className="mt-1 text-sm text-muted">Write down reminders, ideas, and stop-specific notes.</p>
          </div>
          <Button variant="secondary" onClick={() => setSelectedNoteId('new')}>
            <PlusCircle className="h-4 w-4" />
            New Note
          </Button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.36fr_0.64fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-2xl text-text">Notes</h2>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {bundle.notes.length > 0 ? (
              bundle.notes.map((note) => {
                const preview = note.content.split('\n')[0];
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`block w-full border-b border-border px-5 py-4 text-left transition ${
                      selectedNoteId === note.id ? 'bg-bg' : 'hover:bg-bg/60'
                    }`}
                  >
                    <p className="text-sm font-medium text-text line-clamp-2">{preview}</p>
                    <p className="mt-2 text-xs text-muted">{formatDate(note.updatedAt)}</p>
                  </button>
                );
              })
            ) : (
              <EmptyState icon={PlusCircle} title="No notes yet" description="Create a note to capture trip ideas." />
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Editor</p>
              <h2 className="mt-2 text-3xl text-text">{selectedNote ? 'Edit note' : 'New note'}</h2>
            </div>
            {selectedNote ? (
              <Button
                variant="ghost"
                className="text-danger"
                onClick={async () => {
                  await deleteNote(selectedNote.id);
                  setSelectedNoteId(bundle.notes[1]?.id || 'new');
                  pushToast({ title: 'Note deleted', description: 'The note was removed.', variant: 'success' });
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Input label="Link to stop" as="select" value={stopId} onChange={(event) => setStopId(event.target.value)}>
              <option value="">General note</option>
              {bundle.stops.map((stop) => {
                return (
                  <option key={stop.id} value={stop.id}>
                    {bundle.groupedStops.find((item) => item.id === stop.id)?.city?.name || 'Stop'} - {stop.arrivalDate}
                  </option>
                );
              })}
            </Input>
            <Card className="bg-bg p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Trip note links</p>
              <p className="mt-2 text-sm text-text">{stopId ? 'This note is linked to a stop.' : 'This note is general to the trip.'}</p>
            </Card>
          </div>

          <Input
            label="Content"
            as="textarea"
            rows={16}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setHasChanges(true);
            }}
            onBlur={() => setErrors(validateNote({ content: draft }))}
            error={errors.content}
            className="min-h-[360px]"
          />

          <div className="mt-5 flex items-center gap-3">
            <Button onClick={saveNote} disabled={!hasChanges && !!selectedNote}>
              Save Note
            </Button>
            {selectedNote ? <span className="text-sm text-muted">Updated {formatDate(selectedNote.updatedAt)}</span> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
