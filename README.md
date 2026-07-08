# FlowDesk Backend

A production-style Project Management System backend built with **Node.js**, **Express.js**, and **MongoDB**. The system is designed to manage software development projects by providing authentication, project management, task assignment, progress tracking, and role-based access control.

---

## 🚀 Features

- JWT Authentication
- Role-Based Authorization
- Project Management
- Task Management
- Team Assignment
- Comments & Activity Logs
- Client Dashboard
- Developer Dashboard
- Manager Dashboard
- RESTful API Architecture

---

## 👥 Roles

- Manager
- Developer
- Client

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- bcrypt

### Other Packages

- dotenv
- cors
- cookie-parser
- nodemon

---

## 📁 Project Structure

```
flowdesk-server/
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEVELOPMENT_LOG.md
│   └── PROJECT_ROADMAP.md
│
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validations/
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Installation

```bash
git clone <repository-url>

cd flowdesk-server

npm install
```

---

## 🔑 Environment Variables

Create a `.env` file.

```env
PORT=4000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

NODE_ENV=development
```

---

## ▶️ Run the Project

```bash
npm run dev
```

Server will run on:

```
http://localhost:4000
```

---

## 🏗️ Architecture

```
Client
   │
Routes
   │
Controllers
   │
Services
   │
Models
   │
MongoDB
```

---

## 📄 License

This project is developed for learning, portfolio, and production practice purposes.
