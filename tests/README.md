# Dayflow HRMS — Testing

## Overview

The Dayflow HRMS project includes an automated testing suite using **Pytest** to validate important backend functionality.

The current test suite focuses on authentication utilities, password security, employee identification, role-based access control, and employee data validation.

---

## Testing Objectives

The test suite verifies the following core areas:

- Authentication and password functionality
- Secure password hashing and verification
- Employee ID generation
- Employee and HR role handling
- Role-Based Access Control (RBAC)
- Employee data validation
- Email validation
- Backend security utilities

---

## Test Directory Structure

```text
tests/
│
├── conftest.py
├── test_auth.py
├── test_employee.py
├── test_rbac.py
├── test_security.py
├── test_validation.py
└── README.md

Test Modules

1. Authentication Tests

File: test_auth.py

Tests authentication and password-related functionality.

Covered Functionality

* Temporary password generation
* Password hashing
* Correct password verification
* Incorrect password verification
* Password hash uniqueness

Test Cases
test_generate_temporary_password
test_hash_password
test_verify_correct_password
test_verify_wrong_password
test_different_passwords_have_different_hashes

Total: 5 tests

⸻

2. Employee Tests

File: test_employee.py

Tests employee identification and employee ID generation.

Covered Functionality

* Employee ID format
* Employee ID serial format

Test Cases
test_employee_id_format
test_employee_id_serial_format

Total: 2 tests

⸻

3. Role-Based Access Control Tests

File: test_rbac.py

Tests role-based permissions for Employee and HR users.

Covered Functionality

* Employee role
* HR role
* Employee access restrictions
* HR access permissions

Test Cases

test_employee_role
test_hr_role
test_employee_cannot_access_hr_pages
test_hr_can_access_hr_pages

Total: 4 tests

⸻

4. Security Tests

File: test_security.py

Tests password security and verification functionality.

Covered Functionality

* Password hashing
* Plain-text password protection
* Successful password verification
* Failed password verification

Test Cases

test_password_hash_is_different_from_plain_password
test_password_verification_success
test_password_verification_failure

Total: 3 tests

⸻

5. Validation Tests

File: test_validation.py

Tests employee data validation.

Covered Functionality

* Valid employee data
* Employee information validation
* Email validation
* Invalid email rejection

Test Cases

test_valid_employee_data
test_invalid_email

Total: 2 tests

⸻

Test Configuration

conftest.py

The conftest.py file configures the testing environment and makes the backend application available to the test modules.

It adds the project’s backend directory to the Python import path so that backend modules can be imported during testing.

⸻

From the project root:
cd ~/Desktop/Dayflow-HRMS
source backend/venv/bin/activate

Run All Tests
PYTHONPATH=backend pytest tests -v

Run Authentication Tests
PYTHONPATH=backend pytest tests/test_auth.py -v

Run RBAC Tests
PYTHONPATH=backend pytest tests/test_rbac.py -v

Run Security Tests
PYTHONPATH=backend pytest tests/test_security.py -v

Run Validation Tests
PYTHONPATH=backend pytest tests/test_validation.py -v

Test Results

The current automated test suite contains 16 tests.

Latest Test Run

============================== test session starts ==============================

collected 16 items

tests/test_auth.py
    test_generate_temporary_password                         PASSED
    test_hash_password                                       PASSED
    test_verify_correct_password                             PASSED
    test_verify_wrong_password                               PASSED
    test_different_passwords_have_different_hashes           PASSED

tests/test_employee.py
    test_employee_id_format                                  PASSED
    test_employee_id_serial_format                           PASSED

tests/test_rbac.py
    test_employee_role                                       PASSED
    test_hr_role                                              PASSED
    test_employee_cannot_access_hr_pages                     PASSED
    test_hr_can_access_hr_pages                               PASSED

tests/test_security.py
    test_password_hash_is_different_from_plain_password      PASSED
    test_password_verification_success                        PASSED
    test_password_verification_failure                        PASSED

tests/test_validation.py
    test_valid_employee_data                                 PASSED
    test_invalid_email                                       PASSED

============================== 16 passed ==============================

What Is Currently Verified

Authentication

The authentication tests verify:

* Temporary password generation
* Secure password hashing
* Correct password verification
* Incorrect password rejection
* Different password hashes for password values

Employee Management

Employee tests verify that employee IDs follow the expected format and serial structure.

Role-Based Access Control

The RBAC tests verify that Employee and HR roles are handled separately.

Employee
   │
   ├── Employee pages       ✓
   └── HR pages             ✗

HR
   │
   └── HR pages             ✓

Security

Security tests verify that:

* Passwords are hashed
* Plain-text passwords are not stored as hashes
* Correct passwords can be verified
* Incorrect passwords are rejected

Validation

Validation tests verify that valid employee information is accepted and invalid email addresses are rejected.

⸻

Test Coverage Summary

The current test suite provides automated coverage for the core backend utility and authorization logic of Dayflow HRMS.

Authentication       5 tests
Employee             2 tests
RBAC                 4 tests
Security             3 tests
Validation           2 tests
────────────────────────────
Total               16 tests

Current Status: 16 / 16 tests passing

⸻

Quality Assurance

Automated tests help ensure that important backend functionality continues to work correctly as the project develops.

Before committing major backend changes, run:

PYTHONPATH=backend pytest tests -v

A successful test run should report all available tests as PASSED.

⸻

Future Testing

The following testing areas can be added as the project continues to develop:

* Authentication API endpoint testing
* Registration API testing
* Employee CRUD testing
* Database integration testing
* Attendance management testing
* Leave management testing
* Assignment management testing
* Work mail testing
* Authorization and protected endpoint testing
* API integration testing
* Frontend testing
* End-to-end testing

These are planned extensions and are not part of the current 16-test suite.

⸻

Conclusion

The Dayflow HRMS testing suite provides automated validation for essential backend functionality including authentication, password security, employee identification, role-based access control, and employee data validation.

The current suite contains 16 automated tests, all of which are passing successfully.

Test Status: 16/16 PASSED