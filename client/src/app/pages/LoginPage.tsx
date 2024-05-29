// pages/login.tsx
"use client"; // Add this line at the top
import React, { useState } from "react";
import axios from "axios";
import SweetAlert2 from "react-sweetalert2";
import styles from "../styles/login.module.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from 'mdb-react-ui-kit';
// Input bootstrap
import { Button} from "react-bootstrap";

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

  const handleBackToRegister = () => {
    window.location.href = "/register"; // Navigate to register page
  };

  return (
    <MDBContainer fluid className={styles.backgroundRadialGradient}>
      <nav className="navbar shadow-sm p-3 mb-5 bg-body rounded">
        <div className="container-fluid">
          <span className="navbar-text">
            Welcome to my online shop!
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
          <br></br>
          <br></br>
        </Col>
      </Row>
      <MDBRow className="justify-content-xl-center">
        <Col xs lg="2"></Col>
        <Col xl="auto">
          <div id="radius-shape-1" className={"position-absolute rounded-circle shadow-5-strong"}></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className={styles.bgglass}>
            <MDBCardBody className='p-5'>
              <div className={styles.container4}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
              </div>
              <br></br>
              <br></br>

              <MDBInput
                wrapperClass='mb-4'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                type='text'
                size="sm"
                placeholder="Username"
              />

              <MDBInput
                wrapperClass='mb-4'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password"
                type='password'
                size="sm"
                placeholder="Password"
                required
              />
              <div className={styles.loginContainer}>
                <form onSubmit={handleLogin} className={styles.loginForm}>
                  <div className={styles.container5}>
                    <Button type="submit" variant="success">
                      Login
                    </Button>
                    
                  </div>
                  <br></br>
                  <p className="mb-5 pb-lg-2" onClick={handleBackToRegister} style={{color: '#212F3C'}}>Don't have an account? <a href="#!" style={{color: '#097969'}}>Register here</a></p>
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
            </MDBCardBody>
          </MDBCard>
        </Col>
        <Col xs lg="2"></Col>
      </MDBRow>
    </MDBContainer>
  );
};

export default LoginPage;
