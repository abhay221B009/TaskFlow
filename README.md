# TaskFlow

TaskFlow is a premium, full-stack Team Task Manager built with React, Express, and MongoDB.

## 🚀 Quick Start

1. **Setup MongoDB Atlas**: Whitelist your IP and get your connection string.
2. **Server Setup**:
   ```bash
   cd server
   npm install
   # Configure .env with MONGO_URI, JWT_SECRET, and PORT
   npm run dev
   ```
3. **Client Setup**:
   ```bash
   cd client
   npm install
   # Configure .env with VITE_API_URL
   npm run dev
   ```

## 📖 Documentation

For detailed information on the tech stack, RBAC system, and full working flows, please refer to the **[DOCUMENTATION.md](./DOCUMENTATION.md)** file in the root directory.

## ✨ Features

- **Modern Dashboard**: Visual task overview with Recharts.
- **Project Management**: Multi-member projects with progress tracking.
- **Team System**: Group users into teams for bulk task assignments.
- **Member Performance**: Admin view for tracking individual task completion rates.
- **RBAC**: Secure Admin and Member roles via JWT.
- **Tailwind CSS v4**: High-performance, modern styling.
