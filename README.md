# Folio — Personal Project Manager

A lightweight, offline-first project manager for tracking your own projects,
goals, notes, and pipelines. Built with React + Vite, deployed via GitHub → Cloudflare Pages.

---

## Tech stack

- **React 18** + **Vite 5** — fast dev and build
- **date-fns** — date formatting and Gantt calculations
- **uuid** — unique IDs for all entities
- **lucide-react** — icons
- **localStorage** — all data persists in the browser (no backend required)
- **Cloudflare Pages** — free hosting with global CDN

---

## Local development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/folio.git
cd folio

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → http://localhost:5173
```

---

## Deploy: GitHub → Cloudflare Pages

### Option A — Automatic via GitHub Actions (recommended)

This repo includes `.github/workflows/deploy.yml` which builds and deploys
on every push to `main`.

**Step 1: Get your Cloudflare credentials**

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create a project** → **Pages** → connect GitHub
   (this also gets you your Account ID from the URL: `dash.cloudflare.com/ACCOUNT_ID/...`)
3. Go to **My Profile** → **API Tokens** → **Create Token**
   - Use the **"Edit Cloudflare Workers"** template
   - Or custom: permissions → `Account > Cloudflare Pages > Edit`
4. Copy the token

**Step 2: Add secrets to GitHub**

In your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret name               | Value                       |
|---------------------------|-----------------------------|
| `CLOUDFLARE_API_TOKEN`    | Your Cloudflare API token   |
| `CLOUDFLARE_ACCOUNT_ID`   | Your Cloudflare account ID  |

**Step 3: Push to main**

```bash
git add .
git commit -m "initial deploy"
git push origin main
```

GitHub Actions will build the project and deploy to Cloudflare Pages automatically.
Your site will be live at `https://folio.pages.dev` (or a custom domain if configured).

---

### Option B — Direct Cloudflare Pages (no GitHub Actions)

1. Log in to Cloudflare → **Workers & Pages** → **Create a project**
2. Connect your GitHub repo
3. Set build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**

Cloudflare will auto-deploy on every push to `main`.

---

## Custom domain (optional)

1. Cloudflare Pages dashboard → your project → **Custom domains**
2. Add your domain (e.g. `folio.yourdomain.com`)
3. Cloudflare handles the DNS and SSL automatically if your domain is on Cloudflare

---

## Data & storage

All data lives in **browser localStorage** under the key `folio_data_v1`.

- **Export:** Settings → Export backup (.json) — download a full backup
- **Import:** Settings → Import backup — restore from a backup file on a new device
- No server, no account, no database required

> **Note on sync:** Because this is localStorage-based, data is per-browser per-device.
> For true multi-device sync, a backend (e.g. Supabase) would be the next upgrade.
> The export/import flow is the current workaround.

---

## Project structure

```
folio/
├── public/
│   └── _redirects          # Cloudflare Pages SPA routing fix
├── src/
│   ├── components/
│   │   ├── UI.jsx           # Shared primitives (Button, Input, Modal, etc.)
│   │   ├── Sidebar.jsx      # Left navigation
│   │   ├── Dashboard.jsx    # Project grid overview
│   │   ├── Timeline.jsx     # Gantt chart view
│   │   ├── ProjectDetail.jsx # Per-project tabs wrapper
│   │   ├── Notes.jsx        # Rich text note editor (OneNote-style)
│   │   ├── Goals.jsx        # Goals checklist
│   │   ├── Pipeline.jsx     # Kanban pipeline board
│   │   ├── ProjectModal.jsx # Create / edit project form
│   │   └── SettingsModal.jsx # User settings + data management
│   ├── store/
│   │   └── useStore.js      # All state + localStorage persistence
│   ├── App.jsx              # Root component + routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles + CSS variables (light/dark)
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions CI/CD
├── index.html
├── vite.config.js
└── package.json
```

---

## Roadmap ideas

- [ ] File attachments (upgrade to Supabase Storage)
- [ ] Multi-device sync (Supabase or PocketBase backend)
- [ ] Mobile responsive layout
- [ ] Note search / full-text filter
- [ ] Recurring project templates
- [ ] Weekly digest / review mode
