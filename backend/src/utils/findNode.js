export const findNode = (node, pnCode) => {
    if (node.pnCode === pnCode) {
        return node;
    }

    for (const child of node.child) {
        const found = findNode(child, pnCode);

        if (found) {
            return found;
        }
    }

    return null;
};