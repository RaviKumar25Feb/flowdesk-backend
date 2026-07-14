# FlowDesk Backend API Documentation

> Version: v1 (Current Progress) Last Updated: 14 July 2026

## Base URL

``` text
/api
```

## Authentication

  -----------------------------------------------------------------------------------
  Method            Endpoint                      Access            Description
  ----------------- ----------------------------- ----------------- -----------------
  POST              `/api/auth/send-otp`          Public            Send OTP

  POST              `/api/auth/signup`            Manager           Create Developer
                                                                    / Client

  POST              `/api/auth/login`             Public            Login

  POST              `/api/auth/logout`            Authenticated     Logout

  POST              `/api/auth/forgot-password`   Public            Forgot Password

  POST              `/api/auth/reset-password`    Public            Reset Password

  PATCH             `/api/auth/change-password`   Authenticated     Change Password
  -----------------------------------------------------------------------------------

## Profile

  Method   Endpoint                Access          Description
  -------- ----------------------- --------------- ----------------
  GET      `/api/profile`          Authenticated   Get Profile
  PUT      `/api/profile`          Authenticated   Update Profile
  PATCH    `/api/profile/avatar`   Authenticated   Update Avatar
  DELETE   `/api/profile`          Authenticated   Delete Account

## Projects

  Method   Endpoint              Access    Description
  -------- --------------------- --------- ---------------------
  POST     `/api/projects`       Manager   Create Project
  GET      `/api/projects`       Manager   Get All Projects
  GET      `/api/projects/:id`   Manager   Get Project Details
  PUT      `/api/projects/:id`   Manager   Update Project
  DELETE   `/api/projects/:id`   Manager   Soft Delete Project

### POST /api/projects

**Access:** Manager

#### Request

``` json
{
  "name": "FlowDesk CRM",
  "description": "CRM Development",
  "client": "<clientId>",
  "priority": "HIGH",
  "startDate": "2026-07-20",
  "deadline": "2026-09-30"
}
```

#### Success Response

``` json
{
  "success": true,
  "message": "Project created successfully.",
  "data": {}
}
```

#### Business Rules

-   Only Manager can create projects.
-   Manager is taken from authenticated user.
-   One client can have multiple projects.
-   Duplicate project names are not allowed for the same client.
-   Deadline must be after Start Date.

## Team

  ------------------------------------------------------------------------------------------------------
  Method            Endpoint                                         Access            Description
  ----------------- ------------------------------------------------ ----------------- -----------------
  PATCH             `/api/team/assign`                               Manager           Assign Developers

  GET               `/api/team/:projectId/developers`                Manager           Get Assigned
                                                                                       Developers

  DELETE            `/api/team/:projectId/developers/:developerId`   Manager           Remove Developer
  ------------------------------------------------------------------------------------------------------

### PATCH /api/team/assign

#### Request

``` json
{
  "projectId": "<projectId>",
  "developers": [
    "<developerId1>",
    "<developerId2>"
  ]
}
```

#### Success Response

``` json
{
  "success": true,
  "message": "Developers assigned successfully.",
  "data": {}
}
```

#### Business Rules

-   Project must exist.
-   Project must belong to logged-in Manager.
-   Users must have DEVELOPER role.
-   Duplicate assignments are ignored using `$addToSet`.

### GET /api/team/:projectId/developers

Returns all developers assigned to a project.

### DELETE /api/team/:projectId/developers/:developerId

Removes a developer from the project team.

## Current Workflow

``` text
Manager Login
    ↓
Create Client
    ↓
Create Developer
    ↓
Create Project
    ↓
Assign Developers
    ↓
Create Tasks (Next Module)
```

## Next Module

-   Tasks
-   Comments
-   Documents
-   Dashboard
-   Notifications (Future)
-   Activity Logs (Future)
