import api from "../api/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const usePartNumberStore = create((set, get) => ({
    loading: false,
    isPartNumberLoading: false,
    isPnRelationLoading: false,
    error: null,
    selectedPart: null,

    isTreeModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,

    openTreeModal: (pn) => set({ isTreeModalOpen: true, selectedPart: pn }),
    openEditModal: (pn) => set({ isEditModalOpen: true, selectedPart: pn }),
    openDeleteModal: (pn) => set({ isDeleteModalOpen: true, selectedPart: pn }),
    
    closeTreeModal: () => set({ isTreeModalOpen: false, selectedPart: null }),
    closeEditModal: () => set({ isEditModalOpen: false, selectedPart: null }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedPart: null }),

    partNumbers: [],
    pnForest: [],
    pnFamily: {},

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

    addPartNumber: async (e) => {
        e.preventDefault();
        set({ isPartNumberLoading: true })

        try {
            const { pnFormData } = get();
            const formData = {
                ...pnFormData,
                kindCode: pnFormData.kindCode === "" ? null : parseInt(pnFormData.kindCode, 10),
                functionCode: pnFormData.functionCode === "" ? null : parseInt(pnFormData.functionCode, 10),
                isSequenced: pnFormData.sequence === "" ? true : false
            };

            const payload = new FormData();

            Object.entries(pnFormData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    payload.append(key, value)
                }
            });

            const response = await api.post("/part-numbers", payload);

            await get().fetchPartNumbers()

            get().resetPnFormData();

            toast.success(`Part Number: ${response.data.data.idPn} successfully added`)

        } catch (error) {
            console.log("Error in addPartNumber function")
            toast.error("Something went wrong")
        } finally {
            set({isPartNumberLoading: false})
        }
    },

    fetchPartNumbers: async () => {
        set({loading: true})
        try {
            const response = await api.get("/part-numbers");
            set({partNumbers: response.data.data, error: null})
        } catch (error) {
            set({error: "Something went wrong", partNumbers: []})
        } finally {
            set({loading: false})
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

            // Fetch PN Relation

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
    }
}))