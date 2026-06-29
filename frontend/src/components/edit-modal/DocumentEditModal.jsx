import { useDocumentStore } from "../../store/useDocumentStore";
import { useEffect, useState } from "react";
import styles from "../../styles/EditModal.module.css";
import { Eye, FileText, SquarePen, Trash2 } from "lucide-react";

export default function DocumentEditModal({ isEditModalOpen, selectedDoc, closeEditModal}) {
    if (!isEditModalOpen) return null;

    const {
        isDocumentEditModalLoading,
        isEditDocumentLoading,
        editDocFormData,
        setEditDocFormData,
        resetEditDocFormData,
        fetchDocument,
        updateDocument
    } = useDocumentStore();

    useEffect(() => {
        fetchDocument(selectedDoc.idDoc)
    }, [fetchDocument]);

    const handleDelete = async () => {
        const isSuccess = await updateDocument(selectedDoc.idDoc)

        if (isSuccess) {
            closeEditModal();
        }
    };

    const handleClose = async () => {
        closeEditModal()
        resetEditDocFormData()
    };

    return (
        <div className={styles.container} onClick={handleClose}>
            {isDocumentEditModalLoading ? <span className={styles.spinner} /> : (
                <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>

                    {/* HEADER */}
                    <div className={styles.header}>
                        <SquarePen className={styles.editIcon} />
                        <h2>Edit Document Number {selectedDoc.idDoc}</h2>
                    </div>

                    <div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Document Number</span>
                            <span className={styles.infoValue}>{selectedDoc.idDoc}</span>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Requester</span>
                            <span className={styles.infoValue}>{selectedDoc.createdBy}</span>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Description</span>
                            <input
                                type="text"
                                value={editDocFormData.description}
                                className={styles.editInput}
                                onChange={(e) => setEditDocFormData({...editDocFormData, description: e.target.value})}
                            />
                        </div>

                        <div className={styles.pdfContainer}>
                            <label className={styles.formLabel}>
                                PDF Attachment
                            </label>

                            <div className={styles.pdfCard}>
                                <label htmlFor="edit-pn-pdf" className={styles.uploadArea}>
                                    <div className={styles.fileInfo}>
                                        <span className={styles.pdfIcon}>
                                            <FileText size={18} />
                                        </span>

                                        <span className={styles.fileName}>
                                            {editDocFormData.pdf
                                                ? editDocFormData.pdf.name
                                                : editDocFormData.pdfUrl
                                                ? `${selectedDoc.idDoc} ${selectedDoc.description}`
                                                : "Click to upload PDF"
                                            }
                                        </span>
                                    </div>
                                </label>

                                {(editDocFormData.pdfUrl || editDocFormData.pdf) && (
                                    <div className={styles.fileActions}>

                                        {editDocFormData.pdfUrl && (
                                            <a
                                                href={editDocFormData.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.iconBtn}
                                                title="View PDF"
                                            >
                                                <Eye size={18} />
                                            </a>
                                        )}

                                        <button
                                            type="button"
                                            className={styles.iconBtnDanger}
                                            onClick={() =>
                                                setEditDocFormData({
                                                    ...editDocFormData,
                                                    pdf: null,
                                                    pdfUrl: "",
                                                })
                                            }
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>
                                )}
                            </div>
                            <input
                                id="edit-pn-pdf"
                                hidden
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setEditDocFormData({
                                        ...editDocFormData,
                                        pdf: e.target.files[0],
                                    })
                                }
                            />

                        </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <div className={styles.actionButtons}>
                        <button className={styles.btnCancel} onClick={handleClose}>
                            Cancel
                        </button>

                        <button
                            className={styles.btnEdit}
                            onClick={handleDelete}
                        >
                            {isEditDocumentLoading ? (
                                <span className={styles.btnSpinner} />
                            ) : (
                                <>
                                Edit
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}