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


@router.get("/employees")
def get_all_employees(
    db: Session = Depends(get_db),
    admin: EmployeeProfile = Depends(require_admin)
):
    employees = db.query(EmployeeProfile).all()

    return employees


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

    return employee


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


@router.get("/leaves")
def get_all_leave_requests(
    db: Session = Depends(get_db),
    admin: EmployeeProfile = Depends(require_admin)
):
    leaves = db.query(LeaveRequest).all()

    return leaves
