import Navbar from "../components/Navbar.jsx"
import styles from "../styles/AdminDashboardPage.module.css"

const AdminDashboardPage = () => {
  return (
    <div className={styles.pageBody}>
      <div className="container">
        <Navbar />
      </div>
    </div>
  )
}

export default AdminDashboardPage