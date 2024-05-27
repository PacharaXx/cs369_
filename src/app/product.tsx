import React from "react";
import axios from "axios";

export default function ProductPage() {
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
            <li key={product.ProductID}>
              {product.Name} - {product.Price}
            </li>
          ))}
      </ul>
    </div>
  );
}
