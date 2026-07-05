import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuthStore } from "../store/useAuthStore.js";

import styles from '../styles/LoginPage.module.css'
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

      navigate("/home");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.loginBody}>
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <img className={styles.logoMd} src={infoglobalLogo} alt="infoglobal-logo" />
          <h1 className={styles.loginHeading}>Login</h1>

          {/* EMAIL INPUT */}
          <input 
            className={styles.loginInput}
            type="email" 
            name="email" 
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD INPUT */}
          <input 
            className={styles.loginInput} 
            type="password" 
            name="password" 
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* LOGIN BUTTON */}
          <button onClick={handleLogin} className={styles.loginButton}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;