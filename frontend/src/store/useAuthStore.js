import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    // For Login Form
    isLoginLoading: false,

    loginFormData: {
        email: "",
        password: "",
    },

    setLoginFormData: (loginFormData) => set({ loginFormData }),

    resetLoginFormData: () => set({ loginFormData: {
        email: "",
        password: "",
    } }),

    loginError: null,

    clearLoginError: () => set({ loginError: null }),

    // Authentication
    user: null,
    token: null,
    
    setAuth: (user, token) => set({ user, token }),

    logout: () => set({
        user: null,
        token: null,
    }),

    loginService: async () => {
        set({
            isLoginLoading: true,
            loginError: null,
        })

        try {
            const { loginFormData, setAuth } = get();

            const response = await api.post("/users/login", loginFormData)

            const {token, user} = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setAuth(user, token)

            get().resetLoginFormData()

            toast.success('Login Success, Welcome!', {
                style: {
                    fontSize: '1.5rem'
                }
            })

            return true;
        } catch (error) {
            let loginError;

            if (error.response) {
                const status = error.response.status;

                switch (status) {
                    case 404:
                        loginError = "User not found";
                        break;

                    case 401:
                        loginError = "Wrong Password";
                        break;

                    case 500:
                        loginError = "Something went wrong";
                        break;

                    default:
                        loginError = "Something went wrong. Try again"
                }
            } else if (error.request) {
                loginError = "Cannot connect to the server"
            } else {
                loginError = "Something went wrong. Try again"
            }

            set({
                loginError,
            });

            toast.error(loginError, {
                style: {
                    fontSize: '1.5rem'
                }
            })

            return false;
        } finally {
            set({isLoginLoading: false})
        }
    }
}));