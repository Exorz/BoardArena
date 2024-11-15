"use client";

import React, { useState } from 'react';
import Modal from './common/Modal';

const RegisterLogin = ({ isOpen, onClose, mode, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Här använder vi miljövariabeln NEXT_PUBLIC_BACKEND_URL för att dynamiskt få rätt URL
    const url =
      mode === 'register'
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`;

    const body = {
      username,
      password,
    };

    if (mode === 'register') {
      body.email = email;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`${mode} successful`, data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      if (onLoginSuccess) {
        onLoginSuccess(username);
      }
      onClose();
    } else {
      console.error('Error:', data.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {mode === 'register' && (
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={mode === 'register' ? 'registerButton' : 'loginButton'}>
          {mode === 'register' ? 'Register' : 'Login'}
        </button>
      </form>
    </Modal>
  );
};

export default RegisterLogin;
