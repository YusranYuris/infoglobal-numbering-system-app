import { useEffect } from "react";
import Navbar from "../components/Navbar.jsx"
import { useHomeStore } from "../store/useHomeStore.js"
import styles from "../styles/HomePage.module.css"
import { Link } from "react-router-dom";

const HomePage = () => {
  const {
    loading,
    error,

    partNumberUnitsCount,
    partNumberModulesCount,
    drawingNumbersCount,
    documentsCount,

    fetchData
  } = useHomeStore();

  useEffect(() => {
    fetchData();
  }, [fetchData])

  return (
    <div className={styles.pageBody}>
      {/* NAVBAR */}
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.titleSection}>
          Data Summary
        </h1>
        
        {loading ? (
          <span className={styles.spinner}></span>
        ) : (
          <div className={styles.dataArea}>
          <Link to="/part-number">
            <div className={styles.dataCard}>
              <div className={styles.cardTitle}>
                Part Number (Unit)
              </div>
              <div className={styles.dataCount}>
                {partNumberUnitsCount}
              </div>
            </div>
          </Link>
          
          <Link to="/part-number">
            <div className={styles.dataCard}>
              <div className={styles.cardTitle}>
                Part Number (Modul)
              </div>
              <div className={styles.dataCount}>
                {partNumberModulesCount}
              </div>
          </div>
          </Link>

          <Link to="/drawing-number">
            <div className={styles.dataCard}>
              <div className={styles.cardTitle}>
                Drawing Number
              </div>
              <div className={styles.dataCount}>
                {drawingNumbersCount}
              </div>
            </div>
          </Link>
          

          <Link to="/document">
            <div className={styles.dataCard}>
              <div className={styles.cardTitle}>
                Document Number
              </div>
              <div className={styles.dataCount}>
                {documentsCount}
              </div>
            </div>
          </Link>
        </div>
        )};
      </div>
    </div>
  )
}

export default HomePage