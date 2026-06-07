import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import TrackingInput from '@/components/public/TrackingInput'
import { Zap, Globe, Package, Truck, Shield, Clock, Star, ArrowRight, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Crownport Logistics — Global Courier Services',
  description:
    'Crownport Logistics delivers packages worldwide with speed and reliability. Track shipments, get a quote, or schedule a pickup.',
}

export const revalidate = 3600

async function getSettings() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  // Skip Supabase call if credentials are not yet configured
  if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT_ID')) return {}
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('settings').select('key, value')
    const map: Record<string, string> = {}
    if (data) data.forEach((s: { key: string; value: string }) => { if (s.key && s.value) map[s.key] = s.value })
    return map
  } catch {
    return {}
  }
}

export default async function HomePage() {
  const settings = await getSettings()
  const tagline = settings.company_tagline ?? 'Global Courier Services — Fast, Reliable, Trusted'
  const countries = settings.stat_countries ?? '150+'
  const shipments = settings.stat_shipments ?? '2,000,000+'
  const years = settings.stat_years ?? '15'

  return (
    <>
      <Header />
      <main className="flex-1 bg-grid">
        {/* ---- HERO ---- */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c08] to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a84c15] border border-[#c9a84c30] text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-6">
                <Globe size={12} /> Worldwide Delivery
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                Ship Anywhere,{' '}
                <span className="gold-text">Delivered</span>{' '}
                with Precision
              </h1>
              <p className="text-[#8899aa] text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
                {tagline}
              </p>
              <div className="bg-[#1a2535]/80 border border-[#243448] rounded-xl p-6 sm:p-8 mb-8 backdrop-blur">
                <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-4">Track Your Shipment</p>
                <TrackingInput size="large" />
                <p className="text-[#4a5a6a] text-xs mt-3">Enter your Crownport tracking code to get real-time updates</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/ship" className="btn-gold"><Package size={18} /> Ship a Package</Link>
                <Link href="/rates" className="btn-outline">Get a Quote <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---- STATS STRIP ---- */}
        <section className="border-y border-[#1e2d3d] bg-[#1a2535]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: countries, label: 'Countries Served', icon: Globe },
                { value: shipments, label: 'Shipments Delivered', icon: Package },
                { value: `${years} Years`, label: 'In Operation', icon: Star },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon size={16} className="text-[#c9a84c]" />
                    <span className="text-2xl sm:text-3xl font-bold text-white">{value}</span>
                  </div>
                  <p className="text-[#6a7a8a] text-xs sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- SERVICES ---- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Shipping Solutions for Every Need</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Zap, title: 'Express Delivery', desc: '1–3 business days guaranteed. For time-sensitive packages.', href: '/services#express', badge: 'Fastest' },
              { icon: Globe, title: 'International Shipping', desc: 'Seamless cross-border delivery to 150+ countries.', href: '/services#international' },
              { icon: Truck, title: 'Standard Economy', desc: 'Cost-effective delivery in 5–10 business days.', href: '/services#standard', badge: 'Best Value' },
              { icon: Package, title: 'Freight & Cargo', desc: 'Heavy and oversized shipments handled with care.', href: '/services#freight' },
              { icon: Shield, title: 'eCommerce Fulfillment', desc: 'Warehousing, pick-pack, and last-mile delivery.', href: '/services#ecommerce' },
              { icon: Clock, title: 'Same-Day Delivery', desc: 'Urgent local delivery within hours in select cities.', href: '/services#sameday' },
            ].map((service) => (
              <Link key={service.title} href={service.href} className="card group hover:border-[#c9a84c40] hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#c9a84c15] flex items-center justify-center shrink-0 group-hover:bg-[#c9a84c25] transition-colors">
                    <service.icon size={20} className="text-[#c9a84c]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-white font-semibold text-sm">{service.title}</h3>
                      {service.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c9a84c20] text-[#c9a84c] font-semibold">{service.badge}</span>
                      )}
                    </div>
                    <p className="text-[#6a7a8a] text-sm leading-relaxed">{service.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#3a4a5a] group-hover:text-[#c9a84c] transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ---- HOW IT WORKS ---- */}
        <section className="bg-[#1a2535]/40 border-y border-[#1e2d3d] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Simple Process</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">How Crownport Works</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Submit Your Shipment', desc: 'Fill out our simple online form with sender, recipient, and package details.' },
                { step: '02', title: 'Get Your Tracking Code', desc: 'Receive your unique Crownport tracking number instantly via email.' },
                { step: '03', title: 'We Pick It Up', desc: 'Schedule a pickup or drop off at any of our locations worldwide.' },
                { step: '04', title: 'Track in Real Time', desc: "Monitor every step of your shipment's journey on our tracking page." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#e8c96e] flex items-center justify-center mx-auto mb-4 text-[#0f1923] font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#6a7a8a] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- TRUST STRIP ---- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Fully Insured', desc: 'All shipments covered up to declared value' },
              { icon: Clock, title: 'Real-Time Tracking', desc: 'Live updates every step of the way' },
              { icon: Globe, title: 'Global Network', desc: 'Delivery to 150+ countries worldwide' },
              { icon: Star, title: 'Premium Service', desc: 'Dedicated support for every shipment' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full border border-[#c9a84c30] bg-[#c9a84c10] flex items-center justify-center">
                  <Icon size={22} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-[#6a7a8a] text-xs mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- CTA ---- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="rounded-2xl bg-gradient-to-br from-[#1e2d3d] to-[#1a2535] border border-[#c9a84c30] p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Ship?</h2>
            <p className="text-[#8899aa] text-lg mb-8 max-w-xl mx-auto">
              Join thousands of businesses and individuals who trust Crownport for their global shipping needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/ship" className="btn-gold text-base py-3 px-8"><Package size={20} /> Ship a Package Now</Link>
              <Link href="/contact" className="btn-outline text-base py-3 px-8">Contact Sales</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
