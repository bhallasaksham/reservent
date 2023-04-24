import { Badge } from "react-bootstrap";
import styles from "./CustomBadge.module.css";
import { XLg } from "react-bootstrap-icons";

export const CustomBadge = ({ content, deleteContent }) => {
  return (
    <Badge className={styles["custom-badge"]} bg="light" pill>
      <span>{content}</span>
      <XLg className={styles["close-icon"]} onClick={deleteContent} />
    </Badge>
  );
};
