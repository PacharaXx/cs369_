import React from "react";
import { Card } from "react-bootstrap";
import "../styles/CardComponent.css";

interface CardProps {
  id: number; // Change key to id
  title: string;
  price: number;
  imgURL: string;
}

const CardComponent: React.FC<CardProps> = ({ id, title, price, imgURL }) => {
  return (
    <Card className="custom-card">
      <Card.Img variant="top" src={imgURL} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>${price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CardComponent;
