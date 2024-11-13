// /src/app/about/page.js
"use client";
import styles from '../../styles/about.module.css';

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to BoardArena</h1>
        <p className={styles.content}>
          Welcome to <strong>BoardArena</strong>, the ultimate destination for online board games! Whether you're a casual player looking to have some fun or a competitive gamer aiming to dominate the leaderboards, BoardArena is the place for you. Our platform offers an exciting and immersive experience where you can join game lobbies, connect with friends, and challenge opponents from around the world.
        </p>
        <p className={styles.content}>
          At BoardArena, we believe in creating a community where players of all skill levels can come together, share their passion for games, and compete in a friendly, supportive environment. From classic board games to new favorites, our game lobbies provide the perfect setting for hours of fun, strategy, and camaraderie.
        </p>
        <p className={styles.content}>
          Join us today, earn your crowns, and see if you have what it takes to claim the best crown in the arena! hej
        </p>
      </div>
    </main>
  );
}
