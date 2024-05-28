import React from "react";
import { Card } from "react-bootstrap";
import "../styles/CardComponent.css";
import { Link } from "react-router-dom";

interface CardProps {
  id: number;
  title: string;
  price: number;
  imgURL: string;
}

const CardComponent: React.FC<CardProps> = ({ id, title, price, imgURL }) => {
  const serverUrl = "http://localhost:3001";

  return (
    <Link to={`/product/${id}`} className="custom-card-link">
      <Card className="custom-card" key={id}>
        <Card.Img
          variant="top"
          className="custom-card-img"
          src={`${serverUrl}${imgURL}`} // Ensure this constructs the correct URL
        />
        <Card.Body className="custom-card-body">
          <Card.Title>{title}</Card.Title>
          <Card.Text>${price}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CardComponent;
