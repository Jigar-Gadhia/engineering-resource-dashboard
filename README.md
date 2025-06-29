
# ⚙️ Engineering Resource Management Dashboard (Frontend)

A modern React + TypeScript frontend dashboard for managing engineers, projects, and assignments with intelligent skill matching. Built using Vite, Tailwind, and Shadcn UI components.

> 🔧 Backend is hosted separately and not part of this repository.

---

## 🧱 Tech Stack

- ⚛️ React + TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧩 Shadcn UI
- 📦 Zustand (if used)
- 🔗 Axios

---

## 🤖 AI Tools Used

- ⚡ **Bolt (Web App Builder)** – for generating UI scaffolds and layouts
- 💬 **ChatGPT** – logic implementation, architecture planning, debugging help
- 🧠 **Blackbox AI** – code snippet lookups and refactoring assistance

---

## 📁 Folder Structure

```
.
├── src/
│   ├── components/
│   │   ├── ui/                 # Shadcn UI-based components
│   │   ├── Assignments.tsx     # Assignment management screen
│   │   ├── Dashboard.tsx       # Overview page
│   │   ├── Engineers.tsx       # Engineers management
│   │   ├── Projects.tsx        # Project management
│   ├── context/                # Auth context
│   ├── lib/                    # Utilities, if any
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
├── .env
├── .gitignore
├── LICENSE
├── index.html
├── tsconfig.json
├── vite.config.ts
├── package.json
├── bun.lockb
```

---

## ⚙️ Setup Instructions

### 🛠 Prerequisites

- **Node.js** or **Bun** installed
- Clone this repo:
```bash
git clone https://github.com/Jigar-Gadhia/engineering-resource-dashboard.git
cd engineering-resource-dashboard
```

---

### 🚀 Run with Bun (Recommended)

```bash
bun install
bun dev
```

---

### 🟢 Or run with NPM

```bash
npm install
npm run dev
```

The app will be live at: [http://localhost:5173](http://localhost:5173)

---

## 🔗 Backend API

- Ensure your backend server is running (Node.js/Express with Bun, MongoDB)
- API endpoints assumed at: `http://localhost:3000/api/...`
- Configure `.env` or Axios base URL if needed

---

## 📜 License

MIT License

---

## 🙌 Contributions

Open to feedback, pull requests, and feature ideas!
