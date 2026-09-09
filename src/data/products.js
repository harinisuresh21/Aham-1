import turmericBottleImg from '../assets/hero-product-desktop.png';
import turmericEssenceImg from '../assets/turmeric-essence.jpeg';
import forestHoneyImg from '../assets/forest-honey.jpeg';

export const products = [
  {
    id: "prod-1",
    category_id: "cat-1",
    category_name: "Turmeric",
    name: "Aham Natural Turmeric Powder",
    slug: "aham-natural-turmeric-powder",
    description: "Sourced directly from organic farms in Erode, this premium turmeric powder retains its natural oils and 5.2%+ high curcumin content. Perfect for daily cooking, golden milk, and traditional wellness rituals.",
    short_description: "Pure, high-curcumin natural turmeric powder with intact essential oils.",
    price: 399,
    compare_at_price: 499,
    stock_quantity: 100,
    sku: "AHM-TUR-250",
    unit: "g",
    weight: "250g",
    is_active: true,
    is_featured: true,
    rating: 4.8,
    reviewCount: 124,
    tags: ["100% Organic", "FSSAI Certified", "Single Origin", "No Preservatives"],
    images: [
      { id: "img-1", url: turmericEssenceImg, is_primary: true },
      { id: "img-1-bottle", url: turmericBottleImg, is_primary: false }
    ]
  },
  {
    id: "prod-2",
    category_id: "cat-2",
    category_name: "Traditional Oils",
    name: "Cold-Pressed Sesame Oil (Mara Chekku)",
    slug: "cold-pressed-sesame-oil",
    description: "Extracted using traditional wooden churners (Mara Chekku) running below 35°C. Unrefined, unbleached, and rich in natural sesamol antioxidants.",
    short_description: "Traditional wooden cold-pressed black sesame oil.",
    price: 450,
    compare_at_price: null,
    stock_quantity: 50,
    sku: "AHM-OIL-SES-500",
    unit: "ml",
    weight: "500ml",
    is_active: true,
    is_featured: true,
    rating: 4.9,
    reviewCount: 89,
    tags: ["100% Organic", "Cold Pressed", "FSSAI Certified", "Single Origin"],
    images: [
      { id: "img-2", url: "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?auto=format&fit=crop&q=80&w=800", is_primary: true }
    ]
  },
  {
    id: "prod-3",
    category_id: "cat-3",
    category_name: "Natural Food",
    name: "Raw Wild Forest Honey",
    slug: "wild-forest-honey",
    description: "Raw, unfiltered nectar gathered from deep Western Ghats forest canopies. Contains natural pollen, enzymes, and zero added sugars.",
    short_description: "Pure, raw, unfiltered multifloral forest honey.",
    price: 650,
    compare_at_price: 750,
    stock_quantity: 25,
    sku: "AHM-HON-500",
    unit: "g",
    weight: "500g",
    is_active: true,
    is_featured: true,
    rating: 4.7,
    reviewCount: 56,
    tags: ["100% Organic", "FSSAI Certified", "No Preservatives", "Single Origin"],
    images: [
      { id: "img-3", url: forestHoneyImg, is_primary: true }
    ]
  },
  {
    id: "prod-4",
    category_id: "cat-4",
    category_name: "Wellness",
    name: "Pure Ashwagandha Root Powder",
    slug: "ashwagandha-root-powder",
    description: "Ancient adaptogenic root formulated to calm stress and restore vitality. Harvested at full seasonal maturity and slowly shade-dried without sulphur.",
    short_description: "Premium shade-dried Ashwagandha root powder with high withanolides.",
    price: 499,
    compare_at_price: 599,
    stock_quantity: 30,
    sku: "AHM-ASH-150",
    unit: "g",
    weight: "150g",
    is_active: true,
    is_featured: true,
    rating: 4.6,
    reviewCount: 42,
    tags: ["100% Organic", "FSSAI Certified", "No Preservatives"],
    images: [
      { id: "img-4", url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800", is_primary: true }
    ]
  },
  {
    id: "prod-5",
    category_id: "cat-2",
    category_name: "Traditional Oils",
    name: "Virgin Cold-Pressed Coconut Oil",
    slug: "virgin-cold-pressed-coconut-oil",
    description: "Extracted from fresh, mature coastal coconuts within hours of harvesting. Light, aromatic, and excellent for daily cooking and body abhyanga.",
    short_description: "Unrefined extra virgin cold-pressed coconut oil.",
    price: 380,
    compare_at_price: 450,
    stock_quantity: 45,
    sku: "AHM-OIL-COC-500",
    unit: "ml",
    weight: "500ml",
    is_active: true,
    is_featured: false,
    rating: 4.9,
    reviewCount: 68,
    tags: ["100% Organic", "Cold Pressed", "FSSAI Certified", "Single Origin"],
    images: [
      { id: "img-5", url: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800", is_primary: true }
    ]
  },
  {
    id: "prod-6",
    category_id: "cat-4",
    category_name: "Wellness",
    name: "Organic Triphala Powder",
    slug: "organic-triphala-powder",
    description: "Classic tri-doshic blend of Amalaki, Haritaki, and Bibhitaki fruits. Promotes digestive harmony, gut vitality, and natural detoxification.",
    short_description: "Pure three-fruit Ayurvedic digestive rejuvenation blend.",
    price: 349,
    compare_at_price: 399,
    stock_quantity: 0, // Out of stock example
    sku: "AHM-WEL-TRI-200",
    unit: "g",
    weight: "200g",
    is_active: true,
    is_featured: false,
    rating: 4.8,
    reviewCount: 31,
    tags: ["100% Organic", "FSSAI Certified", "No Preservatives"],
    images: [
      { id: "img-6", url: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=800", is_primary: true }
    ]
  }
];
