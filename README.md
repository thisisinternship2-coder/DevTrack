# DevTrack

A full-stack project management platform for tracking projects, tasks, and team progress — built with React, Express, and PostgreSQL.

---

## Tech Stack

**Frontend**
- React 18 (Create React App)
- React Router DOM v6
- Lucide React (icons)
- Inter font (Google Fonts)
- Plain CSS (no UI libraries)

**Backend**
- Node.js + Express
- PostgreSQL (Neon — serverless cloud Postgres)
- JWT authentication
- bcrypt password hashing
- `pg` (node-postgres driver)

**Dev Tools**
- Git + GitHub
- Thunder Client (API testing)
- Nodemon

---

## Features

### Authentication
- User registration with bcrypt password hashing
- JWT-based login with 7-day token expiry
- Protected routes (frontend + backend middleware)
- Persistent sessions via localStorage
- Auto-logout on token invalidation
- Logout button in navbar

### Projects
- Create, list, and delete projects
- Status tracking (planning / active / completed / archived)
- Owner-linked (each project belongs to a user)
- Real-time UI updates on create/delete

### Tasks
- Create, list, and delete tasks
- Linked to projects (foreign key)
- Priority levels (low / medium / high / urgent)
- Inline status change (todo / in-progress / review / done)
- Persisted to Postgres on every change

### Dashboard
- Live counts of projects and tasks
- Tasks-by-status breakdown
- Recent tasks feed
- Clickable stat cards with navigation

---

## Project Structure
DevTrack/
├── backend/
│ ├── config/
│ │ └── database.js # Postgres pool
│ ├── src/
│ │ ├── controllers/ # Route handlers
│ │ ├── middleware/ # JWT auth
│ │ └── routes/ # API endpoints
│ ├── .env # (gitignored)
│ ├── package.json
│ └── server.js
│
└── frontend/
├── public/
├── src/
│ ├── components/ # Navbar, Sidebar, Button, Card, Loader
│ ├── layouts/ # MainLayout
│ ├── pages/ # Login, Signup, Dashboard, Projects, Tasks, etc.
│ ├── routes/ # AppRoutes with protected routes
│ ├── services/ # API client (fetch wrapper)
│ ├── utils/
│ ├── App.jsx
│ └── main.jsx
└── package.json


---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new user | Public |
| POST | `/api/auth/login` | Login, returns JWT | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | List user's projects | Protected |
| POST | `/api/projects` | Create project | Protected |
| GET | `/api/projects/:id` | Get single project | Protected |
| PUT | `/api/projects/:id` | Update project | Protected |
| DELETE | `/api/projects/:id` | Delete project | Protected |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | List user's tasks | Protected |
| POST | `/api/tasks` | Create task | Protected |
| PUT | `/api/tasks/:id` | Update task (status, etc.) | Protected |
| DELETE | `/api/tasks/:id` | Delete task | Protected |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

---

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

Getting Started
Prerequisites
Node.js v18+

A Postgres database (local or Neon free tier)

1. Clone the repository
bash
git clone https://github.com/thisisinternship2-coder/DevTrack.git
cd DevTrack
2. Set up the backend
bash
cd backend
npm install
Create .env:

env
PORT=5000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your_secret_key_here
NODE_ENV=development
Run:

bash
npm run dev
Backend runs at http://localhost:5000.

3. Set up the frontend
bash
cd ../frontend
npm install
npm start
Frontend runs at http://localhost:3000.

Author
DevTrack Team

1)Ashwin .P. Suresh
2)Roshin Carbalo