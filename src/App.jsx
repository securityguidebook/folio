import React, { useState, useEffect } from 'react'
import { useStore } from './store/useStore.js'
import { Sidebar } from './components/Sidebar.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { Timeline } from './components/Timeline.jsx'
import { ProjectDetail } from './components/ProjectDetail.jsx'
import { ProjectModal } from './components/ProjectModal.jsx'
import { SettingsModal } from './components/SettingsModal.jsx'

export default function App() {
  const store = useStore()
  const [view, setView] = useState('dashboard')
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', store.settings.theme || 'light')
  }, [store.settings.theme])

  function navTo(v, id) {
    setView(v)
    if (id) setActiveProjectId(id)
  }

  function handleDeleteProject(id) {
    store.deleteProject(id)
    setView('dashboard')
    setActiveProjectId(null)
  }

  const activeProject = store.projects.find(p => p.id === activeProjectId)

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg-3)',
      overflow: 'hidden',
    }}>
      <Sidebar
        view={view}
        activeProjectId={activeProjectId}
        projects={store.projects}
        settings={store.settings}
        onNav={navTo}
        onSettings={() => setShowSettings(true)}
        onNewProject={() => setShowNewProject(true)}
      />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg)',
        minWidth: 0,
      }}>
        {view === 'dashboard' && (
          <Dashboard
            projects={store.projects}
            onOpenProject={id => navTo('project', id)}
            onNewProject={() => setShowNewProject(true)}
          />
        )}

        {view === 'timeline' && (
          <Timeline projects={store.projects} />
        )}

        {view === 'project' && activeProject && (
          <ProjectDetail
            project={activeProject}
            onUpdate={updates => store.updateProject(activeProject.id, updates)}
            onDelete={handleDeleteProject}
            onEdit={() => setEditProject(activeProject)}
            onAddNote={store.addNote}
            onUpdateNote={store.updateNote}
            onDeleteNote={store.deleteNote}
            onAddGoal={store.addGoal}
            onToggleGoal={store.toggleGoal}
            onDeleteGoal={store.deleteGoal}
            onAddPipeline={store.addPipelineItem}
            onMovePipeline={store.movePipelineItem}
            onDeletePipeline={store.deletePipelineItem}
          />
        )}

        {view === 'project' && !activeProject && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 13, color: 'var(--text-3)' }}>
            Project not found.
          </div>
        )}
      </main>

      {/* Modals */}
      {showNewProject && (
        <ProjectModal
          onSave={store.addProject}
          onClose={() => setShowNewProject(false)}
        />
      )}

      {editProject && (
        <ProjectModal
          project={editProject}
          onSave={updates => store.updateProject(editProject.id, updates)}
          onClose={() => setEditProject(null)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={store.settings}
          onSave={store.updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
