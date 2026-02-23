import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react'
import { db, demoContactInfo } from '../lib/firebase'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'

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
      try {
        const snap = await getDoc(doc(db, 'contact_info', 'main'))
        if (snap.exists()) {
          const data = snap.data()
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
    try {
      await addDoc(collection(db, 'contact_submissions'), {
        ...formData,
        is_read: false,
        created_at: serverTimestamp()
      })
    } catch (e) { console.error(e) }
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-surface-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2 mb-6">
            <span className="material-symbols-outlined text-primary text-sm">mail</span>
            <span className="text-white/60 text-sm font-medium">Contact</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Get in <span className="text-gradient-gold">Touch</span>
          </h1>
          <p className="section-subtitle max-w-2xl">
            Ready to explore Dubai real estate? Contact our team for personalized assistance.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-white font-bold text-2xl mb-8">Send us a Message</h2>

              {submitted ? (
                <div className="glass-card p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-green-400" size={28} />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-2">Message Sent!</h3>
                  <p className="text-white/50 mb-6">Thank you for your inquiry. Our team will respond within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="glass-panel rounded-3xl p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-white/40 text-sm mb-2 font-medium">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="form-input"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-sm mb-2 font-medium">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="form-input"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-white/40 text-sm mb-2 font-medium">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="form-input"
                          placeholder="+971 XX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-sm mb-2 font-medium">Subject</label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={e => setFormData({ ...formData, subject: e.target.value })}
                          className="form-input"
                          placeholder="What's this about?"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/40 text-sm mb-2 font-medium">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="form-input resize-none"
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
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-white font-bold text-2xl mb-8">Contact Information</h2>
              <div className="space-y-4">
                <div className="glass-panel rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={22} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Office Address</h4>
                    <p className="text-white/40 text-sm">{contact.address}</p>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={22} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                    <p className="text-white/40 text-sm">{contact.phone}</p>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={22} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <p className="text-white/40 text-sm">{contact.email}</p>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary" size={22} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Working Hours</h4>
                    <p className="text-white/40 text-sm">{contact.working_hours}</p>
                  </div>
                </div>

                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel rounded-2xl p-5 flex items-center gap-4 hover:border-green-500/20 transition-all block"
                  >
                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
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
                  <h4 className="text-white/30 font-semibold text-xs tracking-[0.2em] uppercase mb-4">Follow Us</h4>
                  <div className="flex gap-3">
                    {contact.social.instagram && (
                      <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                        <Instagram size={18} />
                      </a>
                    )}
                    {contact.social.facebook && (
                      <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                        <Facebook size={18} />
                      </a>
                    )}
                    {contact.social.linkedin && (
                      <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {contact.social.youtube && (
                      <a href={contact.social.youtube} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                        <Youtube size={18} />
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
