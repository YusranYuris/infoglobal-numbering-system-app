import api from "../api/axios.js";
import toast from "react-hot-toast"
import { create } from "zustand";

export const useDrawingNumberStore = create((set, get) => ({
    loading: false,
    error: null,

    drawingNumbers: [],
    dnBranches: [],

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
        set({loading: true})

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

            get().resetDnFormData();

            toast.success(`Drawing Number: ${response.data.data.branch.idBranch} added successfully`)

        } catch (error) {
            console.log("Error in addDrawingNumber function")
            toast.error("Something went wrong")
        } finally {
            set({loading: false})
        }
    },

    fetchDrawingNumbers: async (e) => {
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
        set({loading: true})

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
            set({loading: false})
        }
    },

    fetchDnBranches: async (e) => {
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
}));