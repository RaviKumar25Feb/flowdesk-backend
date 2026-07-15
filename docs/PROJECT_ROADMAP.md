# FlowDesk Backend Roadmap

> **Project:** FlowDesk - Project Management System
> **Version:** 1.0 MVP
> **Last Updated:** 16 July 2026

---

# Project Vision

Build a scalable, secure and production-ready Project Management System where a **Manager** can manage Developers, Clients, Projects and Tasks while providing separate dashboards for each role.

---

# Development Roadmap

---

# Phase 1 — Foundation ✅

## Authentication

- [x] Manager Login
- [x] Logout
- [x] JWT Authentication
- [x] Forgot Password
- [x] Reset Password
- [x] Change Password

### Business Rules

- Public registration is **not supported**.
- OTP verification is **not required**.
- Manager account is pre-created.
- Manager creates all Developer and Client accounts.

---

## User Management

- [x] Create Developer
- [x] Create Client
- [x] Get All Users
- [x] Get User Details
- [x] Update User
- [x] Deactivate User (Soft Delete)

### Business Rules

- Only Manager can manage users.
- Random password is generated automatically.
- Login credentials are emailed to the user.
- User accounts are never permanently deleted.

---

## Profile

- [x] Get Profile
- [x] Update Profile
- [x] Update Avatar

### Business Rules

- Every user has one profile.
- Profile cannot be deleted.
- Account deactivation is handled by the Manager.

---

# Phase 2 — Project Management ✅

## Projects

- [x] Create Project
- [x] Get All Projects
- [x] Get Project Details
- [x] Update Project
- [x] Archive Project

---

## Team Management

- [x] Assign Developers
- [x] Get Assigned Developers
- [x] Remove Developer

---

# Phase 3 — Task Management ✅

## Features

- [x] Create Task
- [x] Get Project Tasks
- [x] Get Task Details
- [x] Update Task
- [x] Delete Task
- [x] Update Task Status
- [x] Get My Tasks

### Business Rules

- Manager creates tasks.
- Task belongs to one project.
- Task is assigned to one developer.
- One developer can have multiple tasks.
- Developer must already belong to the project.
- Developer can update only task status.
- Clients have read-only access (future).

---

# Phase 4 — Dashboard

**Status:** 🔄 Next Module

## Manager Dashboard

- [ ] Total Projects
- [ ] Active Projects
- [ ] Archived Projects
- [ ] Total Developers
- [ ] Total Clients
- [ ] Total Tasks
- [ ] Pending Tasks
- [ ] Completed Tasks
- [ ] Overdue Tasks
- [ ] Recent Activity

---

## Developer Dashboard

- [ ] Assigned Tasks
- [ ] Completed Tasks
- [ ] Pending Tasks
- [ ] Overdue Tasks
- [ ] Upcoming Deadlines

---

## Client Dashboard

- [ ] Total Projects
- [ ] Project Progress
- [ ] Project Timeline
- [ ] Completed Tasks
- [ ] Pending Tasks

---

# Phase 5 — Comments

**Status:** ⏳ Planned

## Features

- [ ] Add Comment
- [ ] Edit Comment
- [ ] Delete Comment
- [ ] Get Comments

---

# Phase 6 — Documents

**Status:** ⏳ Planned

## Features

- [ ] Upload Document
- [ ] Download Document
- [ ] Delete Document
- [ ] Get Documents

---

# Phase 7 — Notifications

**Status:** Future

## Features

- [ ] Task Assigned
- [ ] Task Completed
- [ ] Account Created
- [ ] Account Deactivated
- [ ] New Comment
- [ ] Deadline Reminder

---

# Phase 8 — Activity Logs

**Status:** Future

## Track Events

- [ ] Login
- [ ] User Created
- [ ] User Updated
- [ ] User Deactivated
- [ ] Project Created
- [ ] Project Updated
- [ ] Developer Assigned
- [ ] Task Created
- [ ] Task Updated
- [ ] Task Completed

---

# Database Collections

## Implemented

- [x] users
- [x] profiles
- [x] projects
- [x] tasks

---

## Planned

- [ ] comments
- [ ] documents
- [ ] notifications
- [ ] activitylogs

---

# System Workflow

```text
Manager (Pre-created)
        │
        ▼
Login
        │
        ▼
Create Client
        │
        ▼
Create Developer
        │
        ▼
Automatic Password Generation
        │
        ▼
Credentials Sent via Email
        │
        ▼
Developer / Client Login
        │
        ▼
Update Profile
        │
        ▼
Create Project
        │
        ▼
Assign Developers
        │
        ▼
Create Tasks
        │
        ▼
Developer Updates Task Status
        │
        ▼
Dashboard & Reports
```

---

# Overall Progress

```text
Authentication      ██████████ 100%

User Management     ██████████ 100%

Profile             ██████████ 100%

Projects            ██████████ 100%

Team                ██████████ 100%

Tasks               ██████████ 100%

Dashboard           ░░░░░░░░░░   0%

Comments            ░░░░░░░░░░   0%

Documents           ░░░░░░░░░░   0%

Notifications       ░░░░░░░░░░ Future

Activity Logs       ░░░░░░░░░░ Future
```

---

# Current Milestone

- ✅ Authentication
- ✅ User Management
- ✅ Profile Management
- ✅ Project Management
- ✅ Team Management
- ✅ Task Management

---

# Next Milestone

## Dashboard Module

1. Manager Dashboard APIs
2. Developer Dashboard APIs
3. Client Dashboard APIs
4. Dashboard Statistics
5. Charts & Analytics
6. Recent Activities
7. Testing
8. Documentation

---

# Final Goal

A complete production-ready Project Management Backend featuring:

- JWT Authentication
- Role-Based Authorization
- User Management
- Profile Management
- Project Management
- Team Management
- Task Management
- Dashboard Analytics
- Comments
- Document Management
- Notifications
- Activity Logs

### Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Express Validator
- Cloudinary
