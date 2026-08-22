from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.employee_profile import EmployeeProfile
from app.schemas.auth import (
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
        must_change_password=employee.must_change_password
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

    # Employee no longer needs to change password
    employee.must_change_password = False

    db.commit()

    return ChangePasswordResponse(
        message="Password changed successfully"
    )
