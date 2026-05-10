import { query } from '../../config/db.js';

export const getStats = async () => {
  const [userCount] = await query('SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL');
  const [tripCount] = await query('SELECT COUNT(*) as count FROM trips WHERE deleted_at IS NULL');
  const [activityCount] = await query('SELECT COUNT(*) as count FROM trip_activities');
  const [publicTripCount] = await query('SELECT COUNT(*) as count FROM trips WHERE is_public = 1 AND deleted_at IS NULL');
  
  const topCities = await query(
    `SELECT c.name, c.country, COUNT(ts.id) as times_added 
     FROM trip_stops ts 
     JOIN cities c ON ts.city_id = c.id 
     GROUP BY c.id ORDER BY times_added DESC LIMIT 10`
  );

  const topActivities = await query(
    `SELECT a.name, a.category, COUNT(ta.id) as times_added 
     FROM trip_activities ta 
     JOIN activities a ON ta.activity_id = a.id 
     GROUP BY a.id ORDER BY times_added DESC LIMIT 10`
  );

  return {
    totals: {
      users: userCount.count,
      trips: tripCount.count,
      activities: activityCount.count,
      publicTrips: publicTripCount.count
    },
    topCities,
    topActivities
  };
};

export const getUsers = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const users = await query(
    `SELECT u.id, u.name, u.email, u.created_at, u.is_admin, 
     (SELECT COUNT(*) FROM trips t WHERE t.user_id = u.id AND t.deleted_at IS NULL) as trip_count 
     FROM users u WHERE u.deleted_at IS NULL ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
    [parseInt(limit), offset]
  );
  const [total] = await query('SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL');
  return { users, total: total.count };
};
