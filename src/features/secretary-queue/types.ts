export type QueuedResultStatus = "success" | "error" | "warning" | "pending"

export interface QueuedResult {
  taskId: string
  taskDescription: string
  agent: string
  status: QueuedResultStatus
  output: string
  timestamp: Date
  parentSessionID: string
  requiresAttention: boolean
  attentionReason?: string
  duration?: number
}

export interface SecretaryQueueOptions {
  maxQueueSize?: number
  summaryTimeoutMs?: number
}

export interface TaskSummary {
  parentSessionID: string
  totalTasks: number
  successCount: number
  errorCount: number
  warningCount: number
  pendingCount: number
  results: QueuedResult[]
  hasExceptions: boolean
  generatedAt: Date
}