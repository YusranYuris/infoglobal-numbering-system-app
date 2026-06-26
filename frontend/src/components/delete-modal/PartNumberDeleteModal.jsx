import { useEffect, useState } from "react";
import styles from "../../styles/DeleteModal.module.css";
import { usePartNumberStore } from "../../store/usePartNumberStore";
import { TriangleAlert } from "lucide-react";

export default function PartNumbernDeleteModal({ isPartNumberDeleteModalOpen, selectedPart, closePartNumberDeleteModal }) {
    if (!isPartNumberDeleteModalOpen) return null;

    const { isDeletePartNumberLoading, deletePartNumber} = usePartNumberStore();
    const [ isExpanded, setIsExpanded ] = useState(false);
    const [ confirmationText, setConfirmationText ] = useState("");
    const [ isMatch, setIsMatch ] = useState(false);

    useEffect(() => {
        setIsMatch(confirmationText === selectedPart.idPn)
    }, [confirmationText]);

    const handleDelete = async () => {
        const isSuccess = await deletePartNumber(selectedPart.idPn)

        if (isSuccess) {
            closePartNumberDeleteModal();
        }
    }

    return (
        <div className={styles.container} onClick={closePartNumberDeleteModal}>
            <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className={styles.header}>
                    <TriangleAlert className={styles.warningIcon} />
                    <h2>Delete Data Permanently</h2>
                </div>

                {/* MESSAGE */}
                <div className={styles.warningText}>
                    <p>Are you sure you want to delete <strong>{selectedPart.idPn}</strong>?</p>
                    <p>This action will automatically result deleting <span>other Part Number Relation data permanently</span>.</p>
                </div>

                {/* VALIDATION INPUT */}
                <div className={styles.validationSection}>
                    <label>To proceed, type <strong>"{selectedPart.idPn}"</strong> below here:</label>
                    <input 
                        className={styles.inputValidation}
                        type="text" 
                        placeholder={selectedPart.idPn}
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
                    />
                </div>

                {/* ACTION BUTTON */}
                <div className={styles.actionButtons}>
                    <button className={styles.btnCancel} onClick={closePartNumberDeleteModal}>
                        Cancel
                    </button>

                    <button
                        className={styles.btnDelete}
                        disabled={!isMatch}
                        onClick={handleDelete}  
                    >
                        {isDeletePartNumberLoading ? (
                            <span className={styles.btnSpinner} />
                        ) : (
                            <>
                            Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}