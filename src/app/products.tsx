import React from "react";
import axios from "axios";
import styles from "./styles/products.module.css"; // Ensure this file exists and is properly configured
import Card from "./components/card";

export default function ProductsPage() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/getAllProducts", { withCredentials: true })
      .then((res) => {
        setData(res.data);
        console.log("DATA: ", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {data &&
          data.map((product) => (
            <Card
              key={product.ProductID}
              title={product.Name}
              price={product.Price}
              imgURL={product.ImageURL}
            />
          ))}
      </ul>
    </div>
  );
}
