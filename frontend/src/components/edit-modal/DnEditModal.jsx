import { useEffect, useState } from "react";
import styles from "../../styles/EditModal.module.css";
import { useDrawingNumberStore } from "../../store/useDrawingNumberStore";
import { Eye, FileText, SquarePen, Trash2, TriangleAlert } from "lucide-react";

export default function DnEditModal({ isEditModalOpen, selectedBranch, closeEditModal }) {
    if (!isEditModalOpen) return null;

    const { isDnBranchEditModalLoading , isEditDnBranchLoading, editDnBranchFormData, setEditDnBranchFormData, fetchDnBranch, updateDnBranch} = useDrawingNumberStore();

    useEffect(() => {
        fetchDnBranch(selectedBranch.idBranch)
    }, [fetchDnBranch])

    const handleDelete = async () => {
        const isSuccess = await updateDnBranch(selectedBranch.idBranch)

        if (isSuccess) {
            closeEditModal();
        }
    }

    return (
        <div className={styles.container} onClick={closeEditModal}>
            {isDnBranchEditModalLoading ? <span className={styles.spinner} /> : (
                <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className={styles.header}>
                    <SquarePen className={styles.editIcon} />
                    <h2>Edit Part Number {selectedBranch.idBranch}</h2>
                </div>

                <div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Drawing Number</span>
                        <span className={styles.infoValue}>{selectedBranch.idBranch}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Requester</span>
                         <span className={styles.infoValue}>{selectedBranch.createdBy}</span>
                    </div>

                    <div className={styles.infoRow}>   
                        <span className={styles.infoLabel}>Description</span>
                        <input 
                            type="text" 
                            value={editDnBranchFormData.description}
                            className={styles.editInput}
                            onChange={(e) => setEditDnBranchFormData({...editDnBranchFormData, description: e.target.value})}
                        />
                    </div>

                    <div className={styles.pdfContainer}>
                        <label className={styles.formLabel}>
                            PDF Attachment
                        </label>

                        <div className={styles.pdfCard}>
                            <label htmlFor="edit-dn-branch-pdf" className={styles.uploadArea}>
                                <div className={styles.fileInfo}>
                                    <span className={styles.pdfIcon}>
                                        <FileText size={18} />
                                    </span>

                                    <span className={styles.fileName}>
                                        {editDnBranchFormData.pdf
                                            ? editDnBranchFormData.pdf.name
                                            : editDnBranchFormData.pdfUrl
                                            ? `${selectedBranch.idBranch} ${selectedBranch.description}`
                                            : "Click to upload PDF"
                                        }
                                    </span>
                                </div>
                            </label>

                            {(editDnBranchFormData.pdfUrl || editDnBranchFormData.pdf) && (
                                <div className={styles.fileActions}>

                                    {editDnBranchFormData.pdfUrl && (
                                        <a
                                            href={editDnBranchFormData.pdfUrl}
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
                                            setEditDnBranchFormData({
                                                ...editDnBranchFormData,
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
                            id="edit-dn-branch-pdf"
                            hidden
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                setEditDnBranchFormData({
                                    ...editDnBranchFormData,
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
                        {isEditDnBranchLoading ? (
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