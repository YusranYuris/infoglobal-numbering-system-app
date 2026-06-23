import Navbar from "../components/Navbar.jsx"
import styles from "../styles/PartNumberPage.module.css"
import { usePartNumberStore } from "../store/usePartNumberStore.js"

import { DRAWING_KIND, KIND_CODE, CATEGORY_CODE, FUNCTION_CODE, DESIGNATION_CODE } from "../constants/mastersData.js";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { FileText, RotateCcw, SquarePen, Trash2 } from "lucide-react";
import PnTreeModal from "../components/PnTreeModal.jsx";

const PartNumberPage = () => {
  const user = useAuthStore((state) => state.user)

  const {
    loading,
    isPartNumberLoading,
    isPnRelationLoading,
    error,
    selectedPart,

    isTreeModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,

    openTreeModal,
    openEditModal,
    openDeleteModal,

    closeTreeModal,
    closeEditModal,
    closeDeleteModal,

    partNumbers,
    pnFormData,
    setPnFormData,
    resetPnFormData,

    pnRelationFormData,
    setPnRelationFormData,
    resetPnRelationFormData,

    pnForest,

    searchFilters,
    setSearchFilters,
    resetSearchFilters,

    addPartNumber,
    fetchPartNumbers,
    addPnRelation,
    fetchPnForest
  } = usePartNumberStore();

  useEffect(() => {
    fetchPartNumbers();
    fetchPnForest();
  }, [fetchPartNumbers, fetchPnForest])

  const filteredPartNumbers = pnForest.filter((pn) => {
    const matchPnCode = pn.pnCode?.toLowerCase().includes(searchFilters.pnCode.toLowerCase());
    const matchDescription = pn.description?.toLowerCase().includes(searchFilters.description.toLowerCase());
    const matchRequester = pn.createdBy?.toLowerCase().includes(searchFilters.createdBy.toLowerCase());

    console.log(matchDescription)
    console.log(matchPnCode)
    console.log(matchRequester)

    return matchPnCode && matchDescription && matchRequester
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(name, value);
  }

  return (
    <div className={styles.pageBody}>
      <Navbar />
      <div className={styles.container}>
        
        {/* TITLE */}
        <section className={styles.titleSection}>
          <h1>Part Number</h1>
        </section>

        {user?.role == "admin" && (
          <>
          {/* FORM SECTION */}
          <section className={styles.formSection}>

            {/* PART NUMBER GENERATOR */}
            <div className={styles.formInput}>
              <h2>Part Number Generator</h2>

              <form onSubmit={addPartNumber}>
                <label className={styles.formLabel} htmlFor="pn-kind">Kind</label>
                <select 
                  id="pn-kind"
                  value={pnFormData.kindCode}
                  onChange={(e) => setPnFormData({...pnFormData, kindCode: e.target.value})}
                >
                  <option value="" disabled>Select kind of product type</option>

                  {KIND_CODE.map((kindCode) => {
                    return (
                      <option key={kindCode.id} value={kindCode.id}>
                        {`${kindCode.id} (${kindCode.desc})`}
                      </option>
                    )
                  })}
                </select>

                <label className={styles.formLabel} htmlFor="pn-category">Category</label>
                <select 
                  id="pn-category"
                  value={pnFormData.categoryCode}
                  onChange={(e) => setPnFormData({...pnFormData, categoryCode: e.target.value})}
                >
                  <option value="" disabled>Select project category type</option>

                  {CATEGORY_CODE.map((categoryCode) => {
                    return (
                      <option key={categoryCode.id} value={categoryCode.id}>
                        {`${categoryCode.id} (${categoryCode.desc})`}
                      </option>
                    )
                  })}
                </select>

                <label className={styles.formLabel} htmlFor="pn-function">Function</label>
                <select 
                  id="pn-function"
                  value={pnFormData.functionCode}
                  onChange={(e) => setPnFormData({...pnFormData, functionCode: e.target.value})}
                >
                  <option value="" disabled>Select drawing kind type</option>

                  {FUNCTION_CODE.map((functionCode) => {
                    return (
                      <option key={functionCode.id} value={functionCode.id}>
                        {`${functionCode.id} (${functionCode.desc})`}
                      </option>
                    )
                  })}
                </select>

                <label className={styles.formLabel} htmlFor="pn-designation-code">Designation Code</label>
                <select 
                  id="pn-designation-code"
                  value={pnFormData.designationCode}
                  onChange={(e) => setPnFormData({...pnFormData, designationCode: e.target.value})}
                >
                  <option value="" disabled>Select drawing kind type</option>

                  {DESIGNATION_CODE.map((designationCode) => {
                    return (
                      <option key={designationCode.id} value={designationCode.id}>
                        {`${designationCode.id} (${designationCode.desc})`}
                      </option>
                    )
                  })}
                </select>

                <label className={styles.formLabel} htmlFor="pn-sequence">Sequence (Optional)</label>
                <input 
                  id="pn-sequence" 
                  type="text"
                  placeholder="Enter drawing number sequence"
                  value={pnFormData.sequence}
                  onChange={(e) => setPnFormData({...pnFormData, sequence: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="pn-description">Description</label>
                <input 
                  id="pn-description" 
                  type="text" 
                  placeholder="Enter drawing number description"
                  value={pnFormData.description}
                  onChange={(e) => setPnFormData({...pnFormData, description: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="pn-requester">Requester</label>
                <input 
                  id="pn-requester" 
                  type="text" 
                  placeholder="Enter drawing number requester"
                  value={pnFormData.createdBy}
                  onChange={(e) => setPnFormData({...pnFormData, createdBy: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="pn-pdf">PDF Attachment</label>
                <label htmlFor="pn-pdf" className={styles.uploadBox}>
                  {pnFormData.pdf ? `📄 ${pnFormData.pdf.name}` : <>Click to upload PDF</>}
                </label>
                <input 
                  id="pn-pdf"
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setPnFormData({...pnFormData, pdf: e.target.files[0]})}

                />

                <button 
                  type="submit"
                  disabled={!pnFormData.kindCode || !pnFormData.categoryCode || !pnFormData.functionCode || !pnFormData.designationCode || !pnFormData.description || !pnFormData.createdBy}
                  className={styles.addButton}
                >
                  {isPartNumberLoading ? (
                    <span className={styles.spinner}></span>
                  ) : (
                    <>
                    Add
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* PART NUMBER RELATION GENERATOR */}
            <div className={styles.formInput}>
              <h2>Part Number Relation Generator</h2>

              <form onSubmit={addPnRelation}>
                <label className={styles.formLabel} htmlFor="pn-relation-root">Root</label>
                <select 
                  id="pn-relation-root"
                  value={pnRelationFormData.rootId}
                  onChange={(e) => setPnRelationFormData({...pnRelationFormData, rootId: e.target.value})}
                >
                  {!pnRelationFormData.rootId && (
                    <option value="" disabled>Select part number root</option>
                  )}

                  {partNumbers.map((partNumber) => {
                    return (
                      <option key={partNumber.idPn} value={partNumber.idPn}>
                        {`${partNumber.idPn}`}
                      </option>
                    )
                  })}
                </select>

                <label className={styles.formLabel} htmlFor="pn-relation-parent">Parent</label>
                <select 
                  id="pn-relation-parent"
                  value={pnRelationFormData.parentId}
                  onChange={(e) => setPnRelationFormData({...pnRelationFormData, parentId: e.target.value})}
                >
                  {!pnRelationFormData.parentIid && (
                    <option value="" disabled>Select part number parent</option>
                  )}

                  {partNumbers.map((partNumber) => {
                    return (
                      <option key={partNumber.idPn} value={partNumber.idPn}>
                        {`${partNumber.idPn}`}
                      </option>
                    )
                  })}
                </select>

                <label className={styles.formLabel} htmlFor="pn-relation-pncode">PN Code</label>
                <select 
                  id="pn-relation-pncode"
                  value={pnRelationFormData.pnCode}
                  onChange={(e) => setPnRelationFormData({...pnRelationFormData, pnCode: e.target.value})}
                >
                  {!pnRelationFormData.pnCode && (
                    <option value="" disabled>Select part number</option>
                  )}

                  {partNumbers.map((partNumber) => {
                    return (
                      <option key={partNumber.idPn} value={partNumber.idPn}>
                        {`${partNumber.idPn}`}
                      </option>
                    )
                  })}
                </select>

                <label className={styles.formLabel} htmlFor="pn-hierarchy">Hierarchy</label>
                <input 
                  id="pn-hierarchy" 
                  type="text"
                  placeholder="e.g., 1, 2, 3, ...."
                  value={pnRelationFormData.hierarchy}
                  onChange={(e) => setPnRelationFormData({...pnRelationFormData, hierarchy: e.target.value})}
                />

                <button 
                  type="submit"
                  disabled={!pnRelationFormData.rootId || !pnRelationFormData.hierarchy}
                  className={styles.addButton}
                >
                  {isPnRelationLoading ? (
                    <span className={styles.spinner}></span>
                  ) : (
                    <>
                    Add
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
          </>
        )}

        {/* TABLE SEARCHER */}
        <div className={styles.formSearch}>
          <h2>Part Number Searcher</h2>

          <div className={styles.gridContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="part-number">Part Number</label>
              <input 
                id="part-number"
                type="text"
                name="pnCode"
                placeholder="Search Part Number"
                value={searchFilters.pnCode}
                onChange={handleFilterChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pn-description">Description</label>
              <input 
                id="pn-description"
                type="text"
                name="description"
                placeholder="Search Description"
                value={searchFilters.description}
                onChange={handleFilterChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pn-requester">Requester</label>
              <input 
                id="pn-requester"
                type="text"
                name="createdBy"
                placeholder="Search Requester"
                value={searchFilters.createdBy}
                onChange={handleFilterChange}
              />
            </div>

            <div className={`${styles.resetButtonContainer} ${styles.resetBtnMiddle}`}>
              <button onClick={resetSearchFilters} className={styles.resetButton}>
                <RotateCcw />
                Reset Search Filters
              </button>
            </div>
          </div>
        </div>

        {/* TABLE DATA */}
        <div className={styles.tableContainer}>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Parent</th>
                <th>Child</th>
                <th>Grandchild</th>
                <th>G-Grandchild</th>
                <th>Description</th>
                <th className={styles.textCenter}>Attachment</th>
                <th className={styles.textCenter}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className={styles.textCenter}>Loading Data...</td>
                </tr>
              ) : filteredPartNumbers.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.textCenter}>No Data Found</td>
                </tr>
              ) : (
                filteredPartNumbers.map((pn) => {
                  const isParent = pn.hierarchy === 1;
                  const isChild = pn.hierarchy === 2;
                  const isGrandchild = pn.hierarchy === 3;
                  const isGGrandchild = pn.hierarchy === 4;

                  return (
                    <tr onClick={() => openTreeModal(pn)} key={pn.id}>
                      <td>{isParent ? pn.pnCode : ""}</td>
                      <td>{isChild ? `➥ ${pn.pnCode}` : ""}</td>
                      <td>{isGrandchild ? `➥ ${pn.pnCode}` : ""}</td>
                      <td>{isGGrandchild ? `➥ ${pn.pnCode}` : ""}</td>
                      <td>{pn.description}</td>
                      <td>
                        <div className={pn.pdfUrl ? styles.attachmentAvail : styles.attachmentNull}>
                            <FileText className={styles.fileIcon} />
                        </div>  
                      </td>
                      <td className={styles.textCenter}>
                        <div className={styles.actionsContainer}>
                          <button className={styles.btnEdit}>
                            <SquarePen />
                          </button>
                          <button className={styles.btnDelete}>
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) }
            </tbody>
          </table>
        </div>
      </div>
      <PnTreeModal
        isTreeModalOpen={isTreeModalOpen}
        selectedPart={selectedPart}
        closeTreeModal={closeTreeModal}
      />
    </div>
  )
}

export default PartNumberPage