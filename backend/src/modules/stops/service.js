import { query } from '../../config/db.js';

export const getStops = async (tripId) => {
  return await query(
    `SELECT ts.*, c.name as city_name, c.country as city_country 
     FROM trip_stops ts 
     JOIN cities c ON ts.city_id = c.id 
     WHERE ts.trip_id = ? ORDER BY ts.stop_order ASC`,
    [tripId]
  );
};

export const createStop = async (tripId, data) => {
  const { city_id, arrival_date, departure_date, stop_order, notes } = data;
  await query(
    `INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, stop_order, notes) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [tripId, city_id, arrival_date, departure_date, stop_order, notes]
  );
  const stops = await query('SELECT * FROM trip_stops WHERE trip_id = ? AND stop_order = ?', [tripId, stop_order]);
  return stops[0];
};

export const updateStop = async (stopId, tripId, data) => {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), stopId, tripId];
  await query(`UPDATE trip_stops SET ${fields} WHERE id = ? AND trip_id = ?`, values);
  const stops = await query('SELECT * FROM trip_stops WHERE id = ?', [stopId]);
  return stops[0];
};

export const deleteStop = async (stopId, tripId) => {
  await query('DELETE FROM trip_stops WHERE id = ? AND trip_id = ?', [stopId, tripId]);
};

export const reorderStops = async (tripId, orders) => {
  for (const item of orders) {
    await query('UPDATE trip_stops SET stop_order = ? WHERE id = ? AND trip_id = ?', [item.stop_order, item.id, tripId]);
  }
};
