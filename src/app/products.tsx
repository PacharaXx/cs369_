import React from "react";
import axios from "axios";
import styles from "./styles/products.module.css"; // Ensure this file exists and is properly configured

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
            <div className={styles.card} key={product.id}>
              <img src={product.ImageURL} alt={product.Name} />
              <h2>{product.Name}</h2>
              <p>{product.Price}</p>
            </div>
          ))}
      </ul>
    </div>
  );
}
