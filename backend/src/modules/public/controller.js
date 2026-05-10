import { query } from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getPublicItinerary = async (req, res, next) => {
  try {
    const { shareToken } = req.params;
    
    // Get trip by share token
    const trips = await query(
      'SELECT t.*, u.name as user_name FROM trips t JOIN users u ON t.user_id = u.id WHERE t.share_token = ? AND t.deleted_at IS NULL',
      [shareToken]
    );
    
    if (trips.length === 0) return sendError(res, 'Trip not found or not public', 404);
    const trip = trips[0];
    
    if (trip.is_public === 0) return sendError(res, 'This trip is private', 403);

    // Get stops and activities
    const stops = await query(
      `SELECT ts.*, c.name as city_name 
       FROM trip_stops ts 
       JOIN cities c ON ts.city_id = c.id 
       WHERE ts.trip_id = ? ORDER BY ts.stop_order ASC`,
      [trip.id]
    );

    const stopIds = stops.map(s => s.id);
    let activities = [];
    if (stopIds.length > 0) {
      activities = await query(
        `SELECT ta.*, a.name as activity_name, a.category 
         FROM trip_activities ta 
         JOIN activities a ON ta.activity_id = a.id 
         WHERE ta.trip_stop_id IN (?)`,
        [stopIds]
      );
    }

    const summary = await query('SELECT * FROM trip_cost_summary WHERE trip_id = ?', [trip.id]);

    return sendSuccess(res, { 
      trip, 
      stops, 
      activities,
      summary: summary[0]
    });
  } catch (err) {
    next(err);
  }
};
