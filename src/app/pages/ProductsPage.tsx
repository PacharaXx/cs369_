import React from "react";
import axios from "axios";
import CardComponent from "../components/CardComponent";
import PopupCard from "../components/PopupCard";
import { Button } from "react-bootstrap";

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

  React.useEffect(() => {
    reLoadHandler();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <Button onClick={() => setIsOpened(true)}>Open Popup</Button>
      <PopupCard
        title="Product 1"
        isOpened={isOpened}
        onClose={() => setIsOpened(false)} // Pass the onClose prop
        onReloadItems={() => {
          reLoadHandler();
          setIsOpened(false);
        }} // Pass the onReloadItems prop
      />
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
              key={product.ProductID}
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
