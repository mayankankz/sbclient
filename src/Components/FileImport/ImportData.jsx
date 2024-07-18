import React, { useState } from "react";
import { Modal, Container, ModalHeader, ModalBody } from "reactstrap";
import { Button, Select } from "antd";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import axios from "axios";
import { apiUrl } from "../../utils/constant";
import { toast } from "react-toastify";


const { Option } = Select;

const ImportExcelModal = ({
  open,
  onClose,
  schools,
  classes
}) => {
  console.log(open, onClose, schools,classes);
  const [file, setFile] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("school", selectedSchool);
    formData.append("class", selectedClass);

    try {
      await axios.post(`${apiUrl}/auth/import-excel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("data Imported successfully.");
      setFile(null);
      setSelectedSchool(null);
      onClose();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Modal isOpen={open} toggle={onClose} centered>
      <ModalHeader>Import Excel File</ModalHeader>
      <ModalBody style={{minWidth: '500px'}}>
        <Container>
          <Select
            placeholder="Select School"
            style={{ width: "100%", marginBottom: "20px" }}
            value={selectedSchool}
            onChange={(value) => setSelectedSchool(value)}
            allowClear
          >
            <Option value="">Select School</Option>
            {schools.map((school) => (
              <Option key={school.schoolcode} value={school.schoolcode}>
                {school.schoolname}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Class"
            style={{ width: "100%", marginBottom: "20px" }}
            value={selectedClass}
            onChange={(value) => setSelectedClass(value)}
            allowClear
          >
            <Option value="">Select Class</Option>
            {classes.map((classs) => (
           
              <Option key={classs} value={classs}>
                {classs}
              </Option>
            ))}
          </Select>

          <Container
            style={{
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #000",
                padding: "20px",
                width: "100%",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <input {...getInputProps()} />
              {file ? <p>Selected file: {file.name}</p> : <p>Drag 'n' drop an Excel file here, or click to select a file</p>}
              </div>

            <Button
            type="primary"
              onClick={handleUpload}
              disabled={!file || !selectedSchool || !selectedClass}
            >
              Upload
            </Button>
          </Container>
        </Container>
      </ModalBody>
    </Modal>
  );
};

export default ImportExcelModal;
