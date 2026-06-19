export const buildPnTree = (flatData) => {
    const map = {};
    const roots = [];

    flatData.forEach(item => {
        const key = `${item.rootId}|${item.pnCode}`
        map[key] = {...item, child: []};
    });

    flatData.forEach(item => {
        const nodeKey = `${item.rootId}|${item.pnCode}`;

        const node = map[nodeKey]

        if (item.parentId === item.pnCode && item.hierarchy === 1) {
            roots.push(node)
        } else {
            const parentKey = `${item.rootId}|${item.parentId}`;

            const parent = map[parentKey];

            if (parent) {
                parent.child.push(node)
            }
        }
    });

    return roots;
}