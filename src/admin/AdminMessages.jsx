import { useState, useEffect } from 'react'
import { Mail, MailOpen, Trash2, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
        if (data) setMessages(data)
      } catch (e) { console.error(e) }
    }
    fetch()
  }, [])

  const markAsRead = async (msg) => {
    setSelected(msg)
    if (!msg.is_read) {
      try {
        await supabase.from('contact_submissions').update({ is_read: true }).eq('id', msg.id)
        setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
      } catch (e) { console.error(e) }
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      await supabase.from('contact_submissions').delete().eq('id', id)
    } catch (e) { console.error(e) }
    setMessages(messages.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white font-display text-3xl font-bold mb-2">Messages</h1>
        <p className="text-white/60">Contact form submissions</p>
      </div>

      {messages.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Mail className="text-white/20 mx-auto mb-4" size={48} />
          <h3 className="text-white/60 text-lg mb-2">No messages yet</h3>
          <p className="text-white/40">Messages from the contact form will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => markAsRead(msg)}
                className={`glass-card p-4 cursor-pointer hover:border-gold-500/20 transition-all ${
                  selected?.id === msg.id ? 'border-gold-500/40' : ''
                } ${!msg.is_read ? 'border-l-2 border-l-gold-500' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-1">
                    {msg.is_read ? <MailOpen size={14} className="text-white/30" /> : <Mail size={14} className="text-gold-400" />}
                    <span className="text-white font-medium text-sm">{msg.name}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id) }}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-white/40 text-xs">{msg.email}</p>
                {msg.subject && <p className="text-white/60 text-sm mt-1 truncate">{msg.subject}</p>}
                <div className="flex items-center gap-1 text-white/30 text-xs mt-2">
                  <Clock size={10} />
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          {selected && (
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold text-lg mb-1">{selected.subject || 'No Subject'}</h3>
              <p className="text-white/40 text-sm mb-6">
                From: {selected.name} ({selected.email}) {selected.phone && `| ${selected.phone}`}
              </p>
              <div className="text-white/70 whitespace-pre-line leading-relaxed">
                {selected.message}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-white/30 text-xs">
                Received: {new Date(selected.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
