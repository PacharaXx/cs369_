import React from "react";
import "../styles/card.css";

interface CardProps {
  key: number;
  title: string;
  price: number;
  imgURL: string;
}

const Card: React.FC<CardProps> = ({ key, title, price, imgURL }) => {
  return (
    <div className="card" key={key}>
      <img src={imgURL} alt={title} />
      <h2>{title}</h2>
      <p>{price}</p>
    </div>
  );
};

export default Card;
