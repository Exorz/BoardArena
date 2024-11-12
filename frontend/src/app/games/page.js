// pages/games/page.js
"use client";
import styles from '../../styles/games.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function GamesPage() {
  const games = [
    { name: 'Battleships', image: '/img/games/battleships.webp' },
    { name: 'Yatzy', image: '/img/games/yatzy.webp' },
    { name: 'Blockwars', image: '/img/games/blockwars.webp' },
    { name: 'Chess', image: '/img/games/chess.webp' },
    { name: 'Four in a Row', image: '/img/games/fourinarow.webp' },
    { name: 'Hearts', image: '/img/games/hearts.webp' },
    { name: 'Ludo', image: '/img/games/ludo.webp' },
    { name: 'Spades', image: '/img/games/spades.webp' },
    { name: 'Tic Tac Toe', image: '/img/games/tictactoe.webp' },
  ];

  return (
    <main className={styles.games}>
      <h2>Games</h2>
      <div className={styles.gameList}>
        {games.map((game, index) => (
          <div key={index} className={styles.gameCard}>
            <Image src={game.image} alt={game.name} width={180} height={180} className={styles.gameImage} />
            <Link href={`/games/${game.name}`}>
              <button>Play {game.name}</button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
