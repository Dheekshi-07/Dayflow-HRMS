import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

import pytest
from pydantic import ValidationError
from app.schemas.employee import EmployeeCreate


def test_valid_employee_data():
    employee = EmployeeCreate(
        first_name="Demo",
        last_name="Employee",
        email="demo.employee@dayflow.com",
        phone="9876543210",
        department="Engineering",
        designation="Software Engineer",
        joining_date="2026-08-22"
    )

    assert employee.first_name == "Demo"
    assert employee.email == "demo.employee@dayflow.com"


def test_invalid_email():
    with pytest.raises(ValidationError):
        EmployeeCreate(
            first_name="Demo",
            last_name="Employee",
            email="invalid-email",
            joining_date="2026-08-22"
        )
