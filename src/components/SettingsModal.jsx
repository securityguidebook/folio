import React, { useState } from 'react'
import { Modal, Button, Input } from './UI.jsx'

export function SettingsModal({ settings, onSave, onClose }) {
  const [form, setForm] = useState({
    userName: settings.userName || '',
    userEmail: settings.userEmail || '',
    theme: settings.theme || 'light',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSave() {
    onSave(form)
    onClose()
  }

  function handleExport() {
    const data = localStorage.getItem('folio_data_v1')
    if (!data) return
    const blob = new Blob([data], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `folio-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result)
        localStorage.setItem('folio_data_v1', JSON.stringify(data))
        window.location.reload()
      } catch {
        alert('Invalid backup file.')
      }
    }
    reader.readAsText(file)
  }

  const label = txt => (
    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
      {txt}
    </div>
  )

  return (
    <Modal title="Settings" onClose={onClose} width={440}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {label('Your name')}
        <Input value={form.userName} onChange={v => set('userName', v)} placeholder="e.g. Guide" />

        {label('Email')}
        <Input value={form.userEmail} onChange={v => set('userEmail', v)} placeholder="you@example.com" />

        {label('Theme')}
        <div style={{ display: 'flex', gap: 8 }}>
          {['light', 'dark'].map(t => (
            <button
              key={t}
              onClick={() => set('theme', t)}
              style={{
                padding: '7px 20px', borderRadius: 'var(--radius-md)',
                border: `0.5px solid ${form.theme === t ? 'var(--acc)' : 'var(--border-2)'}`,
                background: form.theme === t ? 'var(--acc-l)' : 'transparent',
                color: form.theme === t ? 'var(--acc-m)' : 'var(--text-2)',
                cursor: 'pointer', fontSize: 13,
                textTransform: 'capitalize',
              }}
            >{t}</button>
          ))}
        </div>

        <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 16, marginTop: 4 }}>
          {label('Data')}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button size="sm" onClick={handleExport}>Export backup (.json)</Button>
            <label style={{ cursor: 'pointer' }}>
              <Button size="sm" as="span">Import backup</Button>
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.5 }}>
            Data is stored in your browser's local storage. Use Export to back up, and Import to restore on a new device.
          </p>
        </div>

<div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 16, marginTop: 4 }}>
  <button
    onClick={onSignOut}
    style={{
      width: '100%', padding: '9px',
      background: 'transparent', color: '#A32D2D',
      border: '0.5px solid #F09595',
      borderRadius: 8, fontSize: 13, cursor: 'pointer',
    }}
  >Sign out</button>
</div>
        
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save settings</Button>
        </div>
      </div>
    </Modal>
  )
}
