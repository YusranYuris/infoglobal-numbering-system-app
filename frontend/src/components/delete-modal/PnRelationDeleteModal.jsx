import { useEffect, useState } from "react";
import styles from "../../styles/DeleteModal.module.css";
import { usePartNumberStore } from "../../store/usePartNumberStore";
import { TriangleAlert } from "lucide-react";

export default function PnRelationDeleteModal({ isPnRelationDeleteModalOpen, selectedPart, closePnRelationDeleteModal }) {
    if (!isPnRelationDeleteModalOpen) return null;

    const { isPreviewDeletePnRelationLoading, isDeletePnRelationLoading, affectedPn, fetchPreviewDeletePnRelation, deletePnRelation} = usePartNumberStore();
    const [ isExpanded, setIsExpanded ] = useState(false);
    const [ confirmationText, setConfirmationText ] = useState("");
    const [ isMatch, setIsMatch ] = useState(false);

    useEffect(() => {
        fetchPreviewDeletePnRelation(selectedPart.idRelations);
    }, [fetchPreviewDeletePnRelation]);

    useEffect(() => {
        setIsMatch(confirmationText === selectedPart.pnCode)
    }, [confirmationText]);

    const handleDelete = async () => {
        const isSuccess = await deletePnRelation(selectedPart.idRelations)

        if (isSuccess) {
            closePnRelationDeleteModal();
        }
    }

    return (
        <div className={styles.container} onClick={closePnRelationDeleteModal}>
            {isPreviewDeletePnRelationLoading ? <span className={styles.spinner} /> : (
                <div className={styles.dialogBox} onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className={styles.header}>
                    <TriangleAlert className={styles.warningIcon} />
                    <h2>Delete Data Permanently</h2>
                </div>

                {/* MESSAGE */}
                <div className={styles.warningText}>
                    <p>Are you sure you want to delete <strong>{selectedPart.pnCode}</strong>?</p>
                    {affectedPn.length > 0 && (
                        <p>
                            This action will automatically result deleting <span className={styles.countText}>{affectedPn.length} other data</span> permanently.
                        </p>
                    )}
                </div>

                {/* ACCORDION PREVIEW */}
                {affectedPn.length > 0 && (
                    <div className={styles.accordionSection}>
                        <button
                            className={styles.accordionToggle}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <span>{isExpanded ? "▼" : "▶"} See all affectedPn data ({affectedPn.length})</span>
                        </button>

                        {isExpanded && (
                            <div className={styles.previewList}>
                                <ul>
                                    {affectedPn.map((item, index) => (
                                        <li key={index}>{item.pnCode} ({item.description})</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* VALIDATION INPUT */}
                <div className={styles.validationSection}>
                    <label>To proceed, type <strong>"{selectedPart.pnCode}"</strong> below here:</label>
                    <input 
                        className={styles.inputValidation}
                        type="text" 
                        placeholder={selectedPart.idBranch}
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
                    />
                </div>

                {/* ACTION BUTTON */}
                <div className={styles.actionButtons}>
                    <button className={styles.btnCancel} onClick={closePnRelationDeleteModal}>
                        Cancel
                    </button>

                    <button
                        className={styles.btnDelete}
                        disabled={!isMatch}
                        onClick={handleDelete}  
                    >
                        {isDeletePnRelationLoading ? (
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