import Navbar from "../components/Navbar.jsx";
import styles from "../styles/DocumentPage.module.css";
import { useDocumentStore } from "../store/useDocumentStore.js";
import { useAuthStore } from "../store/useAuthStore.js";

import { DOC_KIND, DEPARTMENT } from "../constants/mastersData.js";
import { FileText, RotateCcw, SquarePen, Trash2 } from "lucide-react";
import { useEffect } from "react";
import DocumentEditModal from "../components/edit-modal/DocumentEditModal.jsx";
import DocumentDeleteModal from "../components/delete-modal/DocumentDeleteModal.jsx";
import DocumentPDFModal from "../components/pdf-modal/DocumentPDFModal.jsx";

const DocumentPage = () => {
  const user = useAuthStore((state) => state.user)

  const {
    loading,
    error,

    isDocumentLoading,

    selectedDoc,

    isPDFModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,

    openPDFModal,
    openEditModal,
    openDeleteModal,

    closePDFModal,
    closeEditModal,
    closeDeleteModal,

    documents,

    docFormData,
    setDocFormData,
    resetDocFormData,

    searchFilters,
    setSearchFilters,
    resetSearchFilters,

    fetchDocuments,
    addDocument,
  } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments])

  const filteredDocuments = documents.filter((doc) => {
    const matchProductAbbr = doc.productAbbr?.toLowerCase().includes(searchFilters.productAbbr.toLowerCase());
    const matchCompanyAbbr = doc.companyAbbr?.toLowerCase().includes(searchFilters.companyAbbr.toLowerCase());
    const matchDescription = doc.description?.toLowerCase().includes(searchFilters.description.toLowerCase());
    const matchRequester = doc.createdBy?.toLowerCase().includes(searchFilters.createdBy.toLowerCase());

    const matchDocKind = doc.docKind?.toString().includes(searchFilters.docKind);
    const matchDepartment = doc.department?.toString().includes(searchFilters.department);
    const matchYear = doc.year?.toString().includes(searchFilters.year);

    return matchProductAbbr && matchCompanyAbbr && matchDescription && matchRequester && matchDocKind && matchDepartment && matchYear
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(name, value)
  };

  return (
    <div className={styles.pageBody}>
      {/* NAVBAR */}
      <Navbar />
      <div className={styles.container}>
        
        {/* TITLE */}
        <section className={styles.titleSection}>
          <h1>Document</h1>
        </section>

        {user?.role == "admin" && (
          <>
          {/* FORM SECTION */}
          <section className={styles.formSection}>
            <div className={styles.formInput}>
              <h2>Document Number Generator</h2>

              <form className={styles.formGenerator} onSubmit={addDocument}>
                <div>
                  <label className={styles.formLabel} htmlFor="productAbbr">Product Abbreviation</label>
                  <input
                    id="productAbbr"
                    type="text"
                    placeholder="Enter product abbreviation"
                    value={docFormData.productAbbr}
                    onChange={(e) => setDocFormData({...docFormData, productAbbr: e.target.value})}
                  />
                </div>

                <div>
                  <label className={styles.formLabel} htmlFor="docKind">Document Kind</label>
                  <select  
                    id="docKind"
                    value={docFormData.docKind}
                    onChange={(e) => setDocFormData({...docFormData, docKind: e.target.value})}
                  >
                    <option value="" disabled>Select document kind</option>

                    {DOC_KIND.map((docKind) => {
                      return (
                        <option key={docKind.id} value={docKind.id}>
                          {`${docKind.id} ${docKind.desc}`}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div>
                  <label className={styles.formLabel} htmlFor="department">Department</label>
                  <select  
                    id="department"
                    value={docFormData.department}
                    onChange={(e) => setDocFormData({...docFormData, department: e.target.value})}
                  >
                    <option value="" disabled>Select department</option>

                    {DEPARTMENT.map((department) => {
                      return (
                        <option key={department.id} value={department.id}>
                          {`${department.id} ${department.desc}`}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div>
                  <label className={styles.formLabel} htmlFor="companyAbbr">Company Abbreviation</label>
                  <input
                    id="companyAbbr"
                    type="text"
                    placeholder="Enter company abbreviation"
                    value={docFormData.companyAbbr}
                    onChange={(e) => setDocFormData({...docFormData, companyAbbr: e.target.value})}
                  />
                </div>

                <div>
                  <label className={styles.formLabel} htmlFor="year">Year</label>
                  <input
                    id="year"
                    type="text"
                    placeholder="Enter year"
                    value={docFormData.year}
                    onChange={(e) => setDocFormData({...docFormData, year: e.target.value})}
                  />
                </div>

                <div>
                  <label className={styles.formLabel} htmlFor="description">Description</label>
                  <input
                    id="description"
                    type="text"
                    placeholder="Enter description"
                    value={docFormData.description}
                    onChange={(e) => setDocFormData({...docFormData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className={styles.formLabel} htmlFor="sequence">Sequence</label>
                  <input
                    id="sequence"
                    type="text"
                    placeholder="Enter sequence"
                    value={docFormData.sequence}
                    onChange={(e) => setDocFormData({...docFormData, sequence: e.target.value})}
                  />
                </div>

                <div>
                  <label className={styles.formLabel} htmlFor="createdBy">Requester</label>
                  <input
                    id="createdBy"
                    type="text"
                    placeholder="Enter requester"
                    value={docFormData.createdBy}
                    onChange={(e) => setDocFormData({...docFormData, createdBy: e.target.value})}
                  />
                </div>

                <div className={styles.uploadInput}>
                  <label className={styles.formLabel} htmlFor="pdf">PDF Attachment</label>
                  <label htmlFor="pdf" className={styles.uploadBox}>
                    {docFormData.pdf ? `📄 ${docFormData.pdf.name}` : <>Click to upload PDF</>}
                  </label>
                  <input 
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={(e) => setDocFormData({...docFormData, pdf: e.target.files[0]})}
  
                  />
                </div>

                <button 
                  type="submit"
                  disabled={!docFormData.productAbbr || !docFormData.docKind ||  !docFormData.department || !docFormData.companyAbbr || !docFormData.year || !docFormData.description || !docFormData.createdBy}
                  className={styles.addButton}
                >
                  {isDocumentLoading ? (
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
          <h2>Document Number Searcher</h2>

          <div className={styles.gridContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="productAbbr">Product Abbreviation</label>
              <input 
                id="productAbbr"
                type="text"
                name="productAbbr"
                placeholder="e.g., PAEX, EF55, ..."
                value={searchFilters.productAbbr}
                onChange={handleFilterChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="docKind">Document Kind</label>
              <input 
                id="docKind"
                type="text"
                name="docKind"
                placeholder="Search by document kind"
                value={searchFilters.docKind}
                onChange={handleFilterChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="department">Department</label>
              <input 
                id="department"
                type="text"
                name="department"
                placeholder="Search by department"
                value={searchFilters.department}
                onChange={handleFilterChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="companyAbbr">Company Abbreviation</label>
              <input 
                id="companyAbbr"
                type="text"
                name="companyAbbr"
                placeholder="e.g., ITS, LM, ..."
                value={searchFilters.companyAbbr}
                onChange={handleFilterChange}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.descriptionField}`}>
              <label htmlFor="description">Description</label>
              <input 
                id="description"
                type="text"
                name="description"
                placeholder="Search by description"
                value={searchFilters.description}
                onChange={handleFilterChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="year">Year</label>
              <input 
                id="year"
                type="text"
                name="year"
                placeholder="Search by year"
                value={searchFilters.year}
                onChange={handleFilterChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="createdBy">Requester</label>
              <input 
                id="createdBy"
                type="text"
                name="createdBy"
                placeholder="Search by requester"
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
                <th>Document Number</th>
                <th>Description</th>
                <th>Requester</th>
                <th className={styles.textCenter}>Attachment</th>
                {user?.role == "admin" && (
                  <>
                  <th className={styles.textCenter}>Actions</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={user?.role == "admin" ? "5" : "4"} className={styles.textCenter}> Loading Data...</td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={user?.role == "admin" ? "5" : "4"} className={styles.textCenter}> No Data Found</td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => {
                  return (
                    <tr>
                      <td>{doc.idDoc}</td>
                      <td>{doc.description}</td>
                      <td>{doc.createdBy}</td>
                      <td>
                        <div className={doc.pdfUrl ? styles.attachmentAvail : styles.attachmentNull} onClick={() => openPDFModal(doc)} key={doc.id}>
                            <FileText className={styles.fileIcon} />
                        </div> 
                      </td>
                      {user?.role == "admin" && (
                        <>
                        <td className={styles.textCenter}>
                          <div className={styles.actionsContainer}>
                            <button onClick={() => openEditModal(doc)} key={doc.id} className={styles.btnEdit}>
                              <SquarePen />
                            </button>
                            <button onClick={() => openDeleteModal(doc)} key={doc.id} className={styles.btnDelete}>
                              <Trash2 />
                            </button>
                          </div>
                        </td>
                        </>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentPDFModal 
        isPDFModalOpen={isPDFModalOpen}
        selectedDoc={selectedDoc}
        closePDFModal={closePDFModal}
      />

      <DocumentEditModal 
        isEditModalOpen={isEditModalOpen}
        selectedDoc={selectedDoc}
        closeEditModal={closeEditModal}
      />

      <DocumentDeleteModal 
        isDeleteModalOpen={isDeleteModalOpen}
        selectedDoc={selectedDoc}
        closeDeleteModal={closeDeleteModal}
      />
    </div>
  )
}

export default DocumentPage