from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None
    date_of_birth: date | None = None
    department: str | None = None
    designation: str | None = None
    joining_date: date
    profile_picture: str | None = None


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    phone: str | None = None
    address: str | None = None
    profile_picture: str | None = None


class EmployeeResponse(EmployeeBase):
    id: int
    employee_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EmployeeCreatedResponse(EmployeeResponse):
    temporary_password: str