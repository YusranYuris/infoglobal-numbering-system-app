import { useEffect, useState } from "react";
import styles from "../../styles/ConfirmationModal.module.css";
import { usePartNumberStore } from "../../store/usePartNumberStore";
import { TriangleAlert } from "lucide-react";

export default function PartNumberConfirmationModal({ isConfirmationModalOpen, closeConfirmationModal }) {
    if (!isConfirmationModalOpen) return null;

    const {
        isPartNumberLoading,
        previewPn,
        modalMessage,
        addPartNumber
    } = usePartNumberStore();

    const handleAddPartNumber = async () => {
        const isSuccess = await addPartNumber()

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
                    <p>{modalMessage}<strong>{previewPn}</strong>?</p>
                </div>

                {/* ACTION BUTTON */}
                <div className={styles.actionButtons}>
                    <button className={styles.btnCancel} onClick={closeConfirmationModal}>
                        No, I want to change
                    </button>

                    <button
                        className={styles.btnDelete}
                        onClick={handleAddPartNumber}  
                    >
                        {isPartNumberLoading ? (
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