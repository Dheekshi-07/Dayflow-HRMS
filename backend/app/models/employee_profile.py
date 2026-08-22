from datetime import date, datetime

from sqlalchemy import Date, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class EmployeeProfile(Base):
    __tablename__ = "employee_profiles"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    employee_id: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    address: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    date_of_birth: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    department: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    designation: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    joining_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=False
    )

    profile_picture: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    # Authentication fields

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="employee"
    )

    must_change_password: Mapped[bool] = mapped_column(
        nullable=False,
        default=True
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