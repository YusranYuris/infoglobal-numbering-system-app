import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

import styles from '../styles/LoginPage.module.css'
import infoglobalLogo from "../assets/logos/infoglobal-logo.png"

const LoginPage = () => {
  const navigate = useNavigate();

  const { 
    loginFormData,
    setLoginFormData,
    loginService,
    isLoginLoading,
    loginError,
    clearLoginError
  } = useAuthStore()

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await loginService();

    if (success) {
      navigate("/home");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });

    if (loginError) {
      clearLoginError();
    }
  }

  return (
    <div className={styles.loginBody}>
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <img className={styles.logoMd} src={infoglobalLogo} alt="infoglobal-logo" />
          <h1 className={styles.loginHeading}>Login</h1>

          <form onSubmit={handleLogin}>
            {/* EMAIL INPUT */}
            <input 
              className={styles.loginInput}
              type="email" 
              name="email" 
              placeholder="Email"
              value={loginFormData.email}
              onChange={handleInputChange}
              disabled={isLoginLoading}
            />

            {/* PASSWORD INPUT */}
            <input 
              className={styles.loginInput} 
              type="password" 
              name="password" 
              placeholder="Password"
              value={loginFormData.password}
              onChange={handleInputChange}
              disabled={isLoginLoading}
            />

            {/* LOGIN BUTTON */}
            <button
              type="submit" 
              disabled={!loginFormData.email || !loginFormData.password || isLoginLoading}
              className={styles.loginButton}
            >
              {isLoginLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                <>
                Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;