import api from "../api/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";
import { documents } from "../../../backend/src/db/schema/documents.js";

export const useDocumentStore = create((set, get) => ({
    loading: false,
    error: null,

    // For Document Number Generator Form
    fixedSequence: null,
    isPreviewAddDocumentLoading: false,

    // For Document Number Add Preview Modal
    previewDoc: "",
    modalMessage: "",
    isDocumentLoading: false,

    // For Document Edit Modal
    isDocumentEditModalLoading: false,
    isEditDocumentLoading: false,

    // For Document Delete Modal
    isDeleteDocumentLoading: false,

    // For all Modal in Document Page
    selectedDoc: null,

    // Conditional to Open Modal
    isConfirmationModalOpen: false,
    isPDFModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,

    // Open Modal Function
    openConfirmationModal: () => set({isConfirmationModalOpen: true}),
    openPDFModal: (doc) => set({ isPDFModalOpen: true, selectedDoc: doc }),
    openEditModal: (doc) => set({ isEditModalOpen: true, selectedDoc: doc }),
    openDeleteModal: (doc) => set({ isDeleteModalOpen: true, selectedDoc: doc }),

    // Close Modal Function
    closeConfirmationModal: () => set({isConfirmationModalOpen: false}),
    closePDFModal: () => set({ isPDFModalOpen: false, selectedPart: null }),
    closeEditModal: () => set({ isEditModalOpen: false, selectedPart: null }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedPart: null }),

    // For storing all documents
    documents: [],

    // Document Number Generator Form
    docFormData: {
        productAbbr: "",
        docKind: "",
        department: "",
        companyAbbr: "",
        year: "",
        description: "",
        sequence: "",
        isSequenced: true,
        createdBy: "",
        pdf: null
    },

    setDocFormData: (docFormData) => set({ docFormData }),
    resetDocFormData: () => set({
        docFormData: {
            productAbbr: "",
            docKind: "",
            department: "",
            companyAbbr: "",
            year: "",
            description: "",
            sequence: "",
            isSequenced: true,
            createdBy: "",
            pdf: null
        }
    }),

    // Document Number Search Filters
    searchFilters: {
        productAbbr: "",
        docKind: "",
        department: "",
        companyAbbr: "",
        year: "",
        description: "",
        createdBy: ""
    },

    setSearchFilters: (name, value) => set((state) => ({
        searchFilters: {
            ...state.searchFilters,
            [name]: value
        }
    })),

    resetSearchFilters: () => set({
        searchFilters: {
            productAbbr: "",
            docKind: "",
            department: "",
            companyAbbr: "",
            year: "",
            description: "",
            createdBy: ""
        },
    }),

    // Document Number Edit Form
    editDocFormData: {
        description: "",
        pdf: null,
        pdfUrl: "",
    },

    setEditDocFormData: (editDocFormData) => set({ editDocFormData }),
    resetEditDocFormData: () => set({
        editDocFormData: {
            description: "",
            pdf: null,
            pdfUrl: "",
        }
    }),

    fetchDocuments: async () => {
        set({loading: true})
        try {
            const response = await api.get("/documents")
            set({documents: response.data.data, error: null})
        } catch (error) {
            set({error: "Something went wrong", documents: []})
        } finally {
            set({loading: false})
        }
    },

    addDocument: async () => {
        set({isDocumentLoading: true})
        try {
            const { docFormData, fixedSequence } = get();

            const formData = {
                ...docFormData,
                docKind: docFormData.docKind === "" ? null : parseInt(docFormData.docKind, 10),
                department: docFormData.department === "" ? null : parseInt(docFormData.department, 10),
                sequence: parseInt(fixedSequence, 10)
            };

            const payload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    payload.append(key, value)
                }
            });

            const response = await api.post("/documents", payload);

            await get().fetchDocuments();

            get().resetDocFormData();

            toast.success(`Document Number: ${response.data.data.idDoc} has been added successfully`)

            return true
        } catch (error) {
            console.log("Error in addDocument funciton", error);
            toast.error("Something went wrong")

            return false
        } finally {
            set({isDocumentLoading: false})
        }
    },

    previewAddDocument: async () => {
        set({isPreviewAddDocumentLoading: true})
        try {
            const { docFormData } = get();
            const formData = {
                ...docFormData,
                docKind: docFormData.docKind === "" ? null : parseInt(docFormData.docKind, 10),
                department: docFormData.department === "" ? null : parseInt(docFormData.department, 10),
                isSequenced: docFormData.sequence === "" ? true : false
            };

            delete formData.pdf;

            const response = await api.post("/documents/preview", formData);

            if (response.data.chosen) {
                set({
                    modalMessage: "The Sequence you chose is not available, we recommend this Document Number: ",
                    error: null
                })
            } else {
                set({
                    modalMessage: "Are you sure you want too add this Document Number: ",
                    error: null
                })
            }
            set({
                previewDoc: response.data.doc,
                fixedSequence: response.data.sequence
            })

            return true

        } catch (error) {
            console.log(error)
            console.log("Error in previewAddDocument function")
            toast.error("Something went wrong")

            return false
        } finally {
            set({isPreviewAddDocumentLoading: false})
        }
    },

    fetchDocument: async (id) => {
        set({isDocumentEditModalLoading: true})
        try {
            const response = await api.get(`/documents/${id}`)
            set((state) => ({
                editDocFormData: {...state.editDocFormData, description: response.data.data.description, pdfUrl: response.data.data.pdfUrl},
                error: null,
            }))
        } catch (error) {
            set({error: "Something went wrong"})
        } finally {
            set({isDocumentEditModalLoading: false})
        }
    },

    updateDocument: async (id) => {
        set({isEditDocumentLoading: true})
        try {
            const { editDocFormData } = get();

            const payload = new FormData();

            Object.entries(editDocFormData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    payload.append(key, value)
                }
            })

            const response = await api.put(`/documents/${id}`, payload)

            await get().fetchDocuments();

            get().resetEditDocFormData();

            toast.success(`Document Number: ${response.data.data.idDoc} has been successfully updated.`)

            return true
        } catch (error) {
            toast.error("Something went wrong")

            return false
        } finally {
            set({isEditDocumentLoading: false})
        }
    },

    deleteDocument: async (id) => {
        set({isDeleteDocumentLoading: true})
        try {
            const response = await api.delete(`/documents/${id}`)
            set(prev => ({documents: prev.documents.filter(document => document.idDoc !== id)}))
            toast.success(`Document Number: ${response.data.data.idDoc} has been successfully deleted.`)
            return true
        } catch (error) {
            console.log("Error in deleteDocument function")
            toast.error("Something went wrong")
            return false
        } finally {
            set({isDeleteDocumentLoading: false})
        }
    }
}))