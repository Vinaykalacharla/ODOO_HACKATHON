import { query } from '../../config/db.js';

export const getBudgetEntries = async (tripId) => {
  return await query('SELECT * FROM budget_entries WHERE trip_id = ? ORDER BY entry_date DESC', [tripId]);
};

export const createBudgetEntry = async (tripId, data) => {
  const { category, label, amount, entry_date, is_estimated } = data;
  await query(
    `INSERT INTO budget_entries (trip_id, category, label, amount, entry_date, is_estimated) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [tripId, category, label, amount, entry_date, is_estimated]
  );
  // Fetch by trip_id and label as proxy for recently created
  const results = await query('SELECT * FROM budget_entries WHERE trip_id = ? ORDER BY created_at DESC LIMIT 1', [tripId]);
  return results[0];
};

export const updateBudgetEntry = async (entryId, tripId, data) => {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), entryId, tripId];
  await query(`UPDATE budget_entries SET ${fields} WHERE id = ? AND trip_id = ?`, values);
  const results = await query('SELECT * FROM budget_entries WHERE id = ?', [entryId]);
  return results[0];
};

export const deleteBudgetEntry = async (entryId, tripId) => {
  await query('DELETE FROM budget_entries WHERE id = ? AND trip_id = ?', [entryId, tripId]);
};
