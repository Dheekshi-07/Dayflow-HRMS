from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    attendance_date: date

    check_in: time | None = None
    check_out: time | None = None

    status: str

    working_hours: float | None = None
    payable_day: float

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)