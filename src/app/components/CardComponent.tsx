import React from "react";
import { Card } from "react-bootstrap";
interface CardProps {
  key: number;
  title: string;
  price: number;
  imgURL: string;
}

const CardComponent: React.FC<CardProps> = ({ key, title, price, imgURL }) => {
  return (
    <Card className="card" key={key}>
      <Card.Img variant="top" src={imgURL} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>${price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CardComponent;
