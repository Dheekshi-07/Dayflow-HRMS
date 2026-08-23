from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.employee_profile import EmployeeProfile
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
)
from app.core.security import (
    verify_password,
    hash_password,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=201
)
def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    # Check whether email already exists
    existing_employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.email == register_data.email
    ).first()

    if existing_employee:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Generate employee ID
    employee_count = db.query(EmployeeProfile).count()

    employee_id = f"EMP{employee_count + 1:03d}"

    # Create employee
    employee = EmployeeProfile(
        employee_id=employee_id,
        first_name=register_data.first_name,
        last_name=register_data.last_name,
        email=register_data.email,
        joining_date=date.today(),
        password_hash=hash_password(register_data.password),
        role=register_data.role,
        must_change_password=False
    )

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return RegisterResponse(
        message="Registration successful",
        employee_id=employee.employee_id,
        password_hash=employee.password_hash
    )


@router.post(
    "/login",
    response_model=LoginResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == login_data.login_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=401,
            detail="Invalid Login ID or password"
        )

    if not employee.password_hash:
        raise HTTPException(
            status_code=401,
            detail="Account has no password configured"
        )

    if not verify_password(
        login_data.password,
        employee.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Login ID or password"
        )

    return LoginResponse(
    message="Login successful",
    employee_id=employee.employee_id,
    role=employee.role,
    must_change_password=employee.must_change_password,

    first_name=employee.first_name,
    last_name=employee.last_name,
    email=employee.email,
    phone=employee.phone,
    address=employee.address,
    designation=employee.designation,
    department=employee.department
)


@router.put(
    "/change-password",
    response_model=ChangePasswordResponse
)
def change_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db)
):
    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == password_data.login_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # Verify current password
    if not verify_password(
        password_data.current_password,
        employee.password_hash
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    # Check new passwords match
    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="New passwords do not match"
        )

    # Basic password validation
    if len(password_data.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 8 characters"
        )

    # Don't allow same password
    if verify_password(
        password_data.new_password,
        employee.password_hash
    ):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from current password"
        )

    # Hash and save new password
    employee.password_hash = hash_password(
        password_data.new_password
    )

    employee.must_change_password = False

    db.commit()

    return ChangePasswordResponse(
        message="Password changed successfully"
    )
