import { useDocumentStore } from "../../store/useDocumentStore";
import styles from "../../styles/PDFModal.module.css"


export default function DocumentPDFModal({ isPDFModalOpen, selectedDoc, closePDFModal }) {
    if (!isPDFModalOpen) return null;

    return (
        <div className={styles.container} onClick={closePDFModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <iframe
                    className={styles.modalIframe}
                    src={selectedDoc.pdfUrl}
                    title="Document Viewer"
                />
            </div>
        </div>
    )
}