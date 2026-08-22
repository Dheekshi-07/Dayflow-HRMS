from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.employee_profile import EmployeeProfile


def get_current_employee(
    x_employee_id: str = Header(...),
    db: Session = Depends(get_db)
):
    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == x_employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=401,
            detail="Employee not found"
        )

    return employee


def require_admin(
    employee: EmployeeProfile = Depends(get_current_employee)
):
    if employee.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return employee
