"use client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import React from "react";
import axios from "axios";
import ProductsPage from "./pages/ProductsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/loading.css"; // Ensure this file exists and is properly configured
import ProductDetailPage from "./pages/ProductDetailPage";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const checkAuthStatus = () => {
    axios
      .get("http://localhost:3001/users/", { withCredentials: true })
      .then((res) => {
        setIsLoggedIn(true);
        setUser(res.data);
        setLoading(false); // Set loading to false after getting response
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setIsLoggedIn(false);
          setLoading(false); // Set loading to false if not authenticated
        }
      });
  };

  React.useEffect(() => {
    // Initial check
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
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/products"
          element={isLoggedIn ? <ProductsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/product/:id"
          element={
            isLoggedIn ? <ProductDetailPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/"
          element={isLoggedIn ? <ProductsPage /> : <LoginPage />}
        />
      </Routes>
    </Router>
  );
}
