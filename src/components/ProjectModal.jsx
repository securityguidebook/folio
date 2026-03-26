import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { Modal, Button, Input, ColorPicker, Tag, STATUS_OPTIONS } from './UI.jsx'
import { format } from 'date-fns'

const EMPTY = {
  name: '',
  description: '',
  color: '#1D9E75',
  status: 'active',
  progress: 0,
  startDate: format(new Date(), 'yyyy-MM-dd'),
  targetDate: '',
  tags: [],
}

export function ProjectModal({ project, onSave, onClose }) {
  const isEdit = !!project
  const [form, setForm] = useState(isEdit ? {
    name: project.name || '',
    description: project.description || '',
    color: project.color || '#1D9E75',
    status: project.status || 'active',
    progress: project.progress || 0,
    startDate: project.startDate || format(new Date(), 'yyyy-MM-dd'),
    targetDate: project.targetDate || '',
    tags: project.tags || [],
  } : EMPTY)
  const [tagInput, setTagInput] = useState('')

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function addTag(e) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const t = tagInput.trim().replace(/,$/, '')
      if (t && !form.tags.includes(t)) set('tags', [...form.tags, t])
      setTagInput('')
    }
  }

  function removeTag(t) { set('tags', form.tags.filter(x => x !== t)) }

  function handleSave() {
    if (!form.name.trim()) return
    const now = new Date().toISOString()
    if (isEdit) {
      onSave({ ...form, name: form.name.trim(), progress: Number(form.progress) })
    } else {
      onSave({
        id: uuid(),
        ...form,
        name: form.name.trim(),
        progress: Number(form.progress),
        notes: [],
        goals: [],
        pipeline: { backlog: [], upNext: [], inProgress: [], done: [] },
        files: [],
        createdAt: now,
        updatedAt: now,
      })
    }
    onClose()
  }

  const label = (txt) => (
    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
      {txt}
    </div>
  )

  return (
    <Modal title={isEdit ? 'Edit project' : 'New project'} onClose={onClose} width={500}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {label('Project name')}
        <Input value={form.name} onChange={v => set('name', v)} placeholder="e.g. Home Renovation" autoFocus />

        {label('Description')}
        <Input value={form.description} onChange={v => set('description', v)} placeholder="One-line summary…" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            {label('Status')}
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              style={{
                width: '100%', padding: '8px 10px', fontSize: 13,
                background: 'var(--bg)', border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-md)', color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            {label('Progress (%)')}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="range" min="0" max="100" step="1"
                value={form.progress}
                onChange={e => set('progress', e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 13, color: 'var(--text)', minWidth: 32, textAlign: 'right' }}>
                {form.progress}%
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            {label('Start date')}
            <input
              type="date" value={form.startDate}
              onChange={e => set('startDate', e.target.value)}
              style={{
                width: '100%', padding: '8px 10px', fontSize: 13,
                background: 'var(--bg)', border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-md)', color: 'var(--text)',
              }}
            />
          </div>
          <div>
            {label('Target date')}
            <input
              type="date" value={form.targetDate}
              onChange={e => set('targetDate', e.target.value)}
              style={{
                width: '100%', padding: '8px 10px', fontSize: 13,
                background: 'var(--bg)', border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-md)', color: 'var(--text)',
              }}
            />
          </div>
        </div>

        {label('Colour')}
        <ColorPicker value={form.color} onChange={v => set('color', v)} />

        {label('Tags (press Enter or comma to add)')}
        <div>
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="e.g. Design, Budget…"
            style={{
              width: '100%', padding: '8px 12px', fontSize: 13,
              background: 'var(--bg)', border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-md)', color: 'var(--text)',
              outline: 'none', marginBottom: 8,
            }}
            onFocus={e => e.target.style.borderColor = 'var(--acc)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          {form.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {form.tags.map(t => <Tag key={t} onRemove={() => removeTag(t)}>{t}</Tag>)}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!form.name.trim()}>
            {isEdit ? 'Save changes' : 'Create project'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
