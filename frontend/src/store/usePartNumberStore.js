import api from "../api/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const usePartNumberStore = create((set, get) => ({
    loading: false,
    error: null,

    // For Part Number Generator Form
    fixedSequence: null,
    isPreviewAddPartNumberLoading: false,

    // For PN Relation Generator Form
    isPnRelationLoading: false,

    // For Part Number Add Preview Modal
    previewPn: "",
    modalMessage: "",
    isPartNumberLoading: false,

    // For Part Number Edit Modal
    isPartNumberEditModalLoading: false,
    isEditPartNumberLoading: false,

    // For PN Relation Delete Modal
    isPreviewDeletePnRelationLoading: false,
    isDeletePnRelationLoading: false,

    // For Part Number Delete Modal
    isDeletePartNumberLoading: false,

    // For all Modal in Part Number Page
    selectedPart: null,

    // Conditional to Open Modal
    isConfirmationModalOpen: false,
    isTreeModalOpen: false,
    isPDFModalOpen: false,
    isEditModalOpen: false,
    isPnRelationDeleteModalOpen: false,
    inPartNumberDeleteModalOpen: false,

    // Open Modal Function
    openConfirmationModal: () => set({isConfirmationModalOpen: true}),
    openTreeModal: (pn) => set({ isTreeModalOpen: true, selectedPart: pn }),
    openPDFModal: (pn) => set({ isPDFModalOpen: true, selectedPart: pn }),
    openEditModal: (pn) => set({ isEditModalOpen: true, selectedPart: pn }),
    openPnRelationDeleteModal: (pn) => set({ isPnRelationDeleteModalOpen: true, selectedPart: pn }),
    openPartNumberDeleteModal: (pn) => set({ isPartNumberDeleteModalOpen: true, selectedPart: pn }),
    
    // Close Modal Function
    closeConfirmationModal: () => set({isConfirmationModalOpen: false}),
    closeTreeModal: () => set({ isTreeModalOpen: false, selectedPart: null }),
    closePDFModal: () => set({ isPDFModalOpen: false, selectedPart: null }),
    closeEditModal: () => set({ isEditModalOpen: false, selectedPart: null }),
    closePnRelationDeleteModal: () => set({ isPnRelationDeleteModalOpen: false, selectedPart: null }),
    closePartNumberDeleteModal: () => set({ isPartNumberDeleteModalOpen: false, selectedPart: null }),

    // For Part Numbers Table
    partNumbers: [],

    // For PN Relations Table
    pnForest: [],

    // For PN Relations Tree
    pnFamily: {},

    // For Part Numbers Form Input
    formPartNumbers: [],

    // For PN Relation Delete Modal
    affectedPn: {},

    // PART NUMBER FORM DATA
    pnFormData: {
        kindCode: "",
        categoryCode: "",
        functionCode: "",
        designationCode: "",
        isSequenced: true,
        description: "",
        createdBy: "",
        pdf: null
    },

    setPnFormData: (pnFormData) => set({ pnFormData }),
    resetPnFormData: () => set({ pnFormData: {
        kindCode: "",
        categoryCode: "",
        functionCode: "",
        designationCode: "",
        isSequenced: true,
        description: "",
        createdBy: "",
        pdf: null
    }}),

    // PN RELATION FORM DATA
    pnRelationFormData: {
        rootId: "",
        parentId: "",
        pnCode: "",
        hierarchy: "",
    },

    setPnRelationFormData: (pnRelationFormData) => set({ pnRelationFormData }),
    resetPnRelationFormData: () => set({ pnRelationFormData: {
        rootId: "",
        parentId: "",
        pnCode: "",
        hierarchy: ""
    }}),

    // SEARCHBAR FILTERS
    searchFilters: {
        pnCode: "",
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
            pnCode: "",
            description: "",
            createdBy: ""
        }
    }),

    // TABLE DATA TABS
    activeTab: "relation",
    setActiveTab: (tab) => set((state) => ({activeTab: tab})),

    // EDIT PART NUMBER FORM DATA
    editPnFormData: {
        description: "",
        pdf: null,
        pdfUrl: "",
    },

    setEditPnFormData: (editPnFormData) => set({ editPnFormData }),
    resetEditPnFormData: () => set({
        editPnFormData: {
            description: "",
            pdf: null,
            pdfUrl: "",
        }
    }),

    // ========== ACTIONS ==========

    // Get All Part Numbers Action
    fetchPartNumbers: async () => {
        set({loading: true})
        try {
            const response = await api.get("/part-numbers");
            set({partNumbers: response.data.data, formPartNumbers: response.data.data, error: null})
        } catch (error) {
            set({error: "Something went wrong", partNumbers: []})
        } finally {
            set({loading: false})
        }
    },

    // Create Part Number Action
    addPartNumber: async () => {
        set({ isPartNumberLoading: true })

        try {
            const { pnFormData, fixedSequence } = get();
            const formData = {
                ...pnFormData,
                kindCode: parseInt(pnFormData.kindCode, 10),
                functionCode: parseInt(pnFormData.functionCode, 10),
                sequence: parseInt(fixedSequence, 10)
            };

            const payload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    payload.append(key, value)
                }
            });

            const response = await api.post("/part-numbers", payload);

            await get().fetchPartNumbers()

            get().resetPnFormData();

            toast.success(`Part Number: ${response.data.data.idPn} successfully added`)

            return true

        } catch (error) {
            console.log(error)
            console.log("Error in addPartNumber function")
            toast.error("Something went wrong")
            return false
        } finally {
            set({isPartNumberLoading: false})
        }
    },

    // Preview Add Part Number Action
    previewAddPartNumber: async () => {
        set({isPreviewAddPartNumberLoading: true})
        try {
            const { pnFormData } = get();
            const formData = {
                ...pnFormData,
                kindCode: pnFormData.kindCode === "" ? null : parseInt(pnFormData.kindCode, 10),
                functionCode: pnFormData.functionCode === "" ? null : parseInt(pnFormData.functionCode, 10),
                isSequenced: pnFormData.sequence === "" ? true : false
            };

            delete formData.pdf;

            const response = await api.post("/part-numbers/preview", formData);

            if (response.data.chosen) {
                set({
                    modalMessage: "The Sequence you chose is not available, we recommend this Part Number: ",
                    error: null
                })
            } else {
                set({
                    modalMessage: "Are you sure you want too add this Part Number: ",
                    error: null
                })
            }
            set({
                previewPn: response.data.pn,
                fixedSequence: response.data.sequence
            })

            return true

        } catch (error) {
            console.log(error)
            console.log("Error in previewAddPartNumber function")
            toast.error("Something went wrong")

            return false
        } finally {
            set({isPreviewAddPartNumberLoading: false})
        }
    },

    // Get Part Number Action
    fetchPartNumber: async (id) => {
        set({isPartNumberEditModalLoading: true})
        try {
            const response = await api.get(`/part-numbers/${id}`)
            set((state) => ({
                editPnFormData: {...state.editPnFormData, description: response.data.data.description, pdfUrl: response.data.data.pdfUrl},
                error: null,
            }))
        } catch (error) {
            set({error: "Something went wrong"})
        } finally {
            set({isPartNumberEditModalLoading: false})
        }
    },

    // Update Part Number Action
    updatePartNumber: async (id) => {
        set({isEditPartNumberLoading: true})
        try {
            const { editPnFormData } = get();

            const payload = new FormData();

            Object.entries(editPnFormData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    payload.append(key, value)
                }
            });

            const response = await api.put(`/part-numbers/${id}`, payload)

            await get().fetchPartNumbers()

            get().resetEditPnFormData()

            toast.success(`Part Number: ${response.data.data.idPn} has been successfully updated.`)

            return true
        } catch (error) {
            toast.error("Something went wrong")
            return false
        } finally {
            set({isEditPartNumberLoading: false})
        }
    },

    addPnRelation: async (e) => {
        e.preventDefault();
        set({isPnRelationLoading: true})

        try {
            const { pnRelationFormData } = get();

            const formData = {
                ...pnRelationFormData,
                hierarchy: pnRelationFormData.hierarchy === "" ? null : parseInt(pnRelationFormData.hierarchy, 10),
            };

            const response = await api.post("/pn-relations", formData);

            await get().fetchPnForest()

            toast.success(`Part Number: ${response.data.data.pnCode} has been added to ${response.data.data.rootId}`)

        } catch (error) {
            console.log("Error in addPnRelation function")
            toast.error("Something went wrong")
        } finally {
            set({isPnRelationLoading: false})
        }
    },

    fetchPnForest: async () => {
        set({loading: true})
        try {
            const response = await api.get(`/pn-relations`)

            set({pnForest: response.data.data, error: null})
        } catch (error) {
            set({error: "Something went wrong", pnForest: []})
        } finally {
            set({loading: false})
        }
    },

    fetchTree: async (rootId) => {
        try {
            const response = await api.get(`/pn-relations/${rootId}/tree`)

            set({pnFamily: response.data.data, error: null})
        } catch (error) {
            set({error: "Something went wrong", pnFamily: {}})
        }
    },

    fetchPreviewDeletePnRelation: async (id) => {
        set({isPreviewDeletePnRelationLoading: true})
        try {
            const response = await api.get(`/pn-relations/${id}/preview-delete`)

            set({affectedPn: response.data.data.previewPn, error: null})
        } catch (error) {
            set({error: "Something went wrong", affectedPn: {}})
        } finally {
            set({isPreviewDeletePnRelationLoading: false})
        }
    },

    deletePnRelation: async (id) => {
        set({isDeletePnRelationLoading: true})
        try {
            const response = await api.delete(`/pn-relations/${id}`)
            toast.success(`Part Number Relation: ${response.data.data.mainRelation.pnCode} has been successfully deleted`)
            const ids = response.data.data.relationsToDelete
            set(prev => ({
                pnForest: prev.pnForest.filter(relations => !ids.includes(relations.idRelations))
            }))

            return true
        } catch (error) {
            console.log("Error in deletePnRelation function")
            toast.error("Something went wrong")
            return false
        } finally {
            set({isDeletePnRelationLoading: false})
        }
    },

    deletePartNumber: async (id) => {
        set({isDeletePartNumberLoading: true})
        try {
            const response = await api.delete(`part-numbers/${id}`)
            toast.success(`Part Number Relation: ${response.data.data.idPn} has been successfully deleted`)
            set(prev => ({partNumbers: prev.partNumbers.filter(partNumber => partNumber.idPn !== id)}))
            return true
        } catch (error) {
            console.log("Error in deletePnRelation function")
            toast.error("Something went wrong")
            return false
        } finally {
            set({isDeletePartNumberLoading: false})
        }
    }
}))