import { query } from '../../config/db.js';

export const getNotes = async (tripId) => {
  return await query('SELECT * FROM trip_notes WHERE trip_id = ? ORDER BY created_at DESC', [tripId]);
};

export const createNote = async (tripId, data) => {
  const { stop_id, content } = data;
  await query(
    'INSERT INTO trip_notes (trip_id, stop_id, content) VALUES (?, ?, ?)',
    [tripId, stop_id, content]
  );
  const result = await query('SELECT * FROM trip_notes WHERE trip_id = ? ORDER BY created_at DESC LIMIT 1', [tripId]);
  return result[0];
};

export const updateNote = async (noteId, tripId, data) => {
  const { stop_id, content } = data;
  await query(
    'UPDATE trip_notes SET stop_id = ?, content = ? WHERE id = ? AND trip_id = ?',
    [stop_id, content, noteId, tripId]
  );
  const result = await query('SELECT * FROM trip_notes WHERE id = ?', [noteId]);
  return result[0];
};

export const deleteNote = async (noteId, tripId) => {
  await query('DELETE FROM trip_notes WHERE id = ? AND trip_id = ?', [noteId, tripId]);
};
