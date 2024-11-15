"use client";

import React, { useState } from "react";
import Modal from "./common/Modal";

const RegisterLogin = ({ isOpen, onClose, mode, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dynamiskt sätta URL beroende på om vi kör lokalt eller på IP
    const url =
      mode === "register"
        ? `${
            window.location.hostname === "localhost"
              ? "http://localhost:5000"
              : "http://90.143.144.169:5000"
          }/api/auth/register`
        : `${
            window.location.hostname === "localhost"
              ? "http://localhost:5000"
              : "http://90.143.144.169:5000"
          }/api/auth/login`;

    const body = { username, password };
    if (mode === "register") {
      body.email = email;
    }

    try {
      console.log("Sending request to:", url);
      console.log("Request body:", body);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Saving token and user data:", data);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.userId);
        console.log("Token and user data saved to localStorage");

        if (onLoginSuccess) {
          onLoginSuccess(username);
        }
        onClose();
      } else {
        console.error("Error from server:", data.message);
        setErrorMessage(data.message || "Authentication failed.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>{mode === "register" ? "Register" : "Login"}</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
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
        {mode === "register" && (
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
        <button
          type="submit"
          className={mode === "register" ? "registerButton" : "loginButton"}
        >
          {mode === "register" ? "Register" : "Login"}
        </button>
      </form>
    </Modal>
  );
};

export default RegisterLogin;
