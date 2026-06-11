import Navbar from "../components/Navbar.jsx"
import styles from "../styles/DocumentPage.module.css"

const DocumentPage = () => {
  return (
    <div className={styles.pageBody}>
      <div className="container">
        <Navbar />
      </div>
    </div>
  )
}

export default DocumentPage