import type { Metadata } from 'next'
import { Globe, Shield, Package, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Crownport Logistics — our story, mission, and global network.',
}

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Our Story</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Built to Move the World
        </h1>
        <p className="text-[#8899aa] text-xl leading-relaxed max-w-2xl mx-auto">
          Crownport Logistics was founded on a simple belief: that businesses and individuals deserve a courier partner they can trust completely, regardless of where in the world they're shipping.
        </p>
      </div>

      {/* Story */}
      <div className="card mb-8 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
            <p className="text-[#8899aa] leading-relaxed mb-4">
              Founded in 2009, Crownport Logistics has grown from a regional courier service into a full-scale global logistics company serving 150+ countries. We operate our own infrastructure — hubs, vehicles, and staff — delivering packages with the precision and care that our name represents.
            </p>
            <p className="text-[#8899aa] leading-relaxed">
              Unlike traditional brokers, Crownport owns the end-to-end customer experience. Every tracking update, every notification, every shipment milestone is managed directly by our team, giving you a consistent, premium experience from the moment you submit a shipment to the moment it arrives.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-[#8899aa] leading-relaxed mb-4">
              To be the most trusted name in global courier services — delivering not just packages, but confidence. We believe logistics should be transparent, reliable, and human.
            </p>
            <p className="text-[#8899aa] leading-relaxed">
              We invest heavily in technology to give our customers real-time visibility, and equally in our people to ensure every shipment is handled with genuine care.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {[
          { icon: Shield, title: 'Trust & Reliability', desc: 'We never overpromise. Our delivery estimates are based on real data and our team works around the clock to meet them.' },
          { icon: Globe, title: 'Global Reach', desc: 'With a network spanning 150+ countries and strategic partnerships across every continent, no destination is out of reach.' },
          { icon: Package, title: 'End-to-End Ownership', desc: 'We own the full logistics chain. That means no finger-pointing, no excuses — just accountability at every step.' },
          { icon: Users, title: 'Customer First', desc: 'Our support team is available 24/7. Every customer, from individual senders to enterprise accounts, receives the same premium service.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#c9a84c15] flex items-center justify-center shrink-0">
                <Icon size={20} className="text-[#c9a84c]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-[#6a7a8a] text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <a href="/contact" className="btn-gold inline-flex mr-3">Contact Us</a>
        <a href="/ship" className="btn-outline inline-flex">Ship Now</a>
      </div>
    </div>
  )
}
