// /src/app/page.js
"use client";
import styles from '../styles/Home.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>News</h1>
        <p className={styles.content}>
          {/* Här kan vi lägga till nyheter senare */}
          No news at the moment
        </p>
      </div>
    </main>
  );
}
