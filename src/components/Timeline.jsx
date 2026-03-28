import React from 'react'
import { format, parseISO, startOfYear, endOfYear, differenceInDays, isValid } from 'date-fns'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function Timeline({ projects }) {
  const now = new Date()
  const yearStart = startOfYear(now)
  const yearEnd = endOfYear(now)
  const yearDays = differenceInDays(yearEnd, yearStart) + 1

  const todayPct = (differenceInDays(now, yearStart) / yearDays * 100).toFixed(2)

  const projectsNoDates = projects.filter(p => !p.startDate || !p.targetDate)

const projectsWithDates = projects.filter(p => {
  if (typeof p.startDate !== 'string' || typeof p.targetDate !== 'string') return false
  return isValid(parseISO(p.startDate)) && isValid(parseISO(p.targetDate))
})

  return (
    <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
          Showing {now.getFullYear()} — today marked in red
        </div>
      </div>

      <div style={{ border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Month headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', borderBottom: '0.5px solid var(--border)', background: 'var(--bg-2)' }}>
          <div style={{ padding: '9px 14px', fontSize: 11, fontWeight: 500, color: 'var(--text-2)', borderRight: '0.5px solid var(--border)' }}>
            Project
          </div>
          <div style={{ display: 'flex' }}>
            {MONTHS.map(m => (
              <div key={m} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-3)', padding: '9px 0', borderRight: '0.5px solid var(--border)' }}>
                {m}
              </div>
            ))}
          </div>
        </div>

        {projectsWithDates.length === 0 && (
          <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-3)' }}>
            No projects with start and target dates. Add dates to your projects to see them here.
          </div>
        )}

        {projectsWithDates.map((p, i) => {
          const { left, width } = getBar(p)
          return (
            <div
              key={p.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                borderBottom: i < projectsWithDates.length - 1 ? '0.5px solid var(--border)' : 'none',
              }}
            >
              <div style={{ padding: '9px 13px', fontSize: 12, color: 'var(--text)', borderRight: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              </div>
              <div style={{ position: 'relative', height: 38, display: 'flex', alignItems: 'center' }}>
                {/* Month gridlines */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                  {MONTHS.map((_, mi) => (
                    <div key={mi} style={{ flex: 1, borderRight: '0.5px solid var(--border)', opacity: 0.4 }} />
                  ))}
                </div>
                {/* Bar */}
                <div style={{
                  position: 'absolute',
                  left: `${left}%`,
                  width: `${width}%`,
                  height: 22,
                  background: p.color,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  fontSize: 10,
                  fontWeight: 500,
                  color: 'white',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  minWidth: 8,
                }}>
                  {width > 8 ? p.name.split(' ')[0] : ''}
                </div>
                {/* Progress overlay */}
                <div style={{
                  position: 'absolute',
                  left: `${left}%`,
                  width: `${width * (p.progress || 0) / 100}%`,
                  height: 22,
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: '4px 0 0 4px',
                  pointerEvents: 'none',
                }} />
                {/* Today line */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${todayPct}%`, width: 1, background: '#E24B4A', opacity: 0.7 }} />
              </div>
            </div>
          )
        })}
      </div>

      {projectsNoDates.length > 0 && (
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--text-3)' }}>
          {projectsNoDates.length} project{projectsNoDates.length > 1 ? 's' : ''} without dates not shown: {projectsNoDates.map(p => p.name).join(', ')}
        </div>
      )}
    </div>
  )
}
