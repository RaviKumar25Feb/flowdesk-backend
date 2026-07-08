# Database Schema

This document contains the database design for the FlowDesk Backend.

---

## Database

MongoDB

---

## Collections

- Users
- Projects
- Tasks
- Comments

---

## Relationships

```
User
│
├── Manager
├── Developer
└── Client

Manager
│
└── Creates
      │
      ▼
   Project
      │
      ├── Developers
      ├── Client
      └── Tasks
                │
                ▼
             Comment
```

---

## Planned Schemas

### User

```
name
email
password
role
avatar
timestamps
```

---

### Project

```
title
description
manager
client
developers[]
status
startDate
deadline
timestamps
```

---

### Task

```
title
description
project
assignedTo
priority
status
deadline
timestamps
```

---

### Comment

```
task
user
message
timestamps
```

---

Detailed schema definitions will be added during implementation.
