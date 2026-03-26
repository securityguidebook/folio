import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'folio_data_v1'

const DEFAULT_STATE = {
  projects: [],
  settings: {
    userName: '',
    userEmail: '',
    theme: 'light',
  },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_STATE
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function useStore() {
  const [state, setState] = useState(() => load())

  const commit = useCallback((updater) => {
    setState(prev => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [])

  // ── Projects ──────────────────────────────────────────────
  const addProject = useCallback((project) => {
    commit(s => ({
      ...s,
      projects: [...s.projects, project],
    }))
  }, [commit])

  const updateProject = useCallback((id, updates) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    }))
  }, [commit])

  const deleteProject = useCallback((id) => {
    commit(s => ({
      ...s,
      projects: s.projects.filter(p => p.id !== id),
    }))
  }, [commit])

  // ── Notes ─────────────────────────────────────────────────
  const addNote = useCallback((projectId, note) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === projectId
          ? { ...p, notes: [note, ...(p.notes || [])] }
          : p
      ),
    }))
  }, [commit])

  const updateNote = useCallback((projectId, noteId, updates) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === projectId
          ? { ...p, notes: p.notes.map(n => n.id === noteId ? { ...n, ...updates } : n) }
          : p
      ),
    }))
  }, [commit])

  const deleteNote = useCallback((projectId, noteId) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === projectId
          ? { ...p, notes: p.notes.filter(n => n.id !== noteId) }
          : p
      ),
    }))
  }, [commit])

  // ── Goals ─────────────────────────────────────────────────
  const addGoal = useCallback((projectId, goal) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === projectId
          ? { ...p, goals: [...(p.goals || []), goal] }
          : p
      ),
    }))
  }, [commit])

  const toggleGoal = useCallback((projectId, goalId) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === projectId
          ? { ...p, goals: p.goals.map(g => g.id === goalId ? { ...g, done: !g.done } : g) }
          : p
      ),
    }))
  }, [commit])

  const deleteGoal = useCallback((projectId, goalId) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === projectId
          ? { ...p, goals: p.goals.filter(g => g.id !== goalId) }
          : p
      ),
    }))
  }, [commit])

  // ── Pipeline ──────────────────────────────────────────────
  const addPipelineItem = useCallback((projectId, column, item) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p => {
        if (p.id !== projectId) return p
        const pipeline = p.pipeline || { backlog: [], upNext: [], inProgress: [], done: [] }
        return { ...p, pipeline: { ...pipeline, [column]: [...pipeline[column], item] } }
      }),
    }))
  }, [commit])

  const movePipelineItem = useCallback((projectId, fromCol, toCol, itemId) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p => {
        if (p.id !== projectId) return p
        const pipeline = p.pipeline || { backlog: [], upNext: [], inProgress: [], done: [] }
        const item = pipeline[fromCol].find(i => i.id === itemId)
        if (!item) return p
        return {
          ...p,
          pipeline: {
            ...pipeline,
            [fromCol]: pipeline[fromCol].filter(i => i.id !== itemId),
            [toCol]: [...pipeline[toCol], item],
          },
        }
      }),
    }))
  }, [commit])

  const deletePipelineItem = useCallback((projectId, column, itemId) => {
    commit(s => ({
      ...s,
      projects: s.projects.map(p => {
        if (p.id !== projectId) return p
        const pipeline = p.pipeline || { backlog: [], upNext: [], inProgress: [], done: [] }
        return { ...p, pipeline: { ...pipeline, [column]: pipeline[column].filter(i => i.id !== itemId) } }
      }),
    }))
  }, [commit])

  // ── Settings ──────────────────────────────────────────────
  const updateSettings = useCallback((updates) => {
    commit(s => ({ ...s, settings: { ...s.settings, ...updates } }))
  }, [commit])

  return {
    projects: state.projects,
    settings: state.settings,
    addProject,
    updateProject,
    deleteProject,
    addNote,
    updateNote,
    deleteNote,
    addGoal,
    toggleGoal,
    deleteGoal,
    addPipelineItem,
    movePipelineItem,
    deletePipelineItem,
    updateSettings,
  }
}
