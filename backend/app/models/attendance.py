from datetime import date, datetime, time

from sqlalchemy import Date, DateTime, ForeignKey, String, Time, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employee_profiles.id"),
        nullable=False,
        index=True
    )

    attendance_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True
    )

    check_in: Mapped[time | None] = mapped_column(
        Time,
        nullable=True
    )

    check_out: Mapped[time | None] = mapped_column(
        Time,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    working_hours: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    payable_day: Mapped[float] = mapped_column(
        Numeric(4, 2),
        default=0,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )