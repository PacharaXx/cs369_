"use client"; // Add this line at the top

import LoginPage from "./login";
import React from "react";
import axios from "axios";
import ProductPage from "./product";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/users/", { withCredentials: true })
      .then((res) => {
        setIsLoggedIn(true);
        setUser(res.data);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setIsLoggedIn(false);
        }
      });
  }, []);

  return <div>{isLoggedIn ? <ProductPage /> : <LoginPage />}</div>;
}
