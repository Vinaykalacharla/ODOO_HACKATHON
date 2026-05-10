import { query } from '../../config/db.js';

export const addActivityToStop = async (stopId, data) => {
  const { activity_id, scheduled_date, scheduled_time, actual_cost_override, is_confirmed } = data;
  await query(
    `INSERT INTO trip_activities (trip_stop_id, activity_id, scheduled_date, scheduled_time, actual_cost_override, is_confirmed) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [stopId, activity_id, scheduled_date, scheduled_time, actual_cost_override, is_confirmed]
  );
  const result = await query('SELECT * FROM trip_activities WHERE trip_stop_id = ? AND activity_id = ?', [stopId, activity_id]);
  return result[0];
};

export const removeActivityFromStop = async (stopId, taId) => {
  await query('DELETE FROM trip_activities WHERE id = ? AND trip_stop_id = ?', [taId, stopId]);
};

export const updateTripActivity = async (stopId, taId, data) => {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), taId, stopId];
  await query(`UPDATE trip_activities SET ${fields} WHERE id = ? AND trip_stop_id = ?`, values);
  const result = await query('SELECT * FROM trip_activities WHERE id = ?', [taId]);
  return result[0];
};

export const getCityActivities = async (cityId, category, maxCost) => {
  let sql = 'SELECT * FROM activities WHERE city_id = ?';
  const params = [cityId];
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (maxCost) {
    sql += ' AND estimated_cost_usd <= ?';
    params.push(maxCost);
  }
  return await query(sql, params);
};
