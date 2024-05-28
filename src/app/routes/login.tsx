// pages/login.tsx
"use client"; // Add this line at the top
import React, { useState } from "react";
import axios from "axios";
import SweetAlert2 from "react-sweetalert2";
import styles from "./styles/login.module.css"; // Ensure this file exists and is properly configured

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3001/login",
        { username, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        const user = await axios.get("http://localhost:3001/users/", {
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
    </div>
  );
};

export default LoginPage;
