import React from "react";
import { Card } from "react-bootstrap";
import "../styles/CardComponent.css";

interface CardProps {
  id: number;
  title: string;
  price: number;
  imgURL: string;
}

const CardComponent: React.FC<CardProps> = ({ id, title, price, imgURL }) => {
  const serverUrl = "http://localhost:3001";

  return (
    <Card className="custom-card">
      <Card.Img
        variant="top"
        src={`${serverUrl}${imgURL}`} // Ensure this constructs the correct URL
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>${price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CardComponent;
