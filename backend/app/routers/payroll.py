from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.employee_profile import EmployeeProfile
from app.models.payroll import Payroll
from app.schemas.payroll import (
    PayrollCreate,
    PayrollResponse,
    PayrollUpdate,
)


router = APIRouter(
    prefix="/api/payroll",
    tags=["Payroll Management"]
)


def calculate_salary(
    wage: Decimal,
    basic_percentage: Decimal,
    hra_percentage: Decimal,
    standard_allowance: Decimal,
    performance_bonus_percentage: Decimal,
    lta_percentage: Decimal,
    pf_rate: Decimal,
    professional_tax: Decimal,
    payable_days: Decimal,
    total_working_days: Decimal,
):
    # Basic = percentage of wage
    basic = wage * basic_percentage / Decimal("100")

    # HRA = percentage of Basic
    hra = basic * hra_percentage / Decimal("100")

    # Performance bonus = percentage of wage
    performance_bonus = (
        wage * performance_bonus_percentage / Decimal("100")
    )

    # LTA = percentage of wage
    lta = wage * lta_percentage / Decimal("100")

    # Fixed allowance is the remaining amount
    fixed_allowance = (
        wage
        - basic
        - hra
        - standard_allowance
        - performance_bonus
        - lta
    )

    if fixed_allowance < 0:
        raise HTTPException(
            status_code=400,
            detail="Salary components cannot exceed the defined wage"
        )

    allowances = (
        hra
        + standard_allowance
        + performance_bonus
        + lta
        + fixed_allowance
    )

    # PF based on Basic
    pf = basic * pf_rate / Decimal("100")

    deductions = pf + professional_tax

    # Attendance-based salary
    if total_working_days > 0 and payable_days < total_working_days:
        payable_ratio = payable_days / total_working_days

        gross_salary = wage * payable_ratio
        net_salary = gross_salary - deductions
    else:
        net_salary = wage - deductions

    if net_salary < 0:
        net_salary = Decimal("0")

    return {
        "basic_salary": basic.quantize(Decimal("0.01")),
        "allowances": allowances.quantize(Decimal("0.01")),
        "deductions": deductions.quantize(Decimal("0.01")),
        "net_salary": net_salary.quantize(Decimal("0.01")),
    }


@router.post(
    "/",
    response_model=PayrollResponse,
    status_code=201
)
def create_payroll(
    payroll_data: PayrollCreate,
    db: Session = Depends(get_db)
):
    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == payroll_data.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    existing_payroll = db.query(Payroll).filter(
        Payroll.employee_id == employee.id
    ).first()

    if existing_payroll:
        raise HTTPException(
            status_code=400,
            detail="Payroll already exists for this employee"
        )

    calculated = calculate_salary(
        wage=payroll_data.wage,
        basic_percentage=payroll_data.basic_percentage,
        hra_percentage=payroll_data.hra_percentage,
        standard_allowance=payroll_data.standard_allowance,
        performance_bonus_percentage=payroll_data.performance_bonus_percentage,
        lta_percentage=payroll_data.lta_percentage,
        pf_rate=payroll_data.pf_rate,
        professional_tax=payroll_data.professional_tax,
        payable_days=payroll_data.payable_days,
        total_working_days=payroll_data.total_working_days,
    )

    payroll = Payroll(
        employee_id=employee.id,

        wage=payroll_data.wage,

        basic_percentage=payroll_data.basic_percentage,
        hra_percentage=payroll_data.hra_percentage,
        standard_allowance=payroll_data.standard_allowance,
        performance_bonus_percentage=payroll_data.performance_bonus_percentage,
        lta_percentage=payroll_data.lta_percentage,

        pf_rate=payroll_data.pf_rate,
        professional_tax=payroll_data.professional_tax,

        total_working_days=payroll_data.total_working_days,
        payable_days=payroll_data.payable_days,

        basic_salary=calculated["basic_salary"],
        allowances=calculated["allowances"],
        deductions=calculated["deductions"],
        net_salary=calculated["net_salary"],
    )

    db.add(payroll)
    db.commit()
    db.refresh(payroll)

    return payroll


@router.get(
    "/employee/{employee_id}",
    response_model=PayrollResponse
)
def get_employee_payroll(
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

    payroll = db.query(Payroll).filter(
        Payroll.employee_id == employee.id
    ).first()

    if not payroll:
        raise HTTPException(
            status_code=404,
            detail="Payroll not found"
        )

    return payroll


@router.put(
    "/employee/{employee_id}",
    response_model=PayrollResponse
)
def update_employee_payroll(
    employee_id: str,
    payroll_data: PayrollUpdate,
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

    payroll = db.query(Payroll).filter(
        Payroll.employee_id == employee.id
    ).first()

    if not payroll:
        raise HTTPException(
            status_code=404,
            detail="Payroll not found"
        )

    update_data = payroll_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(payroll, field, value)

    calculated = calculate_salary(
        wage=payroll.wage,
        basic_percentage=payroll.basic_percentage,
        hra_percentage=payroll.hra_percentage,
        standard_allowance=payroll.standard_allowance,
        performance_bonus_percentage=payroll.performance_bonus_percentage,
        lta_percentage=payroll.lta_percentage,
        pf_rate=payroll.pf_rate,
        professional_tax=payroll.professional_tax,
        payable_days=payroll.payable_days,
        total_working_days=payroll.total_working_days,
    )

    payroll.basic_salary = calculated["basic_salary"]
    payroll.allowances = calculated["allowances"]
    payroll.deductions = calculated["deductions"]
    payroll.net_salary = calculated["net_salary"]

    db.commit()
    db.refresh(payroll)

    return payroll