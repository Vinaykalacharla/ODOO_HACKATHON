import { create } from 'zustand';
import { delay } from '../lib/format';
import { seedData } from '../data/mock';

const seedUsers = seedData.users.map((user) => ({ ...user }));

export const useAuthStore = create((set, get) => ({
  users: seedUsers,
  currentUserId: null,
  isHydrated: true,

  getCurrentUser: () => {
    const { users, currentUserId } = get();
    return users.find((user) => user.id === currentUserId) || null;
  },

  login: async ({ email, password }) => {
    await delay(450);
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const user = get().users.find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.password === password,
    );
    if (!user) {
      throw new Error('Invalid email or password.');
    }
    set({ currentUserId: user.id });
    return user;
  },

  signup: async ({ name, email, password }) => {
    await delay(550);
    const normalizedEmail = String(email || '').toLowerCase().trim();
    if (get().users.some((candidate) => candidate.email.toLowerCase() === normalizedEmail)) {
      throw new Error('That email is already registered.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: String(name || '').trim(),
      email: normalizedEmail,
      password,
      avatarUrl: '',
      languagePref: 'en',
      isAdmin: 0,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      users: [...state.users, newUser],
      currentUserId: newUser.id,
    }));

    return newUser;
  },

  logout: async (options = {}) => {
    await delay(options.silent ? 0 : 180);
    set({ currentUserId: null });
  },

  updateProfile: async ({ name, email }) => {
    await delay(350);
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const { users, currentUserId } = get();
    if (!currentUserId) throw new Error('Not authenticated.');
    if (users.some((candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.id !== currentUserId)) {
      throw new Error('Email already in use.');
    }
    set({
      users: users.map((user) =>
        user.id === currentUserId
          ? {
              ...user,
              name: String(name || '').trim(),
              email: normalizedEmail,
            }
          : user,
      ),
    });
  },

  changePassword: async ({ currentPassword, nextPassword }) => {
    await delay(450);
    const { users, currentUserId } = get();
    const user = users.find((candidate) => candidate.id === currentUserId);
    if (!user) throw new Error('Not authenticated.');
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect.');
    }
    set({
      users: users.map((candidate) =>
        candidate.id === currentUserId ? { ...candidate, password: nextPassword } : candidate,
      ),
    });
  },
}));

