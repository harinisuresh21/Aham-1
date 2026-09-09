import turmericEssenceImg from '../assets/turmeric-essence.jpeg';
import forestHoneyImg from '../assets/forest-honey.jpeg';

export const categories = [
  {
    id: "cat-1",
    name: "Turmeric",
    slug: "turmeric",
    description: "Pure, naturally sourced turmeric with high curcumin content.",
    image_url: turmericEssenceImg,
    is_active: true
  },
  {
    id: "cat-2",
    name: "Traditional Oils",
    slug: "traditional-oils",
    description: "Cold-pressed, unrefined oils made using traditional techniques.",
    image_url: "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?auto=format&fit=crop&q=80&w=800",
    is_active: true
  },
  {
    id: "cat-3",
    name: "Natural Food",
    slug: "natural-food",
    description: "Wholesome, unadulterated food products for daily nutrition.",
    image_url: forestHoneyImg,
    is_active: true
  },
  {
    id: "cat-4",
    name: "Wellness",
    slug: "wellness",
    description: "Herbal blends and traditional wellness formulations.",
    image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
    is_active: true
  }
];
