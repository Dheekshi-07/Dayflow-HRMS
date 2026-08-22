<div align="center">

# ⚙️ Dayflow HRMS — Backend

**Backend API and database layer developed for the Dayflow HRMS platform.**

![FastAPI](https://img.shields.io/badge/Framework-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Language-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-D71F00?style=flat-square)
![Uvicorn](https://img.shields.io/badge/Server-Uvicorn-2A2A2A?style=flat-square)

</div>

---

## 📖 1. Overview

This module contains the **FastAPI backend and PostgreSQL database integration** for Dayflow HRMS. It provides REST APIs for **employee management, attendance, payroll, leave management, and document management**, backed by SQLAlchemy models and Pydantic schemas.

---

## 👤 2. My Contribution

> This README documents **only my contribution** to the Dayflow HRMS project.

| Area | Description |
|---|---|
| FastAPI Application | Core application setup and configuration |
| API Endpoints | REST endpoints for employees, attendance, payroll, leave, and documents |
| Database Models | SQLAlchemy models for all backend entities |
| Database Connection | PostgreSQL connection and session management |
| Business Logic | Backend validation and processing logic |
| Pydantic Schemas | Request/response validation schemas |
| Swagger/OpenAPI Documentation | Auto-generated API documentation |

> **Note:** Authentication/login and role-based access control are handled by another team member. See [Team Responsibility Note](#-18-team-responsibility-note) below.

---

## 🧰 3. Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| FastAPI | Backend web framework |
| PostgreSQL | Relational database |
| SQLAlchemy | ORM for database models and queries |
| Pydantic | Data validation and serialization |
| Uvicorn | ASGI server |
| Swagger/OpenAPI | Auto-generated interactive API documentation |

---

## 🗂️ 4. Project Structure

```text
backend/
├── app/
│   ├── core/
│   ├── database/
│   │   └── connection.py
│   ├── models/
│   │   ├── employee_profile.py
│   │   ├── attendance.py
│   │   ├── payroll.py
│   │   ├── leave_request.py
│   │   ├── leave_type.py
│   │   └── document.py
│   ├── routers/
│   │   ├── employees.py
│   │   ├── attendance.py
│   │   ├── payroll.py
│   │   ├── leave.py
│   │   └── documents.py
│   ├── schemas/
│   │   ├── employee.py
│   │   ├── attendance.py
│   │   ├── payroll.py
│   │   ├── leave.py
│   │   └── document.py
│   ├── services/
│   └── main.py
├── .gitignore
└── README.md
```

---

## 🔌 5. API Modules

### 👥 Employee Management

Handles employee record creation, retrieval, updates, and deletion.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/employees/` | Create a new employee profile |
| `GET` | `/api/employees/` | Retrieve all employee profiles |
| `GET` | `/api/employees/{employee_id}` | Retrieve a single employee by ID |
| `PUT` | `/api/employees/{employee_id}` | Update an employee's profile |
| `DELETE` | `/api/employees/{employee_id}` | Delete an employee profile |

### ⏰ Attendance

Handles daily check-in and check-out records.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/attendance/check-in/{employee_id}` | Mark employee check-in |
| `PUT` | `/api/attendance/check-out/{employee_id}` | Mark employee check-out |
| `GET` | `/api/attendance/{employee_id}` | Retrieve attendance records for an employee |

### 💰 Payroll

Handles salary computation and payroll records.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payroll/` | Create a payroll record |
| `GET` | `/api/payroll/employee/{employee_id}` | Retrieve payroll records for an employee |
| `PUT` | `/api/payroll/employee/{employee_id}` | Update a payroll record for an employee |

### 🌴 Leave

Handles leave types and leave request lifecycle.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leave/types` | Retrieve available leave types |
| `POST` | `/api/leave/` | Submit a new leave request |
| `GET` | `/api/leave/employee/{employee_id}` | Retrieve leave requests for an employee |
| `GET` | `/api/leave/all` | Retrieve all leave requests |
| `PUT` | `/api/leave/{leave_id}/approve` | Approve a leave request |
| `PUT` | `/api/leave/{leave_id}/reject` | Reject a leave request |

### 📄 Documents

Handles employee document metadata.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/documents/` | Upload document metadata for an employee |
| `GET` | `/api/documents/employee/{employee_id}` | Retrieve documents for an employee |

---

## ⏳ 6. Attendance Flow

```text
Employee → Check In → Attendance Record → Present → Check Out
```

The backend validates:
- **Duplicate check-in** — an employee cannot check in twice on the same day
- **Missing check-in** — an employee cannot check out without a prior check-in
- **Duplicate check-out** — an employee cannot check out twice on the same day

---

## 💵 7. Payroll Management

Payroll records store: wage, basic salary, allowances, deductions, PF, professional tax, working days, payable days, and net salary.

**Implemented formula:**

```text
Net Salary = Basic Salary + Allowances - Deductions
```

---

## 🌿 8. Leave Management

The backend manages leave types, leave requests, and their approval lifecycle (**Pending / Approved / Rejected**), with validation for:
- Date validation (start/end date correctness)
- Employee validation (leave request tied to a valid employee)
- Leave type validation (leave request tied to a valid leave type)
- Overlapping leave validation (prevents duplicate/overlapping leave periods)

```text
Employee → Apply Leave → Pending → Approved/Rejected
```

---

## 📁 9. Document Management

The backend stores employee document **metadata**, including document name, document URL, employee reference, and upload timestamp.

---

## 🧱 10. Database Models

| Model | Table |
|---|---|
| `EmployeeProfile` | `employee_profiles` |
| `Attendance` | `attendance` |
| `Payroll` | `payroll` |
| `LeaveType` | `leave_types` |
| `LeaveRequest` | `leave_requests` |
| `Document` | `documents` |

---

## 🔗 11. Database Relationships

```text
employee_profiles
  ├── attendance
  ├── payroll
  ├── documents
  └── leave_requests
          └── leave_types
```

---

## 🛢️ 12. Database Connection

SQLAlchemy is used to connect FastAPI to PostgreSQL. `app/database/connection.py` manages the **engine**, **Base**, and **database sessions** used across the application.

---

## 🧾 13. Pydantic Schemas

Request and response schemas validate API input and structure API output, ensuring consistent and predictable data contracts across all endpoints.

---

## 🏗️ 14. Backend Architecture

```text
React Frontend
      ↓
FastAPI Routers
      ↓
Pydantic Schemas
      ↓
Business Logic
      ↓
SQLAlchemy Models
      ↓
PostgreSQL
```

---

## 📚 15. API Documentation

FastAPI automatically provides interactive Swagger/OpenAPI documentation at:

```text
http://127.0.0.1:8000/docs
```

A health check endpoint is also available:

```text
GET /api/health
```

**Expected response:**

```json
{
  "status": "healthy"
}
```

---

## ▶️ 16. Running the Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

> ⚠️ PostgreSQL must be running, and the database environment variables must be configured before starting the server.

---

## ✅ 17. Implementation Status

| Component | Status |
|---|---|
| FastAPI application | ✅ Completed |
| API routing | ✅ Completed |
| Employee APIs | ✅ Completed |
| Attendance APIs | ✅ Completed |
| Payroll APIs | ✅ Completed |
| Leave APIs | ✅ Completed |
| Document APIs | ✅ Completed |
| SQLAlchemy models | ✅ Completed |
| PostgreSQL connection | ✅ Completed |
| Pydantic schemas | ✅ Completed |
| Swagger documentation | ✅ Completed |

---

## 👥 18. Team Responsibility Note

This README documents **only my contribution** to Dayflow HRMS. Responsibilities across the team are as follows:

| Member | Responsibility |
|---|---|
| **Me** | FastAPI backend, API endpoints, database models, database connection, business logic, and Pydantic schemas |
| **Varshan** | Authentication, login/register, role-based access control, admin APIs |
| **Joshika** | React project, UI, pages, components, frontend API connection |
| **Benedict** | API testing, integration testing, validation/security test cases |

---

## 🔍 19. Related Modules

- [`../database/README.md`](../database/README.md)
- [`../database/schema/schema.sql`](../database/schema/schema.sql)

---

<div align="center">

**Dayflow HRMS** — Backend Module

</div>