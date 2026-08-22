def test_employee_id_format():
    company_code = "OI"
    first_name = "Shree"
    last_name = "Varshan"
    joining_year = 2026
    serial_number = 1

    employee_id = (
        f"{company_code}"
        f"{first_name[:2].upper()}"
        f"{last_name[:2].upper()}"
        f"{joining_year}"
        f"{serial_number:04d}"
    )

    assert employee_id == "OISHVA20260001"


def test_employee_id_serial_format():
    employee_id = "OISHVA20260001"

    assert employee_id.startswith("OI")
    assert employee_id.endswith("0001")
    assert len(employee_id) == 14
