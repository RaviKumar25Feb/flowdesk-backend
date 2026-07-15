# FlowDesk Backend API Documentation

> **Version:** v1.0 MVP
> **Last Updated:** 16 July 2026

---

# Base URL

```text
/api
```

---

# Authentication

| Method | Endpoint                    | Access        | Description     |
| ------ | --------------------------- | ------------- | --------------- |
| POST   | `/api/auth/login`           | Public        | Login           |
| POST   | `/api/auth/logout`          | Authenticated | Logout          |
| POST   | `/api/auth/forgot-password` | Public        | Forgot Password |
| POST   | `/api/auth/reset-password`  | Public        | Reset Password  |
| PATCH  | `/api/auth/change-password` | Authenticated | Change Password |

> **Note**
>
> Public Signup and OTP verification are **not supported**.
>
> All Developer and Client accounts are created only by the Manager.

---

# Users

| Method | Endpoint             | Access  | Description                   |
| ------ | -------------------- | ------- | ----------------------------- |
| POST   | `/api/users`         | Manager | Create Developer / Client     |
| GET    | `/api/users`         | Manager | Get All Users                 |
| GET    | `/api/users/:userId` | Manager | Get User Details              |
| PUT    | `/api/users/:userId` | Manager | Update User                   |
| DELETE | `/api/users/:userId` | Manager | Deactivate User (Soft Delete) |

### Business Rules

- Only Manager can manage users.
- Only Developer and Client accounts can be created.
- Random password is generated automatically.
- Login credentials are sent via email.
- User can change password after login.
- DELETE only deactivates the account (`isActive = false`).

---

# Profile

| Method | Endpoint              | Access        | Description     |
| ------ | --------------------- | ------------- | --------------- |
| GET    | `/api/profile`        | Authenticated | Get Own Profile |
| PUT    | `/api/profile`        | Authenticated | Update Profile  |
| PATCH  | `/api/profile/avatar` | Authenticated | Update Avatar   |

### Business Rules

- Every User has one Profile.
- Profile cannot be deleted.
- Account deactivation is handled by the Manager.

---

# Projects

| Method | Endpoint                   | Access  | Description         |
| ------ | -------------------------- | ------- | ------------------- |
| POST   | `/api/projects`            | Manager | Create Project      |
| GET    | `/api/projects`            | Manager | Get All Projects    |
| GET    | `/api/projects/:projectId` | Manager | Get Project Details |
| PUT    | `/api/projects/:projectId` | Manager | Update Project      |
| DELETE | `/api/projects/:projectId` | Manager | Archive Project     |

### Business Rules

- Only Manager can create projects.
- Manager is taken from authenticated user.
- One Client can have multiple projects.
- Duplicate project names are not allowed for the same client.
- Deadline must be greater than Start Date.

---

# Team

| Method | Endpoint                                       | Access  | Description             |
| ------ | ---------------------------------------------- | ------- | ----------------------- |
| PATCH  | `/api/team/assign`                             | Manager | Assign Developers       |
| GET    | `/api/team/:projectId/developers`              | Manager | Get Assigned Developers |
| DELETE | `/api/team/:projectId/developers/:developerId` | Manager | Remove Developer        |

### Business Rules

- Project must belong to logged-in Manager.
- Only Developers can be assigned.
- Duplicate assignments are ignored.

---

# Tasks

| Method | Endpoint                        | Access                       | Description        |
| ------ | ------------------------------- | ---------------------------- | ------------------ |
| POST   | `/api/tasks`                    | Manager                      | Create Task        |
| GET    | `/api/tasks/project/:projectId` | Manager                      | Get Project Tasks  |
| GET    | `/api/tasks/:taskId`            | Manager + Assigned Developer | Get Task Details   |
| PUT    | `/api/tasks/:taskId`            | Manager                      | Update Task        |
| DELETE | `/api/tasks/:taskId`            | Manager                      | Delete Task        |
| PATCH  | `/api/tasks/:taskId/status`     | Assigned Developer           | Update Task Status |
| GET    | `/api/tasks/my-tasks`           | Developer                    | Get Assigned Tasks |

### Business Rules

- Task belongs to one Project.
- Task is assigned to one Developer.
- One Developer can have multiple Tasks.
- Developer can update only the status of assigned tasks.
- Manager has full control over task management.

---

# Current Business Workflow

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
```

---

# Modules Completed

- ✅ Authentication
- ✅ User Management
- ✅ Profile Management
- ✅ Project Management
- ✅ Team Management
- ✅ Task Management

---

# Upcoming Modules

- Dashboard
- Comments
- Activity Logs
- Notifications
- File/Documents
- Reports & Analytics
