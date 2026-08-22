<div align="center">

# Dayflow HRMS

**A modern Human Resource Management System for streamlined employee operations**

Employee lifecycle management · Attendance · Leave · Assignments · Communication · Role-based access

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-informational)](#license)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](#roadmap)

[Overview](#overview) · [Features](#key-features) · [Architecture](#architecture) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Project Structure](#project-structure) · [Roadmap](#roadmap)

</div>

---

## Overview

**Dayflow HRMS** is a full-stack Human Resource Management System built to simplify and centralize everyday HR and employee operations. It provides two dedicated portals — one for **Employees** and one for **HR Managers** — with strict role-based access control, so each user only ever sees the features relevant to their role.

The system pairs a web-based frontend with a **Python FastAPI** backend and a **database-driven** employee management core, designed for reliability, clarity, and a clean day-to-day experience.

| | |
|---|---|
| **Frontend** | Web-based, responsive UI |
| **Backend** | Python · FastAPI |
| **Data layer** | Database-driven employee management |
| **Access model** | Role-based (Employee / HR) |

---

## Key Features

### 🔐 Authentication & Security

- Employee and HR login
- Role-based authentication
- Password hashing and verification
- Temporary password support
- Session management
- Protected, role-based functionality
- Password change support

### 👤 Employee Portal

| Module | Description |
|---|---|
| Employee Dashboard | At-a-glance summary of personal work data |
| Personal Profile | View and manage personal details |
| Work History | Track employment and role history |
| Attendance | Log and review attendance records |
| Leave Management | Request and track leave |
| Work Mail | Internal messaging |
| Assignments | View and manage assigned tasks |

### 🧑‍💼 HR Portal

| Module | Description |
|---|---|
| HR Dashboard | Organization-wide overview |
| HR Profile | HR manager's own profile |
| Employee Directory | Browse all employees |
| Employee Details | Deep-dive into individual records |
| Assignment Management | Create and assign work |
| Work Mail Management | Oversee internal communication |
| Leave Requests | Review and approve/reject leave |
| Permission Mail | Manage permission-based requests |
| Reports & Analytics | Organizational insights and metrics |
| System Settings | Configure system-wide behavior |

---

## Architecture

Dayflow HRMS separates Employee and HR functionality behind a shared authentication and role-based access control (RBAC) layer. Each portal only exposes the modules relevant to its role.

```
                              Dayflow HRMS
                        (Auth + Role-Based Access)
                                   │
                 ┌─────────────────┴─────────────────┐
                 │                                    │
            EMPLOYEE PORTAL                       HR PORTAL
                 │                                    │
     ┌───────────┼───────────┐          ┌─────────────┼─────────────┐
     │           │           │          │             │             │
 Dashboard    Profile   Work History  Dashboard    Directory   Assignments
 Attendance   Leave     Work Mail     Leave Req.   Reports     Settings
 Assignments                          Permission Mail
```

**Design principles**

- **Least privilege** — Employees and HR managers only ever see what their role permits.
- **Single source of truth** — one authentication layer governs access to both portals.
- **Separation of concerns** — Employee and HR feature sets are fully decoupled on the frontend and enforced independently on the backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | FastAPI (Python) |
| Database | Relational, ORM-managed |
| Auth | Hashed passwords, session/token-based auth |
| Frontend | Web-based UI |
| Access control | Role-based (RBAC) |

---

## Getting Started

### Prerequisites

- Python 3.11+
- A running relational database instance
- `pip` / a virtual environment tool

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/dayflow-hrms.git
cd dayflow-hrms

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env          # then fill in DB credentials, JWT secret, etc.

# 5. Run database migrations
alembic upgrade head

# 6. Start the backend server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

---

## Project Structure

```
dayflow-hrms/
├── backend/
│   ├── app/
│   │   ├── models/           # Database models
│   │   ├── routers/          # API route handlers (auth, employee, hr)
│   │   ├── schemas/          # Request/response validation
│   │   ├── services/         # Business logic
│   │   ├── core/             # Config, security, dependencies
│   │   └── main.py           # App entry point
│   ├── alembic/               # Database migrations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── employee/     # Employee portal pages
│   │   │   └── hr/           # HR portal pages
│   │   ├── components/       # Shared UI components
│   │   └── services/         # API client layer
│   └── package.json
└── README.md
```

---

## Roadmap

- [ ] Employee & HR authentication flows
- [ ] Role-based route protection
- [ ] Attendance & leave modules
- [ ] Assignment management
- [ ] Work mail & permission mail
- [ ] Reports & analytics dashboard
- [ ] System settings panel

---

## License

This project is licensed under the MIT License.