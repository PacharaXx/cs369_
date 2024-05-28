import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";

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
        .get(`${process.env.API_URL}:3001/getProduct/${id}`, {
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
      .get(process.env.API_URL + ":3001/logout", { withCredentials: true })
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Error logging out:", err);
      });
  };

  return (
    <Container className="d-flex flex-wrap gap-3 mt-3">
      <Container className="d-flex flex-column gap-3 justify-content-center align-items-center">
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
        <Container className="d-flex flex-wrap gap-3">
          {/* Display product detail components */}
          {data && data.product && (
            <Container className="d-flex flex-column gap-3 justify-content-center align-items-center">
              <h3>{data.product.Name}</h3>
              <img src={data.product.ImageURL} alt={data.product.Name} />
              <p>Price: {data.product.Price}</p>
              <p>{data.details.Size}</p>
              {data.materials &&
                data.materials.map((material) => (
                  <p key={material}>{material}</p>
                ))}
              <p>{data.details.Description}</p>
              {/* Add more details as needed */}
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  );
};

export default ProductsPage;
