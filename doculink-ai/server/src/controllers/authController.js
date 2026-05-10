const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * Controller for User Authentication
 */
const authController = {
  /**
   * Register a new user
   */
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create({ name, email, password });

      res.status(201).json({
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (user && (await user.matchPassword(password))) {
        res.json({
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
          }
        });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get current user profile
   */
  async getMe(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;
