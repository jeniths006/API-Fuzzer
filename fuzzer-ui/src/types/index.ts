// ─── Types ───────────────────────────────────────────────────────────────────

export type NavItem = {
    id: string
    label: string
    icon: React.ReactNode
    badge?: number
}

export type ScanStatus = 'running' | 'completed' | 'failed' | 'queued'
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived'
