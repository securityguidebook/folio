import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Button, Input, SectionLabel, ConfirmModal } from './UI.jsx'

const COLUMNS = [
  { key: 'backlog',    label: 'Backlog' },
  { key: 'upNext',     label: 'Up next' },
  { key: 'inProgress', label: 'In progress' },
  { key: 'done',       label: 'Done' },
]

function KanbanCard({ item, onDelete, onMove, columns, colKey }) {
  const [hover, setHover] = useState(false)
  const [showMove, setShowMove] = useState(false)

  return (
    <div
      style={{
        background: 'var(--bg)',
        border: '0.5px solid var(--border)',
        borderRadius: 6, padding: '8px 10px',
        marginBottom: 6,
        position: 'relative',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setShowMove(false) }}
    >
      <div style={{ fontSize: 12, color: 'var(--text)', paddingRight: hover ? 32 : 0 }}>
        {item.text}
      </div>
      {item.note && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{item.note}</div>}

      {hover && (
        <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 3 }}>
          <button
            onClick={() => setShowMove(v => !v)}
            title="Move to column"
            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: '1px 3px' }}
          >⇄</button>
          <button
            onClick={onDelete}
            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 15, lineHeight: 1, padding: '0 2px' }}
          >×</button>
        </div>
      )}

      {showMove && (
        <div style={{
          position: 'absolute', top: 28, right: 6, background: 'var(--bg)',
          border: '0.5px solid var(--border-2)', borderRadius: 8, zIndex: 10,
          overflow: 'hidden', minWidth: 120,
        }}>
          {columns.filter(c => c.key !== colKey).map(c => (
            <div
              key={c.key}
              onClick={() => { onMove(c.key); setShowMove(false) }}
              style={{
                padding: '7px 12px', fontSize: 12, color: 'var(--text)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              → {c.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function KanbanColumn({ col, items, onAdd, onDelete, onMove }) {
  const [adding, setAdding] = useState(false)
  const [text, setText] = useState('')
  const [note, setNote] = useState('')

  function handleAdd() {
    if (!text.trim()) return
    onAdd(col.key, { id: uuid(), text: text.trim(), note: note.trim(), createdAt: new Date().toISOString() })
    setText(''); setNote(''); setAdding(false)
  }

  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 'var(--radius-md)', padding: 10, minHeight: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {col.label}
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-3)', background: 'var(--bg-3)', padding: '1px 6px', borderRadius: 10 }}>
          {items.length}
        </span>
      </div>

      {items.map(item => (
        <KanbanCard
          key={item.id}
          item={item}
          colKey={col.key}
          columns={COLUMNS}
          onDelete={() => onDelete(col.key, item.id)}
          onMove={toCol => onMove(col.key, toCol, item.id)}
        />
      ))}

      {adding ? (
        <div style={{ marginTop: 6 }}>
          <Input value={text} onChange={setText} placeholder="Task…" autoFocus style={{ marginBottom: 6, fontSize: 12 }} />
          <Input value={note} onChange={setNote} placeholder="Note (optional)…" style={{ marginBottom: 8, fontSize: 12 }} />
          <div style={{ display: 'flex', gap: 5 }}>
            <Button variant="primary" size="sm" onClick={handleAdd}>Add</Button>
            <Button size="sm" onClick={() => { setAdding(false); setText(''); setNote('') }}>×</Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{
            width: '100%', background: 'none', border: '0.5px dashed var(--border-2)',
            borderRadius: 5, padding: '5px 0', fontSize: 11, color: 'var(--text-3)',
            cursor: 'pointer', marginTop: items.length > 0 ? 4 : 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >+ Add</button>
      )}
    </div>
  )
}

export function Pipeline({ project, onAdd, onMove, onDelete }) {
  const pipeline = project.pipeline || { backlog: [], upNext: [], inProgress: [], done: [] }

  return (
    <div style={{ padding: 20, height: '100%', overflowY: 'auto' }}>
      <SectionLabel style={{ marginBottom: 14 }}>Pipeline</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.key}
            col={col}
            items={pipeline[col.key] || []}
            onAdd={onAdd}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  )
}
