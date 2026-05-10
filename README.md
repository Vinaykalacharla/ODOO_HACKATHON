# 🌍 Traveloop — Personalized Travel Planning Made Easy

> A production-grade, full-stack multi-city travel planning platform built for the Odoo Hackathon.  
> Plan trips. Build itineraries. Track budgets. Share adventures.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Architecture](#database-architecture)
- [API Reference](#api-reference)
- [Setup & Installation](#setup--installation)
- [Demo Accounts](#demo-accounts)
- [Environment Variables](#environment-variables)
- [Key Design Decisions](#key-design-decisions)
- [Screenshots](#screenshots)
- [Team](#team)

---

## Overview

Traveloop is a full-stack travel planning application where users can create multi-city trip itineraries, assign activities to each stop, track budgets with automatic cost computation, manage packing checklists, write trip notes, and share their itineraries publicly via a secure token-based link.

Built for the **Odoo 12-Hour Hackathon**, the application prioritizes:

- **Database-first architecture** — MySQL triggers, views, constraints, and indexes power core business logic
- **Modular backend** — strict separation of routes → controllers → services
- **Production-grade security** — httpOnly JWT cookies, bcrypt hashing, parameterized queries only
- **Clean, consistent UI** — custom design system with Playfair Display + DM Sans typography

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL 8.0 (local) |
| Auth | JWT (httpOnly cookies) + bcrypt |
| State Management | Zustand |
| HTTP Client | Axios with interceptors |
| Charts | Recharts |
| Validation | Joi (API layer) + MySQL CHECK constraints (DB layer) |
| Query Style | Raw SQL via `mysql2` — no ORM |

---

## Features

### Core User Features
- **Authentication** — Signup, login, logout, JWT refresh token rotation
- **Trip Management** — Create, edit, delete (soft delete), and manage trips with status tracking
- **Itinerary Builder** — Add city stops with dates, drag-and-drop reordering, assign activities
- **Itinerary View** — Day-wise timeline and list view toggle of the full trip plan
- **City Search** — Browse 25+ seeded cities with country, average daily cost, and popularity score
- **Activity Search** — Filter activities by category, cost, and duration per city
- **Budget Tracker** — Add budget entries by category; total spent auto-computed via DB triggers
- **Cost Breakdown** — Visual bar chart of spending by category (transport, accommodation, food, activities, misc)
- **Packing Checklist** — Categorized checklist with progress tracking and packed/unpacked toggle
- **Trip Notes** — Add, edit, delete notes per trip or per stop, sorted by newest
- **Public Share** — Share any trip via a unique UUID token link — no login required to view
- **User Profile** — Edit name, email, change password, view public trips

### Admin Features (is_admin users only)
- Total platform stats (users, trips, activities added)
- Top 10 most-added cities and activities
- Recent signups with trip counts
- User management table

### Innovative UI Components
- **Trip Health Score Gauge** — SVG circular arc (0–100) combining budget adherence, stop completeness, and packing progress. Color shifts teal → amber → red based on score.
- **Budget Pulse Bar** — Animated horizontal bar showing budget vs. spent. Transitions on mount. Shows warning/over-budget state with color and badge.
- **Drag-and-Drop Stop Reorder** — Native HTML5 drag API (no library). Updates `stop_order` in DataBase on drop.

---

## Project Structure

```
traveloop/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # mysql2 pool + query() helper
│   │   │   └── env.js              # startup env validation
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification, attaches req.user
│   │   │   ├── validate.js         # Joi schema middleware, returns 422
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   ├── rateLimiter.js      # Rate limit on /api/auth/*
│   │   │   └── adminGuard.js       # Checks req.user.is_admin === 1
│   │   ├── utils/
│   │   │   ├── response.js         # sendSuccess / sendError helpers
│   │   │   ├── crypto.js           # bcrypt helpers
│   │   │   └── jwt.js              # signAccessToken / signRefreshToken / verify
│   │   ├── modules/
│   │   │   ├── auth/               # routes, controller, service, validators
│   │   │   ├── trips/              # routes, controller, service, validators
│   │   │   ├── stops/              # routes, controller, service, validators
│   │   │   ├── activities/         # routes, controller, service, validators
│   │   │   ├── budget/             # routes, controller, service, validators
│   │   │   ├── packing/            # routes, controller, service, validators
│   │   │   ├── notes/              # routes, controller, service, validators
│   │   │   ├── cities/             # routes, controller, service
│   │   │   ├── public/             # routes, controller (no auth)
│   │   │   └── admin/              # routes, controller, service (adminGuard)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # Button, Input, Card, Badge, Modal, Toast, Skeleton, EmptyState
│   │   │   ├── layout/             # AppShell, Navbar, Sidebar, PageHeader
│   │   │   ├── trips/              # TripCard, TripForm, TripTimeline, HealthScoreGauge, BudgetPulseBar
│   │   │   ├── stops/              # StopCard, StopForm, DraggableStopList
│   │   │   ├── activities/         # ActivityCard, ActivityFilters, ActivitySearchModal
│   │   │   ├── budget/             # BudgetEntryForm, CostBreakdownChart, BudgetSummaryCard
│   │   │   ├── packing/            # PackingList, PackingItem, PackingProgress
│   │   │   └── notes/              # NoteEditor, NotesList
│   │   ├── pages/                  # One file per screen (15 pages total)
│   │   ├── hooks/                  # useAuth, useTrips, useBudget, usePacking, useToast, useDebounce
│   │   ├── services/               # axios instance + per-module API service files
│   │   ├── store/                  # authStore.js, tripStore.js (Zustand)
│   │   ├── utils/                  # formatCurrency, formatDate, cn, getInitials
│   │   └── constants/              # routes.js, queryKeys.js
│   └── package.json
│
└── db/
    ├── schema.sql                  # All tables, triggers, and view
    └── seed.sql                    # 25 cities, 100+ activities, 2 demo users with full trip data
```

---

## Database Architecture

The database is the core of Traveloop. It is designed with real constraints, foreign keys, indexes, triggers, and a view — not just tables.

### Tables

| Table | Description |
|---|---|
| `users` | User accounts with soft delete (`deleted_at`), email CHECK constraint |
| `cities` | 25+ seeded cities with avg daily cost and popularity score |
| `activities` | 100+ activities per city, categorized, with flexible `tags` JSON column |
| `trips` | User trips with computed budget columns, status ENUM, and unique share token |
| `trip_stops` | Ordered city stops per trip with date range constraints |
| `trip_activities` | Activities assigned to stops with optional cost override and scheduled time |
| `budget_entries` | Manual budget entries per trip, categorized |
| `packing_items` | Per-trip packing checklist items, categorized |
| `trip_notes` | Notes per trip or per stop |
| `refresh_tokens` | JWT refresh tokens stored in DB with expiry |

### MySQL Triggers (Business Logic in DB Layer)

| Trigger | When | What it does |
|---|---|---|
| `after_budget_entry_insert` | Budget entry added | Auto-updates `trips.computed_spent` |
| `after_budget_entry_update` | Budget entry edited | Re-calculates `trips.computed_spent` |
| `after_budget_entry_delete` | Budget entry removed | Re-calculates `trips.computed_spent` |
| `after_trip_activity_insert` | Activity added to stop | Auto-updates `trips.computed_activity_cost` |
| `after_trip_activity_delete` | Activity removed from stop | Re-calculates `trips.computed_activity_cost` |

> **Why triggers?** Budget totals are always accurate — zero application code needed to keep them in sync. This is the most defensible architectural decision in the project.

### MySQL View — `trip_cost_summary`

Queried directly by the cost summary API endpoint. Returns for each trip:

- `total_budget`, `computed_spent`, `computed_activity_cost`
- `total_estimated_cost` (spent + activity cost)
- `budget_used_pct` (percentage of budget consumed)
- `budget_status` — `'healthy'` / `'warning'` / `'over'` / `'unset'`
- `trip_duration_days`

### Key Constraints

- `CHECK (end_date >= start_date)` on `trips` and `trip_stops`
- `CHECK (email REGEXP ...)` on `users`
- `CHECK (popularity_score BETWEEN 1 AND 10)` on `cities`
- `CHECK (amount > 0)` on `budget_entries`
- `UNIQUE (trip_id, stop_order)` on `trip_stops` — prevents duplicate ordering
- `UNIQUE (share_token)` on `trips` — every trip gets a unique public link token
- `ON DELETE CASCADE` on all child tables
- Composite indexes on high-query columns: `(user_id, status)`, `(city_id, category)`, `(trip_id, category)`

---

## API Reference

All responses follow this standard shape:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

### Auth

```
POST   /api/auth/signup          Create account
POST   /api/auth/login           Login
POST   /api/auth/logout          Logout (clears cookie + deletes refresh token)
POST   /api/auth/refresh         Refresh access token
```

### Trips

```
GET    /api/trips                All user trips (paginated, filter by status)
POST   /api/trips                Create trip
GET    /api/trips/:id            Single trip with stops and activities
PUT    /api/trips/:id            Update trip
DELETE /api/trips/:id            Soft delete (sets deleted_at)
GET    /api/trips/:id/cost-summary   Queries trip_cost_summary view
PATCH  /api/trips/:id/visibility     Toggle is_public
```

### Stops

```
GET    /api/trips/:id/stops           All stops for a trip
POST   /api/trips/:id/stops           Add a stop
PUT    /api/trips/:id/stops/:stopId   Update stop
DELETE /api/trips/:id/stops/:stopId   Delete stop
PATCH  /api/trips/:id/stops/reorder   Reorder stops (body: [{ id, stop_order }])
```

### Activities

```
POST   /api/stops/:stopId/activities           Add activity to stop
DELETE /api/stops/:stopId/activities/:taId     Remove activity from stop
PATCH  /api/stops/:stopId/activities/:taId     Update scheduled time or cost override
```

### Cities & Activities Search

```
GET    /api/cities                      Search cities (?search=&country=&page=&limit=)
GET    /api/cities/:id/activities       Activities for a city (?category=&maxCost=)
```

### Budget

```
GET    /api/trips/:id/budget            All budget entries
POST   /api/trips/:id/budget            Add entry
PUT    /api/trips/:id/budget/:entryId   Update entry
DELETE /api/trips/:id/budget/:entryId   Delete entry
```

### Packing

```
GET    /api/trips/:id/packing              Full checklist
POST   /api/trips/:id/packing              Add item
PATCH  /api/trips/:id/packing/:itemId      Toggle is_packed
DELETE /api/trips/:id/packing/:itemId      Delete item
```

### Notes

```
GET    /api/trips/:id/notes              All notes
POST   /api/trips/:id/notes              Add note
PUT    /api/trips/:id/notes/:noteId      Edit note
DELETE /api/trips/:id/notes/:noteId      Delete note
```

### Public & Admin

```
GET    /api/public/:shareToken     Public itinerary view (no auth)
GET    /api/admin/stats            Platform stats (admin only)
GET    /api/admin/users            All users (admin only, paginated)
```

---

## Setup & Installation

### Prerequisites

- Node.js 18+
- MySQL 8.0 running locally
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-team/traveloop.git
cd traveloop
```

### 2. Set Up the Database

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p traveloop < db/seed.sql
```

### 3. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) below).

### 4. Install Backend Dependencies & Start

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 5. Install Frontend Dependencies & Start

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 6. Open the App

Navigate to `http://localhost:5173` and log in with a demo account.

---

## Demo Accounts

These are pre-seeded with full trip data so judges can explore the app immediately without creating anything.

| Role | Email | Password |
|---|---|---|
| Regular User | traveler@demo.com | demo1234 |
| Regular User | explorer@demo.com | demo1234 |
| Admin | admin@demo.com | demo1234 |

> **traveler@demo.com** has 2 fully built trips with 3 stops each, 4 activities per stop, 5 budget entries, 6 packing items, and 2 notes — ready to explore.

---

## Environment Variables

### Backend `.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=traveloop

# JWT
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cookie
COOKIE_SECRET=your_cookie_secret_min_32_chars

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Key Design Decisions

### 1. Triggers for Budget Computation
`computed_spent` and `computed_activity_cost` on the `trips` table are maintained entirely by MySQL triggers. No application code recalculates these values — the DB stays the source of truth automatically on every insert, update, or delete to budget entries and trip activities.

### 2. No ORM
All queries are written using raw SQL via `mysql2` with prepared statements (`?` placeholders). This makes the schema decisions visible and auditable, prevents any ORM-generated query inefficiencies, and means there is zero risk of an abstraction hiding a SQL injection vulnerability.

### 3. Share Token vs Trip ID
Public itinerary links use `share_token` (a separate UUID column), never the internal `id`. This means the real primary key of a trip is never exposed in any public URL, even if the trip is shared.

### 4. Soft Deletes
Trips and users are never hard-deleted. A `deleted_at` timestamp is set instead, and every query filters `WHERE deleted_at IS NULL`. This preserves data integrity and allows recovery.

### 5. Two-Layer Validation
Every input is validated at the API layer with Joi (field types, lengths, formats, ENUMs) AND at the database layer with MySQL CHECK constraints and ENUM types. If one layer is bypassed, the other catches it.

### 6. httpOnly Cookie Auth
JWT access tokens are stored in `httpOnly`, `sameSite=strict` cookies — never in `localStorage`. This prevents XSS attacks from stealing tokens. Refresh tokens are stored in the database with expiry timestamps, enabling server-side revocation on logout.

### 7. Modular Architecture
Every backend module (auth, trips, stops, budget, etc.) is fully self-contained with its own routes, controller, service, and validators. No module imports from another module's internals. This means any module could be extracted into an independent microservice with zero refactoring.

---

## Screenshots

| Screen | Description |
|---|---|
| Dashboard | Welcome banner, recent trips, recommended cities |
| Trip Detail | Health Score Gauge + Budget Pulse Bar |
| Itinerary Builder | Drag-and-drop stops with activity modal |
| Itinerary View | Day-wise timeline layout |
| Budget Page | Entry table + category bar chart |
| Packing Checklist | Categorized list with progress bar |
| Public Share | Token-based read-only itinerary view |
| Admin Dashboard | Platform stats, top cities, user list |

---

## Team

Built during the **Odoo 12-Hour Hackathon**

| Name | Role |
|---|---|
| [VINAY KALACHARLA] | Backend Architecture & Database |
| [NITHIN RAYAPUREDDY] | Frontend & UI Design |
| [CHETAN MIDDE] | API Integration & Auth |
| [GAUTAMI MUNSURI] | Features & Testing |

---

> *"Travel planning should be as exciting as the trip itself."*  
> — Traveloop, 2025
