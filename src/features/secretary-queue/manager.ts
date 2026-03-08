import type { QueuedResult, TaskSummary, SecretaryQueueOptions } from "./types"

const DEFAULT_MAX_QUEUE_SIZE = 100
const DEFAULT_SUMMARY_TIMEOUT_MS = 60000

export class SecretaryQueueManager {
  private results: Map<string, QueuedResult[]> = new Map()
  private expectedCounts: Map<string, number> = new Map()
  private maxQueueSize: number
  private summaryTimeoutMs: number

  constructor(options: SecretaryQueueOptions = {}) {
    this.maxQueueSize = options.maxQueueSize ?? DEFAULT_MAX_QUEUE_SIZE
    this.summaryTimeoutMs = options.summaryTimeoutMs ?? DEFAULT_SUMMARY_TIMEOUT_MS
  }

  addResult(parentSessionID: string, result: QueuedResult): void {
    const queue = this.results.get(parentSessionID) ?? []
    
    if (queue.length >= this.maxQueueSize) {
      queue.shift()
    }
    
    queue.push(result)
    this.results.set(parentSessionID, queue)
  }

  setExpectedCount(parentSessionID: string, count: number): void {
    this.expectedCounts.set(parentSessionID, count)
  }

  getResults(parentSessionID: string): QueuedResult[] {
    return this.results.get(parentSessionID) ?? []
  }

  getExpectedCount(parentSessionID: string): number {
    return this.expectedCounts.get(parentSessionID) ?? 0
  }

  isComplete(parentSessionID: string): boolean {
    const results = this.results.get(parentSessionID) ?? []
    const expected = this.expectedCounts.get(parentSessionID) ?? 0
    
    if (expected === 0) {
      return results.length > 0 && results.every(r => r.status !== "pending")
    }
    
    return results.length >= expected && results.every(r => r.status !== "pending")
  }

  hasExceptions(parentSessionID: string): boolean {
    const results = this.results.get(parentSessionID) ?? []
    return results.some(r => r.requiresAttention)
  }

  clear(parentSessionID: string): void {
    this.results.delete(parentSessionID)
    this.expectedCounts.delete(parentSessionID)
  }

  clearAll(): void {
    this.results.clear()
    this.expectedCounts.clear()
  }

  generateSummary(parentSessionID: string): TaskSummary | null {
    const results = this.results.get(parentSessionID)
    if (!results || results.length === 0) {
      return null
    }

    const successCount = results.filter(r => r.status === "success").length
    const errorCount = results.filter(r => r.status === "error").length
    const warningCount = results.filter(r => r.status === "warning").length
    const pendingCount = results.filter(r => r.status === "pending").length

    return {
      parentSessionID,
      totalTasks: results.length,
      successCount,
      errorCount,
      warningCount,
      pendingCount,
      results,
      hasExceptions: this.hasExceptions(parentSessionID),
      generatedAt: new Date(),
    }
  }

  formatSummaryReport(parentSessionID: string): string {
    const summary = this.generateSummary(parentSessionID)
    if (!summary) {
      return "无任务结果"
    }

    const lines: string[] = [
      "# 任务结果汇总",
      "",
      "## 任务概览",
      `- 总任务数: ${summary.totalTasks}`,
      `- 成功: ${summary.successCount}`,
      `- 失败: ${summary.errorCount}`,
      `- 警告: ${summary.warningCount}`,
    ]

    if (summary.pendingCount > 0) {
      lines.push(`- 待处理: ${summary.pendingCount}`)
    }

    lines.push("", "## 详细结果", "")

    for (const result of summary.results) {
      const statusIcon = result.status === "success" ? "✓" : 
                         result.status === "error" ? "✗" : 
                         result.status === "warning" ? "⚠" : "○"
      
      lines.push(`### ${statusIcon} ${result.taskDescription}`)
      lines.push(`- 状态: ${result.status}`)
      
      if (result.duration) {
        lines.push(`- 耗时: ${result.duration}s`)
      }
      
      if (result.requiresAttention && result.attentionReason) {
        lines.push(`- 需要关注: ${result.attentionReason}`)
      }

      if (result.output) {
        const truncatedOutput = result.output.length > 500 
          ? result.output.slice(0, 500) + "..." 
          : result.output
        lines.push(`- 输出: ${truncatedOutput}`)
      }
      
      lines.push("")
    }

    if (summary.hasExceptions) {
      lines.push("## 异常报告", "")
      const exceptions = summary.results.filter(r => r.requiresAttention)
      for (const exc of exceptions) {
        lines.push(`- **${exc.taskDescription}**: ${exc.attentionReason ?? "未知异常"}`)
      }
      lines.push("")
    }

    lines.push("## 建议下一步")
    if (summary.errorCount > 0) {
      lines.push("- 存在失败任务，建议检查错误原因后重试")
    } else if (summary.hasExceptions) {
      lines.push("- 存在需要关注的任务，请查看详细结果")
    } else {
      lines.push("- 所有任务已完成，可以继续下一步工作")
    }

    return lines.join("\n")
  }
}

let instance: SecretaryQueueManager | null = null

export function getSecretaryQueueManager(options?: SecretaryQueueOptions): SecretaryQueueManager {
  if (!instance) {
    instance = new SecretaryQueueManager(options)
  }
  return instance
}

export function resetSecretaryQueueManager(): void {
  instance = null
}