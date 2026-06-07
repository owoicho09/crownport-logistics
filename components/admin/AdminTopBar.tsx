'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, User } from 'lucide-react'

interface Props {
  user: { name: string; email: string }
}

export default function AdminTopBar({ user }: Props) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="h-14 bg-[#0f1923] border-b border-[#1e2d3d] flex items-center justify-between px-6 shrink-0">
      <div className="text-[#4a5a6a] text-sm">
        Operations Panel
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-full bg-[#c9a84c20] border border-[#c9a84c30] flex items-center justify-center">
            <User size={14} className="text-[#c9a84c]" />
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-xs font-medium leading-none">{user.name}</p>
            <p className="text-[#4a5a6a] text-[10px] mt-0.5">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="p-1.5 rounded text-[#4a5a6a] hover:text-white hover:bg-[#1e2d3d] transition-colors"
          title="Sign out"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  )
}
