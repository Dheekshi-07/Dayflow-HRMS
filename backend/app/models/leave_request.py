from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employee_profiles.id"),
        nullable=False,
        index=True
    )

    leave_type_id: Mapped[int] = mapped_column(
        ForeignKey("leave_types.id"),
        nullable=False,
        index=True
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="Pending",
        nullable=False
    )

    admin_comment: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
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