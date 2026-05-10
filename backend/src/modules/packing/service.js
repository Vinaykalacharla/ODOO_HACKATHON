import { query } from '../../config/db.js';

export const getPackingItems = async (tripId) => {
  return await query('SELECT * FROM packing_items WHERE trip_id = ? ORDER BY category, created_at', [tripId]);
};

export const createPackingItem = async (tripId, data) => {
  const { label, category, is_packed } = data;
  await query(
    'INSERT INTO packing_items (trip_id, label, category, is_packed) VALUES (?, ?, ?, ?)',
    [tripId, label, category, is_packed]
  );
  const result = await query('SELECT * FROM packing_items WHERE trip_id = ? ORDER BY created_at DESC LIMIT 1', [tripId]);
  return result[0];
};

export const toggleItemPacked = async (itemId, tripId) => {
  await query('UPDATE packing_items SET is_packed = NOT is_packed WHERE id = ? AND trip_id = ?', [itemId, tripId]);
  const result = await query('SELECT * FROM packing_items WHERE id = ?', [itemId]);
  return result[0];
};

export const deletePackingItem = async (itemId, tripId) => {
  await query('DELETE FROM packing_items WHERE id = ? AND trip_id = ?', [itemId, tripId]);
};
