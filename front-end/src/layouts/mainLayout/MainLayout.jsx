import styles from "./MainLayout.module.css";
import { Header, Footer } from "../../components";

export const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className={styles["page-content"]}>{children}</div>
      <Footer />
    </div>
  );
};
