import styles from '../../styles/Lobby.module.css';

export default function TableComponent() {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.seatsContainer}>
        <button className={`${styles.seatButton} ${styles['top-center']}`} />
        <button className={`${styles.seatButton} ${styles['right-center']}`} />
        <button className={`${styles.seatButton} ${styles['bottom-center']}`} />
        <button className={`${styles.seatButton} ${styles['left-center']}`} />
      </div>
    </div>
  );
}
