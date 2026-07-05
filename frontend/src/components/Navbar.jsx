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
    // console.log("Zustand User:", user);

    // console.log(
    //     "LocalStorage User:",
    //     JSON.parse(localStorage.getItem("user"))
    // );

    return (
        <nav className={styles.navbar}>
                <div>
                    <Link to="/home">
                        <img src={infoglobalLogo} alt="infoglobal-logo" className={styles.logoMd} />
                    </Link>
                </div>

                <ul className={styles.navbarUl}>
                    <li>
                        <Link to="/home" className={pathname === "/home" ? styles.navActive : {}} >
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link to="/part-number" className={pathname === "/part-number" ? styles.navActive : {}} >
                            PN
                        </Link>
                    </li>

                    <li>
                        <Link to="/drawing-number" className={pathname === "/drawing-number" ? styles.navActive : {}} >
                            DN
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
    )
}

export default Navbar;