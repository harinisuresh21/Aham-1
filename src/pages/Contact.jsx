import React, { useState } from 'react';
import Container from '../components/layout/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  Leaf,
  ArrowRight,
  AtSign
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const contactInfo = [
  {
    icon: Mail,
    label: 'Customer Support Email',
    value: 'support@aham.in',
    href: 'mailto:support@aham.in',
    description: 'We typically respond within 4–6 business hours.',
  },
  {
    icon: Phone,
    label: 'Helpline Phone Number',
    value: '+91 80 4567 8900',
    href: 'tel:+918045678900',
    description: 'Mon – Sat, 9:00 AM to 6:00 PM IST.',
  },
  {
    icon: MapPin,
    label: 'Business Address',
    value: 'AHAM Natural Wellness Pvt. Ltd.',
    address: 'No. 14, 2nd Floor, Heritage Craft House\nIndiranagar 100ft Road, HAL 2nd Stage\nBengaluru, Karnataka 560038, India',
    description: 'Visits by appointment only.',
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon – Saturday: 9 AM – 6 PM IST',
    description: 'Sundays & national holidays: Closed.',
  },
];

const Contact = () => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.', 'Missing Information');
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Your message has been received! We will respond within 24 hours.', 'Message Sent');
    }, 1000);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSubmitted(false);
  };

  return (
    <div className="bg-brand-cream-light py-10 lg:py-16 min-h-screen">
      <Container>
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-accent mb-2">
            <Leaf size={14} /> We'd Love to Hear From You
          </span>
          <h1 className="text-4xl lg:text-5xl font-serif text-brand-primary font-bold mb-3">
            Contact Us
          </h1>
          <p className="text-base text-brand-muted leading-relaxed">
            Have questions about our products, sourcing, or need wellness guidance? Our team of Ayurvedic consultants is here to help.
          </p>
        </div>

        {/* Two Column Layout: Form (Left) + Contact Details & Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* 1. LEFT COLUMN: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-brand-border p-6 sm:p-10 shadow-sm rounded-sm">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-brand-border">
                <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-brand-primary font-bold">Send Us a Message</h2>
                  <p className="text-xs text-brand-muted">Fill out the form below and we will get back to you promptly.</p>
                </div>
              </div>

              {submitted ? (
                /* Success Confirmation State */
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={36} className="text-green-700" />
                  </div>
                  <h3 className="text-2xl font-serif text-brand-primary font-bold mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed max-w-md mx-auto mb-8">
                    Thank you for reaching out, <strong className="text-brand-charcoal">{formData.name || 'valued customer'}</strong>. Our wellness team will respond to <strong className="text-brand-charcoal">{formData.email}</strong> within 24 hours.
                  </p>
                  <Button onClick={handleReset} variant="outline" className="gap-2">
                    <Send size={15} /> Send Another Message
                  </Button>
                </div>
              ) : (
                /* Inquiry Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="e.g. Priya Sundaram"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="e.g. Product Inquiry, Bulk Order, Collaboration"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />

                  <div>
                    <label className="text-xs font-semibold text-brand-charcoal block mb-1.5">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="Tell us how we can help you. Include any product names, order IDs, or specific queries..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-primary rounded resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <p className="text-[11px] text-brand-muted">
                      By submitting, you agree to our Privacy Policy and consent to receiving email responses.
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                      className="w-full sm:w-auto gap-2 font-semibold shadow-md px-8"
                    >
                      <Send size={16} /> Send Message
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* 2. RIGHT COLUMN: Contact Details & Embedded Map Card */}
          <div className="lg:col-span-5 space-y-6">

            {/* Contact Details Cards */}
            <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm">
              <h3 className="text-xl font-serif text-brand-primary font-bold mb-6 pb-4 border-b border-brand-border">
                Get in Touch
              </h3>

              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-primary flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-0.5">
                          {item.label}
                        </h4>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-semibold text-sm text-brand-primary hover:text-brand-accent transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-semibold text-sm text-brand-charcoal">{item.value}</p>
                        )}
                        {item.address && (
                          <p className="text-xs text-brand-charcoal/80 leading-relaxed mt-1 whitespace-pre-line">
                            {item.address}
                          </p>
                        )}
                        <p className="text-[11px] text-brand-muted mt-1">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Embedded Location Map Card */}
            <div className="bg-white border border-brand-border shadow-sm rounded-sm overflow-hidden">
              <div className="p-4 border-b border-brand-border flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-brand-primary flex items-center gap-2">
                  <MapPin size={16} className="text-brand-accent" /> Our Location
                </h3>
                <a
                  href="https://www.google.com/maps/place/Indiranagar,+Bengaluru,+Karnataka+560038"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-brand-primary hover:text-brand-accent flex items-center gap-1"
                >
                  Open in Maps <ArrowRight size={12} />
                </a>
              </div>
              <div className="aspect-[4/3] bg-brand-cream">
                <iframe
                  title="AHAM Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0095!2d77.6407!3d12.9784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae178f1e1e1e1f%3A0x1e1e1e1e1e1e1e1e!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka%20560038!5e0!3m2!1sen!2sin!4v1693000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-brand-primary text-white p-6 rounded-sm shadow-sm">
              <h3 className="font-serif text-base font-bold text-brand-cream-light mb-2">
                Follow Our Wellness Journey
              </h3>
              <p className="text-xs text-brand-cream/70 mb-4">
                Stay connected for daily Ayurvedic insights, seasonal recipes, and exclusive offers.
              </p>
              <div className="flex items-center gap-3">

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  title="Twitter / X"
                >
                  <AtSign size={16} />
                </a>
                <a
                  href="mailto:support@aham.in"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  title="Email"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
