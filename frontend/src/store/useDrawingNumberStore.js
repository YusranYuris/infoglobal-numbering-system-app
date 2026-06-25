import api from "../api/axios.js";
import toast from "react-hot-toast"
import { create } from "zustand";
import { dnBranches } from "../../../backend/src/db/schema/dnBranches.js";

export const useDrawingNumberStore = create((set, get) => ({
    isDrawingNumberLoading: false,
    isDnBranchLoading: false,
    isDeleteBranchLoading: false,
    isPreviewDeleteBranchLoading: false,
    loading: false,
    error: null,
    selectedBranch: null,

    isTreeModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,

    openTreeModal: (branch) => set({ isTreeModalOpen: true, selectedBranch: branch }),
    openEditModal: (branch) => set({ isEditModalOpen: true, selectedBranch: branch }),
    openDeleteModal: (branch) => set({ isDeleteModalOpen: true, selectedBranch: branch }),
    
    closeTreeModal: () => set({ isTreeModalOpen: false, selectedBranch: null, dnFamily: {} }),
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

    addDrawingNumber: async (e) => {
        e.preventDefault();
        set({isDrawingNumberLoading: true})

        try {
            const { dnFormData } = get();
            const formData = {
                ...dnFormData,
                kindCode: dnFormData.kindCode === "" ? null : parseInt(dnFormData.kindCode, 10),
                functionCode: dnFormData.functionCode === "" ? null : parseInt(dnFormData.functionCode, 10),
                isSequenced: dnFormData.sequence === "" ? true : false
            };

            const response = await api.post("/drawing-numbers", formData)

            await get().fetchDrawingNumbers();
            await get().fetchDnBranches();

            get().resetDnFormData();

            toast.success(`Drawing Number: ${response.data.data.branch.idBranch} successfully added`)

        } catch (error) {
            console.log("Error in addDrawingNumber function")
            toast.error("Something went wrong")
        } finally {
            set({isDrawingNumberLoading: false})
        }
    },

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

    fetchTree: async (rootId) => {
        try {
            const response = await api.get(`/dn-branches/${rootId}/tree`)

            set({dnFamily: response.data.data, error: null})
        } catch (error) {
            set({error: "Something went wrong", dnFamily: {}})
        }
    },

    // Add Update Branch Later Here

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