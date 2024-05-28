import React from 'react';
import { useParams } from 'react-router-dom';

const ProductsPage = () => {
  const { id } = useParams();

  // Use the id parameter as needed
  return (
    <div>
      <h1>Product Detail</h1>
      <p>Product ID: {id}</p>
      {/* Additional logic to fetch and display product details */}
    </div>
  );
};

export default ProductsPage;
