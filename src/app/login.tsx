// pages/login.tsx
"use client"; // Add this line at the top
import React, { useState } from "react";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3001/login",
        { username, password },
        { withCredentials: true }
      );
      console.log("RES: ", res); // "RES: {status: 200, data: {…}, statusText: 'OK', headers: {…}, config: {…}, …}
      if (res.status === 200) {
        const user = await axios.get("http://localhost:3001/users/", {
          withCredentials: true,
        });
        // console.log("USER: ", user.data); // "USER: {status: 200, data: {…}, statusText: 'OK', headers: {…}, config: {…}, …}"
        // redirect
        window.location.href = "/";
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response:", error.response);
        setMessages(error.response.data.messages || ["Login failed"]);
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      {messages.length > 0 && (
        <div>
          {messages.map((msg, index) => (
            <p key={index} style={{ color: "red" }}>
              {msg}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
