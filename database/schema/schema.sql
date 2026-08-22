-- ============================================================
-- Dayflow HRMS - PostgreSQL Database Schema
-- ============================================================
-- Database: dayflow_hrms
-- Backend: FastAPI
-- ORM: SQLAlchemy
-- Database: PostgreSQL
-- ============================================================


-- ============================================================
-- EMPLOYEE PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS employee_profiles (
    id SERIAL PRIMARY KEY,

    employee_id VARCHAR(50) UNIQUE NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    phone VARCHAR(20),
    address TEXT,

    date_of_birth DATE,

    department VARCHAR(100),
    designation VARCHAR(100),

    joining_date DATE,

    profile_picture VARCHAR(255),

    password_hash VARCHAR(255),

    role VARCHAR(50) DEFAULT 'employee' NOT NULL,

    must_change_password BOOLEAN DEFAULT TRUE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,

    employee_id INTEGER NOT NULL,

    attendance_date DATE NOT NULL,

    check_in TIME,
    check_out TIME,

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_attendance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee_profiles(id)
        ON DELETE CASCADE
);


-- ============================================================
-- PAYROLL
-- ============================================================

CREATE TABLE IF NOT EXISTS payroll (
    id SERIAL PRIMARY KEY,

    employee_id INTEGER NOT NULL UNIQUE,

    wage NUMERIC(12,2) NOT NULL,

    basic_percentage NUMERIC(5,2) NOT NULL,

    hra_percentage NUMERIC(5,2) NOT NULL,

    standard_allowance NUMERIC(12,2) DEFAULT 0 NOT NULL,

    performance_bonus_percentage NUMERIC(5,2) DEFAULT 0 NOT NULL,

    lta_percentage NUMERIC(5,2) DEFAULT 0 NOT NULL,

    basic_salary NUMERIC(12,2) NOT NULL,

    allowances NUMERIC(12,2) DEFAULT 0 NOT NULL,

    deductions NUMERIC(12,2) DEFAULT 0 NOT NULL,

    net_salary NUMERIC(12,2) NOT NULL,

    pf_rate NUMERIC(5,2) DEFAULT 0 NOT NULL,

    professional_tax NUMERIC(12,2) DEFAULT 0 NOT NULL,

    total_working_days NUMERIC(5,2) DEFAULT 0 NOT NULL,

    payable_days NUMERIC(5,2) DEFAULT 0 NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_payroll_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee_profiles(id)
        ON DELETE CASCADE
);


-- ============================================================
-- LEAVE TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS leave_types (
    id SERIAL PRIMARY KEY,

    name VARCHAR(50) UNIQUE NOT NULL,

    description VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- ============================================================
-- LEAVE REQUESTS
-- ============================================================

CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,

    employee_id INTEGER NOT NULL,

    leave_type_id INTEGER NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    reason TEXT,

    status VARCHAR(20) DEFAULT 'Pending' NOT NULL,

    admin_comment TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_leave_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_leave_type
        FOREIGN KEY (leave_type_id)
        REFERENCES leave_types(id)
        ON DELETE RESTRICT,

    CONSTRAINT check_leave_dates
        CHECK (end_date >= start_date)
);


-- ============================================================
-- DOCUMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,

    employee_id INTEGER NOT NULL,

    document_name VARCHAR(255) NOT NULL,

    document_url VARCHAR(500) NOT NULL,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_document_employee
        FOREIGN KEY (employee_id)
        REFERENCES employee_profiles(id)
        ON DELETE CASCADE
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_employee_profiles_employee_id
    ON employee_profiles(employee_id);

CREATE INDEX IF NOT EXISTS idx_employee_profiles_email
    ON employee_profiles(email);

CREATE INDEX IF NOT EXISTS idx_attendance_employee_id
    ON attendance(employee_id);

CREATE INDEX IF NOT EXISTS idx_attendance_date
    ON attendance(attendance_date);

CREATE INDEX IF NOT EXISTS idx_payroll_employee_id
    ON payroll(employee_id);

CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id
    ON leave_requests(employee_id);

CREATE INDEX IF NOT EXISTS idx_leave_requests_leave_type_id
    ON leave_requests(leave_type_id);

CREATE INDEX IF NOT EXISTS idx_documents_employee_id
    ON documents(employee_id);


-- ============================================================
-- DEFAULT LEAVE TYPES
-- ============================================================

INSERT INTO leave_types (name, description)
VALUES
    ('Paid Leave', 'Paid time off'),
    ('Sick Leave', 'Leave due to illness'),
    ('Unpaid Leave', 'Leave without salary')
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- END OF SCHEMA
-- ============================================================