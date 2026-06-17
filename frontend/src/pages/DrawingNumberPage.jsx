import Navbar from "../components/Navbar.jsx";
import styles from "../styles/DrawingNumberPage.module.css";
import { File, FileText, RotateCcw, SquarePen, Trash2 } from 'lucide-react'
import { useDrawingNumberStore } from "../store/useDrawingNumberStore.js";

import { DRAWING_KIND, KIND_CODE, CATEGORY_CODE, FUNCTION_CODE, DESIGNATION_CODE } from "../constants/mastersData.js";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";

const DrawingNumberPage = () => {
  const user = useAuthStore((state) => state.user)

  const { 
    loading, 
    fetchDrawingNumbers, 
    fetchDnBranches, 
    addDrawingNumber,  
    addDnBranch, 
    searchFilters,
    setSearchFilters,
    resetSearchFilters,
    drawingNumbers, 
    dnFormData,
    dnBranches,
    dnBranchFormData, 
    setDnFormData,
    setDnBranchFormData, 
  } = useDrawingNumberStore()

  useEffect(() => {
    fetchDrawingNumbers();
    fetchDnBranches();
  }, [fetchDrawingNumbers, fetchDnBranches])

  const filteredDnBranches = dnBranches.filter((branch) => {
    const matchRootId = branch.rootId?.toLowerCase().includes(searchFilters.rootId.toLowerCase());
    const matchDescription = branch.description?.toLowerCase().includes(searchFilters.description.toLowerCase());
    const matchRequester = branch.createdBy?.toLowerCase().includes(searchFilters.createdBy.toLowerCase());

    const matchGroup = branch.group?.toString().includes(searchFilters.group);
    const matchSubGroup = branch.subGroup?.toString().includes(searchFilters.subGroup);
    const matchSubSg = branch.subSg?.toString().includes(searchFilters.subSg);

    return matchRootId && matchDescription && matchRequester && matchGroup && matchSubGroup && matchSubSg
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(name, value);
  }

  return (
    <div className={styles.pageBody}>
      {/* NAVBAR */}
        <Navbar />
      <div className={styles.container}>

        {/* TITLE */}
        <section className={styles.titleSection}>
          <h1>Drawing Number</h1>
        </section>

        {user?.role == "admin" && (
          <>
          {/* FORM SECTION */}
          <section className={styles.formSection}>

            {/* DRAWING NUMBER GENERATOR */}
            <div className={styles.formInput}>
              <h2>Drawing Number Generator</h2>

              <form onSubmit={addDrawingNumber}>
                <label className={styles.formLabel} htmlFor="dn-drawing-kind">Drawing Kind</label>
                <select 
                  id="dn-drawing-kind"
                  value={dnFormData.drawingKind}
                  onChange={(e) => setDnFormData({...dnFormData, drawingKind: e.target.value})}
                >
                  {!dnFormData.drawingKind && (
                    <option value="" disabled>Select drawing kind type</option>
                  )}

                  {DRAWING_KIND.map((drawingKind) => {
                    return (
                      <option key={drawingKind.id} value={drawingKind.id}>
                        {`${drawingKind.id} (${drawingKind.desc})`}
                      </option>
                    )
                  })}
                </select>

                <label className={styles.formLabel} htmlFor="dn-kind">Kind</label>
                <select 
                  id="dn-kind"
                  value={dnFormData.kindCode}
                  onChange={(e) => setDnFormData({...dnFormData, kindCode: e.target.value})}
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

                <label className={styles.formLabel} htmlFor="dn-category">Category</label>
                <select 
                  id="dn-category"
                  value={dnFormData.categoryCode}
                  onChange={(e) => setDnFormData({...dnFormData, categoryCode: e.target.value})}
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

                <label className={styles.formLabel} htmlFor="dn-function">Function</label>
                <select 
                  id="dn-function"
                  value={dnFormData.functionCode}
                  onChange={(e) => setDnFormData({...dnFormData, functionCode: e.target.value})}
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

                <label className={styles.formLabel} htmlFor="dn-designation-code">Designation Code</label>
                <select 
                  id="dn-designation-code"
                  value={dnFormData.designationCode}
                  onChange={(e) => setDnFormData({...dnFormData, designationCode: e.target.value})}
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

                <label className={styles.formLabel} htmlFor="dn-sequence">Sequence (Optional)</label>
                <input 
                  id="dn-sequence" 
                  type="text"
                  placeholder="Enter drawing number sequence"
                  value={dnFormData.sequence}
                  onChange={(e) => setDnFormData({...dnFormData, sequence: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="dn-description">Description</label>
                <input 
                  id="dn-description" 
                  type="text" 
                  placeholder="Enter drawing number description"
                  value={dnFormData.description}
                  onChange={(e) => setDnFormData({...dnFormData, description: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="dn-requester">Requester</label>
                <input 
                  id="dn-requester" 
                  type="text" 
                  placeholder="Enter drawing number requester"
                  value={dnFormData.createdBy}
                  onChange={(e) => setDnFormData({...dnFormData, createdBy: e.target.value})}
                />

                <button 
                  type="submit"
                  disabled={!dnFormData.drawingKind || !dnFormData.kindCode || !dnFormData.categoryCode || !dnFormData.functionCode || !dnFormData.designationCode || !dnFormData.description || !dnFormData.createdBy}
                  className={styles.addButton}
                >
                  {loading ? (
                    <span className={styles.spinner}></span>
                  ) : (
                    <>
                    Add
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* DRAWING NUMBER BRANCH GENERATOR */}
            <div className={styles.formInput}>
              <h2>Drawing Number Branch Generator</h2>

              <form onSubmit={addDnBranch}>
                <label className={styles.formLabel} htmlFor="dn-branch-parent">Parent</label>
                <select 
                  id="dn-branch-parent"
                  value={dnBranchFormData.rootId}
                  onChange={(e) => setDnBranchFormData({...dnBranchFormData, rootId: e.target.value})}
                >
                  {!dnBranchFormData.rootId && (
                    <option value="" disabled>Select drawing number parent</option>
                  )}

                  {drawingNumbers.map((drawingNumber) => {
                    return (
                      <option key={drawingNumber.idDn} value={drawingNumber.idDn}>
                        {`${drawingNumber.idDn}-00-000`}
                      </option>
                    )
                  })}
                </select>

                <label className={styles.formLabel} htmlFor="dn-branch-group">Group</label>
                <input 
                  id="dn-branch-group" 
                  type="text"
                  placeholder="e.g., 1, 2, 3, ...."
                  value={dnBranchFormData.group}
                  onChange={(e) => setDnBranchFormData({...dnBranchFormData, group: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="dn-branch-sub-group">Sub-Group</label>
                <input 
                  id="dn-branch-sub-group" 
                  type="text"
                  placeholder="e.g., 1, 2, 3, ...."
                  value={dnBranchFormData.subGroup}
                  onChange={(e) => setDnBranchFormData({...dnBranchFormData, subGroup: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="dn-branch-sub-sg">Sub-SG</label>
                <input 
                  id="dn-branch-sub-sg" 
                  type="text"
                  placeholder="e.g., 1, 2, 3, ...."
                  value={dnBranchFormData.subSg}
                  onChange={(e) => setDnBranchFormData({...dnBranchFormData, subSg: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="dn-branch-description">Description</label>
                <input 
                  id="dn-branch-description" 
                  type="text" 
                  placeholder="Enter drawing number description"
                  value={dnBranchFormData.description}
                  onChange={(e) => setDnBranchFormData({...dnBranchFormData, description: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="dn-branch-requester">Requester</label>
                <input 
                  id="dn-branch-requester" 
                  type="text" 
                  placeholder="Enter drawing number requester"
                  value={dnBranchFormData.createdBy}
                  onChange={(e) => setDnBranchFormData({...dnBranchFormData, createdBy: e.target.value})}
                />

                <label className={styles.formLabel} htmlFor="dn-branch-pdf">PDF Attachment</label>
                <label htmlFor="dn-branch-pdf" className={styles.uploadBox}>
                  {dnBranchFormData.pdf ? `📄 ${dnBranchFormData.pdf.name}` : <>Click to upload PDF</>}
                </label>
                <input 
                  id="dn-branch-pdf"
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setDnBranchFormData({...dnBranchFormData, pdf: e.target.files[0]})}

                />

                <button 
                  type="submit"
                  disabled={!dnBranchFormData.rootId || !dnBranchFormData.group ||  !dnBranchFormData.description || !dnBranchFormData.createdBy}
                  className={styles.addButton}
                >
                  {loading ? (
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
          <h2>Drawing Number Searcher</h2>

          <div className={styles.gridContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="parent">Parent</label>
              <input 
                id="parent"
                type="text"
                name="rootId"
                placeholder="Search Parent"
                value={searchFilters.rootId}
                onChange={handleFilterChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="group">Group</label>
              <input 
                id="group"
                type="text"
                name="group"
                placeholder="Search Group"
                value={searchFilters.group}
                onChange={handleFilterChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subGroup">Sub-Group</label>
              <input 
                id="subGroup"
                type="text"
                name="subGroup"
                placeholder="Search Sub-Group"
                value={searchFilters.subGroup}
                onChange={handleFilterChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subSg">Sub-SG</label>
              <input 
                id="subSg"
                type="text"
                name="subSg"
                placeholder="Search Sub-SG"
                value={searchFilters.subSg}
                onChange={handleFilterChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.descriptionField}`}>
              <label htmlFor="description">Description</label>
              <input 
                id="description"
                type="text"
                name="description"
                placeholder="Search Description"
                value={searchFilters.description}
                onChange={handleFilterChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="requester">Requester</label>
              <input 
                id="requester"
                type="text"
                name="createdBy"
                placeholder="Search Requester"
                value={searchFilters.createdBy}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <div className={styles.resetButtonContainer}>
                <button onClick={resetSearchFilters} className={styles.resetButton}>
                  <RotateCcw />
                  Reset Search Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE DATA */}
        <div className={styles.tableContainer}>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Parent</th>
                <th>Group</th>
                <th>Sub-Group</th>
                <th>Sub-SG</th>
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
              ) : filteredDnBranches.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.textCenter}>No Data Found</td>
                </tr>
              ) : (
                filteredDnBranches.map((branch) => {
                  const isParent = branch.group == 0;
                  const isGroup = branch.subGroup == 0 && !isParent;
                  const isSubGroup = branch.subSg == 0 && !isParent && !isGroup;
                  const isSubSg = branch.subSg != 0 && !isParent && !isGroup && !isSubGroup;

                  return (
                    <tr key={branch.id}>
                      <td>{isParent ? branch.idBranch : ""}</td>
                      <td>{isGroup ? `➥ ${branch.idBranch}` : ""}</td>
                      <td>{isSubGroup ? `➥ ${branch.idBranch}` : ""}</td>
                      <td>{isSubSg ? `➥ ${branch.idBranch}` : ""}</td>
                      <td>{branch.description}</td>
                      <td>
                        <div className={branch.pdfUrl ? styles.attachmentAvail : styles.attachmentNull}>
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
    </div>
  )
}

export default DrawingNumberPage