import React, { useState } from "react";
import { Button, Modal, InputGroup, FormControl, Form } from "react-bootstrap";
interface PopupCardProps {
  title: string;
  isOpened: boolean;
  onClose: () => void;
  onReloadItems: () => void; // Add onReloadItems prop
}

const PopupCard: React.FC<PopupCardProps> = ({
  title,
  isOpened,
  onClose,
  onReloadItems,
}) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [materials, setMaterials] = useState<string[]>([""]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...materials];
    newMaterials[index] = value;
    setMaterials(newMaterials);
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, ""]);
  };

  const handleRemoveMaterial = (index: number) => {
    const newMaterials = [...materials];
    newMaterials.splice(index, 1);
    setMaterials(newMaterials);
  };

  const handleSubmit = async () => {
    try {
      if (
        !productName ||
        !productPrice ||
        !productDescription ||
        !selectedFile ||
        materials.some((mat) => mat === "")
      ) {
        alert("All fields and image file are required");
        return;
      }

      const formData = new FormData();
      formData.append("nameProduct", productName);
      formData.append("priceProduct", parseFloat(productPrice).toString());
      formData.append("description", productDescription);
      formData.append("size", "Standard");
      materials
        .filter((mat) => mat !== "")
        .forEach((mat, index) => {
          formData.append(`materials[${index}]`, mat);
        });
      formData.append("imgProduct", selectedFile);

      const response = await fetch("http://localhost:3001/addProduct", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Product added successfully!");
        onClose();
        onReloadItems();
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  };

  return (
    <Modal show={isOpened} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="d-flex flex-column gap-3">
        <Form className="d-flex flex-column gap-3">
          <Form.Group className="mb-1">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Label>Product Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter product price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter product description"
              style={{ height: "100px" }}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Label>Product Image</Form.Label>
            <InputGroup>
              <FormControl
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-1">
            <Form.Label>Product Materials</Form.Label>
            {materials.map((material, index) => (
              <InputGroup key={index} className="mb-1">
                <FormControl
                  type="text"
                  placeholder="Enter product material"
                  value={material}
                  onChange={(e) => handleMaterialChange(index, e.target.value)}
                />
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemoveMaterial(index)}
                  style={{ marginLeft: "5px" }}
                >
                  Remove
                </Button>
              </InputGroup>
            ))}
            <Button
              variant="link"
              onClick={handleAddMaterial}
              style={{ marginLeft: "5px" }}
            >
              Add More Material
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Add Product
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopupCard;
