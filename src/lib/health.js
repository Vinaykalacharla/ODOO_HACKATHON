import { clamp } from './format';

export function calculateTripFinancials(trip, stops = [], tripActivities = [], packingItems = [], budgetEntries = [], activities = []) {
  const totalSpent = budgetEntries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  const activityCost = tripActivities.reduce((sum, ta) => {
    const activity = activities.find((item) => item.id === ta.activityId);
    const cost = ta.actualCostOverride != null ? Number(ta.actualCostOverride) : Number(activity?.estimatedCostUsd || 0);
    return sum + cost;
  }, 0);

  const totalEstimatedCost = totalSpent + activityCost;
  const budgetUsedPct = trip?.totalBudget ? (totalEstimatedCost / Number(trip.totalBudget)) * 100 : 0;
  const budgetStatus =
    !trip?.totalBudget
      ? 'unset'
      : budgetUsedPct > 100
        ? 'over'
        : budgetUsedPct > 80
          ? 'warning'
          : 'healthy';

  const packingPacked = packingItems.filter((item) => item.isPacked).length;
  const packingProgress = packingItems.length ? (packingPacked / packingItems.length) * 100 : 0;

  const stopActivityMap = new Map();
  tripActivities.forEach((activity) => {
    stopActivityMap.set(activity.tripStopId, (stopActivityMap.get(activity.tripStopId) || 0) + 1);
  });
  const everyStopHasActivity = stops.length > 0 && stops.every((stop) => (stopActivityMap.get(stop.id) || 0) > 0);

  const score =
    (budgetStatus === 'healthy' ? 40 : budgetStatus === 'warning' ? 20 : 0) +
    (stops.length > 0 ? 20 : 0) +
    (everyStopHasActivity ? 20 : 0) +
    Math.min(20, packingProgress * 0.2);

  return {
    totalSpent,
    activityCost,
    totalEstimatedCost,
    budgetUsedPct: clamp(budgetUsedPct, 0, 999),
    budgetStatus,
    packingProgress,
    healthScore: Math.round(clamp(score, 0, 100)),
  };
}

export function groupTripActivitiesByStop(stops = [], tripActivities = [], activities = [], cities = []) {
  return stops
    .slice()
    .sort((a, b) => Number(a.stopOrder) - Number(b.stopOrder))
    .map((stop) => {
      const city = cities.find((item) => item.id === stop.cityId);
      const rows = tripActivities
        .filter((item) => item.tripStopId === stop.id)
        .slice()
        .sort((a, b) => String(a.scheduledDate || '').localeCompare(String(b.scheduledDate || '')) || String(a.scheduledTime || '').localeCompare(String(b.scheduledTime || '')))
        .map((item) => ({
          ...item,
          activity: activities.find((candidate) => candidate.id === item.activityId),
        }));

      return {
        ...stop,
        city,
        activities: rows,
      };
    });
}
