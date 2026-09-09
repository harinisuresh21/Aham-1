import React, { useState } from 'react';
import Container from '../components/layout/Container';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  Leaf,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  CalendarCheck,
  ChevronDown
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Bespoke Social Icons
const InstagramIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
  </svg>
);

const subjects = [
  'Ayurvedic Dosha Consultation & Guidance',
  'Order Status & Tracking Inquiry',
  'Product Formulations & Herb Sourcing',
  'Returns, Replacements & Refunds',
  'Wholesale & Wellness Partnership',
  'General Inquiry & Feedback'
];

const contactCards = [
  {
    id: 'email',
    title: 'Customer Care & Consultation',
    primary: 'support@aham.in',
    secondary: 'consult@aham.in',
    actionText: 'Write to us',
    actionHref: 'mailto:support@aham.in',
    note: 'Average response time: 2–4 business hours',
    icon: Mail,
    copyValue: 'support@aham.in',
  },
  {
    id: 'phone',
    title: 'Ayurvedic Helpline',
    primary: '+91 80 4567 8900',
    secondary: '+91 80 4567 8901 (Toll Free)',
    actionText: 'Call now',
    actionHref: 'tel:+918045678900',
    note: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
    icon: Phone,
    copyValue: '+918045678900',
  },
  {
    id: 'location',
    title: 'Sanctuary & Flagship Store',
    primary: 'AHAM Natural Wellness Pvt. Ltd.',
    address: 'No. 14, 2nd Floor, Heritage Craft House, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038, India',
    actionText: 'Get Directions',
    actionHref: 'https://www.google.com/maps/place/Indiranagar,+Bengaluru,+Karnataka+560038',
    note: 'Personal consultations by appointment',
    icon: MapPin,
  },
  {
    id: 'hours',
    title: 'Experience Center Hours',
    primary: 'Mon – Saturday: 9:30 AM – 7:30 PM',
    secondary: 'Sunday: 10:00 AM – 2:00 PM (Apothecary Only)',
    note: 'Closed on national gazetted holidays',
    icon: Clock,
  },
];

const Contact = () => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: subjects[0],
    preferredMethod: 'email',
    message: '',
  });

  const [copiedId, setCopiedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionReference, setSubmissionReference] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`Copied ${text} to clipboard!`, 'Copied');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please complete all required fields.', 'Incomplete Form');
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury API call with realistic latency
    setTimeout(() => {
      const refId = `AHAM-CARE-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionReference(refId);
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(
        'Your wellness inquiry has been dispatched to our Ayurvedic panel.',
        'Inquiry Received'
      );
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: subjects[0],
      preferredMethod: 'email',
      message: '',
    });
    setSubmitted(false);
    setSubmissionReference('');
  };

  return (
    <div className="relative bg-[#FDFAF5] min-h-screen text-[#2A2A2A] overflow-hidden selection:bg-[#C2A573]/20 selection:text-[#2C422F]">
      {/* Background Organic Shapes & Ambient Glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#6A7E64]/10 to-[#C2A573]/15 blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/3 -left-48 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#2C422F]/5 via-[#C2A573]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full bg-[#6A7E64]/10 blur-3xl" />

        {/* Subtle Decorative Botanical Motif Lines */}
        <svg
          className="absolute top-12 right-6 lg:right-24 w-72 h-72 text-[#2C422F]/[0.03]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M100 10 C60 50, 40 90, 40 140 A60 60 0 0 0 160 140 C160 90, 140 50, 100 10 Z" />
          <path d="M100 30 L100 160" />
          <path d="M100 70 C80 85, 70 105, 65 120" />
          <path d="M100 90 C120 105, 130 125, 135 140" />
          <path d="M100 110 C85 120, 80 135, 75 148" />
        </svg>
      </div>

      {/* 1. HERO HEADER SECTION */}
      <section className="relative pt-12 pb-14 lg:pt-20 lg:pb-16 border-b border-[#E8E3D7]/60">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {/* Elegant Luxury Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#C2A573]/40 shadow-sm text-xs uppercase tracking-[0.2em] font-semibold text-[#2C422F] transition-transform hover:scale-105 duration-300">
              <span className="flex h-2 w-2 rounded-full bg-[#C2A573] animate-ping" />
              <Leaf size={13} className="text-[#2C422F]" />
              <span>We'd Love to Hear From You</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2C422F] font-medium tracking-tight leading-[1.15]">
              Let’s Nurture Your Path to <span className="italic font-serif font-normal text-[#8B5E3C]">Holistic Balance</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#6B6B6B] font-light max-w-2xl mx-auto leading-relaxed">
              Whether you seek bespoke Ayurvedic consultations, insight into our ethically harvested herbs, or assistance with your orders, our team of traditional vaidyas and customer care specialists is at your service.
            </p>

            {/* Quick Stat Pill Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#2C422F]/80 font-medium">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2C422F]/5 border border-[#2C422F]/10">
                <Sparkles size={14} className="text-[#C2A573]" />
                <span>Certified Ayurvedic Vaidya Panel</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2C422F]/5 border border-[#2C422F]/10">
                <Clock size={14} className="text-[#C2A573]" />
                <span>Typical Response &lt; 4 Hours</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2C422F]/5 border border-[#2C422F]/10">
                <ShieldCheck size={14} className="text-[#C2A573]" />
                <span>100% Confidential & Secure</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. MAIN INTERACTIVE 2-COLUMN SPLIT SECTION */}
      <section className="relative py-12 lg:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* ======================================================== */}
            {/* LEFT COLUMN: Modern Interactive Form Card & Community (7 cols) */}
            {/* ======================================================== */}
            <div className="lg:col-span-7 space-y-8">
              {/* Form Card */}
              <div className="group relative rounded-3xl bg-white/85 backdrop-blur-xl border border-[#E8E3D7] p-6 sm:p-10 shadow-[0_12px_40px_-15px_rgba(44,66,47,0.07)] hover:shadow-[0_20px_50px_-15px_rgba(44,66,47,0.12)] transition-all duration-500">
                {/* Subtle Card Accent Bar */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#C2A573]/60 to-transparent rounded-full" />

                {/* Form Header */}
                <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E3D7]/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2C422F] to-[#3B573F] text-white flex items-center justify-center shadow-md shadow-[#2C422F]/20">
                      <MessageSquare size={22} className="text-[#F9F7F1]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif text-[#2C422F] font-semibold tracking-tight">
                        Send Us a Message
                      </h2>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">
                        Direct communication with our concierge & medical advisory desk
                      </p>
                    </div>
                  </div>

                  {/* Operational Status Dot */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-medium text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Desk Online</span>
                  </div>
                </div>

                {submitted ? (
                  /* Form Submission Success State */
                  <div className="text-center py-10 sm:py-14 animate-content-enter space-y-6">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-[#2C422F]/10 flex items-center justify-center text-[#2C422F] animate-bounce" style={{ animationDuration: '2s' }}>
                        <CheckCircle2 size={44} className="text-[#2C422F]" />
                      </div>
                      <Sparkles size={22} className="absolute -top-1 -right-1 text-[#C2A573]" />
                    </div>

                    <div className="space-y-2 max-w-lg mx-auto">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#C2A573]">
                        Inquiry Confirmed
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-[#2C422F] font-bold">
                        Namaste, {formData.name || 'Valued Guest'}
                      </h3>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">
                        Your message has been securely delivered. An Ayurvedic advisor has been assigned to your query and will respond to <strong className="text-[#2A2A2A] font-medium">{formData.email}</strong> within 24 hours.
                      </p>
                    </div>

                    {/* Reference Ticket Card */}
                    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#F9F7F1] border border-[#E8E3D7] text-xs text-[#2A2A2A]">
                      <span className="text-[#6B6B6B]">Reference ID:</span>
                      <code className="font-mono font-bold text-[#2C422F] bg-white px-2 py-0.5 rounded border border-[#E8E3D7]">
                        {submissionReference}
                      </code>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border-2 border-[#2C422F] text-[#2C422F] hover:bg-[#2C422F] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                      >
                        <Send size={15} /> Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  /* The Interactive Form */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name Input */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="fullName"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]"
                        >
                          Full Name <span className="text-[#8B5E3C]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="fullName"
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Radhika Sharma"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E3D7] bg-white/80 text-sm text-[#2A2A2A] placeholder:text-[#6B6B6B]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C422F] focus:border-transparent transition-all duration-200 shadow-sm"
                          />
                        </div>
                      </div>

                      {/* Email Input */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="emailAddress"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]"
                        >
                          Email Address <span className="text-[#8B5E3C]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="emailAddress"
                            type="email"
                            name="email"
                            required
                            placeholder="name@domain.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E3D7] bg-white/80 text-sm text-[#2A2A2A] placeholder:text-[#6B6B6B]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C422F] focus:border-transparent transition-all duration-200 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Phone & Subject Dropdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Phone Input (Optional) */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="phoneNumber"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]"
                        >
                          Phone / WhatsApp <span className="text-[#6B6B6B] font-normal normal-case">(Optional)</span>
                        </label>
                        <div className="relative">
                          <input
                            id="phoneNumber"
                            type="tel"
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 rounded-xl border border-[#E8E3D7] bg-white/80 text-sm text-[#2A2A2A] placeholder:text-[#6B6B6B]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C422F] focus:border-transparent transition-all duration-200 shadow-sm"
                          />
                        </div>
                      </div>

                      {/* Subject Selection */}
                      <div className="space-y-1.5">
                        <label
                          htmlFor="inquirySubject"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]"
                        >
                          Inquiry Subject <span className="text-[#8B5E3C]">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="inquirySubject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 pr-10 rounded-xl border border-[#E8E3D7] bg-white/80 text-sm text-[#2A2A2A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C422F] focus:border-transparent transition-all duration-200 shadow-sm appearance-none cursor-pointer"
                          >
                            {subjects.map((sub, idx) => (
                              <option key={idx} value={sub}>
                                {sub}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B6B6B]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferred Mode of Contact Pills */}
                    <div className="space-y-2">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]">
                        Preferred Response Channel
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { id: 'email', label: 'Email Response', icon: Mail },
                          { id: 'phone', label: 'Phone Consultation', icon: Phone },
                          { id: 'whatsapp', label: 'WhatsApp Update', icon: MessageCircle },
                        ].map((method) => {
                          const IconComp = method.icon;
                          const isSelected = formData.preferredMethod === method.id;
                          return (
                            <button
                              type="button"
                              key={method.id}
                              onClick={() => setFormData((prev) => ({ ...prev, preferredMethod: method.id }))}
                              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#2C422F] text-white border-[#2C422F] shadow-sm'
                                  : 'bg-white/80 text-[#6B6B6B] border-[#E8E3D7] hover:border-[#2C422F]/40 hover:text-[#2C422F]'
                              }`}
                            >
                              <IconComp size={14} className={isSelected ? 'text-[#C2A573]' : 'text-[#6B6B6B]'} />
                              <span>{method.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="message"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]"
                        >
                          Your Message / Consultation Details <span className="text-[#8B5E3C]">*</span>
                        </label>
                        <span className="text-[11px] text-[#6B6B6B]">
                          {formData.message.length} / 1000
                        </span>
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        maxLength={1000}
                        required
                        placeholder="Please describe your query, dosha questions, order details, or wellness goals in detail..."
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full p-4 rounded-xl border border-[#E8E3D7] bg-white/80 text-sm text-[#2A2A2A] placeholder:text-[#6B6B6B]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C422F] focus:border-transparent transition-all duration-200 shadow-sm resize-none"
                      />
                    </div>

                    {/* CTA Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full h-14 rounded-xl bg-gradient-to-r from-[#2C422F] via-[#355039] to-[#2C422F] text-white font-medium text-base shadow-lg shadow-[#2C422F]/20 hover:shadow-xl hover:shadow-[#2C422F]/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden cursor-pointer"
                      >
                        {/* Shimmer effect highlight */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Dispatching Your Inquiry...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300 text-[#C2A573]" />
                            <span>Submit Wellness Inquiry</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Reassurance Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E8E3D7]/70 text-[11px] text-[#6B6B6B]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#2C422F] flex-shrink-0" />
                        <span>Privacy First Guarantee</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#2C422F] flex-shrink-0" />
                        <span>24–48 Hr Response</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HeartHandshake size={16} className="text-[#2C422F] flex-shrink-0" />
                        <span>Certified Vaidya Review</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Social Media & Mindful Community Banner (placed below Form Card in Left Column) */}
              <div className="rounded-3xl bg-gradient-to-br from-[#2C422F] via-[#355039] to-[#1E2E20] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
                {/* Decorative glow inside banner */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#C2A573]/20 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-medium backdrop-blur-xs">
                      <CalendarCheck size={13} className="text-[#C2A573]" />
                      <span>Mindful Living Circle</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif text-[#FDFAF5] font-semibold leading-snug">
                      Join Our Daily Ayurvedic Community
                    </h3>

                    <p className="text-xs text-white/75 leading-relaxed">
                      Tune into seasonal ritucharya rituals, ancient dosha wisdom, live masterclasses with vaidyas, and member-only apothecary drops.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-3.5 flex-shrink-0 pt-2 md:pt-0">
                    <div className="flex items-center gap-2.5">
                      {[
                        { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
                        { name: 'WhatsApp', icon: MessageCircle, href: 'https://whatsapp.com' },
                        { name: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com' },
                      ].map((item) => {
                        const IconComp = item.icon;
                        return (
                          <a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C2A573] hover:text-[#2C422F] text-white flex items-center justify-center transition-all duration-300 border border-white/15 hover:scale-110 shadow-sm"
                            title={item.name}
                            aria-label={item.name}
                          >
                            <IconComp size={18} />
                          </a>
                        );
                      })}
                    </div>

                    <span className="text-xs text-[#C2A573] font-serif italic">
                      @aham.ayurveda
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: Clean "Get in Touch" & "Our Location" (5 cols) */}
            {/* ======================================================== */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Structured Contact Details Card ("Get in Touch") */}
              <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-[#E8E3D7] p-6 sm:p-8 shadow-[0_12px_40px_-15px_rgba(44,66,47,0.07)] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E3D7]">
                  <div>
                    <h3 className="text-xl font-serif text-[#2C422F] font-semibold">
                      Get in Touch
                    </h3>
                    <p className="text-xs text-[#6B6B6B]">Direct access to our Ayurvedic concierge</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#F9F7F1] border border-[#E8E3D7] flex items-center justify-center text-[#C2A573]">
                    <Sparkles size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  {contactCards.map((card) => {
                    const IconComp = card.icon;
                    return (
                      <div
                        key={card.id}
                        className="group relative p-4 rounded-2xl bg-[#F9F7F1]/70 hover:bg-white border border-[#E8E3D7]/70 hover:border-[#C2A573]/50 transition-all duration-300 hover:shadow-sm"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E3D7] text-[#2C422F] group-hover:bg-[#2C422F] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors duration-300 shadow-xs">
                            <IconComp size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                                {card.title}
                              </span>
                              {card.copyValue && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(card.id, card.copyValue)}
                                  className="text-xs text-[#6B6B6B] hover:text-[#2C422F] flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                                  title="Copy to clipboard"
                                >
                                  {copiedId === card.id ? (
                                    <Check size={13} className="text-emerald-600" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              )}
                            </div>

                            {card.actionHref ? (
                              <a
                                href={card.actionHref}
                                target={card.actionHref.startsWith('http') ? '_blank' : '_self'}
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-[#2C422F] hover:text-[#8B5E3C] transition-colors mt-0.5 group-hover:underline"
                              >
                                <span>{card.primary}</span>
                                <ArrowUpRight size={13} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </a>
                            ) : (
                              <p className="text-sm font-semibold text-[#2A2A2A] mt-0.5">
                                {card.primary}
                              </p>
                            )}

                            {card.secondary && (
                              <p className="text-xs text-[#6B6B6B] mt-0.5">
                                {card.secondary}
                              </p>
                            )}

                            {card.address && (
                              <p className="text-xs text-[#6B6B6B] leading-relaxed mt-1">
                                {card.address}
                              </p>
                            )}

                            <p className="text-[11px] text-[#6B6B6B]/80 italic mt-1.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C2A573]" />
                              {card.note}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Embedded Google Maps Container ("Our Location") */}
              <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-[#E8E3D7] overflow-hidden shadow-[0_12px_40px_-15px_rgba(44,66,47,0.07)] group">
                <div className="p-4 sm:p-5 border-b border-[#E8E3D7] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#2C422F]/10 text-[#2C422F] flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#2C422F]">
                        Our Location
                      </h4>
                      <p className="text-[11px] text-[#6B6B6B]">Bengaluru Flagship Sanctuary & Apothecary</p>
                    </div>
                  </div>

                  <a
                    href="https://www.google.com/maps/place/Indiranagar,+Bengaluru,+Karnataka+560038"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2C422F] bg-[#F9F7F1] hover:bg-[#2C422F] hover:text-white px-3 py-1.5 rounded-full border border-[#E8E3D7] transition-all duration-200"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="relative aspect-[16/11] w-full bg-[#F9F7F1]">
                  <iframe
                    title="AHAM Flagship Sanctuary Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0095!2d77.6407!3d12.9784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae178f1e1e1e1f%3A0x1e1e1e1e1e1e1e1e!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka%20560038!5e0!3m2!1sen!2sin!4v1693000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full grayscale-[15%] contrast-[105%] group-hover:grayscale-0 transition-all duration-500"
                  />

                  {/* Floating Custom Location Pill */}
                  <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E3D7] shadow-lg flex items-center gap-3 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-[#2C422F] text-white flex items-center justify-center flex-shrink-0">
                      <Leaf size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#2C422F] truncate">AHAM Flagship Sanctuary</p>
                      <p className="text-[10px] text-[#6B6B6B] truncate">Valet parking & herbal tasting bar available</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* 3. BOTTOM TRUST & FAQ BANNER */}
      <section className="border-t border-[#E8E3D7] bg-white/60 py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9F7F1] border border-[#E8E3D7] text-[#2C422F] flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={22} className="text-[#C2A573]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-[#2C422F] mb-1">
                  Pure & Authentic Sourcing
                </h4>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Every botanical is ethically harvested from certified organic farms across the Western Ghats and Himalayan foothills.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9F7F1] border border-[#E8E3D7] text-[#2C422F] flex items-center justify-center flex-shrink-0">
                <HeartHandshake size={22} className="text-[#C2A573]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-[#2C422F] mb-1">
                  Personalized Care
                </h4>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Complimentary 15-minute consultations with our registered vaidyas on orders above ₹1,999.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9F7F1] border border-[#E8E3D7] text-[#2C422F] flex items-center justify-center flex-shrink-0">
                <Clock size={22} className="text-[#C2A573]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-[#2C422F] mb-1">
                  Swift Dispatch
                </h4>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Orders placed before 2:00 PM IST are hand-packed in eco-conscious glass vials and dispatched the same day.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Contact;