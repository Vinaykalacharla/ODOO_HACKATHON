import { create } from 'zustand';
import { api } from './useAuthStore';

const useDocStore = create((set, get) => ({
  documents: [],
  sessions: [],
  currentSession: null,
  loading: false,

  fetchDocuments: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get('/docs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ documents: data.data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  uploadDocument: async (file, title) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const { data } = await api.post('/docs/upload', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      set(state => ({ documents: [...state.documents, data.data], loading: false }));
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.response?.data?.error || 'Upload failed' };
    }
  },

  sendMessage: async (documentId, query, sessionId = null) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post('/chat/message', {
        documentId,
        query,
        sessionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local session if it exists
      if (sessionId) {
        get().fetchSessionHistory(sessionId);
      } else {
        set({ currentSession: data.data });
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Message failed' };
    }
  },

  fetchSessionHistory: async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get(`/chat/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ currentSession: data.data });
    } catch (error) {}
  }
}));

export default useDocStore;
