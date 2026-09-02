import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { 
  Leaf, 
  Sun, 
  Droplet, 
  ShieldCheck, 
  Heart, 
  Award, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Sprout,
  Compass
} from 'lucide-react';

const philosophyCards = [
  {
    icon: Droplet,
    title: 'Wooden Mara Chekku Extraction',
    subtitle: 'Cold-Pressed without Heat or Solvents',
    description:
      'We extract our sesame, groundnut, and coconut oils using traditional wooden churners (Mara Chekku) running below 35°C, preserving 100% of natural antioxidants and therapeutic aroma.',
    badge: 'Ancestral Method',
    image: 'https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: Sun,
    title: 'High-Curcumin Single-Origin Turmeric',
    subtitle: 'Harvested from Native Organic Soils',
    description:
      'Grown in the mineral-rich soils of Erode and Salem, our turmeric is slow shade-dried and stone-ground, yielding an exceptional 5.2%+ natural curcumin potency with intact essential oils.',
    badge: '5.2%+ Curcumin',
    image: 'https://images.unsplash.com/photo-1615486171448-4fd325a8ee58?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: Sprout,
    title: 'Raw Forest Wild Honey',
    subtitle: 'Non-Destructive Indigenous Harvesting',
    description:
      'Unpasteurized, unprocessed, and non-irradiated honey gathered from deep Nilgiri forest blooms. Rich in natural bee pollen, enzymes, and deep floral notes.',
    badge: 'Raw & Active',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89134a5d?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: Compass,
    title: 'Whole-Root Ayurvedic Botanicals',
    subtitle: 'Hand-Selected for Bioactive Potency',
    description:
      'From wild Ashwagandha to Brahmi, our adaptogens are harvested strictly during their peak seasonal cycle, dried without sulphur, and finely micro-milled.',
    badge: 'Zero Additives',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
  },
];

const ingredientsList = [
  {
    name: 'Wild Curcuma Longa',
    origin: 'Erode, Tamil Nadu',
    benefit: 'Cellular rejuvenation & anti-inflammatory potency',
    standard: '100% Pure Rhizome',
  },
  {
    name: 'Cold-Pressed Sesamum Indicum',
    origin: 'Villupuram, Tamil Nadu',
    benefit: 'Skin barrier nourishment & deep cellular lipid support',
    standard: 'First Cold Pressing',
  },
  {
    name: 'Grade-A Ashwagandha Root',
    origin: 'Madhya Pradesh Organic Belt',
    benefit: 'Cortisol regulation & adaptogenic vitality',
    standard: 'Shade Dried',
  },
  {
    name: 'Wild Multifloral Nectar',
    origin: 'Western Ghats Forest Reserve',
    benefit: 'Living probiotic enzymes & daily immune resilience',
    standard: 'Unfiltered & Raw',
  },
];

const stats = [
  { value: '500+', label: 'Organic Farming Partners' },
  { value: '100%', label: 'Chemical & Hexane Free' },
  { value: '45,000+', label: 'Conscious Homes Nourished' },
  { value: '0', label: 'Synthetic Additives' },
];

const About = () => {
  return (
    <div className="bg-brand-cream-light min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-brand-border bg-gradient-to-b from-brand-cream to-brand-cream-light">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-widest mb-6">
              <Leaf size={14} className="text-brand-primary" />
              Our Heritage & Mission
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-primary font-bold leading-tight mb-6">
              Rooted in Nature, <br />
              <span className="italic font-normal text-brand-accent">Guided by Tradition.</span>
            </h1>

            <p className="text-lg lg:text-xl text-brand-charcoal/80 font-sans leading-relaxed mb-8">
              At <strong>AHAM</strong>, we revive timeless wellness knowledge from ancient Vedic traditions. We craft pure, unadulterated essentials directly from organic soil to your daily rituals—honoring the Earth, the farmer, and your body.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-brand-charcoal uppercase tracking-wider">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 border border-brand-border shadow-sm rounded-sm">
                <CheckCircle2 size={16} className="text-green-700" />
                100% Single Origin
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 border border-brand-border shadow-sm rounded-sm">
                <CheckCircle2 size={16} className="text-green-700" />
                Zero Chemical Solvents
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 border border-brand-border shadow-sm rounded-sm">
                <CheckCircle2 size={16} className="text-green-700" />
                Traditional Wooden Pressing
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Brand Story & Origin Section */}
      <section className="py-20 lg:py-28 bg-white border-b border-brand-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Story Visual */}
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-square bg-brand-cream border border-brand-border overflow-hidden rounded-sm shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1200"
                  alt="Traditional Ayurvedic roots and preparation"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating Quote Badge */}
              <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:-right-6 bg-brand-primary text-white p-6 max-w-xs shadow-xl border border-brand-accent/30 rounded-sm">
                <p className="font-serif italic text-base sm:text-lg mb-2">
                  "Food is medicine when harvested with reverence and consumed with awareness."
                </p>
                <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold block">
                  — The Ayurvedic Philosophy
                </span>
              </div>
            </div>

            {/* Story Text */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-2 block">
                The Essence of AHAM
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-brand-primary mb-6 leading-snug">
                Where Ancient Wisdom Meets Pure, Conscious Living
              </h2>
              <div className="space-y-4 text-brand-charcoal/80 text-base leading-relaxed font-sans">
                <p>
                  In Sanskrit, <strong>AHAM (अहम्)</strong> signifies the authentic self—the harmonious connection between inner vitality and nature's generous gifts.
                </p>
                <p>
                  Modern industrialization replaced slow, mindful techniques with high-heat commercial processing, chemical bleaching, and synthetic additives. We set out to change that.
                </p>
                <p>
                  Every jar of AHAM turmeric, every bottle of cold-pressed oil, and every grain of root powder is handcrafted in small batches using the exact artisan techniques passed down through generations of rural farmers.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-brand-border grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-serif text-xl text-brand-primary font-bold mb-1">Single-Origin</h4>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Traceable directly to native farms without blending or dilution.
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-xl text-brand-primary font-bold mb-1">Zero Waste</h4>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Eco-friendly glass and compostable packaging from source to your home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Traditional Sourcing Philosophy Cards */}
      <section className="py-20 lg:py-28 bg-brand-cream-light border-b border-brand-border">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2 block">
              Ethical & Timeless Processes
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-primary font-bold mb-4">
              Our Sourcing & Craft Philosophy
            </h2>
            <p className="text-brand-muted text-base leading-relaxed">
              We never cut corners. We preserve ancient methods to safeguard the life force (Prana) of every ingredient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {philosophyCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-brand-border p-8 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider bg-brand-cream px-3 py-1 text-brand-charcoal border border-brand-border/60">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif text-brand-primary font-semibold mb-2 group-hover:text-brand-secondary transition-colors">
                      {card.title}
                    </h3>
                    <h4 className="text-xs font-semibold text-brand-accent uppercase tracking-wider mb-4">
                      {card.subtitle}
                    </h4>

                    <p className="text-sm text-brand-charcoal/80 leading-relaxed mb-6 font-sans">
                      {card.description}
                    </p>
                  </div>

                  <div className="aspect-[16/9] bg-brand-cream overflow-hidden border border-brand-border/60 mt-auto">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Pure Ingredients Highlight Grid */}
      <section className="py-20 lg:py-28 bg-white border-b border-brand-border">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-2 block">
              Uncompromising Quality Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-brand-primary font-bold mb-4">
              What Goes In & What Stays Out
            </h2>
            <p className="text-brand-muted text-base leading-relaxed">
              We test every batch for purity, heavy metals, and active therapeutic constituents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {ingredientsList.map((item, index) => (
              <div
                key={index}
                className="bg-brand-cream/30 border border-brand-border p-6 rounded-sm hover:border-brand-primary transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-brand-accent uppercase tracking-widest block mb-1">
                    {item.origin}
                  </span>
                  <h4 className="text-lg font-serif text-brand-primary font-semibold mb-3">
                    {item.name}
                  </h4>
                  <p className="text-xs text-brand-charcoal/80 leading-relaxed mb-4">
                    {item.benefit}
                  </p>
                </div>
                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted font-medium">
                  <span>Grade:</span>
                  <strong className="text-brand-primary">{item.standard}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Matrix Box */}
          <div className="bg-brand-cream-light border border-brand-border p-8 lg:p-12 shadow-sm rounded-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <h3 className="text-2xl font-serif text-brand-primary font-bold mb-2 flex items-center gap-2">
                  <CheckCircle2 size={24} className="text-green-700" />
                  The AHAM Promise
                </h3>
                <ul className="space-y-2.5 text-sm text-brand-charcoal font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                    100% pure cold-pressed oils from Mara Chekku
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                    Natural curcumin retained without chemical separation
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                    Raw forest honey without adulterated invert sugars
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                    Fair wages and long-term security for native growers
                  </li>
                </ul>
              </div>

              <div className="space-y-3 md:border-l md:border-brand-border md:pl-8">
                <h3 className="text-2xl font-serif text-brand-charcoal font-bold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-sm flex items-center justify-center font-sans font-bold">✕</span>
                  What We Never Use
                </h3>
                <ul className="space-y-2.5 text-sm text-brand-muted">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    No Hexane, mineral oils, or solvent extractions
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    No artificial aromas, fragrances, or preservatives
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    No commercial pasteurization or micro-filtration
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    No synthetic chemical fertilizers or pesticides
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Metrics & Community Impact */}
      <section className="py-16 lg:py-24 bg-brand-cream border-b border-brand-border">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-4">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Dark Forest Green Call to Action */}
      <section className="py-20 lg:py-28 bg-brand-primary text-white relative overflow-hidden">
        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="text-xs uppercase tracking-widest text-brand-accent font-bold mb-4 block">
              Experience Authentic Wellness
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 text-brand-cream-light leading-tight">
              Begin Your Journey to Natural Living
            </h2>

            <p className="text-base sm:text-lg text-brand-cream/80 leading-relaxed font-sans mb-10">
              Discover our curated range of authentic cold-pressed oils, high-curcumin organic turmeric, raw forest honey, and restorative herbal adaptogens.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  variant="accent"
                  className="w-full sm:w-auto px-8 text-base text-brand-charcoal font-semibold gap-2 shadow-lg"
                >
                  <span>Explore All Products</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 text-base border-white text-white hover:bg-white/10"
                >
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default About;
