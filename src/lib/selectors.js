import { calculateTripFinancials, groupTripActivitiesByStop } from './health';

export function getCityById(cities, cityId) {
  return cities.find((city) => city.id === cityId) || null;
}

export function getUserById(users, userId) {
  return users.find((user) => user.id === userId) || null;
}

export function getTripById(trips, tripId) {
  return trips.find((trip) => trip.id === tripId && !trip.deletedAt) || null;
}

export function getTripByShareToken(trips, token) {
  return trips.find((trip) => trip.shareToken === token && !trip.deletedAt && trip.isPublic) || null;
}

export function getOwnedTrips(state, userId) {
  return state.trips
    .filter((trip) => trip.userId === userId && !trip.deletedAt)
    .slice()
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
}

export function getRecentTrips(state, userId, count = 3) {
  return getOwnedTrips(state, userId).slice(0, count);
}

export function getTripBundle(state, tripId) {
  const trip = getTripById(state.trips, tripId);
  if (!trip) return null;

  const stops = state.tripStops
    .filter((stop) => stop.tripId === tripId)
    .slice()
    .sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder));

  const tripActivities = state.tripActivities.filter((item) => stops.some((stop) => stop.id === item.tripStopId));
  const budgetEntries = state.budgetEntries.filter((entry) => entry.tripId === tripId);
  const packingItems = state.packingItems.filter((item) => item.tripId === tripId);
  const notes = state.notes
    .filter((note) => note.tripId === tripId)
    .slice()
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

  const finances = calculateTripFinancials(trip, stops, tripActivities, packingItems, budgetEntries, state.activities);
  const groupedStops = groupTripActivitiesByStop(stops, tripActivities, state.activities, state.cities);

  return {
    trip,
    stops,
    tripActivities,
    budgetEntries,
    packingItems,
    notes,
    finances,
    groupedStops,
  };
}

export function getPublicTripBundle(state, token) {
  const trip = getTripByShareToken(state.trips, token);
  if (!trip) return null;
  return getTripBundle(state, trip.id);
}

export function getRecommendedCities(state, limit = 6) {
  return state.cities
    .slice()
    .sort((a, b) => Number(b.popularityScore) - Number(a.popularityScore) || Number(a.avgDailyCostUsd) - Number(b.avgDailyCostUsd))
    .slice(0, limit);
}

export function getTopCitiesFromTrips(state, limit = 10) {
  const counts = new Map();
  state.tripStops.forEach((stop) => {
    counts.set(stop.cityId, (counts.get(stop.cityId) || 0) + 1);
  });

  return state.cities
    .map((city) => ({ ...city, timesAdded: counts.get(city.id) || 0 }))
    .filter((city) => city.timesAdded > 0)
    .sort((a, b) => Number(b.timesAdded) - Number(a.timesAdded) || Number(b.popularityScore) - Number(a.popularityScore))
    .slice(0, limit);
}

export function getTopActivitiesFromTrips(state, limit = 10) {
  const counts = new Map();
  state.tripActivities.forEach((entry) => {
    counts.set(entry.activityId, (counts.get(entry.activityId) || 0) + 1);
  });

  return state.activities
    .map((activity) => ({ ...activity, timesAdded: counts.get(activity.id) || 0 }))
    .filter((activity) => activity.timesAdded > 0)
    .sort((a, b) => Number(b.timesAdded) - Number(a.timesAdded))
    .slice(0, limit);
}

export function getRecentUsers(state, limit = 5) {
  return state.users
    .slice()
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
    .slice(0, limit)
    .map((user) => ({
      ...user,
      tripCount: state.trips.filter((trip) => trip.userId === user.id && !trip.deletedAt).length,
    }));
}
