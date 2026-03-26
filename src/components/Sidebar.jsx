import React from 'react'

const iconDash = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)
const iconTimeline = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="8" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="5" y="6.75" width="10" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="2" y="10.5" width="6" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)
const iconSettings = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

function NavItem({ icon, label, active, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '8px 14px',
        fontSize: 13,
        color: active ? 'var(--text)' : 'var(--text-2)',
        cursor: 'pointer',
        borderLeft: `2px solid ${active ? 'var(--acc)' : 'transparent'}`,
        background: active ? 'var(--bg)' : 'transparent',
        fontWeight: active ? 500 : 400,
        transition: 'all 0.12s',
        userSelect: 'none',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' } }}
    >
      {color
        ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
        : <div style={{ flexShrink: 0, color: active ? 'var(--acc)' : 'currentColor' }}>{icon}</div>
      }
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
}

export function Sidebar({ view, activeProjectId, projects, onNav, onSettings, onNewProject, settings }) {
  const initials = settings.userName
    ? settings.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'GU'

  return (
    <div style={{
      width: 'var(--sidebar-w)',
      borderRight: '0.5px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      background: 'var(--bg-2)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 14px 12px',
        borderBottom: '0.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Folio
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--acc)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Saved</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <NavItem icon={iconDash} label="Dashboard" active={view === 'dashboard'} onClick={() => onNav('dashboard')} />
        <NavItem icon={iconTimeline} label="Timeline" active={view === 'timeline'} onClick={() => onNav('timeline')} />

        <div style={{ padding: '12px 14px 4px', fontSize: 10, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>
          Projects
        </div>

        {projects.length === 0 && (
          <div style={{ padding: '8px 14px', fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>
            No projects yet
          </div>
        )}

        {projects.map(p => (
          <NavItem
            key={p.id}
            label={p.name}
            color={p.color}
            active={view === 'project' && activeProjectId === p.id}
            onClick={() => onNav('project', p.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 14px', borderTop: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--acc-l)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 9, fontWeight: 500, color: 'var(--acc-m)',
          }}>
            {initials}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {settings.userEmail || 'Set up profile →'}
          </span>
          <div onClick={onSettings} style={{ cursor: 'pointer', color: 'var(--text-3)' }}>{iconSettings}</div>
        </div>
        <button
          onClick={onNewProject}
          style={{
            width: '100%', padding: '7px', fontSize: 12,
            color: 'var(--text-2)',
            border: '0.5px dashed var(--border-2)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer', background: 'transparent', textAlign: 'center',
            transition: 'all 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' }}
        >
          + New project
        </button>
      </div>
    </div>
  )
}
