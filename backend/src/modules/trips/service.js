import { query } from '../../config/db.js';

export const getTrips = async (userId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const trips = await query(
    'SELECT * FROM trips WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [userId, parseInt(limit), offset]
  );
  
  const [total] = await query(
    'SELECT COUNT(*) as count FROM trips WHERE user_id = ? AND deleted_at IS NULL',
    [userId]
  );
  
  return { trips, total: total.count };
};

export const getTripById = async (id, userId) => {
  const trips = await query(
    'SELECT * FROM trips WHERE id = ? AND user_id = ? AND deleted_at IS NULL',
    [id, userId]
  );
  return trips[0];
};

export const createTrip = async (userId, data) => {
  const { title, description, cover_image_url, start_date, end_date, total_budget, is_public, status } = data;
  const result = await query(
    `INSERT INTO trips (user_id, title, description, cover_image_url, start_date, end_date, total_budget, is_public, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, title, description, cover_image_url, start_date, end_date, total_budget, is_public, status]
  );
  
  // Since we use UUID() in DB, we need to fetch the last inserted ID if we didn't provide one
  // Actually, our schema uses DEFAULT (UUID()) so we should fetch by user and timestamp or just select by title/time
  // Better to generate UUID in code or return the one from DB if possible.
  // For MySQL 8+ with UUID, we can't easily get the ID back without another select.
  const trips = await query(
    'SELECT * FROM trips WHERE user_id = ? AND title = ? ORDER BY created_at DESC LIMIT 1',
    [userId, title]
  );
  return trips[0];
};

export const updateTrip = async (id, userId, data) => {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), id, userId];
  
  await query(
    `UPDATE trips SET ${fields} WHERE id = ? AND user_id = ? AND deleted_at IS NULL`,
    values
  );
  return getTripById(id, userId);
};

export const deleteTrip = async (id, userId) => {
  await query(
    'UPDATE trips SET deleted_at = NOW() WHERE id = ? AND user_id = ?',
    [id, userId]
  );
};

export const getTripCostSummary = async (id, userId) => {
  const summaries = await query(
    'SELECT * FROM trip_cost_summary WHERE trip_id = ?',
    [id]
  );
  return summaries[0];
};

export const toggleVisibility = async (id, userId) => {
  await query(
    'UPDATE trips SET is_public = NOT is_public WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return getTripById(id, userId);
};
