import { useState } from 'react'

import type {
    NavItem,
    ScanStatus,
    SeverityLevel,
    ProjectStatus
} from "./types"

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
} from "./components/common/Icons"

import {
    recentProjects,
    recentScans,
    vulnOverview,
    activityFeed,
    dashStats,
    severityColors,
    statusColors,
    navItems
} from "./data/mockData"


// ─── Sub-components ───────────────────────────────────────────────────────────

// Colored only for: critical, medium (warning), low (success). Everything else monochrome.
function SeverityBadge({ level }: { level: SeverityLevel }) {
  const colored: Partial<Record<SeverityLevel, { bg: string; border: string; text: string }>> = {
    critical: { bg: '#EF444418', border: '#EF444430', text: '#EF4444' },
    medium:   { bg: '#F59E0B18', border: '#F59E0B30', text: '#F59E0B' },
    low:      { bg: '#22C55E18', border: '#22C55E30', text: '#22C55E' },
  }
  const c = colored[level]
  return c ? (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 4,
      backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
    }}>{level}</span>
  ) : (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 4,
      backgroundColor: '#2A2E33', border: '1px solid #363B42', color: '#B6BDC8',
      fontSize: 10, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
      fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
    }}>{level}</span>
  )
}

function StatusPill({ status }: { status: ScanStatus }) {
  type Cfg = { bg: string; text: string; dot?: string; pulse?: boolean }
  const cfg: Record<ScanStatus, Cfg> = {
    completed: { bg: '#22C55E18', text: '#22C55E', dot: '#22C55E' },
    failed:    { bg: '#EF444418', text: '#EF4444', dot: '#EF4444' },
    running:   { bg: '#3B82F618', text: '#3B82F6', dot: '#3B82F6', pulse: true },
    queued:    { bg: '#2A2E33',   text: '#6B7280', dot: '#4B5563' },
  }
  const labels: Record<ScanStatus, string> = { running: 'Running', completed: 'Done', failed: 'Failed', queued: 'Queued' }
  const c = cfg[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 7px', borderRadius: 4,
      backgroundColor: c.bg, color: c.text,
      fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-mono)',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', backgroundColor: c.dot, flexShrink: 0,
        ...(c.pulse ? { animation: 'pulse 1.4s ease-in-out infinite' } : {}),
      }} />
      {labels[status]}
    </span>
  )
}

function ProjectStatusPill({ status }: { status: ProjectStatus }) {
  type Cfg = { bg: string; text: string }
  const cfg: Record<ProjectStatus, Cfg> = {
    active:    { bg: '#22C55E18', text: '#22C55E' },
    paused:    { bg: '#F59E0B18', text: '#F59E0B' },
    completed: { bg: '#2A2E33',   text: '#6B7280' },
    archived:  { bg: '#2A2E33',   text: '#4B5563' },
  }
  const c = cfg[status]
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      backgroundColor: c.bg, color: c.text,
      fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-mono)', textTransform: 'capitalize',
    }}>{status}</span>
  )
}

function TableCard({
  title, action, children,
}: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '12px 18px', borderBottom: '1px solid #2A2E33', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#F5F5F5', letterSpacing: '-0.01em' }}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  )
}

function TH({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, color: '#4B5563',
      textTransform: 'uppercase', letterSpacing: '0.07em',
      ...style,
    }}>{children}</span>
  )
}

function ViewAllBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 4,
      fontSize: 11, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    }}
      onMouseEnter={e => (e.currentTarget.style.color = '#B6BDC8')}
      onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
    >
      View all <IconArrowRight />
    </button>
  )
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

function DashboardView() {
  const [activeVulnFilter, setActiveVulnFilter] = useState<SeverityLevel | 'all'>('all')

  const filteredVulns = activeVulnFilter === 'all'
    ? vulnOverview
    : vulnOverview.filter(v => v.severity === activeVulnFilter)

  const vulnCounts = {
    critical: vulnOverview.filter(v => v.severity === 'critical').length,
    high: vulnOverview.filter(v => v.severity === 'high').length,
    medium: vulnOverview.filter(v => v.severity === 'medium').length,
    low: vulnOverview.filter(v => v.severity === 'low').length,
    info: vulnOverview.filter(v => v.severity === 'info').length,
  }

  const activityIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    finding:        { icon: <IconShield />,   color: '#EF4444' },
    scan_complete:  { icon: <IconActivity />, color: '#22C55E' },
    scan_start:     { icon: <IconActivity />, color: '#3B82F6' },
    scan_fail:      { icon: <IconActivity />, color: '#EF4444' },
    project_create: { icon: <IconProjects />, color: '#B6BDC8' },
    scan_queue:     { icon: <IconActivity />, color: '#6B7280' },
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F5', margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize: 11, color: '#6B7280', margin: '3px 0 0' }}>
            Thursday, 31 July 2026 &nbsp;·&nbsp; production-audit
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 7,
            backgroundColor: 'transparent', border: '1px solid #2A2E33',
            color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
          >
            <IconProjects /> New Project
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 7,
            backgroundColor: '#3B82F6', border: 'none',
            color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>
            <IconPlus /> New Scan
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {dashStats.map((s, i) => (
          <div key={s.label} style={{
            backgroundColor: '#1A1D21',
            border: '1px solid #2A2E33',
            borderRadius: 9,
            padding: '14px 16px',
            cursor: 'default',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</span>
              <span style={{ color: i === 4 ? '#EF4444' : '#4B5563', display: 'flex' }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#F5F5F5', lineHeight: 1, marginBottom: 4, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#6B7280' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Main 2-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14 }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Recent Projects table */}
          <TableCard title="Recent Projects" action={<ViewAllBtn />}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '76px 1fr 140px 68px 62px 62px 80px',
              padding: '7px 18px',
              borderBottom: '1px solid #1F2328',
            }}>
              <TH>ID</TH><TH>Name / Target</TH><TH>Owner</TH>
              <TH style={{ textAlign: 'right' }}>Endpoints</TH>
              <TH style={{ textAlign: 'right' }}>Findings</TH>
              <TH style={{ textAlign: 'right' }}>Critical</TH>
              <TH>Status</TH>
            </div>
            <div>
              {recentProjects.map((p, i) => (
                <div key={p.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '76px 1fr 140px 68px 62px 62px 80px',
                  padding: '9px 18px',
                  borderBottom: i < recentProjects.length - 1 ? '1px solid #1F2328' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1F2328')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6' }}>{p.id}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#F5F5F5', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6B7280', marginTop: 1 }}>{p.target}</div>
                  </div>
                  <span style={{ fontSize: 11, color: '#B6BDC8' }}>{p.owner}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8' }}>{p.endpoints}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: p.findings > 0 ? '#F5F5F5' : '#4B5563' }}>{p.findings}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: p.critical > 0 ? '#EF4444' : '#4B5563' }}>
                    {p.critical > 0 ? p.critical : '—'}
                  </span>
                  <span><ProjectStatusPill status={p.status} /></span>
                </div>
              ))}
            </div>
          </TableCard>

          {/* Recent Scan Results table */}
          <TableCard title="Recent Scan Results" action={<ViewAllBtn />}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 200px 1fr 72px 48px 48px 48px 70px',
              padding: '7px 18px',
              borderBottom: '1px solid #1F2328',
            }}>
              <TH>Scan ID</TH>
              <TH>Target</TH>
              <TH>Method</TH>
              <TH>Status</TH>
              <TH style={{ textAlign: 'right' }}>C</TH>
              <TH style={{ textAlign: 'right' }}>H</TH>
              <TH style={{ textAlign: 'right' }}>M</TH>
              <TH style={{ textAlign: 'right' }}>Duration</TH>
            </div>
            <div>
              {recentScans.map((s, i) => (
                <div key={s.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 200px 1fr 72px 48px 48px 48px 70px',
                  padding: '8px 18px',
                  borderBottom: i < recentScans.length - 1 ? '1px solid #1F2328' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1F2328')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6' }}>{s.id}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#B6BDC8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.target}</div>
                    <div style={{ fontSize: 10, color: '#4B5563', marginTop: 1 }}>{s.timestamp}</div>
                  </div>
                  <span style={{ fontSize: 11, color: '#6B7280' }}>{s.method}</span>
                  <StatusPill status={s.status} />
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: s.critical > 0 ? '#EF4444' : '#4B5563', fontWeight: s.critical > 0 ? 600 : 400 }}>{s.critical > 0 ? s.critical : '—'}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: s.high > 0 ? '#B6BDC8' : '#4B5563' }}>{s.high > 0 ? s.high : '—'}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: s.medium > 0 ? '#F59E0B' : '#4B5563' }}>{s.medium > 0 ? s.medium : '—'}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280' }}>{s.duration}</span>
                </div>
              ))}
            </div>
          </TableCard>

          {/* Quick Actions */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
              Quick Actions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {([
                { icon: <IconCode />, label: 'Request Editor', desc: 'Replay HTTP requests' },
                { icon: <IconTarget />, label: 'Fuzzer', desc: 'Inject payload sets' },
                { icon: <IconShield />, label: 'Auth Probe', desc: 'Test OAuth & JWT' },
                { icon: <IconZap />, label: 'Diff Scanner', desc: 'Compare API versions' },
              ]).map(a => (
                <button key={a.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  gap: 6, padding: '12px 14px',
                  backgroundColor: '#1A1D21', border: '1px solid #2A2E33',
                  borderRadius: 9, cursor: 'pointer', textAlign: 'left',
                  transition: 'border-color 0.12s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
                >
                  <span style={{ color: '#6B7280', display: 'flex' }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#F5F5F5' }}>{a.label}</div>
                    <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>{a.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Vulnerability Overview */}
          <div style={{ backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 10, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #2A2E33', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#F5F5F5' }}>Vulnerability Overview</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6B7280' }}>{vulnOverview.length} total</span>
            </div>

            {/* Stacked bar */}
            <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid #2A2E33' }}>
              <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
                {([
                  { level: 'critical' as SeverityLevel, n: vulnCounts.critical },
                  { level: 'high' as SeverityLevel,     n: vulnCounts.high },
                  { level: 'medium' as SeverityLevel,   n: vulnCounts.medium },
                  { level: 'low' as SeverityLevel,      n: vulnCounts.low },
                  { level: 'info' as SeverityLevel,     n: vulnCounts.info },
                ]).filter(x => x.n > 0).map(x => (
                  <div key={x.level} style={{
                    flex: x.n, backgroundColor: severityColors[x.level],
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                {([
                  { level: 'critical' as SeverityLevel, n: vulnCounts.critical, label: 'Crit' },
                  { level: 'high' as SeverityLevel,     n: vulnCounts.high,     label: 'High' },
                  { level: 'medium' as SeverityLevel,   n: vulnCounts.medium,   label: 'Med'  },
                  { level: 'low' as SeverityLevel,      n: vulnCounts.low,      label: 'Low'  },
                  { level: 'info' as SeverityLevel,     n: vulnCounts.info,     label: 'Info' },
                ]).map(x => (
                  <button key={x.level}
                    onClick={() => setActiveVulnFilter(activeVulnFilter === x.level ? 'all' : x.level)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      opacity: activeVulnFilter !== 'all' && activeVulnFilter !== x.level ? 0.35 : 1,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 1, backgroundColor: severityColors[x.level], flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: '#6B7280' }}>{x.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#B6BDC8' }}>{x.n}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vuln list */}
            <div style={{ overflowY: 'auto', maxHeight: 300 }}>
              {filteredVulns.map((v, i) => (
                <div key={v.id} style={{
                  padding: '9px 16px',
                  borderBottom: i < filteredVulns.length - 1 ? '1px solid #1F2328' : 'none',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1F2328')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#F5F5F5', fontWeight: 500, lineHeight: 1.35, flex: 1 }}>{v.title}</span>
                    <SeverityBadge level={v.severity} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#4B5563', backgroundColor: '#2A2E33', padding: '1px 5px', borderRadius: 3 }}>{v.cwe}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#4B5563', backgroundColor: '#2A2E33', padding: '1px 5px', borderRadius: 3 }}>OWASP {v.owasp}</span>
                    <span style={{ fontSize: 10, color: '#4B5563', marginLeft: 'auto' }}>{v.affected} endpoint{v.affected !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div style={{ backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 10, flex: 1 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #2A2E33', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#F5F5F5' }}>Activity</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#22C55E' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block', animation: 'pulse 1.4s ease-in-out infinite' }} />
                live
              </span>
            </div>
            <div style={{ padding: '8px 0', overflowY: 'auto' }}>
              {activityFeed.map((item, i) => {
                const ic = activityIcons[item.type]
                return (
                  <div key={item.id} style={{
                    display: 'flex', gap: 11,
                    padding: '7px 16px',
                    cursor: 'pointer', position: 'relative',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1F2328')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* timeline line */}
                    {i < activityFeed.length - 1 && (
                      <div style={{
                        position: 'absolute', left: 22, top: 28, bottom: -7,
                        width: 1, backgroundColor: '#1F2328',
                      }} />
                    )}
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      backgroundColor: ic.color + '18',
                      border: `1px solid ${ic.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: ic.color, marginTop: 1,
                    }}>
                      {ic.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: '#B6BDC8', fontWeight: 500 }}>{item.message}</div>
                      <div style={{ fontSize: 10, color: '#4B5563', marginTop: 2, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.detail}</div>
                    </div>
                    <span style={{ fontSize: 10, color: '#4B5563', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{item.time}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

// ─── Project Workspace data ───────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type EndpointScanStatus = 'clean' | 'vulnerable' | 'pending' | 'never'

const methodStyle: Record<HttpMethod, { bg: string; text: string }> = {
  GET:    { bg: '#2A2E33',    text: '#9CA3AF' },
  POST:   { bg: '#3B82F618', text: '#3B82F6' },
  PUT:    { bg: '#F9731618', text: '#F97316' },
  PATCH:  { bg: '#F59E0B18', text: '#F59E0B' },
  DELETE: { bg: '#EF444418', text: '#EF4444' },
}

const projectEndpoints: Array<{
  id: string
  method: HttpMethod
  name: string
  url: string
  contentType: string
  lastScan: string
  scanStatus: EndpointScanStatus
  findings: number
}> = [
  { id: 'EP-001', method: 'GET',    name: 'List Transactions',      url: '/v2/transactions',                contentType: 'application/json', lastScan: '2026-07-31 09:41', scanStatus: 'clean',      findings: 0 },
  { id: 'EP-002', method: 'POST',   name: 'Create Transaction',     url: '/v2/transactions',                contentType: 'application/json', lastScan: '2026-07-31 09:41', scanStatus: 'vulnerable', findings: 3 },
  { id: 'EP-003', method: 'GET',    name: 'Get Transaction by ID',  url: '/v2/transactions/{id}',           contentType: 'application/json', lastScan: '2026-07-31 09:41', scanStatus: 'vulnerable', findings: 2 },
  { id: 'EP-004', method: 'DELETE', name: 'Cancel Transaction',     url: '/v2/transactions/{id}/cancel',    contentType: 'application/json', lastScan: '2026-07-31 09:41', scanStatus: 'clean',      findings: 0 },
  { id: 'EP-005', method: 'POST',   name: 'Initiate Refund',        url: '/v2/refunds',                     contentType: 'application/json', lastScan: '2026-07-31 08:20', scanStatus: 'clean',      findings: 0 },
  { id: 'EP-006', method: 'GET',    name: 'Get Refund Status',      url: '/v2/refunds/{id}',                contentType: 'application/json', lastScan: '2026-07-31 08:20', scanStatus: 'vulnerable', findings: 1 },
  { id: 'EP-007', method: 'POST',   name: 'Authenticate',           url: '/v2/auth/token',                  contentType: 'application/json', lastScan: '2026-07-30 14:11', scanStatus: 'vulnerable', findings: 5 },
  { id: 'EP-008', method: 'PUT',    name: 'Update Account Details', url: '/v2/accounts/{id}',               contentType: 'application/json', lastScan: '2026-07-30 14:11', scanStatus: 'vulnerable', findings: 2 },
  { id: 'EP-009', method: 'PATCH',  name: 'Partial Account Update', url: '/v2/accounts/{id}',               contentType: 'application/json', lastScan: '2026-07-30 14:11', scanStatus: 'clean',      findings: 0 },
  { id: 'EP-010', method: 'GET',    name: 'List Payment Methods',   url: '/v2/payment-methods',             contentType: 'application/json', lastScan: '2026-07-29 11:05', scanStatus: 'pending',    findings: 0 },
  { id: 'EP-011', method: 'POST',   name: 'Add Payment Method',     url: '/v2/payment-methods',             contentType: 'application/json', lastScan: '—',                scanStatus: 'never',      findings: 0 },
  { id: 'EP-012', method: 'DELETE', name: 'Remove Payment Method',  url: '/v2/payment-methods/{id}',        contentType: 'application/json', lastScan: '—',                scanStatus: 'never',      findings: 0 },
  { id: 'EP-013', method: 'GET',    name: 'Export Statement',       url: '/v2/accounts/{id}/statement',     contentType: 'application/octet-stream', lastScan: '2026-07-29 11:05', scanStatus: 'clean', findings: 0 },
  { id: 'EP-014', method: 'POST',   name: 'Webhook Subscribe',      url: '/v2/webhooks',                    contentType: 'application/json', lastScan: '—',                scanStatus: 'never',      findings: 0 },
]

const CONTENT_TYPES = [
  'application/json',
  'application/xml',
  'multipart/form-data',
  'application/x-www-form-urlencoded',
  'text/plain',
  'application/octet-stream',
]

const AUTH_TYPES = ['None', 'Bearer Token', 'API Key', 'Basic Auth', 'OAuth 2.0', 'HMAC Signature']

// ─── Shared form input style ──────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: '100%',
  height: 32,
  backgroundColor: '#111315',
  border: '1px solid #2A2E33',
  borderRadius: 7,
  padding: '0 10px',
  color: '#F5F5F5',
  fontSize: 12,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
}

// ─── Method badge ─────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: HttpMethod }) {
  const s = methodStyle[method]
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 0',
      width: 52,
      textAlign: 'center',
      borderRadius: 4,
      backgroundColor: s.bg,
      color: s.text,
      fontSize: 10,
      fontWeight: 700,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.04em',
      flexShrink: 0,
    }}>{method}</span>
  )
}

// ─── Endpoint scan status pill ────────────────────────────────────────────────

function ScanStatusPill({ status, findings }: { status: EndpointScanStatus; findings: number }) {
  if (status === 'never') return (
    <span style={{ fontSize: 10, color: '#4B5563', fontFamily: 'var(--font-mono)' }}>Never scanned</span>
  )
  if (status === 'pending') return (
    <span style={{ fontSize: 10, color: '#F59E0B', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block', animation: 'pulse 1.4s ease-in-out infinite' }} />
      In progress
    </span>
  )
  if (status === 'vulnerable') return (
    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#EF4444', flexShrink: 0 }} />
      {findings} finding{findings !== 1 ? 's' : ''}
    </span>
  )
  return (
    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#22C55E', display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#22C55E', flexShrink: 0 }} />
      Clean
    </span>
  )
}

// ─── Endpoint detail enrichment ──────────────────────────────────────────────

type EndpointDetail = {
  description: string
  auth: string
  pathParams: Array<{ name: string; type: string; required: boolean; description: string }>
  queryParams: Array<{ key: string; value: string; description: string }>
  headers: Array<{ key: string; value: string; description: string }>
  cookies: Array<{ key: string; value: string; description: string }>
  bodySchema: string
  recentScans: Array<{ id: string; date: string; status: ScanStatus; findings: number; critical: number; category: PayloadCategory }>
}

const endpointDetails: Record<string, EndpointDetail> = {
  'EP-001': {
    description: 'Returns a paginated list of transactions for the authenticated account. Supports filtering by date, status, and amount range.',
    auth: 'Bearer Token',
    pathParams: [],
    queryParams: [
      { key: 'page',       value: '1',          description: 'Page number (1-indexed)' },
      { key: 'limit',      value: '20',         description: 'Results per page (max 100)' },
      { key: 'status',     value: 'completed',  description: 'Filter by transaction status' },
      { key: 'from_date',  value: '2026-07-01', description: 'ISO 8601 date range start' },
    ],
    headers: [
      { key: 'Authorization', value: 'Bearer <token>', description: 'JWT access token' },
      { key: 'X-Account-ID',  value: 'acct_01XYZ',     description: 'Account scoping header' },
    ],
    cookies: [],
    bodySchema: '',
    recentScans: [
      { id: 'SCN-0091', date: '2026-07-31 09:41', status: 'completed', findings: 0, critical: 0, category: 'SQL Injection' },
    ],
  },
  'EP-002': {
    description: 'Creates a new payment transaction. Accepts source card, amount, currency, and optional idempotency key to prevent duplicate charges.',
    auth: 'Bearer Token',
    pathParams: [],
    queryParams: [],
    headers: [
      { key: 'Authorization',   value: 'Bearer <token>', description: 'JWT access token' },
      { key: 'Idempotency-Key', value: 'uuid-v4',        description: 'Prevents duplicate charges on retry' },
      { key: 'Content-Type',    value: 'application/json', description: '' },
    ],
    cookies: [],
    bodySchema: `{
  "amount": 1500,
  "currency": "USD",
  "source": {
    "card_id": "card_01ABC",
    "cvv": "***"
  },
  "account_id": "acct_01XYZ",
  "description": "Order #4821",
  "idempotency_key": "3f2a1b..."
}`,
    recentScans: [
      { id: 'SCN-0091', date: '2026-07-31 09:41', status: 'completed', findings: 14, critical: 2, category: 'SQL Injection' },
      { id: 'SCN-0083', date: '2026-07-30 11:30', status: 'completed', findings: 5, critical: 1, category: 'SQL Injection' },
    ],
  },
  'EP-003': {
    description: 'Retrieves full details of a single transaction by its unique ID. Returns source, destination, status, timestamps, and audit trail.',
    auth: 'Bearer Token',
    pathParams: [
      { name: 'id', type: 'string', required: true, description: 'Transaction unique identifier (txn_*)' },
    ],
    queryParams: [
      { key: 'expand', value: 'audit_trail', description: 'Comma-separated list of relations to expand' },
    ],
    headers: [
      { key: 'Authorization', value: 'Bearer <token>', description: 'JWT access token' },
    ],
    cookies: [],
    bodySchema: '',
    recentScans: [
      { id: 'SCN-0088', date: '2026-07-31 08:57', status: 'completed', findings: 7, critical: 1, category: 'SQL Injection' },
    ],
  },
  'EP-004': {
    description: 'Cancels an in-flight or pending transaction. Idempotent — cancelling an already-cancelled transaction returns 200.',
    auth: 'Bearer Token',
    pathParams: [
      { name: 'id', type: 'string', required: true, description: 'Transaction ID to cancel (txn_*)' },
    ],
    queryParams: [],
    headers: [
      { key: 'Authorization', value: 'Bearer <token>', description: 'JWT access token' },
    ],
    cookies: [],
    bodySchema: `{ "reason": "customer_request" }`,
    recentScans: [
      { id: 'SCN-0091', date: '2026-07-31 09:41', status: 'completed', findings: 0, critical: 0, category: 'SQL Injection' },
    ],
  },
  'EP-005': {
    description: 'Initiates a full or partial refund for a settled transaction. Creates a reverse transaction linked to the original.',
    auth: 'Bearer Token',
    pathParams: [],
    queryParams: [],
    headers: [
      { key: 'Authorization', value: 'Bearer <token>', description: 'JWT access token' },
      { key: 'Idempotency-Key', value: 'uuid-v4', description: 'Prevents duplicate refunds on retry' },
    ],
    cookies: [],
    bodySchema: `{
  "transaction_id": "txn_01XYZ",
  "amount": 500,
  "reason": "duplicate_charge"
}`,
    recentScans: [
      { id: 'SCN-0086', date: '2026-07-31 08:20', status: 'completed', findings: 2, critical: 0, category: 'Custom' },
    ],
  },
  'EP-006': {
    description: 'Polls the current status of an initiated refund. Refunds are asynchronous and may take 3–5 business days to settle.',
    auth: 'Bearer Token',
    pathParams: [
      { name: 'id', type: 'string', required: true, description: 'Refund ID (ref_*)' },
    ],
    queryParams: [],
    headers: [
      { key: 'Authorization', value: 'Bearer <token>', description: 'JWT access token' },
    ],
    cookies: [],
    bodySchema: '',
    recentScans: [
      { id: 'SCN-0086', date: '2026-07-31 08:20', status: 'completed', findings: 1, critical: 0, category: 'Custom' },
    ],
  },
  'EP-007': {
    description: 'Exchanges client credentials (or refresh token) for a short-lived JWT access token. Implements OAuth 2.0 client_credentials grant.',
    auth: 'None',
    pathParams: [],
    queryParams: [],
    headers: [
      { key: 'Content-Type', value: 'application/x-www-form-urlencoded', description: '' },
    ],
    cookies: [
      { key: 'refresh_token', value: '(httpOnly)', description: 'Refresh token set by server; httpOnly, Secure, SameSite=Strict' },
    ],
    bodySchema: `grant_type=client_credentials
&client_id=<id>
&client_secret=<secret>
&scope=transactions:read transactions:write`,
    recentScans: [
      { id: 'SCN-0085', date: '2026-07-30 17:12', status: 'completed', findings: 0, critical: 0, category: 'SSRF' },
      { id: 'SCN-0083', date: '2026-07-30 11:30', status: 'completed', findings: 5, critical: 1, category: 'SQL Injection' },
      { id: 'SCN-0080', date: '2026-07-28 09:14', status: 'completed', findings: 2, critical: 1, category: 'JWT' },
    ],
  },
  'EP-008': {
    description: 'Full replacement of mutable account fields (name, email, address, preferences). Immutable fields (id, created_at) are ignored.',
    auth: 'Bearer Token',
    pathParams: [
      { name: 'id', type: 'string', required: true, description: 'Account ID (acct_*)' },
    ],
    queryParams: [],
    headers: [
      { key: 'Authorization', value: 'Bearer <token>', description: 'JWT access token' },
      { key: 'Content-Type', value: 'application/json', description: '' },
    ],
    cookies: [],
    bodySchema: `{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "address": {
    "line1": "123 Main St",
    "city": "New York",
    "country": "US",
    "postal_code": "10001"
  }
}`,
    recentScans: [
      { id: 'SCN-0084', date: '2026-07-30 14:11', status: 'completed', findings: 4, critical: 0, category: 'XSS' },
    ],
  },
  'EP-009': { description: 'Applies a partial update using JSON Merge Patch (RFC 7396). Only fields present in the request body are updated.', auth: 'Bearer Token', pathParams: [{ name: 'id', type: 'string', required: true, description: 'Account ID (acct_*)' }], queryParams: [], headers: [{ key: 'Authorization', value: 'Bearer <token>', description: '' }, { key: 'Content-Type', value: 'application/merge-patch+json', description: '' }], cookies: [], bodySchema: '{ "email": "new@example.com" }', recentScans: [] },
  'EP-010': { description: 'Lists all saved payment methods for the authenticated account. Returns masked card numbers and expiry dates.', auth: 'Bearer Token', pathParams: [], queryParams: [{ key: 'type', value: 'card', description: 'Filter by method type (card, bank_account)' }], headers: [{ key: 'Authorization', value: 'Bearer <token>', description: '' }], cookies: [], bodySchema: '', recentScans: [] },
  'EP-011': { description: 'Tokenizes and saves a new payment method (card or bank account) to the account vault.', auth: 'Bearer Token', pathParams: [], queryParams: [], headers: [{ key: 'Authorization', value: 'Bearer <token>', description: '' }], cookies: [], bodySchema: '{\n  "type": "card",\n  "number": "4242424242424242",\n  "exp_month": 12,\n  "exp_year": 2028,\n  "cvc": "***"\n}', recentScans: [] },
  'EP-012': { description: 'Permanently removes a saved payment method. Transactions already linked to this method are unaffected.', auth: 'Bearer Token', pathParams: [{ name: 'id', type: 'string', required: true, description: 'Payment method ID (pm_*)' }], queryParams: [], headers: [{ key: 'Authorization', value: 'Bearer <token>', description: '' }], cookies: [], bodySchema: '', recentScans: [] },
  'EP-013': { description: 'Generates and streams a downloadable account statement as PDF or CSV for a given date range.', auth: 'Bearer Token', pathParams: [{ name: 'id', type: 'string', required: true, description: 'Account ID (acct_*)' }], queryParams: [{ key: 'from', value: '2026-07-01', description: 'Start date (ISO 8601)' }, { key: 'to', value: '2026-07-31', description: 'End date (ISO 8601)' }, { key: 'format', value: 'pdf', description: 'Output format: pdf or csv' }], headers: [{ key: 'Authorization', value: 'Bearer <token>', description: '' }], cookies: [], bodySchema: '', recentScans: [] },
  'EP-014': { description: 'Registers a URL to receive webhook event notifications. Returns a secret for validating HMAC signatures on incoming payloads.', auth: 'Bearer Token', pathParams: [], queryParams: [], headers: [{ key: 'Authorization', value: 'Bearer <token>', description: '' }], cookies: [], bodySchema: '{\n  "url": "https://your.server/webhook",\n  "events": ["transaction.completed", "refund.created"],\n  "description": "Production hook"\n}', recentScans: [] },
}

// ─── Endpoint Detail Drawer ───────────────────────────────────────────────────

type DrawerEndpoint = typeof projectEndpoints[number]

function EndpointDrawer({
  ep,
  onClose,
  onDelete,
}: {
  ep: DrawerEndpoint
  onClose: () => void
  onDelete: () => void
}) {
  const detail = endpointDetails[ep.id] ?? {
    description: '', auth: 'Bearer Token', pathParams: [], queryParams: [],
    headers: [], cookies: [], bodySchema: '', recentScans: [],
  }
  const [activeTab, setActiveTab] = useState<'overview' | 'request' | 'scans'>('overview')

  const pathParams = detail.pathParams.length === 0
    ? Array.from(ep.url.matchAll(/\{(\w+)\}/g)).map(m => ({ name: m[1], type: 'string', required: true, description: '' }))
    : detail.pathParams

  const severityColors: Record<string, string> = { critical: '#EF4444', high: '#F97316', medium: '#F59E0B' }

  function MiniLabel({ children }: { children: React.ReactNode }) {
    return (
      <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
        {children}
      </div>
    )
  }

  function KVGrid({ rows }: { rows: Array<{ key: string; value: string; description?: string }> }) {
    if (rows.length === 0) return (
      <div style={{ fontSize: 11, color: '#4B5563', fontFamily: 'var(--font-mono)', padding: '6px 0' }}>—</div>
    )
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '140px 1fr',
            padding: '5px 8px', borderRadius: 5,
            backgroundColor: i % 2 === 0 ? '#1A1D21' : 'transparent',
            gap: 8, alignItems: 'start',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6', wordBreak: 'break-all' }}>{r.key}</span>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#B6BDC8', wordBreak: 'break-all' }}>{r.value || <em style={{ color: '#4B5563' }}>—</em>}</span>
              {r.description && <div style={{ fontSize: 10, color: '#4B5563', marginTop: 1 }}>{r.description}</div>}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'request',  label: 'Request' },
    { id: 'scans',    label: `Scans (${detail.recentScans.length})` },
  ] as const

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 40,
      }} />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: 520,
        backgroundColor: '#1A1D21', borderLeft: '1px solid #2A2E33',
        zIndex: 41, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* ── Drawer header ── */}
        <div style={{ padding: '16px 20px 0', borderBottom: '1px solid #2A2E33', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <MethodBadge method={ep.method} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F5', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ep.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280', marginTop: 1 }}>
                  {ep.id}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26, height: 26, borderRadius: 5, flexShrink: 0,
              backgroundColor: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2A2E33'; e.currentTarget.style.color = '#B6BDC8' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B7280' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* URL strip */}
          <div style={{
            backgroundColor: '#111315', border: '1px solid #2A2E33', borderRadius: 7,
            padding: '7px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8', flex: 1, wordBreak: 'break-all' }}>{ep.url}</span>
            <button onClick={() => navigator.clipboard?.writeText(ep.url)} title="Copy URL" style={{
              flexShrink: 0, background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer',
              display: 'flex', padding: 2,
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#B6BDC8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4B5563')}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1 8V2a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, color: '#4B5563' }}>Auth</span>
              <span style={{ fontSize: 10, color: '#B6BDC8', fontWeight: 500 }}>{detail.auth}</span>
            </div>
            <div style={{ width: 1, height: 10, backgroundColor: '#2A2E33' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, color: '#4B5563' }}>Content-Type</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#B6BDC8' }}>{ep.contentType}</span>
            </div>
            <div style={{ width: 1, height: 10, backgroundColor: '#2A2E33' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 10, color: '#4B5563' }}>Last Scan</span>
              <ScanStatusPill status={ep.scanStatus} findings={ep.findings} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: -1 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === t.id ? '2px solid #3B82F6' : '2px solid transparent',
                color: activeTab === t.id ? '#F5F5F5' : '#6B7280',
                fontSize: 12, fontWeight: activeTab === t.id ? 500 : 400,
              }}
                onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#B6BDC8' }}
                onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#6B7280' }}
              >{t.label}</button>
            ))}
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Description */}
              <div>
                <MiniLabel>Description</MiniLabel>
                <p style={{ fontSize: 12, color: '#B6BDC8', lineHeight: 1.6, margin: 0 }}>
                  {detail.description || <em style={{ color: '#4B5563' }}>No description provided.</em>}
                </p>
              </div>

              {/* Path Parameters */}
              {pathParams.length > 0 && (
                <div>
                  <MiniLabel>Path Parameters</MiniLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {pathParams.map((p, i) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '120px 60px 60px 1fr',
                        padding: '5px 8px', borderRadius: 5, gap: 8, alignItems: 'start',
                        backgroundColor: i % 2 === 0 ? '#111315' : 'transparent',
                      }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6' }}>{`{${p.name}}`}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563' }}>{p.type}</span>
                        <span style={{ fontSize: 10, color: p.required ? '#F59E0B' : '#4B5563' }}>{p.required ? 'required' : 'optional'}</span>
                        <span style={{ fontSize: 10, color: '#6B7280' }}>{p.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Last findings summary */}
              <div>
                <MiniLabel>Last Findings Summary</MiniLabel>
                {ep.findings === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: ep.scanStatus === 'never' ? '#4B5563' : '#22C55E', flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontSize: 12, color: ep.scanStatus === 'never' ? '#4B5563' : '#22C55E' }}>
                      {ep.scanStatus === 'never' ? 'Not yet scanned' : 'No vulnerabilities detected'}
                    </span>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#111315', borderRadius: 8, border: '1px solid #2A2E33', padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#EF4444' }}>{ep.findings}</span>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>total finding{ep.findings !== 1 ? 's' : ''} in last scan</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {detail.recentScans[0] && (['critical', 'high', 'medium'] as const).map(sev => {
                        const s = detail.recentScans[0]
                        const val = sev === 'critical' ? s.critical : sev === 'high' ? s.findings - s.critical : 0
                        return val > 0 ? (
                          <div key={sev} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: severityColors[sev] }}>{val}</span>
                            <span style={{ fontSize: 10, color: '#4B5563' }}>{sev}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'request' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Query Params */}
              <div>
                <MiniLabel>Query Parameters</MiniLabel>
                <KVGrid rows={detail.queryParams} />
              </div>

              {/* Headers */}
              <div>
                <MiniLabel>Headers</MiniLabel>
                <KVGrid rows={detail.headers} />
              </div>

              {/* Cookies */}
              <div>
                <MiniLabel>Cookies</MiniLabel>
                <KVGrid rows={detail.cookies} />
              </div>

              {/* Body Schema */}
              <div>
                <MiniLabel>Request Body Schema</MiniLabel>
                {detail.bodySchema ? (
                  <div style={{
                    backgroundColor: '#111315', border: '1px solid #2A2E33', borderRadius: 7,
                    padding: '10px 12px', overflowX: 'auto',
                  }}>
                    <pre style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, color: '#86EFAC',
                      margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    }}>{detail.bodySchema}</pre>
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: '#4B5563', fontFamily: 'var(--font-mono)' }}>No request body</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'scans' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {detail.recentScans.length === 0 && (
                <div style={{ padding: '40px 8px', textAlign: 'center', fontSize: 12, color: '#4B5563' }}>
                  No scan history for this endpoint.
                </div>
              )}
              {detail.recentScans.map((s, i) => (
                <div key={s.id} style={{
                  display: 'grid', gridTemplateColumns: '80px 130px 1fr auto',
                  padding: '9px 8px', borderBottom: '1px solid #1F2328',
                  alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6' }}>{s.id}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563' }}>{s.date}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 9, padding: '1px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)',
                      backgroundColor: categoryStyle[s.category]?.bg ?? '#2A2E33',
                      color: categoryStyle[s.category]?.text ?? '#9CA3AF',
                    }}>{s.category}</span>
                    {s.findings > 0 ? (
                      <span style={{ fontSize: 10, color: s.critical > 0 ? '#EF4444' : '#F59E0B', fontFamily: 'var(--font-mono)' }}>
                        {s.findings} finding{s.findings !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, color: '#22C55E', fontFamily: 'var(--font-mono)' }}>Clean</span>
                    )}
                  </div>
                  <StatusPill status={s.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Actions footer ── */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid #2A2E33', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <button style={{
            flex: 1, padding: '7px 0', borderRadius: 7, border: 'none',
            backgroundColor: '#3B82F6', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3B82F6')}
          >Configure Scan</button>
          <button style={{
            flex: 1, padding: '7px 0', borderRadius: 7,
            border: '1px solid #2A2E33', backgroundColor: 'transparent',
            color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3A3E45'; e.currentTarget.style.color = '#F5F5F5' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#B6BDC8' }}
          >Edit Endpoint</button>
          <button onClick={() => { onDelete(); onClose() }} style={{
            padding: '7px 14px', borderRadius: 7,
            border: '1px solid #2A2E33', backgroundColor: 'transparent',
            color: '#6B7280', fontSize: 12, cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#6B7280' }}
          >Delete</button>
        </div>
      </div>
    </>
  )
}

// ─── Project Workspace View ───────────────────────────────────────────────────

function ProjectWorkspaceView() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [drawerEp, setDrawerEp] = useState<typeof projectEndpoints[number] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<HttpMethod | 'ALL'>('ALL')
  const [endpoints, setEndpoints] = useState(projectEndpoints)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  // Form state
  const [form, setForm] = useState({
    method: 'GET' as HttpMethod,
    name: '',
    url: '',
    contentType: 'application/json',
    auth: 'None',
    description: '',
    tags: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const methodFilters: Array<HttpMethod | 'ALL'> = ['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']

  const filtered = endpoints.filter(ep => {
    const matchesSearch = !searchQuery ||
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMethod = selectedMethod === 'ALL' || ep.method === selectedMethod
    return matchesSearch && matchesMethod
  })

  const stats = {
    total: endpoints.length,
    vulnerable: endpoints.filter(e => e.scanStatus === 'vulnerable').length,
    clean: endpoints.filter(e => e.scanStatus === 'clean').length,
    findings: endpoints.reduce((s, e) => s + e.findings, 0),
  }

  function toggleRow(id: string) {
    setSelectedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelectedRows(prev =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map(e => e.id))
    )
  }

  function validateForm() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.url.trim()) errs.url = 'Required'
    else if (!form.url.startsWith('/') && !form.url.startsWith('http')) errs.url = 'Must start with / or http'
    return errs
  }

  function handleSave() {
    const errs = validateForm()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    const newEp = {
      id: `EP-${String(endpoints.length + 1).padStart(3, '0')}`,
      method: form.method,
      name: form.name.trim(),
      url: form.url.trim(),
      contentType: form.contentType,
      lastScan: '—',
      scanStatus: 'never' as EndpointScanStatus,
      findings: 0,
    }
    setEndpoints(prev => [newEp, ...prev])
    setForm({ method: 'GET', name: '', url: '', contentType: 'application/json', auth: 'None', description: '', tags: '' })
    setFormErrors({})
    setPanelOpen(false)
  }

  function setField(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (formErrors[key]) setFormErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  const allSelected = filtered.length > 0 && selectedRows.size === filtered.length

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Page header ── */}
      <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
              <h1 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F5', margin: 0, letterSpacing: '-0.02em' }}>
                Payment Gateway v2 Audit
              </h1>
              <ProjectStatusPill status="active" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563', border: '1px solid #2A2E33', borderRadius: 4, padding: '1px 6px' }}>PRJ-014</span>
            </div>
            <p style={{ fontSize: 11, color: '#6B7280', margin: '3px 0 0', lineHeight: 1.5, maxWidth: 600 }}>
              Full OWASP API Top 10 assessment of the internal payments gateway. Covers authentication, authorization, input validation, rate limiting, and transport security across all v2 endpoints.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 7,
              backgroundColor: 'transparent', border: '1px solid #2A2E33',
              color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
            >
              <IconActivity /> Run Scan
            </button>
            <button
              onClick={() => setPanelOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 7,
                backgroundColor: '#3B82F6', border: 'none',
                color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}>
              <IconPlus /> Add Endpoint
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
          {[
            { label: 'Endpoints', value: stats.total, sub: 'registered', icon: <IconTarget />, accent: false },
            { label: 'Vulnerable', value: stats.vulnerable, sub: 'need attention', icon: <IconShield />, accent: true },
            { label: 'Clean', value: stats.clean, sub: 'last scan passed', icon: <IconActivity />, accent: false },
            { label: 'Total Findings', value: stats.findings, sub: 'open issues', icon: <IconZap />, accent: stats.findings > 0 },
          ].map(s => (
            <div key={s.label} style={{
              backgroundColor: '#1A1D21', border: '1px solid #2A2E33',
              borderRadius: 9, padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</span>
                <span style={{ color: s.accent ? '#EF4444' : '#4B5563', display: 'flex' }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#F5F5F5', lineHeight: 1, marginBottom: 3, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#6B7280' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Table toolbar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 0, paddingBottom: 12, borderBottom: '1px solid #2A2E33' }}>
          {/* Method filter tabs */}
          <div style={{ display: 'flex', gap: 2, backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 7, padding: 3 }}>
            {methodFilters.map(m => (
              <button key={m} onClick={() => setSelectedMethod(m)} style={{
                padding: '3px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
                backgroundColor: selectedMethod === m ? '#2A2E33' : 'transparent',
                color: selectedMethod === m ? '#F5F5F5' : '#6B7280',
                fontSize: 11, fontWeight: selectedMethod === m ? 500 : 400,
                fontFamily: m === 'ALL' ? 'var(--font-sans)' : 'var(--font-mono)',
                transition: 'all 0.1s',
              }}>{m}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: 260 }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#4B5563', display: 'flex', pointerEvents: 'none' }}>
              <IconSearch />
            </span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter endpoints…"
              style={{ ...inputBase, paddingLeft: 30, height: 30 }}
              onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
            />
          </div>

          <div style={{ flex: 1 }} />

          {selectedRows.size > 0 && (
            <span style={{ fontSize: 11, color: '#6B7280' }}>{selectedRows.size} selected</span>
          )}
          <span style={{ fontSize: 11, color: '#4B5563', fontFamily: 'var(--font-mono)' }}>{filtered.length} endpoint{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ── Main body: table + optional panel ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Endpoint table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '32px 60px 200px 1fr 170px 120px 96px',
            padding: '7px 24px',
            borderBottom: '1px solid #2A2E33',
            position: 'sticky', top: 0,
            backgroundColor: '#111315',
            zIndex: 2,
          }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" checked={allSelected} onChange={toggleAll}
                style={{ width: 13, height: 13, accentColor: '#3B82F6', cursor: 'pointer' }} />
            </span>
            <TH>Method</TH>
            <TH>Endpoint Name</TH>
            <TH>URL</TH>
            <TH>Content Type</TH>
            <TH>Last Scan</TH>
            <TH>Actions</TH>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#4B5563', fontSize: 12 }}>
              No endpoints match your filter.
            </div>
          )}

          {filtered.map((ep, i) => {
            const selected = selectedRows.has(ep.id)
            return (
              <div key={ep.id} style={{
                display: 'grid',
                gridTemplateColumns: '32px 60px 200px 1fr 170px 120px 96px',
                padding: '9px 24px',
                borderBottom: '1px solid #1F2328',
                alignItems: 'center',
                backgroundColor: selected ? '#3B82F608' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => { if (!selected) e.currentTarget.style.backgroundColor = '#1A1D21' }}
                onMouseLeave={e => { if (!selected) e.currentTarget.style.backgroundColor = 'transparent' }}
                onClick={() => setDrawerEp(ep)}
              >
                <span style={{ display: 'flex', alignItems: 'center' }} onClick={e => { e.stopPropagation(); toggleRow(ep.id) }}>
                  <input type="checkbox" checked={selected} onChange={() => toggleRow(ep.id)}
                    style={{ width: 13, height: 13, accentColor: '#3B82F6', cursor: 'pointer' }} />
                </span>

                <span><MethodBadge method={ep.method} /></span>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#F5F5F5', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ep.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#4B5563', marginTop: 1 }}>{ep.id}</div>
                </div>

                <div style={{ minWidth: 0, paddingRight: 16 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block',
                  }}>{ep.url}</span>
                </div>

                <span style={{ fontSize: 10, color: '#6B7280', fontFamily: 'var(--font-mono)' }}>{ep.contentType}</span>

                <div>
                  <ScanStatusPill status={ep.scanStatus} findings={ep.findings} />
                  {ep.lastScan !== '—' && (
                    <div style={{ fontSize: 9, color: '#4B5563', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{ep.lastScan}</div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={e => e.stopPropagation()}>
                  <button title="Scan endpoint" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 26, height: 26, borderRadius: 5,
                    backgroundColor: 'transparent', border: '1px solid #2A2E33',
                    color: '#6B7280', cursor: 'pointer',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#3B82F6' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#6B7280' }}
                  ><IconActivity /></button>
                  <button title="Edit endpoint" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 26, height: 26, borderRadius: 5,
                    backgroundColor: 'transparent', border: '1px solid #2A2E33',
                    color: '#6B7280', cursor: 'pointer',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#3A3E45'; e.currentTarget.style.color = '#B6BDC8' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#6B7280' }}
                  ><IconCode /></button>
                  <button title="Delete endpoint" onClick={() => setEndpoints(prev => prev.filter(x => x.id !== ep.id))} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 26, height: 26, borderRadius: 5,
                    backgroundColor: 'transparent', border: '1px solid #2A2E33',
                    color: '#6B7280', cursor: 'pointer',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#6B7280' }}
                  ><IconZap /></button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Create Endpoint panel ── */}
        {panelOpen && (
          <div style={{
            width: 320,
            flexShrink: 0,
            borderLeft: '1px solid #2A2E33',
            backgroundColor: '#111315',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* Panel header */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #2A2E33', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#F5F5F5' }}>Create Endpoint</span>
              <button onClick={() => { setPanelOpen(false); setFormErrors({}) }} style={{
                width: 24, height: 24, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'transparent', border: '1px solid transparent',
                color: '#6B7280', cursor: 'pointer', fontSize: 14, lineHeight: 1,
              }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1A1D21'; e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#B6BDC8' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#6B7280' }}
              >✕</button>
            </div>

            {/* Form body */}
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>

              {/* Method + URL row */}
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                  Method & URL
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <select
                    value={form.method}
                    onChange={e => setField('method', e.target.value)}
                    style={{
                      ...inputBase, width: 88, flexShrink: 0, paddingLeft: 8,
                      color: methodStyle[form.method].text,
                      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11,
                    }}
                  >
                    {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as HttpMethod[]).map(m => (
                      <option key={m} value={m} style={{ color: '#F5F5F5', backgroundColor: '#1A1D21' }}>{m}</option>
                    ))}
                  </select>
                  <div style={{ flex: 1 }}>
                    <input
                      value={form.url}
                      onChange={e => setField('url', e.target.value)}
                      placeholder="/v2/resource/{id}"
                      style={{ ...inputBase, borderColor: formErrors.url ? '#EF4444' : '#2A2E33', fontFamily: 'var(--font-mono)', fontSize: 11 }}
                      onFocus={e => (e.currentTarget.style.borderColor = formErrors.url ? '#EF4444' : '#3B82F6')}
                      onBlur={e => (e.currentTarget.style.borderColor = formErrors.url ? '#EF4444' : '#2A2E33')}
                    />
                    {formErrors.url && <span style={{ fontSize: 10, color: '#EF4444', marginTop: 3, display: 'block' }}>{formErrors.url}</span>}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                  Endpoint Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="e.g. Create Transaction"
                  style={{ ...inputBase, borderColor: formErrors.name ? '#EF4444' : '#2A2E33' }}
                  onFocus={e => (e.currentTarget.style.borderColor = formErrors.name ? '#EF4444' : '#3B82F6')}
                  onBlur={e => (e.currentTarget.style.borderColor = formErrors.name ? '#EF4444' : '#2A2E33')}
                />
                {formErrors.name && <span style={{ fontSize: 10, color: '#EF4444', marginTop: 3, display: 'block' }}>{formErrors.name}</span>}
              </div>

              {/* Content Type */}
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                  Content Type
                </label>
                <select
                  value={form.contentType}
                  onChange={e => setField('contentType', e.target.value)}
                  style={{ ...inputBase, fontFamily: 'var(--font-mono)', fontSize: 11 }}
                >
                  {CONTENT_TYPES.map(ct => (
                    <option key={ct} value={ct} style={{ backgroundColor: '#1A1D21' }}>{ct}</option>
                  ))}
                </select>
              </div>

              {/* Authentication */}
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                  Authentication
                </label>
                <select
                  value={form.auth}
                  onChange={e => setField('auth', e.target.value)}
                  style={{ ...inputBase }}
                >
                  {AUTH_TYPES.map(a => (
                    <option key={a} value={a} style={{ backgroundColor: '#1A1D21' }}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                  Description <span style={{ fontWeight: 400, color: '#4B5563', textTransform: 'none', letterSpacing: 0 }}>— optional</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="What does this endpoint do?"
                  rows={3}
                  style={{
                    ...inputBase, height: 'auto', padding: '8px 10px', resize: 'vertical',
                    lineHeight: 1.5, fontSize: 12,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
                />
              </div>

              {/* Tags */}
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                  Tags <span style={{ fontWeight: 400, color: '#4B5563', textTransform: 'none', letterSpacing: 0 }}>— comma separated</span>
                </label>
                <input
                  value={form.tags}
                  onChange={e => setField('tags', e.target.value)}
                  placeholder="auth, payments, critical"
                  style={{ ...inputBase }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
                />
              </div>

              <div style={{ flex: 1 }} />
            </div>

            {/* Panel footer */}
            <div style={{ padding: '12px 18px', borderTop: '1px solid #2A2E33', display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => { setPanelOpen(false); setFormErrors({}) }} style={{
                flex: 1, height: 32, borderRadius: 7,
                backgroundColor: 'transparent', border: '1px solid #2A2E33',
                color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
              >Cancel</button>
              <button onClick={handleSave} style={{
                flex: 2, height: 32, borderRadius: 7,
                backgroundColor: '#3B82F6', border: 'none',
                color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}>Save Endpoint</button>
            </div>
          </div>
        )}
      </div>

      {drawerEp && (
        <EndpointDrawer
          ep={drawerEp}
          onClose={() => setDrawerEp(null)}
          onDelete={() => setEndpoints(prev => prev.filter(x => x.id !== drawerEp.id))}
        />
      )}
    </div>
  )
}

// ─── Endpoint Configuration data ─────────────────────────────────────────────

type KVRow = { id: string; enabled: boolean; key: string; value: string; description: string }

function mkKV(id: string, enabled: boolean, key: string, value: string, description = ''): KVRow {
  return { id, enabled, key, value, description }
}

const initHeaders: KVRow[] = [
  mkKV('h1', true,  'Authorization',   'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...', 'JWT access token'),
  mkKV('h2', true,  'Content-Type',    'application/json',  'Request content type'),
  mkKV('h3', true,  'Accept',          'application/json',  'Expected response format'),
  mkKV('h4', true,  'X-Request-ID',    '{{$uuid}}',         'Idempotency key'),
  mkKV('h5', false, 'X-Debug-Mode',    'true',              'Verbose server debug output'),
  mkKV('h6', true,  'X-Client-Version','2.4.1',             'Client SDK version'),
]

const initQueryParams: KVRow[] = [
  mkKV('q1', true,  'page',     '1',    'Pagination offset'),
  mkKV('q2', true,  'per_page', '25',   'Items per page (max 100)'),
  mkKV('q3', true,  'sort',     'desc', 'Sort order: asc | desc'),
  mkKV('q4', false, 'include',  'metadata,tags', 'Optional expanded fields'),
]

const initCookies: KVRow[] = [
  mkKV('c1', true,  'session_id',   's%3Axyz987abc123',  'Session token'),
  mkKV('c2', true,  'csrf_token',   'a1b2c3d4e5f6',      'CSRF protection'),
  mkKV('c3', false, '__utm_source', 'organic',           'Analytics tracking'),
]

const INIT_BODY = `{
  "amount": 12500,
  "currency": "USD",
  "source": {
    "type": "card",
    "card_id": "card_01HXYZ9876"
  },
  "metadata": {
    "order_id": "ORD-2026-004891",
    "customer_id": "cust_01HABC1234",
    "idempotency_key": "{{$uuid}}"
  },
  "capture_method": "automatic",
  "statement_descriptor": "ACME PAYMENTS"
}`

type FuzzStrategy = 'OWASP' | 'SQLi' | 'XSS' | 'Format' | 'Auth Bypass' | 'Custom'
const FUZZ_STRATEGIES: FuzzStrategy[] = ['OWASP', 'SQLi', 'XSS', 'Format', 'Auth Bypass', 'Custom']

const initFuzzTargets: Array<{
  id: string; enabled: boolean; param: string; location: 'header' | 'query' | 'body' | 'path'
  strategy: FuzzStrategy; payloads: number; lastRun: string; findings: number
}> = [
  { id: 'f1', enabled: true,  param: 'amount',          location: 'body',   strategy: 'Format',      payloads: 48,  lastRun: '2026-07-31 09:41', findings: 0 },
  { id: 'f2', enabled: true,  param: 'card_id',         location: 'body',   strategy: 'SQLi',        payloads: 132, lastRun: '2026-07-31 09:41', findings: 1 },
  { id: 'f3', enabled: true,  param: 'Authorization',   location: 'header', strategy: 'Auth Bypass', payloads: 64,  lastRun: '2026-07-31 09:41', findings: 2 },
  { id: 'f4', enabled: false, param: 'statement_descriptor', location: 'body', strategy: 'XSS',     payloads: 96,  lastRun: '—',                findings: 0 },
  { id: 'f5', enabled: true,  param: 'customer_id',     location: 'body',   strategy: 'OWASP',       payloads: 210, lastRun: '2026-07-30 14:11', findings: 0 },
]

const executionHistory: Array<{
  id: string; timestamp: string; status: ScanStatus
  duration: string; statusCode: number; responseSize: string
  findings: number; trigger: string
}> = [
  { id: 'EX-0041', timestamp: '2026-07-31 09:41:22', status: 'completed', duration: '312ms', statusCode: 200, responseSize: '1.8 KB', findings: 3, trigger: 'Manual' },
  { id: 'EX-0040', timestamp: '2026-07-31 09:38:01', status: 'completed', duration: '289ms', statusCode: 201, responseSize: '0.9 KB', findings: 0, trigger: 'Scheduled' },
  { id: 'EX-0039', timestamp: '2026-07-31 09:21:44', status: 'failed',    duration: '44ms',  statusCode: 401, responseSize: '0.1 KB', findings: 1, trigger: 'Manual' },
  { id: 'EX-0038', timestamp: '2026-07-30 17:12:09', status: 'completed', duration: '408ms', statusCode: 200, responseSize: '2.1 KB', findings: 0, trigger: 'CI/CD' },
  { id: 'EX-0037', timestamp: '2026-07-30 14:05:33', status: 'completed', duration: '271ms', statusCode: 200, responseSize: '1.8 KB', findings: 0, trigger: 'CI/CD' },
  { id: 'EX-0036', timestamp: '2026-07-29 11:30:17', status: 'failed',    duration: '30ms',  statusCode: 500, responseSize: '0.2 KB', findings: 0, trigger: 'Manual' },
  { id: 'EX-0035', timestamp: '2026-07-29 09:14:55', status: 'completed', duration: '318ms', statusCode: 200, responseSize: '1.9 KB', findings: 0, trigger: 'Scheduled' },
]

// ─── KV table (reusable for Headers / Query Params / Cookies) ────────────────

function KVTable({ rows, onChange, locationLabel }: {
  rows: KVRow[]
  onChange: (rows: KVRow[]) => void
  locationLabel: string
}) {
  function update(id: string, field: keyof KVRow, value: string | boolean) {
    onChange(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
  }
  function remove(id: string) { onChange(rows.filter(r => r.id !== id)) }
  function addRow() {
    onChange([...rows, mkKV(`r${Date.now()}`, true, '', '', '')])
  }

  const cellInput: React.CSSProperties = {
    width: '100%', height: 28,
    backgroundColor: 'transparent', border: 'none', borderRadius: 0,
    padding: '0 8px', color: '#F5F5F5', fontSize: 12,
    fontFamily: 'var(--font-mono)', outline: 'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 28px',
        padding: '6px 16px', borderBottom: '1px solid #2A2E33',
        gap: 0,
      }}>
        <span />
        <TH>{locationLabel} Key</TH>
        <TH>Value</TH>
        <TH>Description</TH>
        <span />
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {rows.map((row, i) => (
          <div key={row.id} style={{
            display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 28px',
            borderBottom: '1px solid #1F2328',
            alignItems: 'center', minHeight: 34,
            opacity: row.enabled ? 1 : 0.45,
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1A1D21')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input type="checkbox" checked={row.enabled} onChange={e => update(row.id, 'enabled', e.target.checked)}
                style={{ width: 12, height: 12, accentColor: '#3B82F6', cursor: 'pointer' }} />
            </span>
            <input value={row.key} onChange={e => update(row.id, 'key', e.target.value)}
              placeholder="Name" style={{ ...cellInput, color: row.enabled ? '#3B82F6' : '#6B7280' }}
              onFocus={e => (e.currentTarget.parentElement!.style.backgroundColor = '#1F2328')}
              onBlur={e => (e.currentTarget.parentElement!.style.backgroundColor = 'transparent')}
            />
            <input value={row.value} onChange={e => update(row.id, 'value', e.target.value)}
              placeholder="Value" style={{ ...cellInput, borderLeft: '1px solid #1F2328' }}
              onFocus={e => (e.currentTarget.parentElement!.style.backgroundColor = '#1F2328')}
              onBlur={e => (e.currentTarget.parentElement!.style.backgroundColor = 'transparent')}
            />
            <input value={row.description} onChange={e => update(row.id, 'description', e.target.value)}
              placeholder="Description" style={{ ...cellInput, borderLeft: '1px solid #1F2328', color: '#6B7280', fontFamily: 'var(--font-sans)' }}
              onFocus={e => (e.currentTarget.parentElement!.style.backgroundColor = '#1F2328')}
              onBlur={e => (e.currentTarget.parentElement!.style.backgroundColor = 'transparent')}
            />
            <button onClick={() => remove(row.id)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26, height: 26, background: 'none', border: 'none',
              color: '#4B5563', cursor: 'pointer', fontSize: 14, borderRadius: 5,
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4B5563')}
            >×</button>
          </div>
        ))}
      </div>

      {/* Add row footer */}
      <div style={{ borderTop: '1px solid #2A2E33', padding: '6px 12px' }}>
        <button onClick={addRow} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'none', border: 'none', color: '#6B7280',
          fontSize: 11, cursor: 'pointer', padding: '2px 4px',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#B6BDC8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
        >
          <IconPlus /> Add row
        </button>
      </div>
    </div>
  )
}

// ─── Endpoint Configuration View ─────────────────────────────────────────────

type ConfigTab = 'general' | 'headers' | 'query' | 'cookies' | 'body' | 'executions' | 'fuzzing'

const CONFIG_TABS: Array<{ id: ConfigTab; label: string }> = [
  { id: 'general',    label: 'General' },
  { id: 'headers',    label: 'Headers' },
  { id: 'query',      label: 'Query Parameters' },
  { id: 'cookies',    label: 'Cookies' },
  { id: 'body',       label: 'Request Body' },
  { id: 'executions', label: 'Executions' },
  { id: 'fuzzing',    label: 'Fuzzing' },
]

function EndpointConfigView() {
  const [activeTab, setActiveTab] = useState<ConfigTab>('general')
  const [headers, setHeaders] = useState<KVRow[]>(initHeaders)
  const [queryParams, setQueryParams] = useState<KVRow[]>(initQueryParams)
  const [cookies, setCookies] = useState<KVRow[]>(initCookies)
  const [bodyText, setBodyText] = useState(INIT_BODY)
  const [bodyMode, setBodyMode] = useState<'json' | 'raw' | 'form'>('json')
  const [fuzzTargets, setFuzzTargets] = useState(initFuzzTargets)
  const [saved, setSaved] = useState(false)

  // General form state
  const [general, setGeneral] = useState({
    name: 'Create Transaction',
    method: 'POST' as HttpMethod,
    url: '/v2/transactions',
    contentType: 'application/json',
    auth: 'Bearer Token',
    timeout: '30000',
    followRedirects: true,
    verifySsl: true,
    description: 'Creates a new payment transaction. Requires a valid card source and amount in the smallest currency unit. Returns a transaction object with status "pending" or "authorized".',
    tags: 'payments, transactions, critical',
    rateLimit: '100',
    retries: '2',
  })

  function setG(k: keyof typeof general, v: string | boolean) {
    setGeneral(p => ({ ...p, [k]: v }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const statusCodeColor = (code: number) => {
    if (code >= 500) return '#EF4444'
    if (code >= 400) return '#F59E0B'
    if (code >= 300) return '#3B82F6'
    return '#22C55E'
  }

  const panelStyle: React.CSSProperties = {
    flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column',
  }

  const sectionLabel: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, color: '#4B5563',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    marginBottom: 8,
  }

  const formRow: React.CSSProperties = {
    display: 'grid', gap: 12, marginBottom: 14,
  }

  const fieldLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, color: '#6B7280',
    display: 'block', marginBottom: 5,
  }

  const fieldInput: React.CSSProperties = {
    ...inputBase, backgroundColor: '#1A1D21',
  }

  const toggleSwitch = (checked: boolean, onChange: (v: boolean) => void) => (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 32, height: 18, borderRadius: 9,
        backgroundColor: checked ? '#3B82F6' : '#2A2E33',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.15s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: checked ? 16 : 3,
        width: 12, height: 12, borderRadius: '50%',
        backgroundColor: '#F5F5F5',
        transition: 'left 0.15s',
      }} />
    </button>
  )

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Endpoint identity bar ── */}
      <div style={{
        padding: '14px 24px 0',
        borderBottom: '1px solid #2A2E33',
        flexShrink: 0,
        backgroundColor: '#111315',
      }}>
        {/* Top row: name + actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MethodBadge method={general.method} />
            <h1 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F5', margin: 0, letterSpacing: '-0.02em' }}>
              {general.name}
            </h1>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563', border: '1px solid #2A2E33', borderRadius: 4, padding: '1px 6px' }}>EP-002</span>
            <ScanStatusPill status="vulnerable" findings={3} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 7,
              backgroundColor: 'transparent', border: '1px solid #2A2E33',
              color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
            ><IconActivity /> Run Scan</button>
            <button
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 7,
                backgroundColor: saved ? '#16a34a' : '#3B82F6', border: 'none',
                color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
              {saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Meta strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>URL</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8' }}>{general.url}</span>
          </div>
          <span style={{ width: 1, height: 12, backgroundColor: '#2A2E33' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Content-Type</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8' }}>{general.contentType}</span>
          </div>
          <span style={{ width: 1, height: 12, backgroundColor: '#2A2E33' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Auth</span>
            <span style={{ fontSize: 11, color: '#B6BDC8' }}>{general.auth}</span>
          </div>
          <span style={{ width: 1, height: 12, backgroundColor: '#2A2E33' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Headers</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8' }}>{headers.filter(h => h.enabled).length}</span>
          </div>
          <span style={{ width: 1, height: 12, backgroundColor: '#2A2E33' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Params</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8' }}>{queryParams.filter(q => q.enabled).length}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
          {CONFIG_TABS.map(tab => {
            const active = activeTab === tab.id
            const badges: Partial<Record<ConfigTab, number>> = {
              headers: headers.filter(h => h.enabled).length,
              query: queryParams.filter(q => q.enabled).length,
              cookies: cookies.filter(c => c.enabled).length,
              executions: executionHistory.length,
              fuzzing: fuzzTargets.filter(f => f.enabled).length,
            }
            const badge = badges[tab.id]
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px',
                background: 'none', border: 'none', borderBottom: active ? '2px solid #3B82F6' : '2px solid transparent',
                color: active ? '#F5F5F5' : '#6B7280',
                fontSize: 12, fontWeight: active ? 500 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'color 0.1s',
                marginBottom: 0,
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#B6BDC8' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#6B7280' }}
              >
                {tab.label}
                {badge !== undefined && badge > 0 && (
                  <span style={{
                    fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)',
                    color: active ? '#3B82F6' : '#4B5563',
                    backgroundColor: active ? '#3B82F61A' : '#2A2E33',
                    borderRadius: 8, padding: '0 5px', minWidth: 16, textAlign: 'center',
                  }}>{badge}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#111315' }}>

        {/* ── General ── */}
        {activeTab === 'general' && (
          <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px' }}>
            <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Identity */}
              <section>
                <div style={sectionLabel}>Identity</div>
                <div style={{ backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ ...formRow, gridTemplateColumns: '1fr 120px 1fr' }}>
                    <div>
                      <label style={fieldLabel}>Endpoint Name</label>
                      <input value={general.name} onChange={e => setG('name', e.target.value)}
                        style={fieldInput}
                        onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
                    </div>
                    <div>
                      <label style={fieldLabel}>Method</label>
                      <select value={general.method} onChange={e => setG('method', e.target.value)}
                        style={{ ...fieldInput, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, color: methodStyle[general.method as HttpMethod]?.text }}>
                        {(['GET','POST','PUT','PATCH','DELETE'] as HttpMethod[]).map(m => (
                          <option key={m} value={m} style={{ backgroundColor: '#1A1D21', color: '#F5F5F5' }}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={fieldLabel}>URL Path</label>
                      <input value={general.url} onChange={e => setG('url', e.target.value)}
                        style={{ ...fieldInput, fontFamily: 'var(--font-mono)', fontSize: 11 }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
                    </div>
                  </div>
                  <div>
                    <label style={fieldLabel}>Description</label>
                    <textarea value={general.description} onChange={e => setG('description', e.target.value)} rows={3}
                      style={{ ...fieldInput, height: 'auto', padding: '8px 10px', resize: 'vertical', lineHeight: 1.55 }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
                  </div>
                  <div>
                    <label style={fieldLabel}>Tags</label>
                    <input value={general.tags} onChange={e => setG('tags', e.target.value)}
                      placeholder="comma separated" style={fieldInput}
                      onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
                  </div>
                </div>
              </section>

              {/* Request settings */}
              <section>
                <div style={sectionLabel}>Request Settings</div>
                <div style={{ backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ ...formRow, gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <label style={fieldLabel}>Content Type</label>
                      <select value={general.contentType} onChange={e => setG('contentType', e.target.value)}
                        style={{ ...fieldInput, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                        {CONTENT_TYPES.map(ct => <option key={ct} value={ct} style={{ backgroundColor: '#1A1D21' }}>{ct}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={fieldLabel}>Authentication</label>
                      <select value={general.auth} onChange={e => setG('auth', e.target.value)}
                        style={fieldInput}>
                        {AUTH_TYPES.map(a => <option key={a} value={a} style={{ backgroundColor: '#1A1D21' }}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ ...formRow, gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <label style={fieldLabel}>Timeout (ms)</label>
                      <input value={general.timeout} onChange={e => setG('timeout', e.target.value)}
                        style={{ ...fieldInput, fontFamily: 'var(--font-mono)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
                    </div>
                    <div>
                      <label style={fieldLabel}>Rate Limit (req/min)</label>
                      <input value={general.rateLimit} onChange={e => setG('rateLimit', e.target.value)}
                        style={{ ...fieldInput, fontFamily: 'var(--font-mono)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {toggleSwitch(general.followRedirects, v => setG('followRedirects', v))}
                      <span style={{ fontSize: 12, color: '#B6BDC8' }}>Follow redirects</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {toggleSwitch(general.verifySsl, v => setG('verifySsl', v))}
                      <span style={{ fontSize: 12, color: '#B6BDC8' }}>Verify SSL certificate</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Scan configuration */}
              <section>
                <div style={sectionLabel}>Scan Configuration</div>
                <div style={{ backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ ...formRow, gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div>
                      <label style={fieldLabel}>Scan Profile</label>
                      <select style={fieldInput}>
                        {['OWASP API Top 10', 'JWT Security', 'IDOR / BOLA', 'Rate Limiting', 'Input Validation', 'Custom'].map(p => (
                          <option key={p} style={{ backgroundColor: '#1A1D21' }}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={fieldLabel}>Max Retries on Failure</label>
                      <input value={general.retries} onChange={e => setG('retries', e.target.value)}
                        style={{ ...fieldInput, fontFamily: 'var(--font-mono)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
                    </div>
                    <div>
                      <label style={fieldLabel}>Expected Status Code</label>
                      <input defaultValue="200, 201"
                        style={{ ...fieldInput, fontFamily: 'var(--font-mono)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        )}

        {/* ── Headers ── */}
        {activeTab === 'headers' && (
          <div style={panelStyle}>
            <KVTable rows={headers} onChange={setHeaders} locationLabel="Header" />
          </div>
        )}

        {/* ── Query Parameters ── */}
        {activeTab === 'query' && (
          <div style={panelStyle}>
            <KVTable rows={queryParams} onChange={setQueryParams} locationLabel="Parameter" />
          </div>
        )}

        {/* ── Cookies ── */}
        {activeTab === 'cookies' && (
          <div style={panelStyle}>
            <KVTable rows={cookies} onChange={setCookies} locationLabel="Cookie" />
          </div>
        )}

        {/* ── Request Body ── */}
        {activeTab === 'body' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Body toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderBottom: '1px solid #2A2E33',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', gap: 2, backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 7, padding: 2 }}>
                {(['json', 'raw', 'form'] as const).map(m => (
                  <button key={m} onClick={() => setBodyMode(m)} style={{
                    padding: '3px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
                    backgroundColor: bodyMode === m ? '#2A2E33' : 'transparent',
                    color: bodyMode === m ? '#F5F5F5' : '#6B7280',
                    fontSize: 11, fontWeight: bodyMode === m ? 500 : 400,
                    textTransform: bodyMode === m ? 'none' : 'none',
                  }}>{m === 'json' ? 'JSON' : m === 'raw' ? 'Raw' : 'Form Data'}</button>
                ))}
              </div>
              <span style={{ fontSize: 10, color: '#4B5563', fontFamily: 'var(--font-mono)', marginLeft: 4 }}>
                {new Blob([bodyText]).size} B
              </span>
              <div style={{ flex: 1 }} />
              <button onClick={() => {
                try { setBodyText(JSON.stringify(JSON.parse(bodyText), null, 2)) } catch {}
              }} style={{
                fontSize: 11, color: '#6B7280', background: 'none', border: '1px solid #2A2E33',
                borderRadius: 5, padding: '3px 9px', cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
              >Format</button>
              <button onClick={() => setBodyText('')} style={{
                fontSize: 11, color: '#6B7280', background: 'none', border: '1px solid #2A2E33',
                borderRadius: 5, padding: '3px 9px', cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#6B7280' }}
              >Clear</button>
            </div>

            {/* Editor area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
              {/* Line numbers */}
              <div style={{
                width: 42, flexShrink: 0,
                backgroundColor: '#1A1D21',
                borderRight: '1px solid #2A2E33',
                padding: '14px 0',
                overflowY: 'hidden',
                userSelect: 'none',
              }}>
                {bodyText.split('\n').map((_, i) => (
                  <div key={i} style={{
                    textAlign: 'right', paddingRight: 10,
                    fontSize: 11, lineHeight: '20px',
                    color: '#3A3E45', fontFamily: 'var(--font-mono)',
                  }}>{i + 1}</div>
                ))}
              </div>

              {/* Syntax-highlighted display overlay */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <JsonHighlight value={bodyText} />
                <textarea
                  value={bodyText}
                  onChange={e => setBodyText(e.target.value)}
                  spellCheck={false}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    backgroundColor: 'transparent',
                    color: 'transparent',
                    caretColor: '#F5F5F5',
                    border: 'none', outline: 'none', resize: 'none',
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    lineHeight: '20px', padding: '14px 16px',
                    overflowY: 'auto',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Executions ── */}
        {activeTab === 'executions' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 20px', borderBottom: '1px solid #2A2E33', flexShrink: 0,
            }}>
              <span style={{ fontSize: 11, color: '#6B7280' }}>{executionHistory.length} executions</span>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 7,
                backgroundColor: '#3B82F6', border: 'none',
                color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}><IconActivity /> Run Now</button>
            </div>

            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '90px 170px 80px 70px 90px 90px 80px 1fr',
              padding: '7px 20px', borderBottom: '1px solid #2A2E33',
              backgroundColor: '#111315', position: 'sticky', top: 0,
            }}>
              <TH>Run ID</TH>
              <TH>Timestamp</TH>
              <TH>Status</TH>
              <TH style={{ textAlign: 'right' }}>Code</TH>
              <TH style={{ textAlign: 'right' }}>Duration</TH>
              <TH style={{ textAlign: 'right' }}>Response</TH>
              <TH style={{ textAlign: 'right' }}>Findings</TH>
              <TH>Trigger</TH>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {executionHistory.map((ex, i) => (
                <div key={ex.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 170px 80px 70px 90px 90px 80px 1fr',
                  padding: '8px 20px',
                  borderBottom: i < executionHistory.length - 1 ? '1px solid #1F2328' : 'none',
                  alignItems: 'center', cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1A1D21')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6' }}>{ex.id}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6B7280' }}>{ex.timestamp}</span>
                  <StatusPill status={ex.status} />
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: statusCodeColor(ex.statusCode) }}>{ex.statusCode}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8' }}>{ex.duration}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280' }}>{ex.responseSize}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: ex.findings > 0 ? '#EF4444' : '#4B5563', fontWeight: ex.findings > 0 ? 600 : 400 }}>{ex.findings > 0 ? ex.findings : '—'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: '#6B7280', fontFamily: 'var(--font-mono)',
                      backgroundColor: '#2A2E33', padding: '1px 6px', borderRadius: 3 }}>{ex.trigger}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Fuzzing ── */}
        {activeTab === 'fuzzing' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 20px', borderBottom: '1px solid #2A2E33', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: '#6B7280' }}>
                  {fuzzTargets.filter(f => f.enabled).length} active targets
                </span>
                <span style={{ color: '#2A2E33', fontSize: 12 }}>·</span>
                <span style={{ fontSize: 11, color: '#6B7280' }}>
                  {fuzzTargets.reduce((s, f) => s + f.payloads, 0).toLocaleString()} total payloads
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setFuzzTargets(prev => [...prev, {
                  id: `f${Date.now()}`, enabled: true, param: '', location: 'query',
                  strategy: 'OWASP', payloads: 0, lastRun: '—', findings: 0,
                }])} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 7,
                  backgroundColor: 'transparent', border: '1px solid #2A2E33',
                  color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
                ><IconPlus /> Add Target</button>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 7,
                  backgroundColor: '#3B82F6', border: 'none',
                  color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}><IconZap /> Run Fuzz</button>
              </div>
            </div>

            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr 100px 120px 90px 90px 80px 28px',
              padding: '7px 20px', borderBottom: '1px solid #2A2E33',
            }}>
              <span />
              <TH>Parameter</TH>
              <TH>Location</TH>
              <TH>Strategy</TH>
              <TH style={{ textAlign: 'right' }}>Payloads</TH>
              <TH>Last Run</TH>
              <TH style={{ textAlign: 'right' }}>Findings</TH>
              <span />
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {fuzzTargets.map((ft, i) => (
                <div key={ft.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr 100px 120px 90px 90px 80px 28px',
                  padding: '7px 20px',
                  borderBottom: i < fuzzTargets.length - 1 ? '1px solid #1F2328' : 'none',
                  alignItems: 'center',
                  opacity: ft.enabled ? 1 : 0.45,
                }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1A1D21')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input type="checkbox" checked={ft.enabled}
                      onChange={e => setFuzzTargets(prev => prev.map(f => f.id === ft.id ? { ...f, enabled: e.target.checked } : f))}
                      style={{ width: 12, height: 12, accentColor: '#3B82F6', cursor: 'pointer' }} />
                  </span>
                  <input
                    value={ft.param}
                    onChange={e => setFuzzTargets(prev => prev.map(f => f.id === ft.id ? { ...f, param: e.target.value } : f))}
                    placeholder="param name"
                    style={{
                      background: 'none', border: 'none', outline: 'none',
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      color: ft.enabled ? '#3B82F6' : '#6B7280', padding: '0 2px',
                    }}
                  />
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                    color: '#6B7280', backgroundColor: '#2A2E33',
                    padding: '2px 7px', borderRadius: 4, display: 'inline-block',
                    width: 'fit-content',
                  }}>{ft.location}</span>
                  <select
                    value={ft.strategy}
                    onChange={e => setFuzzTargets(prev => prev.map(f => f.id === ft.id ? { ...f, strategy: e.target.value as FuzzStrategy } : f))}
                    style={{
                      backgroundColor: 'transparent', border: '1px solid #2A2E33',
                      borderRadius: 5, color: '#B6BDC8', fontSize: 11,
                      padding: '2px 6px', cursor: 'pointer', outline: 'none',
                    }}
                  >
                    {FUZZ_STRATEGIES.map(s => <option key={s} value={s} style={{ backgroundColor: '#1A1D21' }}>{s}</option>)}
                  </select>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8' }}>
                    {ft.payloads > 0 ? ft.payloads.toLocaleString() : '—'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563' }}>{ft.lastRun}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: ft.findings > 0 ? 600 : 400, color: ft.findings > 0 ? '#EF4444' : '#4B5563' }}>
                    {ft.findings > 0 ? ft.findings : '—'}
                  </span>
                  <button onClick={() => setFuzzTargets(prev => prev.filter(f => f.id !== ft.id))} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 26, height: 26, background: 'none', border: 'none',
                    color: '#4B5563', cursor: 'pointer', fontSize: 14, borderRadius: 5,
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#4B5563')}
                  >×</button>
                </div>
              ))}
            </div>

            {/* Payload library callout */}
            <div style={{
              margin: '0 20px 16px',
              padding: '10px 14px',
              backgroundColor: '#1A1D21', border: '1px solid #2A2E33',
              borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
              flexShrink: 0,
            }}>
              <span style={{ color: '#4B5563', display: 'flex' }}><IconPayload /></span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, color: '#B6BDC8' }}>Payload collections are managed in the </span>
                <span style={{ fontSize: 11, color: '#3B82F6', cursor: 'pointer' }}>Payload Library</span>
                <span style={{ fontSize: 11, color: '#B6BDC8' }}>. Custom strategies can override any collection per-target.</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Payload Library data ────────────────────────────────────────────────────

type PayloadCategory =
  | 'SQL Injection' | 'XSS' | 'Command Injection' | 'Path Traversal'
  | 'XXE' | 'SSRF' | 'CSRF' | 'JWT' | 'Custom'

type InjectionLocation = 'Header' | 'Query' | 'Body' | 'Path' | 'Cookie' | 'Any'

type Payload = {
  id: string
  name: string
  category: PayloadCategory
  location: InjectionLocation
  preview: string
  count: number
  author: string
  modified: string
  builtIn: boolean
  tags: string[]
  description: string
  payloads: string[]
}

const PAYLOAD_CATEGORIES: PayloadCategory[] = [
  'SQL Injection', 'XSS', 'Command Injection', 'Path Traversal',
  'XXE', 'SSRF', 'CSRF', 'JWT', 'Custom',
]

const categoryStyle: Record<PayloadCategory, { bg: string; text: string }> = {
  'SQL Injection':    { bg: '#EF444415', text: '#EF4444' },
  'XSS':             { bg: '#F9731615', text: '#F97316' },
  'Command Injection':{ bg: '#EF444415', text: '#F87171' },
  'Path Traversal':  { bg: '#F59E0B15', text: '#F59E0B' },
  'XXE':             { bg: '#A78BFA15', text: '#A78BFA' },
  'SSRF':            { bg: '#38BDF815', text: '#38BDF8' },
  'CSRF':            { bg: '#34D39915', text: '#34D399' },
  'JWT':             { bg: '#3B82F615', text: '#3B82F6' },
  'Custom':          { bg: '#2A2E33',   text: '#9CA3AF' },
}

const LOCATION_LABELS: InjectionLocation[] = ['Header', 'Query', 'Body', 'Path', 'Cookie', 'Any']

const initPayloads: Payload[] = [
  {
    id: 'PL-001', name: 'Classic SQLi – Auth Bypass',
    category: 'SQL Injection', location: 'Body',
    preview: "' OR '1'='1' --",
    count: 48, author: 'Built-in', modified: '2026-06-12', builtIn: true,
    tags: ['auth', 'login', 'bypass'],
    description: 'Standard authentication bypass payloads targeting login forms and parameterised queries.',
    payloads: ["' OR '1'='1' --", "' OR 1=1 --", "admin'--", "' OR 'x'='x", "1' OR '1'='1"],
  },
  {
    id: 'PL-002', name: 'Error-Based SQLi',
    category: 'SQL Injection', location: 'Query',
    preview: "' AND EXTRACTVALUE(1,CONCAT(0x7e,version())) --",
    count: 62, author: 'Built-in', modified: '2026-06-12', builtIn: true,
    tags: ['error', 'mysql', 'mssql'],
    description: 'Payloads that trigger verbose database error messages to expose version, schema, and data.',
    payloads: ["' AND EXTRACTVALUE(1,CONCAT(0x7e,version())) --", "' AND 1=CONVERT(int,@@version) --"],
  },
  {
    id: 'PL-003', name: 'Reflected XSS – Script Tag',
    category: 'XSS', location: 'Query',
    preview: '<script>alert(document.domain)</script>',
    count: 34, author: 'Built-in', modified: '2026-05-28', builtIn: true,
    tags: ['reflected', 'script', 'alert'],
    description: 'Classic reflected XSS vectors using script injection and event handler attributes.',
    payloads: ['<script>alert(document.domain)</script>', '<img src=x onerror=alert(1)>', '<svg onload=alert(1)>'],
  },
  {
    id: 'PL-004', name: 'Stored XSS – JSON Context',
    category: 'XSS', location: 'Body',
    preview: '{"name":"<img src=x onerror=fetch(\'//evil\')>"}',
    count: 19, author: 'M. Alves', modified: '2026-07-14', builtIn: false,
    tags: ['stored', 'json', 'fetch'],
    description: 'XSS payloads crafted for JSON request bodies that are later rendered in HTML contexts.',
    payloads: ['{"name":"<img src=x onerror=fetch(\'//evil\')>"}', '{"note":"</script><script>alert(1)</script>"}'],
  },
  {
    id: 'PL-005', name: 'OS Command Injection – Unix',
    category: 'Command Injection', location: 'Body',
    preview: '; cat /etc/passwd',
    count: 41, author: 'Built-in', modified: '2026-04-09', builtIn: true,
    tags: ['unix', 'linux', 'rce'],
    description: 'Shell metacharacter sequences that terminate the expected command and append attacker-controlled input.',
    payloads: ['; cat /etc/passwd', '| whoami', '`id`', '$(id)', '; ls -la /'],
  },
  {
    id: 'PL-006', name: 'Path Traversal – Unix',
    category: 'Path Traversal', location: 'Query',
    preview: '../../../../etc/passwd',
    count: 28, author: 'Built-in', modified: '2026-04-09', builtIn: true,
    tags: ['lfi', 'file', 'unix'],
    description: 'Directory traversal sequences targeting file inclusion parameters on Unix systems.',
    payloads: ['../../../../etc/passwd', '../../../etc/shadow', '..%2F..%2F..%2Fetc%2Fpasswd'],
  },
  {
    id: 'PL-007', name: 'Path Traversal – Windows',
    category: 'Path Traversal', location: 'Query',
    preview: '..\\..\\..\\windows\\win.ini',
    count: 22, author: 'Built-in', modified: '2026-04-09', builtIn: true,
    tags: ['lfi', 'file', 'windows'],
    description: 'Windows path traversal payloads using backslash and encoded variants.',
    payloads: ['..\\..\\..\\windows\\win.ini', '..%5C..%5Cwindows%5Cwin.ini'],
  },
  {
    id: 'PL-008', name: 'XXE – External Entity',
    category: 'XXE', location: 'Body',
    preview: '<!DOCTYPE x [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
    count: 15, author: 'Built-in', modified: '2026-05-03', builtIn: true,
    tags: ['xml', 'entity', 'file'],
    description: 'XML external entity injection payloads for reading local files and probing internal services.',
    payloads: ['<!DOCTYPE x [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><x>&xxe;</x>'],
  },
  {
    id: 'PL-009', name: 'SSRF – Cloud Metadata',
    category: 'SSRF', location: 'Body',
    preview: 'http://169.254.169.254/latest/meta-data/',
    count: 24, author: 'Built-in', modified: '2026-06-20', builtIn: true,
    tags: ['aws', 'gcp', 'azure', 'imds'],
    description: 'Targets cloud instance metadata endpoints via server-side request forgery.',
    payloads: [
      'http://169.254.169.254/latest/meta-data/',
      'http://metadata.google.internal/computeMetadata/v1/',
      'http://169.254.169.254/metadata/instance?api-version=2021-02-01',
    ],
  },
  {
    id: 'PL-010', name: 'SSRF – Internal Port Scan',
    category: 'SSRF', location: 'Body',
    preview: 'http://127.0.0.1:{{port}}/',
    count: 18, author: 'R. Okeke', modified: '2026-07-02', builtIn: false,
    tags: ['internal', 'portscan', 'localhost'],
    description: 'Probes internal network services via SSRF with common port numbers.',
    payloads: ['http://127.0.0.1:8080/', 'http://127.0.0.1:3306/', 'http://127.0.0.1:6379/'],
  },
  {
    id: 'PL-011', name: 'JWT – Algorithm Confusion',
    category: 'JWT', location: 'Header',
    preview: '{"alg":"none","typ":"JWT"}',
    count: 12, author: 'Built-in', modified: '2026-07-18', builtIn: true,
    tags: ['alg:none', 'hs256', 'rsa'],
    description: 'Forged JWTs exploiting algorithm confusion: none algorithm, RS256 → HS256 key confusion.',
    payloads: ['alg:none token', 'RS256→HS256 confusion', 'empty signature'],
  },
  {
    id: 'PL-012', name: 'JWT – Weak Secret Wordlist',
    category: 'JWT', location: 'Header',
    preview: 'secret, password, 123456, changeme…',
    count: 512, author: 'Built-in', modified: '2026-06-01', builtIn: true,
    tags: ['brute', 'hmac', 'weak-key'],
    description: 'Common weak HMAC secret values used for JWT brute-force attacks.',
    payloads: ['secret', 'password', '123456', 'changeme', 'jwt_secret'],
  },
  {
    id: 'PL-013', name: 'CSRF – Form Auto-Submit',
    category: 'CSRF', location: 'Body',
    preview: '<form action="…" method="POST"><input …',
    count: 8, author: 'S. Petrov', modified: '2026-07-25', builtIn: false,
    tags: ['form', 'post', 'samesite'],
    description: 'HTML form payloads that auto-submit cross-origin state-changing requests.',
    payloads: ['<form action="https://target/transfer" method="POST">…</form>'],
  },
  {
    id: 'PL-014', name: 'Payment Field Overflows',
    category: 'Custom', location: 'Body',
    preview: '{"amount": 99999999999999, "currency": "AA…"}',
    count: 21, author: 'M. Alves', modified: '2026-07-29', builtIn: false,
    tags: ['payments', 'overflow', 'boundary'],
    description: 'Business-logic boundary payloads targeting the payments API: overflow amounts, invalid currencies, negative values.',
    payloads: ['{"amount": 99999999999999}', '{"amount": -1}', '{"currency": "INVALID"}'],
  },
]

// ─── JSON syntax highlighter (no deps) ───────────────────────────────────────

function JsonHighlight({ value }: { value: string }) {
  const highlighted = value
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?/g, match =>
      match.endsWith(':')
        ? `<span style="color:#93C5FD">${match}</span>`
        : `<span style="color:#86EFAC">${match}</span>`
    )
    .replace(/\b(true|false)\b/g, '<span style="color:#F9A8D4">$1</span>')
    .replace(/\bnull\b/g, '<span style="color:#FDA4AF">null</span>')
    .replace(/\b(-?\d+\.?\d*([eE][+\-]?\d+)?)\b/g, '<span style="color:#FCD34D">$1</span>')

  return (
    <pre
      dangerouslySetInnerHTML={{ __html: highlighted }}
      style={{
        position: 'absolute', inset: 0,
        margin: 0, padding: '14px 16px',
        fontFamily: 'var(--font-mono)', fontSize: 12,
        lineHeight: '20px', color: '#B6BDC8',
        overflow: 'hidden', pointerEvents: 'none',
        whiteSpace: 'pre', backgroundColor: '#111315',
      }}
    />
  )
}

// ─── Payload Library View ─────────────────────────────────────────────────────

function PayloadLibraryView() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<PayloadCategory | 'All'>('All')
  const [activeLocation, setActiveLocation] = useState<InjectionLocation | 'All'>('All')
  const [payloads, setPayloads] = useState<Payload[]>(initPayloads)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Payload | null>(null)

  // ── create / edit form state ──
  const blankForm = () => ({
    name: '', category: 'Custom' as PayloadCategory,
    location: 'Body' as InjectionLocation,
    description: '', tags: '',
    payloadsText: '',
  })
  const [form, setForm] = useState(blankForm())
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  function openCreate() {
    setEditTarget(null)
    setForm(blankForm())
    setFormErrors({})
    setPanelOpen(true)
  }

  function openEdit(p: Payload) {
    setEditTarget(p)
    setForm({
      name: p.name, category: p.category,
      location: p.location, description: p.description,
      tags: p.tags.join(', '),
      payloadsText: p.payloads.join('\n'),
    })
    setFormErrors({})
    setPanelOpen(true)
  }

  function setF(k: keyof typeof form, v: string) {
    setForm(prev => ({ ...prev, [k]: v }))
    if (formErrors[k]) setFormErrors(prev => { const n = { ...prev }; delete n[k]; return n })
  }

  function handleSave() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.payloadsText.trim()) errs.payloadsText = 'At least one payload required'
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    const lines = form.payloadsText.split('\n').map(l => l.trim()).filter(Boolean)
    if (editTarget) {
      setPayloads(prev => prev.map(p => p.id === editTarget.id ? {
        ...p, name: form.name.trim(), category: form.category,
        location: form.location, description: form.description,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        payloads: lines, count: lines.length,
        modified: '2026-07-31', builtIn: false,
        preview: lines[0] ?? '',
      } : p))
    } else {
      const newId = `PL-${String(payloads.length + 1).padStart(3, '0')}`
      setPayloads(prev => [{
        id: newId, name: form.name.trim(), category: form.category,
        location: form.location, description: form.description,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        payloads: lines, count: lines.length,
        author: 'M. Alves', modified: '2026-07-31', builtIn: false,
        preview: lines[0] ?? '',
      }, ...prev])
    }
    setPanelOpen(false)
    setEditTarget(null)
  }

  function deletePayload(id: string) {
    setPayloads(prev => prev.filter(p => p.id !== id))
    setSelectedRows(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  function toggleRow(id: string) {
    setSelectedRows(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  // ── filtering ──
  const filtered = payloads.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.preview.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchLoc = activeLocation === 'All' || p.location === activeLocation
    return matchSearch && matchCat && matchLoc
  })

  const allSelected = filtered.length > 0 && filtered.every(p => selectedRows.has(p.id))

  // ── category counts ──
  const catCounts = PAYLOAD_CATEGORIES.reduce((acc, c) => {
    acc[c] = payloads.filter(p => p.category === c).length
    return acc
  }, {} as Record<PayloadCategory, number>)

  const totalPayloadCount = payloads.reduce((s, p) => s + p.count, 0)

  // shared styles
  const inp: React.CSSProperties = { ...inputBase, backgroundColor: '#1A1D21' }
  const fLabel: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    display: 'block', marginBottom: 5,
  }

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>

      {/* ── Left sidebar: category list ── */}
      <div style={{
        width: 200, flexShrink: 0,
        borderRight: '1px solid #2A2E33',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '14px 14px 8px' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Collections
          </span>
        </div>

        {/* All */}
        {(['All', ...PAYLOAD_CATEGORIES] as const).map(cat => {
          const active = activeCategory === cat
          const count = cat === 'All' ? payloads.length : catCounts[cat as PayloadCategory]
          return (
            <button key={cat} onClick={() => setActiveCategory(cat as PayloadCategory | 'All')} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '7px 14px',
              background: 'none', border: 'none',
              backgroundColor: active ? '#3B82F61A' : 'transparent',
              borderLeft: active ? '2px solid #3B82F6' : '2px solid transparent',
              cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.1s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#1A1D21' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <span style={{ fontSize: 12, color: active ? '#F5F5F5' : '#B6BDC8', fontWeight: active ? 500 : 400 }}>
                {cat}
              </span>
              <span style={{
                fontSize: 10, fontFamily: 'var(--font-mono)',
                color: active ? '#3B82F6' : '#4B5563',
                backgroundColor: active ? '#3B82F61A' : '#1F2328',
                padding: '0 5px', borderRadius: 8, minWidth: 18, textAlign: 'center',
              }}>{count}</span>
            </button>
          )
        })}

        <div style={{ borderTop: '1px solid #2A2E33', margin: '8px 0', marginTop: 'auto' }} />

        {/* Stats footer */}
        <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: '#4B5563' }}>Collections</span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#6B7280' }}>{payloads.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: '#4B5563' }}>Total payloads</span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#6B7280' }}>{totalPayloadCount.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: '#4B5563' }}>Custom</span>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#6B7280' }}>
              {payloads.filter(p => !p.builtIn).length}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 20px', borderBottom: '1px solid #2A2E33',
          flexShrink: 0,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', width: 280 }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#4B5563', display: 'flex', pointerEvents: 'none' }}>
              <IconSearch />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search payloads, tags, content…"
              style={{ ...inputBase, paddingLeft: 30, height: 30, backgroundColor: '#1A1D21' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
            />
          </div>

          {/* Location filter */}
          <div style={{ display: 'flex', gap: 2, backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 7, padding: 3 }}>
            {(['All', ...LOCATION_LABELS] as const).map(loc => (
              <button key={loc} onClick={() => setActiveLocation(loc as InjectionLocation | 'All')} style={{
                padding: '3px 9px', borderRadius: 5, border: 'none', cursor: 'pointer',
                backgroundColor: activeLocation === loc ? '#2A2E33' : 'transparent',
                color: activeLocation === loc ? '#F5F5F5' : '#6B7280',
                fontSize: 11, fontWeight: activeLocation === loc ? 500 : 400,
                transition: 'all 0.1s',
              }}>{loc}</button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {selectedRows.size > 0 && (
            <>
              <span style={{ fontSize: 11, color: '#6B7280' }}>{selectedRows.size} selected</span>
              <button onClick={() => {
                setPayloads(prev => prev.filter(p => !selectedRows.has(p.id)))
                setSelectedRows(new Set())
              }} style={{
                padding: '5px 10px', borderRadius: 7, border: '1px solid #EF444430',
                backgroundColor: '#EF444410', color: '#EF4444', fontSize: 12, cursor: 'pointer',
              }}>Delete selected</button>
            </>
          )}

          <span style={{ fontSize: 11, color: '#4B5563', fontFamily: 'var(--font-mono)' }}>
            {filtered.length} / {payloads.length}
          </span>

          <button onClick={openCreate} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 7,
            backgroundColor: '#3B82F6', border: 'none',
            color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}><IconPlus /> Create Payload</button>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '28px 60px 220px 130px 110px 1fr 110px 84px',
          padding: '7px 20px', borderBottom: '1px solid #2A2E33',
          backgroundColor: '#111315', flexShrink: 0,
          position: 'sticky', top: 0, zIndex: 2,
        }}>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={allSelected}
              onChange={() => setSelectedRows(allSelected ? new Set() : new Set(filtered.map(p => p.id)))}
              style={{ width: 12, height: 12, accentColor: '#3B82F6', cursor: 'pointer' }} />
          </span>
          <TH>ID</TH>
          <TH>Name</TH>
          <TH>Category</TH>
          <TH>Location</TH>
          <TH>Payload Preview</TH>
          <TH>Last Modified</TH>
          <TH>Actions</TH>
        </div>

        {/* Table body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#4B5563', fontSize: 12 }}>
              No payloads match your filter.
            </div>
          )}

          {filtered.map((p, i) => {
            const selected = selectedRows.has(p.id)
            const expanded = expandedRow === p.id
            const cs = categoryStyle[p.category]
            return (
              <div key={p.id}>
                {/* Main row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 60px 220px 130px 110px 1fr 110px 84px',
                  padding: '8px 20px',
                  borderBottom: expanded ? 'none' : '1px solid #1F2328',
                  alignItems: 'center',
                  backgroundColor: selected ? '#3B82F608' : expanded ? '#1A1D21' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                  onClick={() => setExpandedRow(expanded ? null : p.id)}
                  onMouseEnter={e => { if (!selected && !expanded) e.currentTarget.style.backgroundColor = '#1A1D21' }}
                  onMouseLeave={e => { if (!selected && !expanded) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }} onClick={e => { e.stopPropagation(); toggleRow(p.id) }}>
                    <input type="checkbox" checked={selected} onChange={() => toggleRow(p.id)}
                      style={{ width: 12, height: 12, accentColor: '#3B82F6', cursor: 'pointer' }} />
                  </span>

                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6' }}>{p.id}</span>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, color: '#F5F5F5', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                      {p.builtIn && (
                        <span style={{ fontSize: 9, color: '#4B5563', border: '1px solid #2A2E33', borderRadius: 3, padding: '0 4px', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>built-in</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: '#4B5563', marginTop: 1, fontFamily: 'var(--font-mono)' }}>
                      {p.count} payload{p.count !== 1 ? 's' : ''} · {p.author}
                    </div>
                  </div>

                  {/* Category badge */}
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 4,
                    backgroundColor: cs.bg, color: cs.text,
                    fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap', width: 'fit-content',
                  }}>{p.category}</span>

                  {/* Location */}
                  <span style={{
                    display: 'inline-block', padding: '2px 7px', borderRadius: 4,
                    backgroundColor: '#2A2E33', color: '#9CA3AF',
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                  }}>{p.location}</span>

                  {/* Preview */}
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    display: 'block', paddingRight: 12,
                  }}>{p.preview}</span>

                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563' }}>{p.modified}</span>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button title="Edit" onClick={() => openEdit(p)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 26, height: 26, borderRadius: 5,
                      backgroundColor: 'transparent', border: '1px solid #2A2E33',
                      color: '#6B7280', cursor: 'pointer',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#3A3E45'; e.currentTarget.style.color = '#B6BDC8' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#6B7280' }}
                    ><IconCode /></button>
                    <button title="Use in scan" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 26, height: 26, borderRadius: 5,
                      backgroundColor: 'transparent', border: '1px solid #2A2E33',
                      color: '#6B7280', cursor: 'pointer',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#3B82F6' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#6B7280' }}
                    ><IconZap /></button>
                    {!p.builtIn && (
                      <button title="Delete" onClick={() => deletePayload(p.id)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 26, height: 26, borderRadius: 5,
                        backgroundColor: 'transparent', border: '1px solid #2A2E33',
                        color: '#6B7280', cursor: 'pointer',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#6B7280' }}
                      ><span style={{ fontSize: 14, lineHeight: 1 }}>×</span></button>
                    )}
                  </div>
                </div>

                {/* Expanded detail row */}
                {expanded && (
                  <div style={{
                    borderBottom: '1px solid #2A2E33',
                    backgroundColor: '#1A1D21',
                    padding: '0 20px 14px 108px',
                  }}>
                    {/* Description + tags */}
                    <div style={{ display: 'flex', gap: 32, marginBottom: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Description</div>
                        <div style={{ fontSize: 12, color: '#B6BDC8', lineHeight: 1.55 }}>{p.description || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Tags</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {p.tags.map(t => (
                            <span key={t} style={{
                              fontSize: 10, fontFamily: 'var(--font-mono)', color: '#6B7280',
                              backgroundColor: '#2A2E33', padding: '1px 7px', borderRadius: 4,
                            }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Payload list preview */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                        Payload Preview <span style={{ color: '#2A2E33', fontWeight: 400 }}>— first {Math.min(p.payloads.length, 4)} of {p.count}</span>
                      </div>
                      <div style={{
                        backgroundColor: '#111315', border: '1px solid #2A2E33',
                        borderRadius: 7, overflow: 'hidden',
                      }}>
                        {p.payloads.slice(0, 4).map((pl, idx) => (
                          <div key={idx} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '6px 12px',
                            borderBottom: idx < Math.min(p.payloads.length, 4) - 1 ? '1px solid #1F2328' : 'none',
                          }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3A3E45', width: 18, flexShrink: 0 }}>{idx + 1}</span>
                            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#86EFAC', flex: 1 }}>{pl}</code>
                            <button onClick={() => navigator.clipboard?.writeText(pl)} title="Copy" style={{
                              background: 'none', border: 'none', color: '#3A3E45',
                              cursor: 'pointer', fontSize: 11, padding: '2px 4px', flexShrink: 0,
                            }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#6B7280')}
                              onMouseLeave={e => (e.currentTarget.style.color = '#3A3E45')}
                            >⎘</button>
                          </div>
                        ))}
                        {p.count > 4 && (
                          <div style={{ padding: '5px 12px', fontSize: 10, color: '#4B5563', fontFamily: 'var(--font-mono)' }}>
                            + {p.count - 4} more payloads
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Create / Edit panel ── */}
      {panelOpen && (
        <div style={{
          width: 340, flexShrink: 0,
          borderLeft: '1px solid #2A2E33',
          backgroundColor: '#111315',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>
          {/* Panel header */}
          <div style={{ padding: '13px 18px', borderBottom: '1px solid #2A2E33', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#F5F5F5' }}>
              {editTarget ? 'Edit Payload' : 'Create Payload'}
            </span>
            <button onClick={() => setPanelOpen(false)} style={{
              width: 24, height: 24, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'transparent', border: '1px solid transparent',
              color: '#6B7280', cursor: 'pointer', fontSize: 14,
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1A1D21'; e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#B6BDC8' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#6B7280' }}
            >✕</button>
          </div>

          <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>

            {/* Name */}
            <div>
              <label style={fLabel}>Name <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={form.name} onChange={e => setF('name', e.target.value)}
                placeholder="e.g. Auth Bypass SQLi"
                style={{ ...inp, borderColor: formErrors.name ? '#EF4444' : '#2A2E33' }}
                onFocus={e => (e.currentTarget.style.borderColor = formErrors.name ? '#EF4444' : '#3B82F6')}
                onBlur={e => (e.currentTarget.style.borderColor = formErrors.name ? '#EF4444' : '#2A2E33')}
              />
              {formErrors.name && <span style={{ fontSize: 10, color: '#EF4444', marginTop: 3, display: 'block' }}>{formErrors.name}</span>}
            </div>

            {/* Category + Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={fLabel}>Category</label>
                <select value={form.category} onChange={e => setF('category', e.target.value)}
                  style={{ ...inp }}>
                  {PAYLOAD_CATEGORIES.map(c => <option key={c} value={c} style={{ backgroundColor: '#1A1D21' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={fLabel}>Location</label>
                <select value={form.location} onChange={e => setF('location', e.target.value)}
                  style={{ ...inp }}>
                  {LOCATION_LABELS.map(l => <option key={l} value={l} style={{ backgroundColor: '#1A1D21' }}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={fLabel}>Description</label>
              <textarea value={form.description} onChange={e => setF('description', e.target.value)}
                placeholder="What vulnerability does this test for?" rows={3}
                style={{ ...inp, height: 'auto', padding: '8px 10px', resize: 'vertical', lineHeight: 1.5 }}
                onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
              />
            </div>

            {/* Tags */}
            <div>
              <label style={fLabel}>Tags <span style={{ fontWeight: 400, color: '#4B5563', textTransform: 'none', letterSpacing: 0 }}>— comma separated</span></label>
              <input value={form.tags} onChange={e => setF('tags', e.target.value)}
                placeholder="auth, login, bypass"
                style={{ ...inp }}
                onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
              />
            </div>

            {/* Payloads textarea */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ ...fLabel, marginBottom: 5 }}>
                Payloads <span style={{ color: '#EF4444' }}>*</span>
                <span style={{ fontWeight: 400, color: '#4B5563', textTransform: 'none', letterSpacing: 0 }}> — one per line</span>
              </label>
              <textarea value={form.payloadsText} onChange={e => setF('payloadsText', e.target.value)}
                placeholder={"' OR '1'='1' --\n' OR 1=1 --\nadmin'--"}
                rows={10}
                style={{
                  ...inp, height: 'auto', flexGrow: 1,
                  padding: '10px 12px', resize: 'vertical',
                  lineHeight: '18px', fontFamily: 'var(--font-mono)', fontSize: 11,
                  borderColor: formErrors.payloadsText ? '#EF4444' : '#2A2E33',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = formErrors.payloadsText ? '#EF4444' : '#3B82F6')}
                onBlur={e => (e.currentTarget.style.borderColor = formErrors.payloadsText ? '#EF4444' : '#2A2E33')}
              />
              {formErrors.payloadsText && (
                <span style={{ fontSize: 10, color: '#EF4444', marginTop: 3 }}>{formErrors.payloadsText}</span>
              )}
              {form.payloadsText && (
                <span style={{ fontSize: 10, color: '#4B5563', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  {form.payloadsText.split('\n').filter(l => l.trim()).length} payload{form.payloadsText.split('\n').filter(l => l.trim()).length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Panel footer */}
          <div style={{ padding: '12px 18px', borderTop: '1px solid #2A2E33', display: 'flex', gap: 8, flexShrink: 0 }}>
            <button onClick={() => setPanelOpen(false)} style={{
              flex: 1, height: 32, borderRadius: 7,
              backgroundColor: 'transparent', border: '1px solid #2A2E33',
              color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
            >Cancel</button>
            <button onClick={handleSave} style={{
              flex: 2, height: 32, borderRadius: 7,
              backgroundColor: '#3B82F6', border: 'none',
              color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>{editTarget ? 'Save Changes' : 'Create Payload'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Scan Configuration View ──────────────────────────────────────────────────

const SCAN_PROJECTS = [
  { id: 'PRJ-014', name: 'Payment Gateway v2 Audit',  target: 'api.payments.internal' },
  { id: 'PRJ-013', name: 'Auth Service Hardening',     target: 'auth.svc.prod:8443'    },
  { id: 'PRJ-012', name: 'GraphQL Gateway Review',     target: 'graphql.gateway'        },
  { id: 'PRJ-011', name: 'Admin API IDOR Assessment',  target: 'api.users.internal'     },
]

const SCAN_ENDPOINTS: Record<string, Array<{ id: string; method: HttpMethod; name: string; url: string }>> = {
  'PRJ-014': [
    { id: 'EP-001', method: 'GET',    name: 'List Transactions',     url: '/v2/transactions'              },
    { id: 'EP-002', method: 'POST',   name: 'Create Transaction',    url: '/v2/transactions'              },
    { id: 'EP-003', method: 'GET',    name: 'Get Transaction by ID', url: '/v2/transactions/{id}'         },
    { id: 'EP-007', method: 'POST',   name: 'Authenticate',          url: '/v2/auth/token'                },
    { id: 'EP-008', method: 'PUT',    name: 'Update Account',        url: '/v2/accounts/{id}'             },
  ],
  'PRJ-013': [
    { id: 'EP-020', method: 'POST',   name: 'OAuth Token',           url: '/oauth/token'                  },
    { id: 'EP-021', method: 'GET',    name: 'Introspect Token',      url: '/oauth/introspect'             },
    { id: 'EP-022', method: 'DELETE', name: 'Revoke Token',          url: '/oauth/revoke'                 },
  ],
  'PRJ-012': [
    { id: 'EP-030', method: 'POST',   name: 'GraphQL Query',         url: '/query'                        },
    { id: 'EP-031', method: 'GET',    name: 'Schema Introspection',  url: '/query?introspection'          },
  ],
  'PRJ-011': [
    { id: 'EP-040', method: 'GET',    name: 'List Users',            url: '/admin/users'                  },
    { id: 'EP-041', method: 'GET',    name: 'Get User by ID',        url: '/admin/users/{id}'             },
    { id: 'EP-042', method: 'PATCH',  name: 'Update User Role',      url: '/admin/users/{id}/role'        },
    { id: 'EP-043', method: 'DELETE', name: 'Delete User',           url: '/admin/users/{id}'             },
  ],
}

const SCAN_INJECTION_LOCATIONS = ['Body', 'Query Parameter', 'Header', 'Cookie', 'Path Variable'] as const
type ScanInjectionLocation = typeof SCAN_INJECTION_LOCATIONS[number]

const SCAN_PAYLOAD_COLLECTIONS: Record<PayloadCategory, Array<{ id: string; name: string; count: number; preview: string[] }>> = {
  'SQL Injection': [
    { id: 'sql-01', name: 'Classic Auth Bypass',    count: 48,  preview: ["' OR '1'='1' --", "' OR 1=1 --", "admin'--", "' OR 'x'='x"] },
    { id: 'sql-02', name: 'Error-Based Extraction', count: 62,  preview: ["' AND EXTRACTVALUE(1,CONCAT(0x7e,version())) --", "' AND 1=CONVERT(int,@@version) --"] },
    { id: 'sql-03', name: 'Time-Based Blind SQLi',  count: 34,  preview: ["'; WAITFOR DELAY '0:0:5' --", "' OR SLEEP(5) --", "1; SELECT SLEEP(5)"] },
  ],
  'XSS': [
    { id: 'xss-01', name: 'Reflected – Script Tag', count: 34,  preview: ['<script>alert(document.domain)</script>', '<img src=x onerror=alert(1)>', '<svg onload=alert(1)>'] },
    { id: 'xss-02', name: 'Stored – JSON Context',  count: 19,  preview: ['{"name":"<img src=x onerror=fetch(\'//evil\')>"}'] },
  ],
  'Command Injection': [
    { id: 'cmd-01', name: 'Unix Shell Metachar',     count: 41,  preview: ['; cat /etc/passwd', '| whoami', '`id`', '$(id)'] },
    { id: 'cmd-02', name: 'Windows CMD',              count: 28,  preview: ['& whoami', '| dir', '; dir c:\\'] },
  ],
  'Path Traversal': [
    { id: 'path-01', name: 'Unix Traversal',         count: 28,  preview: ['../../../../etc/passwd', '../../../etc/shadow'] },
    { id: 'path-02', name: 'Windows Traversal',      count: 22,  preview: ['..\\..\\..\\windows\\win.ini'] },
  ],
  'XXE': [
    { id: 'xxe-01', name: 'External Entity',         count: 15,  preview: ['<!DOCTYPE x [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>'] },
  ],
  'SSRF': [
    { id: 'ssrf-01', name: 'Cloud Metadata',         count: 24,  preview: ['http://169.254.169.254/latest/meta-data/', 'http://metadata.google.internal/computeMetadata/v1/'] },
    { id: 'ssrf-02', name: 'Internal Port Scan',     count: 18,  preview: ['http://127.0.0.1:8080/', 'http://127.0.0.1:3306/'] },
  ],
  'CSRF': [
    { id: 'csrf-01', name: 'Form Auto-Submit',       count: 8,   preview: ['<form action="…" method="POST">…</form>'] },
  ],
  'JWT': [
    { id: 'jwt-01', name: 'Algorithm Confusion',     count: 12,  preview: ['{"alg":"none","typ":"JWT"}', 'RS256→HS256 confusion'] },
    { id: 'jwt-02', name: 'Weak Secret Wordlist',    count: 512, preview: ['secret', 'password', '123456', 'changeme'] },
  ],
  'Custom': [
    { id: 'cust-01', name: 'Payment Field Overflows', count: 21, preview: ['{"amount": 99999999999999}', '{"amount": -1}', '{"currency": "INVALID"}'] },
  ],
}

const SCAN_PROFILES = [
  { id: 'owasp',     name: 'OWASP API Top 10',    desc: 'Full coverage of the OWASP API Security Top 10' },
  { id: 'fast',      name: 'Fast Probe',           desc: 'Quick, low-noise scan with reduced payload set' },
  { id: 'auth',      name: 'Auth & AuthZ Only',    desc: 'Focuses on authentication and authorization flaws' },
  { id: 'injection', name: 'Injection Attacks',    desc: 'SQLi, XSS, CMDi, XXE, and path traversal only' },
  { id: 'custom',    name: 'Custom Configuration', desc: 'Manually configure category, location, and payloads' },
]

function ScanConfigView() {
  const [selectedProjectId, setSelectedProjectId] = useState('PRJ-014')
  const [selectedEndpointId, setSelectedEndpointId] = useState('EP-002')
  const [scanProfile, setScanProfile] = useState('custom')
  const [payloadCategory, setPayloadCategory] = useState<PayloadCategory>('SQL Injection')
  const [collectionId, setCollectionId] = useState('sql-01')
  const [injectionLocation, setInjectionLocation] = useState<ScanInjectionLocation>('Body')
  const [timeout, setTimeoutMs] = useState('30000')
  const [delay, setDelay] = useState('200')
  const [maxRequests, setMaxRequests] = useState('500')
  const [followRedirects, setFollowRedirects] = useState(true)
  const [stopOnFirst, setStopOnFirst] = useState(false)
  const [scanName, setScanName] = useState('')
  const [launched, setLaunched] = useState(false)
  const [launching, setLaunching] = useState(false)

  const project   = SCAN_PROJECTS.find(p => p.id === selectedProjectId)!
  const endpoints = SCAN_ENDPOINTS[selectedProjectId] ?? []
  const endpoint  = endpoints.find(e => e.id === selectedEndpointId) ?? endpoints[0]

  const collections = SCAN_PAYLOAD_COLLECTIONS[payloadCategory] ?? []
  const collection  = collections.find(c => c.id === collectionId) ?? collections[0]

  // When project changes, reset endpoint
  function handleProjectChange(pid: string) {
    setSelectedProjectId(pid)
    const eps = SCAN_ENDPOINTS[pid] ?? []
    setSelectedEndpointId(eps[0]?.id ?? '')
  }

  // When category changes, reset collection
  function handleCategoryChange(cat: PayloadCategory) {
    setPayloadCategory(cat)
    const cols = SCAN_PAYLOAD_COLLECTIONS[cat] ?? []
    setCollectionId(cols[0]?.id ?? '')
  }

  // Derived estimates
  const payloadCount = collection?.count ?? 0
  const reqPerPayload = injectionLocation === 'Path Variable' ? 1 : 1
  const delayMs = parseInt(delay) || 0
  const estRequests = Math.min(parseInt(maxRequests) || 500, payloadCount * reqPerPayload)
  const estSeconds = Math.round((estRequests * (delayMs + 250)) / 1000)
  const estDuration = estSeconds < 60
    ? `~${estSeconds}s`
    : `~${Math.floor(estSeconds / 60)}m ${estSeconds % 60}s`

  function handleLaunch() {
    setLaunching(true)
    setTimeout(() => { setLaunching(false); setLaunched(true) }, 1400)
  }

  // shared
  const inp: React.CSSProperties = { ...inputBase, backgroundColor: '#1A1D21' }
  const fLabel: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, color: '#6B7280',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    display: 'block', marginBottom: 5,
  }
  const sectionCard: React.CSSProperties = {
    backgroundColor: '#1A1D21', border: '1px solid #2A2E33',
    borderRadius: 10, overflow: 'hidden',
  }
  const sectionHead: React.CSSProperties = {
    padding: '10px 16px', borderBottom: '1px solid #2A2E33',
    display: 'flex', alignItems: 'center', gap: 8,
  }
  const sectionBody: React.CSSProperties = { padding: '14px 16px' }

  function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
    return (
      <div style={sectionHead}>
        {icon && <span style={{ color: '#4B5563', display: 'flex' }}>{icon}</span>}
        <span style={{ fontSize: 12, fontWeight: 600, color: '#F5F5F5' }}>{children}</span>
      </div>
    )
  }

  function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => onChange(!checked)} style={{
          width: 30, height: 17, borderRadius: 9,
          backgroundColor: checked ? '#3B82F6' : '#2A2E33',
          border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
          transition: 'background 0.15s',
        }}>
          <span style={{
            position: 'absolute', top: 2.5,
            left: checked ? 14 : 2.5,
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: '#F5F5F5', transition: 'left 0.15s',
          }} />
        </button>
        <span style={{ fontSize: 12, color: '#B6BDC8' }}>{label}</span>
      </div>
    )
  }

  function SummaryRow({ label, value, mono = false, accent }: {
    label: string; value: string | number; mono?: boolean; accent?: string
  }) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: '1px solid #1F2328' }}>
        <span style={{ fontSize: 11, color: '#6B7280', flexShrink: 0 }}>{label}</span>
        <span style={{
          fontSize: 11, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          color: accent ?? '#B6BDC8', textAlign: 'right',
          wordBreak: 'break-all',
        }}>{value}</span>
      </div>
    )
  }

  if (launched) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          backgroundColor: '#22C55E18', border: '1px solid #22C55E30',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#22C55E', fontSize: 22,
        }}>✓</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F5', marginBottom: 4 }}>Scan queued successfully</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>
            {endpoint?.name} · {payloadCount} payloads · {injectionLocation}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4B5563', marginTop: 3 }}>
            SCN-{String(Math.floor(Math.random() * 900) + 100)}
          </div>
        </div>
        <button onClick={() => setLaunched(false)} style={{
          marginTop: 8, padding: '6px 16px', borderRadius: 7,
          backgroundColor: 'transparent', border: '1px solid #2A2E33',
          color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
        }}>Configure another scan</button>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Page header ── */}
      <div style={{
        padding: '16px 24px 14px', borderBottom: '1px solid #2A2E33',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F5', margin: 0, letterSpacing: '-0.02em' }}>
            Scan Configuration
          </h1>
          <p style={{ fontSize: 11, color: '#6B7280', margin: '3px 0 0' }}>
            Configure payload, injection target, and execution parameters before running a scan.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{
            padding: '6px 12px', borderRadius: 7, border: '1px solid #2A2E33',
            backgroundColor: 'transparent', color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
          >Save as Template</button>
          <button style={{
            padding: '6px 12px', borderRadius: 7, border: '1px solid #2A2E33',
            backgroundColor: 'transparent', color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
          >Load Template</button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── Scan name + profile ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={fLabel}>Scan Name <span style={{ fontWeight: 400, color: '#4B5563', textTransform: 'none', letterSpacing: 0 }}>— optional</span></label>
              <input value={scanName} onChange={e => setScanName(e.target.value)}
                placeholder="e.g. Payment API – SQLi sweep"
                style={inp}
                onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
              />
            </div>
            <div>
              <label style={fLabel}>Scan Profile</label>
              <select value={scanProfile} onChange={e => setScanProfile(e.target.value)}
                style={inp}>
                {SCAN_PROFILES.map(p => <option key={p.id} value={p.id} style={{ backgroundColor: '#1A1D21' }}>{p.name}</option>)}
              </select>
              {scanProfile !== 'custom' && (
                <div style={{ fontSize: 10, color: '#4B5563', marginTop: 4 }}>
                  {SCAN_PROFILES.find(p => p.id === scanProfile)?.desc}
                </div>
              )}
            </div>
          </div>

          {/* ── Scan Information ── */}
          <div style={sectionCard}>
            <SectionTitle icon={<IconTarget />}>Scan Target</SectionTitle>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={fLabel}>Project</label>
                  <select value={selectedProjectId} onChange={e => handleProjectChange(e.target.value)}
                    style={inp}>
                    {SCAN_PROJECTS.map(p => (
                      <option key={p.id} value={p.id} style={{ backgroundColor: '#1A1D21' }}>
                        {p.id} — {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={fLabel}>Endpoint</label>
                  <select value={selectedEndpointId} onChange={e => setSelectedEndpointId(e.target.value)}
                    style={inp}>
                    {endpoints.map(ep => (
                      <option key={ep.id} value={ep.id} style={{ backgroundColor: '#1A1D21' }}>
                        [{ep.method}] {ep.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Endpoint identity strip */}
              {endpoint && (
                <div style={{
                  backgroundColor: '#111315', border: '1px solid #2A2E33', borderRadius: 8,
                  padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <MethodBadge method={endpoint.method} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#F5F5F5', fontWeight: 500 }}>{endpoint.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6B7280', marginTop: 1 }}>
                      {project.target}{endpoint.url}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563', border: '1px solid #2A2E33', borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>
                    {endpoint.id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Payload Configuration ── */}
          <div style={sectionCard}>
            <SectionTitle icon={<IconPayload />}>Payload Configuration</SectionTitle>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={fLabel}>Category</label>
                  <select value={payloadCategory}
                    onChange={e => handleCategoryChange(e.target.value as PayloadCategory)}
                    style={inp}>
                    {PAYLOAD_CATEGORIES.map(c => <option key={c} value={c} style={{ backgroundColor: '#1A1D21' }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={fLabel}>Collection</label>
                  <select value={collectionId} onChange={e => setCollectionId(e.target.value)}
                    style={inp}>
                    {collections.map(c => (
                      <option key={c.id} value={c.id} style={{ backgroundColor: '#1A1D21' }}>
                        {c.name} ({c.count})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={fLabel}>Injection Location</label>
                  <select value={injectionLocation}
                    onChange={e => setInjectionLocation(e.target.value as ScanInjectionLocation)}
                    style={inp}>
                    {SCAN_INJECTION_LOCATIONS.map(l => <option key={l} value={l} style={{ backgroundColor: '#1A1D21' }}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Payload preview */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ ...fLabel, marginBottom: 0 }}>Payload Preview</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--font-mono)',
                      color: categoryStyle[payloadCategory]?.text ?? '#9CA3AF',
                      backgroundColor: categoryStyle[payloadCategory]?.bg ?? '#2A2E33',
                      padding: '1px 7px', borderRadius: 4,
                    }}>{payloadCategory}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563' }}>
                      {collection?.count ?? 0} payloads
                    </span>
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#111315', border: '1px solid #2A2E33',
                  borderRadius: 8, overflow: 'hidden',
                }}>
                  {/* line numbers + code */}
                  {(collection?.preview ?? []).slice(0, 5).map((pl, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center',
                      borderBottom: idx < Math.min((collection?.preview ?? []).length, 5) - 1 ? '1px solid #1F2328' : 'none',
                    }}>
                      <span style={{
                        width: 36, flexShrink: 0, textAlign: 'right', paddingRight: 10,
                        fontSize: 10, lineHeight: '32px', color: '#3A3E45',
                        fontFamily: 'var(--font-mono)', backgroundColor: '#1A1D21',
                        borderRight: '1px solid #1F2328',
                      }}>{idx + 1}</span>
                      <code style={{
                        flex: 1, padding: '6px 12px',
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        color: '#86EFAC', lineHeight: 1.5,
                        whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                      }}>{pl}</code>
                      <button onClick={() => navigator.clipboard?.writeText(pl)} title="Copy" style={{
                        flexShrink: 0, padding: '0 10px', height: 32,
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#3A3E45', fontSize: 13,
                      }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#6B7280')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#3A3E45')}
                      >⎘</button>
                    </div>
                  ))}
                  {(collection?.count ?? 0) > 5 && (
                    <div style={{
                      padding: '6px 12px 6px 48px',
                      fontSize: 10, color: '#4B5563', fontFamily: 'var(--font-mono)',
                      borderTop: '1px solid #1F2328',
                    }}>
                      + {(collection?.count ?? 0) - 5} more payloads in collection
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Scan Options ── */}
          <div style={sectionCard}>
            <SectionTitle icon={<IconSettings />}>Scan Options</SectionTitle>
            <div style={sectionBody}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={fLabel}>Request Timeout (ms)</label>
                  <input value={timeout} onChange={e => setTimeoutMs(e.target.value)}
                    style={{ ...inp, fontFamily: 'var(--font-mono)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
                  />
                </div>
                <div>
                  <label style={fLabel}>Delay Between Requests (ms)</label>
                  <input value={delay} onChange={e => setDelay(e.target.value)}
                    style={{ ...inp, fontFamily: 'var(--font-mono)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
                  />
                </div>
                <div>
                  <label style={fLabel}>Maximum Requests</label>
                  <input value={maxRequests} onChange={e => setMaxRequests(e.target.value)}
                    style={{ ...inp, fontFamily: 'var(--font-mono)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
                  />
                </div>
                <div>
                  <label style={fLabel}>Concurrency</label>
                  <select style={inp}>
                    {['1 (sequential)', '2', '4', '8', '16'].map(v => (
                      <option key={v} style={{ backgroundColor: '#1A1D21' }}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 28 }}>
                <Toggle checked={followRedirects} onChange={setFollowRedirects} label="Follow redirects" />
                <Toggle checked={stopOnFirst} onChange={setStopOnFirst} label="Stop on first finding" />
              </div>
            </div>
          </div>

        </div>

        {/* ── Right summary panel ── */}
        <div style={{
          width: 264, flexShrink: 0,
          borderLeft: '1px solid #2A2E33',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Summary header */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                Scan Summary
              </div>
              <div>
                <SummaryRow label="Project" value={project.id} mono />
                <SummaryRow label="Endpoint" value={endpoint ? `${endpoint.method} ${endpoint.url}` : '—'} mono />
                <SummaryRow label="Target host" value={project.target} mono />
                <SummaryRow label="Auth" value="Bearer Token" />
              </div>
            </div>

            {/* Payload summary */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                Payload
              </div>
              <div>
                <SummaryRow label="Category" value={payloadCategory} />
                <SummaryRow label="Collection" value={collection?.name ?? '—'} />
                <SummaryRow label="Payload count" value={payloadCount.toLocaleString()} mono accent="#F5F5F5" />
                <SummaryRow label="Injection point" value={injectionLocation} />
              </div>
            </div>

            {/* Estimates */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                Estimates
              </div>
              <div>
                <SummaryRow label="Est. requests" value={estRequests.toLocaleString()} mono accent="#F5F5F5" />
                <SummaryRow label="Est. duration" value={estDuration} mono accent="#F5F5F5" />
                <SummaryRow label="Delay" value={`${delay}ms`} mono />
                <SummaryRow label="Timeout" value={`${timeout}ms`} mono />
                <SummaryRow label="Max requests" value={parseInt(maxRequests).toLocaleString()} mono />
              </div>
            </div>

            {/* Options summary */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                Options
              </div>
              <div>
                <SummaryRow label="Follow redirects" value={followRedirects ? 'Yes' : 'No'} accent={followRedirects ? '#22C55E' : '#6B7280'} />
                <SummaryRow label="Stop on first" value={stopOnFirst ? 'Yes' : 'No'} accent={stopOnFirst ? '#F59E0B' : '#6B7280'} />
                <SummaryRow label="Profile" value={SCAN_PROFILES.find(p => p.id === scanProfile)?.name ?? '—'} />
              </div>
            </div>
          </div>

          {/* ── Execute button ── */}
          <div style={{
            padding: '14px 18px', borderTop: '1px solid #2A2E33', flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <button onClick={handleLaunch} disabled={launching} style={{
              width: '100%', height: 34, borderRadius: 7,
              backgroundColor: launching ? '#1D4ED8' : '#3B82F6',
              border: 'none', color: '#fff',
              fontSize: 12, fontWeight: 500, cursor: launching ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              letterSpacing: '-0.01em',
              transition: 'background 0.15s',
            }}>
              {launching ? (
                <>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Queuing scan…
                </>
              ) : (
                <><IconZap /> Execute Scan</>
              )}
            </button>
            <div style={{ display: 'flex', gap: 7 }}>
              <button style={{
                flex: 1, padding: '5px 0', borderRadius: 7, border: '1px solid #2A2E33',
                backgroundColor: 'transparent', color: '#6B7280', fontSize: 12, cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
              >Dry Run</button>
              <button style={{
                flex: 1, padding: '5px 0', borderRadius: 7, border: '1px solid #2A2E33',
                backgroundColor: 'transparent', color: '#6B7280', fontSize: 12, cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
              >Schedule</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Scan History data ────────────────────────────────────────────────────────

type HistoryEntry = {
  id: string
  name: string
  project: string
  projectId: string
  endpoint: string
  endpointMethod: HttpMethod
  endpointUrl: string
  payloadCategory: PayloadCategory
  payloadCollection: string
  scanDate: string
  duration: string
  status: ScanStatus
  findings: number
  critical: number
  high: number
  medium: number
  low: number
  info: number
  requestCount: number
  trigger: 'Manual' | 'Scheduled' | 'CI/CD'
}

const scanHistoryData: HistoryEntry[] = [
  { id: 'SCN-0091', name: 'Payment API – SQLi sweep',      project: 'Payment Gateway v2 Audit',  projectId: 'PRJ-014', endpoint: 'Create Transaction',    endpointMethod: 'POST',   endpointUrl: '/v2/transactions',            payloadCategory: 'SQL Injection',    payloadCollection: 'Classic Auth Bypass',    scanDate: '2026-07-31 09:41', duration: '4m 12s', status: 'completed', findings: 14, critical: 2, high: 5, medium: 4, low: 2, info: 1, requestCount: 48,  trigger: 'Manual'    },
  { id: 'SCN-0090', name: 'OAuth JWT Algorithm Fuzz',      project: 'Auth Service Hardening',    projectId: 'PRJ-013', endpoint: 'OAuth Token',           endpointMethod: 'POST',   endpointUrl: '/oauth/token',                payloadCategory: 'JWT',              payloadCollection: 'Algorithm Confusion',    scanDate: '2026-07-31 09:38', duration: '1m 08s', status: 'running',   findings: 3,  critical: 0, high: 1, medium: 2, low: 0, info: 0, requestCount: 12,  trigger: 'Manual'    },
  { id: 'SCN-0089', name: 'GraphQL Introspection Probe',   project: 'GraphQL Gateway Review',    projectId: 'PRJ-012', endpoint: 'GraphQL Query',         endpointMethod: 'POST',   endpointUrl: '/query',                      payloadCategory: 'XSS',              payloadCollection: 'Reflected – Script Tag', scanDate: '2026-07-31 09:21', duration: '0m 44s', status: 'failed',    findings: 0,  critical: 0, high: 0, medium: 0, low: 0, info: 0, requestCount: 0,   trigger: 'Manual'    },
  { id: 'SCN-0088', name: 'Admin IDOR Assessment',         project: 'Admin API IDOR Assessment', projectId: 'PRJ-011', endpoint: 'Get User by ID',        endpointMethod: 'GET',    endpointUrl: '/admin/users/{id}',           payloadCategory: 'SQL Injection',    payloadCollection: 'Error-Based Extraction', scanDate: '2026-07-31 08:57', duration: '6m 55s', status: 'completed', findings: 7,  critical: 1, high: 2, medium: 3, low: 1, info: 0, requestCount: 62,  trigger: 'CI/CD'     },
  { id: 'SCN-0087', name: 'CDN Upload – Path Traversal',   project: 'CDN Upload Endpoint Test',  projectId: 'PRJ-010', endpoint: 'Upload Asset',          endpointMethod: 'POST',   endpointUrl: '/upload',                     payloadCategory: 'Path Traversal',   payloadCollection: 'Unix Traversal',         scanDate: '2026-07-31 08:45', duration: '—',      status: 'queued',    findings: 0,  critical: 0, high: 0, medium: 0, low: 0, info: 0, requestCount: 0,   trigger: 'Scheduled' },
  { id: 'SCN-0086', name: 'Payment Refunds Rate Limit',    project: 'Payment Gateway v2 Audit',  projectId: 'PRJ-014', endpoint: 'Initiate Refund',       endpointMethod: 'POST',   endpointUrl: '/v2/refunds',                 payloadCategory: 'Custom',           payloadCollection: 'Payment Field Overflows', scanDate: '2026-07-31 08:20', duration: '2m 31s', status: 'completed', findings: 2,  critical: 0, high: 1, medium: 1, low: 0, info: 0, requestCount: 21,  trigger: 'Manual'    },
  { id: 'SCN-0085', name: 'Auth SSRF – Metadata Probe',    project: 'Auth Service Hardening',    projectId: 'PRJ-013', endpoint: 'OAuth Token',           endpointMethod: 'POST',   endpointUrl: '/oauth/token',                payloadCategory: 'SSRF',             payloadCollection: 'Cloud Metadata',         scanDate: '2026-07-30 17:12', duration: '3m 08s', status: 'completed', findings: 0,  critical: 0, high: 0, medium: 0, low: 0, info: 2, requestCount: 24,  trigger: 'CI/CD'     },
  { id: 'SCN-0084', name: 'User Account XSS Sweep',        project: 'Admin API IDOR Assessment', projectId: 'PRJ-011', endpoint: 'Update User Role',      endpointMethod: 'PATCH',  endpointUrl: '/admin/users/{id}/role',      payloadCategory: 'XSS',              payloadCollection: 'Stored – JSON Context',  scanDate: '2026-07-30 14:11', duration: '1m 55s', status: 'completed', findings: 4,  critical: 0, high: 1, medium: 2, low: 1, info: 0, requestCount: 19,  trigger: 'Manual'    },
  { id: 'SCN-0083', name: 'Payment Auth Bypass',           project: 'Payment Gateway v2 Audit',  projectId: 'PRJ-014', endpoint: 'Authenticate',          endpointMethod: 'POST',   endpointUrl: '/v2/auth/token',              payloadCategory: 'SQL Injection',    payloadCollection: 'Classic Auth Bypass',    scanDate: '2026-07-30 11:30', duration: '4m 48s', status: 'completed', findings: 5,  critical: 1, high: 2, medium: 1, low: 1, info: 0, requestCount: 48,  trigger: 'Scheduled' },
  { id: 'SCN-0082', name: 'XXE Body Injection',            project: 'GraphQL Gateway Review',    projectId: 'PRJ-012', endpoint: 'GraphQL Query',         endpointMethod: 'POST',   endpointUrl: '/query',                      payloadCategory: 'XXE',              payloadCollection: 'External Entity',        scanDate: '2026-07-29 14:05', duration: '1m 12s', status: 'completed', findings: 1,  critical: 0, high: 1, medium: 0, low: 0, info: 0, requestCount: 15,  trigger: 'Manual'    },
  { id: 'SCN-0081', name: 'Command Injection – Unix',      project: 'CDN Upload Endpoint Test',  projectId: 'PRJ-010', endpoint: 'Upload Asset',          endpointMethod: 'POST',   endpointUrl: '/upload',                     payloadCategory: 'Command Injection', payloadCollection: 'Unix Shell Metachar',   scanDate: '2026-07-29 11:30', duration: '5m 00s', status: 'completed', findings: 3,  critical: 1, high: 1, medium: 1, low: 0, info: 0, requestCount: 41,  trigger: 'CI/CD'     },
  { id: 'SCN-0080', name: 'JWT Weak Secret Brute',         project: 'Auth Service Hardening',    projectId: 'PRJ-013', endpoint: 'Introspect Token',      endpointMethod: 'GET',    endpointUrl: '/oauth/introspect',           payloadCategory: 'JWT',              payloadCollection: 'Weak Secret Wordlist',   scanDate: '2026-07-28 09:14', duration: '12m 40s', status: 'completed', findings: 2, critical: 1, high: 1, medium: 0, low: 0, info: 0, requestCount: 512, trigger: 'Manual'    },
]

// Realistic findings for a selected scan result
const scanResultFindings: Record<string, Array<{
  id: string; title: string; severity: SeverityLevel; cwe: string; owasp: string
  endpoint: string; parameter: string; payload: string; evidence: string; remediation: string
}>> = {
  'SCN-0091': [
    { id: 'F-441', title: 'Broken Object Level Authorization', severity: 'critical', cwe: 'CWE-639', owasp: 'API1', endpoint: 'POST /v2/transactions', parameter: 'account_id (body)', payload: "' OR '1'='1' --", evidence: 'Response 200 with another user\'s transaction data', remediation: 'Enforce ownership checks server-side for every object reference.' },
    { id: 'F-440', title: 'SQL Injection in amount field',     severity: 'critical', cwe: 'CWE-89',  owasp: 'API1', endpoint: 'POST /v2/transactions', parameter: 'amount (body)',      payload: "1 AND SLEEP(5) --",  evidence: 'Response delayed 5.1s confirming blind SQLi',       remediation: 'Use parameterised queries; validate amount as numeric only.' },
    { id: 'F-439', title: 'Verbose SQL Error Disclosure',      severity: 'high',     cwe: 'CWE-209', owasp: 'API8', endpoint: 'POST /v2/transactions', parameter: 'currency (body)',    payload: "''",                 evidence: 'MySQL error: "You have an error in your SQL syntax"', remediation: 'Suppress database errors in production responses.' },
    { id: 'F-438', title: 'Mass Assignment via POST body',     severity: 'high',     cwe: 'CWE-915', owasp: 'API3', endpoint: 'POST /v2/transactions', parameter: 'status (body)',      payload: '{"status":"approved"}', evidence: 'Status field accepted and persisted without validation', remediation: 'Allowlist accepted fields; reject unexpected properties.' },
    { id: 'F-437', title: 'Missing Rate Limiting',             severity: 'high',     cwe: 'CWE-307', owasp: 'API4', endpoint: 'POST /v2/transactions', parameter: 'N/A',                payload: '(200 requests)',     evidence: 'No 429 response after 200 sequential requests',      remediation: 'Implement per-account request rate limiting.' },
    { id: 'F-436', title: 'Insecure Direct Object Reference',  severity: 'medium',   cwe: 'CWE-284', owasp: 'API1', endpoint: 'POST /v2/transactions', parameter: 'source.card_id',    payload: "card_01OTHER",       evidence: 'Other user\'s card charged successfully',            remediation: 'Validate card ownership before processing.' },
    { id: 'F-435', title: 'Transaction Replay Attack',         severity: 'medium',   cwe: 'CWE-294', owasp: 'API4', endpoint: 'POST /v2/transactions', parameter: 'idempotency_key',   payload: '(duplicate key)',    evidence: 'Duplicate transaction accepted with same key',        remediation: 'Reject replayed idempotency keys within 24h window.' },
  ],
}

// ─── Scan Results sub-view ────────────────────────────────────────────────────

function ScanResultsView({ scan, onBack }: { scan: HistoryEntry; onBack: () => void }) {
  const findings = scanResultFindings[scan.id] ?? []
  const [activeFilter, setActiveFilter] = useState<SeverityLevel | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = activeFilter === 'all' ? findings : findings.filter(f => f.severity === activeFilter)

  const sevCounts: Record<SeverityLevel, number> = {
    critical: findings.filter(f => f.severity === 'critical').length,
    high:     findings.filter(f => f.severity === 'high').length,
    medium:   findings.filter(f => f.severity === 'medium').length,
    low:      findings.filter(f => f.severity === 'low').length,
    info:     findings.filter(f => f.severity === 'info').length,
  }

  const severityColors: Record<SeverityLevel, string> = {
    critical: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#22C55E', info: '#6B7280',
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Results header */}
      <div style={{ padding: '12px 24px 0', borderBottom: '1px solid #2A2E33', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={onBack} style={{
              display: 'flex', alignItems: 'center', gap: 5, background: 'none',
              border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: 12, padding: 0,
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#B6BDC8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Scan History
            </button>
            <span style={{ color: '#2A2E33' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#3B82F6' }}>{scan.id}</span>
            <StatusPill status={scan.status} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '6px 12px', borderRadius: 7, border: '1px solid #2A2E33',
              backgroundColor: 'transparent', color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
            >Export Report</button>
            <button style={{
              padding: '6px 12px', borderRadius: 7, border: 'none',
              backgroundColor: '#3B82F6', color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>Re-run Scan</button>
          </div>
        </div>

        {/* Scan identity strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#F5F5F5', letterSpacing: '-0.02em' }}>{scan.name}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              {scan.project} · <span style={{ fontFamily: 'var(--font-mono)' }}>{scan.scanDate}</span> · {scan.trigger} · {scan.duration}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <MethodBadge method={scan.endpointMethod} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#B6BDC8' }}>{scan.endpointUrl}</span>
            <span style={{ width: 1, height: 12, backgroundColor: '#2A2E33', flexShrink: 0 }} />
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 4,
              backgroundColor: categoryStyle[scan.payloadCategory]?.bg ?? '#2A2E33',
              color: categoryStyle[scan.payloadCategory]?.text ?? '#9CA3AF',
              fontFamily: 'var(--font-mono)',
            }}>{scan.payloadCategory}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563' }}>{scan.requestCount} requests</span>
          </div>
        </div>

        {/* Severity summary bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: -1 }}>
          {(['all', 'critical', 'high', 'medium', 'low', 'info'] as const).map(level => {
            const active = activeFilter === level
            const count = level === 'all' ? findings.length : sevCounts[level as SeverityLevel]
            const color = level === 'all' ? '#B6BDC8' : severityColors[level as SeverityLevel]
            return (
              <button key={level} onClick={() => setActiveFilter(level as SeverityLevel | 'all')} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: active ? `2px solid ${level === 'all' ? '#3B82F6' : color}` : '2px solid transparent',
                color: active ? (level === 'all' ? '#F5F5F5' : color) : '#6B7280',
                fontSize: 12, fontWeight: active ? 500 : 400,
                transition: 'color 0.1s',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#B6BDC8' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#6B7280' }}
              >
                {level === 'all' ? 'All Findings' : level.charAt(0).toUpperCase() + level.slice(1)}
                <span style={{
                  fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600,
                  color: active ? (level === 'all' ? '#3B82F6' : color) : '#4B5563',
                  backgroundColor: active ? (level === 'all' ? '#3B82F61A' : color + '18') : '#2A2E33',
                  padding: '0 5px', borderRadius: 8, minWidth: 16, textAlign: 'center',
                }}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Findings table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#4B5563', fontSize: 12 }}>
            {findings.length === 0 ? 'No findings recorded for this scan.' : 'No findings match the selected filter.'}
          </div>
        )}

        {/* Header */}
        {filtered.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 130px 120px 100px 28px',
            padding: '7px 24px', borderBottom: '1px solid #2A2E33',
            position: 'sticky', top: 0, backgroundColor: '#111315', zIndex: 2,
          }}>
            <TH>ID</TH><TH>Vulnerability</TH><TH>CWE / OWASP</TH>
            <TH>Parameter</TH><TH>Severity</TH><span />
          </div>
        )}

        {filtered.map((f, i) => {
          const expanded = expandedId === f.id
          return (
            <div key={f.id}>
              <div style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 130px 120px 100px 28px',
                padding: '9px 24px',
                borderBottom: expanded ? 'none' : '1px solid #1F2328',
                alignItems: 'center', cursor: 'pointer',
                backgroundColor: expanded ? '#1A1D21' : 'transparent',
              }}
                onClick={() => setExpandedId(expanded ? null : f.id)}
                onMouseEnter={e => { if (!expanded) e.currentTarget.style.backgroundColor = '#1A1D21' }}
                onMouseLeave={e => { if (!expanded) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6' }}>{f.id}</span>
                <span style={{ fontSize: 12, color: '#F5F5F5', fontWeight: 500 }}>{f.title}</span>
                <div style={{ display: 'flex', gap: 5 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#4B5563', backgroundColor: '#2A2E33', padding: '1px 5px', borderRadius: 3 }}>{f.cwe}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#4B5563', backgroundColor: '#2A2E33', padding: '1px 5px', borderRadius: 3 }}>{f.owasp}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6B7280' }}>{f.parameter}</span>
                <SeverityBadge level={f.severity} />
                <span style={{ color: expanded ? '#B6BDC8' : '#4B5563', fontSize: 12 }}>
                  {expanded ? '▲' : '▼'}
                </span>
              </div>
              {expanded && (
                <div style={{
                  borderBottom: '1px solid #2A2E33', backgroundColor: '#1A1D21',
                  padding: '0 24px 14px 84px', display: 'grid',
                  gridTemplateColumns: '1fr 1fr', gap: 16,
                }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Payload Used</div>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#86EFAC' }}>{f.payload}</code>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Evidence</div>
                    <span style={{ fontSize: 12, color: '#B6BDC8', lineHeight: 1.5 }}>{f.evidence}</span>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Remediation</div>
                    <span style={{ fontSize: 12, color: '#B6BDC8', lineHeight: 1.5 }}>{f.remediation}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Scan History View ────────────────────────────────────────────────────────

function ScanHistoryView() {
  const [search, setSearch]               = useState('')
  const [filterProject, setFilterProject] = useState('All')
  const [filterStatus, setFilterStatus]   = useState<ScanStatus | 'All'>('All')
  const [filterSeverity, setFilterSeverity] = useState<'any' | 'critical' | 'high' | 'clean'>('any')
  const [filterDateRange, setFilterDateRange] = useState<'all' | 'today' | '7d' | '30d'>('all')
  const [selectedScan, setSelectedScan]   = useState<HistoryEntry | null>(null)

  if (selectedScan) {
    return <ScanResultsView scan={selectedScan} onBack={() => setSelectedScan(null)} />
  }

  const projectNames = ['All', ...Array.from(new Set(scanHistoryData.map(s => s.project)))]

  const now = new Date('2026-07-31')
  const filtered = scanHistoryData.filter(s => {
    const q = search.toLowerCase()
    if (q && !s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q) &&
        !s.endpoint.toLowerCase().includes(q) && !s.project.toLowerCase().includes(q) &&
        !s.payloadCategory.toLowerCase().includes(q)) return false
    if (filterProject !== 'All' && s.project !== filterProject) return false
    if (filterStatus !== 'All' && s.status !== filterStatus) return false
    if (filterSeverity === 'critical' && s.critical === 0) return false
    if (filterSeverity === 'high'     && s.high === 0 && s.critical === 0) return false
    if (filterSeverity === 'clean'    && s.findings > 0) return false
    if (filterDateRange !== 'all') {
      const d = new Date(s.scanDate)
      const diffDays = (now.getTime() - d.getTime()) / 86400000
      if (filterDateRange === 'today' && diffDays > 1) return false
      if (filterDateRange === '7d'    && diffDays > 7) return false
      if (filterDateRange === '30d'   && diffDays > 30) return false
    }
    return true
  })

  const summaryStats = {
    total:     scanHistoryData.length,
    completed: scanHistoryData.filter(s => s.status === 'completed').length,
    findings:  scanHistoryData.reduce((a, s) => a + s.findings, 0),
    critical:  scanHistoryData.reduce((a, s) => a + s.critical, 0),
  }

  const inp: React.CSSProperties = { ...inputBase, backgroundColor: '#1A1D21', height: 30 }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Page header ── */}
      <div style={{
        padding: '16px 24px 0', borderBottom: '1px solid #2A2E33', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F5', margin: 0, letterSpacing: '-0.02em' }}>Scan History</h1>
            <p style={{ fontSize: 11, color: '#6B7280', margin: '3px 0 0' }}>
              All previous scan executions across projects and endpoints.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '6px 12px', borderRadius: 7, border: '1px solid #2A2E33',
              backgroundColor: 'transparent', color: '#B6BDC8', fontSize: 12, cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
            >Export CSV</button>
          </div>
        </div>

        {/* Summary stat strip */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
          {[
            { label: 'Total Scans',    value: summaryStats.total,     color: '#F5F5F5' },
            { label: 'Completed',      value: summaryStats.completed, color: '#22C55E' },
            { label: 'Total Findings', value: summaryStats.findings,  color: summaryStats.findings > 0 ? '#F5F5F5' : '#4B5563' },
            { label: 'Critical',       value: summaryStats.critical,  color: summaryStats.critical > 0 ? '#EF4444' : '#4B5563' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</span>
              <span style={{ fontSize: 11, color: '#4B5563' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12 }}>
          {/* Search */}
          <div style={{ position: 'relative', width: 260 }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#4B5563', display: 'flex', pointerEvents: 'none' }}>
              <IconSearch />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search scans, endpoints, projects…"
              style={{ ...inp, paddingLeft: 30, width: '100%' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
            />
          </div>

          {/* Project filter */}
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)}
            style={{ ...inp, width: 200 }}>
            {projectNames.map(p => <option key={p} value={p} style={{ backgroundColor: '#1A1D21' }}>{p === 'All' ? 'All Projects' : p}</option>)}
          </select>

          {/* Status filter */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as ScanStatus | 'All')}
            style={{ ...inp, width: 130 }}>
            {['All', 'completed', 'running', 'failed', 'queued'].map(s => (
              <option key={s} value={s} style={{ backgroundColor: '#1A1D21' }}>
                {s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          {/* Severity filter */}
          <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value as typeof filterSeverity)}
            style={{ ...inp, width: 140 }}>
            <option value="any"      style={{ backgroundColor: '#1A1D21' }}>Any Severity</option>
            <option value="critical" style={{ backgroundColor: '#1A1D21' }}>Has Critical</option>
            <option value="high"     style={{ backgroundColor: '#1A1D21' }}>Has High+</option>
            <option value="clean"    style={{ backgroundColor: '#1A1D21' }}>Clean (0 findings)</option>
          </select>

          {/* Date range */}
          <select value={filterDateRange} onChange={e => setFilterDateRange(e.target.value as typeof filterDateRange)}
            style={{ ...inp, width: 120 }}>
            <option value="all"   style={{ backgroundColor: '#1A1D21' }}>All Time</option>
            <option value="today" style={{ backgroundColor: '#1A1D21' }}>Today</option>
            <option value="7d"    style={{ backgroundColor: '#1A1D21' }}>Last 7 days</option>
            <option value="30d"   style={{ backgroundColor: '#1A1D21' }}>Last 30 days</option>
          </select>

          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: '#4B5563', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
            {filtered.length} / {scanHistoryData.length}
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '88px 1fr 180px 140px 140px 130px 86px 74px 80px 72px',
          padding: '7px 24px', borderBottom: '1px solid #2A2E33',
          position: 'sticky', top: 0, backgroundColor: '#111315', zIndex: 2,
        }}>
          <TH>Scan ID</TH>
          <TH>Scan Name</TH>
          <TH>Project</TH>
          <TH>Endpoint</TH>
          <TH>Payload Category</TH>
          <TH>Scan Date</TH>
          <TH style={{ textAlign: 'right' }}>Findings</TH>
          <TH>Duration</TH>
          <TH>Status</TH>
          <TH>Actions</TH>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#4B5563', fontSize: 12 }}>
            No scans match your filters.
          </div>
        )}

        {filtered.map((scan, i) => (
          <div key={scan.id} style={{
            display: 'grid',
            gridTemplateColumns: '88px 1fr 180px 140px 140px 130px 86px 74px 80px 72px',
            padding: '9px 24px',
            borderBottom: '1px solid #1F2328',
            alignItems: 'center', cursor: 'default',
            transition: 'background 0.1s',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1A1D21')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {/* Scan ID */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6' }}>{scan.id}</span>

            {/* Scan Name */}
            <div style={{ minWidth: 0, paddingRight: 8 }}>
              <div style={{ fontSize: 12, color: '#F5F5F5', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scan.name}</div>
              <div style={{ fontSize: 10, color: '#4B5563', marginTop: 1, fontFamily: 'var(--font-mono)' }}>{scan.trigger} · {scan.requestCount > 0 ? `${scan.requestCount} req` : '—'}</div>
            </div>

            {/* Project */}
            <div style={{ minWidth: 0, paddingRight: 8 }}>
              <div style={{ fontSize: 11, color: '#B6BDC8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scan.project}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#4B5563', marginTop: 1 }}>{scan.projectId}</div>
            </div>

            {/* Endpoint */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, paddingRight: 8 }}>
              <MethodBadge method={scan.endpointMethod} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                {scan.endpointUrl}
              </span>
            </div>

            {/* Payload Category */}
            <span style={{
              display: 'inline-block', padding: '2px 7px', borderRadius: 4, width: 'fit-content',
              backgroundColor: categoryStyle[scan.payloadCategory]?.bg ?? '#2A2E33',
              color: categoryStyle[scan.payloadCategory]?.text ?? '#9CA3AF',
              fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
            }}>{scan.payloadCategory}</span>

            {/* Scan Date */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6B7280' }}>{scan.scanDate}</span>

            {/* Findings breakdown */}
            <div style={{ textAlign: 'right' }}>
              {scan.findings === 0 ? (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4B5563' }}>—</span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  {scan.critical > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: '#EF4444' }}>C:{scan.critical}</span>}
                  {scan.high     > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#B6BDC8' }}>H:{scan.high}</span>}
                  {scan.medium   > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F59E0B' }}>M:{scan.medium}</span>}
                </div>
              )}
            </div>

            {/* Duration */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280' }}>{scan.duration}</span>

            {/* Status */}
            <StatusPill status={scan.status} />

            {/* Actions */}
            <div onClick={e => e.stopPropagation()}>
              {scan.status === 'completed' || scan.status === 'failed' ? (
                <button onClick={() => setSelectedScan(scan)} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 9px', borderRadius: 7,
                  backgroundColor: 'transparent', border: '1px solid #2A2E33',
                  color: '#6B7280', fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.1s', whiteSpace: 'nowrap',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#3B82F6' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2E33'; e.currentTarget.style.color = '#6B7280' }}
                >
                  View <IconArrowRight />
                </button>
              ) : (
                <span style={{ fontSize: 10, color: '#4B5563', fontFamily: 'var(--font-mono)' }}>
                  {scan.status === 'running' ? 'running…' : 'pending'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Placeholder views ────────────────────────────────────────────────────────

// ─── Settings View ────────────────────────────────────────────────────────────

function SettingsView() {
  const [displayName, setDisplayName]   = useState('Alex Morgan')
  const [email, setEmail]               = useState('alex.morgan@probetool.io')
  const [timezone, setTimezone]         = useState('UTC-05:00 Eastern')
  const [theme, setTheme]               = useState('dark')
  const [compactRows, setCompactRows]   = useState(true)
  const [monoTimestamps, setMonoTimestamps] = useState(true)
  const [defaultPayloads, setDefaultPayloads] = useState('SQL Injection')
  const [defaultAuth, setDefaultAuth]   = useState('Bearer Token')
  const [defaultDelay, setDefaultDelay] = useState('250')
  const [defaultMaxReq, setDefaultMaxReq] = useState('500')
  const [followRedirects, setFollowRedirects] = useState(true)
  const [verifyTLS, setVerifyTLS]       = useState(true)
  const [mfaEnabled, setMfaEnabled]     = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('60')
  const [auditLog, setAuditLog]         = useState(true)
  const [saved, setSaved]               = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inp: React.CSSProperties = { ...inputBase, backgroundColor: '#1A1D21', height: 30 }
  const sel: React.CSSProperties = { ...inp }

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
          {title}
        </div>
        <div style={{
          backgroundColor: '#1A1D21', border: '1px solid #2A2E33', borderRadius: 10,
          overflow: 'hidden',
        }}>{children}</div>
      </div>
    )
  }

  function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderBottom: '1px solid #1F2328', gap: 24,
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12, color: '#F5F5F5' }}>{label}</div>
          {sub && <div style={{ fontSize: 10, color: '#4B5563', marginTop: 1 }}>{sub}</div>}
        </div>
        <div style={{ flexShrink: 0 }}>{children}</div>
      </div>
    )
  }

  function LastRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', gap: 24,
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12, color: '#F5F5F5' }}>{label}</div>
          {sub && <div style={{ fontSize: 10, color: '#4B5563', marginTop: 1 }}>{sub}</div>}
        </div>
        <div style={{ flexShrink: 0 }}>{children}</div>
      </div>
    )
  }

  function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <button onClick={() => onChange(!checked)} style={{
        width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
        backgroundColor: checked ? '#3B82F6' : '#2A2E33',
        position: 'relative', transition: 'background 0.15s', flexShrink: 0,
        padding: 0,
      }}>
        <span style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fff',
          transition: 'left 0.15s',
        }} />
      </button>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 24px 40px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 600, color: '#F5F5F5', margin: 0, letterSpacing: '-0.02em' }}>Settings</h1>
            <p style={{ fontSize: 11, color: '#6B7280', margin: '3px 0 0' }}>Manage your account and application preferences.</p>
          </div>
          <button onClick={handleSave} style={{
            padding: '6px 14px', borderRadius: 7, border: 'none',
            backgroundColor: saved ? '#22C55E' : '#3B82F6',
            color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
            transition: 'background 0.2s',
          }}>{saved ? 'Saved' : 'Save Changes'}</button>
        </div>

        {/* ── Profile ── */}
        <Section title="Profile">
          <Row label="Display Name" sub="Shown in reports and activity feed">
            <input value={displayName} onChange={e => setDisplayName(e.target.value)}
              style={{ ...inp, width: 220 }}
              onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
          </Row>
          <Row label="Email Address" sub="Used for scan notifications">
            <input value={email} onChange={e => setEmail(e.target.value)}
              style={{ ...inp, width: 220 }}
              onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
          </Row>
          <LastRow label="Timezone" sub="Used for scan schedule timestamps">
            <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ ...sel, width: 220 }}>
              {['UTC', 'UTC-05:00 Eastern', 'UTC-06:00 Central', 'UTC-08:00 Pacific', 'UTC+00:00 London', 'UTC+01:00 Berlin', 'UTC+05:30 IST'].map(tz => (
                <option key={tz} value={tz} style={{ backgroundColor: '#1A1D21' }}>{tz}</option>
              ))}
            </select>
          </LastRow>
        </Section>

        {/* ── Appearance ── */}
        <Section title="Appearance">
          <Row label="Theme" sub="Interface color scheme">
            <div style={{ display: 'flex', gap: 4 }}>
              {['dark', 'light', 'system'].map(t => (
                <button key={t} onClick={() => setTheme(t)} style={{
                  padding: '4px 10px', borderRadius: 5, border: '1px solid',
                  borderColor: theme === t ? '#3B82F6' : '#2A2E33',
                  backgroundColor: theme === t ? '#3B82F618' : 'transparent',
                  color: theme === t ? '#3B82F6' : '#6B7280', fontSize: 11, cursor: 'pointer',
                }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
          </Row>
          <Row label="Compact Table Rows" sub="Reduce row height in all tables">
            <Toggle checked={compactRows} onChange={setCompactRows} />
          </Row>
          <LastRow label="Monospace Timestamps" sub="Use JetBrains Mono for all date/time values">
            <Toggle checked={monoTimestamps} onChange={setMonoTimestamps} />
          </LastRow>
        </Section>

        {/* ── Default Scan Settings ── */}
        <Section title="Default Scan Settings">
          <Row label="Default Payload Collection" sub="Pre-selected when opening Scan Config">
            <select value={defaultPayloads} onChange={e => setDefaultPayloads(e.target.value)} style={{ ...sel, width: 200 }}>
              {['SQL Injection', 'XSS', 'Command Injection', 'Path Traversal', 'XXE', 'SSRF', 'JWT', 'Custom'].map(c => (
                <option key={c} value={c} style={{ backgroundColor: '#1A1D21' }}>{c}</option>
              ))}
            </select>
          </Row>
          <Row label="Default Authentication" sub="Auth type applied to new endpoints">
            <select value={defaultAuth} onChange={e => setDefaultAuth(e.target.value)} style={{ ...sel, width: 160 }}>
              {AUTH_TYPES.map(a => (
                <option key={a} value={a} style={{ backgroundColor: '#1A1D21' }}>{a}</option>
              ))}
            </select>
          </Row>
          <Row label="Request Delay (ms)" sub="Milliseconds between scan requests">
            <input type="number" value={defaultDelay} onChange={e => setDefaultDelay(e.target.value)}
              min={0} max={5000} style={{ ...inp, width: 90, textAlign: 'right' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
          </Row>
          <Row label="Max Requests per Scan" sub="Hard cap applied to all scan runs">
            <input type="number" value={defaultMaxReq} onChange={e => setDefaultMaxReq(e.target.value)}
              min={1} max={10000} style={{ ...inp, width: 90, textAlign: 'right' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')} />
          </Row>
          <Row label="Follow Redirects" sub="Automatically follow HTTP 3xx responses">
            <Toggle checked={followRedirects} onChange={setFollowRedirects} />
          </Row>
          <LastRow label="Verify TLS Certificates" sub="Reject invalid or self-signed certificates">
            <Toggle checked={verifyTLS} onChange={setVerifyTLS} />
          </LastRow>
        </Section>

        {/* ── Security ── */}
        <Section title="Security">
          <Row label="Two-Factor Authentication" sub="TOTP via authenticator app">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {mfaEnabled && <span style={{ fontSize: 10, color: '#22C55E' }}>Enabled</span>}
              <Toggle checked={mfaEnabled} onChange={setMfaEnabled} />
            </div>
          </Row>
          <Row label="Session Timeout (minutes)" sub="Automatically sign out after inactivity">
            <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} style={{ ...sel, width: 120 }}>
              {['15', '30', '60', '120', '480', 'Never'].map(v => (
                <option key={v} value={v} style={{ backgroundColor: '#1A1D21' }}>{v === 'Never' ? 'Never' : `${v} min`}</option>
              ))}
            </select>
          </Row>
          <Row label="Audit Logging" sub="Record all scan and config changes">
            <Toggle checked={auditLog} onChange={setAuditLog} />
          </Row>
          <LastRow label="API Token" sub="Used by CI/CD integrations">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563', letterSpacing: '0.05em' }}>prb_••••••••••••4f2a</code>
              <button style={{
                padding: '3px 8px', borderRadius: 5, border: '1px solid #2A2E33',
                backgroundColor: 'transparent', color: '#6B7280', fontSize: 10, cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#3A3E45')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E33')}
              >Regenerate</button>
            </div>
          </LastRow>
        </Section>

        {/* ── About ── */}
        <Section title="About">
          <Row label="Application" sub="">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B7280' }}>Probe v0.9.1</span>
          </Row>
          <Row label="Build" sub="">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4B5563' }}>2026-07-31 · git@a3f9c12</span>
          </Row>
          <Row label="License" sub="">
            <span style={{ fontSize: 11, color: '#6B7280' }}>Professional · alex.morgan@probetool.io</span>
          </Row>
          <LastRow label="Documentation" sub="">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3B82F6' }}>docs.probetool.io</span>
          </LastRow>
        </Section>

      </div>
    </div>
  )
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 17, fontWeight: 600, color: '#F5F5F5', margin: '0 0 4px' }}>{title}</h1>
      <p style={{ fontSize: 12, color: '#6B7280' }}>No content yet.</p>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [notifOpen, setNotifOpen] = useState(false)

  const views: Record<string, React.ReactNode> = {
    dashboard: <DashboardView />,
    projects: <ProjectWorkspaceView />,
    payloads: <PayloadLibraryView />,
    history: <ScanHistoryView />,
    profile: <ScanConfigView />,
    settings: <SettingsView />,
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        backgroundColor: '#111315',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        color: '#F5F5F5',
        overflow: 'hidden',
      }}>

        {/* ── Top bar ── */}
        <header style={{
          height: 48,
          backgroundColor: '#111315',
          borderBottom: '1px solid #2A2E33',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
          flexShrink: 0,
          zIndex: 10,
        }}>
          {/* Logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 216, flexShrink: 0 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              backgroundColor: '#3B82F61A',
              border: '1px solid #3B82F633',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#3B82F6',
            }}>
              <IconShield />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F5F5F5', letterSpacing: '-0.01em' }}>Probe</span>
            <span style={{ fontSize: 10, color: '#6B7280', fontFamily: 'var(--font-mono)', border: '1px solid #2A2E33', borderRadius: 4, padding: '1px 5px' }}>v2.4.1</span>
          </div>

          {/* Workspace selector */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px',
            backgroundColor: '#1A1D21',
            border: '1px solid #2A2E33',
            borderRadius: 7,
            color: '#B6BDC8',
            fontSize: 12,
            cursor: 'pointer',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22C55E', flexShrink: 0 }} />
            production-audit
            <IconChevronDown />
          </button>

          {/* Search */}
          <div style={{
            flex: 1,
            position: 'relative',
            maxWidth: 460,
          }}>
            <span style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: '#6B7280', display: 'flex', pointerEvents: 'none',
            }}>
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search scans, findings, endpoints…"
              style={{
                width: '100%',
                height: 32,
                backgroundColor: '#1A1D21',
                border: '1px solid #2A2E33',
                borderRadius: 7,
                padding: '0 12px 0 32px',
                color: '#F5F5F5',
                fontSize: 12,
                outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2A2E33')}
            />
            <kbd style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              fontSize: 10, color: '#4B5563', fontFamily: 'var(--font-mono)',
              border: '1px solid #2A2E33', borderRadius: 3, padding: '1px 5px',
              backgroundColor: '#111315',
            }}>⌘K</kbd>
          </div>

          <div style={{ flex: 1 }} />

          {/* Notification bell */}
          <button
            onClick={() => setNotifOpen(v => !v)}
            style={{
              position: 'relative',
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: notifOpen ? '#1F2328' : 'transparent',
              border: '1px solid transparent',
              borderColor: notifOpen ? '#2A2E33' : 'transparent',
              borderRadius: 7,
              color: '#B6BDC8',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1F2328'; e.currentTarget.style.borderColor = '#2A2E33' }}
            onMouseLeave={e => { if (!notifOpen) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent' } }}
          >
            <IconBell />
            <span style={{
              position: 'absolute', top: 6, right: 7,
              width: 6, height: 6,
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              border: '1.5px solid #111315',
            }} />
          </button>

          {/* User avatar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 8px',
            borderRadius: 7,
            cursor: 'pointer',
            border: '1px solid transparent',
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1F2328'; e.currentTarget.style.borderColor = '#2A2E33' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              backgroundColor: '#3B82F61A',
              border: '1px solid #3B82F633',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, color: '#3B82F6',
            }}>
              MA
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#F5F5F5' }}>M. Alves</div>
              <div style={{ fontSize: 10, color: '#6B7280' }}>Senior Pentester</div>
            </div>
            <IconChevronDown />
          </div>
        </header>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── Sidebar ── */}
          <aside style={{
            width: 240,
            backgroundColor: '#111315',
            borderRight: '1px solid #2A2E33',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            padding: '10px 10px',
          }}>

            {/* Section label */}
            <div style={{ padding: '6px 8px 4px', fontSize: 10, fontWeight: 500, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Navigation
            </div>

            {navItems.map(item => {
              const active = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 7,
                    border: 'none',
                    backgroundColor: active ? '#3B82F61A' : 'transparent',
                    color: active ? '#3B82F6' : '#B6BDC8',
                    fontSize: 13,
                    fontWeight: active ? 500 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: 1,
                    transition: 'background 0.1s, color 0.1s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#1A1D21' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {/* Active indicator */}
                  {active && (
                    <span style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 3, height: 18, backgroundColor: '#3B82F6', borderRadius: '0 2px 2px 0',
                    }} />
                  )}
                  <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge !== undefined && (
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      backgroundColor: '#3B82F61A',
                      color: '#3B82F6',
                      border: '1px solid #3B82F633',
                      borderRadius: 10,
                      padding: '0 5px',
                      minWidth: 18,
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                    }}>{item.badge}</span>
                  )}
                </button>
              )
            })}

            <div style={{ flex: 1 }} />

            {/* Status footer */}
            <div style={{
              margin: '8px 0 4px',
              padding: '10px 10px',
              backgroundColor: '#1A1D21',
              border: '1px solid #2A2E33',
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 11, color: '#B6BDC8', marginBottom: 6, fontWeight: 500 }}>Scan Engine</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#22C55E' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block', animation: 'pulse 1.4s ease-in-out infinite' }} />
                  Online
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6B7280' }}>1 active</span>
              </div>
              <div style={{ marginTop: 8, height: 3, backgroundColor: '#2A2E33', borderRadius: 2 }}>
                <div style={{ width: '38%', height: '100%', backgroundColor: '#3B82F6', borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#6B7280', fontFamily: 'var(--font-mono)' }}>
                <span>CPU 38%</span>
                <span>MEM 1.2 GB</span>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* Sub-header breadcrumb */}
            <div style={{
              height: 38,
              borderBottom: '1px solid #2A2E33',
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px',
              gap: 6,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 11, color: '#6B7280' }}>production-audit</span>
              <span style={{ color: '#2A2E33' }}>/</span>
              {activeNav === 'projects' && (
                <>
                  <span style={{ fontSize: 11, color: '#6B7280', cursor: 'pointer' }}>Projects</span>
                  <span style={{ color: '#2A2E33' }}>/</span>
                  <span style={{ fontSize: 11, color: '#B6BDC8', fontWeight: 500 }}>Payment Gateway v2 Audit</span>
                </>
              )}
              {activeNav === 'history' && (
                <span style={{ fontSize: 11, color: '#B6BDC8', fontWeight: 500 }}>Scan History</span>
              )}
              {activeNav === 'payloads' && (
                <span style={{ fontSize: 11, color: '#B6BDC8', fontWeight: 500 }}>Payload Library</span>
              )}
              {activeNav === 'profile' && (
                <span style={{ fontSize: 11, color: '#B6BDC8', fontWeight: 500 }}>Scan Configuration</span>
              )}
              {activeNav !== 'projects' && activeNav !== 'history' && activeNav !== 'payloads' && activeNav !== 'profile' && (
                <span style={{ fontSize: 11, color: '#B6BDC8', fontWeight: 500, textTransform: 'capitalize' }}>{activeNav}</span>
              )}
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              {views[activeNav]}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
