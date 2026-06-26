export const flattenTreeData = (nestedData = []) => {
  const result = [];

  const recurse = (node) => {
    if (!node) return;

    // Siapkan object flat baru untuk baris tabel ini
    const row = {
      idRelations: node.idRelations,
      pnCode: node.pnCode, // Menyelaraskan property tabel Anda (pnCode bertindak sebagai idBranch)
      rootId: node.rootId,
      parentId: node.parentId,
      hierarchy: node.hierarchy,
      description: node.description || "No Description", // Menjaga jika field kosong
      pdfUrl: node.pdfUrl || null,
      createdBy: node.createdBy || node.createdBy || "AUD"
    };

    result.push(row);

    // Rekursi jika komponen mendeteksi array 'child' berisi data
    if (node.child && node.child.length > 0) {
      node.child.forEach(childNode => recurse(childNode));
    }
  };

  // Iterasi tingkat paling atas (karena data API dibungkus array luar "data": [...])
  nestedData.forEach(rootNode => recurse(rootNode));

  return result;
};