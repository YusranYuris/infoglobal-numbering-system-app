import { useEffect, useState } from "react";
import styles from "../../styles/ConfirmationModal.module.css";
import { useDrawingNumberStore } from "../../store/useDrawingNumberStore";
import { TriangleAlert } from "lucide-react";

export default function DrawingNumberConfirmationModal({ isConfirmationModalOpen, closeConfirmationModal }) {
    if (!isConfirmationModalOpen) return null;

    const {
        isDrawingNumberLoading,
        previewDn,
        modalMessage,
        addDrawingNumber
    } = useDrawingNumberStore();

    const handleAddDrawingNumber = async () => {
        const isSuccess = await addDrawingNumber()

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
                    <p>{modalMessage}<strong>{previewDn}</strong>?</p>
                </div>

                {/* ACTION BUTTON */}
                <div className={styles.actionButtons}>
                    <button className={styles.btnCancel} onClick={closeConfirmationModal}>
                        No, I want to change
                    </button>

                    <button
                        className={styles.btnDelete}
                        onClick={handleAddDrawingNumber}  
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