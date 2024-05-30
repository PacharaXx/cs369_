import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/Product.css";

const ProductsPage = () => {
  const { id } = useParams<{ id: string }>(); // Specify the type for useParams

  // Define the type for the data state
  interface ProductData {
    product: {
      Name: string;
      ImageURL: string;
      Price: number;
    };
    details: {
      Size: string;
      Description: string;
    };
    materials?: string[];
    // Add more properties as needed
  }

  const [data, setData] = useState<ProductData | null>(null); // Initialize with null or default data structure

  // Load data on component mount and when id parameter changes
  useEffect(() => {
    // Function to fetch product details
    const fetchProductDetails = () => {
      axios
        .get(`/api/getProduct/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching product details:", err);
        });
    };

    fetchProductDetails();
  }, [id]);

  const handleLogout = () => {
    axios
      .get("/api/logout", { withCredentials: true })
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Error logging out:", err);
      });
  };

  return (
    <Container className="d-flex flex-wrap gap-3 mt-3">
      <Container className="d-flex flex-wrap gap-3 justify-content-between border-bottom border-2 p-3 w-100">
        <h2>Product Detail</h2>
        {/* Optional: Add a Reload button if needed */}
        <div className="d-flex gap-3 align-items-center">
          <a
            onClick={() => window.history.back()}
            style={{ cursor: "pointer" }}
          >
            Back
          </a>
          <a>|</a>
          <a onClick={() => handleLogout()} style={{ cursor: "pointer" }}>
            Logout
          </a>
        </div>
      </Container>
      <Container className="d-flex flex-wrap gap-3 justify-content-center h-md-70">
        {/* Display product detail components */}
        {data && data.product && (
          <Container className="grid-container border d-flex p-0 m-0 h-md-70">
            <Row className="p-0 m-0 w-100 h-md-70">
              <Col
                md={6}
                className="d-flex p-0 m-0 justify-content-center align-items-center h-100"
              >
                <img
                  src={data.product.ImageURL}
                  alt={data.product.Name}
                  className="product-image"
                />
              </Col>
              <Col
                md={6}
                className="d-flex flex-column justify-content-center align-items-md-start mt-3 mt-md-0"
              >
                <h2>{data.product.Name}</h2>
                <div className="d-flex gap-2 align-items-center">
                  <span className="fw-bold">Materials:</span>
                  {data.materials &&
                    data.materials.map((material) => (
                      <span
                        key={material}
                        className="badge bg-secondary text-wrap"
                      >
                        {material}
                      </span>
                    ))}
                </div>
                <div>
                  <span className="fw-bold">Size: </span>
                  <span>{data.details.Size}</span>
                </div>
                <span className="text-wrap text-break">
                  <span className="fw-bold">Description: </span>
                  {data.details.Description}
                </span>
                <span>
                  <span className="fw-bold">Price:</span>
                  <span> {data.product.Price} ฿</span>
                </span>
                <div className="d-flex gap-3 mt-3 justify-content-center w-100">
                  
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default ProductsPage;
