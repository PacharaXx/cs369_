import React from "react";
import axios from "axios";
import CardComponent from "../components/CardComponent";
import PopupCard from "../components/PopupCard";
import { Button, Container } from "react-bootstrap";

export default function ProductsPage() {
  const [data, setData] = React.useState(null);
  const [isOpened, setIsOpened] = React.useState(false);

  const reLoadHandler = () => {
    axios
      .get("http://localhost:3001/getAllProducts", { withCredentials: true })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLogout = () => {
    axios
      .get("http://localhost:3001/logout", { withCredentials: true })
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.error("Error logging out:", err);
      });
  };

  React.useEffect(() => {
    reLoadHandler();
  }, []);

  return (
    <Container className="d-flex flex-wrap gap-3 mt-3">
      <Container className="d-flex flex-column gap-3 justify-content-center align-items-center">
        <Container className="d-flex flex-wrap gap-3 justify-content-between border-bottom border-2 p-3 w-100">
          <h2>Product List</h2>
          <div className="d-flex gap-3 align-items-center">
            <a onClick={() => setIsOpened(true)} style={{ cursor: "pointer" }}>
              Add Product
            </a>
            <a>|</a>
            <a onClick={() => handleLogout()} style={{ cursor: "pointer" }}>
              Logout
            </a>
          </div>
        </Container>

        <Container className="d-flex flex-wrap gap-3">
          {data &&
            (
              data as Array<{
                ProductID: number;
                Name: string;
                Price: number;
                ImageURL: string;
              }>
            ).map((product) => (
              <CardComponent
                key={product.ProductID}
                id={product.ProductID}
                title={product.Name}
                price={product.Price}
                imgURL={product.ImageURL}
              />
            ))}
        </Container>
      </Container>
      <PopupCard
        title="Add New Product"
        isOpened={isOpened}
        onClose={() => setIsOpened(false)} // Pass the onClose prop
        onReloadItems={() => {
          reLoadHandler();
          setIsOpened(false);
        }} // Pass the onReloadItems prop
      />
    </Container>
  );
}
