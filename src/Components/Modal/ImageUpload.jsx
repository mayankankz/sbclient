import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";
import { apiUrl } from "../../utils/constant";
import "./imageModel.css";
import { DeleteOutline } from "@mui/icons-material";
const ImageUploadModal = ({ isOpen, toggle, addElement }) => {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/images`);
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);
  const deleteImage = (fileName) => {
    fetch(`${apiUrl}/api/images/${fileName}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete image');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);
        // Optionally, refresh the image list after deletion
        fetchImages();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const handleImageUpload = async (event) => {
    const formData = new FormData();
    formData.append("image", event.target.files[0]);

    try {
      await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchImages(); // Refresh the image list after upload
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  function handleClick(type, url) {
    addElement(type, url);
    toggle();
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Upload Images</ModalHeader>
      <ModalBody style={{ minHeight: "500px" }}>
        <Form className="mb-5 w-50">
          <FormGroup>
            <Input
              type="file"
              name="file"
              id="imageUpload"
              onChange={handleImageUpload}
            />
          </FormGroup>
        </Form>
        <div className="image-preview d-flex gap-4 flex-wrap mt-5 ">
          {images.map((image, index) => (
            <>
            <div style={{width: 120, height: 120}}>
            <img
              onClick={() => handleClick("image", image.filePath)}
              style={{ border: "1px dotted black", padding: "10px",width: "100%", height: "100%"}}
             
              key={index}
              src={image.filePath}
              alt={`upload-${index}`}
              className="uploaded-image"
            />
            <div className="d-flex justify-content-between" style={{maxWidth: '120px'}}>
            <p style={{fontSize: 10}}>{image.fileName.slice(0,15) + "..."}</p>
            <DeleteOutline fontSize="25px" onClick={() => deleteImage(image.fileName)} />
            </div>
            </div>
            </>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ImageUploadModal;
