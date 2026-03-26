Folio — Changelog

v1.0.0 — Prototype (interactive widget, not deployable)
First working concept built as an inline Claude widget.

Added: Sidebar with Dashboard and Timeline navigation
Added: Project cards on dashboard with progress bars, status pills, tags, last-updated
Added: Gantt/Timeline view with month headers and project bars
Added: Project detail view with Notes, Goals, and Pipeline tabs
Added: Session log (changelog-style notes with dated entries)
Added: Goals checklist with done/undone state
Added: Kanban pipeline (Backlog / Up next / In progress / Done)
Added: Resume banner showing last session entry at top of Notes tab
Added: File attachment chips on notes (visual only, no real upload)
Note: All data hardcoded — no user input, no persistence


v1.1.0 — File vault + sync design (interactive widget)
Extended prototype with file management and attachment model.

Added: Files tab per project — upload zone UI, file list with type badges (TXT, PDF, MD, IMG), file sizes and dates
Added: Inline file preview for .txt files (click to open viewer)
Added: File chips on note entries linking notes to attached files
Added: Dashboard cards now show file count and last note title
Added: Resume banner improved with last note date and key excerpt
Added: Goals tab now includes a three-stat summary row (goals complete, progress %, files attached)
Added: Sync indicator ("Synced") in sidebar header
Added: User avatar and email in sidebar footer
Changed: Notes panel is now split-pane (list left, content right)
Note: Still widget-only — not deployable, data still hardcoded


v2.0.0 — Deployable app (React + Vite, GitHub → Cloudflare Pages)
Full rebuild as a real deployable web application. Zero hardcoded data.

Added: Full React 18 + Vite 5 project scaffold
Added: useStore.js — all state managed via localStorage, fully dynamic (no hardcoded projects, notes, goals)
Added: ProjectModal.jsx — create and edit projects with name, description, colour picker, status, progress slider, start/target dates, tags
Added: Notes.jsx — OneNote-style rich text editor with formatting toolbar (bold, italic, underline, strikethrough, H1/H2, bullet/numbered lists, highlight, inline code, dividers, clear formatting), per-note title, auto-save on keystroke
Added: Goals.jsx — add/toggle/delete goals with optional sub-note, stats summary row
Added: Pipeline.jsx — kanban with add cards per column, move cards between columns via hover menu, delete cards
Added: Dashboard.jsx — empty state for new users, projects grouped by status (Active / Paused / Done), stat bar
Added: Timeline.jsx — Gantt derived from real project start/target dates, today marker, lists projects missing dates
Added: Sidebar.jsx — dynamic project list, user avatar with initials from settings, settings gear icon
Added: SettingsModal.jsx — set name and email, light/dark theme toggle, export data as .json, import backup to restore
Added: UI.jsx — shared component library (Button, Input, Modal, ConfirmModal, ColorPicker, Tag, ProgressBar, StatusPill, SectionLabel)
Added: index.css — CSS variables for light and dark mode, DM Sans + DM Mono fonts
Added: public/_redirects — Cloudflare Pages SPA routing fix
Added: .github/workflows/deploy.yml — GitHub Actions CI/CD pipeline (build → deploy to Cloudflare Pages on push to main)
Added: .gitignore — excludes node_modules, dist, .env files
Added: README.md — local dev setup, deployment guide (Option A: GitHub Actions, Option B: direct Cloudflare), custom domain, data/storage notes, project structure, roadmap
Changed: Fonts switched from system fonts to DM Sans (body) + DM Mono (code/mono)
Removed: All hardcoded project/note/goal/file data
Known limitation: localStorage is per-browser, not cross-device — export/import is the current sync workaround

Changelog
v2.0.1 — Fix CI/CD pipeline errors

Fixed: Missing package-lock.json causing npm ci to fail (switched to npm install)
Fixed: Deprecated Node.js 20 actions updated to Node.js 24-compatible versions
Fixed: Bumped actions/checkout to @v4 and actions/setup-node to @v4 with Node 22


Roadmap (not yet built)

 File attachments with real upload (Supabase Storage)
 Multi-device sync (Supabase or PocketBase backend)
 Mobile responsive layout
 Note search / full-text filter across all projects
 Recurring project templates
 Weekly review / digest mode
