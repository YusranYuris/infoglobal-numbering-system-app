import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuthStore } from "../store/useAuthStore.js";

import '../styles/global.css'
import '../styles/LoginPage.css'
import infoglobalLogo from "../assets/logos/infoglobal-logo.png"

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    try {
      const response = await api.post(
        "/users/login",
        {
          email, password
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuth(user, token)

      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/drawing-number");
      };
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container">
      <div className="login-box">
        <img className="logo-md" src={infoglobalLogo} alt="infoglobal-logo" />
        <h1 className="login-heading">Login</h1>

        {/* EMAIL INPUT */}
        <input 
          className="email-form" 
          type="email" 
          name="email" 
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD INPUT */}
        <input 
          className="password" 
          type="password" 
          name="password" 
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <div className="login-button">
          <button type="submit" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;