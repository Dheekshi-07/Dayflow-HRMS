from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.attendance import Attendance
from app.models.employee_profile import EmployeeProfile
from app.models.payroll import Payroll
from app.schemas.attendance import AttendanceResponse


router = APIRouter(
    prefix="/api/attendance",
    tags=["Attendance"]
)


@router.post(
    "/check-in/{employee_id}",
    response_model=AttendanceResponse,
    status_code=201
)
def check_in(
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

    today = date.today()

    existing_attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.attendance_date == today
    ).first()

    if existing_attendance:
        raise HTTPException(
            status_code=400,
            detail="Attendance already marked for today"
        )

    attendance = Attendance(
        employee_id=employee.id,
        attendance_date=today,
        check_in=datetime.now().time(),
        status="Present",
        payable_day=1
    )

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    update_payable_days(db, employee.id)

    return attendance


@router.put(
    "/check-out/{employee_id}",
    response_model=AttendanceResponse
)
def check_out(
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

    today = date.today()

    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id,
        Attendance.attendance_date == today
    ).first()

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="No check-in found for today"
        )

    if attendance.check_out:
        raise HTTPException(
            status_code=400,
            detail="Employee already checked out"
        )

    attendance.check_out = datetime.now().time()

    if attendance.check_in:
        check_in_minutes = (
            attendance.check_in.hour * 60
            + attendance.check_in.minute
        )

        check_out_minutes = (
            attendance.check_out.hour * 60
            + attendance.check_out.minute
        )

        minutes_worked = check_out_minutes - check_in_minutes

        attendance.working_hours = round(
            minutes_worked / 60,
            2
        )

    db.commit()
    db.refresh(attendance)

    update_payable_days(db, employee.id)

    return attendance


@router.get(
    "/{employee_id}",
    response_model=list[AttendanceResponse]
)
def get_attendance(
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

    attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id
    ).order_by(
        Attendance.attendance_date.desc()
    ).all()

    return attendance


def update_payable_days(
    db: Session,
    employee_id: int
):
    payroll = db.query(Payroll).filter(
        Payroll.employee_id == employee_id
    ).first()

    if not payroll:
        return

    total_working_days = payroll.total_working_days

    if not total_working_days or total_working_days <= 0:
        return

    attendance_records = db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    ).all()

    payable_days = sum(
        float(record.payable_day or 0)
        for record in attendance_records
    )

    payroll.payable_days = min(
        payable_days,
        float(total_working_days)
    )

    db.commit()