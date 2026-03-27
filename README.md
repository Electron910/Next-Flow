# 🚀 Next-Flow

Next-Flow is a powerful **visual workflow builder** built with Next.js that allows you to create, execute, and manage AI-powered pipelines using nodes like LLM, image processing, and video tools.

---

## ✨ Features

* 🧠 Visual node-based workflow editor (React Flow)
* ⚡ Execute workflows with real-time status tracking
* 🤖 LLM integration (Gemini / OpenAI-ready)
* 🖼️ Image & 🎥 video processing nodes
* 🔐 Authentication with Clerk
* 🗄️ Database with Prisma
* ☁️ File uploads using Transloadit
* 📊 Workflow run history & logs

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** Prisma + PostgreSQL
* **Auth:** Clerk
* **File Uploads:** Transloadit
* **Workflow Engine:** Custom DAG executor

---

## 📂 Project Structure

```
app/                # Next.js App Router
components/         # UI components
lib/                # Core logic (workflow executor, utils)
prisma/             # Database schema
types/              # Type definitions
public/             # Static assets
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Electron910/Next-Flow.git
cd Next-Flow
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env.local` file in the root:

```env
DATABASE_URL="..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test..."
CLERK_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
GEMINI_API_KEY="AI..."
TRIGGER_SECRET_KEY="tr_dev..."
NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY="pk_dev_..."
TRANSLOADIT_KEY="..."
TRANSLOADIT_SECRET="..."
```

---

### 4. Setup database

```bash
npx prisma generate
npx prisma db push
```

---

### 5. Run the development server

```bash
npm run dev
```

App will be available at:
👉 http://localhost:3000

---

## 🚀 How It Works

1. Create a workflow using the visual editor
2. Connect nodes (LLM, Image, Video, etc.)
3. Execute workflow
4. View outputs and logs
5. Stored in database for future runs

---

## 🧩 Workflow Nodes

* 📝 Text Node
* 🤖 LLM Node
* 🖼️ Image Upload / Crop
* 🎥 Video Upload / Frame Extract
* 🔄 Custom processing nodes

---

## 📡 API Routes

* `/api/workflows` → Manage workflows
* `/api/workflow-runs` → Execution logs
* `/api/execute/*` → Node execution endpoints

---

## 🔐 Authentication

Uses **Clerk** for:

* User sign in / sign up
* Session management
* Secure authentication

---

## ☁️ File Uploads

Handled using **Transloadit**:

* Direct uploads to cloud
* Image & video processing
* CDN-ready URLs

---

## 🧠 Future Improvements

* 🔁 Retry failed nodes
* 📊 Execution analytics dashboard
* ⚡ Parallel execution optimization
* 🧩 Custom plugin system
* 🌐 Deploy workflows as APIs

---

## 🤝 Contributing

Contributions are welcome!

```bash
git checkout -b feature/your-feature
git commit -m "Added new feature"
git push origin feature/your-feature
```


## 👨‍💻 Author

Built with ❤️ by **Dhanush**
