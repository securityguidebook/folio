import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Button, Input, SectionLabel, ConfirmModal } from './UI.jsx'

function GoalItem({ goal, onToggle, onDelete }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '10px 12px',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 7,
        background: 'var(--bg)',
        transition: 'border-color 0.1s',
      }}
      onMouseEnter={e => setHover(true)}
      onMouseLeave={e => setHover(false)}
    >
      <div
        onClick={onToggle}
        style={{
          width: 16, height: 16, borderRadius: '50%',
          border: `1.5px solid ${goal.done ? 'var(--acc)' : 'var(--border-2)'}`,
          background: goal.done ? 'var(--acc)' : 'transparent',
          flexShrink: 0, marginTop: 1, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}
      >
        {goal.done && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, color: goal.done ? 'var(--text-3)' : 'var(--text)',
          textDecoration: goal.done ? 'line-through' : 'none',
        }}>
          {goal.text}
        </div>
        {goal.note && (
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{goal.note}</div>
        )}
      </div>
      {hover && (
        <button
          onClick={onDelete}
          style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px', flexShrink: 0 }}
        >×</button>
      )}
    </div>
  )
}

export function Goals({ project, onAdd, onToggle, onDelete }) {
  const goals = project.goals || []
  const [text, setText] = useState('')
  const [note, setNote] = useState('')
  const [adding, setAdding] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  const done = goals.filter(g => g.done).length

  function handleAdd() {
    if (!text.trim()) return
    onAdd({ id: uuid(), text: text.trim(), note: note.trim(), done: false, createdAt: new Date().toISOString() })
    setText('')
    setNote('')
    setAdding(false)
  }

  return (
    <div style={{ padding: 20, height: '100%', overflowY: 'auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Goals complete', value: `${done}/${goals.length}` },
          { label: 'Overall progress', value: `${project.progress || 0}%` },
          { label: 'Status', value: (project.status || 'active').charAt(0).toUpperCase() + (project.status || 'active').slice(1) },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-2)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--text)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <SectionLabel style={{ margin: 0 }}>Goals & milestones</SectionLabel>
        <Button size="sm" onClick={() => setAdding(true)}>+ Add goal</Button>
      </div>

      {adding && (
        <div style={{ background: 'var(--bg-2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 14 }}>
          <Input value={text} onChange={setText} placeholder="Goal description…" autoFocus style={{ marginBottom: 8 }} />
          <Input value={note} onChange={setNote} placeholder="Optional note or target date…" style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" onClick={handleAdd}>Add</Button>
            <Button size="sm" onClick={() => { setAdding(false); setText(''); setNote('') }}>Cancel</Button>
          </div>
        </div>
      )}

      {goals.length === 0 && !adding && (
        <div style={{ textAlign: 'center', padding: '32px 16px', fontSize: 13, color: 'var(--text-3)' }}>
          No goals yet. Add milestones to keep your project on track.
        </div>
      )}

      {goals.map(g => (
        <GoalItem
          key={g.id}
          goal={g}
          onToggle={() => onToggle(g.id)}
          onDelete={() => setConfirmId(g.id)}
        />
      ))}

      {confirmId && (
        <ConfirmModal
          message="Remove this goal?"
          onConfirm={() => { onDelete(confirmId); setConfirmId(null) }}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
