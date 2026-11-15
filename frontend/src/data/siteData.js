// ===== CENTRALISED SITE DATA — ADVABLISS RESORT RUIRU =====
import advablissEntrance from '../components/images/advabliss-entrance.webp';
import lakesideSeating from '../components/images/lakeside-seating.webp';
import ropeBridge from '../components/images/rope-bridge.webp';
import boatImg from '../components/images/boat.webp';
import bouncingCastleImg from '../components/images/bouncing-castle.webp';
import jetskiImg from '../components/images/jetski.webp';
import zipliningImg from '../components/images/ziplining.webp';
import resortPoolImg from '../components/images/resort-pool.webp';
import gardenDiningImg from '../components/images/garden-dining.webp';
import gardenBanquetImg from '../components/images/garden-banquet.webp';
import tableImg from '../components/images/table.webp';
import minigolfImg from '../components/images/minigolf.webp';

// Authentic Kenyan food photography
import nyamaChomaImg from '../components/images/nyama-choma.webp';
import nyamaChomaHalfImg from '../components/images/nyama-choma-half.webp';
import grilledTilapiaImg from '../components/images/grilled-tilapia.webp';
import chickenKienyejiImg from '../components/images/chicken-kienyeji.webp';
import beefPilauImg from '../components/images/beef-pilau.webp';
import samosasImg from '../components/images/samosas.webp';
import chickenWingsImg from '../components/images/chicken-wings.webp';
import viaziKaraiImg from '../components/images/viazi-karai.webp';
import goatWetFryImg from '../components/images/goat-wet-fry.webp';
import mukimoBeefStewImg from '../components/images/mukimo-beef-stew.webp';
import fruitPlatterImg from '../components/images/fruit-platter.webp';
import bananaFrittersImg from '../components/images/banana-fritters.webp';
import passionJuiceImg from '../components/images/passion-juice.webp';
import mangoGingerCoolerImg from '../components/images/mango-ginger-cooler.webp';
import tamarindCoolerImg from '../components/images/tamarind-cooler.webp';

// New authentic Kenyan culinary additions
import beefMishkakiImg from '../components/images/beef-mishkaki.webp';
import cassavaBitesImg from '../components/images/cassava-bites.webp';
import chickenGizzardsImg from '../components/images/chicken-gizzards.webp';
import chickenBiryaniImg from '../components/images/chicken-biryani.webp';
import coconutMahamriImg from '../components/images/coconut-mahamri.webp';
import mangoPassionPuddingImg from '../components/images/mango-passion-pudding.webp';
import tamarindGingerFizzImg from '../components/images/tamarind-ginger-fizz.webp';
import pineappleMintCoolerImg from '../components/images/pineapple-mint.jpeg';
import passionHibiscusSpritzImg from '../components/images/passion-hibiscus-spritz.webp';

// ===== NAVIGATION =====
export const NAV_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'Accommodation', id: 'accommodation' },
  { label: 'Restaurant & Bar', id: 'restaurant' },
  { label: 'Meetings & Events', id: 'events' },
  { label: 'Games & Activities', id: 'activities', hasDropdown: true },
  { label: 'Offers', id: 'offers' },
  { label: 'Virtual Tour', id: 'virtual-tour' },
  { label: 'Contact Us', id: 'contact' },
];

// ===== ACTIVITIES NAVIGATION DROPDOWN LINKS =====
export const ACTIVITIES_LINKS = [
  { id: 'swimming-pool', name: 'Swimming & Pool', target: 'activities-pool' },
  { id: 'boat-riding', name: 'Lakeside Boat Riding', target: 'activity-boat-riding' },
  { id: 'jetski', name: 'Water Sports & Jet Skiing', target: 'activity-jetski' },
  { id: 'rope-bridge', name: 'Canopy Rope Bridge', target: 'activity-rope-bridge' },
  { id: 'ziplining', name: 'Canopy Ziplining', target: 'activity-ziplining' },
  { id: 'bouncing-castles', name: "Children's Play Kingdom", target: 'activity-bouncing-castles' },
  { id: 'mini-golf', name: 'Mini Golf', target: 'activity-mini-golf' },
  { id: 'garden-swings', name: 'Garden Swings & Nature Walks', target: 'activities' },
];

// ===== ACTIVITIES NAVIGATION DROPDOWN GROUPS (Legacy) =====
export const ACTIVITIES_NAV = {
  water: [
    {
      id: 'swimming-pool',
      name: 'Swimming & Pool',
      iconName: 'Waves',
      target: 'activities-pool',
      desc: 'Crystal blue pool, tiled sun deck & changing cabanas',
    },
    {
      id: 'boat-riding',
      name: 'Lakeside Boat Riding',
      iconName: 'Anchor',
      target: 'activities',
      desc: 'Scenic leisure boat excursions on calm Ruiru waters',
    },
    {
      id: 'jetski',
      name: 'Water Sports & Jet Skiing',
      iconName: 'Wind',
      target: 'activities',
      desc: 'Guided high-speed open-water jet ski sessions',
    },
  ],
  outdoor: [
    {
      id: 'rope-bridge',
      name: 'Canopy Rope Bridge',
      iconName: 'Compass',
      target: 'activities',
      desc: 'Elevated timber bridge crossing high above the lake',
    },
    {
      id: 'ziplining',
      name: 'Canopy Ziplining',
      iconName: 'Sparkles',
      target: 'activities',
      desc: 'Thrilling aerial zipline through mature tree canopies',
    },
    {
      id: 'bouncing-castles',
      name: 'Children’s Play Kingdom',
      iconName: 'Smile',
      target: 'activities',
      desc: 'Giant bouncing castles, obstacle runs & lawn games',
    },
    {
      id: 'garden-swings',
      name: 'Garden Swings & Nature Walks',
      iconName: 'Trees',
      target: 'activities',
      desc: 'Restful garden swings and shady botanical walkways',
    },
  ],
};

// ===== RESORT STORY / ABOUT PILLARS =====
export const RESORT_STORY = {
  headline: 'Where Botanical Calm',
  headlineAccent: 'Meets Kenyan Hospitality',
  lead: 'Set amidst tranquil waters and lush greenery in Ruiru, AdvaBliss Resort is an intimate retreat designed for unhurried stays, vibrant culinary gatherings, and landmark celebrations.',
  body: 'Whether you are escaping the city for a quiet weekend in our suites, hosting a lakeside afternoon with family, or orchestrating a 500-guest garden wedding, every corner of AdvaBliss balances natural warmth with attentive service.',
  highlights: [
    { value: 150, suffix: '+', label: 'Celebrations & Events Hosted' },
    { value: 100, suffix: '%', label: 'Memorable Experiences' },
    { value: 24, suffix: '/7', label: 'Dedicated Guest Concierge' },
  ],
};

// ===== FEATURED EVENT =====
export const FEATURED_EVENT = {
  title: 'The Afternoon Bliss Party — Season 8',
  subtitle: 'Signature Garden Showcase',
  date: new Date('2026-12-25T14:00:00'),
  location: 'AdvaBliss Resort Garden, Ruiru',
  description:
    'A refreshing retreat at Advabliss Resort, where peaceful surroundings invite guests to unwind, enjoy delicious dining, explore outdoor activities, celebrate special occasions, gather with family, and create lasting memories filled with comfort, joy, and genuine hospitality.',
  ticketUrl: 'https://theafternoonblissparty.hustlesasa.shop/',
  image: gardenBanquetImg,
};

// ===== ACCOMMODATIONS =====
export const ACCOMMODATIONS = [
  {
    id: 'standard',
    name: 'Garden View Room',
    type: 'Standard Room',
    price: 3500,
    currency: 'KES',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1000&q=80',
    description:
      'Sunlit courtyard-facing rooms appointed with crisp linens, warm timber accents, and calm garden views for a restful stay in Ruiru.',
    features: ['Free WiFi', 'Smart TV', 'En-suite bathroom'],
    capacity: 2,
    badge: 'Courtyard View',
  },
  {
    id: 'deluxe',
    name: 'Deluxe Forest Suite',
    type: 'Deluxe Room',
    price: 4500,
    currency: 'KES',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&q=80',
    description:
      'Generously proportioned suites overlooking the greenery, featuring a private lounge corner, soaking tub, and attentive room service.',
    features: ['King bed', 'Free WiFi', 'Smart TV', 'En-suite bathroom'],
    capacity: 2,
    badge: 'Most Popular',
  },
  {
    id: 'family',
    name: 'Family Paradise Suite',
    type: 'Family Room',
    price: 10000,
    currency: 'KES',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000&q=80',
    description:
      'Expansive multi-room quarters crafted for families, complete with a separate living lounge, children’s sleeping nook, and kitchenette.',
    features: ['2 bedrooms', 'Living area', "Kids' play corner", 'Kitchenette', '2 bathrooms', 'Family pool access'],
    capacity: 6,
    badge: 'Family Choice',
  },
  {
    id: 'event-stay',
    name: 'Event Stay Package',
    type: 'Event Package',
    price: 15000,
    currency: 'KES',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1000&q=80',
    description:
      'Our signature celebration residence pairing a luxury suite stay with priority event access, private dining, and dedicated concierge care.',
    features: ['Premium suite', 'Event entry x2', 'Breakfast & dinner', 'Spa access', 'Airport transfer', 'Concierge'],
    capacity: 4,
    badge: 'All-Inclusive',
  },
];

// ===== FEATURED CULINARY SHOWCASE (AUTHENTIC KENYAN FIRE & LAKESIDE CUISINE) =====
export const FEATURED_DISHES = [
  {
    id: 'nyama-choma',
    category: 'Fireside Specialty',
    name: 'Beef Nyama Choma & Kienyeji Sides',
    price: 'KSh 2,500',
    servingSize: '1 kg Platter',
    desc: 'Prime beef cuts flame-grilled slowly over charcoal embers with coarse sea salt and fresh rosemary, served with steaming white ugali, sharp kachumbari, and sautéed greens.',
    image: nyamaChomaImg,
    alt: 'Kenyan Beef Nyama Choma grilled meat platter on wooden carving board',
    details: [
      { label: 'Meat & Portion', value: 'Prime Beef · 1 kg Family Cut' },
      { label: 'Accompaniments', value: 'Traditional Ugali & Kachumbari' },
      { label: 'Grill Style', value: 'Open Charcoal Ember Roast' },
    ],
  },
  {
    id: 'grilled-tilapia',
    category: 'Lakeside Catch',
    name: 'Grilled Whole Tilapia with Ugali',
    price: 'KSh 1,450',
    servingSize: 'Whole Fish',
    desc: 'Whole fresh Lake Victoria tilapia char-grilled to golden perfection with garlic-herb butter and freshly sliced lemon, accompanied by fluffy ugali and garden kachumbari.',
    image: grilledTilapiaImg,
    alt: 'Char-grilled whole Lake Victoria tilapia with herbs and lemon on serving plate',
    details: [
      { label: 'Source', value: 'Fresh Lake Victoria Catch' },
      { label: 'Seasoning', value: 'Crushed Garlic & Garden Herbs' },
      { label: 'Accompaniments', value: 'White Ugali & Fresh Kachumbari' },
    ],
  },
  {
    id: 'chicken-kienyeji',
    category: 'Heritage Poultry',
    name: 'Chicken Kienyeji with Mukimo',
    price: 'KSh 1,350',
    servingSize: 'Portion',
    desc: 'Free-range indigenous chicken slow-braised with ripe tomatoes, sweet onions, and garden aromatics, paired with traditional Kiambu-style mukimo and aromatic pan jus.',
    image: chickenKienyejiImg,
    alt: 'Traditional roasted chicken kienyeji with garden herbs and seasoning',
    details: [
      { label: 'Poultry', value: 'Free-Range Indigenous Chicken' },
      { label: 'Accompaniments', value: 'Handmade Mukimo & Herb Jus' },
      { label: 'Preparation', value: 'Slow-Simmered Farm Stew' },
    ],
  },
  {
    id: 'beef-pilau',
    category: 'Swahili Heritage',
    name: 'Beef Pilau with Kachumbari',
    price: 'KSh 850',
    servingSize: 'Portion',
    desc: 'Fragrant long-grain basmati rice simmered in rich beef bone broth infused with whole cardamom pods, cinnamon, and cumin, served with chilled diced tomato-onion kachumbari.',
    image: beefPilauImg,
    alt: 'Aromatic Swahili beef pilau served with meat and fresh herbs on a plate',
    details: [
      { label: 'Aromatics', value: 'Whole Cardamom, Cloves & Cumin' },
      { label: 'Accompaniments', value: 'Chilled Tomato-Chili Kachumbari' },
      { label: 'Rice', value: 'Slow-Steamed Spiced Basmati' },
    ],
  },
];

// ===== PROPOSED KENYAN A LA CARTE MENU (PENDING MANAGEMENT APPROVAL) =====
// Note: All prices are draft sample prices in KES, explicitly requiring Advabliss management approval prior to final publication.
export const MENU_PRICING_METADATA = {
  currency: 'KES',
  status: 'Proposed Draft — Management Approval Pending',
  lastUpdated: '2026-11-07',
};

export const MENU_CATEGORIES = {
  starters: {
    label: 'Starters',
    note: 'Crispy street-style appetisers & bite-sized coastal favourites',
    items: [
      {
        id: 'beef-samosas',
        name: 'Beef samosas',
        desc: 'Hand-wrapped golden pastry parcels packed with spiced minced beef, fresh coriander, and garden herbs with lime dip',
        price: 'KSh 450',
        image: samosasImg,
        alt: 'Golden fried beef samosas with fresh lime and herb chutney',
      },
      {
        id: 'chicken-wings',
        name: 'Chicken wings',
        desc: 'Crisp chicken wings glazed in sweet-smoky tamarind barbecue sauce, served with mild herb dip',
        price: 'KSh 750',
        image: chickenWingsImg,
        alt: 'Crispy glazed barbecue chicken wings on serving platter',
      },
      {
        id: 'viazi-karai',
        name: 'Viazi karai',
        desc: 'Crispy coastal turmeric-battered potato wedges served with tangy coconut chutney and tamarind dip',
        price: 'KSh 450',
        image: viaziKaraiImg,
        alt: 'Crispy golden coastal turmeric-battered viazi karai potatoes',
      },
      {
        id: 'beef-mishkaki',
        name: 'Beef Mishkaki Skewers',
        desc: 'Flame-grilled tender beef cubes marinated in garlic, ginger, crushed cumin, and coastal tamarind, served with fresh lime',
        price: 'KSh 650',
        image: beefMishkakiImg,
        alt: 'Flame-grilled marinated beef mishkaki skewers on serving board',
      },
      {
        id: 'cassava-bites',
        name: 'Coastal Cassava Bites',
        desc: 'Crisp golden fried coastal cassava chunks tossed in sea salt, paprika, and lime chili, served with coconut garlic dip',
        price: 'KSh 450',
        image: cassavaBitesImg,
        alt: 'Crispy golden fried coastal cassava bites with dipping sauce',
      },
      {
        id: 'chicken-gizzards',
        name: 'Spiced Chicken Gizzards',
        desc: 'Tender chicken firigisi pan-seared with sweet onions, ripe tomatoes, diced bell peppers, and crushed coriander seeds',
        price: 'KSh 600',
        image: chickenGizzardsImg,
        alt: 'Pan-seared spiced chicken gizzards firigisi with peppers and onions',
      },
    ],
  },
  mains: {
    label: 'Main Courses',
    note: 'Charcoal-grilled nyama choma, lakefront fish & indigenous heritage stews',
    items: [
      {
        id: 'beef-nyama-choma-1kg',
        name: 'Beef nyama choma, 1 kg',
        desc: 'Prime beef ribs and cuts slow-roasted over acacia embers with sea salt, served with hot ugali and fresh kachumbari',
        price: 'KSh 2,500',
        image: nyamaChomaImg,
        alt: 'Kenyan Beef Nyama Choma 1 kg flame-grilled meat platter on carving board',
      },
      {
        id: 'beef-nyama-choma-half-kg',
        name: 'Beef nyama choma, ½ kg',
        desc: 'Tender flame-grilled seasoned beef cuts roasted to order, accompanied by fresh tomato kachumbari and warm ugali',
        price: 'KSh 1,300',
        image: nyamaChomaHalfImg,
        alt: 'Flame-grilled seasoned beef cuts sliced on board with herbs',
      },
      {
        id: 'goat-wet-fry',
        name: 'Goat wet fry with ugali',
        desc: 'Tender goat morsels pan-tossed in a fragrant reduction of sweet onions, ripe tomatoes, garlic, and garden peppers',
        price: 'KSh 1,150',
        image: goatWetFryImg,
        alt: 'Savory goat wet fry pan-tossed with ripe tomatoes, onions and peppers',
      },
      {
        id: 'grilled-tilapia',
        name: 'Grilled tilapia with ugali',
        desc: 'Whole fresh Lake Victoria tilapia char-grilled with garlic herb marinade, served with traditional ugali and kachumbari',
        price: 'KSh 1,450',
        image: grilledTilapiaImg,
        alt: 'Char-grilled whole Lake Victoria freshwater tilapia with lemon and herbs',
      },
      {
        id: 'chicken-kienyeji',
        name: 'Chicken kienyeji with mukimo',
        desc: 'Indigenous free-range chicken simmered gently in rich country broth, paired with wholesome traditional mukimo',
        price: 'KSh 1,350',
        image: chickenKienyejiImg,
        alt: 'Traditional roasted chicken kienyeji with garden herbs and seasoning',
      },
      {
        id: 'beef-pilau',
        name: 'Beef pilau with kachumbari',
        desc: 'Aromatic Swahili long-grain spiced rice simmered with tender beef chunks, cumin, and cardamom, served with fresh kachumbari',
        price: 'KSh 850',
        image: beefPilauImg,
        alt: 'Fragrant Swahili beef pilau with spiced basmati rice and fresh kachumbari',
      },
      {
        id: 'mukimo-beef-stew',
        name: 'Mukimo with beef stew',
        desc: 'Hearty Kiambu mashed potato, pumpkin leaves, maize, and peas served with slow-braised tender beef curry',
        price: 'KSh 900',
        image: mukimoBeefStewImg,
        alt: 'Traditional mukimo mash served with slow-simmered savory beef stew',
      },
      {
        id: 'chicken-biryani',
        name: 'Swahili Chicken Biryani',
        desc: 'Fragrant saffron-infused basmati rice layered with slow-braised chicken in a rich coastal yogurt, caramelized onion, and whole spice masala',
        price: 'KSh 1,250',
        image: chickenBiryaniImg,
        alt: 'Authentic Swahili chicken biryani with spiced basmati rice and braised chicken',
      },
    ],
  },
  desserts: {
    label: 'Desserts',
    note: 'Tropical fruit harvests & warm sweet homestyle treats',
    items: [
      {
        id: 'seasonal-fruit-platter',
        name: 'Seasonal fruit platter',
        desc: 'Chilled selection of sweet Rift Valley watermelon, ripe sweet pineapple, papaya, and sweet orange slices',
        price: 'KSh 450',
        image: fruitPlatterImg,
        alt: 'Chilled seasonal tropical fruit platter with fresh sliced melon and citrus',
      },
      {
        id: 'banana-fritters',
        name: 'Banana fritters',
        desc: 'Warm golden ripe banana fritters lightly dusted with cinnamon sugar, served with a gentle vanilla honey drizzle',
        price: 'KSh 400',
        image: bananaFrittersImg,
        alt: 'Golden warm banana fritters with powdered sugar and honey drizzle',
      },
      {
        id: 'coconut-mahamri',
        name: 'Coconut Mahamri with Cardamom Cream',
        desc: 'Fluffy golden Swahili triangular mahamri scented with crushed cardamom, served warm with whipped coconut cream',
        price: 'KSh 450',
        image: coconutMahamriImg,
        alt: 'Golden fluffy Swahili mahamri with cardamom sugar and coconut cream dip',
      },
      {
        id: 'mango-passion-pudding',
        name: 'Mango & Passion Fruit Pudding',
        desc: 'Silky chilled tropical mango pudding layered with fresh passion fruit coulis, wild honey drizzle, and fresh mint',
        price: 'KSh 500',
        image: mangoPassionPuddingImg,
        alt: 'Layered chilled mango and passion fruit pudding in dessert glass',
      },
    ],
  },
  drinks: {
    label: 'Signature Drinks',
    note: 'Freshly squeezed regional juices, coolers & botanical refreshments',
    items: [
      {
        id: 'fresh-passion-juice',
        name: 'Fresh passion juice',
        desc: 'Chilled, freshly pressed Murang’a sweet and tangy passion fruit juice served over ice with fresh garden mint',
        price: 'KSh 300',
        image: passionJuiceImg,
        alt: 'Freshly pressed chilled Murang’a passion fruit juice over ice',
      },
      {
        id: 'mango-ginger-cooler',
        name: 'Mango and ginger cooler',
        desc: 'Ripe seasonal mango puree blended with fiery ginger extract and freshly squeezed lime, served ice-cold',
        price: 'KSh 350',
        image: mangoGingerCoolerImg,
        alt: 'Chilled vibrant mango and spicy ginger cooler with lime and mint',
      },
      {
        id: 'tamarind-cooler',
        name: 'Tamarind cooler',
        desc: 'Traditional coastal ukwaju infusion simmered with cloves, wild honey, and served chilled over ice',
        price: 'KSh 350',
        image: tamarindCoolerImg,
        alt: 'Traditional iced coastal tamarind cooler with cloves and citrus',
      },
      {
        id: 'tamarind-ginger-fizz',
        name: 'Tamarind & Ginger Fizz',
        desc: 'Coastal ukwaju reduction shaken with fiery pressed ginger, fresh lime juice, and sparkling soda over crushed ice',
        price: 'KSh 400',
        image: tamarindGingerFizzImg,
        alt: 'Sparkling amber tamarind and ginger fizz with ice and fresh lime',
      },
      {
        id: 'pineapple-mint-cooler',
        name: 'Pineapple & Mint Cooler',
        desc: 'Freshly pressed sweet Thika pineapple muddled with garden mint leaves, lime zest, and chilled spring water',
        price: 'KSh 350',
        image: pineappleMintCoolerImg,
        alt: 'Chilled freshly pressed pineapple and mint cooler in glass',
      },
      {
        id: 'passion-hibiscus-spritz',
        name: 'Passion-Hibiscus Spritz',
        desc: 'Steeped ruby-red wild hibiscus flowers blended with tart passion fruit nectar and crisp sparkling bubbles',
        price: 'KSh 400',
        image: passionHibiscusSpritzImg,
        alt: 'Chilled ruby red passion-hibiscus spritz with ice and fresh fruit garnish',
      },
    ],
  },
};

// ===== EVENTS & MEETINGS =====
export const EVENT_TYPES = [
  {
    id: 'wedding',
    highlights: ["Open-sky ceremony lawns", "Evening reception under warm lighting", "Dedicated event coordinator"],
    minGuests: 20,
    maxGuests: 500,
    iconName: 'Heart',
    name: 'Weddings',
    capacity: '20–500 guests',
    desc: 'Exchange vows beneath open skies on our manicured grounds, followed by an unforgettable reception under warm evening lights.',
  },
  {
    id: 'corporate',
    highlights: ["Modern audiovisual technology", "Breakout pergolas for sessions", "Full catering available"],
    minGuests: 10,
    maxGuests: 300,
    iconName: 'Briefcase',
    name: 'Corporate Events',
    capacity: '10–300 guests',
    desc: 'Purpose-built conference and executive retreat spaces equipped with modern audiovisual technology, breakout pergolas, and full catering.',
  },
  {
    id: 'private',
    highlights: ["Garden pavilions & waterside lounges", "Birthdays, graduations & reunions", "Flexible, intimate layouts"],
    minGuests: 10,
    maxGuests: 200,
    iconName: 'Sparkles',
    name: 'Private Parties',
    capacity: '10–200 guests',
    desc: 'Intimate garden pavilions and waterside lounges tailored for milestone birthdays, graduations, anniversaries, and family reunions.',
  },
  {
    id: 'garden',
    highlights: ["Exclusive hire of the resort grounds", "Concerts, festivals & showcases", "Suited to large outdoor productions"],
    minGuests: 50,
    maxGuests: 1000,
    iconName: 'Trees',
    name: 'Garden Hire',
    capacity: '50–1000 guests',
    desc: 'Exclusive private hire of our expansive resort grounds for concerts, cultural showcases, festivals, and large-scale outdoor productions.',
  },
];

// Currency helper — Kenyan Shillings, e.g. KSh 1,200
export const formatKSh = (amount) =>
  `KSh ${Number(amount || 0).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

export const EVENT_ADDONS = [
  { id: 'tent', iconName: 'Tent', name: 'Marquee Tent', price: 400 },
  { id: 'decor', iconName: 'Flower2', name: 'Floral Decorations', price: 250 },
  { id: 'sound', iconName: 'Volume2', name: 'Sound System', price: 300 },
  { id: 'dj', iconName: 'Music', name: 'Professional DJ', price: 500 },
  { id: 'lighting', iconName: 'Lightbulb', name: 'Ambient Lighting', price: 350 },
  { id: 'catering', iconName: 'UtensilsCrossed', name: 'Full Catering', price: 1200 },
];

// ===== ACTIVITIES =====
export const ACTIVITIES = [
  {
    id: 'swimming-pool',
    iconName: 'Waves',
    name: 'Resort Swimming Pool & Sun Deck',
    image: resortPoolImg,
    desc: 'Unwind by our outdoor swimming pool framed by pine trees, featuring a tiled sun deck, poolside loungers, and dedicated changing facilities.',
    duration: 'Full Day Leisure',
    ageMin: 3,
    price: null,
  },
  {
    id: 'rope-bridge',
    iconName: 'Compass',
    name: 'Rope Bridge Adventure',
    image: ropeBridge,
    desc: 'Cross our elevated timber suspension bridge suspended directly over the water — an exhilarating balance challenge with scenic views across the lake.',
    duration: '30–45 min',
    ageMin: 8,
    price: null,
  },
  {
    id: 'boat-riding',
    iconName: 'Anchor',
    name: 'Lakeside Boat Riding',
    image: boatImg,
    desc: 'Glide across the calm waters on guided leisure boat rides and sightseeing excursions right from the AdvaBliss waterfront dock.',
    duration: '30–60 min',
    ageMin: 4,
    price: 25,
  },
  {
    id: 'jetski',
    iconName: 'Wind',
    name: 'Water Sports & Jet Skiing',
    image: jetskiImg,
    desc: 'Feel the thrill of speed on the open water with guided jet skiing and watercraft experiences under expert safety supervision.',
    duration: '20–30 min',
    ageMin: 12,
    price: 35,
  },
  {
    id: 'ziplining',
    iconName: 'Compass',
    name: 'Canopy Ziplining',
    image: zipliningImg,
    desc: 'Soar through the woodland tree canopy on our guided aerial zipline course with panoramic views across the resort and waterside.',
    duration: '45 min',
    ageMin: 6,
    price: 20,
  },
  {
    id: 'bouncing-castles',
    iconName: 'Smile',
    name: 'Children’s Play Kingdom',
    image: bouncingCastleImg,
    desc: 'Supervised giant bouncing castles, inflatable obstacle runs, and fun garden lawn games keeping younger guests thrilled all day.',
    duration: 'Unlimited pass',
    ageMin: 2,
    price: 15,
  },
  {
    id: 'mini-golf',
    iconName: 'Flag',
    name: 'Mini Golf',
    image: minigolfImg,
    desc: 'Enjoy a friendly putting challenge with family and friends in a relaxed resort setting.',
    duration: null,
    ageMin: null,
    price: null,
    featured: true,
  },
];

// ===== OFFERS =====
export const OFFERS = [
  {
    id: 'garden-retreat',
    tag: 'Weekend Escape',
    title: 'Garden Retreat Package',
    desc: "Two restorative nights in our Deluxe Forest Suite with daily breakfast, a couples' spa ritual, and a candlelit garden dinner.",
    image: lakesideSeating,
    originalPrice: 860,
    salePrice: 649,
    validity: 'Valid through September 2025',
    includes: ['2 nights Deluxe Suite', 'Daily breakfast', 'Couples spa', 'Private dinner', 'Late checkout'],
    badge: 'Save 25%',
  },
  {
    id: 'business-leisure',
    tag: 'Corporate Deal',
    title: 'Business & Leisure Bundle',
    desc: 'Full-day executive conference room with AV technology, chef-prepared lunch for up to 20 delegates, overnight stay, and evening sundowners.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&q=80',
    originalPrice: 1200,
    salePrice: 899,
    validity: 'Weekdays only',
    includes: ['Full-day venue', 'AV equipment', 'Lunch buffet', '1 night stay', 'Cocktail hour'],
    badge: 'Save 25%',
  },
  {
    id: 'family-adventure',
    tag: 'Family Fun',
    title: 'Family Adventure Package',
    desc: 'Three nights in the Family Paradise Suite with daily breakfast, full-day children’s activity passes, and a private sunset boat ride.',
    image: bouncingCastleImg,
    originalPrice: 1540,
    salePrice: 1099,
    validity: 'School holidays only',
    includes: ['3 nights Family Suite', 'Daily breakfast', 'Kids activities pass', 'Boat ride', 'Pool access'],
    badge: 'Save 29%',
  },
  {
    id: 'wedding-dream',
    tag: 'Celebration',
    title: 'Wedding Dream Package',
    desc: 'Complete wedding celebration including exclusive garden venue hire, bespoke floral styling, banquet catering for 100 guests, and bridal suite stay.',
    image: gardenBanquetImg,
    originalPrice: 8500,
    salePrice: 6999,
    validity: 'Limited dates available',
    includes: ['Garden venue', 'Floral decor', 'Catering x100', 'Sound & lighting', 'Bridal suite', 'Honeymoon breakfast'],
    badge: 'Save 18%',
  },
];

// ===== VIRTUAL TOUR SPACES =====
export const TOUR_SPACES = [
  {
    id: 'lakeside',
    name: 'Lakeside Canopy & Waterfront Lounge',
    category: 'Waterfront Experience',
    desc: 'Breezy waterside red leather seating under shaded canopies overlooking the calm lake where leisure speedboats glide by.',
    image: lakesideSeating,
    thumb: lakesideSeating,
  },
  {
    id: 'entrance',
    name: 'Grand Resort Entrance & Gates',
    category: 'Arrival Experience',
    desc: 'The welcoming entrance gates of AdvaBliss Resort Ruiru framed by lush palm fronds, terracotta pillars, and native flora.',
    image: advablissEntrance,
    thumb: advablissEntrance,
  },
  {
    id: 'pool',
    name: 'Resort Swimming Pool & Sun Deck',
    category: 'Pool & Wellness',
    desc: 'Outdoor swimming pool surrounded by manicured grounds and pine woodlands, with tiled sun deck and changing facilities.',
    image: resortPoolImg,
    thumb: resortPoolImg,
  },
  {
    id: 'rope-bridge',
    name: 'Suspension Rope Bridge & Canopy',
    category: 'Outdoor Adventure',
    desc: 'Elevated timber suspension rope bridge suspended over water, flanked by mature trees and verdant shoreline greenery.',
    image: ropeBridge,
    thumb: ropeBridge,
  },
  {
    id: 'dining-gazebos',
    name: 'The Garden Room & Courtyard Gazebos',
    category: 'Fine Dining',
    desc: 'Courtyard dining gazebos with trellis woodwork, garden walkways, and intimate seating surrounded by lush palms.',
    image: gardenDiningImg,
    thumb: gardenDiningImg,
  },
  {
    id: 'events',
    name: 'Terrace Banquet & Event Pavilion',
    category: 'Celebrations',
    desc: 'Versatile open-air banquet canopy tent with red linens, buffet serving station, and expansive manicured lawn.',
    image: gardenBanquetImg,
    thumb: gardenBanquetImg,
  },
];

// ===== TESTIMONIALS =====
export const TESTIMONIALS = [
  {
    name: 'Alex',
    initials: 'AL',
    occasion: 'Wedding Celebration · March 2025',
    text: "Our wedding at AdvaBliss was nothing short of magical. Every detail was flawless, the garden was breathtaking, and the team made us feel like royalty. We'll cherish it forever.",
    rating: 5,
  },
  {
    name: 'Joan Mwangi',
    initials: 'JM',
    occasion: 'Corporate Retreat · January 2025',
    text: 'Exceptional facilities, impeccable service, and stunning surroundings. Our annual leadership retreat has found its permanent home at AdvaBliss Resort.',
    rating: 4,
  },
  {
    name: 'Priya Sharma',
    initials: 'PS',
    occasion: 'Family Vacation · December 2024',
    text: 'The kids had an absolute blast with the activities, and my husband and I could actually relax! The family suite was incredible — spacious, elegant, and wonderfully child-friendly.',
    rating: 5,
  },
];

// ===== VERIFIED CONTACT INFORMATION =====
export const CONTACT_INFO = {
  phone: '+254 794400999',
  phoneDisplay: '0748935428',
  hotline: '0748 935 428',
  email: 'reservations@advabliss.com',
  address: 'AdvaBliss Resort, Ruiru, Kenya',
  mapUrl: 'https://maps.app.goo.gl/uw4TgQESMfe4Rv4D9',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0501158711777!2d36.98272729217!3d-1.1243627633298694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f47e41be760f5%3A0x599e3009d5521fb1!2sAdvabliss%20resort!5e0!3m2!1sen!2ske!4v1779271387770!5m2!1sen!2ske',
  socials: {
    instagram: 'https://www.instagram.com/advablissresort',
    facebook: 'https://www.facebook.com/advablissresort',
    twitter: 'https://twitter.com/advablissresort',
    tiktok: 'https://www.tiktok.com/@advablissresort',
    whatsapp: 'https://wa.me/254794400999',
  },
};
