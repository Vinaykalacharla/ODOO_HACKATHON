import { create } from 'zustand';

let counter = 0;

export const useToastStore = create((set) => ({
  toasts: [],
  pushToast: ({ title, description = '', variant = 'info' }) => {
    const id = `toast-${Date.now()}-${counter += 1}`;
    set((state) => ({
      toasts: [...state.toasts, { id, title, description, variant }],
    }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
