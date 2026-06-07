import { createClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/utils'
import type { AuditLogEntry } from '@/types/database'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ page?: string }>
}

const PAGE_SIZE = 50

async function getAuditLog(page: number) {
  const supabase = await createClient()
  const { data, count } = await supabase
    .from('audit_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
  return { entries: (data as AuditLogEntry[]) ?? [], total: count ?? 0 }
}

export default async function AuditLogPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const { entries, total } = await getAuditLog(page)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">{total} entries — read-only record of all mutations</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#243448] bg-[#1e2d3d]/50">
              <tr>
                {['Time', 'Actor', 'Action', 'Entity', 'Entity ID'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#4a5a6a]">No audit log entries yet.</td></tr>
              ) : entries.map((entry) => (
                <tr key={entry.id} className="border-b border-[#1e2d3d]">
                  <td className="py-2.5 px-4 text-[#5a6a7a] text-xs whitespace-nowrap">{formatDateTime(entry.created_at)}</td>
                  <td className="py-2.5 px-4 text-[#8899aa] text-xs">{entry.actor_email ?? 'system'}</td>
                  <td className="py-2.5 px-4">
                    <span className="badge bg-[#c9a84c15] text-[#c9a84c] border border-[#c9a84c20]">{entry.action}</span>
                  </td>
                  <td className="py-2.5 px-4 text-[#6a7a8a] text-xs">{entry.entity_type}</td>
                  <td className="py-2.5 px-4 text-[#5a6a7a] text-xs font-mono">
                    {entry.entity_id ? entry.entity_id.slice(0, 8) + '…' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#243448]">
            <p className="text-[#5a6a7a] text-xs">
              Page {page} of {totalPages} · {total} total entries
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a href={`/admin/audit?page=${page - 1}`} className="px-3 py-1.5 rounded border border-[#2d4058] text-[#6a7a8a] hover:text-white text-sm">← Prev</a>
              )}
              {page < totalPages && (
                <a href={`/admin/audit?page=${page + 1}`} className="px-3 py-1.5 rounded border border-[#2d4058] text-[#6a7a8a] hover:text-white text-sm">Next →</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
