import { query } from '../../config/db.js';

export const getCities = async (search = '', country = '', page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  let sql = 'SELECT * FROM cities WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }
  if (country) {
    sql += ' AND country = ?';
    params.push(country);
  }

  sql += ' ORDER BY popularity_score DESC, name ASC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const cities = await query(sql, params);
  
  // Get total for pagination
  let countSql = 'SELECT COUNT(*) as count FROM cities WHERE 1=1';
  const countParams = [];
  if (search) {
    countSql += ' AND name LIKE ?';
    countParams.push(`%${search}%`);
  }
  if (country) {
    countSql += ' AND country = ?';
    countParams.push(country);
  }
  const [total] = await query(countSql, countParams);

  return { cities, total: total.count };
};
