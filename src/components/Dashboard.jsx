import React from 'react'
import { StatusPill, ProgressBar, SectionLabel, Button } from './UI.jsx'
import { format, parseISO, isValid } from 'date-fns'

function EmptyState({ onNew }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40 }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: 'var(--acc-l)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="2" stroke="var(--acc-m)" strokeWidth="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="2" stroke="var(--acc-m)" strokeWidth="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="2" stroke="var(--acc-m)" strokeWidth="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="2" stroke="var(--acc-m)" strokeWidth="1.5"/>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>No projects yet</p>
        <p style={{ fontSize: 13, color: 'var(--text-3)', maxWidth: 280 }}>
          Create your first project to start tracking goals, notes, and progress.
        </p>
      </div>
      <Button variant="primary" onClick={onNew}>+ Create first project</Button>
    </div>
  )
}

function ProjectCard({ project, onClick }) {
  const doneGoals = (project.goals || []).filter(g => g.done).length
  const totalGoals = (project.goals || []).length
  const noteCount = (project.notes || []).length
  const lastNote = (project.notes || [])[0]
  const fileCount = (project.files || []).length

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        cursor: 'pointer',
        transition: 'border-color 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: project.color, flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project.name}
            </span>
          </div>
          {project.description && (
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginLeft: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project.description}
            </p>
          )}
        </div>
        <StatusPill status={project.status} />
      </div>

      <ProgressBar value={project.progress || 0} color={project.color} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginBottom: 10 }}>
        <span>{project.progress || 0}% complete</span>
        {project.targetDate && isValid(parseISO(project.targetDate)) && (
  <span>Target: {project.targetDate && isValid(parseISO(project.targetDate))
  ? format(parseISO(project.targetDate), 'MMM d, yyyy')
  : '—'}</span>
)}
      </div>

      {/* Tags */}
      {(project.tags || []).length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
          {project.tags.map((t, i) => (
            <span key={i} style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, background: 'var(--bg-3)', color: 'var(--text-2)' }}>
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Footer meta */}
      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-3)', paddingTop: 10, borderTop: '0.5px solid var(--border)' }}>
        <span>{totalGoals > 0 ? `${doneGoals}/${totalGoals} goals` : 'No goals'}</span>
        <span>{noteCount} {noteCount === 1 ? 'note' : 'notes'}</span>
        {fileCount > 0 && <span>{fileCount} {fileCount === 1 ? 'file' : 'files'}</span>}
        {lastNote && (
          <span style={{ marginLeft: 'auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
            Last: {lastNote.title} · {isValid(parseISO(lastNote.updatedAt || lastNote.createdAt)) ? isValid(parseISO(lastNote.updatedAt || lastNote.createdAt))
  ? format(parseISO(lastNote.updatedAt || lastNote.createdAt), 'MMM d')
  : '—'}
            </span>
        )}
      </div>
    </div>
  )
}

export function Dashboard({ projects, onOpenProject, onNewProject }) {
  if (projects.length === 0) return <EmptyState onNew={onNewProject} />

  const active = projects.filter(p => p.status === 'active')
  const paused = projects.filter(p => p.status === 'paused')
  const done   = projects.filter(p => p.status === 'done')

  return (
    <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Active', value: active.length },
          { label: 'Paused', value: paused.length },
          { label: 'Total', value: projects.length },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-2)', borderRadius: 'var(--radius-md)', padding: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--text)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {[
        { label: 'Active', items: active },
        { label: 'Paused', items: paused },
        { label: 'Done', items: done },
      ].filter(g => g.items.length > 0).map(group => (
        <div key={group.label} style={{ marginBottom: 24 }}>
          <SectionLabel style={{ marginBottom: 12 }}>{group.label} — {group.items.length}</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {group.items.map(p => (
              <ProjectCard key={p.id} project={p} onClick={() => onOpenProject(p.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
