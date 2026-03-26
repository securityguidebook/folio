import React, { useState, useRef, useEffect } from 'react'

export const PROJECT_COLORS = [
  { name: 'teal',   hex: '#1D9E75' },
  { name: 'blue',   hex: '#378ADD' },
  { name: 'amber',  hex: '#BA7517' },
  { name: 'pink',   hex: '#D4537E' },
  { name: 'purple', hex: '#7F77DD' },
  { name: 'coral',  hex: '#D85A30' },
  { name: 'slate',  hex: '#5F5E5A' },
]

export const STATUS_OPTIONS = ['active', 'paused', 'done']

export function StatusPill({ status }) {
  const map = {
    active:  { bg: '#E1F5EE', color: '#0F6E56', label: 'Active' },
    paused:  { bg: '#FAEEDA', color: '#854F0B', label: 'Paused' },
    done:    { bg: '#EAF3DE', color: '#3B6D11', label: 'Done' },
  }
  const s = map[status] || map.active
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 500,
      background: s.bg,
      color: s.color,
    }}>{s.label}</span>
  )
}

export function Button({ children, variant = 'default', size = 'md', onClick, style = {}, disabled }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    border: '0.5px solid var(--border-2)',
    borderRadius: 'var(--radius-md)',
    background: 'transparent',
    color: 'var(--text-2)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-sans)',
    fontWeight: 400,
    transition: 'all 0.12s',
    opacity: disabled ? 0.5 : 1,
    fontSize: size === 'sm' ? 12 : 13,
    padding: size === 'sm' ? '5px 10px' : '7px 14px',
  }
  const variants = {
    primary: { background: 'var(--acc)', color: '#fff', border: '0.5px solid var(--acc)' },
    danger:  { color: '#A32D2D', borderColor: '#F09595' },
    ghost:   { border: '0.5px dashed var(--border-2)' },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...(variants[variant] || {}), ...style }}
    >
      {children}
    </button>
  )
}

export function Input({ value, onChange, placeholder, style = {}, multiline, rows = 3, autoFocus }) {
  const base = {
    width: '100%',
    background: 'var(--bg)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 12px',
    fontSize: 13,
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.12s',
    fontFamily: 'var(--font-sans)',
    resize: 'vertical',
    ...style,
  }
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        autoFocus={autoFocus}
        style={base}
        onFocus={e => e.target.style.borderColor = 'var(--acc)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    )
  }
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      style={{ ...base, resize: 'none' }}
      onFocus={e => e.target.style.borderColor = 'var(--acc)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
    />
  )
}

export function Modal({ title, onClose, children, width = 480 }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          width, maxWidth: 'calc(100vw - 32px)',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-3)',
              fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: '0 2px',
            }}
          >×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirm" onClose={onCancel} width={360}>
      <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>{message}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  )
}

export function SectionLabel({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 500, color: 'var(--text-3)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 10, ...style,
    }}>
      {children}
    </div>
  )
}

export function ProgressBar({ value, color }) {
  return (
    <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden', margin: '10px 0 7px' }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 2, transition: 'width 0.3s' }} />
    </div>
  )
}

export function ColorPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {PROJECT_COLORS.map(c => (
        <div
          key={c.hex}
          onClick={() => onChange(c.hex)}
          style={{
            width: 24, height: 24, borderRadius: '50%',
            background: c.hex, cursor: 'pointer',
            outline: value === c.hex ? `2px solid ${c.hex}` : 'none',
            outlineOffset: 2,
          }}
        />
      ))}
    </div>
  )
}

export function Tag({ children, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 4,
      fontSize: 11, background: 'var(--bg-3)', color: 'var(--text-2)',
    }}>
      {children}
      {onRemove && (
        <span
          onClick={onRemove}
          style={{ cursor: 'pointer', color: 'var(--text-3)', lineHeight: 1, marginLeft: 2 }}
        >×</span>
      )}
    </span>
  )
}
