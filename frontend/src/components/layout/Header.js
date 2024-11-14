"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RegisterLogin from '../RegisterLogin';
import styles from '../../styles/Header.module.css';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('register');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const openModal = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  const closeNav = () => {
    setIsNavOpen(false); // Stänger menyn på alla vyer
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    closeNav(); // Stäng menyn efter utloggning
  };

  return (
    <header className={styles.header}>
      <div className={styles.navToggle} onClick={toggleNav}>
        ☰
      </div>
      <nav className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}>
        <Link href="/" passHref>
          <button onClick={closeNav}>Home</button>
        </Link>
        <Link href="/games" passHref>
          <button onClick={closeNav}>Games</button>
        </Link>
        <Link href="/contact" passHref>
          <button onClick={closeNav}>Contact</button>
        </Link>
        <Link href="/about" passHref>
          <button onClick={closeNav}>About</button>
        </Link>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => { openModal('register'); closeNav(); }}>Register</button>
            <button onClick={() => { openModal('login'); closeNav(); }}>Login</button>
          </>
        )}
      </nav>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>BoardArena555</h1>
        <p className={styles.subtitle}>Find and join exciting games in our community.</p>
      </div>
      {isLoggedIn && (
        <div className={styles.userInfo}>
          <p>Logged in as: {username}</p>
        </div>
      )}
      <RegisterLogin
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        onLoginSuccess={(username) => {
          setIsLoggedIn(true);
          setUsername(username);
          setIsModalOpen(false);
        }}
      />
    </header>
  );
};

export default Header;
