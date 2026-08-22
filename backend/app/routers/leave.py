from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.employee_profile import EmployeeProfile
from app.models.leave_request import LeaveRequest
from app.models.leave_type import LeaveType
from app.schemas.leave import (
    LeaveRequestCreate,
    LeaveRequestResponse,
    LeaveTypeResponse,
    LeaveApprovalRequest,
)


router = APIRouter(
    prefix="/api/leave",
    tags=["Leave Management"]
)


@router.get(
    "/types",
    response_model=list[LeaveTypeResponse]
)
def get_leave_types(
    db: Session = Depends(get_db)
):
    return db.query(LeaveType).all()


@router.post(
    "/",
    response_model=LeaveRequestResponse,
    status_code=201
)
def apply_leave(
    leave_data: LeaveRequestCreate,
    db: Session = Depends(get_db)
):
    # Find employee
    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == leave_data.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # Validate leave type
    leave_type = db.query(LeaveType).filter(
        LeaveType.id == leave_data.leave_type_id
    ).first()

    if not leave_type:
        raise HTTPException(
            status_code=404,
            detail="Leave type not found"
        )

    # Validate dates
    if leave_data.end_date < leave_data.start_date:
        raise HTTPException(
            status_code=400,
            detail="End date cannot be before start date"
        )

    # Check overlapping leave
    overlapping_leave = db.query(LeaveRequest).filter(
        LeaveRequest.employee_id == employee.id,
        LeaveRequest.start_date <= leave_data.end_date,
        LeaveRequest.end_date >= leave_data.start_date,
        LeaveRequest.status.in_(["Pending", "Approved"])
    ).first()

    if overlapping_leave:
        raise HTTPException(
            status_code=400,
            detail="Leave already exists for the selected dates"
        )

    leave_request = LeaveRequest(
        employee_id=employee.id,
        leave_type_id=leave_data.leave_type_id,
        start_date=leave_data.start_date,
        end_date=leave_data.end_date,
        reason=leave_data.reason,
        status="Pending"
    )

    db.add(leave_request)
    db.commit()
    db.refresh(leave_request)

    return leave_request


@router.get(
    "/employee/{employee_id}",
    response_model=list[LeaveRequestResponse]
)
def get_employee_leaves(
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

    leaves = db.query(LeaveRequest).filter(
        LeaveRequest.employee_id == employee.id
    ).order_by(
        LeaveRequest.created_at.desc()
    ).all()

    return leaves

@router.get(
    "/all",
    response_model=list[LeaveRequestResponse]
)
def get_all_leaves(
    db: Session = Depends(get_db)
):
    leaves = db.query(LeaveRequest).order_by(
        LeaveRequest.created_at.desc()
    ).all()

    return leaves

@router.put(
    "/{leave_id}/approve",
    response_model=LeaveRequestResponse
)
def approve_leave(
    leave_id: int,
    approval_data: LeaveApprovalRequest,
    db: Session = Depends(get_db)
):
    leave = db.query(LeaveRequest).filter(
        LeaveRequest.id == leave_id
    ).first()

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave request not found"
        )

    if leave.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending leave requests can be approved"
        )

    leave.status = "Approved"
    leave.admin_comment = approval_data.admin_comment

    db.commit()
    db.refresh(leave)

    return leave

@router.put(
    "/{leave_id}/reject",
    response_model=LeaveRequestResponse
)
def reject_leave(
    leave_id: int,
    approval_data: LeaveApprovalRequest,
    db: Session = Depends(get_db)
):
    leave = db.query(LeaveRequest).filter(
        LeaveRequest.id == leave_id
    ).first()

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave request not found"
        )

    if leave.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending leave requests can be rejected"
        )

    leave.status = "Rejected"
    leave.admin_comment = approval_data.admin_comment

    db.commit()
    db.refresh(leave)

    return leave