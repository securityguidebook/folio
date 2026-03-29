import React, { useState, useRef, useEffect, useCallback } from 'react'
import { format, parseISO, isValid } from 'date-fns'
import { v4 as uuid } from 'uuid'
import { Button, SectionLabel, ConfirmModal } from './UI.jsx'

// ── Toolbar button ────────────────────────────────────────────────────────────
function TBtn({ title, active, onClick, children }) {
  return (
    <button
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      style={{
        padding: '4px 7px',
        background: active ? 'var(--bg-3)' : 'transparent',
        border: active ? '0.5px solid var(--border-2)' : '0.5px solid transparent',
        borderRadius: 5,
        cursor: 'pointer',
        color: active ? 'var(--text)' : 'var(--text-2)',
        fontSize: 12,
        fontWeight: active ? 500 : 400,
        lineHeight: 1.2,
        transition: 'all 0.1s',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </button>
  )
}

// ── Format toolbar ────────────────────────────────────────────────────────────
function Toolbar({ onFormat, onInsert }) {
  function fmt(cmd, val) { document.execCommand(cmd, false, val) }

  const isActive = cmd => {
    try { return document.queryCommandState(cmd) } catch { return false }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
      padding: '6px 10px', borderBottom: '0.5px solid var(--border)',
      background: 'var(--bg-2)',
    }}>
      <TBtn title="Bold" active={isActive('bold')} onClick={() => fmt('bold')}><b>B</b></TBtn>
      <TBtn title="Italic" active={isActive('italic')} onClick={() => fmt('italic')}><i>I</i></TBtn>
      <TBtn title="Underline" active={isActive('underline')} onClick={() => fmt('underline')}><u>U</u></TBtn>
      <TBtn title="Strikethrough" active={isActive('strikeThrough')} onClick={() => fmt('strikeThrough')}><s>S</s></TBtn>

      <div style={{ width: 1, height: 16, background: 'var(--border-2)', margin: '0 4px' }} />

      <TBtn title="Heading 1" onClick={() => fmt('formatBlock', '<h2>')}>H1</TBtn>
      <TBtn title="Heading 2" onClick={() => fmt('formatBlock', '<h3>')}>H2</TBtn>
      <TBtn title="Paragraph" onClick={() => fmt('formatBlock', '<p>')}>¶</TBtn>

      <div style={{ width: 1, height: 16, background: 'var(--border-2)', margin: '0 4px' }} />

      <TBtn title="Bullet list" onClick={() => fmt('insertUnorderedList')}>• List</TBtn>
      <TBtn title="Numbered list" onClick={() => fmt('insertOrderedList')}>1. List</TBtn>

      <div style={{ width: 1, height: 16, background: 'var(--border-2)', margin: '0 4px' }} />

      <TBtn title="Highlight" onClick={() => fmt('hiliteColor', '#FFF3B0')}>Highlight</TBtn>
      <TBtn title="Code block" onClick={() => {
        const sel = window.getSelection()
        if (sel && sel.toString()) {
          fmt('insertHTML', `<code style="background:var(--bg-3);padding:1px 5px;border-radius:3px;font-family:var(--font-mono);font-size:12px">${sel.toString()}</code>`)
        }
      }}>Code</TBtn>

      <div style={{ width: 1, height: 16, background: 'var(--border-2)', margin: '0 4px' }} />

      <TBtn title="Insert divider" onClick={() => fmt('insertHorizontalRule')}>—</TBtn>
      <TBtn title="Clear formatting" onClick={() => fmt('removeFormat')}>Clear</TBtn>
    </div>
  )
}

// ── Single note in list view ──────────────────────────────────────────────────
function NoteListItem({ note, active, onClick, onDelete }) {
  const [showDel, setShowDel] = useState(false)
  const plain = note.body
    ? note.body.replace(/<[^>]*>/g, '').slice(0, 80).trim()
    : ''

  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 14px',
        cursor: 'pointer',
        background: active ? 'var(--bg)' : 'transparent',
        borderLeft: `2px solid ${active ? 'var(--acc)' : 'transparent'}`,
        borderBottom: '0.5px solid var(--border)',
        position: 'relative',
        transition: 'all 0.1s',
      }}
      onMouseEnter={e => { setShowDel(true); if (!active) e.currentTarget.style.background = 'var(--bg-2)' }}
      onMouseLeave={e => { setShowDel(false); if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <div style={{ fontSize: 12, fontWeight: active ? 500 : 400, color: 'var(--text)', marginBottom: 2, paddingRight: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {note.title || 'Untitled note'}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
        {isValid(parseISO(note.createdAt || note.created_at)) ? format(parseISO(note.createdAt || note.created_at), 'MMM d, yyyy') : '—'}
        {plain && <span style={{ marginLeft: 4 }}>· {plain}</span>}
      </div>
      {showDel && (
        <button
          onMouseDown={e => { e.stopPropagation(); onDelete() }}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--text-3)',
            cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px',
          }}
        >×</button>
      )}
    </div>
  )
}

// ── Rich text editor pane ─────────────────────────────────────────────────────
function NoteEditor({ note, onSave }) {
  const titleRef = useRef(null)
  const bodyRef = useRef(null)
  const saveTimer = useRef(null)

  useEffect(() => {
    if (titleRef.current) titleRef.current.value = note.title || ''
    if (bodyRef.current) bodyRef.current.innerHTML = note.body || ''
  }, [note.id])

  function schedSave() {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      onSave({
        title: titleRef.current?.value || '',
        body: bodyRef.current?.innerHTML || '',
        updatedAt: new Date().toISOString(),
      })
    }, 600)
  }

function exportNote(note, exportFormat) {
  const plain = note.body
    ? note.body.replace(/<[^>]*>/g, '')
    : ''

  let content = plain
  let mime = 'text/plain'
  let ext = 'txt'

  if (exportFormat === 'md') {
    content = (note.title ? `# ${note.title}\n\n` : '') + plain
    ext = 'md'
  } else {
    content = (note.title ? `${note.title}\n${'='.repeat(note.title.length)}\n\n` : '') + plain
  }

  const blob = new Blob([content], { type: mime })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${(note.title || 'note').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`
  a.click()
  URL.revokeObjectURL(a.href)
}
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />

      {/* Title */}
      <div style={{ padding: '14px 20px 8px', borderBottom: '0.5px solid var(--border)' }}>
        <input
          ref={titleRef}
          defaultValue={note.title || ''}
          placeholder="Note title…"
          onChange={schedSave}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 18,
            fontWeight: 500,
            color: 'var(--text)',
            fontFamily: 'var(--font-sans)',
          }}
        />
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
          Created {isValid(parseISO(note.createdAt || note.created_at)) ? 
          format(parseISO(note.createdAt || note.created_at), 'MMMM d, yyyy · h:mm a') : '—'}
         {(note.updatedAt || note.updated_at) && 
           isValid(parseISO(note.updatedAt || note.updated_at)) && (
          <span> · Updated {format(parseISO(note.updatedAt || note.updated_at), 'MMM d')}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
  <button
    onClick={() => exportNote(note, 'txt')}
    style={{
      fontSize: 11, padding: '3px 10px',
      border: '0.5px solid var(--border-2)',
      borderRadius: 5, background: 'transparent',
      color: 'var(--text-3)', cursor: 'pointer',
    }}
  >
    Export .txt
  </button>
  <button
    onClick={() => exportNote(note, 'md')}
    style={{
      fontSize: 11, padding: '3px 10px',
      border: '0.5px solid var(--border-2)',
      borderRadius: 5, background: 'transparent',
      color: 'var(--text-3)', cursor: 'pointer',
    }}
  >
    Export .md
  </button>
</div>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        contentEditable
        suppressContentEditableWarning
        onInput={schedSave}
        onPaste={e => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
        }}
        style={{
          flex: 1,
          padding: '16px 20px',
          outline: 'none',
          fontSize: 13,
          color: 'var(--text)',
          lineHeight: 1.75,
          overflowY: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
        data-placeholder="Start writing your note…"
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--text-3);
          pointer-events: none;
        }
        [contenteditable] h2 { font-size: 17px; font-weight: 500; margin: 14px 0 6px; color: var(--text); }
        [contenteditable] h3 { font-size: 15px; font-weight: 500; margin: 12px 0 4px; color: var(--text); }
        [contenteditable] p { margin-bottom: 6px; }
        [contenteditable] ul, [contenteditable] ol { padding-left: 20px; margin-bottom: 8px; }
        [contenteditable] li { margin-bottom: 3px; }
        [contenteditable] hr { border: none; border-top: 0.5px solid var(--border-2); margin: 14px 0; }
        [contenteditable] code { background: var(--bg-3); padding: 1px 5px; border-radius: 3px; font-family: var(--font-mono); font-size: 12px; }
        [contenteditable] blockquote { border-left: 3px solid var(--border-2); margin: 8px 0; padding: 4px 12px; color: var(--text-2); }
      `}</style>
    </div>
  )
}

// ── Resume banner ─────────────────────────────────────────────────────────────
function ResumeBanner({ note }) {
  const plain = note.body ? note.body.replace(/<[^>]*>/g, '').slice(0, 160).trim() : 'No content yet.'
  return (
    <div style={{
      background: 'var(--acc-l)', border: '0.5px solid #9FE1CB',
      borderRadius: 'var(--radius-lg)', padding: '12px 16px',
      marginBottom: 16, display: 'flex', gap: 12,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--acc)', flexShrink: 0, marginTop: 4 }} />
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--acc-d)', marginBottom: 3 }}>
          Resume from: {isValid(parseISO(note.updatedAt || note.updated_at || note.createdAt || note.created_at)) ? format(parseISO(note.updatedAt || note.updated_at || note.createdAt || note.created_at), 'MMM d, yyyy') : '—'} — {note.title || 'Untitled'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--acc-m)', lineHeight: 1.55 }}>{plain}</div>
      </div>
    </div>
  )
}

// ── Main Notes component ──────────────────────────────────────────────────────
export function Notes({ project, onAddNote, onUpdateNote, onDeleteNote }) {
  const notes = project.notes || []
  const [activeId, setActiveId] = useState(notes[0]?.id || null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    if (!activeId && notes.length > 0) setActiveId(notes[0].id)
    if (notes.length === 0) setActiveId(null)
  }, [notes.length])

  const activeNote = notes.find(n => n.id === activeId)

  function handleNew() {
    const note = {
      id: uuid(),
      title: '',
      body: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onAddNote(note)
    setActiveId(note.id)
  }

  function handleDelete(noteId) {
    setConfirmDelete(noteId)
  }

  function confirmDel() {
    const idx = notes.findIndex(n => n.id === confirmDelete)
    onDeleteNote(confirmDelete)
    setConfirmDelete(null)
    const remaining = notes.filter(n => n.id !== confirmDelete)
    setActiveId(remaining.length > 0 ? (remaining[Math.max(0, idx - 1)]?.id || remaining[0]?.id) : null)
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Notes list panel */}
      <div style={{
        width: 220, flexShrink: 0,
        borderRight: '0.5px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-2)',
      }}>
        <div style={{ padding: '10px 12px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <SectionLabel style={{ margin: 0 }}>Notes ({notes.length})</SectionLabel>
          <button
            onClick={handleNew}
            style={{
              background: 'var(--acc)', color: '#fff', border: 'none',
              borderRadius: 5, width: 22, height: 22,
              fontSize: 16, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >+</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {notes.length === 0 && (
            <div style={{ padding: '20px 14px', fontSize: 12, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.6 }}>
              No notes yet.<br />Hit + to create your first one.
            </div>
          )}
          {notes.map(n => (
            <NoteListItem
              key={n.id}
              note={n}
              active={n.id === activeId}
              onClick={() => setActiveId(n.id)}
              onDelete={() => handleDelete(n.id)}
            />
          ))}
        </div>
      </div>

      {/* Editor pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeNote ? (
          <NoteEditor
            key={activeNote.id}
            note={activeNote}
            onSave={updates => onUpdateNote(activeNote.id, updates)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Select a note or create a new one</div>
            <Button variant="primary" size="sm" onClick={handleNew}>+ New note</Button>
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          message="Delete this note? This cannot be undone."
          onConfirm={confirmDel}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
