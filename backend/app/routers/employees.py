from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.employee_profile import EmployeeProfile
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeUpdate,
    EmployeeCreatedResponse,
)
from app.core.config import settings
from app.core.security import (
    generate_temporary_password,
    hash_password,
)


router = APIRouter(
    prefix="/api/employees",
    tags=["Employees"]
)


def generate_employee_id(
    db: Session,
    first_name: str,
    last_name: str,
    joining_year: int
) -> str:

    first_part = first_name.strip()[:2].upper()
    last_part = last_name.strip()[:2].upper()

    prefix = (
        f"{settings.COMPANY_CODE}"
        f"{first_part}"
        f"{last_part}"
        f"{joining_year}"
    )

    existing_employees = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id.like(f"{prefix}%")
    ).all()

    serial_number = len(existing_employees) + 1

    return f"{prefix}{serial_number:04d}"


@router.post(
    "/",
    response_model=EmployeeCreatedResponse,
    status_code=201
)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):

    # Check whether email already exists
    existing_email = db.query(EmployeeProfile).filter(
        EmployeeProfile.email == employee.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # Get joining year
    joining_year = employee.joining_date.year

    # Generate employee/login ID automatically
    employee_id = generate_employee_id(
        db=db,
        first_name=employee.first_name,
        last_name=employee.last_name,
        joining_year=joining_year
    )

    # Generate temporary password
    temporary_password = generate_temporary_password()

    # Create employee
    new_employee = EmployeeProfile(
        employee_id=employee_id,
        first_name=employee.first_name,
        last_name=employee.last_name,
        email=employee.email,
        phone=employee.phone,
        address=employee.address,
        date_of_birth=employee.date_of_birth,
        department=employee.department,
        designation=employee.designation,
        joining_date=employee.joining_date,
        profile_picture=employee.profile_picture,

        # Authentication
        password_hash=hash_password(temporary_password),
        role="employee",
        must_change_password=True
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return EmployeeCreatedResponse(
    **new_employee.__dict__,
    temporary_password=temporary_password
)


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def get_employee(
    employee_id: str,
    db: Session = Depends(get_db)
):

    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def update_employee(
    employee_id: str,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db)
):

    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    update_data = employee_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(employee, field, value)

    db.commit()
    db.refresh(employee)

    return employee