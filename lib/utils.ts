import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid date'
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Invalid date'
  }
}

export function formatWeight(kg: number | null | undefined): string {
  if (kg === null || kg === undefined) return 'N/A'
  return `${kg} kg`
}

export function formatDimensions(
  length: number | null | undefined,
  width: number | null | undefined,
  height: number | null | undefined
): string {
  if (!length || !width || !height) return 'N/A'
  return `${length} × ${width} × ${height} cm`
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING_REVIEW: 'text-yellow-400 bg-yellow-400/10',
    LABEL_CREATED: 'text-blue-400 bg-blue-400/10',
    PICKED_UP: 'text-blue-300 bg-blue-300/10',
    ARRIVED_AT_HUB: 'text-indigo-400 bg-indigo-400/10',
    IN_TRANSIT: 'text-cyan-400 bg-cyan-400/10',
    CUSTOMS_CLEARANCE: 'text-purple-400 bg-purple-400/10',
    OUT_FOR_DELIVERY: 'text-amber-400 bg-amber-400/10',
    DELIVERY_ATTEMPTED: 'text-orange-400 bg-orange-400/10',
    DELIVERED: 'text-green-400 bg-green-400/10',
    RETURNED_TO_SENDER: 'text-red-400 bg-red-400/10',
    EXCEPTION: 'text-red-400 bg-red-400/10',
    ON_HOLD: 'text-orange-400 bg-orange-400/10',
    CANCELLED: 'text-gray-400 bg-gray-400/10',
  }
  return colors[status] ?? 'text-gray-400 bg-gray-400/10'
}

export function getStatusBadgeVariant(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  if (['DELIVERED'].includes(status)) return 'success'
  if (['EXCEPTION', 'RETURNED_TO_SENDER', 'CANCELLED'].includes(status)) return 'danger'
  if (['OUT_FOR_DELIVERY', 'DELIVERY_ATTEMPTED', 'ON_HOLD'].includes(status)) return 'warning'
  if (['IN_TRANSIT', 'CUSTOMS_CLEARANCE', 'ARRIVED_AT_HUB', 'PICKED_UP'].includes(status)) return 'info'
  return 'default'
}
