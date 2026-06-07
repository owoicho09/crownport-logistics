'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  trackingCode: string
  intervalMs?: number
}

export default function TrackingPoller({ trackingCode, intervalMs = 30000 }: Props) {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        router.refresh()
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }, [router, trackingCode, intervalMs])

  return null
}
