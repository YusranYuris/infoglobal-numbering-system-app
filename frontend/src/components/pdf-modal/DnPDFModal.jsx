import { useDrawingNumberStore } from "../../store/useDrawingNumberStore";
import styles from "../../styles/PDFModal.module.css"


export default function DrawingNumberPDFModal({ isPDFModalOpen, selectedBranch, closePDFModal }) {
    if (!isPDFModalOpen) return null;

    return (
        <div className={styles.container} onClick={closePDFModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <iframe
                    className={styles.modalIframe}
                    src={selectedBranch.pdfUrl}
                    title="Document Viewer"
                />
            </div>
        </div>
    )
}