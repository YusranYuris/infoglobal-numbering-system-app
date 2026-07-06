import { useEffect, useState } from "react";
import styles from "../../styles/ConfirmationModal.module.css";
import { useDocumentStore } from "../../store/useDocumentStore";
import { TriangleAlert } from "lucide-react";

export default function DocumentConfirmationModal({ isConfirmationModalOpen, closeConfirmationModal }) {
    if (!isConfirmationModalOpen) return null;

    const {
        isDrawingNumberLoading,
        previewDoc,
        modalMessage,
        addDocument
    } = useDocumentStore();

    const handleAddDocument = async () => {
        const isSuccess = await addDocument()

        if (isSuccess) {
            closeConfirmationModal();
        }
    }

    return (
        <div className={styles.container} onClick={closeConfirmationModal}>
            <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className={styles.header}>
                    <TriangleAlert className={styles.warningIcon} />
                    <h2>Confirmation Text</h2>
                </div>

                {/* MESSAGE */}
                <div className={styles.warningText}>
                    <p>{modalMessage}<strong>{previewDoc}</strong>?</p>
                </div>

                {/* ACTION BUTTON */}
                <div className={styles.actionButtons}>
                    <button className={styles.btnCancel} onClick={closeConfirmationModal}>
                        No, I want to change
                    </button>

                    <button
                        className={styles.btnDelete}
                        onClick={handleAddDocument}  
                    >
                        {isDrawingNumberLoading ? (
                            <span className={styles.btnSpinner} />
                        ) : (
                            <>
                            Add
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}