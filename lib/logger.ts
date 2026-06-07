type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  [key: string]: unknown
}

function log(level: LogLevel, message: string, context: Record<string, unknown> = {}) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  }

  const formatted = JSON.stringify(entry)

  if (level === 'error') {
    console.error(formatted)
  } else if (level === 'warn') {
    console.warn(formatted)
  } else {
    console.log(formatted)
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
}

export function withRequestContext(route: string, method: string) {
  return {
    info: (message: string, context?: Record<string, unknown>) =>
      log('info', message, { route, method, ...context }),
    warn: (message: string, context?: Record<string, unknown>) =>
      log('warn', message, { route, method, ...context }),
    error: (message: string, context?: Record<string, unknown>) =>
      log('error', message, { route, method, ...context }),
    debug: (message: string, context?: Record<string, unknown>) =>
      log('debug', message, { route, method, ...context }),
  }
}
