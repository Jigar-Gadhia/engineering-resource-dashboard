# ⚙️ Engineering Resource Management Dashboard (Fullstack)

A modern React + TypeScript frontend dashboard for managing engineers, projects, and assignments with intelligent skill matching. Built using Vite, Tailwind, and Shadcn UI components, and powered by a Node.js + Express + MongoDB backend.

---

## 🧱 Tech Stack

### Frontend

- ⚛️ React + TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧩 Shadcn UI
- 🔗 Axios

### Backend

- 🌐 Node.js
- 🚀 Express.js
- 🛢️ MongoDB + Mongoose
- 🔐 JWT for auth
- 🧂 Bcrypt for password hashing

---

## 🤖 AI Tools Used

- ⚡ **Bolt (Web App Builder)** – for generating UI scaffolds and layouts
- 💬 **ChatGPT** – logic implementation, architecture planning, debugging help
- 🧠 **Blackbox AI** – code snippet lookups and refactoring assistance

---

## 📁 Folder Structure

```
.
├── server/                          # Backend (Node.js + Express + MongoDB)
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                # MongoDB connection setup
│   │
│   │   ├── controllers/
│   │   │   └── auth.controller.ts   # Auth logic (login/register)
│   │
│   │   ├── middleware/
│   │   │   └── auth.ts              # JWT auth middleware
│   │
│   │   ├── models/
│   │   │   ├── Assignment.ts        # Mongoose model for assignments
│   │   │   ├── Project.ts           # Mongoose model for projects
│   │   │   └── User.ts              # Mongoose model for users/engineers
│   │
│   │   ├── routes/
│   │   │   ├── analytics.routes.ts  # Analytics endpoints
│   │   │   ├── assignment.routes.ts # CRUD routes for assignments
│   │   │   ├── auth.routes.ts       # Auth routes
│   │   │   ├── engineer.routes.ts   # Engineer-related routes
│   │   │   └── project.routes.ts    # Project-related routes
│   │
│   │   ├── seed/
│   │   │   ├── seed.ts              # Seeding sample data
│   │   │   └── index.ts             # Entry point to run seeds
│   │
│   │   └── index.ts                 # Main entry point (Express app init)
│
│   ├── .env                         # Env variables (Mongo URI, JWT, etc.)
│   └── tsconfig.json               # TypeScript config
│
├── src/                             # Frontend (React + Vite + Tailwind)
│   ├── components/
│   │   ├── ui/
│   │   ├── Assignments.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Engineers.tsx
│   │   ├── Projects.tsx
│   ├── context/
│   ├── lib/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│
├── .env
├── vite.config.ts
├── package.json
├── bun.lockb
└── README.md
```

---

## ⚙️ Setup Instructions

### 🛠 Prerequisites

- **Node.js** or **Bun** installed
- **MongoDB** (local or Atlas)

---

### 🔧 Backend Setup (Node.js + Express + MongoDB)

```bash
cd server
cp .env.example .env       # Configure DB and JWT values
npm install                # or bun install
npm run src/index.ts       # or bun run src/index.ts
```

**Sample `.env`**
```
MONGO_URI=mongodb://localhost:27017/engineering-db
JWT_SECRET=your-secret-key
PORT=3000
```

The backend will run at: [http://localhost:3000](http://localhost:3000)

---

### 🖼 Frontend Setup (React + Vite + Tailwind)

```bash
cd ..
bun install               # Or: npm install
bun dev                  # Or: npm run dev
```

The app will be live at: [http://localhost:5173](http://localhost:5173)

---

## 🔗 API Integration

- Axios base URL should point to: `http://localhost:3000/api`
- Auth, engineers, projects, and assignments APIs available via REST

---

## 📜 License

MIT License

---

## 🙌 Contributions

Open to feedback, pull requests, and feature ideas!
---

### 🎨 Shadcn UI Setup

Shadcn UI is used for consistent and modern UI components. To set it up:

1. Install Shadcn CLI and initialize:
```bash
npx shadcn@latest init
```
2. Select your framework options (e.g., React, Tailwind CSS, TypeScript, App Router).
3. Add components using the CLI:
```bash
npx shadcn@latest add button
```
4. You can customize themes, colors, and fonts via `tailwind.config.js` and `components.json`.

📦 Components are stored under `src/components/ui/`.

Documentation: [https://ui.shadcn.com](https://ui.shadcn.com)
---

### 🧩 Recommended Shadcn UI Components Installation

Install commonly used components with the Shadcn CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add card
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tooltip
npx shadcn@latest add table
npx shadcn@latest add calendar
npx shadcn@latest add badge
npx shadcn@latest add select
npx shadcn@latest add toast
```

Each component will be added to `src/components/ui/` and is styled with Tailwind CSS.

For more components and customization, refer to: [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)