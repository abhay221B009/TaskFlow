# TaskFlow - Team Task Manager Documentation

TaskFlow is a modern, full-stack Team Task Management application designed for high-performance teams. It provides a premium SaaS-style interface for organizing projects, assigning tasks, and tracking member performance.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Lucide React (Icons), Recharts (Data Visualization).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (Cloud).
- **Authentication**: JSON Web Tokens (JWT) with HttpOnly-style local storage.
- **State Management**: React Context API.

---

## 🔑 Role-Based Access Control (RBAC)

TaskFlow uses two distinct roles to ensure data security and operational efficiency:

### 1. Admin (Administrator)
- **Full Control**: Can create, edit, and delete Projects and Teams.
- **Task Management**: Can create and assign tasks to any individual or any team.
- **Visibility**: Can see all tasks across all projects and monitor performance stats for every member.
- **User Management**: Exclusive access to the user list for project/team assignments.

### 2. Member (Team Member)
- **Restricted Access**: Cannot create projects or teams.
- **Personal View**: Can only see tasks assigned directly to them or to a team they belong to.
- **Task Updates**: Can update the status (Todo → In Progress → Completed) of tasks assigned to them.
- **Project Visibility**: Can view project details for projects they are a member of.

---

## 🛠 Working Flow

### 1. Onboarding
- **Signup**: Users create an account and select a role (Admin or Member).
- **Login**: Users authenticate to receive a JWT, which is used for all subsequent API requests.

### 2. Project & Team Setup (Admin Only)
- **Create Project**: Admin creates a project and selects which members belong to it.
- **Create Team**: Admin groups members into specific teams (e.g., "Design", "Devs"). This allows for bulk task assignment.

### 3. Task Lifecycle
- **Creation**: Admin creates a task, selects a project, and chooses an **Assignment Type** (Individual or Team).
- **Assignment**:
  - **Individual**: Assigned to a specific person within the project.
  - **Team**: Assigned to an entire group. All members of that team will see the task.
- **Execution**: Members log in, see their tasks on the Dashboard/Tasks page, and update the status as they work.
- **Completion**: Once a task is marked "Completed", it is reflected in the Project Progress and Admin Performance stats.

### 4. Performance Tracking (Admin Only)
- Admins visit the **Team** page to see a real-time "Member Performance" table.
- This shows the total tasks, completion count, and a visual progress bar for every member in the organization.

---

## 📂 Project Structure

```text
TaskFlow/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI (Layout, etc.)
│   │   ├── context/       # Auth state management
│   │   ├── pages/         # Dashboard, Projects, Tasks, Team, etc.
│   │   └── index.css      # Tailwind v4 configuration
├── server/                # Node.js Backend
│   ├── controllers/       # API Logic (Auth, Projects, Tasks, Teams)
│   ├── models/            # Mongoose Schemas (User, Project, Task, Team)
│   ├── routes/            # Express Route definitions
│   └── server.js          # Main entry point
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Authenticate user |
| GET | `/api/auth/users` | Admin | Get all registered users |
| GET | `/api/auth/member-stats`| Admin | Get performance data for all members |
| GET | `/api/projects` | Auth | Get projects relevant to user |
| POST | `/api/projects` | Admin | Create a new project |
| GET | `/api/tasks` | Auth | Get tasks assigned to user/team |
| POST | `/api/tasks` | Admin | Create and assign a new task |
| GET | `/api/teams` | Auth | View existing teams |
| POST | `/api/teams` | Admin | Create a new team with members |

---

## ⚙️ Setup & Installation

1. **Prerequisites**: Node.js and npm installed.
2. **Backend**:
   - `cd server`
   - `npm install`
   - Configure `.env` with your `MONGO_URI` and `JWT_SECRET`.
   - `npm run dev`
3. **Frontend**:
   - `cd client`
   - `npm install`
   - Configure `.env` with `VITE_API_URL`.
   - `npm run dev`
