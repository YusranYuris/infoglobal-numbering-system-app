import infoglobalLogo from "../assets/logos/infoglobal-logo.png";
import styles from '../styles/Navbar.module.css'

import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)

    const { pathname } = useLocation();

    const handleLogout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        logout();

        navigate("/");
    };

    return (
        <header>
            <nav className={styles.navbar}>
                <div>
                    <Link to={user?.role === "admin" ? "/dashboard" : "/drawing-number"} >
                        <img src={infoglobalLogo} alt="infoglobal-logo" className={styles.logoMd} />
                    </Link>
                </div>

                <ul className={styles.navbarUl}>
                    {user?.role === "admin" && (
                        <>
                            <li>
                                <Link to="/dashboard" className={pathname === "/dashboard" ? styles.navActive : {}} >
                                    Dashboard
                                </Link>
                            </li>
                            
                            <li>
                                <Link to="/user" className={pathname === "/user" ? styles.navActive : {}} >
                                    Users
                                </Link>
                            </li>
                        </>
                    )}

                    <li>
                        <Link to="/drawing-number" className={pathname === "/drawing-number" ? styles.navActive : {}} >
                            DN
                        </Link>
                    </li>

                    <li>
                        <Link to="/part-number" className={pathname === "/part-number" ? styles.navActive : {}} >
                            PN
                        </Link>
                    </li>

                    <li>
                        <Link to="/document" className={pathname === "/document" ? styles.navActive : {}} >
                            Document
                        </Link>
                    </li>

                    
                </ul>
                <button className={styles.logoutButton} onClick={handleLogout}>Log Out</button>
            </nav>
        </header>
    )
}

export default Navbar;