import { useDocumentStore } from "../../store/useDocumentStore";
import { useEffect, useState } from "react";
import styles from "../../styles/DeleteModal.module.css";
import { TriangleAlert } from "lucide-react";

export default function DocumentDeleteModal({ isDeleteModalOpen, selectedDoc, closeDeleteModal }) {
    if (!isDeleteModalOpen) return null;

    const {
        isDeleteDocumentLoading,
        deleteDocument
    } = useDocumentStore();

    const [ confirmationText, setConfirmationText ] = useState("");
    const [isMatch, setIsMatch ] = useState(false);

    useEffect(() => {
        setIsMatch(confirmationText === selectedDoc.idDoc)
    }, [confirmationText]);

    const handleDelete = async () => {
        const isSuccess = await deleteDocument(selectedDoc.idDoc)

        if (isSuccess) {
            closeDeleteModal();
        }
    }

    return (
        <div className={styles.container} onClick={closeDeleteModal}>
            <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className={styles.header}>
                    <TriangleAlert className={styles.warningIcon} />
                    <h2>Delete Data Permanently</h2>
                </div>

                {/* MESSAGE */}
                <div className={styles.warningText}>
                    <p>Are you sure you want to delete <strong>{selectedDoc.idDoc}</strong>?</p>
                    <p>This action will automatically result deleting <span>the Document Number data permanently</span>.</p>
                </div>

                {/* VALIDATION INPUT */}
                <div className={styles.validationSection}>
                    <label>To proceed, type <strong>"{selectedDoc.idDoc}"</strong> below here:</label>
                    <input
                        className={styles.inputValidation}
                        type="text" 
                        placeholder={selectedDoc.idDoc}
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
                    />
                </div>

                {/* ACTION BUTTON */}
                <div className={styles.actionButtons}>
                    <button className={styles.btnCancel} onClick={closeDeleteModal}>
                        Cancel
                    </button>

                    <button
                        className={styles.btnDelete}
                        disabled={!isMatch}
                        onClick={handleDelete}
                    >
                        {isDeleteDocumentLoading ? (
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