from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentCreate(BaseModel):
    employee_id: str
    document_name: str
    document_url: str


class DocumentResponse(BaseModel):
    id: int
    employee_id: int
    document_name: str
    document_url: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)
