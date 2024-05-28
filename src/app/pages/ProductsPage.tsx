import React from "react";
import axios from "axios";
import CardComponent from "../components/CardComponent";

export default function ProductsPage() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("http://localhost:3001/getAllProducts", { withCredentials: true })
      .then((res) => {
        setData(res.data);
        // console.log("DATA: ", res.data);
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
          (
            data as Array<{
              ProductID: number;
              Name: string;
              Price: number;
              ImageURL: string;
            }>
          ).map((product) => (
            <CardComponent
              key={product.ProductID} // Add key prop here
              id={product.ProductID}
              title={product.Name}
              price={product.Price}
              imgURL={product.ImageURL}
            />
          ))}
      </ul>
    </div>
  );
}
