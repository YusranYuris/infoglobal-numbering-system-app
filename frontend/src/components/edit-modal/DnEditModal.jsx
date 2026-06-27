import { useEffect, useState } from "react";
import styles from "../../styles/EditModal.module.css";
import { useDrawingNumberStore } from "../../store/useDrawingNumberStore";
import { Eye, FileText, SquarePen, Trash2, TriangleAlert } from "lucide-react";

export default function DnEditModal({ isEditModalOpen, selectedBranch, closeEditModal }) {
    if (!isEditModalOpen) return null;

    const { isPartNumberEditModalLoading , isEditPartNumberLoading, editPnFormData, setEditPnFormData, fetchPartNumber, updatePartNumber} = usePartNumberStore();

    useEffect(() => {
        fetchPartNumber(selectedBranch.idPn)
    }, [fetchPartNumber])

    const handleDelete = async () => {
        const isSuccess = await updatePartNumber(selectedBranch.idPn)

        if (isSuccess) {
            closeEditModal();
        }
    }

    return (
        <div className={styles.container} onClick={closeEditModal}>
            {isPartNumberEditModalLoading ? <span className={styles.spinner} /> : (
                <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className={styles.header}>
                    <SquarePen className={styles.editIcon} />
                    <h2>Edit Part Number {selectedBranch.idPn}</h2>
                </div>

                <div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Part Number</span>
                        <span className={styles.infoValue}>{selectedBranch.idPn}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Requester</span>
                         <span className={styles.infoValue}>{selectedBranch.createdBy}</span>
                    </div>

                    <div className={styles.infoRow}>   
                        <span className={styles.infoLabel}>Description</span>
                        <input 
                            type="text" 
                            value={editPnFormData.description}
                            className={styles.editInput}
                            onChange={(e) => setEditPnFormData({...editPnFormData, description: e.target.value})}
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
                                        {editPnFormData.pdf
                                            ? editPnFormData.pdf.name
                                            : editPnFormData.pdfUrl
                                            ? `${selectedBranch.idPn} ${selectedBranch.description}`
                                            : "Click to upload PDF"
                                        }
                                    </span>
                                </div>
                            </label>

                            {(editPnFormData.pdfUrl || editPnFormData.pdf) && (
                                <div className={styles.fileActions}>

                                    {editPnFormData.pdfUrl && (
                                        <a
                                            href={editPnFormData.pdfUrl}
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
                                            setEditPnFormData({
                                                ...editPnFormData,
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
                                setEditPnFormData({
                                    ...editPnFormData,
                                    pdf: e.target.files[0],
                                })
                            }
                        />

                    </div>
                </div>

                {/* ACTION BUTTON */}
                <div className={styles.actionButtons}>
                    <button className={styles.btnCancel} onClick={closeEditModal}>
                        Cancel
                    </button>

                    <button
                        className={styles.btnEdit}
                        onClick={handleDelete}  
                    >
                        {isEditPartNumberLoading ? (
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