import { useEffect, useState } from "react";
import styles from "../../styles/DeleteModal.module.css";
import { useDrawingNumberStore } from "../../store/useDrawingNumberStore";
import { TriangleAlert } from "lucide-react";

export default function DnDeleteModal({ isDeleteModalOpen, selectedBranch, closeDeleteModal }) {
    if (!isDeleteModalOpen) return null;

    const { isPreviewDeleteBranchLoading, isDeleteBranchLoading, affectedBranches, fetchPreviewDeleteBranch, deleteDrawingNumber, deleteBranch} = useDrawingNumberStore();
    const [ isExpanded, setIsExpanded ] = useState(false);
    const [ confirmationText, setConfirmationText ] = useState("");
    const [ isMatch, setIsMatch ] = useState(false);

    useEffect(() => {
        fetchPreviewDeleteBranch(selectedBranch.idBranch);
    }, [fetchPreviewDeleteBranch]);

    useEffect(() => {
        setIsMatch(confirmationText === selectedBranch.idBranch)
    }, [confirmationText]);

    const handleDelete = async () => {
        let isSuccess = false;
        if (selectedBranch.group === 0) {
            isSuccess = await deleteDrawingNumber(selectedBranch.rootId)
        } else {
            isSuccess = await deleteBranch(selectedBranch.idBranch)
        }

        console.log(isSuccess)

        if (isSuccess) {
            closeDeleteModal();
        }
    }

    return (
        <div className={styles.container} onClick={closeDeleteModal}>
            {isPreviewDeleteBranchLoading ? <span className={styles.spinner} /> : (
                <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className={styles.header}>
                    <TriangleAlert className={styles.warningIcon} />
                    <h2>Delete Data Permanently</h2>
                </div>

                {/* MESSAGE */}
                <div className={styles.warningText}>
                    <p>Are you sure you want to delete <strong>{selectedBranch.idBranch}</strong>?</p>
                    {affectedBranches.length > 0 && (
                        <p>
                            This action will automatically result deleting <span className={styles.countText}>{affectedBranches.length} other data</span> permanently.
                        </p>
                    )}
                </div>

                {/* ACCORDION PREVIEW */}
                {affectedBranches.length > 0 && (
                    <div className={styles.accordionSection}>
                        <button
                            className={styles.accordionToggle}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <span>{isExpanded ? "▼" : "▶"} See all affected data ({affectedBranches.length})</span>
                        </button>

                        {isExpanded && (
                            <div className={styles.previewList}>
                                <ul>
                                    {affectedBranches.map((item, index) => (
                                        <li key={index}>{item.idBranch} ({item.description})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* VALIDATION INPUT */}
                <div className={styles.validationSection}>
                    <label>To proceed, type <strong>"{selectedBranch.idBranch}"</strong> below here:</label>
                    <input 
                        className={styles.inputValidation}
                        type="text" 
                        placeholder={selectedBranch.idBranch}
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
                        {isDeleteBranchLoading ? (
                            <span className={styles.btnSpinner} />
                        ) : (
                            <>
                            Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
            )}
        </div>
    )
}