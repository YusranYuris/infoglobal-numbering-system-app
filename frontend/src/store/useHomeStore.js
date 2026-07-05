import api from "../api/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useHomeStore = create((set, get) => ({
    loading: false,
    error: null,

    // For Engineering Data Count
    partNumberUnitsCount: null,
    partNumberModulesCount: null,
    drawingNumbersCount: null,
    documentsCount: null,

    fetchData: async () => {
        set({loading: true})
        try {
            const response = await api.get("/home")
            set({
                partNumberUnitsCount: response.data.data.partNumberUnitsCount,
                partNumberModulesCount: response.data.data.partNumberModulesCount,
                drawingNumbersCount: response.data.data.drawingNumbersCount,
                documentsCount: response.data.data.documentsCount,
                error: null
            })
        } catch (error) {
            set({
                partNumberUnitsCount: null,
                partNumberModulesCount: null,
                drawingNumbersCount: null,
                documentsCount: null,
                error: "Something went wrong"
            })
        } finally {
            set({loading: false})
        }
    }
}))