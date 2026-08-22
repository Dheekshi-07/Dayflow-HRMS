from fastapi import FastAPI

from app.routers.employees import router as employee_router
from app.routers.attendance import router as attendance_router
from app.routers.leave import router as leave_router
from app.routers.payroll import router as payroll_router
from app.routers.documents import router as documents_router
from app.routers.auth import router as auth_router

app = FastAPI(
    title="Dayflow HRMS API",
    description="Human Resource Management System Backend",
    version="1.0.0"
)


app.include_router(employee_router)
app.include_router(attendance_router)
app.include_router(leave_router)
app.include_router(payroll_router)
app.include_router(documents_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "Dayflow HRMS API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy"
    }