<div align="center">

# 🗃️ Dayflow HRMS — Database

**PostgreSQL database layer for the Dayflow Human Resource Management System.**

![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-D71F00?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)

</div>

---

## 📖 Overview

The Dayflow HRMS database stores and manages the core information required for the Human Resource Management System.

The database supports:

- 👤 Employee profiles
- ⏰ Employee attendance
- 💰 Payroll information
- 🌴 Leave management
- 📄 Employee documents
- 🔐 Employee authentication details

The backend uses **PostgreSQL** as the database and **SQLAlchemy** as the ORM layer.

---

## 🗄️ Database Technology

| Component | Technology |
|---|---|
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Backend | FastAPI |
| Database Driver | psycopg2 |
| Authentication | Passlib + bcrypt |
| Migrations | Alembic |

---

## 📋 Database Tables

| Table | Purpose |
|---|---|
| `employee_profiles` | Stores employee personal, professional, and authentication information |
| `attendance` | Stores daily employee check-in and check-out records |
| `payroll` | Stores employee salary and payroll calculation details |
| `leave_types` | Stores available types of leave |
| `leave_requests` | Stores employee leave applications and approval status |
| `documents` | Stores employee document information |

---

## 🔗 Database Relationships

```text
                    ┌─────────────────────┐
                    │  employee_profiles  │
                    │                     │
                    │  id (Primary Key)   │
                    │  employee_id        │
                    │  email              │
                    │  role               │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │  attendance  │ │   payroll    │ │  documents   │
      │              │ │              │ │              │
      │ employee_id  │ │ employee_id  │ │ employee_id  │
      └──────────────┘ └──────────────┘ └──────────────┘
                              
                               │
                               ▼
                       ┌─────────────────┐
                       │ leave_requests  │
                       │                 │
                       │ employee_id     │
                       │ leave_type_id   │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   leave_types  │
                       │                 │
                       │ id              │
                       │ name            │
                       └─────────────────┘
```

### Relationship Summary

- One employee can have multiple attendance records.
- One employee has payroll information.
- One employee can have multiple documents.
- One employee can submit multiple leave requests.
- One leave type can be associated with multiple leave requests.
- Employee-related tables reference `employee_profiles.id` using foreign keys.

---

# 👤 Employee Profiles

### Table: `employee_profiles`

Stores employee personal, professional, and authentication information.

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `employee_id` | String | Unique employee ID |
| `first_name` | String | Employee first name |
| `last_name` | String | Employee last name |
| `email` | String | Employee email |
| `phone` | String | Contact number |
| `address` | String | Employee address |
| `date_of_birth` | Date | Date of birth |
| `department` | String | Employee department |
| `designation` | String | Employee designation |
| `joining_date` | Date | Date of joining |
| `profile_picture` | String | Profile picture path/URL |
| `password_hash` | String | Hashed password |
| `role` | String | Employee role |
| `must_change_password` | Boolean | Indicates whether password must be changed |
| `created_at` | DateTime | Record creation time |
| `updated_at` | DateTime | Last update time |

### Authentication Fields

The employee table stores:

- `password_hash` instead of plain-text passwords.
- `role` for role identification.
- `must_change_password` for first-login password change handling.

Passwords are hashed using **bcrypt** before being stored in the database.

---

# ⏰ Attendance

### Table: `attendance`

Stores employee daily attendance information.

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `employee_id` | Integer | Foreign key to employee |
| `attendance_date` | Date | Attendance date |
| `check_in` | Time | Check-in time |
| `check_out` | Time | Check-out time |
| `status` | String | Attendance status |
| `created_at` | DateTime | Record creation time |

### Attendance Flow

```text
Employee
   │
   ▼
Check In
   │
   ▼
Attendance Record Created
   │
   ▼
Status = Present
   │
   ▼
Check Out
   │
   ▼
check_out time updated
```

The system prevents:

- Duplicate attendance for the same employee on the same day.
- Check-out without a check-in.
- Multiple check-outs for the same attendance record.

---

# 💰 Payroll

### Table: `payroll`

Stores employee salary and payroll calculation details.

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `employee_id` | Integer | Foreign key to employee |
| `wage` | Decimal | Employee wage |
| `basic_percentage` | Decimal | Basic salary percentage |
| `hra_percentage` | Decimal | HRA percentage |
| `standard_allowance` | Decimal | Standard allowance |
| `performance_bonus_percentage` | Decimal | Performance bonus percentage |
| `lta_percentage` | Decimal | LTA percentage |
| `basic_salary` | Decimal | Calculated basic salary |
| `allowances` | Decimal | Calculated allowances |
| `deductions` | Decimal | Total deductions |
| `net_salary` | Decimal | Final salary |
| `pf_rate` | Decimal | Provident Fund rate |
| `professional_tax` | Decimal | Professional tax |
| `total_working_days` | Decimal | Total working days |
| `payable_days` | Decimal | Payable working days |
| `created_at` | DateTime | Record creation time |
| `updated_at` | DateTime | Last update time |

### Payroll Calculation

The backend calculates:

```text
Basic Salary = Wage × Basic Percentage / 100

Allowances = Wage × HRA Percentage / 100

Net Salary = Basic Salary + Allowances - Deductions
```

The payroll endpoint also stores:

- PF rate
- Professional tax
- Performance bonus percentage
- LTA percentage
- Working days
- Payable days

---

# 🌴 Leave Types

### Table: `leave_types`

Stores the types of leave available to employees.

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `name` | String | Leave type name |
| `description` | String | Description of the leave |
| `created_at` | DateTime | Record creation time |

### Current Leave Types

The database currently contains:

| Leave Type | Description |
|---|---|
| Paid Leave | Paid time off |
| Sick Leave | Leave due to illness |
| Unpaid Leave | Leave without salary |

---

# 📅 Leave Requests

### Table: `leave_requests`

Stores employee leave applications.

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `employee_id` | Integer | Foreign key to employee |
| `leave_type_id` | Integer | Foreign key to leave type |
| `start_date` | Date | Leave start date |
| `end_date` | Date | Leave end date |
| `reason` | Text | Reason for leave |
| `status` | String | Pending, Approved, or Rejected |
| `admin_comment` | Text | Admin comment |
| `created_at` | DateTime | Request creation time |
| `updated_at` | DateTime | Last update time |

### Leave Flow

```text
Employee
   │
   ▼
Apply Leave
   │
   ▼
Status = Pending
   │
   ├───────────────┐
   ▼               ▼
Approve          Reject
   │               │
   ▼               ▼
Approved         Rejected
```

The backend validates:

- Employee existence
- Leave type existence
- Valid start and end dates
- Overlapping leave requests

---

# 📄 Documents

### Table: `documents`

Stores employee document information.

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `employee_id` | Integer | Foreign key to employee |
| `document_name` | String | Name of the document |
| `document_url` | String | Document URL/path |
| `uploaded_at` | DateTime | Upload timestamp |

### Example Documents

```text
Aadhaar Card
Resume
Offer Letter
Certificates
Other Employee Documents
```

The database stores the document metadata and URL rather than storing the actual file contents directly.

---

# 🔐 Security

The database follows basic security practices:

- Passwords are never stored as plain text.
- Passwords are hashed using bcrypt.
- Employee IDs are used to identify employees in API operations.
- Foreign keys maintain relationships between employee-related tables.
- Sensitive configuration such as database credentials is stored in environment variables.

---

# 🔌 Database Connection

The FastAPI backend connects to PostgreSQL through SQLAlchemy.

```text
FastAPI
   │
   ▼
SQLAlchemy ORM
   │
   ▼
Database Connection
   │
   ▼
PostgreSQL
   │
   ▼
dayflow_hrms
```

The database connection is managed through:

```text
backend/app/database/connection.py
```

Configuration is managed through:

```text
backend/app/core/config.py
```

---

# 🗂️ Database-Related Backend Structure

```text
backend/
│
├── app/
│   ├── database/
│   │   ├── __init__.py
│   │   └── connection.py
│   │
│   ├── models/
│   │   ├── employee_profile.py
│   │   ├── attendance.py
│   │   ├── payroll.py
│   │   ├── leave_type.py
│   │   ├── leave_request.py
│   │   └── document.py
│   │
│   ├── schemas/
│   │   ├── employee.py
│   │   ├── attendance.py
│   │   ├── payroll.py
│   │   ├── leave.py
│   │   └── document.py
│   │
│   └── routers/
│       ├── employees.py
│       ├── attendance.py
│       ├── payroll.py
│       ├── leave.py
│       └── documents.py
│
└── ...
```

---

# 🧪 Database Verification

Database functionality was verified through the FastAPI Swagger documentation.

Tested operations include:

### Employee

```text
POST /api/employees/
```

### Authentication

```text
POST /api/auth/login
PUT /api/auth/change-password
```

### Attendance

```text
POST /api/attendance/check-in/{employee_id}
PUT /api/attendance/check-out/{employee_id}
GET /api/attendance/{employee_id}
```

### Payroll

```text
POST /api/payroll/
GET /api/payroll/employee/{employee_id}
PUT /api/payroll/employee/{employee_id}
```

### Leave

```text
GET /api/leave/types
POST /api/leave/
GET /api/leave/employee/{employee_id}
GET /api/leave/all
PUT /api/leave/{leave_id}/approve
PUT /api/leave/{leave_id}/reject
```

### Documents

```text
POST /api/documents/
GET /api/documents/employee/{employee_id}
```

---

# ✅ Current Database Implementation

| Module | Status |
|---|---|
| PostgreSQL Connection | ✅ Completed |
| SQLAlchemy Models | ✅ Completed |
| Employee Database | ✅ Completed |
| Attendance Database | ✅ Completed |
| Payroll Database | ✅ Completed |
| Leave Database | ✅ Completed |
| Document Database | ✅ Completed |
| Password Hashing | ✅ Completed |
| Database Relationships | ✅ Completed |
| API Database Integration | ✅ Completed |

---

## 📌 Database

**Database Name:** `dayflow_hrms`

**Backend:** FastAPI

**ORM:** SQLAlchemy

**Database:** PostgreSQL

---

<div align="center">

### 🚀 Dayflow HRMS

**Human Resource Management System**

Built with ❤️ using FastAPI, SQLAlchemy & PostgreSQL.

</div>