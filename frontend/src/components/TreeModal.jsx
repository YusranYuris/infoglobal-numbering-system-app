import { useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import styles from "../styles/TreeModal.module.css";
import { useDrawingNumberStore } from "../store/useDrawingNumberStore";

export default function TreeModal({ isTreeModalOpen, selectedBranch, closeTreeModal }) {
    if (!isTreeModalOpen) return null;

    const { dnFamily, fetchTree } = useDrawingNumberStore();

    const currentRootId = selectedBranch?.rootId;

    useEffect(() => {
        if (currentRootId) {
            fetchTree(currentRootId);
        }
    }, [fetchTree]);

    const NodeCard = ({ idBranch, description }) => (
        <div className={selectedBranch.idBranch == idBranch ? styles.nodeCardActive : styles.nodeCard}>
            <h4 className={selectedBranch.idBranch == idBranch ? styles.titleActive : styles.title}>{description || "No Title"}</h4>
            <p className={selectedBranch.idBranch == idBranch ? styles.subtitleActive : styles.subtitle}>{idBranch || "No ID"}</p>
        </div>
    );

    // PERBAIKAN 2: Pindahkan juga fungsi rekursif ke luar komponen utama.
    const RenderChild = ({ listChild }) => {
        if (!listChild || listChild.length === 0) return null;

        return listChild.map((node) => {
            const hasChildren = node.child && node.child.length > 0;

            return(
                <TreeNode 
                    key={node.idBranch} 
                    label={<NodeCard idBranch={node.idBranch} description={node.description} />}
                >
                    {hasChildren && <RenderChild listChild={node.child} />}
                </TreeNode>
        )});
    };

    if (!dnFamily || !dnFamily.idBranch) {
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
                    label={<NodeCard idBranch={dnFamily.idBranch} description={dnFamily.description} />}
                >
                    <RenderChild listChild={dnFamily.child} />
                </Tree>
            </div>
        </div>
    );
}