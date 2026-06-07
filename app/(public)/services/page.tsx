import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Globe, Package, Truck, ShoppingCart, Clock, Check, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Services',
  description: 'Explore Crownport Logistics shipping services — Express, Standard, International, Freight, eCommerce, and Same-Day delivery.',
}

const services = [
  {
    id: 'express',
    icon: Zap,
    name: 'Express Delivery',
    tagline: 'Speed when it matters most',
    description:
      'Our Express service delivers your packages in 1–3 business days to most destinations. Ideal for urgent documents, time-sensitive goods, and high-priority shipments.',
    transit: '1–3 Business Days',
    features: [
      'Priority handling at all processing hubs',
      'Real-time tracking with hourly updates',
      'Signature confirmation on delivery',
      'Up to $10,000 declared value coverage',
      'SMS and email notifications',
    ],
    badge: 'Fastest',
    color: 'from-amber-500/20 to-amber-600/5',
    borderColor: 'border-amber-500/20',
  },
  {
    id: 'standard',
    icon: Package,
    name: 'Standard Economy',
    tagline: 'Reliable delivery at great value',
    description:
      'Standard Economy is our cost-effective solution for non-urgent shipments. Delivery in 5–10 business days with full tracking and insurance.',
    transit: '5–10 Business Days',
    features: [
      'Full shipment tracking',
      'Email status notifications',
      'Standard insurance coverage',
      'Flexible pickup options',
      'Consolidated shipping discounts',
    ],
    badge: 'Best Value',
    color: 'from-blue-500/20 to-blue-600/5',
    borderColor: 'border-blue-500/20',
  },
  {
    id: 'international',
    icon: Globe,
    name: 'International Shipping',
    tagline: 'Seamless global delivery',
    description:
      'We deliver to 150+ countries with comprehensive customs support. Our international service handles all documentation and compliance requirements.',
    transit: '5–21 Business Days',
    features: [
      'Delivery to 150+ countries',
      'Full customs documentation support',
      'Duties and taxes calculation',
      'Real-time customs status updates',
      'Dedicated international support team',
    ],
    badge: 'Global',
    color: 'from-emerald-500/20 to-emerald-600/5',
    borderColor: 'border-emerald-500/20',
  },
  {
    id: 'freight',
    icon: Truck,
    name: 'Freight & Cargo',
    tagline: 'Heavy loads, handled with care',
    description:
      'Full truckload, LTL, and air freight services for heavy and oversized shipments. Designed for businesses that move volume regularly.',
    transit: 'Varies by Route',
    features: [
      'Full truckload (FTL) and LTL options',
      'Air freight for urgent cargo',
      'Hazmat and regulated goods handling',
      'Dedicated account management',
      'Volume pricing available',
    ],
    badge: undefined,
    color: 'from-purple-500/20 to-purple-600/5',
    borderColor: 'border-purple-500/20',
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    name: 'eCommerce Fulfillment',
    tagline: 'Your logistics backbone',
    description:
      'End-to-end fulfillment for online businesses. From warehousing and inventory management to pick-pack and last-mile delivery.',
    transit: '1–5 Business Days',
    features: [
      'Warehousing and storage',
      'Automated pick and pack',
      'Returns management',
      'Shopify, WooCommerce, and API integrations',
      'Branded packaging available',
    ],
    badge: 'Business',
    color: 'from-cyan-500/20 to-cyan-600/5',
    borderColor: 'border-cyan-500/20',
  },
  {
    id: 'sameday',
    icon: Clock,
    name: 'Same-Day Delivery',
    tagline: 'Delivered within hours',
    description:
      'Urgent same-day delivery within select cities and regions. Ideal for businesses needing immediate local courier service.',
    transit: '2–6 Hours',
    features: [
      'Delivery within hours of pickup',
      'Available in select metro areas',
      'Live courier tracking on map',
      'Proof of delivery photo',
      'Ideal for perishables and urgent docs',
    ],
    badge: 'Urgent',
    color: 'from-red-500/20 to-red-600/5',
    borderColor: 'border-red-500/20',
  },
]

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Our Services</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Shipping Solutions for Every Need</h1>
        <p className="text-[#6a7a8a] text-lg max-w-2xl mx-auto">
          From urgent express packages to large freight shipments, Crownport has a service tailored to your requirements.
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-6">
        {services.map((service, idx) => (
          <div
            id={service.id}
            key={service.id}
            className={`rounded-2xl bg-gradient-to-r ${service.color} border ${service.borderColor} p-8 sm:p-10`}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1a2535] border border-[#2d4058] flex items-center justify-center">
                    <service.icon size={24} className="text-[#c9a84c]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{service.name}</h2>
                      {service.badge && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#c9a84c20] text-[#c9a84c] font-semibold border border-[#c9a84c30]">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[#8899aa] text-sm">{service.tagline}</p>
                  </div>
                </div>
                <p className="text-[#8899aa] leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center gap-2 text-[#c9a84c] text-sm font-medium">
                  <Clock size={14} />
                  Estimated Transit: <span className="text-white">{service.transit}</span>
                </div>
              </div>

              <div className="lg:w-72">
                <p className="text-[#6a7a8a] text-xs font-semibold uppercase tracking-wider mb-3">Key Features</p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#8899aa]">
                      <Check size={14} className="text-[#c9a84c] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-3">
              <Link href="/ship" className="btn-gold text-sm py-2.5 px-5">
                Ship with {service.name.split(' ')[0]} <ArrowRight size={15} />
              </Link>
              <Link href="/rates" className="btn-outline text-sm py-2.5 px-5">
                Get a Quote
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
