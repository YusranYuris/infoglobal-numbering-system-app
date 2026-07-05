import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import DrawingNumberPage from "../pages/DrawingNumberPage";
import PartNumberPage from "../pages/PartNumberPage";
import DocumentPage from "../pages/DocumentPage";
import ProtectedRoute from "./ProtectedRoutes";
import { Toaster } from "react-hot-toast";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route 
                    path="/"
                    element={
                            <LoginPage />
                    }
                />

                <Route 
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path="/drawing-number"
                    element={
                        <ProtectedRoute>
                            <DrawingNumberPage />
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path="/part-number"
                    element={
                        <ProtectedRoute>
                            <PartNumberPage />
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path="/document"
                    element={
                        <ProtectedRoute>
                            <DocumentPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>

            <Toaster/>
        </BrowserRouter>
    );
}

export default AppRoutes;