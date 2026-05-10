import { query } from '../../config/db.js';
import { hashPassword, comparePassword } from '../../utils/crypto.js';
import { signAccessToken, signRefreshToken } from '../../utils/jwt.js';

export const createUser = async (name, email, password) => {
  const passwordHash = await hashPassword(password);
  const result = await query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  
  // Get the created user (since id is UUID)
  const users = await query('SELECT id, name, email, is_admin FROM users WHERE email = ?', [email]);
  return users[0];
};

export const getUserByEmail = async (email) => {
  const users = await query('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL', [email]);
  return users[0];
};

export const getUserById = async (id) => {
  const users = await query('SELECT id, name, email, is_admin FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
  return users[0];
};

export const saveRefreshToken = async (userId, token, expiresAt) => {
  await query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );
};

export const deleteRefreshToken = async (token) => {
  await query('DELETE FROM refresh_tokens WHERE token = ?', [token]);
};

export const findRefreshToken = async (token) => {
  const tokens = await query('SELECT * FROM refresh_tokens WHERE token = ?', [token]);
  return tokens[0];
};
