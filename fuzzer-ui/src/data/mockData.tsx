// ─── Data ─────────────────────────────────────────────────────────────────────


import type {
    NavItem,
    ScanStatus,
    SeverityLevel,
    ProjectStatus
} from "@/types"

import {
    IconDashboard,
    IconProjects,
    IconPayload,
    IconHistory,
    IconProfile,
    IconSettings,
    IconSearch,
    IconBell,
    IconChevronDown,
    IconPlus,
    IconArrowRight,
    IconShield,
    IconActivity,
    IconTarget,
    IconCode,
    IconZap
} from "@/components/common/Icons"



export const recentProjects: Array<{
    id: string
    name: string
    target: string
    status: ProjectStatus
    endpoints: number
    findings: number
    critical: number
    lastScan: string
    owner: string
}> = [
    { id: 'PRJ-014', name: 'Payment Gateway v2 Audit', target: 'api.payments.internal', status: 'active', endpoints: 87, findings: 14, critical: 2, lastScan: '2026-07-31 09:41', owner: 'M. Alves' },
    { id: 'PRJ-013', name: 'Auth Service Hardening', target: 'auth.svc.prod:8443', status: 'active', endpoints: 23, findings: 5, critical: 1, lastScan: '2026-07-31 09:38', owner: 'R. Okeke' },
    { id: 'PRJ-012', name: 'GraphQL Gateway Review', target: 'graphql.gateway', status: 'paused', endpoints: 41, findings: 3, critical: 0, lastScan: '2026-07-30 17:12', owner: 'M. Alves' },
    { id: 'PRJ-011', name: 'Admin API IDOR Assessment', target: 'api.users.internal/admin', status: 'completed', endpoints: 112, findings: 22, critical: 4, lastScan: '2026-07-29 14:05', owner: 'S. Petrov' },
    { id: 'PRJ-010', name: 'CDN Upload Endpoint Test', target: 'cdn.assets.prod/upload', status: 'active', endpoints: 6, findings: 0, critical: 0, lastScan: '2026-07-28 11:30', owner: 'L. Chen' },
]

export const recentScans: Array<{
    id: string
    project: string
    target: string
    status: ScanStatus
    findings: number
    critical: number
    high: number
    medium: number
    duration: string
    timestamp: string
    method: string
}> = [
    { id: 'SCN-0091', project: 'PRJ-014', target: 'api.payments.internal/v2/transactions', status: 'completed', findings: 14, critical: 2, high: 5, medium: 4, duration: '4m 12s', timestamp: '2026-07-31 09:41', method: 'OWASP API Top 10' },
    { id: 'SCN-0090', project: 'PRJ-013', target: 'auth.svc.prod:8443/oauth/token', status: 'running', findings: 3, critical: 0, high: 1, medium: 2, duration: '1m 08s', timestamp: '2026-07-31 09:38', method: 'JWT Fuzzer' },
    { id: 'SCN-0089', project: 'PRJ-012', target: 'graphql.gateway/query', status: 'failed', findings: 0, critical: 0, high: 0, medium: 0, duration: '0m 44s', timestamp: '2026-07-31 09:21', method: 'GraphQL Introspection' },
    { id: 'SCN-0088', project: 'PRJ-011', target: 'api.users.internal/admin/accounts', status: 'completed', findings: 7, critical: 1, high: 2, medium: 3, duration: '6m 55s', timestamp: '2026-07-31 08:57', method: 'IDOR / BOLA' },
    { id: 'SCN-0087', project: 'PRJ-010', target: 'cdn.assets.prod/upload', status: 'queued', findings: 0, critical: 0, high: 0, medium: 0, duration: '—', timestamp: '2026-07-31 08:45', method: 'File Upload' },
    { id: 'SCN-0086', project: 'PRJ-014', target: 'api.payments.internal/v2/refunds', status: 'completed', findings: 2, critical: 0, high: 1, medium: 1, duration: '2m 31s', timestamp: '2026-07-31 08:20', method: 'Rate Limit' },
]

export const vulnOverview: Array<{
    id: string
    title: string
    cwe: string
    severity: SeverityLevel
    affected: number
    owasp: string
}> = [
    { id: 'F-441', title: 'Broken Object Level Authorization', cwe: 'CWE-639', severity: 'critical', affected: 3, owasp: 'API1' },
    { id: 'F-440', title: 'JWT None Algorithm Accepted', cwe: 'CWE-347', severity: 'critical', affected: 1, owasp: 'API2' },
    { id: 'F-439', title: 'Mass Assignment via PATCH', cwe: 'CWE-915', severity: 'high', affected: 2, owasp: 'API3' },
    { id: 'F-438', title: 'Absent Rate Limiting on Auth', cwe: 'CWE-307', severity: 'high', affected: 4, owasp: 'API4' },
    { id: 'F-437', title: 'Verbose Error Disclosure', cwe: 'CWE-209', severity: 'medium', affected: 6, owasp: 'API8' },
    { id: 'F-436', title: 'Deprecated TLS 1.0 Negotiated', cwe: 'CWE-326', severity: 'medium', affected: 2, owasp: 'API8' },
    { id: 'F-435', title: 'Missing HSTS Header', cwe: 'CWE-523', severity: 'low', affected: 5, owasp: 'API7' },
    { id: 'F-434', title: 'Server Version Exposed', cwe: 'CWE-200', severity: 'info', affected: 8, owasp: 'API7' },
]

export const activityFeed: Array<{
    id: string
    type: 'scan_complete' | 'finding' | 'scan_start' | 'scan_fail' | 'project_create' | 'scan_queue'
    message: string
    detail: string
    time: string
    ref?: string
}> = [
    { id: 'a1', type: 'finding', message: 'Critical finding detected', detail: 'BOLA on /v2/accounts/{id} · SCN-0091', time: '9:41 AM', ref: 'F-441' },
    { id: 'a2', type: 'scan_complete', message: 'Scan completed', detail: 'SCN-0091 · 14 findings · 4m 12s', time: '9:41 AM', ref: 'SCN-0091' },
    { id: 'a3', type: 'scan_start', message: 'Scan started', detail: 'SCN-0090 · auth.svc.prod:8443/oauth', time: '9:38 AM', ref: 'SCN-0090' },
    { id: 'a4', type: 'scan_fail', message: 'Scan failed', detail: 'SCN-0089 · connection refused on graphql.gateway', time: '9:21 AM', ref: 'SCN-0089' },
    { id: 'a5', type: 'scan_complete', message: 'Scan completed', detail: 'SCN-0088 · 7 findings · 6m 55s', time: '8:57 AM', ref: 'SCN-0088' },
    { id: 'a6', type: 'scan_queue', message: 'Scan queued', detail: 'SCN-0087 · cdn.assets.prod/upload', time: '8:45 AM', ref: 'SCN-0087' },
    { id: 'a7', type: 'project_create', message: 'Project created', detail: 'PRJ-014 · Payment Gateway v2 Audit', time: '8:30 AM', ref: 'PRJ-014' },
    { id: 'a8', type: 'scan_complete', message: 'Scan completed', detail: 'SCN-0086 · 2 findings · 2m 31s', time: '8:20 AM', ref: 'SCN-0086' },
]

export const dashStats = [
    { label: 'Projects', value: 14, sub: '5 active', icon: <IconProjects /> },
    { label: 'Endpoints', value: 312, sub: 'indexed', icon: <IconTarget /> },
    { label: 'Payloads', value: '4,218', sub: '12 collections', icon: <IconPayload /> },
    { label: 'Scans', value: 91, sub: '6 this week', icon: <IconActivity /> },
    { label: 'Findings', value: 46, sub: '3 critical open', icon: <IconShield /> },
]

export const severityColors: Record<SeverityLevel, string> = {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#F59E0B',
    low: '#22C55E',
    info: '#6B7280',
}

export const statusColors: Record<ScanStatus, string> = {
    running: '#3B82F6',
    completed: '#22C55E',
    failed: '#EF4444',
    queued: '#6B7280',
}

export const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
    { id: 'projects', label: 'Projects', icon: <IconProjects />, badge: 3 },
    { id: 'payloads', label: 'Payload Library', icon: <IconPayload /> },
    { id: 'history', label: 'Scan History', icon: <IconHistory />, badge: 1 },
    { id: 'profile', label: 'Profile', icon: <IconProfile /> },
    { id: 'settings', label: 'Settings', icon: <IconSettings /> },
]
