import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

interface AuditParams {
  actorId?: string
  actorEmail?: string
  action: string
  entityType: string
  entityId?: string
  beforeData?: Record<string, unknown>
  afterData?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export async function writeAuditLog(params: AuditParams) {
  try {
    const supabase = createAdminClient()
    await supabase.from('audit_log').insert({
      actor_id: params.actorId ?? null,
      actor_email: params.actorEmail ?? null,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId ?? null,
      before_data: params.beforeData ?? null,
      after_data: params.afterData ?? null,
      ip_address: params.ipAddress ?? null,
      user_agent: params.userAgent ?? null,
    })
  } catch (err) {
    logger.error('Failed to write audit log', { error: err instanceof Error ? err.message : 'unknown', ...params })
  }
}
