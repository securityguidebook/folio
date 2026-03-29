import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useStore(user) {
  const [projects, setProjects] = useState([])
  const [settings, setSettings] = useState({ userName: '', userEmail: '', timezone: 'UTC', theme: 'light' })
  const [loading, setLoading] = useState(true)

  // ── Load all data on mount ─────────────────────────────────
  useEffect(() => {
    if (!user) { setProjects([]); setLoading(false); return }
    loadAll()
  }, [user])

  async function loadAll() {
    setLoading(true)
    try {
      const [{ data: prof, error: profErr }, { data: proj, error: projErr }, { data: notes, error: notesErr }, { data: goals, error: goalsErr }, { data: pipeline, error: pipelineErr }] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('projects').select('*').eq('user_id', user.id).order('created_at'),
          supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('goals').select('*').eq('user_id', user.id).order('created_at'),
          supabase.from('pipeline_items').select('*').eq('user_id', user.id).order('created_at'),
        ])

  if (profErr) console.error('Profiles load failed:', profErr)
  if (projErr) console.error('Projects load failed:', projErr)
  if (notesErr) console.error('Notes load failed:', notesErr)
  if (goalsErr) console.error('Goals load failed:', goalsErr)
  if (pipelineErr) console.error('Pipeline load failed:', pipelineErr)
      
      if (prof) {
        setSettings({
          userName: prof.name || '',
          userEmail: user.email || '',
          timezone: prof.timezone || 'UTC',
          theme: 'light',
          plan: prof.plan || 'free',
        })
      }

        const assembled = (proj || []).map(p => ({
          ...p,
            startDate: p.start_date || null,
            targetDate: p.target_date || null,
            tags: Array.isArray(p.tags) ? p.tags : (p.tags ? p.tags.split(',') : []),
            notes: (notes || []).filter(n => n.project_id === p.id).map(n => ({
              ...n,
            createdAt: n.created_at,
            updatedAt: n.updated_at,
            })),
  goals: (goals || []).filter(g => g.project_id === p.id),
  pipeline: {
    backlog:    (pipeline || []).filter(i => i.project_id === p.id && i.column_key === 'backlog'),
    upNext:     (pipeline || []).filter(i => i.project_id === p.id && i.column_key === 'upNext'),
    inProgress: (pipeline || []).filter(i => i.project_id === p.id && i.column_key === 'inProgress'),
    done:       (pipeline || []).filter(i => i.project_id === p.id && i.column_key === 'done'),
  },
}))
      setProjects(assembled)
    } catch (e) {
      console.error('Load error', e)
    } finally {
    setLoading(false)
  }
}

  // ── Projects ──────────────────────────────────────────────
  const addProject = useCallback(async (project) => {
    const { data, error } = await supabase.from('projects').insert({
      user_id: user.id,
      name: project.name,
      description: project.description,
      color: project.color,
      status: project.status,
      progress: project.progress || 0,
      start_date: project.startDate || null,
      target_date: project.targetDate || null,
      tags: project.tags || [],
    }).select().single()
    if (error) { console.error(error); return }
    setProjects(prev => [...prev, {
      ...data,
      startDate: data.start_date,
      targetDate: data.target_date,
      tags: data.tags || [],
      notes: [], goals: [],
      pipeline: { backlog: [], upNext: [], inProgress: [], done: [] },
    }])
  }, [user])

  const updateProject = useCallback(async (id, updates) => {
    const dbUpdates = { ...updates, updated_at: new Date().toISOString() }
    if (updates.startDate !== undefined) { dbUpdates.start_date = updates.startDate; delete dbUpdates.startDate }
    if (updates.targetDate !== undefined) { dbUpdates.target_date = updates.targetDate; delete dbUpdates.targetDate }
    delete dbUpdates.notes; delete dbUpdates.goals; delete dbUpdates.pipeline
    await supabase.from('projects').update(dbUpdates).eq('id', id)
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [user])

  const deleteProject = useCallback(async (id) => {
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [user])

  // ── Notes ─────────────────────────────────────────────────
  const addNote = useCallback(async (projectId, note) => {
    const { data, error } = await supabase.from('notes').insert({
      project_id: projectId,
      user_id: user.id,
      title: note.title || '',
      body: note.body || '',
    }).select().single()
    if (error) { console.error(error); return }
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, notes: [data, ...p.notes] } : p
    ))
  }, [user])

  const updateNote = useCallback(async (projectId, noteId, updates) => {
    await supabase.from('notes').update({
      ...updates,
      updated_at: new Date().toISOString(),
    }).eq('id', noteId)
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, notes: p.notes.map(n => n.id === noteId ? { ...n, ...updates } : n) }
        : p
    ))
  }, [user])

  const deleteNote = useCallback(async (projectId, noteId) => {
    await supabase.from('notes').delete().eq('id', noteId)
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, notes: p.notes.filter(n => n.id !== noteId) } : p
    ))
  }, [user])

  // ── Goals ─────────────────────────────────────────────────
  const addGoal = useCallback(async (projectId, goal) => {
    const { data, error } = await supabase.from('goals').insert({
      project_id: projectId,
      user_id: user.id,
      text: goal.text,
      note: goal.note || '',
      done: false,
    }).select().single()
    if (error) { console.error(error); return }
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, goals: [...p.goals, data] } : p
    ))
  }, [user])

  const toggleGoal = useCallback(async (projectId, goalId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      const updatedGoals = p.goals.map(g => g.id === goalId ? { ...g, done: !g.done } : g)
      const total = updatedGoals.length
      const done = updatedGoals.filter(g => g.done).length
      const progress = total > 0 ? Math.round((done / total) * 100) : p.progress
      supabase.from('goals').update({ done: !p.goals.find(g => g.id === goalId).done }).eq('id', goalId)
      supabase.from('projects').update({ progress, updated_at: new Date().toISOString() }).eq('id', projectId)
      return { ...p, goals: updatedGoals, progress }
    }))
  }, [])

  const deleteGoal = useCallback(async (projectId, goalId) => {
    await supabase.from('goals').delete().eq('id', goalId)
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, goals: p.goals.filter(g => g.id !== goalId) } : p
    ))
  }, [user])

  // ── Pipeline ──────────────────────────────────────────────
  const addPipelineItem = useCallback(async (projectId, column, item) => {
    const { data, error } = await supabase.from('pipeline_items').insert({
      project_id: projectId,
      user_id: user.id,
      column_key: column,
      text: item.text,
      note: item.note || '',
    }).select().single()
    if (error) { console.error(error); return }
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      return { ...p, pipeline: { ...p.pipeline, [column]: [...p.pipeline[column], data] } }
    }))
  }, [user])

  const movePipelineItem = useCallback(async (projectId, fromCol, toCol, itemId) => {
    await supabase.from('pipeline_items').update({ column_key: toCol }).eq('id', itemId)
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      const item = p.pipeline[fromCol].find(i => i.id === itemId)
      if (!item) return p
      return {
        ...p,
        pipeline: {
          ...p.pipeline,
          [fromCol]: p.pipeline[fromCol].filter(i => i.id !== itemId),
          [toCol]: [...p.pipeline[toCol], { ...item, column_key: toCol }],
        },
      }
    }))
  }, [])

  const deletePipelineItem = useCallback(async (projectId, column, itemId) => {
    await supabase.from('pipeline_items').delete().eq('id', itemId)
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      return { ...p, pipeline: { ...p.pipeline, [column]: p.pipeline[column].filter(i => i.id !== itemId) } }
    }))
  }, [])

  // ── Settings ──────────────────────────────────────────────
  const updateSettings = useCallback(async (updates) => {
    await supabase.from('profiles').update({
      name: updates.userName,
      timezone: updates.timezone,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
    setSettings(prev => ({ ...prev, ...updates }))
  }, [user])

  return {
    projects, settings, loading,
    addProject, updateProject, deleteProject,
    addNote, updateNote, deleteNote,
    addGoal, toggleGoal, deleteGoal,
    addPipelineItem, movePipelineItem, deletePipelineItem,
    updateSettings,
  }
}
