import { useMemo } from 'react';
import { useTravelStore } from '../store/travelStore';
import { getPublicTripBundle, getTripBundle } from '../lib/selectors';

export function useTripBundle(tripId) {
  const state = useTravelStore((current) => current);
  return useMemo(() => (tripId ? getTripBundle(state, tripId) : null), [state, tripId]);
}

export function usePublicTripBundle(token) {
  const state = useTravelStore((current) => current);
  return useMemo(() => (token ? getPublicTripBundle(state, token) : null), [state, token]);
}
