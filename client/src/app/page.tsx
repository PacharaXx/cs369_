"use client";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/loading.css"; // Ensure this file exists and is properly configured
import RegisterPage from "./pages/Register";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("/api/users/", {
        withCredentials: true,
      });
      setIsLoggedIn(true);
      setUser(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsLoggedIn(false);
      } else {
        console.error("Error fetching user data:", error);
        // Handle other errors as needed
      }
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };
  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/product/">
          <Route
            path=":id"
            element={isLoggedIn ? <ProductDetailPage /> : <LoginPage />}
          />
        </Route>
        <Route
          path="/"
          element={isLoggedIn ? <ProductsPage /> : <LoginPage />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
