import { useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import styles from "../../styles/TreeModal.module.css";
import { usePartNumberStore } from "../../store/usePartNumberStore";

export default function PnTreeModal({ isTreeModalOpen, selectedPart, closeTreeModal }) {
    if (!isTreeModalOpen) return null;

    const { pnFamily, fetchTree } = usePartNumberStore();

    const currentRootId = selectedPart?.rootId;

    useEffect(() => {
        if (currentRootId) {
            fetchTree(currentRootId);
        }
    }, [fetchTree]);

    const NodeCard = ({ pnCode, description }) => (
        <div className={selectedPart.pnCode == pnCode ? styles.nodeCardActive : styles.nodeCard}>
            <h4 className={selectedPart.pnCode == pnCode ? styles.titleActive : styles.title}>{description || "No Title"}</h4>
            <p className={selectedPart.pnCode == pnCode ? styles.subtitleActive : styles.subtitle}>{pnCode || "No ID"}</p>
        </div>
    );

    // PERBAIKAN 2: Pindahkan juga fungsi rekursif ke luar komponen utama.
    const RenderChild = ({ listChild }) => {
        if (!listChild || listChild.length === 0) return null;

        return listChild.map((node) => {
            const hasChildren = node.child && node.child.length > 0;

            return(
                <TreeNode 
                    key={node.pnCode} 
                    label={<NodeCard pnCode={node.pnCode} description={node.description} />}
                >
                    {hasChildren && <RenderChild listChild={node.child} />}
                </TreeNode>
        )});
    };

    if (!pnFamily || !pnFamily.pnCode) {
        return (
            <div className={styles.container}>
                <div className={styles.modalContent}>
                    <p style={{ color: '#000', padding: '20px' }}>Loading Tree Structure...</p>
                    <button onClick={closeTreeModal}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container} onClick={closeTreeModal}>
            
            <div className={styles.chartWrapper} onClick={(e) => e.stopPropagation()}>
                <Tree
                    lineWidth={'2px'}
                    lineColor={'#cbd5e1'}
                    lineBorderRadius={'8px'}
                    label={<NodeCard pnCode={pnFamily.pnCode} description={pnFamily.description} />}
                >
                    <RenderChild listChild={pnFamily.child} />
                </Tree>
            </div>
        </div>
    );
}