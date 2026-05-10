import { COUNTRY_FLAGS } from '../lib/meta';
import { titleCase } from '../lib/format';

const citySeed = [
  { id: 1, name: 'Paris', country: 'France', region: 'Europe', avgDailyCostUsd: 120, popularityScore: 10, timezone: 'Europe/Paris' },
  { id: 2, name: 'Tokyo', country: 'Japan', region: 'Asia', avgDailyCostUsd: 100, popularityScore: 10, timezone: 'Asia/Tokyo' },
  { id: 3, name: 'Bangkok', country: 'Thailand', region: 'Asia', avgDailyCostUsd: 45, popularityScore: 9, timezone: 'Asia/Bangkok' },
  { id: 4, name: 'Barcelona', country: 'Spain', region: 'Europe', avgDailyCostUsd: 95, popularityScore: 9, timezone: 'Europe/Madrid' },
  { id: 5, name: 'New York', country: 'USA', region: 'North America', avgDailyCostUsd: 180, popularityScore: 10, timezone: 'America/New_York' },
  { id: 6, name: 'Dubai', country: 'UAE', region: 'Middle East', avgDailyCostUsd: 150, popularityScore: 8, timezone: 'Asia/Dubai' },
  { id: 7, name: 'Singapore', country: 'Singapore', region: 'Asia', avgDailyCostUsd: 110, popularityScore: 8, timezone: 'Asia/Singapore' },
  { id: 8, name: 'Rome', country: 'Italy', region: 'Europe', avgDailyCostUsd: 105, popularityScore: 9, timezone: 'Europe/Rome' },
  { id: 9, name: 'Bali', country: 'Indonesia', region: 'Asia', avgDailyCostUsd: 40, popularityScore: 9, timezone: 'Asia/Makassar' },
  { id: 10, name: 'Istanbul', country: 'Turkey', region: 'Europe', avgDailyCostUsd: 55, popularityScore: 8, timezone: 'Europe/Istanbul' },
  { id: 11, name: 'Amsterdam', country: 'Netherlands', region: 'Europe', avgDailyCostUsd: 130, popularityScore: 8, timezone: 'Europe/Amsterdam' },
  { id: 12, name: 'Lisbon', country: 'Portugal', region: 'Europe', avgDailyCostUsd: 80, popularityScore: 8, timezone: 'Europe/Lisbon' },
  { id: 13, name: 'Prague', country: 'Czech Republic', region: 'Europe', avgDailyCostUsd: 60, popularityScore: 7, timezone: 'Europe/Prague' },
  { id: 14, name: 'Kyoto', country: 'Japan', region: 'Asia', avgDailyCostUsd: 90, popularityScore: 8, timezone: 'Asia/Tokyo' },
  { id: 15, name: 'Marrakech', country: 'Morocco', region: 'Africa', avgDailyCostUsd: 50, popularityScore: 7, timezone: 'Africa/Casablanca' },
  { id: 16, name: 'Cape Town', country: 'South Africa', region: 'Africa', avgDailyCostUsd: 70, popularityScore: 8, timezone: 'Africa/Johannesburg' },
  { id: 17, name: 'Sydney', country: 'Australia', region: 'Oceania', avgDailyCostUsd: 140, popularityScore: 8, timezone: 'Australia/Sydney' },
  { id: 18, name: 'Mumbai', country: 'India', region: 'Asia', avgDailyCostUsd: 35, popularityScore: 7, timezone: 'Asia/Kolkata' },
  { id: 19, name: 'Mexico City', country: 'Mexico', region: 'North America', avgDailyCostUsd: 55, popularityScore: 7, timezone: 'America/Mexico_City' },
  { id: 20, name: 'Vienna', country: 'Austria', region: 'Europe', avgDailyCostUsd: 110, popularityScore: 7, timezone: 'Europe/Vienna' },
  { id: 21, name: 'Budapest', country: 'Hungary', region: 'Europe', avgDailyCostUsd: 65, popularityScore: 7, timezone: 'Europe/Budapest' },
  { id: 22, name: 'Reykjavik', country: 'Iceland', region: 'Europe', avgDailyCostUsd: 200, popularityScore: 6, timezone: 'Atlantic/Reykjavik' },
  { id: 23, name: 'Nairobi', country: 'Kenya', region: 'Africa', avgDailyCostUsd: 60, popularityScore: 6, timezone: 'Africa/Nairobi' },
  { id: 24, name: 'Hanoi', country: 'Vietnam', region: 'Asia', avgDailyCostUsd: 30, popularityScore: 7, timezone: 'Asia/Bangkok' },
  { id: 25, name: 'Buenos Aires', country: 'Argentina', region: 'South America', avgDailyCostUsd: 50, popularityScore: 7, timezone: 'America/Argentina/Buenos_Aires' },
];

const activityTemplates = {
  sightseeing: ['Signature landmarks walk', 'Sunrise skyline tour', 'Old quarter highlights', 'Private viewpoint circuit', 'Heritage district stroll'],
  food: ['Chef-led tasting trail', 'Street food sampler', 'Market-to-table lunch', 'Wine and tapas circuit', 'Late-night dessert crawl'],
  adventure: ['E-bike hidden trails', 'Coastal kayak escape', 'Sunrise hike loop', 'City rooftop climb', 'Off-road discovery ride'],
  culture: ['Museum after-hours visit', 'Artisan workshop session', 'Heritage storytelling walk', 'Local performance night', 'Curator-led gallery tour'],
  shopping: ['Boutique crawl', 'Design market hunt', 'Craft district browse', 'Vintage treasure search', 'Local makers market'],
  wellness: ['Spa ritual reset', 'Morning yoga session', 'Thermal bath unwind', 'Mindful garden walk', 'Sound bath and tea ritual'],
};

function makeFlag(country) {
  return COUNTRY_FLAGS[country] || '🌍';
}

function currencyFor(city, factor) {
  return Math.round(city.avgDailyCostUsd * factor * 100) / 100;
}

function createCityActivities(city) {
  const categories = ['sightseeing', 'food', 'culture', 'shopping', 'wellness'];
  if (city.popularityScore >= 8) {
    categories[2] = 'adventure';
  }

  return categories.map((category, index) => {
    const templates = activityTemplates[category];
    const template = templates[(city.id + index) % templates.length];

    return {
      id: `activity-${city.id}-${index + 1}`,
      cityId: city.id,
      name: `${city.name} ${template}`,
      category,
      estimatedCostUsd: currencyFor(city, 0.16 + index * 0.04),
      durationHours: Number((1.5 + index * 0.75).toFixed(1)),
      description: `${titleCase(city.name)} ${template.toLowerCase()} designed for a polished, low-friction day.`,
      imageUrl: `https://images.unsplash.com/photo-${1840000000000 + city.id * 1111}?auto=format&fit=crop&w=900&q=80`,
      tags: [city.region, category, city.country],
    };
  });
}

const cities = citySeed.map((city) => ({
  ...city,
  flag: makeFlag(city.country),
}));

const activities = cities.flatMap((city) => createCityActivities(city));

function buildTrip({
  tripId,
  userId,
  title,
  description,
  coverImageUrl,
  startDate,
  endDate,
  totalBudget,
  status,
  isPublic,
  shareToken,
  stops,
  budgetEntries,
  packingItems,
  notes,
}) {
  const tripStops = [];
  const tripActivities = [];

  stops.forEach((stop, index) => {
    const stopId = `${tripId}-stop-${index + 1}`;
    tripStops.push({
      id: stopId,
      tripId,
      cityId: stop.cityId,
      arrivalDate: stop.arrivalDate,
      departureDate: stop.departureDate,
      stopOrder: index + 1,
      notes: stop.notes || '',
    });

    const cityActivities = activities.filter((activity) => activity.cityId === stop.cityId).slice(0, 4);
    cityActivities.forEach((activity, activityIndex) => {
      tripActivities.push({
        id: `${tripId}-ta-${index + 1}-${activityIndex + 1}`,
        tripStopId: stopId,
        activityId: activity.id,
        scheduledDate: stop.arrivalDate,
        scheduledTime: ['09:00', '11:30', '15:00', '19:00'][activityIndex],
        actualCostOverride: activityIndex % 2 === 0 ? null : Number((activity.estimatedCostUsd * 1.08).toFixed(2)),
        isConfirmed: activityIndex < 2 ? 1 : 0,
      });
    });
  });

  return {
    trip: {
      id: tripId,
      userId,
      title,
      description,
      coverImageUrl,
      startDate,
      endDate,
      totalBudget,
      isPublic,
      shareToken,
      status,
      createdAt: `${startDate}T08:00:00Z`,
      updatedAt: `${endDate}T18:30:00Z`,
      deletedAt: null,
    },
    tripStops,
    tripActivities,
    budgetEntries: budgetEntries.map((entry, index) => ({
      id: `${tripId}-budget-${index + 1}`,
      tripId,
      createdAt: `${startDate}T09:00:00Z`,
      isEstimated: entry.isEstimated ?? 1,
      ...entry,
    })),
    packingItems: packingItems.map((item, index) => ({
      id: `${tripId}-pack-${index + 1}`,
      tripId,
      createdAt: `${startDate}T10:00:00Z`,
      isPacked: item.isPacked ?? 0,
      ...item,
    })),
    notes: notes.map((note, index) => ({
      id: `${tripId}-note-${index + 1}`,
      tripId,
      stopId: note.stopId || null,
      content: note.content,
      createdAt: `${startDate}T12:00:00Z`,
      updatedAt: `${endDate}T12:00:00Z`,
    })),
  };
}

const travelerUser = {
  id: 'user-traveler',
  name: 'Maya Traveler',
  email: 'traveler@demo.com',
  password: 'demo1234',
  avatarUrl: '',
  languagePref: 'en',
  isAdmin: 0,
  createdAt: '2025-03-01T10:00:00Z',
};

const explorerUser = {
  id: 'user-explorer',
  name: 'Noah Explorer',
  email: 'explorer@demo.com',
  password: 'demo1234',
  avatarUrl: '',
  languagePref: 'en',
  isAdmin: 1,
  createdAt: '2025-03-10T11:00:00Z',
};

const adminUser = {
  id: 'user-admin',
  name: 'Harper Admin',
  email: 'admin@traveloop.app',
  password: 'admin1234',
  avatarUrl: '',
  languagePref: 'en',
  isAdmin: 1,
  createdAt: '2025-02-20T09:00:00Z',
};

const europeTrip = buildTrip({
  tripId: 'trip-europe-2025',
  userId: travelerUser.id,
  title: 'Europe Summer 2025',
  description: 'A multi-city loop through iconic capitals with room for slow mornings and long dinners.',
  coverImageUrl:
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
  startDate: '2025-06-14',
  endDate: '2025-06-26',
  totalBudget: 5000,
  status: 'planned',
  isPublic: 1,
  shareToken: 'share-europe-summer-2025',
  stops: [
    { cityId: 1, arrivalDate: '2025-06-14', departureDate: '2025-06-17' },
    { cityId: 8, arrivalDate: '2025-06-17', departureDate: '2025-06-21' },
    { cityId: 4, arrivalDate: '2025-06-21', departureDate: '2025-06-26' },
  ],
  budgetEntries: [
    { category: 'transport', label: 'Roundtrip flights', amount: 980, entryDate: '2025-05-01', isEstimated: 0 },
    { category: 'accommodation', label: 'Boutique hotels', amount: 1720, entryDate: '2025-05-02', isEstimated: 1 },
    { category: 'food', label: 'Dining and cafes', amount: 640, entryDate: '2025-05-03', isEstimated: 1 },
    { category: 'activities', label: 'Museum passes and tours', amount: 880, entryDate: '2025-05-04', isEstimated: 1 },
    { category: 'misc', label: 'Transit and buffer', amount: 220, entryDate: '2025-05-05', isEstimated: 1 },
  ],
  packingItems: [
    { label: 'Passport', category: 'documents', isPacked: 1 },
    { label: 'Universal adapter', category: 'electronics', isPacked: 1 },
    { label: 'Walking shoes', category: 'clothing', isPacked: 0 },
    { label: 'Lightweight blazer', category: 'clothing', isPacked: 0 },
    { label: 'Noise-canceling headphones', category: 'electronics', isPacked: 1 },
    { label: 'Travel toiletries kit', category: 'toiletries', isPacked: 0 },
  ],
  notes: [
    { content: 'Book the Paris hotel near the Seine so the first morning feels relaxed.', stopId: 'trip-europe-2025-stop-1' },
    { content: 'Hold one extra evening in Barcelona for a spontaneous rooftop reservation.', stopId: 'trip-europe-2025-stop-3' },
  ],
});

const asiaTrip = buildTrip({
  tripId: 'trip-asia-2025',
  userId: travelerUser.id,
  title: 'Asia Autumn Loop',
  description: 'Fast-moving, food-forward trip with a balance of cities, temples, and late-night energy.',
  coverImageUrl:
    'https://images.unsplash.com/photo-1535139262971-c518e495a55f?auto=format&fit=crop&w=1600&q=80',
  startDate: '2025-10-02',
  endDate: '2025-10-13',
  totalBudget: 4800,
  status: 'draft',
  isPublic: 0,
  shareToken: 'share-asia-autumn-loop',
  stops: [
    { cityId: 2, arrivalDate: '2025-10-02', departureDate: '2025-10-05' },
    { cityId: 14, arrivalDate: '2025-10-05', departureDate: '2025-10-09' },
    { cityId: 3, arrivalDate: '2025-10-09', departureDate: '2025-10-13' },
  ],
  budgetEntries: [
    { category: 'transport', label: 'International flights', amount: 1100, entryDate: '2025-08-01', isEstimated: 1 },
    { category: 'accommodation', label: 'City stays', amount: 1450, entryDate: '2025-08-02', isEstimated: 1 },
    { category: 'food', label: 'Food and drinks', amount: 730, entryDate: '2025-08-03', isEstimated: 1 },
    { category: 'activities', label: 'Tours and workshops', amount: 890, entryDate: '2025-08-04', isEstimated: 1 },
    { category: 'misc', label: 'Transit and margin', amount: 250, entryDate: '2025-08-05', isEstimated: 1 },
  ],
  packingItems: [
    { label: 'Power bank', category: 'electronics', isPacked: 1 },
    { label: 'Travel umbrella', category: 'misc', isPacked: 0 },
    { label: 'Comfortable shirts', category: 'clothing', isPacked: 1 },
    { label: 'Printed bookings', category: 'documents', isPacked: 1 },
    { label: 'Sunscreen', category: 'toiletries', isPacked: 0 },
    { label: 'Lightweight scarf', category: 'clothing', isPacked: 0 },
  ],
  notes: [
    { content: 'Tokyo first night should stay central so the jet lag window is smaller.', stopId: 'trip-asia-2025-stop-1' },
    { content: 'Reserve the Bangkok final dinner after the hotel check-in window.', stopId: 'trip-asia-2025-stop-3' },
  ],
});

const allTripData = [europeTrip, asiaTrip];

const trips = allTripData.map((entry) => entry.trip);
const tripStops = allTripData.flatMap((entry) => entry.tripStops);
const tripActivities = allTripData.flatMap((entry) => entry.tripActivities);
const budgetEntries = allTripData.flatMap((entry) => entry.budgetEntries);
const packingItems = allTripData.flatMap((entry) => entry.packingItems);
const notes = allTripData.flatMap((entry) => entry.notes);

const users = [travelerUser, explorerUser, adminUser];

export const seedData = {
  users,
  cities,
  activities,
  trips,
  tripStops,
  tripActivities,
  budgetEntries,
  packingItems,
  notes,
};

export function getDemoTripByToken(token) {
  return trips.find((trip) => trip.shareToken === token && trip.isPublic) || null;
}
