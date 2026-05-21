// ===== NAVIGATION =====
export const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'Accommodation', id: 'accommodation' },
  { label: 'Restaurant & Bar', id: 'restaurant' },
  { label: 'Meetings & Events', id: 'events' },
  { label: 'Games & Activities', id: 'activities' },
  { label: 'Offers', id: 'offers' },
  { label: 'Virtual Tour', id: 'virtual-tour' },
  { label: 'Contact Us', id: 'contact' },
];

// ===== FEATURED EVENT =====
export const FEATURED_EVENT = {
  title: 'THE AFTERNOON BLISS PARTY"Season 8"',
  subtitle: 'Afternoon of Elegance & Entertainment',
  date: new Date('2026-05-30T14:00:00'),
  location: 'AdvaBliss Resort Garden, Ruiru',
  description: 'Best Kenya Show is here! Step into an epic celebration under the stars featuring all Kenyan music styles — Afro-pop, gengetone, gospel, benga, and more. Enjoy live performances, gourmet dining, a silent auction, and a magical garden light show. This is the ultimate Kenyan entertainment experience!!.',
  ticketUrl: 'https://theafternoonblissparty.hustlesasa.shop/',
  image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80',
};

// ===== ACCOMMODATIONS =====
export const ACCOMMODATIONS = [
  {
    id: 'standard',
    name: 'Garden View Room',
    type: 'Standard Room',
    price: 3500,
    currency: 'KES',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    description: 'Serene garden-view rooms with natural light, premium bedding, and all modern amenities for a comfortable stay.',
    features: ['Free WiFi','Smart TV', 'En-suite bathroom'],
    capacity: 2,
    badge: null,
  },
  {
    id: 'deluxe',
    name: 'Deluxe Forest Suite',
    type: 'Deluxe Room',
    price: 4500,
    currency: 'KES',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    description: 'Expansive suites with forest panoramas, a private lounge area, soaking tub, and exclusive butler service.',
    features: ['King bed', 'Free WiFi','Smart TV', 'En-suite bathroom'],
    capacity: 2,
    badge: 'Most Popular',
  },
  {
    id: 'family',
    name: 'Family Paradise Suite',
    type: 'Family Room',
    price: 10000,
    currency: 'KES',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    description: 'Spacious multi-room suites designed for families with separate living areas, bunk beds, and a kids\' play corner.',
    features: ['2 bedrooms', 'Living area', 'Kids\' play corner', 'Kitchenette', '2 bathrooms', 'Family pool access'],
    capacity: 6,
    badge: 'Family Choice',
  },
  {
    id: 'event-stay',
    name: 'Event Stay Package',
    type: 'Event Package',
    price: 15000,
    currency: 'KES',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
    description: 'All-inclusive event packages combining luxury accommodation with event access, private dining, and exclusive activities.',
    features: ['Premium suite', 'Event entry x2', 'Breakfast & dinner', 'Spa access', 'Airport transfer', 'Concierge'],
    capacity: 4,
    badge: 'All-Inclusive',
  },
];

// ===== MENU =====
export const MENU_CATEGORIES = {
  starters: {
    label: 'Starters',
    items: [
      { name: 'Garden Bruschetta', desc: 'Heirloom tomatoes, basil oil, parmesan crisps', price: 14 },
      { name: 'Smoked Salmon Roulade', desc: 'Cream cheese, capers, dill, blini', price: 18 },
      { name: 'Soup du Jour', desc: 'Chef\'s daily creation with artisan bread', price: 12 },
      { name: 'Charcuterie Board', desc: 'Cured meats, artisan cheeses, fig jam, crackers', price: 24 },
    ],
  },
  mains: {
    label: 'Main Courses',
    items: [
      { name: 'Grilled Forest Herb Chicken', desc: 'Lemon-thyme jus, seasonal vegetables, garlic mash', price: 32 },
      { name: 'Pan-Seared Sea Bass', desc: 'Saffron beurre blanc, asparagus, wild rice', price: 42 },
      { name: 'Slow-Roasted Lamb Shank', desc: 'Red wine reduction, root vegetable medley', price: 48 },
      { name: 'Wild Mushroom Risotto', desc: 'Truffle oil, parmesan, microgreens (V)', price: 28 },
    ],
  },
  desserts: {
    label: 'Desserts',
    items: [
      { name: 'Chocolate Fondant', desc: 'Warm dark chocolate, vanilla bean ice cream', price: 14 },
      { name: 'Crème Brûlée', desc: 'Classic French custard, caramelised sugar', price: 12 },
      { name: 'Seasonal Fruit Pavlova', desc: 'Meringue, whipped cream, fresh berries', price: 13 },
      { name: 'Cheese Selection', desc: 'Four artisan cheeses, quince, walnuts', price: 18 },
    ],
  },
  drinks: {
    label: 'Signature Drinks',
    items: [
      { name: 'Bliss Garden Spritz', desc: 'Elderflower, cucumber, prosecco, mint', price: 14 },
      { name: 'Forest Negroni', desc: 'Gin, Campari, sweet vermouth, cedar smoke', price: 16 },
      { name: 'Mango & Ginger Cooler', desc: 'Fresh mango, ginger beer, lime, basil (NA)', price: 10 },
      { name: 'Reserve Wine Flight', desc: 'Three curated reds or whites', price: 28 },
    ],
  },
};

// ===== EVENTS & MEETINGS =====
export const EVENT_TYPES = [
  { id: 'wedding', name: 'Weddings', capacity: '20–500 guests', desc: 'Magical ceremonies and receptions in our enchanting garden and grand ballroom.' },
  { id: 'corporate', name: 'Corporate Events',  capacity: '10–300 guests', desc: 'State-of-the-art conference facilities with A/V tech and dedicated event staff.' },
  { id: 'private', name: 'Private Parties',  capacity: '10–200 guests', desc: 'Bespoke celebrations for birthdays, anniversaries, and milestone moments.' },
  { id: 'garden', name: 'Garden Hire', capacity: '50–1000 guests', desc: 'Exclusive hire of our sprawling garden grounds for outdoor events and festivals.' },
];

export const EVENT_ADDONS = [
  { id: 'tent', name: 'Marquee Tent', price: 400,  },
  { id: 'decor', name: 'Floral Decorations', price: 250,  },
  { id: 'sound', name: 'Sound System', price: 300,  },
  { id: 'dj', name: 'Professional DJ', price: 500,  },
  { id: 'lighting', name: 'Ambient Lighting', price: 350,  },
  { id: 'catering', name: 'Full Catering', price: 1200,  },
];

// ===== ACTIVITIES =====
export const ACTIVITIES = [
  {
    name: 'Rope Bridge Adventure',
       image: 'https://plus.unsplash.com/premium_photo-1682098380318-b6dd40af17e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Soar above the forest canopy on our thrilling zipline course — a 400m aerial journey with breathtaking views.',
    duration: '30–45 min',
    ageMin: 8,
  },
  {
    name: 'Ziplining Experience',
 image: 'https://images.unsplash.com/photo-1712782516688-cbcbf93b1b7c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Glide across our smooth outdoor skating rink, available year-round with rental skates for all skill levels.',
    duration: '1 hour',
    ageMin: 4,
  },
  {
    name: 'Garden Swings',
    image:'https://images.unsplash.com/photo-1651056088419-3e9b650fdc14?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Scenic swing sets nestled among lush gardens — the perfect spot for relaxation and family fun.',
    duration: 'Open access',
    ageMin: 3,
  },
  {
    name: 'Bouncing Castles',
    image: 'https://images.unsplash.com/photo-1765947389722-2e96d8c0aad9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Gigantic bouncing castles and inflatable obstacle courses for non-stop children\'s entertainment.',
    duration: '1 hour sessions',
    ageMin: 2,
    price: 15,
  },
  {
    name: 'Boat Riding',
    image: 'https://images.unsplash.com/photo-1760098133724-501894bf345e?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Peaceful paddle and rowboat experiences on our private lake, surrounded by nature and scenic views.',
    duration: '30–60 min',
    ageMin: 6,
    price: 25,
  },
];

// ===== OFFERS =====
export const OFFERS = [
  {
    tag: 'Weekend Escape',
    title: 'Garden Retreat Package',
    desc: '2 nights in our Deluxe Forest Suite with breakfast daily, a couples\' spa treatment, and a private garden dinner.',
    image: 'https://tse4.mm.bing.net/th/id/OIP.M6TJGwex5SMXcfV9qL30mwHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
    originalPrice: 860,
    salePrice: 649,
    validity: 'Valid through September 2025',
    includes: ['2 nights Deluxe Suite', 'Daily breakfast', 'Couples spa', 'Private dinner', 'Late checkout'],
    badge: 'Save 25%',
  },
  {
    tag: 'Corporate Deal',
    title: 'Business & Leisure Bundle',
    desc: 'Full-day meeting room with AV tech, lunch for up to 20 guests, 1 night accommodation, and evening cocktail reception.',
    image: 'https://tse1.mm.bing.net/th/id/OIP.xV9uZx82A9oc8A2A2NsCpQHaFB?rs=1&pid=ImgDetMain&o=7&rm=3',
    originalPrice: 1200,
    salePrice: 899,
    validity: 'Weekdays only',
    includes: ['Full-day venue', 'AV equipment', 'Lunch buffet', '1 night stay', 'Cocktail hour'],
    badge: 'Save 25%',
  },
  {
    tag: 'Family Fun',
    title: 'Family Adventure Package',
    desc: '3 nights in Family Paradise Suite, daily breakfast, unlimited activities access for kids, and a sunset boat ride.',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80',
    originalPrice: 1540,
    salePrice: 1099,
    validity: 'School holidays only',
    includes: ['3 nights Family Suite', 'Daily breakfast', 'Kids activities pass', 'Boat ride', 'Pool access'],
    badge: 'Save 29%',
  },
  {
    tag: 'Celebration',
    title: 'Wedding Dream Package',
    desc: 'Complete wedding day with venue hire, floral decor, catering for 100 guests, overnight suite, and honeymoon breakfast.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    originalPrice: 8500,
    salePrice: 6999,
    validity: 'Limited dates available',
    includes: ['Garden venue', 'Floral decor', 'Catering x100', 'Sound & lighting', 'Bridal suite', 'Honeymoon breakfast'],
    badge: 'Save 18%',
  },
];

// ===== VIRTUAL TOUR SPACES =====
import backgroundimg1 from '../components/images/backgroundimg1.png';
import lakeview from '../components/images/lakeview.png';

export const TOUR_SPACES = [
  {
    id: 'garden',
    name: 'Garden & Grounds',
    desc: 'Over 5 acres of manicured gardens with water features, walking paths, and event lawns.',
    image: backgroundimg1,
    thumb: backgroundimg1,
  },
  {
    id: 'rooms',
    name: 'Luxury Suites',
    desc: 'Thoughtfully designed rooms blending natural elements with five-star comfort.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Terrace',
    desc: 'Al fresco dining and intimate indoor spaces curated for exceptional culinary experiences.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
  },
  {
    id: 'bar',
    name: 'Garden Bar & Lounge',
    desc: 'Open-air bar with craft cocktails and an intimate lounge for sunset relaxation.',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80',
  },
  {
    id: 'events',
    name: 'Event Spaces',
    desc: 'Versatile ballrooms and garden pavilions for weddings, galas, and corporate gatherings.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
  },
  {
    id: 'lakeview',
    name: 'Lake View',
    desc: 'Infinity pool overlooking the gardens and a full-service wellness spa sanctuary.',
    image: lakeview,
    thumb: lakeview,
  },
];

// ===== TESTIMONIALS =====
export const TESTIMONIALS = [
  {
    name: 'Alex ',
    occasion: 'Wedding, March 2025',
    avatar: 'https://images.icon-icons.com/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png',
    text: 'Our wedding at AdvaBliss was nothing short of magical. Every detail was flawless, the garden was breathtaking, and the team made us feel like royalty. We\'ll cherish it forever.',
    rating: 5,
  },
  {
    name: 'Joan Mwangi',
    occasion: 'Corporate Retreat, January 2025',
    avatar: 'https://images.icon-icons.com/2643/PNG/512/female_woman_avatar_people_person_white_tone_icon_159370.png',
    text: 'Exceptional facilities, impeccable service, and stunning surroundings. Our annual leadership retreat has found its permanent home at AdvaBliss Resort.',
    rating: 4,
  },
  {
    name: 'Priya Sharma',
    occasion: 'Family Vacation, December 2024',
    avatar: 'https://images.icon-icons.com/2859/PNG/512/avatar_face_girl_female_woman_profile_smiley_happy_people_icon_181665.png',
    text: 'The kids had an absolute blast with the activities, and my husband and I could actually relax! The family suite was incredible — spacious, elegant, and wonderfully child-friendly.',
    rating: 5,
  },
];

export const CONTACT_INFO = {
  phone: '+254 794400999',
  email: 'reservations@advabliss.com',
  address: 'AdvaBliss Resort, Ruiru, Kenya',
  mapUrl: 'https://maps.app.goo.gl/uw4TgQESMfe4Rv4D9',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0501158711777!2d36.98272729217!3d-1.1243627633298694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f47e41be760f5%3A0x599e3009d5521fb1!2sAdvabliss%20resort!5e0!3m2!1sen!2ske!4v1779271387770!5m2!1sen!2ske',
  socials: {
    instagram: 'https://www.instagram.com/advablissresort',
    facebook: 'https://www.facebook.com/advablissresort',
    twitter: 'https://twitter.com/advablissresort',
    tiktok: 'https://www.tiktok.com/@advablissresort',
    whatsapp: 'https://wa.me/254794400999',
  },
};
