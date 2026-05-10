import { create } from 'zustand';
import { delay, toIsoDate } from '../lib/format';
import { seedData } from '../data/mock';

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useTravelStore = create((set, get) => ({
  cities: seedData.cities.map((city) => ({ ...city })),
  activities: seedData.activities.map((activity) => ({ ...activity })),
  trips: seedData.trips.map((trip) => ({ ...trip })),
  tripStops: seedData.tripStops.map((stop) => ({ ...stop })),
  tripActivities: seedData.tripActivities.map((entry) => ({ ...entry })),
  budgetEntries: seedData.budgetEntries.map((entry) => ({ ...entry })),
  packingItems: seedData.packingItems.map((item) => ({ ...item })),
  notes: seedData.notes.map((note) => ({ ...note })),

  createTrip: async (payload) => {
    await delay(600);
    const trip = {
      id: nextId('trip'),
      userId: payload.userId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      coverImageUrl: payload.coverImageUrl?.trim() || '',
      startDate: toIsoDate(payload.startDate),
      endDate: toIsoDate(payload.endDate),
      totalBudget: Number(payload.totalBudget || 0),
      isPublic: 0,
      shareToken: `share-${nextId('token')}`,
      status: payload.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    set((state) => ({ trips: [...state.trips, trip] }));
    return trip;
  },

  updateTrip: async (tripId, patch) => {
    await delay(300);
    set((state) => ({
      trips: state.trips.map((trip) => (trip.id === tripId ? { ...trip, ...patch, updatedAt: new Date().toISOString() } : trip)),
    }));
  },

  deleteTrip: async (tripId) => {
    await delay(250);
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, deletedAt: new Date().toISOString() } : trip,
      ),
    }));
  },

  toggleTripVisibility: async (tripId) => {
    await delay(200);
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, isPublic: trip.isPublic ? 0 : 1, updatedAt: new Date().toISOString() } : trip,
      ),
    }));
  },

  addStop: async (tripId, payload) => {
    await delay(350);
    const currentStops = get().tripStops.filter((stop) => stop.tripId === tripId).sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder));
    const stop = {
      id: nextId('stop'),
      tripId,
      cityId: Number(payload.cityId),
      arrivalDate: toIsoDate(payload.arrivalDate),
      departureDate: toIsoDate(payload.departureDate),
      stopOrder: currentStops.length + 1,
      notes: payload.notes || '',
    };
    set((state) => ({ tripStops: [...state.tripStops, stop] }));
    return stop;
  },

  updateStop: async (stopId, patch) => {
    await delay(250);
    set((state) => ({
      tripStops: state.tripStops.map((stop) => (stop.id === stopId ? { ...stop, ...patch } : stop)),
    }));
  },

  deleteStop: async (stopId) => {
    await delay(250);
    set((state) => {
      const removed = state.tripStops.find((stop) => stop.id === stopId);
      const remaining = state.tripStops.filter((stop) => stop.id !== stopId);
      const reindexed = removed
        ? remaining
            .filter((stop) => stop.tripId === removed.tripId)
            .sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder))
            .map((stop, index) => ({ ...stop, stopOrder: index + 1 }))
        : remaining;

      return {
        tripStops: removed
          ? [
              ...remaining.filter((stop) => stop.tripId !== removed.tripId),
              ...reindexed,
            ]
          : remaining,
        tripActivities: state.tripActivities.filter((entry) => entry.tripStopId !== stopId),
      };
    });
  },

  reorderStops: async (tripId, orderedStops) => {
    await delay(300);
    set((state) => {
      const updatedStops = state.tripStops.map((stop) => {
        if (stop.tripId !== tripId) return stop;
        const updated = orderedStops.find((entry) => entry.id === stop.id);
        if (!updated) return stop;
        return {
          ...stop,
          stopOrder: Number(updated.stop_order ?? updated.stopOrder ?? stop.stopOrder),
        };
      });

      const tripStops = updatedStops.filter((stop) => stop.tripId === tripId).sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder));
      const otherStops = updatedStops.filter((stop) => stop.tripId !== tripId);

      return {
        tripStops: [...otherStops, ...tripStops],
      };
    });
  },

  addTripActivity: async (stopId, payload) => {
    await delay(250);
    const entry = {
      id: nextId('ta'),
      tripStopId: stopId,
      activityId: payload.activityId,
      scheduledDate: payload.scheduledDate || null,
      scheduledTime: payload.scheduledTime || null,
      actualCostOverride: payload.actualCostOverride ?? null,
      isConfirmed: payload.isConfirmed ?? 0,
    };
    set((state) => ({ tripActivities: [...state.tripActivities, entry] }));
    return entry;
  },

  updateTripActivity: async (taId, patch) => {
    await delay(250);
    set((state) => ({
      tripActivities: state.tripActivities.map((entry) => (entry.id === taId ? { ...entry, ...patch } : entry)),
    }));
  },

  deleteTripActivity: async (taId) => {
    await delay(250);
    set((state) => ({ tripActivities: state.tripActivities.filter((entry) => entry.id !== taId) }));
  },

  addBudgetEntry: async (tripId, payload) => {
    await delay(250);
    const entry = {
      id: nextId('budget'),
      tripId,
      category: payload.category,
      label: payload.label.trim(),
      amount: Number(payload.amount),
      entryDate: payload.entryDate ? toIsoDate(payload.entryDate) : null,
      isEstimated: payload.isEstimated ? 1 : 0,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ budgetEntries: [...state.budgetEntries, entry] }));
    return entry;
  },

  updateBudgetEntry: async (entryId, patch) => {
    await delay(250);
    set((state) => ({
      budgetEntries: state.budgetEntries.map((entry) => (entry.id === entryId ? { ...entry, ...patch } : entry)),
    }));
  },

  deleteBudgetEntry: async (entryId) => {
    await delay(250);
    set((state) => ({ budgetEntries: state.budgetEntries.filter((entry) => entry.id !== entryId) }));
  },

  addPackingItem: async (tripId, payload) => {
    await delay(180);
    const item = {
      id: nextId('pack'),
      tripId,
      label: payload.label.trim(),
      category: payload.category,
      isPacked: 0,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ packingItems: [...state.packingItems, item] }));
    return item;
  },

  togglePackingItem: async (itemId) => {
    await delay(120);
    set((state) => ({
      packingItems: state.packingItems.map((item) => (item.id === itemId ? { ...item, isPacked: item.isPacked ? 0 : 1 } : item)),
    }));
  },

  deletePackingItem: async (itemId) => {
    await delay(180);
    set((state) => ({ packingItems: state.packingItems.filter((item) => item.id !== itemId) }));
  },

  addNote: async (tripId, payload) => {
    await delay(200);
    const note = {
      id: nextId('note'),
      tripId,
      stopId: payload.stopId || null,
      content: payload.content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ notes: [note, ...state.notes] }));
    return note;
  },

  updateNote: async (noteId, patch) => {
    await delay(220);
    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note)),
    }));
  },

  deleteNote: async (noteId) => {
    await delay(220);
    set((state) => ({ notes: state.notes.filter((note) => note.id !== noteId) }));
  },
}));
