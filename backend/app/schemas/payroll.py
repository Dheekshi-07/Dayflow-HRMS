from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class PayrollCreate(BaseModel):
    employee_id: str

    wage: Decimal

    basic_percentage: Decimal = Decimal("50")
    hra_percentage: Decimal = Decimal("50")
    standard_allowance: Decimal = Decimal("4167")
    performance_bonus_percentage: Decimal = Decimal("8.33")
    lta_percentage: Decimal = Decimal("8.333")

    pf_rate: Decimal = Decimal("12")
    professional_tax: Decimal = Decimal("200")

    total_working_days: Decimal = Decimal("0")
    payable_days: Decimal = Decimal("0")


class PayrollUpdate(BaseModel):
    wage: Decimal | None = None

    basic_percentage: Decimal | None = None
    hra_percentage: Decimal | None = None
    standard_allowance: Decimal | None = None
    performance_bonus_percentage: Decimal | None = None
    lta_percentage: Decimal | None = None

    pf_rate: Decimal | None = None
    professional_tax: Decimal | None = None

    total_working_days: Decimal | None = None
    payable_days: Decimal | None = None


class PayrollResponse(BaseModel):
    id: int
    employee_id: int

    wage: Decimal

    basic_percentage: Decimal
    hra_percentage: Decimal
    standard_allowance: Decimal
    performance_bonus_percentage: Decimal
    lta_percentage: Decimal

    basic_salary: Decimal
    allowances: Decimal
    deductions: Decimal
    net_salary: Decimal

    pf_rate: Decimal
    professional_tax: Decimal

    total_working_days: Decimal
    payable_days: Decimal

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)