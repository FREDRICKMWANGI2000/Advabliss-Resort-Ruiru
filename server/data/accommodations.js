// Authoritative room models and rates for AdvaBliss Resort Ruiru
// In sync with frontend/src/data/siteData.js
const ACCOMMODATIONS_MAP = {
  standard: {
    id: "standard",
    name: "Garden View Room",
    type: "Standard Room",
    price: 3500,
    currency: "KES",
    capacity: 2,
  },
  deluxe: {
    id: "deluxe",
    name: "Deluxe Forest Suite",
    type: "Deluxe Room",
    price: 4500,
    currency: "KES",
    capacity: 2,
  },
  family: {
    id: "family",
    name: "Family Garden Suite",
    type: "Family Suite",
    price: 7500,
    currency: "KES",
    capacity: 4,
  },
  executive: {
    id: "executive",
    name: "Executive Honeymoon Haven",
    type: "Luxury Suite",
    price: 9500,
    currency: "KES",
    capacity: 2,
  },
};

// Event categories and add-on pricing (KSh)
const EVENT_CAPACITY = {
  Weddings: [20, 500],
  "Corporate Events": [10, 300],
  "Private Parties": [10, 200],
  "Garden Hire": [50, 1000],
};

const EVENT_ADDON_PRICES = {
  tent: { id: "tent", name: "Marquee Tent", price: 400 },
  decor: { id: "decor", name: "Floral Decorations", price: 250 },
  sound: { id: "sound", name: "Sound System", price: 300 },
  dj: { id: "dj", name: "Professional DJ", price: 500 },
  lighting: { id: "lighting", name: "Ambient Lighting", price: 350 },
  catering: { id: "catering", name: "Full Catering", price: 1200 },
};

function resolveAccommodation(slugOrId) {
  if (!slugOrId) {
    return {
      id: "unspecified",
      name: "Standard Accommodation",
      type: "Standard Room",
      price: 3500,
      currency: "KES",
      capacity: 2,
    };
  }
  const key = String(slugOrId).trim().toLowerCase();
  if (ACCOMMODATIONS_MAP[key]) {
    return ACCOMMODATIONS_MAP[key];
  }
  // Check if caller passed the room name directly
  const found = Object.values(ACCOMMODATIONS_MAP).find(
    (r) => r.name.toLowerCase() === key
  );
  if (found) return found;

  return {
    id: key,
    name: String(slugOrId).trim(),
    type: "Suite / Room",
    price: 0,
    currency: "KES",
    capacity: 2,
  };
}

module.exports = {
  ACCOMMODATIONS_MAP,
  EVENT_CAPACITY,
  EVENT_ADDON_PRICES,
  resolveAccommodation,
};
