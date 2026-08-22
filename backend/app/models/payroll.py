from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class Payroll(Base):
    __tablename__ = "payroll"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employee_profiles.id"),
        nullable=False,
        unique=True,
        index=True
    )

    # Main wage
    wage: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    # Salary component configuration
    basic_percentage: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=50,
        nullable=False
    )

    hra_percentage: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=50,
        nullable=False
    )

    standard_allowance: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=4167,
        nullable=False
    )

    performance_bonus_percentage: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=8.33,
        nullable=False
    )

    lta_percentage: Mapped[Decimal] = mapped_column(
        Numeric(5, 3),
        default=8.333,
        nullable=False
    )

    # Statutory deductions
    pf_rate: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=12,
        nullable=False
    )

    professional_tax: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=200,
        nullable=False
    )

    # Calculated salary values
    basic_salary: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    allowances: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    deductions: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    net_salary: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0,
        nullable=False
    )

    # Attendance/payable days
    payable_days: Mapped[Decimal] = mapped_column(
        Numeric(6, 2),
        default=0,
        nullable=False
    )

    total_working_days: Mapped[Decimal] = mapped_column(
        Numeric(6, 2),
        default=0,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )