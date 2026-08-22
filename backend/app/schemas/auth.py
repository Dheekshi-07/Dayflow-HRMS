from pydantic import BaseModel


class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str = "employee"


class RegisterResponse(BaseModel):
    message: str
    employee_id: str
    password_hash: str


class LoginRequest(BaseModel):
    login_id: str
    password: str


class LoginResponse(BaseModel):
    message: str
    employee_id: str
    role: str
    must_change_password: bool


class ChangePasswordRequest(BaseModel):
    login_id: str
    current_password: str
    new_password: str
    confirm_password: str


class ChangePasswordResponse(BaseModel):
    message: str
