import { usePartNumberStore } from "../../store/usePartNumberStore";
import styles from "../../styles/PDFModal.module.css"


export default function PartNumberPDFModal({ isPDFModalOpen, selectedPart, closePDFModal }) {
    if (!isPDFModalOpen) return null;

    return (
        <div className={styles.container} onClick={closePDFModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <iframe
                    className={styles.modalIframe}
                    src={selectedPart.pdfUrl}
                    title="Document Viewer"
                />
            </div>
        </div>
    )
}