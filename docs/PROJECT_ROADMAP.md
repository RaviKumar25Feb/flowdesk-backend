# FlowDesk Backend Roadmap

> Project: FlowDesk - Project Management System
>
> Version: 1.0
>
> Last Updated: 14 July 2026

---

# Project Vision

Build a scalable Project Management System where Managers can manage Clients, Developers, Projects, Tasks, Documents and Project Communication.

The architecture should be modular, scalable and production-ready.

---

# Development Roadmap

## Phase 1 — Foundation ✅

### Authentication

* [x] User Registration
* [x] Login
* [x] Logout
* [x] JWT Authentication
* [x] OTP Verification
* [x] Forgot Password
* [x] Reset Password
* [x] Change Password

---

### Profile

* [x] Get Profile
* [x] Update Profile
* [x] Update Avatar
* [x] Delete Account

---

## Phase 2 — Project Management ✅

### Projects

* [x] Create Project
* [x] Get All Projects
* [x] Get Project Details
* [x] Update Project
* [x] Soft Delete Project

---

### Team Management

* [x] Assign Developers
* [x] Get Assigned Developers
* [x] Remove Developer

---

# Phase 3 — Task Management (Next)

Status: 🔄 Next Module

---

## Features

* [ ] Create Task
* [ ] Get All Tasks
* [ ] Get Project Tasks
* [ ] Get Task Details
* [ ] Update Task
* [ ] Delete Task
* [ ] Change Task Status
* [ ] Assign Task
* [ ] Reassign Task
* [ ] Task Priority
* [ ] Due Date
* [ ] Estimated Hours
* [ ] Attachments (Future)

---

## Business Rules

* Manager creates tasks.
* Every task belongs to one project.
* Every task belongs to one developer.
* Developer must already be assigned to the project.
* Developers update only their own tasks.
* Clients cannot modify tasks.

---

# Phase 4 — Comments

Status: ⏳ Pending

---

## Features

* [ ] Add Comment
* [ ] Edit Comment
* [ ] Delete Comment
* [ ] Get Comments
* [ ] Mention Users (Future)

---

## Business Rules

* Manager can comment.
* Developers can comment.
* Client can comment.
* Comments belong to Tasks.

---

# Phase 5 — Documents

Status: ⏳ Pending

---

## Features

* [ ] Upload Document
* [ ] Download Document
* [ ] Delete Document
* [ ] List Documents

---

## Business Rules

* Manager uploads documents.
* Developers download documents.
* Client can view/download project documents.
* Documents belong to Projects.

---

# Phase 6 — Dashboard

Status: ⏳ Pending

---

## Manager Dashboard

* [ ] Total Projects
* [ ] Active Projects
* [ ] Completed Projects
* [ ] Total Developers
* [ ] Pending Tasks
* [ ] Overdue Tasks
* [ ] Recent Activity

---

## Developer Dashboard

* [ ] Assigned Tasks
* [ ] Completed Tasks
* [ ] Pending Tasks
* [ ] Today's Tasks
* [ ] Upcoming Deadlines

---

## Client Dashboard

* [ ] Project Progress
* [ ] Timeline
* [ ] Completed Milestones
* [ ] Documents
* [ ] Comments

---

# Phase 7 — Notifications

Status: Future

---

## Features

* [ ] Task Assigned
* [ ] Task Completed
* [ ] New Comment
* [ ] Deadline Reminder
* [ ] Project Completed

---

# Phase 8 — Activity Logs

Status: Future

---

## Track Everything

* [ ] User Login
* [ ] Project Created
* [ ] Project Updated
* [ ] Developer Assigned
* [ ] Task Created
* [ ] Task Updated
* [ ] Task Completed
* [ ] Document Uploaded
* [ ] Comment Added

---

# Database Collections

## Current

* [x] users
* [x] profiles
* [x] otp
* [x] projects

---

## Upcoming

* [ ] tasks
* [ ] comments
* [ ] documents
* [ ] notifications
* [ ] activitylogs

---

# Entity Relationship

```text
Manager
    │
    ├──────────────┐
    │              │
Creates        Creates Users
Projects       (Developer / Client)
    │
    ▼
Project
    │
    ├──────────────► Client
    │
    ├──────────────► Developers[]
    │
    ├──────────────► Tasks
    │
    ├──────────────► Documents
    │
    └──────────────► Activity Logs
                     │
                     ▼
                 Comments
```

---

# Overall Progress

```text
Authentication      ██████████ 100%

Profile             ██████████ 100%

Projects            ██████████ 100%

Team                ██████████ 100%

Tasks               ░░░░░░░░░░   0%

Comments            ░░░░░░░░░░   0%

Documents           ░░░░░░░░░░   0%

Dashboard           ░░░░░░░░░░   0%

Notifications       ░░░░░░░░░░ Future

Activity Logs       ░░░░░░░░░░ Future
```

---

# Current Milestone

✅ Authentication Complete

✅ Profile Complete

✅ Projects Complete

✅ Team Management Complete

---

# Next Milestone

Task Management

1. Task Business Discussion
2. Task Constants
3. Task Model
4. Task Validation
5. Create Task API
6. Get All Tasks
7. Get Task Details
8. Update Task
9. Delete Task
10. Testing
11. Update Documentation

---

# Final Goal

A complete production-ready Project Management Backend with:

* JWT Authentication
* Role-Based Authorization
* Project Management
* Team Management
* Task Management
* Document Management
* Real-time Progress Tracking
* Dashboard Analytics
* Notification System
* Activity Logs

Built using:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Express Validator
* Cloudinary
