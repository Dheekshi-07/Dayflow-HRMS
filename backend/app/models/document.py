from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employee_profiles.id"),
        nullable=False,
        index=True
    )

    document_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    document_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
