
const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");

const DOCUMENTS_URL = `${API_BASE_URL}/api/student-documents/`;

async function documentRequest(path = "", options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in to manage your documents.");
    }

    const response = await fetch(`${DOCUMENTS_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            result.detail || "Unable to process your document request."
        );
    }

    return result;
}

export async function getStudentDocuments() {
    const result = await documentRequest();
    return result.documents || [];
}

export async function saveStudentDocument({
    checklistId,
    hasDocument = true,
    file = null,
}) {
    return documentRequest("", {
        method: "POST",
        body: JSON.stringify({
            checklist_id: checklistId,
            has_document: hasDocument,
            original_filename: file?.name || null,
            file_size_bytes: file ? file.size : null,
        }),
    });
}

export async function deleteStudentDocument(checklistId) {
    return documentRequest(encodeURIComponent(checklistId), {
        method: "DELETE",
    });
}
