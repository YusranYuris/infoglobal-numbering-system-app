import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

function App() {
   const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (token && user) {
      setAuth(
        user,
        token
      );
    }
  }, []);

  return <AppRoutes />;
}

export default App;