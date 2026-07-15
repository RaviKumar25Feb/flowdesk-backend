# Database Schema

This document describes the MongoDB database design used in the FlowDesk Backend.

---

# Database

**MongoDB**

---

# Collections

- Users
- Profiles
- Projects
- Tasks

> **Note:** The OTP collection has been removed because public signup is not supported. Manager creates all Developer and Client accounts directly.

---

# Entity Relationship

```text
                    Manager (User)
                          │
                          │ Creates
                          ▼
                     Developer (User)
                          │
                          └────────────┐
                                       │
                    Client (User)      │
                         ▲             │
                         │             │
                         └──── Project ◄──────────────┐
                               │                      │
                               │                      │
                     Developers[]                     │
                               │                      │
                               ▼                      │
                             Task ────────────────────┘
                               │
                               ▼
                         Assigned Developer
```

---

# Collection Overview

## Users

Stores authentication and role information.

```text
name
email
password
role
profile (ObjectId -> Profile)
resetPasswordToken
resetPasswordExpires
isActive
createdAt
updatedAt
```

### Roles

```text
MANAGER
DEVELOPER
CLIENT
```

---

## Profiles

Stores personal information of every user.

```text
user (ObjectId -> User)

avatar
avatarPublicId

phone
bio

dateOfBirth
gender

address
city
state
country
pincode

github
linkedin
portfolio

designation
department

skills[]

createdAt
updatedAt
```

---

## Projects

Stores project information managed by the Manager.

```text
name
description

manager (ObjectId -> User)

client (ObjectId -> User)

developers[]

status
priority

startDate
deadline

completedAt

isArchived

createdAt
updatedAt
```

### Relationships

```text
One Manager
        │
        └── Many Projects

One Client
        │
        └── Many Projects

One Project
        │
        └── Many Developers
```

---

## Tasks

Stores project tasks assigned to Developers.

```text
title
description

project (ObjectId -> Project)

assignedTo (ObjectId -> User)

createdBy (ObjectId -> User)

priority
status

startDate
dueDate

estimatedHours
actualHours

completedAt

createdAt
updatedAt
```

### Relationships

```text
One Project
      │
      └── Many Tasks

One Developer
      │
      └── Many Tasks
```

---

# Collection Relationships

```text
User
 │
 ├── One Profile
 │
 ├── Can Manage Many Projects (Manager)
 │
 ├── Can Own Many Projects (Client)
 │
 └── Can Be Assigned Many Tasks (Developer)

Project
 │
 ├── One Manager
 ├── One Client
 ├── Many Developers
 └── Many Tasks

Task
 │
 ├── One Project
 ├── One Assigned Developer
 └── One Created By (Manager)
```

---

# Current Database Status

| Collection    | Status         |
| ------------- | -------------- |
| Users         | ✅ Implemented |
| Profiles      | ✅ Implemented |
| Projects      | ✅ Implemented |
| Tasks         | ✅ Implemented |
| Comments      | ⏳ Planned     |
| Notifications | ⏳ Planned     |
| Activity Logs | ⏳ Planned     |
