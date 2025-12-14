# **Ruu's OC Encyclopedia & World Wiki**
*A Personal Wiki + CMS for Organizing All My OCs Across Every World*

---

## 🎯 **Project Purpose**

This application is a **personal OC encyclopedia and world wiki** designed exclusively for **Ruu**.  
Its purpose is to:

- Centralize all OCs across canon worlds (Naruto, FF7, etc.) and original worlds (Kismet, Moirai, Tiderift, etc.)
- Provide a clean, readable **wiki-style website** for browsing characters and worlds
- Provide a **private admin dashboard** where *only Ruu* can create, edit, or delete content

There are **no user accounts**, **no public logins**, and **no collaboration tools**.  
The public may only **view**; Ruu is the **sole editor**.

---

# 🚫 **Access Model (Critical)**

### 🔒 **Admin (Ruu Only)**
- Logs into a private `/admin` area using environment-based authentication  
- Full control over all data:
  - Worlds
  - OCs
  - Timelines
  - Timeline events

### 🌐 **Public (Everyone Else)**
- Completely anonymous  
- Can **read** public worlds, OCs, and timelines  
- Can use **search** and **filters**  
- Cannot edit anything  
- Never sees a login or signup screen

---

# 🏗️ **Tech Stack**

| Feature | Technology |
|--------|------------|
| Framework | **Next.js** |
| Database | **Supabase PostgreSQL** |
| Auth (Ruu only) | Environment-based authentication |
| Styling | **Tailwind CSS** |
| Hosting | **Railway** |
| Assets (v1) | Google Drive URLs |
| Data Exchange | JSON, Markdown |

---

# 🚀 **Deployment on Railway**

## Prerequisites

1. A Railway account ([railway.app](https://railway.app))
2. A Supabase project with database configured
3. All required environment variables (see below)

## Setup Steps

### 1. Connect Repository to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if needed
5. Select this repository

### 2. Configure Environment Variables

In your Railway project settings, add the following environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Admin Key (for server-side admin operations)
# You can use either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# OR
SUPABASE_SECRET_KEY=your_supabase_secret_key

# Admin Login Credentials
USERNAME=your_admin_username
PASSWORD=your_admin_password
```

**Important Notes:**
- `NEXT_PUBLIC_*` variables are automatically exposed to the client-side
- Never commit your `.env` file or expose secrets
- Set all variables in Railway's environment variables section

### 3. Deploy

Railway will automatically:
- Detect Next.js framework
- Run `npm install` to install dependencies
- Run `npm run build` to build the application
- Run `npm start` to start the production server

### 4. Access Your Deployed Application

Once deployed, Railway will provide you with a public URL. You can:
- View the public site at the root URL
- Access the admin dashboard at `/admin/login`

---

# 💻 **Local Development**

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with all required environment variables (see above)
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Importing Data

To import OCs from a CSV file:
```bash
npx tsx scripts/import-csv.ts
```

---

# 🌍 **Core Data Models**

## 1. **Worlds**

A "World" represents any universe a character can belong to.  
This includes canon series and original settings.

### Canon Worlds
Dragon Ball Z • Final Fantasy • Inuyasha • Naruto • Nier • Pokémon • Shaman King • Zelda

### Original Worlds
Kismet • Moirai • Pluviophile • Tiderift • Vieulx • None • Not Accessible

### `worlds` Table (v1)

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Internal ID |
| `name` | text | World name |
| `slug` | text | URL-safe name |
| `series_type` | `"canon"` or `"original"` |
| `summary` | text | Short description |
| `description_markdown` | text | Long-form lore |
| `primary_color` | text | Hex / theme color |
| `accent_color` | text | Secondary color |
| `is_public` | boolean | Visibility control |
| Timestamps | auto | Created/updated |

---

## 2. **OCs (Characters)**

Each OC belongs to **one primary world** and has:

- Universal fields  
- A template type  
- Additional template-specific fields (JSON)

### `ocs` Table (v1)

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | |
| `name` | text | |
| `slug` | text | |
| `world_id` | uuid | FK → worlds |
| `series_type` | text | Cached from world |
| `template_type` | text | `"naruto"`, `"ff7"`, `"inuyasha"`, etc. |
| `age` | int | |
| `pronouns` | text | |
| `gender_identity` | text | Optional |
| `status` | text | alive/dead/missing/etc |
| `image_url` | text | |
| `tags` | text[] | |
| `short_bio` | text | |
| `full_bio_markdown` | text | Markdown |
| `extra_fields` | JSONB | Template-specific |
| `is_public` | boolean | |
| Timestamps | auto | |

---

## 3. **Template Types & Extra Fields**

Used to store fandom-specific info.

### Naruto
```json
{
  "village": "",
  "clan": "",
  "rank": "",
  "chakra_natures": [],
  "kekkei_genkai": ""
}
```

### Final Fantasy
```json
{
  "affiliation": "",
  "role": "",
  "mako_exposure": "",
  "materia_skill": ""
}
```

### Inuyasha
```json
{
  "species": "",
  "youkai_type": "",
  "era": "",
  "weapon_or_ability": ""
}
```

### Shaman King
```json
{
  "spirit_type": "",
  "spirit_name": "",
  "oversoul_style": "",
  "medium_type": ""
}
```

### Zelda
```json
{
  "race": "",
  "region": "",
  "deity_or_blessing": "",
  "weapon_style": ""
}
```

### Dragon Ball
```json
{
  "race": "",
  "power_level": "",
  "transformation_stages": []
}
```

### Pokémon
```json
{
  "species": "",
  "typing": [],
  "trainer_class": "",
  "region": ""
}
```

### Nier
```json
{
  "model_type": "",
  "role": "",
  "weapon_specialty": "",
  "faction": ""
}
```

### Original Worlds
```json
{
  "role": "",
  "species": "",
  "ability_type": "",
  "region": ""
}
```

---

## 4. **Timelines**

### `timelines`
- `id`
- `world_id`
- `name`
- `description_markdown`
- timestamps

### `timeline_events`
- `id`
- `timeline_id`
- `title`
- `body_markdown`
- `date_text`
- `position`
- timestamps

v1 = simple vertical lists.

---

# 🎨 **Styling & Design System**

The visual goal:

- Clean, minimal, modern  
- Anime-wiki-inspired layout  
- Consistent reading experience  
- Theming based on world colors  

---

## 📁 Styling File Organization

```
src/
  styles/
    globals.css            # Tailwind base + global rules
  lib/
    theme/
      worldTheme.ts        # Helper for dynamic world colors
  components/
    layout/                # Shared wrappers/layouts
    wiki/                  # Infobox, tag list, etc.
    oc/                    # OC-specific components
    world/                 # World-specific components
```

---

## 🎨 Tailwind & Themes

### Tailwind (`globals.css`)
- Import Tailwind layers
- Set typography defaults
- Add base link styles
- Optionally define CSS variables like:
  ```css
  :root {
    --world-primary: #f97316;
    --world-accent: #94a3b8;
  }
  ```

### Dynamic World Themes (`worldTheme.ts`)
```ts
export function getWorldTheme(world) {
  return {
    primary: world.primary_color || '#64748b',
    accent: world.accent_color || '#94a3b8'
  };
}
```

Apply with:
```tsx
<div style={{
  '--world-primary': theme.primary,
  '--world-accent': theme.accent
}}>
```

---

## 📦 Component-Level Styling

Use Tailwind utilities within components:

```tsx
export function Infobox({ children }) {
  return (
    <aside className="w-full md:w-80 border rounded-xl p-4 shadow-sm bg-white/80">
      {children}
    </aside>
  );
}
```

This keeps styling modular and predictable.

---

# 🌐 **Public Site Features (Read-Only)**

Visitors can:

- Browse all worlds  
- View OC profiles  
- Read timelines  
- Use search & filters  
- Navigate wiki-style pages  

No login, no accounts, no editing.

---

# 🔧 **Admin Dashboard (Ruu Only)**

`/admin` routes provide tools to manage:

### Worlds
- Create/edit/delete
- Set theme colors
- Toggle visibility

### OCs
- Create/edit/delete
- Template-aware extra fields
- Markdown editor
- Image URLs
- Tags
- Toggle visibility

### Timelines
- Add/edit timelines
- Add/edit/reorder events

---

# 🔐 **Security**

Supabase Row-Level Security:

- Public = `SELECT` only where `is_public = true`
- Admin = full CRUD permissions
- Exactly **one** user (Ruu)
- No signup allowed

---

# 🔄 **Migration From Google Sheets**

1. Define worlds in Supabase  
2. Clean OC spreadsheet  
3. Export CSV  
4. Import into Supabase `ocs`  
5. Set templates and extra fields  
6. Use admin dashboard for all edits going forward  

---

# 📅 **Future Features (Post-v1)**

- Relationship graph  
- OC relationship table  
- Personal timelines  
- Visual timeline UI  
- Dark mode  
- Supabase Storage for images  
- Export/backup tools  

---

# ✅ **Summary**

This project is:

> A private, extensible, beautifully organized OC encyclopedia powered by Next.js and Supabase, giving Ruu a long-term home for every character and world — with world-based themes, dynamic templates, wiki layouts, timelines, and a private admin CMS that only Ruu can use.
