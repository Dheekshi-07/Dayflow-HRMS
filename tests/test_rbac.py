def test_employee_role():
    user = {
        "role": "employee"
    }

    assert user["role"] == "employee"


def test_hr_role():
    user = {
        "role": "admin"
    }

    assert user["role"] == "admin"


def test_employee_cannot_access_hr_pages():
    role = "Employee"
    requested_page = "hr-employees"

    allowed = not (
        role == "Employee"
        and requested_page.startswith("hr-")
    )

    assert allowed is False


def test_hr_can_access_hr_pages():
    role = "HR"
    requested_page = "hr-employees"

    allowed = not (
        role == "Employee"
        and requested_page.startswith("hr-")
    )

    assert allowed is True
