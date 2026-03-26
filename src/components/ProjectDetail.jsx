import React, { useState } from 'react'
import { format } from 'date-fns'
import { StatusPill, ProgressBar, Button, ConfirmModal } from './UI.jsx'
import { Notes } from './Notes.jsx'
import { Goals } from './Goals.jsx'
import { Pipeline } from './Pipeline.jsx'

const TABS = ['notes', 'goals', 'pipeline']

export function ProjectDetail({
  project,
  onUpdate,
  onDelete,
  onEdit,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
  onAddPipeline,
  onMovePipeline,
  onDeletePipeline,
}) {
  const [tab, setTab] = useState('notes')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const doneGoals = (project.goals || []).filter(g => g.done).length
  const totalGoals = (project.goals || []).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Project header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '0.5px solid var(--border)',
        background: 'var(--bg)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: project.color, flexShrink: 0, marginTop: 5 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>{project.name}</span>
              <StatusPill status={project.status} />
            </div>
            {project.description && (
              <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{project.description}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <Button size="sm" onClick={onEdit}>Edit</Button>
            <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>Delete</Button>
          </div>
        </div>

        {/* Progress + meta */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <ProgressBar value={project.progress || 0} color={project.color} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
            {project.progress || 0}%
          </span>
          {totalGoals > 0 && (
            <span style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
              {doneGoals}/{totalGoals} goals
            </span>
          )}
          {project.targetDate && (
            <span style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
              Target: {format(new Date(project.targetDate), 'MMM d, yyyy')}
            </span>
          )}
        </div>

        {/* Tags */}
        {(project.tags || []).length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
            {project.tags.map((t, i) => (
              <span key={i} style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, background: 'var(--bg-3)', color: 'var(--text-2)' }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '0.5px solid var(--border)',
        padding: '0 20px',
        background: 'var(--bg)',
        flexShrink: 0,
      }}>
        {TABS.map(t => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 14px',
              fontSize: 12,
              cursor: 'pointer',
              color: tab === t ? 'var(--text)' : 'var(--text-2)',
              borderBottom: `2px solid ${tab === t ? 'var(--acc)' : 'transparent'}`,
              marginBottom: '-0.5px',
              fontWeight: tab === t ? 500 : 400,
              transition: 'all 0.1s',
              textTransform: 'capitalize',
            }}
          >
            {t}
            {t === 'notes' && (project.notes || []).length > 0 && (
              <span style={{ marginLeft: 5, fontSize: 10, color: 'var(--text-3)' }}>
                {(project.notes || []).length}
              </span>
            )}
            {t === 'goals' && totalGoals > 0 && (
              <span style={{ marginLeft: 5, fontSize: 10, color: 'var(--text-3)' }}>
                {doneGoals}/{totalGoals}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'notes' && (
          <Notes
            project={project}
            onAddNote={note => onAddNote(project.id, note)}
            onUpdateNote={(noteId, updates) => onUpdateNote(project.id, noteId, updates)}
            onDeleteNote={noteId => onDeleteNote(project.id, noteId)}
          />
        )}
        {tab === 'goals' && (
          <Goals
            project={project}
            onAdd={goal => onAddGoal(project.id, goal)}
            onToggle={goalId => onToggleGoal(project.id, goalId)}
            onDelete={goalId => onDeleteGoal(project.id, goalId)}
          />
        )}
        {tab === 'pipeline' && (
          <Pipeline
            project={project}
            onAdd={(col, item) => onAddPipeline(project.id, col, item)}
            onMove={(from, to, id) => onMovePipeline(project.id, from, to, id)}
            onDelete={(col, id) => onDeletePipeline(project.id, col, id)}
          />
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={`Delete "${project.name}"? All notes, goals, and pipeline items will be permanently removed.`}
          onConfirm={() => { setConfirmDelete(false); onDelete(project.id) }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}
