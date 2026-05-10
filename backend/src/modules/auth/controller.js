import * as authService from './service.js';
import { comparePassword } from '../../utils/crypto.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../../utils/jwt.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      return sendError(res, 'Email already in use', 400);
    }

    const user = await authService.createUser(name, email, password);
    return sendSuccess(res, { user }, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.getUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password_hash))) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const payload = { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Save refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    await authService.saveRefreshToken(user.id, refreshToken, expiresAt);

    // Set cookie for access token
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    return sendSuccess(res, { user: payload, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.deleteRefreshToken(refreshToken);
    }
    res.clearCookie('accessToken');
    return sendSuccess(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token required', 400);

    const savedToken = await authService.findRefreshToken(refreshToken);
    if (!savedToken) return sendError(res, 'Invalid refresh token', 401);

    const decoded = verifyToken(refreshToken, true);
    const user = await authService.getUserById(decoded.id);

    if (!user) return sendError(res, 'User not found', 404);

    const payload = { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin };
    const accessToken = signAccessToken(payload);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    return sendSuccess(res, { accessToken });
  } catch (err) {
    next(err);
  }
};
