import api from "../api/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";
import { dnBranches } from "../../../backend/src/db/schema/dnBranches.js";

export const useDrawingNumberStore = create((set, get) => ({
    loading: false,
    error: null,

    // For Drawing Number Generator Form
    fixedSequence: null,
    isPreviewAddDrawingNumberLoading: false,

    // For DN Branch Generator Form
    isDnBranchLoading: false,

    // For Part Number Add Preview Modal
    previewDn: "",
    modalMessage: "",
    isDrawingNumberLoading: false,

    // For DN Branch Edit Modal
    isDnBranchEditModalLoading: false,
    isEditDnBranchLoading: false,

    // For DN Branch Delete Modal
    isPreviewDeleteBranchLoading: false,
    isDeleteBranchLoading: false,

    // For all Modal in Drawing Number Page
    selectedBranch: null,

    // Conditional to Open Modal
    isConfirmationModalOpen: false,
    isTreeModalOpen: false,
    isPDFModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,

    // Open Modal Function
    openConfirmationModal: () => set({isConfirmationModalOpen: true}),
    openTreeModal: (branch) => set({ isTreeModalOpen: true, selectedBranch: branch }),
    openPDFModal: (branch) => set({ isPDFModalOpen: true, selectedBranch: branch }),
    openEditModal: (branch) => set({ isEditModalOpen: true, selectedBranch: branch }),
    openDeleteModal: (branch) => set({ isDeleteModalOpen: true, selectedBranch: branch }),
    
    // Close Modal Function
    closeConfirmationModal: () => set({isConfirmationModalOpen: false}),
    closeTreeModal: () => set({ isTreeModalOpen: false, selectedBranch: null, dnFamily: {} }),
    closePDFModal: () => set({ isPDFModalOpen: false, selectedBranch: null, dnFamily: {} }),
    closeEditModal: () => set({ isEditModalOpen: false, selectedBranch: null }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedBranch: null }),

    // Untuk select Parent
    drawingNumbers: [],

    // Untuk menampilkan data Drawing Number pada tabel
    dnBranches: [],

    // Untuk visualisasi tree
    dnFamily: {},

    // Untuk preview delete
    affectedBranches: {},

    dnFormData: {
        drawingKind: "",
        kindCode: "",
        categoryCode: "",
        functionCode: "",
        designationCode: "",
        sequence: "",
        description: "",
        isSequenced: true,
        createdBy: ""
    },

    setDnFormData: (dnFormData) => set({ dnFormData }),
    resetDnFormData: () => set({ dnFormData: {
        drawingKind: "",
        kindCode: "",
        categoryCode: "",
        functionCode: "",
        designationCode: "",
        sequence: "",
        description: "",
        isSequenced: true,
        createdBy: ""
    } }),

    dnBranchFormData: {
        rootId: "",
        group: "",
        subGroup: "", 
        subSg: "",
        description: "",
        createdBy: "",
        pdf: null
    },

    setDnBranchFormData: (dnBranchFormData) => set({ dnBranchFormData }),
    resetDnBranchFormData: () => set({ dnBranchFormData: {
        rootId: "",
        group: "",
        subGroup: "",
        subSg: "",
        description: "",
        createdBy: "",
        pdf: null
    } }),

    searchFilters: {
        rootId: "",
        group: "",
        subGroup: "",
        subSg: "",
        description: "",
        createdBy: "",
    },

    setSearchFilters: (name, value) => set((state) => ({
        searchFilters: {
            ...state.searchFilters,
            [name]: value
        }
    })),

    resetSearchFilters: () => set({
        searchFilters: {
            rootId: "",
            group: "",
            subGroup: "",
            subSg: "",
            description: "",
            createdBy: "",
        }
    }),

    editDnBranchFormData: {
        description: "",
        pdf: null,
        pdfUrl: "",
    },

    setEditDnBranchFormData: (editDnBranchFormData) => set({ editDnBranchFormData }),
    resetEditDnBranchFormData: () => set({
        editDnBranchFormData: {
            description: "",
            pdf: null,
            pdfUrl: "",
        },
    }),

    fetchDrawingNumbers: async () => {
        set({loading: true});
        try {
            const response = await api.get("/drawing-numbers")
            set({drawingNumbers: response.data.data, error: null})
        } catch (error) {
            set({error: "Something went wrong", drawingNumbers: []})
        } finally {
            set({loading: false})
        }
    },

    addDrawingNumber: async () => {
        set({isDrawingNumberLoading: true})

        try {
            const { dnFormData, fixedSequence } = get();
            const formData = {
                ...dnFormData,
                kindCode: parseInt(dnFormData.kindCode, 10),
                functionCode: parseInt(dnFormData.functionCode, 10),
                sequence: parseInt(fixedSequence, 10)
            };

            const response = await api.post("/drawing-numbers", formData)

            await get().fetchDrawingNumbers();
            await get().fetchDnBranches();

            get().resetDnFormData();

            toast.success(`Drawing Number: ${response.data.data.branch.idBranch} successfully added`)

            return true
        } catch (error) {
            console.log("Error in addDrawingNumber function")
            toast.error("Something went wrong")

            return false
        } finally {
            set({isDrawingNumberLoading: false})
        }
    },

    // Preview Add Drawing Number Action
    previewAddDrawingNumber: async () => {
        set({isPreviewAddDrawingNumberLoading: true})
        try {
            const { dnFormData } = get();
            const formData = {
                ...dnFormData,
                kindCode: dnFormData.kindCode === "" ? null : parseInt(dnFormData.kindCode, 10),
                functionCode: dnFormData.functionCode === "" ? null : parseInt(dnFormData.functionCode, 10),
                isSequenced: dnFormData.sequence === "" ? true : false
            };

            delete formData.pdf;

            const response = await api.post("/drawing-numbers/preview", formData);

            if (response.data.chosen) {
                set({
                    modalMessage: "The Sequence you chose is not available, we recommend this Drawing Number: ",
                    error: null
                })
            } else {
                set({
                    modalMessage: "Are you sure you want too add this Drawing Number: ",
                    error: null
                })
            }
            set({
                previewDn: response.data.dn,
                fixedSequence: response.data.sequence
            })

            return true

        } catch (error) {
            console.log(error)
            console.log("Error in previewAddDrawingNumber function")
            toast.error("Something went wrong")

            return false
        } finally {
            set({isPreviewAddDrawingNumberLoading: false})
        }
    },

    fetchDnBranches: async () => {
        set({loading: true});
        try {
            const response = await api.get("/dn-branches")

            set({dnBranches: response.data.data, error: null})
        } catch (error) {
            set({error: "Something went wrong", dnBranches: []})
        } finally {
            set({loading: false})
        }
    },

    addDnBranch: async (e) => {
        e.preventDefault();
        set({isDnBranchLoading: true})

        try {
            const { dnBranchFormData } = get();

            const payload = new FormData();

            Object.entries(dnBranchFormData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    payload.append(key, value)
                }
            });

            const response = await api.post("/dn-branches", payload)

            await get().fetchDnBranches();

            get().resetDnBranchFormData();

            toast.success(`Drawing Number Branch: ${response.data.data.idBranch} added successfully`)

        } catch (error) {
            console.log("Error in addDnBranch function")
            toast.error("Something went wrong")
        } finally {
            set({isDnBranchLoading: false})
        }
    },

    fetchTree: async (rootId) => {
        try {
            const response = await api.get(`/dn-branches/${rootId}/tree`)

            set({dnFamily: response.data.data, error: null})
        } catch (error) {
            set({error: "Something went wrong", dnFamily: {}})
        }
    },

    fetchDnBranch: async (id) => {
        set({isDnBranchEditModalLoading: true})
        try {
            const response = await api.get(`/dn-branches/${id}`)
            set((state) => ({
                editDnBranchFormData: {...state.editDnBranchFormData, description: response.data.data.description, pdfUrl: response.data.data.pdfUrl},
                error: null,
            }))
        } catch (error) {
            set({error: "Something went wrong"})
        } finally {
            set({isDnBranchEditModalLoading: false})
        }
    },

    updateDnBranch: async (id) => {
        set({isEditDnBranchLoading: true})
        try {
            const { editDnBranchFormData } = get();

            const payload = new FormData();

            Object.entries(editDnBranchFormData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    payload.append(key, value)
                }
            })

            const response = await api.put(`/dn-branches/${id}`, payload)

            await get().fetchDnBranches()

            get().resetEditDnBranchFormData()

            toast.success(`Drawing Number: ${response.data.data.idBranch} has been successfully updated.`)

            return true
            
        } catch (error) {
            toast.error("Something went wrong")
            return false
        } finally {
            set({isEditDnBranchLoading: false})
        }
    },

    fetchPreviewDeleteBranch: async (id) => {
        set({isPreviewDeleteBranchLoading: true})
        try {
            const response = await api.get(`/dn-branches/${id}/preview-delete`)

            set({affectedBranches: response.data.data.previewBranches, error: null})
        } catch (error) {
            set({error: "Something went wrong", affectedBranches: {}})
        } finally {
            set({isPreviewDeleteBranchLoading: false})
        }
    },

    deleteDrawingNumber: async (id) => {
       set({isDeleteBranchLoading: true})
        try {
            const response = await api.delete(`/drawing-numbers/${id}`)
            await get().fetchDnBranches()
            toast.success(`Drawing Number: ${response.data.data.idDn} has been successfully deleted`)
            return true

            
        } catch (error) {
            console.log("Error in deleteDrawingNumber function")
            toast.error("Something went wrong")
            return false
        } finally {
            set({isDeleteBranchLoading: false})
        } 
    },

    deleteBranch: async (id) => {
        set({isDeleteBranchLoading: true})
        try {
            const response = await api.delete(`/dn-branches/${id}`)
            toast.success(`Drawing Number: ${response.data.data.mainBranch.idBranch} has been successfully deleted`)
            const ids = response.data.data.branchesToDelete
            set(prev => ({
                dnBranches: prev.dnBranches.filter(branch => !ids.includes(branch.idBranch))
            }))

            return true

        } catch (error) {
            console.log("Error in deleteBranch function")
            toast.error("Something went wrong")
            return false
        } finally {
            set({isDeleteBranchLoading: false})
        }
    }
}));