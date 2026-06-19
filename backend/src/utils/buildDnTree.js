export const buildDnTree = (flatData) => {
    const map = {};
    let root = null;

    flatData.forEach(item => {
        map[item.idBranch] = {...item, child: []};
    });

    flatData.forEach(item => {
        const currentNode = map[item.idBranch];

        if (item.group === 0) {
            root = currentNode;
        } else {
            let parentId = null;

            if (item.subGroup === 0) {
                parentId = `${item.rootId}-00-000`
            } else if (item.subSg === 0) {
                parentId = `${item.rootId}-${String(item.group).padStart(2, '0')}-000`
            } else if (item.subSg !== 0) {
                parentId = `${item.rootId}-${String(item.group).padStart(2, '0')}-${String(item.subGroup).padStart(3, '0')}`
            }

            if (parentId && map[parentId]) {
                map[parentId].child.push(currentNode);
            }
        }
    });

    return root;
}