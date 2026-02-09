import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react'
import { supabase, DEMO_MODE, demoContactInfo } from '../lib/supabase'

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const [contact, setContact] = useState(demoContactInfo)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: searchParams.get('property') ? `Inquiry about property #${searchParams.get('property')}` : '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (DEMO_MODE) { setLoading(false); return }
      try {
        const { data } = await supabase.from('contact_info').select('*').eq('is_active', true).single()
        if (data) {
          setContact({
            ...data,
            social: {
              instagram: data.social_instagram,
              facebook: data.social_facebook,
              linkedin: data.social_linkedin,
              youtube: data.social_youtube,
            }
          })
        }
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    if (!DEMO_MODE && supabase) {
      try {
        await supabase.from('contact_submissions').insert([formData])
      } catch (e) { console.error(e) }
    }
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-dubai-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-12 h-[2px] bg-gold-500"></div>
            <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">Contact</span>
          </div>
          <h1 className="section-title mb-4">Get in Touch</h1>
          <p className="section-subtitle max-w-2xl">
            Ready to explore Dubai real estate? Contact our team for personalized assistance.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-dubai-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-white font-display text-2xl font-bold mb-8">Send us a Message</h2>

              {submitted ? (
                <div className="glass-card p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-green-400" size={28} />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-2">Message Sent!</h3>
                  <p className="text-white/60 mb-6">Thank you for your inquiry. Our team will respond within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="admin-input"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="admin-input"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="admin-input"
                        placeholder="+971 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="admin-input"
                        placeholder="What's this about?"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="admin-input resize-none"
                      placeholder="Tell us about your property needs..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                  >
                    <Send size={18} />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-white font-display text-2xl font-bold mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-gold-400" size={22} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Office Address</h4>
                    <p className="text-white/60 text-sm">{contact.address}</p>
                  </div>
                </div>

                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-gold-400" size={22} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                    <p className="text-white/60 text-sm">{contact.phone}</p>
                  </div>
                </div>

                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-gold-400" size={22} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <p className="text-white/60 text-sm">{contact.email}</p>
                  </div>
                </div>

                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-gold-400" size={22} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Working Hours</h4>
                    <p className="text-white/60 text-sm">{contact.working_hours}</p>
                  </div>
                </div>

                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-6 flex items-center gap-4 hover:border-green-500/30 transition-all block"
                  >
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="text-green-400" size={22} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">WhatsApp</h4>
                      <p className="text-green-400 text-sm">Chat with us now</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Social Links */}
              {contact.social && (
                <div className="mt-8">
                  <h4 className="text-gold-400 font-semibold text-sm tracking-wider mb-4">FOLLOW US</h4>
                  <div className="flex gap-3">
                    {contact.social.instagram && (
                      <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 glass-card flex items-center justify-center hover:border-gold-500/30 transition-all">
                        <Instagram size={18} className="text-white/60 hover:text-gold-400" />
                      </a>
                    )}
                    {contact.social.facebook && (
                      <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 glass-card flex items-center justify-center hover:border-gold-500/30 transition-all">
                        <Facebook size={18} className="text-white/60 hover:text-gold-400" />
                      </a>
                    )}
                    {contact.social.linkedin && (
                      <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 glass-card flex items-center justify-center hover:border-gold-500/30 transition-all">
                        <Linkedin size={18} className="text-white/60 hover:text-gold-400" />
                      </a>
                    )}
                    {contact.social.youtube && (
                      <a href={contact.social.youtube} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 glass-card flex items-center justify-center hover:border-gold-500/30 transition-all">
                        <Youtube size={18} className="text-white/60 hover:text-gold-400" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
