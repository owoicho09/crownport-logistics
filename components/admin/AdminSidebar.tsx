'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Plus, AlertTriangle, Truck,
  DollarSign, Globe, MapPin, BarChart2, Bell, Settings,
  Users, FileText, TestTube2, Loader
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/shipments', label: 'Shipments', icon: Package },
  { href: '/admin/create', label: 'Create Shipment', icon: Plus },
  { href: '/admin/exceptions', label: 'Exceptions', icon: AlertTriangle },
  { href: '/admin/pickups', label: 'Pickup Requests', icon: Truck },
  { type: 'divider' as const },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
  { type: 'divider' as const },
  { href: '/admin/rates', label: 'Rates', icon: DollarSign },
  { href: '/admin/destinations', label: 'Destinations', icon: Globe },
  { href: '/admin/locations', label: 'Locations', icon: MapPin },
  { type: 'divider' as const },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/audit', label: 'Audit Log', icon: FileText },
  { href: '/admin/test', label: 'Test Mode', icon: TestTube2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-[#0f1923] border-r border-[#1e2d3d] flex flex-col h-full overflow-y-auto shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-[#1e2d3d]">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-[#c9a84c] to-[#e8c96e] flex items-center justify-center shrink-0">
            <Loader size={14} className="text-[#0f1923]" />
          </div>
          <div className="leading-tight">
            <div className="text-white font-bold text-sm">Crownport</div>
            <div className="text-[#c9a84c] text-[10px] font-semibold uppercase tracking-widest">Admin</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item, i) => {
          if (item.type === 'divider') {
            return <div key={i} className="my-2 border-t border-[#1e2d3d]" />
          }

          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors',
                isActive
                  ? 'bg-[#c9a84c15] text-[#c9a84c] font-medium'
                  : 'text-[#6a7a8a] hover:text-white hover:bg-[#1e2d3d]'
              )}
            >
              {item.icon && <item.icon size={15} className="shrink-0" />}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#1e2d3d]">
        <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded text-[#4a5a6a] hover:text-white text-xs transition-colors">
          View Public Site ↗
        </Link>
      </div>
    </aside>
  )
}
