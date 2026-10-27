const DOCUMENTS_META_KEY = "scholarx_document_meta";
const DOCUMENTS_DB_NAME = "scholarx_documents_db";
const DOCUMENTS_STORE_NAME = "files";

/* ========================================================= */
/* Document Metadata                                          */
/* ========================================================= */

export function getDocumentMetadata() {
    try {
        const stored = localStorage.getItem(
            DOCUMENTS_META_KEY
        );

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            "Failed to load document metadata:",
            error
        );

        return [];
    }
}

export function saveDocumentMetadata(
    documents
) {
    try {
        localStorage.setItem(
            DOCUMENTS_META_KEY,
            JSON.stringify(documents)
        );
    } catch (error) {
        console.error(
            "Failed to save document metadata:",
            error
        );
    }
}

/* ========================================================= */
/* IndexedDB                                                   */
/* ========================================================= */

function openDatabase() {
    return new Promise(
        (resolve, reject) => {
            const request =
                indexedDB.open(
                    DOCUMENTS_DB_NAME,
                    1
                );

            request.onupgradeneeded = () => {
                const db =
                    request.result;

                if (
                    !db.objectStoreNames.contains(
                        DOCUMENTS_STORE_NAME
                    )
                ) {
                    db.createObjectStore(
                        DOCUMENTS_STORE_NAME
                    );
                }
            };

            request.onsuccess = () => {
                resolve(
                    request.result
                );
            };

            request.onerror = () => {
                reject(
                    request.error
                );
            };
        }
    );
}

export async function saveDocumentFile(
    id,
    file
) {
    const db =
        await openDatabase();

    return new Promise(
        (resolve, reject) => {
            const transaction =
                db.transaction(
                    DOCUMENTS_STORE_NAME,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    DOCUMENTS_STORE_NAME
                );

            store.put(file, id);

            transaction.oncomplete =
                () => {
                    db.close();
                    resolve(true);
                };

            transaction.onerror = () => {
                db.close();
                reject(
                    transaction.error
                );
            };
        }
    );
}

export async function getDocumentFile(
    id
) {
    const db =
        await openDatabase();

    return new Promise(
        (resolve, reject) => {
            const transaction =
                db.transaction(
                    DOCUMENTS_STORE_NAME,
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    DOCUMENTS_STORE_NAME
                );

            const request =
                store.get(id);

            request.onsuccess = () => {
                db.close();
                resolve(
                    request.result ||
                        null
                );
            };

            request.onerror = () => {
                db.close();
                reject(
                    request.error
                );
            };
        }
    );
}

export async function removeDocumentFile(
    id
) {
    const db =
        await openDatabase();

    return new Promise(
        (resolve, reject) => {
            const transaction =
                db.transaction(
                    DOCUMENTS_STORE_NAME,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    DOCUMENTS_STORE_NAME
                );

            store.delete(id);

            transaction.oncomplete =
                () => {
                    db.close();
                    resolve(true);
                };

            transaction.onerror = () => {
                db.close();
                reject(
                    transaction.error
                );
            };
        }
    );
}

/* ========================================================= */
/* Metadata Helpers                                            */
/* ========================================================= */

export async function addDocument(
    document,
    file = null
) {
    const documents =
        getDocumentMetadata();

    const id =
        crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`;

    const newDocument = {
        id,

        ...document,

        added: true,

        fileName:
            file?.name || null,

        fileSize:
            file?.size || null,

        fileType:
            file?.type || null,

        addedAt:
            new Date().toISOString(),
    };

    if (file) {
        await saveDocumentFile(
            id,
            file
        );
    }

    const updatedDocuments = [
        newDocument,
        ...documents.filter(
            (item) =>
                item.checklistId !==
                document.checklistId
        ),
    ];

    saveDocumentMetadata(
        updatedDocuments
    );

    return updatedDocuments;
}

export async function markDocumentAdded(
    document
) {
    return addDocument(document);
}

export async function removeDocument(
    id
) {
    const documents =
        getDocumentMetadata();

    const document =
        documents.find(
            (item) =>
                item.id === id
        );

    if (document) {
        await removeDocumentFile(
            id
        );
    }

    const updatedDocuments =
        documents.filter(
            (item) =>
                item.id !== id
        );

    saveDocumentMetadata(
        updatedDocuments
    );

    return updatedDocuments;
}

export async function removeChecklistDocument(
    checklistId
) {
    const documents =
        getDocumentMetadata();

    const existing =
        documents.find(
            (item) =>
                item.checklistId ===
                checklistId
        );

    if (existing) {
        await removeDocumentFile(
            existing.id
        );
    }

    const updatedDocuments =
        documents.filter(
            (item) =>
                item.checklistId !==
                checklistId
        );

    saveDocumentMetadata(
        updatedDocuments
    );

    return updatedDocuments;
}

const CUSTOM_DOCUMENTS_KEY =
    "scholarx_custom_document_checklist";

export function getCustomDocuments() {
    try {
        const stored =
            localStorage.getItem(
                CUSTOM_DOCUMENTS_KEY
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            "Failed to load custom documents:",
            error
        );

        return [];
    }
}

export function saveCustomDocuments(
    documents
) {
    localStorage.setItem(
        CUSTOM_DOCUMENTS_KEY,
        JSON.stringify(documents)
    );
}

export function addCustomDocument(
    document
) {
    const documents =
        getCustomDocuments();

    const updated = [
        ...documents,
        document,
    ];

    saveCustomDocuments(
        updated
    );

    return updated;
}