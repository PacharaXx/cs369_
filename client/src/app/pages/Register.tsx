// pages/register.tsx
"use client"; // Add this line at the top
import React, { useState } from "react";
import axios from "axios";
import SweetAlert2 from "react-sweetalert2";
import styles from "../styles/login.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { Button } from "react-bootstrap";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setStatus(false);
      setMessages(["Passwords do not match"]);
      return;
    }

    try {
      const res = await axios.post(
        "/api/register",
        { username, email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        window.location.href = "/login"; // Redirect to login page upon successful registration
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error response:", error.response);
          setStatus(false);
          setMessages([error.response.data]); // Assuming your server sends an array of error messages
        } else {
          console.error("Network Error:", error.message);
          setStatus(false);
          setMessages(["Network Error"]); // Handle network errors
        }
      } else {
        console.error("Unexpected Error:", (error as Error).message);
        setStatus(false);
        setMessages(["Unexpected Error"]); // Handle unexpected errors
      }
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "/login"; // Navigate to login page
  };

  return (
    <MDBContainer fluid className={styles.backgroundRadialGradient}>
      <nav className="navbar shadow-sm p-3 mb-5 bg-body rounded">
        <div className="container-fluid">
          <span className="navbar-text">
            "Experience new ways of online shopping"
          </span>
        </div>
      </nav>

      <Row>
        <Col>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </Col>
      </Row>

      <MDBRow className="justify-content-xl-center">
        <Col xs lg="2"></Col>
        <Col xl="auto">
          <MDBCard className={styles.bgglass}>
            <MDBCardBody className="p-5">
              <div className={styles.container5}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  fill="currentColor"
                  className="bi bi-person-add"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                </svg>
              </div>
              <br></br>
              <br></br>

              <MDBInput
                wrapperClass="mb-4"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                type="text"
                size="sm"
                placeholder="Username"
              />
              <MDBInput
                wrapperClass="mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                size="sm"
                placeholder="E-mail"
              />
              <MDBInput
                wrapperClass="mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                size="sm"
                placeholder="Password"
                required
              />
              <MDBInput
                wrapperClass="mb-4"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                type="password"
                size="sm"
                placeholder="Confirm Password"
                required
              />
              <div className={styles.loginContainer}>
                <form onSubmit={handleRegister} className={styles.loginForm}>
                  <div className={styles.container5}>
                    <Button type="submit" variant="success">
                      Register
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleBackToLogin}
                      style={{ marginLeft: "10px" }}
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
                {/* Display error alert */}
                {!status && (
                  <SweetAlert2
                    show={!status}
                    title="Error"
                    text={messages.join(", ")}
                    icon="error"
                    onConfirm={() => setStatus(true)}
                  />
                )}
              </div>
            </MDBCardBody>
          </MDBCard>
        </Col>
        <Col xs lg="2"></Col>
      </MDBRow>
    </MDBContainer>
  );
};

export default RegisterPage;
