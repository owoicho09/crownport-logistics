'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/track', label: 'Track' },
  { href: '/ship', label: 'Ship' },
  { href: '/services', label: 'Services' },
  { href: '/rates', label: 'Rates' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/locations', label: 'Locations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-[#0f1923]/95 backdrop-blur border-b border-[#1e2d3d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#c9a84c] to-[#e8c96e] flex items-center justify-center">
              <Package size={18} className="text-[#0f1923]" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight leading-none">Crownport</span>
              <span className="text-[#c9a84c] font-bold text-lg tracking-tight leading-none ml-1">Logistics</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-[#c9a84c] bg-[#c9a84c10]'
                    : 'text-[#8899aa] hover:text-white hover:bg-[#1e2d3d]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/pickup" className="btn-outline text-sm py-2 px-4">
              Schedule Pickup
            </Link>
            <Link href="/ship" className="btn-gold text-sm py-2 px-4">
              Ship Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-[#8899aa] hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#1a2535] border-t border-[#243448]">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded text-sm font-medium ${
                  pathname === link.href
                    ? 'text-[#c9a84c] bg-[#c9a84c10]'
                    : 'text-[#8899aa] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2 border-t border-[#243448]">
              <Link href="/pickup" onClick={() => setMobileOpen(false)} className="block btn-outline text-sm text-center w-full">
                Schedule Pickup
              </Link>
              <Link href="/ship" onClick={() => setMobileOpen(false)} className="block btn-gold text-sm text-center w-full">
                Ship Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
