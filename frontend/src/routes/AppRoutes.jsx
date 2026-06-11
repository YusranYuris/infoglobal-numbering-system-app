import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import DrawingNumberPage from "../pages/DrawingNumberPage";
import PartNumberPage from "../pages/PartNumberPage";
import DocumentPage from "../pages/DocumentPage";
import ProtectedRoute from "./ProtectedRoutes";

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
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboardPage />
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
        </BrowserRouter>
    );
}

export default AppRoutes;