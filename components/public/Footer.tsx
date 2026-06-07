import Link from 'next/link'
import { Package, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0d1520] border-t border-[#1e2d3d] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-[#c9a84c] to-[#e8c96e] flex items-center justify-center">
                <Package size={18} className="text-[#0f1923]" />
              </div>
              <span className="text-white font-bold text-lg">
                Crownport<span className="text-[#c9a84c]"> Logistics</span>
              </span>
            </div>
            <p className="text-[#6a7a8a] text-sm leading-relaxed">
              Global courier services delivering with speed, reliability, and professionalism since 2009.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-8 h-8 rounded bg-[#1e2d3d] flex items-center justify-center text-[#6a7a8a] hover:text-[#c9a84c] hover:bg-[#c9a84c15] transition-colors text-xs font-bold">X</a>
              <a href="#" className="w-8 h-8 rounded bg-[#1e2d3d] flex items-center justify-center text-[#6a7a8a] hover:text-[#c9a84c] hover:bg-[#c9a84c15] transition-colors text-xs font-bold">in</a>
              <a href="#" className="w-8 h-8 rounded bg-[#1e2d3d] flex items-center justify-center text-[#6a7a8a] hover:text-[#c9a84c] hover:bg-[#c9a84c15] transition-colors text-xs font-bold">f</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2.5">
              {[
                ['Express Delivery', '/services#express'],
                ['Standard Economy', '/services#standard'],
                ['International Shipping', '/services#international'],
                ['Freight & Cargo', '/services#freight'],
                ['eCommerce Fulfillment', '/services#ecommerce'],
                ['Same-Day Delivery', '/services#sameday'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[#6a7a8a] hover:text-[#c9a84c] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                ['About Us', '/about'],
                ['Track Shipment', '/track'],
                ['Ship a Package', '/ship'],
                ['Rate Calculator', '/rates'],
                ['Destinations', '/destinations'],
                ['Our Locations', '/locations'],
                ['Schedule Pickup', '/pickup'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[#6a7a8a] hover:text-[#c9a84c] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-[#6a7a8a]">
                <MapPin size={15} className="text-[#c9a84c] mt-0.5 shrink-0" />
                <span>100 Logistics Way<br />Global City, GC 00000</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Phone size={15} className="text-[#c9a84c] shrink-0" />
                <a href="tel:+18000000000" className="text-[#6a7a8a] hover:text-[#c9a84c] transition-colors">
                  +1 (800) 000-0000
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail size={15} className="text-[#c9a84c] shrink-0" />
                <a href="mailto:info@crownportlogistics.site" className="text-[#6a7a8a] hover:text-[#c9a84c] transition-colors">
                  info@crownportlogistics.site
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1e2d3d] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#4a5a6a] text-xs">
            © {new Date().getFullYear()} Crownport Logistics. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[#4a5a6a] hover:text-[#c9a84c] text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[#4a5a6a] hover:text-[#c9a84c] text-xs transition-colors">Terms of Service</Link>
            <Link href="/contact" className="text-[#4a5a6a] hover:text-[#c9a84c] text-xs transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
