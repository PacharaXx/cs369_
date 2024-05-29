// pages/login.tsx
"use client"; // Add this line at the top
import React, { useState } from "react";
import axios from "axios";
import SweetAlert2 from "react-sweetalert2";
import styles from "../styles/login.module.css"; // Ensure this file exists and is properly configured
// Input bootstrap
import { Form, Button } from "react-bootstrap";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        process.env.API_URL + "/api/login",
        { username, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        const user = await axios.get(process.env.API_URL + "/api/users", {
          withCredentials: true,
        });
        window.location.href = "/";
        setStatus(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response);
        setStatus(false);
        setMessages(error.response.data.messages || ["Login failed"]);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <Form.Control
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <Form.Control
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <Button type="submit" variant="primary">
            Login
          </Button>
        </div>
      </form>
      {status === false && (
        <SweetAlert2
          show={!status}
          title="Error"
          text={messages.join(", ")}
          icon="error"
          onConfirm={() => setStatus(true)}
        />
      )}
    </div>
  );
};

export default LoginPage;
