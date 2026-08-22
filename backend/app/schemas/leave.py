from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class LeaveTypeResponse(BaseModel):
    id: int
    name: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)


class LeaveRequestCreate(BaseModel):
    employee_id: str
    leave_type_id: int
    start_date: date
    end_date: date
    reason: str | None = None


class LeaveRequestResponse(BaseModel):
    id: int
    employee_id: int
    leave_type_id: int
    start_date: date
    end_date: date
    reason: str | None
    status: str
    admin_comment: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
    

class LeaveApprovalRequest(BaseModel):
    admin_comment: str | None = None