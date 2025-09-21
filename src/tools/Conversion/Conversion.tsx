import styles from "./Conversion.module.css";
import TimestampConversion from "./TimestampConversion";
import Base64Conversion from "./Base64Conversion";

export default function Conversion() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Conversion tools</h2>
      <TimestampConversion />
      <Base64Conversion />
    </div>
  );
}