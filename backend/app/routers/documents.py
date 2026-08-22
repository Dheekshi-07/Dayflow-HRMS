from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.document import Document
from app.models.employee_profile import EmployeeProfile
from app.schemas.document import DocumentCreate, DocumentResponse


router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"]
)


@router.post(
    "/",
    response_model=DocumentResponse,
    status_code=201
)
def upload_document(
    document_data: DocumentCreate,
    db: Session = Depends(get_db)
):
    # Find employee
    employee = db.query(EmployeeProfile).filter(
        EmployeeProfile.employee_id == document_data.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    document = Document(
        employee_id=employee.id,
        document_name=document_data.document_name,
        document_url=document_data.document_url
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


@router.get(
    "/employee/{employee_id}",
    response_model=list[DocumentResponse]
)
def get_employee_documents(
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

    documents = db.query(Document).filter(
        Document.employee_id == employee.id
    ).order_by(
        Document.uploaded_at.desc()
    ).all()

    return documents
