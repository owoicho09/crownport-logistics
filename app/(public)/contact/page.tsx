import type { Metadata } from 'next'
import ContactForm from '@/components/public/ContactForm'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Crownport Logistics for support, sales, or general enquiries.',
}

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-12">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
        <h1 className="text-4xl font-bold text-white mb-4">Contact Crownport</h1>
        <p className="text-[#6a7a8a] max-w-xl mx-auto">
          Have a question, need a custom quote, or require support? Our team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: Phone, label: 'Phone', value: '+1 (800) 000-0000', href: 'tel:+18000000000' },
            { icon: Mail, label: 'Email', value: 'info@crownportlogistics.site', href: 'mailto:info@crownportlogistics.site' },
            { icon: MapPin, label: 'Headquarters', value: '100 Logistics Way, Global City' },
            { icon: Clock, label: 'Support Hours', value: '24/7 — Every day of the year' },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#c9a84c15] flex items-center justify-center shrink-0">
                <Icon size={18} className="text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-[#6a7a8a] text-xs mb-0.5">{label}</p>
                {href ? (
                  <a href={href} className="text-white font-medium hover:text-[#c9a84c] transition-colors">{value}</a>
                ) : (
                  <p className="text-white font-medium">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
