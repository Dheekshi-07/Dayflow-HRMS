from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.employee_profile import EmployeeProfile
from app.models.leave_request import LeaveRequest
from app.core.admin import require_admin


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


# ------------------------------------------------------------
# EMPLOYEES
# ------------------------------------------------------------

@router.get("/employees")
def get_all_employees(
    db: Session = Depends(get_db),
    admin: EmployeeProfile = Depends(require_admin)
):
    employees = db.query(EmployeeProfile).all()

    return [
        {
            "employee_id": employee.employee_id,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "email": employee.email,
            "phone": employee.phone,
            "address": employee.address,
            "date_of_birth": employee.date_of_birth,
            "department": employee.department,
            "designation": employee.designation,
            "joining_date": employee.joining_date,
            "profile_picture": employee.profile_picture,
            "role": employee.role,
            "must_change_password": employee.must_change_password,
            "created_at": employee.created_at,
            "updated_at": employee.updated_at
        }
        for employee in employees
    ]


@router.get("/employees/{employee_id}")
def get_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    admin: EmployeeProfile = Depends(require_admin)
):
    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return {
        "employee_id": employee.employee_id,
        "first_name": employee.first_name,
        "last_name": employee.last_name,
        "email": employee.email,
        "phone": employee.phone,
        "address": employee.address,
        "date_of_birth": employee.date_of_birth,
        "department": employee.department,
        "designation": employee.designation,
        "joining_date": employee.joining_date,
        "profile_picture": employee.profile_picture,
        "role": employee.role
    }


@router.delete("/employees/{employee_id}")
def delete_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    admin: EmployeeProfile = Depends(require_admin)
):
    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    if employee.role.lower() == "admin":
        raise HTTPException(
            status_code=400,
            detail="Admin account cannot be deleted"
        )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully",
        "employee_id": employee_id
    }


# ------------------------------------------------------------
# LEAVES
# ------------------------------------------------------------

@router.get("/leaves")
def get_all_leave_requests(
    db: Session = Depends(get_db),
    admin: EmployeeProfile = Depends(require_admin)
):
    leaves = db.query(LeaveRequest).all()

    return leaves