import os

from fastapi import APIRouter, Depends, HTTPException
from mysql.connector import Error
from pydantic import BaseModel, Field, model_validator

from api.auth.dependencies import get_current_user
from database.connection import get_db_connection


router = APIRouter(
    prefix="/api/student-documents",
    tags=["Student Documents"],
)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


class StudentDocumentRequest(BaseModel):
    checklist_id: str = Field(min_length=1, max_length=100)
    has_document: bool = True
    original_filename: str | None = Field(default=None, max_length=255)
    file_size_bytes: int | None = Field(default=None, ge=0)

    @model_validator(mode="after")
    def validate_metadata(self):
        if self.original_filename is not None:
            filename = self.original_filename.strip()

            if not filename or not filename.lower().endswith(".pdf"):
                raise ValueError("The selected filename must be a PDF.")

            if self.file_size_bytes is None:
                raise ValueError("File size is required when a filename is provided.")

            if self.file_size_bytes > MAX_FILE_SIZE:
                raise ValueError("PDF files must be 10 MB or smaller.")

            self.original_filename = os.path.basename(
                filename.replace("\\", "/")
            )

        if not self.has_document:
            self.original_filename = None
            self.file_size_bytes = None

        return self


def _connection():
    try:
        return get_db_connection()
    except Error:
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to the database.",
        )


@router.get("/")
def get_student_documents(
    current_user: dict = Depends(get_current_user),
):
    connection = _connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT checklist_id, has_document, original_filename,
                   file_size_bytes, created_at, updated_at
            FROM user_documents
            WHERE user_id = %s
            ORDER BY id ASC
            """,
            (current_user["user_id"],),
        )

        records = cursor.fetchall() or []

        for record in records:
            record["has_document"] = bool(record["has_document"])
            for field in ("created_at", "updated_at"):
                if record[field] is not None:
                    record[field] = record[field].isoformat()

        return {
            "status": "success",
            "documents": records,
        }

    except Error:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve student documents.",
        )
    finally:
        cursor.close()
        connection.close()


@router.post("/")
def save_student_document(
    data: StudentDocumentRequest,
    current_user: dict = Depends(get_current_user),
):
    checklist_id = data.checklist_id.strip()

    if not checklist_id:
        raise HTTPException(
            status_code=422,
            detail="Checklist ID cannot be empty.",
        )

    connection = _connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            INSERT INTO user_documents
                (user_id, checklist_id, has_document,
                 original_filename, file_size_bytes)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                has_document = VALUES(has_document),
                original_filename = VALUES(original_filename),
                file_size_bytes = VALUES(file_size_bytes),
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                current_user["user_id"],
                checklist_id,
                data.has_document,
                data.original_filename,
                data.file_size_bytes,
            ),
        )

        connection.commit()

        cursor.execute(
            """
            SELECT checklist_id, has_document, original_filename,
                   file_size_bytes, created_at, updated_at
            FROM user_documents
            WHERE user_id = %s AND checklist_id = %s
            """,
            (current_user["user_id"], checklist_id),
        )

        record = cursor.fetchone()
        record["has_document"] = bool(record["has_document"])

        for field in ("created_at", "updated_at"):
            if record[field] is not None:
                record[field] = record[field].isoformat()

        return {
            "status": "success",
            "message": "Document checklist updated successfully.",
            "document": record,
        }

    except Error:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to save student document.",
        )
    finally:
        cursor.close()
        connection.close()


@router.delete("/{checklist_id}")
def delete_student_document(
    checklist_id: str,
    current_user: dict = Depends(get_current_user),
):
    connection = _connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            DELETE FROM user_documents
            WHERE user_id = %s AND checklist_id = %s
            """,
            (current_user["user_id"], checklist_id),
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Document record not found.",
            )

        connection.commit()

        return {
            "status": "success",
            "message": "Document record removed successfully.",
        }

    except HTTPException:
        connection.rollback()
        raise
    except Error:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to remove student document.",
        )
    finally:
        cursor.close()
        connection.close()