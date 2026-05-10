# 🌍 Traveloop — Premium Travel Planning Platform

Traveloop is a production-grade, full-stack travel organizer built for modern adventurers. Plan multi-city trips, manage budgets, track packing, and share your itineraries with the world.

## 🚀 Features

- **Multi-City Itinerary Builder:** Drag-and-drop city stops and assign activities.
- **Smart Budgeting:** Real-time expense tracking with category-based visualizations and automated DB-level cost summaries.
- **Trip Health Score:** Dynamic SVG gauge showing the "health" of your planning based on budget, activities, and packing.
- **Packing Checklist:** Categorized items with progress tracking.
- **Public Sharing:** Generate unique tokens to share read-only itineraries with friends.
- **Admin Dashboard:** Platform-wide analytics for administrators.
- **Security:** JWT Authentication (httpOnly cookies), Bcrypt password hashing, and role-based access control.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, Zustand, Lucide Icons, Recharts.
- **Backend:** Node.js, Express, MySQL (mysql2/promise), Joi validation.
- **Database:** Raw SQL with Triggers and Views for high data integrity.

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server

### 2. Configuration
Create a `.env` file in the `backend/` directory (and root if running concurrently):
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=traveloop
DB_USER=root
DB_PASSWORD=your_password

JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=5000
```

### 3. Installation & Database Setup
```bash
# Install dependencies
npm install
cd backend && npm install

# Initialize Database (Creates DB, Tables, Triggers, and Seeds)
node src/scripts/init-db.js
```

### 4. Running the App
In the root directory, run:
```bash
npm run dev
```
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

## 👤 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **User** | `traveler@demo.com` | `demo1234` |
| **User** | `explorer@demo.com` | `demo1234` |

*Note: Both accounts come pre-loaded with full trip data, budgets, and activities for a complete demo experience.*

---
Built for the **ODOO Hackathon**.
